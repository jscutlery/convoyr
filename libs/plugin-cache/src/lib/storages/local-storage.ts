import { Observable } from 'rxjs';
import { Storage, StorageArgs } from './storage';

export class LocalStorage implements Storage {
  constructor({ maxSize = 100 }: StorageArgs = {}) {}

  get(key: string): Observable<string> {
    throw new Error('Method not implemented.');
  }
  set(key: string, value: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
