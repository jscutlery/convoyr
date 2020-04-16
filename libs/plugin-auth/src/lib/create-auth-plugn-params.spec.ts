import { EMPTY, of } from 'rxjs';

import { AuthHandler } from './auth-handler';
import { createAuthPlugin } from './create-auth-plugin';
import { OnUnauthorized } from './on-unauthorized';

jest.mock('./auth-handler');

describe('AuthPlugin', () => {
  const mockAuthHandler = AuthHandler as jest.Mock;

  it('should create the auth handler with default options', () => {
    const token = of('TOKEN');
    const onUnauthorized: OnUnauthorized = (response) => true;

    createAuthPlugin({ token, onUnauthorized });

    mockAuthHandler.mockReturnValue(EMPTY);

    expect(AuthHandler).toHaveBeenCalledWith({
      token,
      onUnauthorized,
    });
  });
});
