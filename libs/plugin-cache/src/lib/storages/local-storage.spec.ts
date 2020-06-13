import { LocalStorage } from './local-storage';

describe('LocalStorage', () => {
  let localStorage: LocalStorage;

  async function get(key: string) {
    return await localStorage.get(key).toPromise();
  }

  async function set(key: string, value: string) {
    return await localStorage.set(key, value).toPromise();
  }

  describe('with default maxSize', () => {
    function getPrivateLruCache() {
      return localStorage['_lruCache'];
    }

    beforeEach(() => {
      localStorage = new LocalStorage();
    });

    it.todo('should pass the right configuration to LRU');
  });

  describe('with maxSize of 1', () => {
    beforeEach(() => {
      localStorage = new LocalStorage({
        maxSize: 1,
      });
    });

    it.todo('should return value if maxSize is not reached');

    it.todo('should remove the oldest entry when maxSize is reached');
  });
});
