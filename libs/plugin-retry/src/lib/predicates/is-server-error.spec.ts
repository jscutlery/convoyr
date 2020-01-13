import { createResponse, HttpExtResponse } from '@http-ext/core';

import { isServerError } from './is-server-error';

describe.each<[HttpExtResponse, boolean]>([
  [
    createResponse({
      status: 500,
      statusText: 'Internal Server Error'
    }),
    true
  ],
  [
    createResponse({
      status: 200,
      statusText: 'Ok'
    }),
    false
  ],
  [
    createResponse({
      status: 400,
      statusText: 'Bad Request'
    }),
    false
  ],
  [
    createResponse({
      status: 304,
      statusText: 'Not Modified'
    }),
    false
  ]
])('isServerError with response: %p => %p', (response, expected) => {
  it('should check if the response is a server error', () => {
    expect(isServerError(response)).toBe(expected);
  });
});
