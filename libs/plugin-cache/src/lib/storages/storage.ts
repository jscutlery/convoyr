import { Observable } from 'rxjs';

export interface Storage {
  get(key: string): Observable<string>;
  set(key: string, value: string): Observable<void>;
  delete(key: string): Observable<void>;
}
