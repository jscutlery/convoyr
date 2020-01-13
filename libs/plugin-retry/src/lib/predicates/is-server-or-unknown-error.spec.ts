import { createResponse, HttpExtResponse } from '@http-ext/core';
import { RetryPredicate } from '@http-ext/plugin-retry';
import { isServerError } from './is-server-error';
import { isUnknownError } from './is-unknown-error';

export const or = <TArgs extends any[]>(
  ...predicates: ((...args: TArgs) => boolean)[]
) => (...args: TArgs) => {
  return predicates.some(predicate => predicate(...args));
};

export const isServerOrUnknownError: RetryPredicate = response => {
  return or(isServerError, isUnknownError)(response);
};

describe.each<[HttpExtResponse, boolean]>([
  [
    createResponse({
      status: 0,
      statusText: 'Unknown Error'
    }),
    true
  ],
  [
    createResponse({
      status: 200,
      statusText: 'Ok'
    }),
    false
  ]
])('isServerOrUnknownError with response: %p => %p', (response, expected) => {
  it('should check if the response is a server or an unknown error', () => {
    expect(isServerOrUnknownError(response)).toBe(expected);
  });
});
