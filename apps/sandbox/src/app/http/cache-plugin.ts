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
export type CacheProviderType =
  | 'memory'
  | 'sessionStorage'
  | 'localStorage'
  | 'indexedDB';

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
    `InvalidStrategyError: ${strategy} is not a valid strategy, possible values are ${strategies.toString()}`
  );
}

export function createCacheStrategy({
  strategy,
  cacheProvider,
  withCacheInfo
}: {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
  cacheProvider: CacheProvider;
}): CacheStrategy {
  switch (strategy) {
    case 'cacheThenNetwork':
      return new CacheThenNetworkStrategy(withCacheInfo, cacheProvider);

    default:
      throw invalidStrategyError(strategy);
  }
}

export class CacheThenNetworkStrategy implements CacheStrategy {
  constructor(
    private withCacheInfo: boolean,
    private cacheProvider: CacheProvider
  ) {}

  handle({ request, next }) {
    const real$ = next({ request }).pipe(
      delay(1000),
      tap(response => this.cacheProvider.set(request.url, response)),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => {
      const response = this.cacheProvider.get(request.url);
      return response ? of(response) : EMPTY;
    }).pipe(takeUntil(real$));

    const withCacheInfo = this.withCacheInfo;
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

export class MemoryCache implements CacheProvider {
  get(url) {
    const cacheData = this._load();
    return cacheData[url];
  }

  set(url, response) {
    const cacheData = this._load();
    cacheData[url] = response;
    this._save(cacheData);
  }

  private _load() {
    const raw = localStorage.getItem('http-ext-cache');
    return raw ? JSON.parse(raw) : {};
  }

  private _save(cacheData) {
    return localStorage.setItem('http-ext-cache', JSON.stringify(cacheData));
  }
}

export interface CachePluginOptions {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
  cache: CacheProviderType;
}

export interface CacheProvider {
  get(url: string): unknown;
  set(url: string, response: unknown): void;
}

export function invalidCacheProviderError(cacheProviderType: string) {
  const cacheProviders: CacheProviderType[] = [
    'memory',
    'sessionStorage',
    'localStorage',
    'indexedDB'
  ];
  return new Error(
    `InvalidCacheProviderError: couldn't create ${cacheProviderType} cache provider, valid providers are ${cacheProviders.toString()}`
  );
}

export function createCacheProvider(
  cacheProviderType: CacheProviderType
): CacheProvider {
  switch (cacheProviderType) {
    case 'memory':
      return new MemoryCache();

    // @todo implement others cache providers

    default:
      throw invalidCacheProviderError(cacheProviderType);
  }
}

export function cachePlugin(
  {
    strategy = 'cacheThenNetwork',
    cache = 'memory',
    withCacheInfo = false
  }: Partial<CachePluginOptions> = {
    strategy: 'cacheThenNetwork',
    cache: 'memory',
    withCacheInfo: false
  }
): HttpExtPlugin {
  return {
    handle({ request, next }) {
      const cacheProvider = createCacheProvider(cache);
      const cacheHandler = createCacheStrategy({
        cacheProvider,
        strategy,
        withCacheInfo
      });

      return cacheHandler.handle({ request, next });
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
