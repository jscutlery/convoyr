import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpExtResponse } from '@http-ext/core';

export interface CacheResponse<TData> {
  isFromCache: boolean;
  data: TData;
}

export type ResponseOrCacheResponse =
  | HttpExtResponse<unknown>
  | HttpExtResponse<CacheResponse<unknown>>;

export const _addMetadata = ({ isFromCache }: { isFromCache: boolean }) => (
  response: HttpExtResponse
): HttpExtResponse<CacheResponse<unknown>> => ({
  ...response,
  body: {
    data: response.body,
    isFromCache
  }
});

export function _applyMetadata({
  source$,
  addCacheMetadata,
  isFromCache
}: {
  source$: Observable<HttpExtResponse>;
  addCacheMetadata: boolean;
  isFromCache: boolean;
}): Observable<ResponseOrCacheResponse> {
  return addCacheMetadata
    ? source$.pipe(map(_addMetadata({ isFromCache })))
    : source$;
}
