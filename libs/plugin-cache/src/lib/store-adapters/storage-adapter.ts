export interface StorageAdapter {
  get(key: string): string;
  set(key: string, value: string): void;
}
