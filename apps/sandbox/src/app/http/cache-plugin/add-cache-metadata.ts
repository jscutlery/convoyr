import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function _addCacheMetadata({
  source$,
  withCacheInfo,
  isFromCache
}: {
  source$: Observable<any>; // @todo we have to export HttpExtRequest and HttpExtResponse
  withCacheInfo: boolean;
  isFromCache: boolean;
}) {
  return withCacheInfo
    ? source$.pipe(
        map(response => ({
          ...response,
          body: {
            isFromCache,
            data: response.body
          }
        }))
      )
    : source$;
}
