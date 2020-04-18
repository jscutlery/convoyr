import { EMPTY } from 'rxjs';

import { createRetryPlugin } from './create-retry-plugin';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error';
import { RetryHandler } from './retry-handler';

jest.mock('./retry-handler');

describe('RetryPlugin', () => {
  const mockRetryHandler = RetryHandler as jest.Mock;

  it('should create the retry handler with default options', () => {
    const plugin = createRetryPlugin();

    mockRetryHandler.mockReturnValue(EMPTY);

    expect(plugin.shouldHandleRequest).toBeUndefined();
    expect(RetryHandler).toHaveBeenCalledWith({
      initialInterval: 300,
      maxInterval: 10000,
      maxRetries: 3,
      shouldRetry: isServerOrUnknownError,
    });
  });
});
