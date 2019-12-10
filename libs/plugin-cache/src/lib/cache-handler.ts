import {
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { HttpExtCacheResponse } from '@http-ext/plugin-cache';
import { create } from 'domain';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import { map, mergeMap, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { applyMetadata } from './apply-metadata';
import { CacheEntry, createCacheEntry, isExpired } from './cache-entry';
import {
  createCacheMetadata,
  ResponseAndCacheMetadata
} from './cache-metadata';
import { StorageAdapter } from './store-adapters/storage-adapter';
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
    const fromNetwork$ = next({ request }).pipe(
      tap(response => this._store(request, response)),
      map(response => ({ response })),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => this._loadCache(request)).pipe(
      takeUntil(fromNetwork$)
    );

    const shouldAddCacheMetadata = this._shouldAddCacheMetadata;

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to fromNetwork$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If fromNetwork$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      applyMetadata({
        source$: fromNetwork$,
        shouldAddCacheMetadata
      }),
      applyMetadata({
        source$: fromCache$,
        shouldAddCacheMetadata
      })
    );
  }

  /* Store metadata belong cache. */
  private _store(request: HttpExtRequest, response: HttpExtResponse): void {
    const cacheEntry: CacheEntry = {
      createdAt: new Date(),
      response
    };

    this._storage.set(this._getCacheKey(request), JSON.stringify(cacheEntry));
  }

  private _loadCache(
    request: HttpExtRequest
  ): Observable<ResponseAndCacheMetadata> {
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
      }),
      map(cacheEntry => {
        return {
          response: cacheEntry.response,
          cacheMetadata: createCacheMetadata(cacheEntry)
        };
      })
    );
  }

  private _checkCacheValidity(
    cache: ResponseAndCacheMetadata
  ): Observable<boolean> {
    return defer(() => {
      /* If no ttl set cache is always valid */
      if (this._maxAgeMilliseconds === null) {
        return of(true);
      }

      const { createdAt } = cache.cacheMetadata;
      const isValid = this._isCacheExpired(new Date(createdAt)) === false;

      return of(isValid);
    });
  }

  private _clearCacheIfInvalid(request: HttpExtRequest) {
    return (isCacheValid: boolean): void => {
      if (!isCacheValid) {
        this._storage.delete(this._getCacheKey(request));
      }
    };
  }

  private _isCacheExpired(createdAt: Date): boolean {
    if (this._maxAgeMilliseconds == null) {
      return false;
    }

    const expireAt = createdAt.getTime() + this._maxAgeMilliseconds;

    return new Date() >= new Date(expireAt);
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
