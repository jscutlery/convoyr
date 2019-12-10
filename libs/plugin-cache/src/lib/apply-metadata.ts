import { HttpExtResponse } from '@http-ext/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { CacheMetadata, ResponseAndCacheMetadata } from './cache-metadata';

/**
 * Adds computed fields like `isFromCache`.
 */
export const refineMetadata = ({
  cacheMetadata,
  response
}: ResponseAndCacheMetadata): HttpExtResponse<{
  cacheMetadata: CacheMetadata;
  data: unknown;
}> => ({
  ...response,
  body: {
    cacheMetadata: {
      ...cacheMetadata,
      isFromCache: cacheMetadata != null
    },
    data: response.body
  }
});
