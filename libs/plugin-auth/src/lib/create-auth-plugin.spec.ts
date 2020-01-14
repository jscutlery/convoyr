import { HttpExtPlugin } from '@http-ext/core';
import { from, of } from 'rxjs';

function createAuthPlugin(args): HttpExtPlugin {
  throw new Error('🚧 work in progress!');
}

describe('AuthPlugin', () => {
  it('🚧 should add bearer token to each request', () => {
    const token$ = of('TOKEN');

    const authPlugin = createAuthPlugin({
      token: token$
    });
    const { handler } = authPlugin;

    // @todo create a request
    // @todo handle request
    // @todo check request has header
  });

  it('🚧 should grab the first token value only and run request once', () => {
    const token$ = from(['TOKEN_1', 'TOKEN_2']);

    // @todo
  });

  it.todo('🚧 should call onUnauthorized callback on 401 response');
});
