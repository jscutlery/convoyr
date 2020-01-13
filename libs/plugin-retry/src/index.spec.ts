import * as publicApi from './index';

describe('Public API', () => {
  it('should expose the retry plugin', () => {
    expect(publicApi.createRetryPlugin).toBeDefined();
  });
});
