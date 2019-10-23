import { createRequest, HttpExtRequest } from '../../request';
import { matchMethod } from './match-method';

describe.each([
  ['GET', 'GET', true],
  ['GET', 'POST', false],
  ['GET', ['GET', 'PUT'], true],
  ['GET', ['PUT', 'POST'], false]
])(
  'matchMethod with method: %p and matcher: %p => %p',
  (method, matchExpression, expected) => {
    it('should check origin', () => {
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
