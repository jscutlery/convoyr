import { HttpExtPlugin } from '@http-ext/http-ext';
import { defer, EMPTY, merge, Observable, of } from 'rxjs';
import { delay, map, shareReplay, takeUntil, tap } from 'rxjs/operators';

// tslint:disable-next-line: nx-enforce-module-boundaries
import { HttpExtResponse } from 'libs/http-ext/src/lib/response';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { HttpExtRequest } from 'libs/http-ext/src/lib/request';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { RequestHandlerFn } from 'libs/http-ext/src/lib/http-ext';

export type CacheStrategyType = 'cacheThenNetwork';

export interface CacheStrategy {
  handle({
    request,
    next
  }: {
    request: HttpExtRequest<unknown>;
    next: RequestHandlerFn;
  }): Observable<HttpExtResponse<unknown>>;
}

export function invalidStrategyError(strategy: string) {
  const strategies: CacheStrategyType[] = ['cacheThenNetwork'];
  return new Error(
    `InvalidStrategyError: could not handle ${strategy}, valid values are ${strategies.toString()}`
  );
}

export function findStrategyOrThrow({
  strategy,
  withCacheInfo
}: {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
}): CacheStrategy {
  switch (strategy) {
    case 'cacheThenNetwork':
      return new CacheThenNetworkStrategy({ withCacheInfo });

    default:
      throw invalidStrategyError(strategy);
  }
}

export class CacheThenNetworkStrategy implements CacheStrategy {
  constructor(private options: { withCacheInfo: boolean }) {}

  handle({ request, next }) {
    const real$ = next({ request }).pipe(
      delay(1000),
      tap(response => cache.set(request.url, response)),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => {
      const response = cache.get(request.url);
      return response ? of(response) : EMPTY;
    }).pipe(takeUntil(real$));

    const { withCacheInfo } = this.options;

    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to real$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If real$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      _addCacheInfo({ source$: real$, withCacheInfo, isFromCache: false }),
      _addCacheInfo({ source$: fromCache$, withCacheInfo, isFromCache: true })
    );
  }
}

export interface CacheResponse<TData> {
  isFromCache: boolean;
  data: TData;
}

export const cache = {
  get(url) {
    const cacheData = this._load();
    return cacheData[url];
  },
  set(url, response) {
    const cacheData = this._load();
    cacheData[url] = response;
    this._save(cacheData);
  },
  _load() {
    const raw = localStorage.getItem('http-ext-cache');
    return raw ? JSON.parse(raw) : {};
  },
  _save(cacheData) {
    return localStorage.setItem('http-ext-cache', JSON.stringify(cacheData));
  }
};

export interface CachePluginOptions {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
}

export function cachePlugin(
  {
    strategy = 'cacheThenNetwork',
    withCacheInfo = false
  }: Partial<CachePluginOptions> = {
    strategy: 'cacheThenNetwork',
    withCacheInfo: false
  }
): HttpExtPlugin {
  return {
    handle({ request, next }) {
      const cacheStrategy = findStrategyOrThrow({ strategy, withCacheInfo });
      return cacheStrategy.handle({ request, next });
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
