import * as publicApi from './index';

describe('Public API', () => {
  it('should expose HttpExtModule', () => {
    expect(publicApi.HttpExtModule).toBeDefined();
  });
});
