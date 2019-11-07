export interface StoreAdapter {
  get(key: string): string;
  set(key: string, value: string): void;
}
