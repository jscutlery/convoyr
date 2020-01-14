import { MemoryStorage } from './memory-storage';

describe('MemoryStorage', () => {
  let memoryStorage: MemoryStorage;

  async function get(key: string) {
    return await memoryStorage.get(key).toPromise();
  }

  async function set(key: string, value: string) {
    return await memoryStorage.set(key, value).toPromise();
  }

  describe('with maxSize of 1', () => {
    beforeEach(() => {
      memoryStorage = new MemoryStorage({
        maxSize: 1
      });
    });

    it('should return value if maxSize is not reached', async () => {
      await set('Key A', 'Value A');
      expect(await get('Key A')).toEqual('Value A');
    });

    it('should remove the oldest entry when maxSize is reached', async () => {
      await set('Key A', 'Value A');

      /* Adding this entry should remove the previous entry. */
      await set('Key B', 'Value B');

      expect(await get('Key A')).toEqual(undefined);
      expect(await get('Key B')).toEqual('Value B');
    });
  });

  describe('with maxSize of 2', () => {
    beforeEach(() => {
      memoryStorage = new MemoryStorage({
        maxSize: 2
      });
    });

    it('should remove the least recently used entry when maxSize is reached', async () => {
      await set('Key A', 'Value A');
      await set('Key B', 'Value B');

      /* Even if A is the oldest, B is the least recently used as we just retrieved A. */
      get('Key A');

      await set('Key C', 'Value C');

      expect(await get('Key A')).toBe('Value A');
      expect(await get('Key B')).toBe(undefined);
      expect(await get('Key C')).toBe('Value C');
    });
  });

  describe('with maxSize of human readable bytes', () => {
    beforeEach(() => {
      memoryStorage = new MemoryStorage({
        maxSize: '10 Bytes'
      });
    });

    it('should remove least recently used', async () => {
      const cache = 'cache'; /* This is 5 bytes length */

      await set('Key A', cache);
      await set('Key B', cache);
      await set('Key C', cache);

      expect(await get('Key A')).toBe(undefined);
      expect(await get('Key B')).toBe('cache');
      expect(await get('Key C')).toBe('cache');
    });
  });

  describe('with maxAge', () => {
    it.todo('🚧 should remove old entry when outdated');
  });
});
