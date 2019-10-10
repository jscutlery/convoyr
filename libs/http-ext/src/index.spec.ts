import * as publicApi from './index';

describe('Public API', () => {
  it('should expose HttpExt', () => {
    expect(publicApi.HttpExtModule).toBeDefined();
  });
});
