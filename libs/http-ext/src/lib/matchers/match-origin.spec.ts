import { createRequest } from '../request';
import { matchOrigin } from './match-origin';

describe.each([
  /* Using a string matcher */
  ['https://test.com', 'https://test.com', true],
  ['https://test.com', 'https://angular.io', false],

  /* Using an Array matcher */
  ['https://test.com', ['https://test.com'], true],
  ['https://test.com', ['https://angular.io'], false],

  /* Using a RegExp matcher */
  ['https://test.com', /[a-z]/, true],
  ['https://test.com', /[0-9]/, false]
])('matchOrigin(%p, %p) => %p', (origin, matcher, expected) => {
  it('should check origin', () => {
    expect(matchOrigin(matcher, createRequest({ url: origin }))).toBe(expected);
  });
});
