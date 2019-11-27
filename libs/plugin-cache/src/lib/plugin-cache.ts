import { HttpExtPlugin, matchMethod, RequestCondition } from '@http-ext/core';

import { CacheHandler, HandlerOptions } from './handler';
import { MemoryAdapter } from './store-adapters/memory-adapter';

export interface CachePluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function cachePlugin({
  addCacheMetadata = false,
  storeAdapter = new MemoryAdapter(),
  condition = matchMethod('GET')
}: Partial<CachePluginOptions> = {}): HttpExtPlugin {
  return {
    condition,
    handler: new CacheHandler({ addCacheMetadata, storeAdapter })
  };
}
