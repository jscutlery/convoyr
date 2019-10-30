import { HttpExtPlugin } from '@http-ext/http-ext';

import { createCacheProvider } from './providers/create-provider';
import { CacheProvider, CacheProviderType } from './providers/provider';
import { createCacheStrategy } from './strategies/create-strategy';
import { CacheStrategy, CacheStrategyType } from './strategies/strategy';

export interface CacheResponse<TData> {
  isFromCache: boolean;
  data: TData;
}

export interface CachePluginOptions {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
  cache: CacheProviderType;
}

export const DEFAULT_OPTIONS: CachePluginOptions = {
  strategy: 'cacheThenNetwork',
  cache: 'memory',
  withCacheInfo: false
};

export class CachePlugin implements HttpExtPlugin {
  private _strategy: CacheStrategy;
  private _provider: CacheProvider;

  constructor({ cache, strategy, withCacheInfo }: CachePluginOptions) {
    this._provider = createCacheProvider(cache);
    this._strategy = createCacheStrategy({
      cacheProvider: this._provider,
      strategy,
      withCacheInfo
    });
  }

  handle({ request, next }) {
    return this._strategy.handle({ request, next });
  }
}

export function cachePlugin({
  strategy = 'cacheThenNetwork',
  cache = 'memory',
  withCacheInfo = false
}: Partial<CachePluginOptions> = DEFAULT_OPTIONS): CachePlugin {
  return new CachePlugin({ cache, strategy, withCacheInfo });
}
