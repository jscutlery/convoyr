import { ConvoyrRequest, createRequest, createResponse } from '@convoyr/core';
import { createPluginTester } from '@convoyr/core/testing';
import { marbles } from 'rxjs-marbles/jest';
import { TestScheduler } from 'rxjs/testing';
import { createRetryPlugin } from './create-retry-plugin';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error';

describe('RetryPlugin', () => {
  let request: ConvoyrRequest;

  beforeEach(() => {
    request = createRequest({
      url: 'https://ultimate-answer.com',
    });
  });

  it(
    'should retry the handler with back-off strategy when a server error occurs',
    marbles((m) => {
      /* Setting every frame duration to 100ms. */
      TestScheduler['frameTimeFactor'] = 100;

      const pluginTester = createPluginTester({
        plugin: createRetryPlugin({
          initialInterval: 100,
          maxInterval: 10_000,
          maxRetries: 3,
          shouldRetry: isServerOrUnknownError,
        }),
      });

      /* Create an error response */
      const response = createResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      /* Simulate failure response */
      const response$ = m.cold('-#', undefined, response);
      const httpHandlerMock = pluginTester.createHttpHandlerMock({
        response: response$,
      });

      const source$ = pluginTester.handleFake({
        request,
        httpHandlerMock,
      });

      const expected$ = m.cold('-----------#', undefined, response);
      m.expect(source$).toBeObservable(expected$);
      m.expect(response$).toHaveSubscriptions([
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
    `should retry only when its 5xx or unknown errors`,
    marbles((m) => {
      const pluginTester = createPluginTester({
        plugin: createRetryPlugin({
          initialInterval: 100,
          maxInterval: 10_000,
          maxRetries: 3,
          shouldRetry: isServerOrUnknownError,
        }),
      });

      /* Create a 404 response */
      const response = createResponse({
        status: 404,
        statusText: 'Resource not found',
      });

      /* Simulate failure response */
      const response$ = m.cold('-#', undefined, response);
      const httpHandlerMock = pluginTester.createHttpHandlerMock({
        response: response$,
      });

      const source$ = pluginTester.handleFake({
        request,
        httpHandlerMock,
      });

      const expected$ = m.cold('-#', undefined, response);
      m.expect(source$).toBeObservable(expected$);
      m.expect(response$).toHaveSubscriptions(['^!']);
    })
  );
});
