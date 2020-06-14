import * as Yallist from 'yallist';

export const naiveEntryLength = () => 1;

export interface Cache {
  [key: string]: Yallist.Node<Entry>;
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

  constructor({ key, value, length, createdAt }) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.createdAt = createdAt;
  }
}

export class LRUStorage {
  private _lruList = new Yallist<Entry>();
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
      (length, entry) => length + entry.value.length,
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

  has(key: string): boolean {
    const hit = this._findEntry(key);
    return hit != null;
  }

  set(key: string, value: unknown): void {
    const hit = new Entry({
      key,
      value,
      length: 1,
      createdAt: Date.now(),
    });
    this._lruList.unshift(hit);
    const cache: Cache = {
      [key]: this._lruList.head,
      ...this._getCache(),
    };
    this._saveCache(cache);
  }

  delete(key: string): void {
    const cache = this._getCache();
    const { [key]: node, ...rest } = cache;
    this._lruList.removeNode(node);
    this._saveCache(rest);
  }

  forEach(fn: (entry: Entry, key: string) => void): void {
    this._lruList.forEach((entry) => fn(entry, entry.key));
  }

  keys(): string[] {
    return this._lruList.map((entry) => entry.key).toArray();
  }

  values(): unknown[] {
    return this._lruList.map((entry) => entry.value).toArray();
  }

  reset(): void {
    this._cache.removeItem(this._cacheKey);
    this._lruList = new Yallist<Entry>();
  }

  private _trim(): void {
    if (this.length > this._max) {
      let walker = this._lruList.tail;
      while (this.length > this._max && walker != null) {
        const prev = walker.prev;
        this.delete(walker.value.key);
        walker = prev;
      }
    }
  }

  private _saveCache(cache: Cache): void {
    this._cache.setItem(this._cacheKey, JSON.stringify(cache));
    this._trim();
  }

  private _findEntry(key: string): Entry | null {
    const cache = this._getCache();
    const hit = cache[key] ?? null;
    return hit.value;
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
