import * as publicApi from './index';

describe('Public API', () => {
  it('should expose ConvoyModule', () => {
    expect(publicApi.ConvoyModule).toBeDefined();
  });
});
