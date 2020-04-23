import * as publicApi from './index';

describe('Public API', () => {
  it('should expose Convoyr', () => {
    expect(publicApi.Convoyr).toBeDefined();
    expect(publicApi.matchOrigin).toBeDefined();
    expect(publicApi.matchMethod).toBeDefined();
    expect(publicApi.createRequest).toBeDefined();
    expect(publicApi.createResponse).toBeDefined();
    expect(publicApi.or).toBeDefined();
    expect(publicApi.and).toBeDefined();
    expect(publicApi.not).toBeDefined();
  });
});
