import { HttpExtResponse } from '@http-ext/http-ext';

import { CacheProvider } from '../provider';

export class LocalStorageCacheProvider implements CacheProvider {
  type: 'localStorage';

  get(url): HttpExtResponse {
    const cacheData = this._load();
    return cacheData[url];
  }

  set(url: string, response: HttpExtResponse) {
    const cacheData = this._load();
    cacheData[url] = response;
    this._save(cacheData);
  }

  private _load() {
    const raw = localStorage.getItem('__http-ext-cache');
    return raw ? JSON.parse(raw) : {};
  }

  private _save(cacheData) {
    return localStorage.setItem('__http-ext-cache', JSON.stringify(cacheData));
  }
}
