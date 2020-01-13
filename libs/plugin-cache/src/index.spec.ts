import * as publicApi from './index';

describe('Public API', () => {
  it('should expose the cache plugin', () => {
    expect(publicApi.createCachePlugin).toBeDefined();
    expect(publicApi.MemoryStorage).toBeDefined();
  });
});
