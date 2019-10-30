import { CacheProvider } from './provider';

export class LocalStorageProvider implements CacheProvider {
  get(url) {
    const cacheData = this._load();
    return cacheData[url];
  }

  set(url, response) {
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
