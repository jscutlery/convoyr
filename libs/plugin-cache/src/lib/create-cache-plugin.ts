import { HttpExtPlugin, matchMethod, RequestCondition } from '@http-ext/core';

import { CacheHandler, HandlerOptions } from './cache-handler';
import { MemoryAdapter } from './store-adapters/memory-adapter';

export interface CachePluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createCachePlugin({
  addCacheMetadata = false,
  storage = new MemoryAdapter(),
  condition = matchMethod('GET'),
  maxAge
}: Partial<CachePluginOptions> = {}) {
  return {
    condition,
    handler: new CacheHandler({ addCacheMetadata, storage, maxAge })
  };
}
