import { Observable, of } from 'rxjs';
import { StorageAdapter } from './storage-adapter';

export class MemoryAdapter implements StorageAdapter {
  private cache = new Map<string, string>();

  get(key: string): Observable<string> {
    return of(this.cache.get(key));
  }

  set(key: string, response: string): void {
    this.cache.set(key, response);
  }
}
