import {
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { defer, EMPTY, iif, merge, Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { applyMetadata } from './apply-metadata';
import { HttpExtCacheResponse, ResponseAndCacheMetadata } from './metadata';
import { StorageAdapter } from './store-adapters/storage-adapter';
import { addDays } from './utils/add-days';

export interface HandlerOptions {
  ttl: string | null;
  addCacheMetadata: boolean;
  storage: StorageAdapter;
}

export class CacheHandler implements PluginHandler {
  private _addCacheMetadata: boolean;
  private _storage: StorageAdapter;
  private _ttl: string | null;

  constructor({ addCacheMetadata, storage, ttl }: HandlerOptions) {
    this._storage = storage;
    this._addCacheMetadata = addCacheMetadata;
    this._ttl = ttl;
  }

  handle({
    request,
    next
  }: PluginHandlerArgs): Observable<HttpExtResponse | HttpExtCacheResponse> {
    const fromNetwork$ = next({ request }).pipe(
      tap(response => this._store(request, response)),
      map(response => ({ response })),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => this._load(request)).pipe(
      mergeMap(cacheData => (cacheData ? of(cacheData) : EMPTY)),
      takeUntil(fromNetwork$)
    );

    const addCacheMetadata = this._addCacheMetadata;

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to fromNetwork$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If fromNetwork$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      applyMetadata({
        source$: fromNetwork$,
        addCacheMetadata
      }),
      applyMetadata({
        source$: fromCache$,
        addCacheMetadata
      })
    );
  }

  /* Store metadata belong cache if configuration tells so. */
  private _store(request: HttpExtRequest, response: HttpExtResponse): void {
    const cache: ResponseAndCacheMetadata = {
      response,
      cacheMetadata: {
        createdAt: this._createCacheDate(),
        ttl: this._ttl
      }
    };

    this._storage.set(this._getCacheKey(request), JSON.stringify(cache));
  }

  private _createCacheDate(): string {
    return new Date().toISOString();
  }

  private _checkCacheIsExpired(expireAt: Date): boolean {
    return new Date() >= expireAt;
  }

  private _getCacheExpiredAt(createdAt: string, ttl: number) {
    return addDays(new Date(createdAt), ttl);
  }

  /* @todo maybe there is better moment to check the cache ? */
  private _load(request: HttpExtRequest): Observable<ResponseAndCacheMetadata> {
    return this._storage.get(this._getCacheKey(request)).pipe(
      map<string, ResponseAndCacheMetadata>(cache =>
        cache ? JSON.parse(cache) : null
      ),
      mergeMap(cache =>
        iif(
          () => cache != null,
          this._checkCacheExpiration(request, cache),
          EMPTY
        )
      )
    );
  }

  private _checkCacheExpiration(
    request: HttpExtRequest,
    cache: ResponseAndCacheMetadata
  ): Observable<ResponseAndCacheMetadata> {
    return defer(() => {
      if (this._ttl === null) {
        return of(cache);
      }

      const { ttl, createdAt } = cache.cacheMetadata;
      const UNIT_POS = ttl.length - 1;

      const parsedTll = parseInt(ttl.substring(0, UNIT_POS), 10);
      const unit = ttl[UNIT_POS];

      // @todo handle errors for both units and ttl value

      // if (!Number.isInteger(parsedTll)) {
      //   throw invalidTtlError()
      // }

      // @todo make it work with m h d
      const expireAt = this._getCacheExpiredAt(createdAt, parsedTll);

      /* In case cache is expired clear it. */
      if (this._checkCacheIsExpired(expireAt)) {
        this._storage.unset(this._getCacheKey(request));
        return EMPTY;
      }

      return of(cache);
    });
  }

  /* Create a unique key by request URI to retrieve cache later. */
  private _getCacheKey(request: HttpExtRequest): string {
    const { params } = request;
    const hasParams = Object.keys(params).length > 0;

    /* Note that JSON.stringify is used to avoid browser `encodeURIComponent()` */
    return request.url + (hasParams ? JSON.stringify(request.params) : '');
  }
}
