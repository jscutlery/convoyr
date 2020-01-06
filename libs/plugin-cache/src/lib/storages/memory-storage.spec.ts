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

    it('🚧 should remove the oldest entry when maxSize is reached', async () => {
      await set('Key A', 'Value A');

      /* Adding this entry should remove the previous entry. */
      await set('Key B', 'Value B');

      expect(await get('Key A')).toEqual(undefined);
      expect(await get('Key B')).toEqual('Value B');
    });

    describe('with maxSize of 2', () => {
      beforeEach(() => {
        memoryStorage = new MemoryStorage({
          maxSize: 2
        });
      });

      it.todo(
        '🚧 should remove the least recently used entry when maxSize is reached'
      );
    });
  });

  it.todo('🚧 should remove old entry when outdated');
});
