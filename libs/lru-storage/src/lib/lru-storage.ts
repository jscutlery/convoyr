export const naiveLength = () => 1;

export interface LRUStorageOptions {
  max?: number;
  maxAge?: number;
  getLength?: (entry: unknown, key: string) => number;
}

export class LRUStorage implements Storage {
  private _cache = localStorage;

  get length(): number {
    return this._cache.length;
  }

  constructor({
    max = Infinity,
    maxAge = 0,
    getLength = naiveLength,
  }: LRUStorageOptions = {}) {}

  clear(): void {
    throw new Error('Method not implemented.');
  }

  getItem(key: string): string {
    throw new Error('Method not implemented.');
  }

  key(index: number): string {
    throw new Error('Method not implemented.');
  }

  removeItem(key: string): void {
    throw new Error('Method not implemented.');
  }

  setItem(key: string, value: string): void {
    throw new Error('Method not implemented.');
  }
}
