import {
  RequestCondition,
  ConvoyrRequest,
  and,
  matchMethod,
  matchResponseType,
} from '@convoyr/core';

import { CacheHandler, HandlerOptions } from './cache-handler';
import { MemoryStorage } from './storages/memory-storage';

export interface CachePluginOptions extends HandlerOptions {
  shouldHandleRequest: RequestCondition;
}

export function createCachePlugin({
  addCacheMetadata = false,
  storage = new MemoryStorage({ maxSize: 100 }),
  shouldHandleRequest = and(matchMethod('GET'), matchResponseType('json')),
}: Partial<CachePluginOptions> = {}) {
  return {
    shouldHandleRequest,
    handler: new CacheHandler({ addCacheMetadata, storage }),
  };
}
