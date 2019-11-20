import { HttpExtResponse } from '@http-ext/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { CacheMetadata, ResponseAndCacheMetadata } from './metadata';

/* Decorate metadata with additional flags */
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
  addCacheMetadata
}: {
  source$: Observable<ResponseAndCacheMetadata>;
  addCacheMetadata: boolean;
}): Observable<HttpExtResponse> {
  return addCacheMetadata
    ? source$.pipe(map(refineMetadata))
    : source$.pipe(pluck('response'));
}
