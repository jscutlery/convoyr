import { ConvoyResponse } from '@convoy/core';

export interface CacheEntry {
  createdAt: Date;
  response: ConvoyResponse;
}

export interface CacheEntryArgs {
  createdAt: string | Date;
  response: ConvoyResponse;
}

export function createCacheEntry(cacheEntry: CacheEntryArgs): CacheEntry {
  return {
    createdAt: new Date(cacheEntry.createdAt),
    response: cacheEntry.response,
  };
}
