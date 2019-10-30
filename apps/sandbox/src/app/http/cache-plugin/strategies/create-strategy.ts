import { CacheThenNetworkStrategy } from './cache-then-network-strategy';
import { CacheProvider } from '../providers/provider';
import { CacheStrategy, CacheStrategyType } from './strategy';

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
