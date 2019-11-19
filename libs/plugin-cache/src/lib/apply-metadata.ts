import { HttpExtResponse } from '@http-ext/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpExtCacheResponse } from './metadata';

export const METADATA_KEY = '__http-ext-metadata';

/* Decorate metadata with additional flags */
export const refineMetadata = ({ isFromCache }: { isFromCache: boolean }) => (
  response: HttpExtCacheResponse
): HttpExtCacheResponse => ({
  ...response,
  [METADATA_KEY]: {
    isFromCache,
    ...response[METADATA_KEY]
  }
});

/* Omit metadata object from response */
export const omitMetadata = ({
  [METADATA_KEY]: metadata,
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
