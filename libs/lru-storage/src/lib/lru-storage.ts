export const naiveLength = () => 1;

export interface LRUStorageOptions {
  max?: number;
  maxAge?: number;
  getLength?: (entry: unknown, key: string) => number;
}

export class LRUStorage {
  constructor({
    max = Infinity,
    maxAge = 0,
    getLength = naiveLength,
  }: LRUStorageOptions = {}) {}
}
