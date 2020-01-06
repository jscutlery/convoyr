import { EMPTY, Observable, of } from 'rxjs';

import { StorageAdapter } from './storage-adapter';

const CACHE_KEY = '__http-ext-cache';

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

  private _load(): any {
    const cacheData = window.localStorage.getItem(CACHE_KEY);
    return cacheData != null ? JSON.parse(cacheData) : {};
  }

  private _save(cacheData: any): Observable<void> {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return EMPTY;
  }
}
