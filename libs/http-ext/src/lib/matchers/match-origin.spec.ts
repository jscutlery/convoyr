import { createRequest } from '../request';
import { matchOrigin } from './match-origin';

describe.each([
  /* Using a string */
  ['https://test.com', 'https://test.com', true],
  ['https://test.com', 'https://angular.io', false],

  /* Using a wildcard */
  ['https://test.com', '*', true],

  /* Using an Array */
  ['https://test.com', ['https://test.com'], true],
  ['https://test.com', ['https://angular.io'], false],

  /* Using a RegExp */
  ['https://test.com', /[a-z]/, true],
  ['https://test.com', /[0-9]/, false],

  /* Using a Predicate */
  ['https://test.com', (origin: string) => origin.startsWith('https://'), true],
  ['http://test.com', (origin: string) => origin.startsWith('https://'), false]
])('matchOrigin(%p, %p) => %p', (origin, matcher, expected) => {
  it('should check origin', () => {
    expect(matchOrigin(matcher, createRequest({ url: origin }))).toBe(expected);
  });
});
