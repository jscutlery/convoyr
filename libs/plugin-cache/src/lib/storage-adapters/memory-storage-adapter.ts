import { EMPTY, Observable, of } from 'rxjs';

import { StorageAdapter } from './storage-adapter';

export class MemoryStorageAdapter implements StorageAdapter {
  private cache = new Map<string, string>();
  private cacheSize = 0;

  get(key: string): Observable<string> {
    return of(this.cache.get(key));
  }

  set(key: string, response: string): Observable<void> {
    this.cache.set(key, response);
    return EMPTY;
  }

  getSize(): Observable<number> {
    return of(this.cacheSize);
  }

  setSize(size: number): Observable<void> {
    this.cacheSize = size;
    return EMPTY;
  }

  delete(key: string): Observable<void> {
    this.cache.delete(key);
    return EMPTY;
  }
}
