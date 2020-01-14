import { createRequest, createResponse } from '@http-ext/core';
import { of, from } from 'rxjs';

import { createAuthPlugin } from './create-auth-plugin';

describe('AuthPlugin', () => {
  it('should add bearer token to each request', async () => {
    const token$ = of('TOKEN');
    const authPlugin = createAuthPlugin({
      token: token$
    });
    const { handler } = authPlugin;

    const request = createRequest({ url: '/somewhere' });

    const next = jest
      .fn()
      .mockReturnValue(of(createResponse({ status: 200, statusText: 'Ok' })));

    await handler.handle({ request, next }).toPromise();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({
      request: expect.objectContaining({
        url: '/somewhere',
        headers: {
          Authorization: 'Bearer TOKEN'
        }
      })
    });
  });

  xit('🚧 should grab the first token value only and run request once', () => {
    const token$ = from(['TOKEN_1', 'TOKEN_2']);

    // @todo
  });

  it.todo('🚧 should call onUnauthorized callback on 401 response');
});
