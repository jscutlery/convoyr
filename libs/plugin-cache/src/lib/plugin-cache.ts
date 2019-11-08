import {
  HandlerArgs,
  HttpExtPlugin,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/core';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';

import { _applyMetadata, ResponseOrCacheResponse } from './add-cache-metadata';
import { MemoryAdapter } from './store-adapters/memory-adapter';
import { StoreAdapter } from './store-adapters/store-adapter';
import { toString } from './to-string';

export interface CachePluginOptions {
  addCacheMetadata: boolean;
  storeAdapter: StoreAdapter;
}

export function cachePlugin({
  addCacheMetadata = false,
  storeAdapter = new MemoryAdapter()
}: Partial<CachePluginOptions> = {}): HttpExtPlugin {
  return new CachePlugin({ addCacheMetadata, storeAdapter });
}

export class CachePlugin implements HttpExtPlugin {
  private _addCacheMetadata: boolean;
  private _storeAdapter: StoreAdapter;

  constructor({ addCacheMetadata, storeAdapter }: CachePluginOptions) {
    this._storeAdapter = storeAdapter;
    this._addCacheMetadata = addCacheMetadata;
  }

  handle({ request, next }: HandlerArgs): Observable<ResponseOrCacheResponse> {
    const fromNetwork$ = next({ request }).pipe(
      tap(response => this._store(request, response)),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => {
      const response = this._load(request);
      return response ? of(response) : EMPTY;
    }).pipe(takeUntil(fromNetwork$));

    const addCacheMetadata = this._addCacheMetadata;

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to fromNetwork$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If fromNetwork$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      _applyMetadata({
        source$: fromNetwork$,
        addCacheMetadata,
        isFromCache: false
      }),
      _applyMetadata({
        source$: fromCache$,
        addCacheMetadata,
        isFromCache: true
      })
    );
  }

  private _store(request: HttpExtRequest, response: HttpExtResponse): void {
    this._storeAdapter.set(
      this._getStoreKey(request),
      JSON.stringify(response)
    );
  }

  private _load(request: HttpExtRequest): ResponseOrCacheResponse | null {
    const data = this._storeAdapter.get(this._getStoreKey(request));
    return data ? JSON.parse(data) : null;
  }

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
