import {
  createResponse,
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import {
  map,
  mergeMap,
  shareReplay,
  switchMapTo,
  takeUntil
} from 'rxjs/operators';

import { CacheEntry, createCacheEntry, isExpired } from './cache-entry';
import {
  createCacheMetadata,
  createEmptyCacheMetadata
} from './cache-metadata';
import { HttpExtCacheResponse, WithCacheMetadata } from './cache-response';
import { StorageAdapter } from './storage-adapters/storage-adapter';
import { parseMaxAge } from './utils/parse-max-age';

export interface HandlerOptions {
  addCacheMetadata: boolean;
  storage: StorageAdapter;
  maxAge?: string;
}

export class CacheHandler implements PluginHandler {
  private _shouldAddCacheMetadata: boolean;
  private _storage: StorageAdapter;
  private _maxAgeMilliseconds?: number;

  constructor({ addCacheMetadata, storage, maxAge }: HandlerOptions) {
    this._shouldAddCacheMetadata = addCacheMetadata;
    this._storage = storage;
    this._maxAgeMilliseconds = parseMaxAge(maxAge);
  }

  handle({
    request,
    next
  }: PluginHandlerArgs): Observable<HttpExtResponse | HttpExtCacheResponse> {
    const shouldAddCacheMetadata = this._shouldAddCacheMetadata;

    const fromNetwork$: Observable<HttpExtResponse> = next({ request }).pipe(
      mergeMap(response => {
        /* Return response immediately but store in cache as side effect. */
        return merge(
          of(response),
          this._store(request, response).pipe(switchMapTo(EMPTY))
        );
      }),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$: Observable<HttpExtResponse> = defer(() =>
      this._loadCacheEntry(request)
    ).pipe(
      map(cacheEntry => {
        const realBody = cacheEntry.response.body;
        const body = shouldAddCacheMetadata
          ? ({
              cacheMetadata: createCacheMetadata(cacheEntry),
              data: realBody
            } as WithCacheMetadata)
          : realBody;

        return createResponse({
          ...cacheEntry.response,
          body
        });
      }),
      takeUntil(fromNetwork$)
    );

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to fromNetwork$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If fromNetwork$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      fromNetwork$.pipe(
        map(response => {
          const body = shouldAddCacheMetadata
            ? ({
                cacheMetadata: createEmptyCacheMetadata(),
                data: response.body
              } as WithCacheMetadata)
            : response.body;

          return createResponse({
            ...response,
            body
          });
        })
      ),
      fromCache$
    );
  }

  /* Store metadata belong cache. */
  private _store(
    request: HttpExtRequest,
    response: HttpExtResponse
  ): Observable<void> {
    const cacheEntry: CacheEntry = {
      createdAt: new Date(),
      response
    };

    return this._storage.set(
      this._getCacheKey(request),
      JSON.stringify(cacheEntry)
    );
  }

  private _loadCacheEntry(request: HttpExtRequest): Observable<CacheEntry> {
    return this._storage.get(this._getCacheKey(request)).pipe(
      mergeMap(rawCacheEntry => {
        /* There's no entry. */
        if (rawCacheEntry == null) {
          return EMPTY;
        }

        /* Parse the cache entry. */
        const cacheEntry = createCacheEntry(JSON.parse(rawCacheEntry));

        /* Cache entry expired. */
        if (
          isExpired({
            cachedAt: cacheEntry.createdAt,
            maxAgeMilliseconds: this._maxAgeMilliseconds
          })
        ) {
          return EMPTY;
        }

        return of(cacheEntry);
      })
    );
  }

  /* Create a unique key by request URI to retrieve cache later. */
  private _getCacheKey(request: HttpExtRequest): string {
    const { params } = request;
    const hasParams = Object.keys(params).length > 0;

    /* Note that JSON.stringify is used to avoid browser only `encodeURIComponent()` */
    return JSON.stringify({
      u: request.url,
      p: hasParams ? request.params : undefined
    });
  }
}
