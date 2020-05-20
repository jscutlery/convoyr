import { ConvoyrRequest, createRequest, ResponseType } from '../../request';
import { matchResponseType } from './match-response-type';
import { ResponseTypeMatchExpression } from './match-response-type-expression';

describe.each<[ResponseType, ResponseTypeMatchExpression, boolean]>([
  /* Using a string */
  ['json', 'json', true],
  ['json', 'blob', false],

  /* Using an Array */
  ['text', ['text', 'arraybuffer'], true],
  ['arraybuffer', ['text'], false],
])(
  'matchResponseType with type: %p and matcher: %p => %p',
  (responseType, matcher, expected) => {
    it('should check response type', () => {
      const request = createRequest({ url: 'https://test.com', responseType });
      expect(matchResponseType(matcher)({ request })).toBe(expected);
    });
  }
);

describe('matchResponseType', () => {
  let request: ConvoyrRequest;

  beforeEach(() => (request = createRequest({ url: 'https://test.com' })));

  it('should throw when given an object', () => {
    expect(() => matchResponseType({} as any)({ request })).toThrow(
      'InvalidResponseTypeMatchExpression: {} is an invalid origin match expression.'
    );
  });

  it('should throw when given an number', () => {
    expect(() => matchResponseType(123 as any)({ request })).toThrow(
      'InvalidResponseTypeMatchExpression: 123 is an invalid origin match expression.'
    );
  });
});
