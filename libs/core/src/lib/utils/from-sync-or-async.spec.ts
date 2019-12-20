import { of } from 'rxjs';

import { fromSyncOrAsync } from './from-sync-or-async';

describe('fromSyncOfAsync', () => {
  it('should convert a string to an Observable of string', async () => {
    const string = await fromSyncOrAsync('42').toPromise();
    expect(string).toBe('42');
  });

  it('should convert a number to an Observable of number', async () => {
    const number = await fromSyncOrAsync(42).toPromise();
    expect(number).toBe(42);
  });

  it('should convert undefined to an Observable of undefined', async () => {
    const notDefined = await fromSyncOrAsync(undefined).toPromise();
    expect(notDefined).toBe(undefined);
  });

  it('should convert an object to an Observable of object', async () => {
    const object = await fromSyncOrAsync({ value: 42 }).toPromise();
    expect(object).toEqual({ value: 42 });
  });

  it('should convert a Promise to an Observable', async () => {
    const promise = new Promise(resolve => resolve(42));
    const object = await fromSyncOrAsync(promise).toPromise();
    expect(object).toEqual(42);
  });

  it('should return the Observable as is', async () => {
    const observable$ = of(42);
    const object = await fromSyncOrAsync(observable$).toPromise();
    expect(object).toEqual(42);
  });
});
