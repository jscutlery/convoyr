import { Observable, of } from 'rxjs';

import { StorageAdapter } from './storage-adapter';

export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): Observable<string> {
    const cacheData = this._load();
    return of(cacheData[key]);
  }

  set(key: string, response: string): void {
    const cacheData = this._load();
    cacheData[key] = response;
    this._save(cacheData);
  }

  private _load() {
    const cacheData = localStorage.getItem('__http-ext-cache');
    return cacheData ? cacheData : {};
  }

  private _save(cacheData) {
    return localStorage.setItem('__http-ext-cache', cacheData);
  }
}
