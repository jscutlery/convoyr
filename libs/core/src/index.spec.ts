import * as publicApi from './index';

describe('Public API', () => {
  it('should expose Convoyr', () => {
    expect(publicApi.Convoyr).toBeDefined();
    expect(publicApi.matchOrigin).toBeDefined();
    expect(publicApi.matchMethod).toBeDefined();
    expect(publicApi.matchResponseType).toBeDefined();
    expect(publicApi.matchPath).toBeDefined();
    expect(publicApi.or).toBeDefined();
    expect(publicApi.and).toBeDefined();
    expect(publicApi.not).toBeDefined();
    expect(publicApi.createRequest).toBeDefined();
    expect(publicApi.createResponse).toBeDefined();
  });
});
