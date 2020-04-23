import { HttpExtResponse } from '@convoy/core';
import { CacheMetadata } from './cache-metadata';

export interface WithCacheMetadata<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}

export type HttpExtCacheResponse<TData = unknown> = HttpExtResponse<
  WithCacheMetadata<TData>
>;
