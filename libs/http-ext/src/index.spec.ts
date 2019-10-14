import * as publicApi from './index';

describe('Public API', () => {
  it('should expose HttpExt', () => {
    expect(publicApi.HttpExtModule).toBeDefined();
    expect(publicApi.matchOrigin).toBeDefined();
  });
});
