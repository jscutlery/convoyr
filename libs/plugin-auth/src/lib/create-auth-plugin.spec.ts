import { createRequest, HttpExtPlugin } from '@http-ext/core';
import { from, of } from 'rxjs';
import { marbles } from 'rxjs-marbles';

function createAuthPlugin(args): HttpExtPlugin {
  throw new Error('🚧 work in progress!');
}

describe('AuthPlugin', () => {
  xit(
    '🚧 should add bearer token to each request',
    marbles(m => {
      const token$ = m.cold('-t|', { t: 'TOKEN' });

      const authPlugin = createAuthPlugin({
        token: token$
      });
      const { handler } = authPlugin;

      const request = createRequest({
        url: '/somewhere'
      });

      const next = jest.fn();

      handler.handle({
        request,
        next
      });

      expect(next).toHaveBeenCalledWith({
        request: {
          url: '/somewhere'
        }
      });
    })
  );

  xit('🚧 should grab the first token value only and run request once', () => {
    const token$ = from(['TOKEN_1', 'TOKEN_2']);

    // @todo
  });

  it.todo('🚧 should call onUnauthorized callback on 401 response');
});
