import { from, of } from 'rxjs';

function createAuthPlugin(args) {
  throw new Error('🚧 work in progress!');
}

describe('AuthPlugin', () => {
  it('🚧 should add bearer token to each request', () => {
    const token$ = from(['TOKEN_1', 'TOKEN_2']);

    const authPlugin = createAuthPlugin({
      token: token$
    });
  });

  it.todo('🚧 should call onUnauthorized callback on 401 response');
});
