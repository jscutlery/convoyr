import { HttpExtResponse } from '@http-ext/core';
import * as sizeof from 'object-sizeof';

/* Hack to ignore type error */
const sizeInBytes = (sizeof as unknown) as (value: any) => number;

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

export function isCacheExpired({
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

export function isCacheOutsized({
  currentSizeInBytes,
  maxSizeInBytes
}: {
  response: HttpExtResponse;
  currentSizeInBytes: number;
  maxSizeInBytes: number;
}): boolean {
  /* No max size given, cache is never outsized */
  if (maxSizeInBytes == null) {
    return false;
  }

  /* And check if it fits the max size */
  if (currentSizeInBytes > maxSizeInBytes) {
    return true;
  }

  return false;
}

/* Calculate total cache size including given response */
export function calculateTotalCacheSizeInBytes(
  response: HttpExtResponse,
  currentSizeInBytes: number
): number {
  const responseSizeInBytes = sizeInBytes(response);
  return currentSizeInBytes + responseSizeInBytes;
}
