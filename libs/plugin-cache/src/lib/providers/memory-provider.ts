import { CacheProvider } from '../cache-provider';

export class MemoryCacheProvider implements CacheProvider {
  private cache = new Map<string, string>();

  get(key) {
    return this.cache.get(key);
  }

  set(key, response) {
    this.cache.set(key, response);
  }
}
