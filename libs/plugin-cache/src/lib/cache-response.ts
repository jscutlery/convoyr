import { CacheMetadata } from './cache-metadata';

export interface HttpExtCacheResponse<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}
