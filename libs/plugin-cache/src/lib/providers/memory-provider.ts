import { HttpExtResponse } from '@http-ext/http-ext';

import { CacheProvider } from '../provider';

export class MemoryCacheProvider implements CacheProvider {
  private cache = new Map<string, HttpExtResponse>();

  get(url) {
    return this.cache.get(url);
  }

  set(url, response) {
    this.cache.set(url, response);
  }
}
