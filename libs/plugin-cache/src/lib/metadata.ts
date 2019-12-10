import { HttpExtResponse } from '@http-ext/core';

export interface CacheMetadata {
  createdAt: Date;
  isFromCache: boolean;
}

export interface ResponseAndCacheMetadata {
  cacheMetadata?: CacheMetadata;
  response: HttpExtResponse;
}

export interface HttpExtCacheResponse<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}
