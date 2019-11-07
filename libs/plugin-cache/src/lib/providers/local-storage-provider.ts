import { CacheProvider } from '../cache-provider';

export class LocalStorageCacheProvider implements CacheProvider {
  get(key) {
    const cacheData = this._load();
    return cacheData[key];
  }

  set(key, response) {
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
