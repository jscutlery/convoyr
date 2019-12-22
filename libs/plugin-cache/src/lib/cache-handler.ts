import {
  createResponse,
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import * as sizeof from 'object-sizeof';
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
  CacheMetadata,
  createCacheMetadata,
  createEmptyCacheMetadata
} from './cache-metadata';
import { HttpExtCacheResponse, WithCacheMetadata } from './cache-response';
import { StorageAdapter } from './storage-adapters/storage-adapter';
import { parseMaxAge } from './utils/parse-max-age';

/* Hack to ignore type error */
const sizeBytes = (sizeof as unknown) as (value: any) => number;

export interface HandlerOptions {
  addCacheMetadata: boolean;
  storage: StorageAdapter;
  maxAge?: string;
  maxSize?: string;
}

export class CacheHandler implements PluginHandler {
  private _shouldAddCacheMetadata: boolean;
  private _storage: StorageAdapter;
  private _maxAgeMilliseconds?: number;
  private _maxSizeBytes?: number;
  private _totalSizeBytes = 0; // Not correct, need to get the whole cache size at init

  constructor({ addCacheMetadata, storage, maxAge, maxSize }: HandlerOptions) {
    this._shouldAddCacheMetadata = addCacheMetadata;
    this._storage = storage;
    this._maxAgeMilliseconds = parseMaxAge(maxAge);
    this._maxSizeBytes = parseInt(maxSize, 10); // @todo parse from pretty format, eg: 1MB to 1000000B (& ignore if undefined)
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
      map(cacheEntry =>
        this._createResponseWithOptionalMetadata({
          response: cacheEntry.response,
          shouldAddCacheMetadata,
          cacheMetadata: createCacheMetadata(cacheEntry)
        })
      ),
      takeUntil(fromNetwork$)
    );

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to fromNetwork$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If fromNetwork$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      fromNetwork$.pipe(
        map(response =>
          this._createResponseWithOptionalMetadata({
            response,
            shouldAddCacheMetadata,
            cacheMetadata: createEmptyCacheMetadata()
          })
        )
      ),
      fromCache$
    );
  }

  /* Store metadata belong cache. */
  private _store(
    request: HttpExtRequest,
    response: HttpExtResponse
  ): Observable<void> {
    return defer(() => {
      this._incrementSizeBytes(response);

      if (
        this._maxSizeBytes != null &&
        this._totalSizeBytes > this._maxSizeBytes
      ) {
        return EMPTY;
      }

      const cacheEntry: CacheEntry = {
        createdAt: new Date(),
        response
      };

      return this._storage.set(
        this._getCacheKey(request),
        JSON.stringify(cacheEntry)
      );
    });
  }

  /* Increment total size in bytes (maybe should be done in the store to allow cross sessions) */
  private _incrementSizeBytes(response: HttpExtResponse): void {
    if (this._maxSizeBytes != null) {
      const responseSizeBytes = sizeBytes(response);
      this._totalSizeBytes += responseSizeBytes;
    }
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

    return JSON.stringify({
      u: request.url,
      p: hasParams ? request.params : undefined
    });
  }

  private _createResponseWithOptionalMetadata({
    response,
    cacheMetadata,
    shouldAddCacheMetadata
  }: {
    response: HttpExtResponse;
    cacheMetadata: CacheMetadata;
    shouldAddCacheMetadata: boolean;
  }): HttpExtResponse | HttpExtCacheResponse {
    const body = shouldAddCacheMetadata
      ? ({
          cacheMetadata,
          data: response.body
        } as WithCacheMetadata)
      : response.body;
    return createResponse({
      ...response,
      body
    });
  }
}
