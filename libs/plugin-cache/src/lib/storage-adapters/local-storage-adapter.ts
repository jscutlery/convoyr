import { EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { StorageAdapter } from './storage-adapter';

const CACHE_KEY = '__http-ext-cache';
const CACHE_SIZE_KEY = '__http-ext-cache-size';

export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): Observable<string> {
    const cacheData = this._load();
    return of(cacheData[key]);
  }

  set(key: string, response: string): Observable<void> {
    const cacheData = this._load();
    cacheData[key] = response;
    return this._save(cacheData);
  }

  delete(key: string): Observable<void> {
    const cacheData = this._load();
    cacheData[key] = undefined;
    return this._save(cacheData);
  }

  getSize(): Observable<number> {
    const size = window.localStorage.getItem(CACHE_SIZE_KEY);
    return size != null ? of(parseInt(size, 10)) : of(0);
  }

  setSize(size: number): Observable<void> {
    localStorage.setItem(CACHE_SIZE_KEY, size.toString());
    return EMPTY;
  }

  private _load(): any {
    const cacheData = window.localStorage.getItem(CACHE_KEY);
    return cacheData != null ? JSON.parse(cacheData) : {};
  }

  private _save(cacheData: any): Observable<void> {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return EMPTY;
  }
}
