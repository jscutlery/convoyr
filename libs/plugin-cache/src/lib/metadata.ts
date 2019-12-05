import { HttpExtResponse } from '@http-ext/core';

export interface PartialCacheMetadata {
  createdAt: string;
  ttl: string;
}

export interface CacheMetadata extends PartialCacheMetadata {
  isFromCache: boolean;
}

export interface ResponseAndCacheMetadata {
  cacheMetadata?: PartialCacheMetadata;
  response: HttpExtResponse;
}

export interface HttpExtCacheResponse<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}
