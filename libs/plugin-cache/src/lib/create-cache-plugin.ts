import { RequestCondition } from '@http-ext/core';

import { CacheHandler, HandlerOptions } from './cache-handler';
import { MemoryStorage } from './storages/memory-storage';

export interface CachePluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createCachePlugin({
  addCacheMetadata = false,
  storage = new MemoryStorage(),
  condition = ({ request }) => {
    return request.method === 'GET' && request.responseType === 'json';
  }
}: Partial<CachePluginOptions> = {}) {
  return {
    condition,
    handler: new CacheHandler({ addCacheMetadata, storage })
  };
}
