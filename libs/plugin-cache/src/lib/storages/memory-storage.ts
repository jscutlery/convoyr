import * as bufferFrom from 'buffer-from';
import * as bytes from 'bytes';
import * as LRU from 'lru-cache';
import { EMPTY, Observable, of } from 'rxjs';

import { Storage } from './storage';

export interface StorageArgs {
  maxSize?: number | string;
}

export function _createLruOptions(
  options: StorageArgs
): LRU.Options<string, string> {
  const { maxSize } = options;

  /* Handle human readable format */
  if (typeof maxSize === 'string') {
    return {
      max: bytes(maxSize),

      /* Length is based on the size in bytes */
      length(value) {
        return bufferFrom(value).length;
      }
    };
  }

  /* Otherwise it's a "count like" max size */
  return {
    max: maxSize
  };
}

export class MemoryStorage implements Storage {
  private _lruCache: LRU<string, string>;

  constructor({ maxSize = 100 }: StorageArgs = {}) {
    this._lruCache = new LRU<string, string>(_createLruOptions({ maxSize }));
  }

  get(key: string): Observable<string> {
    return of(this._lruCache.get(key));
  }

  set(key: string, value: string): Observable<void> {
    this._lruCache.set(key, value);
    return EMPTY;
  }

  delete(key: string): Observable<void> {
    this._lruCache.del(key);
    return EMPTY;
  }
}
