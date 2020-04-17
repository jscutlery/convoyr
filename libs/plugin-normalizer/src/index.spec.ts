import * as publicApi from './index';

describe('Public API', () => {
  it('should expose the normalizer plugin', () => {
    expect(publicApi.createNormalizerPlugin).toBeDefined();
  });
});
