import { CacheProvider } from './provider';

export class MemoryProvider implements CacheProvider {
  private cache = new Map<string, unknown>();

  get(url) {
    console.log('GET cache', url, this.cache.get(url));
    return this.cache.get(url);
  }

  set(url, response) {
    console.log('SET cache', url, response);
    this.cache.set(url, response);
  }
}
