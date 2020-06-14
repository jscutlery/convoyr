export const naiveEntryLength = () => 1;

export interface Cache {
  [key: string]: Entry;
}

export type GetEntryLengthFn = (entry: Entry) => number;

export interface LRUStorageOptions {
  max?: number;
  maxAge?: number;
  getEntryLength?: GetEntryLengthFn;
}

export class Entry<T = unknown> {
  key: string;
  value: T;
  length: number;
  createdAt: number;
  maxAge: number;

  constructor({ key, value, length, createdAt, maxAge = 0 }) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.createdAt = createdAt;
    this.maxAge = maxAge;
  }
}

export class LRUStorage {
  private _cache = localStorage;
  private _cacheKey = '__lru__cache';
  private _max: number;
  private _maxAge: number;
  private _getEntryLength: GetEntryLengthFn;

  constructor({
    max = Infinity,
    maxAge = 0,
    getEntryLength = naiveEntryLength,
  }: LRUStorageOptions = {}) {
    this._getEntryLength = getEntryLength;
    if (Number.isFinite(max) && (!Number.isInteger(max) || max < 0)) {
      throw TypeError(
        `Invalid max option: ${max}, must be a positive integer.`
      );
    }
    this._max = max;

    if (!Number.isInteger(maxAge) || maxAge < 0) {
      throw TypeError(
        `Invalid maxAge option: ${maxAge}, must be a positive integer.`
      );
    }
    this._maxAge = maxAge;
  }

  get length(): number {
    const cache = this._getCache();
    return Object.values(cache).reduce(
      (length, entry) => length + entry.length,
      0
    );
  }

  get count(): number {
    const cache = this._getCache();
    return Object.keys(cache).length;
  }

  get(key: string): unknown {
    const hit = this._findEntry(key);
    if (hit == null) {
      throw new Error(`Invalid cache key: ${key}`);
    }
    return hit.value;
  }

  set(key: string, value: unknown): void {
    const entry = new Entry({
      key,
      value,
      length: 1,
      createdAt: Date.now(),
      maxAge: this._maxAge,
    });
    const cache: Cache = {
      ...this._getCache(),
      [key]: entry,
    };
    this._save(cache);
  }

  delete(key: string): void {
    const cache = this._getCache();
    const { [key]: removed, ...rest } = cache;
    this._save(rest);
  }

  forEach(fn: (entry: Entry) => void): void {
    const cache = this._getCache();
    Object.values(cache).forEach(fn);
  }

  keys(): string[] {
    const cache = this._getCache();
    return Object.values(cache).map(({ key }) => key);
  }

  values(): unknown[] {
    const cache = this._getCache();
    return Object.values(cache).map(({ value }) => value);
  }

  reset(): void {
    this._save({});
  }

  private _save(cache: Cache): void {
    this._cache.setItem(this._cacheKey, JSON.stringify(cache));
  }

  private _findEntry(key: string): Entry | null {
    const cache = this._getCache();
    const hit = cache[key] ?? null;
    return hit;
  }

  private _getCache(): Cache {
    const raw = this._cache.getItem(this._cacheKey);
    const cache = this._parse(raw);
    return cache;
  }

  private _parse(cache: string): Cache {
    return JSON.parse(cache) as Cache;
  }
}
