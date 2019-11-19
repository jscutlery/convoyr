import { HttpExtResponse } from '@http-ext/core';

export interface CachePartialMetadata {
  createdAt: string;
}

export interface CacheMetadata extends CachePartialMetadata {
  isFromCache: boolean;
}

export interface HttpExtPartialCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  cacheMetadata: CachePartialMetadata;
}

export interface HttpExtCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  cacheMetadata: CacheMetadata;
}
