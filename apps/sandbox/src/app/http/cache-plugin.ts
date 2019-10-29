import { HttpExtPlugin } from '@http-ext/http-ext';
import { defer, EMPTY, iif, merge, Observable, of } from 'rxjs';
import { delay, map, shareReplay, takeUntil, tap } from 'rxjs/operators';

const cache = {};

// export function createCacheOptions({
//   withCacheInfo
// }: {
//   withCacheInfo: boolean;
// }): {} {
//   return {
//     θhttpExt: {
//       withCacheInfo
//     }
//   };
// }

export interface CacheResponse<TData> {
  isFromCache: boolean;
  data: TData;
}

export function cachePlugin({
  withCacheInfo = false
}: { withCacheInfo?: boolean } = {}): HttpExtPlugin {
  return {
    handle({ request, next }) {
      const real$ = next({ request }).pipe(
        delay(1000),
        tap(response => (cache[request.url] = response)),
        shareReplay({
          refCount: true,
          bufferSize: 1
        })
      );

      const fromCache$ = defer(() => {
        const response = cache[request.url];
        return response ? of(response) : EMPTY;
      }).pipe(takeUntil(real$));

      /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to real$
       * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
       * If real$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
       * thanks to shareReplay. */
      return merge(
        _addCacheInfo({ source$: real$, withCacheInfo, isFromCache: false }),
        _addCacheInfo({ source$: fromCache$, withCacheInfo, isFromCache: true })
      );
    }
  };
}

export function _addCacheInfo({
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
