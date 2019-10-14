import { createRequest } from '../../request';
import { matchOrigin } from './match-origin';

describe.each([
  /* Using a string */
  ['https://test.com', 'https://test.com', true],
  ['https://test.com', 'https://angular.io', false],

  /* Using an Array */
  ['https://test.com', ['https://test.com'], true],
  ['https://test.com', ['https://angular.io'], false],

  /* Using a RegExp */
  ['https://test.com', /[a-z]/, true],
  ['https://test.com', /[0-9]/, false]
])(
  'matchOrigin with url: %p and matcher: %p => %p',
  (origin, matcher, expected) => {
    it('should check origin', () => {
      const request = createRequest({ url: origin });
      expect(matchOrigin(matcher)({ request })).toBe(expected);
    });
  }
);

describe.each([['https://test.com', true], ['http://test.com', false]])(
  'matchOrigin with url: %p and starts with https predicate => %p',
  (url, expected) => {
    const startsWithHttpsPredicate = (origin: string) =>
      origin.startsWith('https://');

    it('should check origin', () => {
      const request = createRequest({ url });
      expect(matchOrigin(startsWithHttpsPredicate)({ request })).toBe(expected);
    });
  }
);
