import { CacheProvider } from './provider';

export class MemoryProvider implements CacheProvider {
  private cache = new Map<string, unknown>();

  get(url) {
    return this.cache.get(url);
  }

  set(url, response) {
    this.cache.set(url, response);
  }
}
