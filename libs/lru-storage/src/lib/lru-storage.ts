import * as Yallist from 'yallist';

export const naiveEntryLength = () => 1;

export interface Cache {
  entries: Entry[];
}

export type GetEntryLengthFn = (entry: Entry) => number;

export interface LRUStorageOptions {
  maxSize?: number;
  maxAge?: number;
  getEntryLength?: GetEntryLengthFn;
}

export class Entry<T = unknown> {
  key: string;
  value: T;
  length: number;
  lastUsageAt: number;

  constructor({ key, value, length, lastUsageAt }) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.lastUsageAt = lastUsageAt;
  }
}

export class LRUStorage {
  private _linkedList: Yallist<Entry>;
  private _cache: Map<string, Yallist.Node<Entry>>;
  private _store = localStorage;
  private _cacheKey = '__lru__cache';
  private _maxSize: number;
  private _maxAge: number;
  private _getEntryLength: GetEntryLengthFn;

  constructor({
    maxSize: max = Infinity,
    maxAge = 0,
    getEntryLength = naiveEntryLength,
  }: LRUStorageOptions = {}) {
    if (Number.isFinite(max) && (!Number.isInteger(max) || max < 0)) {
      throw TypeError(
        `Invalid max option: ${max}, must be a positive integer.`
      );
    }
    this._maxSize = max;
    if (!Number.isInteger(maxAge) || maxAge < 0) {
      throw TypeError(
        `Invalid maxAge option: ${maxAge}, must be a positive integer.`
      );
    }
    this._maxAge = maxAge;
    this._getEntryLength = getEntryLength;
    this._linkedList = this._createLruListFromStorage();
    this._cache = this._createCacheFromLruList();
  }

  get length(): number {
    let length = 0;
    for (const { value } of this._cache.values()) {
      length += value.length;
    }
    return length;
  }

  get count(): number {
    return this._linkedList.length;
  }

  get<T = unknown>(key: string): T {
    const node = this._cache.get(key);
    if (node == null) {
      return null;
    }

    if (this._isStale(node.value)) {
      this.delete(node.value.key);
      return null;
    }

    const entry = node.value;
    entry.lastUsageAt = Date.now();
    this._linkedList.unshiftNode(node);

    return entry.value as T;
  }

  set(key: string, value: unknown): void {
    const now = Date.now();

    if (this.has(key)) {
      const node = this._cache.get(key);

      if (this._calculateLength(node.value) > this._maxSize) {
        return this.delete(key);
      }

      node.value.value = value;
      node.value.lastUsageAt = now;
      this._linkedList.unshiftNode(node);
      return this._flush();
    }

    const entry = new Entry({
      key,
      value,
      length: 1,
      lastUsageAt: now,
    });

    this._linkedList.unshift(entry);
    this._cache.set(key, this._linkedList.head);
    this._flush();
  }

  has(key: string): boolean {
    const node = this._cache.get(key);
    return node != null && !this._isStale(node.value);
  }

  delete(key: string): void {
    const node = this._cache.get(key);
    this._linkedList.removeNode(node);
    this._cache.delete(key);
    this._flush();
  }

  keys(): string[] {
    return this._linkedList.map((entry) => entry.key).toArray();
  }

  values(): unknown[] {
    return this._linkedList.map((entry) => entry.value).toArray();
  }

  reset(): void {
    this._cache = new Map();
    this._store.removeItem(this._cacheKey);
    this._linkedList = new Yallist<Entry>();
  }

  private _calculateLength(entry: Entry): number {
    const entryLength = this._getEntryLength(entry);
    const length = this.length + entryLength;
    return length;
  }

  private _isStale(entry: Entry): boolean {
    const node = this._cache.get(entry.key);
    const diff = Date.now() - node.value.lastUsageAt;
    return this._maxAge !== 0 && diff > this._maxAge;
  }

  private _trim(): void {
    if (this.length > this._maxSize) {
      let walker = this._linkedList.tail;
      while (this.length > this._maxSize && walker !== null) {
        const prev = walker.prev;
        this.delete(walker.value.key);
        walker = prev;
      }
    }
  }

  private _flush(): void {
    const cache: Cache = { entries: this._linkedList.toArray() };
    this._store.setItem(this._cacheKey, JSON.stringify(cache));
    this._trim();
  }

  private _getCacheFromStorage(): Cache {
    const raw = this._store.getItem(this._cacheKey);
    const cache = JSON.parse(raw);
    return cache ?? { entries: [] };
  }

  private _createLruListFromStorage(): Yallist<Entry> {
    const cache = this._getCacheFromStorage();
    return new Yallist<Entry>(cache.entries);
  }

  private _createCacheFromLruList(): Map<string, Yallist.Node<Entry>> {
    const cache = new Map();
    let walker = this._linkedList.tail;
    while (walker !== null) {
      const prev = walker.prev;
      cache.set(walker.value.key, walker);
      walker = prev;
    }
    return cache;
  }
}
