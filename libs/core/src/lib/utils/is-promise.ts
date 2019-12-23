export function isPromise<T>(value: any): value is Promise<T> {
  /* @todo Use optional chaining when available */
  return value && typeof value.then === 'function';
}
