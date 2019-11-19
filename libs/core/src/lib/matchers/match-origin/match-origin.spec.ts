import { createRequest, HttpExtRequest } from '../../request';
import { matchOrigin } from './match-origin';
import { OriginMatchExpression } from './origin-match-expression';

describe.each<[string, OriginMatchExpression, boolean]>([
  /* Using a string */
  ['https://test.com', 'https://test.com', true],
  ['https://test.com', 'https://angular.io', false],
  ['https://test.com/test', 'https://test.com', true],
  ['https://test.com?length=1', 'https://test.com', true],
  ['https://test.com.test.com', 'https://test.com', false],
  ['https://test.com.test.com/test', 'https://test.com', false],
  ['https://test.com.test.com?length=1', 'https://test.com', false],

  /* Using an Array */
  ['https://test.com', ['https://test.com'], true],
  ['https://test.com/test', ['https://test.com'], true],
  ['https://test.com', ['https://angular.io'], false],

  /* Using a RegExp */
  ['https://test.com', /[a-z]/, true],
  ['https://test.com', /[0-9]/, false]
])(
  'matchOrigin with url: %p and matcher: %p => %p',
  (url, matcher, expected) => {
    it('should check origin', () => {
      const request = createRequest({ url });
      expect(matchOrigin(matcher)({ request })).toBe(expected);
    });
  }
);

describe.each<[string, boolean]>([
  ['https://test.com', true],
  ['http://test.com', false]
])(
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

describe('matchOrigin', () => {
  let request: HttpExtRequest;

  beforeEach(() => (request = createRequest({ url: 'https://test.com' })));

  it('should throw when given an object', () => {
    expect(() => matchOrigin({} as any)({ request })).toThrow(
      'InvalidOriginMatchExpression: {} is an invalid origin match expression.'
    );
  });

  it('should throw when given an number', () => {
    expect(() => matchOrigin(123 as any)({ request })).toThrow(
      'InvalidOriginMatchExpression: 123 is an invalid origin match expression.'
    );
  });
});
