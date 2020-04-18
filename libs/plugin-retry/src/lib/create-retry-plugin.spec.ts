<<<<<<< HEAD
import { createRequest, ConvoyrRequest, createResponse } from '@convoyr/core';
=======
import { createRequest, HttpExtRequest, createResponse } from '@http-ext/core';
import { createPluginTester } from '@http-ext/core/testing';
>>>>>>> wip: 🚧 refactor tester plugin
import { marbles } from 'rxjs-marbles/jest';
import { TestScheduler } from 'rxjs/testing';

import { RetryHandler } from './retry-handler';

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

<<<<<<< HEAD
      const retryPlugin = createRetryPlugin({
        initialInterval: 100,
        maxRetries: 3,
=======
      const pluginTester = createPluginTester({
        handler: new RetryHandler({
          initialInterval: 100,
          maxInterval: 10_000,
          maxRetries: 10,
          shouldRetry: () => true,
        }),
>>>>>>> wip: 🚧 refactor tester plugin
      });

      /* Create an error response */
      const response = createResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      /* Simulate failure response */
<<<<<<< HEAD
      const errorResponse$ = m.cold('-#', undefined, errorResponse);
      const source$ = handler.handle({
        request,
        next: { handle: () => errorResponse$ },
      });
      const expected$ = m.cold('-----------#', undefined, errorResponse);
=======
      const response$ = m.cold('-#', undefined, response);
>>>>>>> wip: 🚧 refactor tester plugin

      const source$ = pluginTester.handle({
        request,
        response: response$,
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
    'should not retry the handler when no server error occurs',
    marbles((m) => {
<<<<<<< HEAD
      const retryPlugin = createRetryPlugin({
        initialInterval: 1,
        maxRetries: 3,
=======
      const pluginTester = createPluginTester({
        handler: new RetryHandler({
          initialInterval: 1,
          maxInterval: 10_000,
          maxRetries: 3,
          shouldRetry: () => true,
        }),
>>>>>>> wip: 🚧 refactor tester plugin
      });

      /* Create a 404 response */
      const response = createResponse({
        status: 404,
        statusText: 'Resource not found',
      });

      /* Simulate failure response */
<<<<<<< HEAD
      const errorResponse$ = m.cold('-#', undefined, errorResponse);
      const source$ = handler.handle({
        request,
        next: { handle: () => errorResponse$ },
      });
      const expected$ = m.cold('-#', undefined, errorResponse);
=======
      const response$ = m.cold('-#', undefined, response);
      const source$ = pluginTester.handle({
        request,
        response: response$,
      });
>>>>>>> wip: 🚧 refactor tester plugin

      const expected$ = m.cold('-#', undefined, response);
      m.expect(source$).toBeObservable(expected$);
      m.expect(response$).toHaveSubscriptions(['^!']);
    })
  );
});
