import { HttpExtResponse } from '@http-ext/core';

export interface CacheMetadataBase {
  createdAt: Date;
}

/* Adds computed fields like isFromCache. */
export interface CacheMetadata extends CacheMetadataBase {
  isFromCache: boolean;
}

export interface ResponseAndCacheMetadata {
  cacheMetadata?: CacheMetadata;
  response: HttpExtResponse;
}

export function createCacheMetadata(args: CacheMetadataBase): CacheMetadata {
  return {
    createdAt: args.createdAt,
    isFromCache: true
  };
}
