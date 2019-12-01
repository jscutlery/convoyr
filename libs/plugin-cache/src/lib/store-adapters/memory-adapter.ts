import { StorageAdapter } from './storage-adapter';

export class MemoryAdapter implements StorageAdapter {
  private cache = new Map<string, string>();

  get(key) {
    return this.cache.get(key);
  }

  set(key, response) {
    this.cache.set(key, response);
  }
}
