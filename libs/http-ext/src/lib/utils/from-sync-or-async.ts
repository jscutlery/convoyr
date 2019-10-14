import {
  from,
  isObservable,
  Observable,
  of,
  SubscribableOrPromise
} from 'rxjs';

import { isPromise } from './is-promise';

export type SyncOrAsync<T> = T | SubscribableOrPromise<T>;

export function fromSyncOrAsync<T>(value: SyncOrAsync<T>): Observable<T> {
  if (isObservable<T>(value)) {
    return value;
  }
  if (isPromise<T>(value)) {
    return from(value);
  }
  return of(value as T);
}
