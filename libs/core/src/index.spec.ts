import * as publicApi from './index';

describe('Public API', () => {
  it('should expose HttpExt', () => {
    expect(publicApi.HttpExt).toBeDefined();
    expect(publicApi.matchOrigin).toBeDefined();
    expect(publicApi.matchMethod).toBeDefined();
    expect(publicApi.createRequest).toBeDefined();
    expect(publicApi.createResponse).toBeDefined();
  });
});
