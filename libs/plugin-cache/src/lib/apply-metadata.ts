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

/* Conditionally add to response observable a metadata object */
export function applyMetadata({
  source$,
  shouldAddCacheMetadata
}: {
  source$: Observable<ResponseAndCacheMetadata>;
  shouldAddCacheMetadata: boolean;
}): Observable<HttpExtResponse> {
  return shouldAddCacheMetadata
    ? source$.pipe(map(refineMetadata))
    : source$.pipe(pluck('response'));
}
