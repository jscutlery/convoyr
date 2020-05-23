import { createRequest, ConvoyrRequest, HttpMethod } from '../../request';
import { matchPath } from './match-path';

describe.each<[string, string, boolean]>([
  ['/api/test', '/api/test', true],
  ['/api/test/', '/api/test/', true],

  /* It should remove trailing slash */
  ['/api/test', '/api/test/', true],
  ['/api/test/', '/api/test', true],

  ['/api/test/nested', '/api/test/', false],
  ['/api/test/nested', '/api/test', false],
])(
  'matchPath with path: %p and matcher: %p => %p',
  (path, matchExpression, expected) => {
    it('should check path', () => {
      const request = createRequest({ url: 'https://test.com' + path });
      expect(matchPath(matchExpression)({ request })).toBe(expected);
    });
  }
);

describe('matchPath', () => {
  let request: ConvoyrRequest;

  beforeEach(() => (request = createRequest({ url: 'https://test.com' })));

  it('should throw when given an object', () => {
    expect(() => matchPath({} as any)({ request })).toThrow(
      'InvalidPathMatchExpression: {} is an invalid path expression.'
    );
  });

  it('should throw when given an number', () => {
    expect(() => matchPath(123 as any)({ request })).toThrow(
      'InvalidPathMatchExpression: 123 is an invalid path expression.'
    );
  });
});
