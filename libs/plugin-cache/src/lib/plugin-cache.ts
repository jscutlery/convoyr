import { HandlerArgs, HttpExtPlugin } from '@http-ext/http-ext';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';

import { _applyMetadata, ResponseOrCacheResponse } from './add-cache-metadata';
import { CacheProvider } from './provider';
import { MemoryCacheProvider } from './providers/memory-provider';

export interface CachePluginOptions {
  addCacheMetadata: boolean;
  cacheProvider: CacheProvider;
}

export function cachePlugin({
  addCacheMetadata = false,
  cacheProvider = new MemoryCacheProvider()
}: Partial<CachePluginOptions> = {}): HttpExtPlugin {
  return new CachePlugin({ addCacheMetadata, cacheProvider });
}

export class CachePlugin implements HttpExtPlugin {
  private _addCacheMetadata: boolean;
  private _cacheProvider: CacheProvider;

  constructor({ addCacheMetadata, cacheProvider }: CachePluginOptions) {
    this._cacheProvider = cacheProvider;
    this._addCacheMetadata = addCacheMetadata;
  }

  handle({ request, next }: HandlerArgs): Observable<ResponseOrCacheResponse> {
    const fromNetwork$ = next({ request }).pipe(
      tap(response => {
        this._cacheProvider.set(request.url, response);
      }),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => {
      const response = this._cacheProvider.get(request.url);
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
}
