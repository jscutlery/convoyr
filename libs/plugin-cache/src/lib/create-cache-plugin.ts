import { matchMethod, RequestCondition } from '@http-ext/core';

import { CacheHandler, HandlerOptions } from './cache-handler';
import { MemoryStorageAdapter } from './storage-adapters/memory-storage-adapter';

export interface CachePluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createCachePlugin({
  addCacheMetadata = false,
  storage = new MemoryStorageAdapter(),
  condition = matchMethod('GET'),
  maxAge,
  maxSize
}: Partial<CachePluginOptions> = {}) {
  return {
    condition,
    handler: new CacheHandler({ addCacheMetadata, storage, maxAge, maxSize })
  };
}
