import { createRequest, HttpExtRequest, HttpMethod } from '../../request';
import { matchMethod } from './match-method';
import { MatchMethodExpression } from './match-method-expression';

describe.each<[HttpMethod, MatchMethodExpression, boolean]>([
  ['GET', 'GET', true],
  ['GET', 'POST', false],
  ['GET', ['GET', 'PUT'], true],
  ['GET', ['PUT', 'POST'], false]
])(
  'matchMethod with method: %p and matcher: %p => %p',
  (method, matchExpression, expected) => {
    it('should check method', () => {
      const request = createRequest({ url: 'https://test.com', method });
      expect(matchMethod(matchExpression)({ request })).toBe(expected);
    });
  }
);

describe('matchMethod', () => {
  let request: HttpExtRequest;

  beforeEach(() => (request = createRequest({ url: 'https://test.com' })));

  it('should throw when given an object', () => {
    expect(() => matchMethod({} as any)({ request })).toThrow(
      'InvalidMethodMatchExpression: {} is an invalid method match expression.'
    );
  });

  it('should throw when given an number', () => {
    expect(() => matchMethod(123 as any)({ request })).toThrow(
      'InvalidMethodMatchExpression: 123 is an invalid method match expression.'
    );
  });
});
