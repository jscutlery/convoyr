import { HttpExtResponse } from '@http-ext/core';
import { CacheMetadata } from './cache-metadata';

/**
 * @deprecated.
 */
export interface HttpExtCacheResponseLegacy<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}

export interface HttpExtCacheResponseBody<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}

export type HttpExtCacheResponse<TData = unknown> = HttpExtResponse<
  HttpExtCacheResponseBody<TData>
>;
