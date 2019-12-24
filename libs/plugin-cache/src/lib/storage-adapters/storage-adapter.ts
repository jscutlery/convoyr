import { Observable } from 'rxjs';

export interface StorageAdapter {
  get(key: string): Observable<string>;
  set(key: string, value: string): Observable<void>;
  delete(key: string): Observable<void>;
  getSize(): Observable<number>;
  setSize(size: number): Observable<void>;
}
