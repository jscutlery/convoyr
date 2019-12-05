import {
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { EMPTY, merge, Observable, of, defer } from 'rxjs';
import { map, mergeMap, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { applyMetadata } from './apply-metadata';
import { HttpExtCacheResponse, ResponseAndCacheMetadata } from './metadata';
import { StorageAdapter } from './store-adapters/storage-adapter';
import { toString } from './to-string';

export interface HandlerOptions {
  addCacheMetadata: boolean;
  storage: StorageAdapter;
}

export class CacheHandler implements PluginHandler {
  private _addCacheMetadata: boolean;
  private _storage: StorageAdapter;

  constructor({ addCacheMetadata, storage }: HandlerOptions) {
    this._storage = storage;
    this._addCacheMetadata = addCacheMetadata;
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

  /* Store metadata belong cache if configuration tells so */
  private _store(request: HttpExtRequest, response: HttpExtResponse): void {
    const cache: ResponseAndCacheMetadata = {
      response,
      cacheMetadata: { createdAt: new Date().toISOString() }
    };

    this._storage.set(this._getStoreKey(request), JSON.stringify(cache));
  }

  private _load(
    request: HttpExtRequest
  ): Observable<ResponseAndCacheMetadata | null> {
    return this._storage
      .get(this._getStoreKey(request))
      .pipe(map(cacheData => (cacheData ? JSON.parse(cacheData) : null)));
  }

  /* Create a unique key by request URI to retrieve cache later. */
  private _getStoreKey(request: HttpExtRequest): string {
    let key = request.url;

    const queryParams = Object.entries(request.params);
    if (queryParams.length > 0) {
      const suffix = queryParams.map(toString).join('_');
      key += suffix;
    }

    return key;
  }
}
