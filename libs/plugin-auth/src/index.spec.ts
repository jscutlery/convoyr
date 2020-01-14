import { createAuthPlugin } from './lib/create-auth-plugin';

describe('Public API', () => {
  it('Should expose Auth plugin API', () => {
    expect(createAuthPlugin).toBeDefined();
  });
});
