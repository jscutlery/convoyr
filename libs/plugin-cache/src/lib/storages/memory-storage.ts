import { EMPTY, Observable, of } from 'rxjs';

import { Storage } from './storage';

export class MemoryStorage implements Storage {
  private cache = new Map<string, string>();

  get(key: string): Observable<string> {
    return of(this.cache.get(key));
  }

  set(key: string, response: string): Observable<void> {
    this.cache.set(key, response);
    return EMPTY;
  }

  delete(key: string): Observable<void> {
    this.cache.delete(key);
    return EMPTY;
  }
}
