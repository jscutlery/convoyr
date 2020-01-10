import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/core';
import { throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { createRetryPlugin } from './create-retry-plugin';

describe('CachePlugin', () => {
  let request: HttpExtRequest;
  let response: HttpExtResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  it(
    'should retry requests with back-off strategy',
    marbles(m => {
      const cachePlugin = createRetryPlugin({
        initialIntervalMs: 1,
        maxRetries: 2
      });
      const { handler } = cachePlugin;

      /* Create an error response for coherence */
      response = {
        ...response,
        status: 500,
        statusText: 'Internal Server Error'
      };

      /* Simulate failure response */
      const next = () => throwError(response);

      const source$ = handler.handle({ request, next });
      const expected$ = m.cold('---#', undefined, response);

      m.expect(source$).toBeObservable(expected$);
    })
  );
});
