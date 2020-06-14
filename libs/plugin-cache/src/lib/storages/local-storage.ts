import { Observable, defer, of, EMPTY } from 'rxjs';
import { Storage, StorageArgs } from './storage';
import { LRUStorage } from '@lru-storage';

export class LocalStorage implements Storage {
  private _lruCache: LRUStorage;

  constructor({ maxSize = 100 }: StorageArgs = {}) {
    this._lruCache = this._createLruCache(maxSize as number);
  }

  get(key: string): Observable<string> {
    return defer(() => {
      return of(this._lruCache.get<string>(key));
    });
  }

  set(key: string, value: string): Observable<void> {
    return defer(() => {
      this._lruCache.set(key, value);
      return EMPTY;
    });
  }

  delete(key: string): Observable<void> {
    return defer(() => {
      this._lruCache.delete(key);
      return EMPTY;
    });
  }

  private _createLruCache(maxSize: number): LRUStorage {
    return new LRUStorage({ maxSize });
  }
}
