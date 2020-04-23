import { ConvoyResponse } from '@convoy/core';
import { CacheMetadata } from './cache-metadata';

export interface WithCacheMetadata<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}

export type ConvoyCacheResponse<TData = unknown> = ConvoyResponse<
  WithCacheMetadata<TData>
>;
