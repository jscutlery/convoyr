import { Observable, of } from 'rxjs';

import { StorageAdapter } from './storage-adapter';

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

  delete(key): Observable<void> {
    const cacheData = this._load();
    delete cacheData[key];
    return this._save(cacheData);
  }

  private _load(): any {
    const cacheData = window.localStorage.getItem('__http-ext-cache');
    return cacheData ? cacheData : {};
  }

  private _save(cacheData): Observable<void> {
    window.localStorage.setItem('__http-ext-cache', cacheData);
    return of();
  }
}
