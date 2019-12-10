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
  /* Create a date object. */
  const createdAt = cacheEntry.createdAt
    ? new Date(cacheEntry.createdAt)
    : null;

  return {
    createdAt,
    response: cacheEntry.response
  };
}

export function isExpired({
  cachedAt,
  maxAgeMilliseconds
}: {
  cachedAt: Date;
  maxAgeMilliseconds: number;
}) {
  if (maxAgeMilliseconds == null) {
    return false;
  }

  const expiresAt = cachedAt.getTime() + maxAgeMilliseconds;

  return new Date() >= new Date(expiresAt);
}
