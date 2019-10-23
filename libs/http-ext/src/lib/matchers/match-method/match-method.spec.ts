import { createRequest, HttpExtRequest } from '../../request';
import { matchMethod } from './match-method';

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
