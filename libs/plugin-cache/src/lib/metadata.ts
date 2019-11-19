import { HttpExtResponse } from '@http-ext/core';

export interface CachePartialMetadata {
  createdAt: string;
}

export interface CacheMetadata extends CachePartialMetadata {
  isFromCache: boolean;
}

export interface ResponseAndCacheMetadata {
  cacheMetadata?: CachePartialMetadata;
  response: HttpExtResponse;
}

export interface HttpExtCacheResponse<TData = unknown> {
  cacheMetadata: CacheMetadata;
  data: TData;
}
