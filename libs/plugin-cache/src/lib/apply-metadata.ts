import { HttpExtResponse } from '@http-ext/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpExtCacheResponse, CacheMetadata } from './metadata';

/* Decorate metadata with additional flags */
export const refineMetadata = ({ isFromCache }: { isFromCache: boolean }) => (
  response: HttpExtCacheResponse
): HttpExtCacheResponse => ({
  ...response,
  cacheMetadata: {
    isFromCache,
    ...response.cacheMetadata
  }
});

/* Omit metadata object from response */
export const omitMetadata = ({
  cacheMetadata: metadata,
  ...response
}: HttpExtCacheResponse): HttpExtResponse => response;

/* Conditionally add to response observable a metadata object */
export function applyMetadata({
  source$,
  addCacheMetadata,
  isFromCache
}: {
  source$: Observable<any>;
  addCacheMetadata: boolean;
  isFromCache: boolean;
}): Observable<HttpExtCacheResponse | HttpExtResponse> {
  return addCacheMetadata
    ? source$.pipe(map(refineMetadata({ isFromCache })))
    : source$.pipe(map(omitMetadata));
}
