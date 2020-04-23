import { createResponse, ConvoyResponse } from '@convoyr/core';
import { isUnknownError } from './is-unknown-error';

describe.each<[ConvoyResponse, boolean]>([
  [
    createResponse({
      status: 0,
      statusText: 'Unknown Error',
    }),
    true,
  ],
  [
    createResponse({
      status: 200,
      statusText: 'Ok',
    }),
    false,
  ],
])('isUnknownError with response: %p => %p', (response, expected) => {
  it('should check if the response is an unknown error', () => {
    expect(isUnknownError(response)).toBe(expected);
  });
});
