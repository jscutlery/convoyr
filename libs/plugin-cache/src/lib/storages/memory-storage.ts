import * as bytes from 'bytes';
import * as LRU from 'lru-cache';
import * as size from 'object-sizeof';
import { EMPTY, Observable, of } from 'rxjs';

import { Storage } from './storage';

// Dirty hack to ignore types error
const sizeOf = (size as unknown) as (v: any) => number;

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

      // Length is based on the size of the cache in bytes
      length(cache) {
        return sizeOf(cache);
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
