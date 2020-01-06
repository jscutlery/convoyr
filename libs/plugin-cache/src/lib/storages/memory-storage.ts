import { EMPTY, Observable, of } from 'rxjs';

import { Storage } from './storage';

export interface StorageArgs {
  maxSize?: number;
}

export class MemoryStorage implements Storage {
  private _cache = new Map<string, string>();
  private _maxSize?: number;

  constructor({ maxSize }: StorageArgs = {}) {
    this._maxSize = maxSize;
  }

  get(key: string): Observable<string> {
    return of(this._cache.get(key));
  }

  set(key: string, value: string): Observable<void> {
    this._cache.set(key, value);
    return EMPTY;
  }

  delete(key: string): Observable<void> {
    this._cache.delete(key);
    return EMPTY;
  }
}
