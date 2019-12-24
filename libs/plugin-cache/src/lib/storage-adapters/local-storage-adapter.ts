import { EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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

  delete(key: string): Observable<void> {
    const cacheData = this._load();
    delete cacheData[key];
    return this._save(cacheData);
  }

  getSize() {
    return this.get('__http-ext-cache-size').pipe(
      map(size => parseInt(size, 10))
    );
  }

  setSize(size: number): Observable<void> {
    return this.set('__http-ext-cache-size', size.toString()).pipe(
      mergeMap(() => EMPTY)
    );
  }

  private _load(): any {
    const cacheData = window.localStorage.getItem('__http-ext-cache');
    return cacheData ? cacheData : {};
  }

  private _save(cacheData: string): Observable<void> {
    window.localStorage.setItem('__http-ext-cache', cacheData);
    return of();
  }
}
