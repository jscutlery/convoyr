import { HttpExtPlugin } from '@http-ext/http-ext';

import { createCacheProvider } from './providers/create-provider';
import { CacheProviderType } from './providers/provider';
import { createCacheStrategy } from './strategies/create-strategy';
import { CacheStrategyType } from './strategies/strategy';

export interface CacheResponse<TData> {
  isFromCache: boolean;
  data: TData;
}

export interface CachePluginOptions {
  withCacheInfo: boolean;
  strategy: CacheStrategyType;
  cache: CacheProviderType;
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
