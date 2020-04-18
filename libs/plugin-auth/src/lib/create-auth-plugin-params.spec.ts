import { EMPTY, of } from 'rxjs';
import { matchOrigin } from '@http-ext/core';

import { AuthHandler } from './auth-handler';
import { createAuthPlugin } from './create-auth-plugin';
import { OnUnauthorized } from './on-unauthorized';

jest.mock('./auth-handler');

describe('AuthPlugin', () => {
  const mockAuthHandler = AuthHandler as jest.Mock;

  it('should create the auth handler with default options', () => {
    const token = of('TOKEN');
    const onUnauthorized: OnUnauthorized = (response) => true;
    const matchSomewhereOrigin = matchOrigin('https://somewhere.com');

    const plugin = createAuthPlugin({
      token,
      onUnauthorized,
      shouldHandleRequest: matchSomewhereOrigin,
    });

    mockAuthHandler.mockReturnValue(EMPTY);

    expect(plugin.shouldHandleRequest).toBe(matchSomewhereOrigin);
    expect(AuthHandler).toHaveBeenCalledWith({
      token,
      onUnauthorized,
    });
  });
});
