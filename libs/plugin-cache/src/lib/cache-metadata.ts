import { HttpExtResponse } from '@http-ext/core';

export interface CacheMetadata {
  createdAt: Date;
  isFromCache: boolean;
}

export interface ResponseAndCacheMetadata {
  cacheMetadata?: CacheMetadata;
  response: HttpExtResponse;
}
