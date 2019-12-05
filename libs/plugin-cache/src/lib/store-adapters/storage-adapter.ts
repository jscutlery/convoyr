import { Observable } from 'rxjs';

export interface StorageAdapter {
  get(key: string): Observable<string>;
  set(key: string, value: string): void;
}
