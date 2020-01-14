import * as LRU from 'lru-cache';
import * as bytes from 'bytes';
import { EMPTY, Observable, of } from 'rxjs';

import { Storage } from './storage';

export interface StorageArgs {
  maxSize?: number | string;
}

export function configureLRU(
  options: StorageArgs
): LRU.Options<string, string> {
  const { maxSize } = options;

  // Handle human readable format
  if (typeof maxSize === 'string') {
    return {
      max: bytes(maxSize),
      length: (value, key) => {
        return bytes(value);
      }
    };
  }

  // Otherwise it's "count like" max size
  return {
    max: maxSize
  };
}

export class MemoryStorage implements Storage {
  private _cache: LRU<string, string>;

  constructor({ maxSize }: StorageArgs = {}) {
    this._cache = new LRU<string, string>();
  }

  get(key: string): Observable<string> {
    return of(this._cache.get(key));
  }

  set(key: string, value: string): Observable<void> {
    this._cache.set(key, value);
    return EMPTY;
  }

  delete(key: string): Observable<void> {
    this._cache.del(key);
    return EMPTY;
  }
}
