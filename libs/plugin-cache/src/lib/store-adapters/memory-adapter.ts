import { StoreAdapter } from './store-adapter';

export class MemoryAdapter implements StoreAdapter {
  private cache = new Map<string, string>();

  get(key) {
    return this.cache.get(key);
  }

  set(key, response) {
    this.cache.set(key, response);
  }
}
