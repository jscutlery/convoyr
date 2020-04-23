import { ConvoyrResponse } from '@convoyr/core';

export interface CacheEntry {
  createdAt: Date;
  response: ConvoyrResponse;
}

export interface CacheEntryArgs {
  createdAt: string | Date;
  response: ConvoyrResponse;
}

export function createCacheEntry(cacheEntry: CacheEntryArgs): CacheEntry {
  return {
    createdAt: new Date(cacheEntry.createdAt),
    response: cacheEntry.response,
  };
}
