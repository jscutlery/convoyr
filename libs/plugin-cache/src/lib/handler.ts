import {
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { applyMetadata } from './apply-metadata';
import { HttpExtCacheResponse, ResponseAndCacheMetadata } from './metadata';
import { StorageAdapter } from './store-adapters/storage-adapter';
import { invalidTtlError, parseTtl, parseTtlUnit, TtlUnit } from './ttl';
import { addDays, addHours, addMinutes } from './utils/date';

export interface HandlerOptions {
  ttl: string | null;
  addCacheMetadata: boolean;
  storage: StorageAdapter;
}

export class CacheHandler implements PluginHandler {
  private _addCacheMetadata: boolean;
  private _storage: StorageAdapter;
  private _ttl: number | null = null;
  private _ttlUnit: TtlUnit | null = null;

  constructor({ addCacheMetadata, storage, ttl }: HandlerOptions) {
    this._storage = storage;
    this._addCacheMetadata = addCacheMetadata;
    this._ttl = parseTtl(ttl);
    this._ttlUnit = parseTtlUnit(ttl);
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

    const fromCache$ = defer(() => this._loadCache(request)).pipe(
      mergeMap(this._checkCacheValidity(request)),
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

  /* Store metadata belong cache. */
  private _store(request: HttpExtRequest, response: HttpExtResponse): void {
    const cache: ResponseAndCacheMetadata = {
      response,
      cacheMetadata: {
        createdAt: this._createCacheDate()
      }
    };

    this._storage.set(this._getCacheKey(request), JSON.stringify(cache));
  }

  /* Load cache and check its validity. */
  private _loadCache(
    request: HttpExtRequest
  ): Observable<ResponseAndCacheMetadata> {
    return this._storage
      .get(this._getCacheKey(request))
      .pipe(mergeMap(cache => (cache ? of(JSON.parse(cache)) : EMPTY)));
  }

  /* Clear cache if expired */
  private _clearCacheIfInvalid(request: HttpExtRequest) {
    return (isCacheValid: boolean): void => {
      if (!isCacheValid) {
        this._storage.unset(this._getCacheKey(request));
      }
    };
  }

  /* Check wether cache is valid or not. */
  private _checkCacheValidity(request: HttpExtRequest) {
    return (
      cache: ResponseAndCacheMetadata
    ): Observable<ResponseAndCacheMetadata> =>
      defer(() => {
        /* If no ttl set cache is always valid */
        if (this._ttl === null) {
          return of(true);
        }

        /* Ttl given so check its validity */
        const { createdAt } = cache.cacheMetadata;
        if (this._isCacheExpired(new Date(createdAt))) {
          return of(false);
        }

        return of(true);
      }).pipe(
        tap(this._clearCacheIfInvalid(request)),
        mergeMap(isCacheValid => (isCacheValid ? of(cache) : EMPTY))
      );
  }

  private _createCacheDate(): string {
    return new Date().toISOString();
  }

  private _isCacheExpired(createdAt: Date): boolean {
    const unit = this._ttlUnit;
    const ttl = this._ttl;
    const expireAt = this._getCacheExpiredAt({ createdAt, ttl, unit });

    return new Date() >= expireAt;
  }

  /* Retrieve expiration date from cache creation date and ttl */
  private _getCacheExpiredAt({
    createdAt,
    ttl,
    unit
  }: {
    createdAt: Date;
    ttl: number;
    unit: TtlUnit;
  }): Date {
    switch (unit) {
      case 'd':
        return addDays(ttl, createdAt);
      case 'h':
        return addHours(ttl, createdAt);
      case 'm':
        return addMinutes(ttl, createdAt);
      default:
        throw invalidTtlError(ttl);
    }
  }

  /* Create a unique key by request URI to retrieve cache later. */
  private _getCacheKey(request: HttpExtRequest): string {
    const { params } = request;
    const hasParams = Object.keys(params).length > 0;

    /* Note that JSON.stringify is used to avoid browser only `encodeURIComponent()` */
    return request.url + (hasParams ? JSON.stringify(request.params) : '');
  }
}
