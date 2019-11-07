export interface CacheProvider {
  get(key: string): string;
  set(key: string, value: string): void;
}
