import { Observable } from 'rxjs';

export interface Storage {
  get(key: string): Observable<string>;
  set(key: string, value: string): Observable<void>;
  delete(key: string): Observable<void>;
}

export interface StorageArgs {
  maxSize?: number | string;
}
