export function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function';
}
