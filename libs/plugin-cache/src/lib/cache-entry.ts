import { HttpExtResponse } from '@http-ext/core';

export interface CacheEntry {
  createdAt: Date;
  response: HttpExtResponse;
}

export interface CacheEntryArgs {
  createdAt: string | Date;
  response: HttpExtResponse;
}

export function createCacheEntry(cacheEntry: CacheEntryArgs): CacheEntry {
  return {
    createdAt: new Date(cacheEntry.createdAt),
    response: cacheEntry.response
  };
}
