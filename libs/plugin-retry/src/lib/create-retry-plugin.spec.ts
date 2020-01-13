import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/core';
import { marbles } from 'rxjs-marbles/jest';

import { createRetryPlugin } from './create-retry-plugin';

describe('RetryPlugin', () => {
  let request: HttpExtRequest;
  let response: HttpExtResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  it(
    'should retry the handler with back-off strategy when a server error occurs',
    marbles(m => {
      const retryPlugin = createRetryPlugin({
        initialInterval: 1,
        maxRetries: 3
      });
      const { handler } = retryPlugin;

      /* Create an error response for coherence */
      response = {
        ...response,
        status: 500,
        statusText: 'Internal Server Error'
      };

      /* Simulate failure response */
      const next = () => m.cold('-#', undefined, response);

      const source$ = handler.handle({ request, next });
      const expected$ = m.cold('-----------#', undefined, response);

      m.expect(source$).toBeObservable(expected$);
    })
  );

  it(
    'should not retry the handler when no server error occurs',
    marbles(m => {
      const retryPlugin = createRetryPlugin({
        initialInterval: 1,
        maxRetries: 3
      });
      const { handler } = retryPlugin;

      /* Create an error response for coherence */
      response = {
        ...response,
        status: 404,
        statusText: 'Resource not found'
      };

      /* Simulate failure response */
      const next = () => m.cold('-#', undefined, response);

      const source$ = handler.handle({ request, next });
      const expected$ = m.cold('-#', undefined, response);

      m.expect(source$).toBeObservable(expected$);
    })
  );
});
