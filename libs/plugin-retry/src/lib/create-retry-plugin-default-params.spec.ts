import { EMPTY } from 'rxjs';

import { createRetryPlugin } from './create-retry-plugin';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error';
import { RetryHandler } from './retry-handler';

jest.mock('./retry-handler');

describe('RetryPlugin', () => {
  const mockRetryHandler = RetryHandler as jest.Mock;

  it('should create the retry handler with default options', () => {
    createRetryPlugin();

    mockRetryHandler.mockReturnValue(EMPTY);

    expect(RetryHandler).toHaveBeenCalledWith({
      initialInterval: 200,
      maxInterval: 60000,
      maxRetries: 10,
      shouldRetry: isServerOrUnknownError
    });
  });
});
