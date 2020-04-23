import { createRequest, ConvoyrRequest, createResponse } from '@convoyr/core';
import { marbles } from 'rxjs-marbles/jest';
import { TestScheduler } from 'rxjs/testing';

import { createRetryPlugin } from './create-retry-plugin';

describe('RetryPlugin', () => {
  let request: ConvoyrRequest;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
  });

  it(
    'should retry the handler with back-off strategy when a server error occurs',
    marbles((m) => {
      /* Setting every frame duration to 100ms. */
      TestScheduler['frameTimeFactor'] = 100;

      const retryPlugin = createRetryPlugin({
        initialInterval: 100,
        maxRetries: 3,
      });
      const { handler } = retryPlugin;

      /* Create an error response */
      const errorResponse = createResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      /* Simulate failure response */
      const errorResponse$ = m.cold('-#', undefined, errorResponse);
      const source$ = handler.handle({ request, next: () => errorResponse$ });
      const expected$ = m.cold('-----------#', undefined, errorResponse);

      m.expect(source$).toBeObservable(expected$);
      m.expect(errorResponse$).toHaveSubscriptions([
        /* First try. */
        '^!',
        /* First retry after 100ms which makes it happen in frame 2 (200ms): 100ms (error response delay) + 100ms. */
        '--^!',
        /* Second retry after 200ms which makes it happen in frame 5 (500ms): 200ms + 100ms (response delay) + 200ms. */
        '-----^!',
        /* Third retry after 400ms which makes it happen in frame 10 (1s): 500ms + 100ms (response delay) + 400ms. */
        '----------^!',
      ]);
    })
  );

  it(
    'should not retry the handler when no server error occurs',
    marbles((m) => {
      const retryPlugin = createRetryPlugin({
        initialInterval: 1,
        maxRetries: 3,
      });
      const { handler } = retryPlugin;

      /* Create a 404 response */
      const errorResponse = createResponse({
        status: 404,
        statusText: 'Resource not found',
      });

      /* Simulate failure response */
      const errorResponse$ = m.cold('-#', undefined, errorResponse);
      const source$ = handler.handle({ request, next: () => errorResponse$ });
      const expected$ = m.cold('-#', undefined, errorResponse);

      m.expect(source$).toBeObservable(expected$);
      m.expect(errorResponse$).toHaveSubscriptions(['^!']);
    })
  );
});
