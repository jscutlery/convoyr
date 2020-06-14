import { LRUStorage } from './lru-storage';

describe('LRUStorage', () => {
  let lruStorage: LRUStorage;

  describe('with maxSize of 1', () => {
    beforeEach(() => (lruStorage = new LRUStorage({ maxSize: 1 })));

    it('should return value if maxSize is not reached', () => {
      lruStorage.set('Key A', 'Value A');
      expect(lruStorage.get('Key A')).toEqual('Value A');
    });

    it('should remove the oldest entry when maxSize is reached', () => {
      lruStorage.set('Key A', 'Value A');

      /* Adding this entry should remove the previous entry. */
      lruStorage.set('Key B', 'Value B');

      expect(lruStorage.get('Key A')).toEqual(null);
      expect(lruStorage.get('Key B')).toEqual('Value B');
    });
  });

  describe('with maxSize of 2', () => {
    beforeEach(() => {
      lruStorage = new LRUStorage({
        maxSize: 2,
      });
    });

    it('should remove the least recently used entry when maxSize is reached', async () => {
      lruStorage.set('Key A', 'Value A');
      lruStorage.set('Key B', 'Value B');

      /* Even if A is the oldest, B is the least recently used as we just retrieved A. */
      lruStorage.get('Key A');

      lruStorage.set('Key C', 'Value C');

      expect(lruStorage.get('Key A')).toBe('Value A');
      expect(lruStorage.get('Key B')).toBe(null);
      expect(lruStorage.get('Key C')).toBe('Value C');
    });
  });
});
