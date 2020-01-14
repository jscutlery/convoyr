import * as bytes from 'bytes';
import * as LRU from 'lru-cache';
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

      // Length is based on the size in bytes
      length(cache) {
        return Buffer.from(cache).length;
      }
    };
  }

  // Otherwise it's a "count like" max size
  return {
    max: maxSize
  };
}

export class MemoryStorage implements Storage {
  private _cache: LRU<string, string>;

  constructor({ maxSize }: StorageArgs = {}) {
    this._cache = new LRU<string, string>(configureLRU({ maxSize }));
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
