import { RequestCondition } from '@http-ext/core';
import { CacheHandler, HandlerOptions } from './cache-handler';
import { MemoryStorageAdapter } from './storage-adapters/memory-storage-adapter';

export interface CachePluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createCachePlugin({
  addCacheMetadata = false,
  storage = new MemoryStorageAdapter(),
  condition = ({ request }) => {
    return request.method === 'GET' && request.responseType === 'json';
  }
}: Partial<CachePluginOptions> = {}) {
  return {
    condition,
    handler: new CacheHandler({ addCacheMetadata, storage })
  };
}
