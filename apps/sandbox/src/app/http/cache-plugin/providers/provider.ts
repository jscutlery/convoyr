export type CacheProviderType = 'memory' | 'localStorage' | 'indexedDB';

export interface CacheProvider {
  get(url: string): unknown;
  set(url: string, response: unknown): void;
}
