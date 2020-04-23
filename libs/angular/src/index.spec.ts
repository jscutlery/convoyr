import * as publicApi from './index';

describe('Public API', () => {
  it('should expose ConvoyrModule', () => {
    expect(publicApi.ConvoyrModule).toBeDefined();
  });
});
