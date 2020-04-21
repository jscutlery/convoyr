import { createRequest, RequestArgs } from '../../request';
import { RequestCondition } from '../../plugin';
import { matchOrigin, matchMethod } from '..';
import { and } from './and';

describe.each<[RequestArgs<unknown>, RequestCondition[], boolean]>([
  [
    { url: 'https://test.com', method: 'GET' },
    [matchOrigin('https://test.com'), matchMethod('GET')],
    true,
  ],
  [
    { url: 'https://test.com', method: 'GET', responseType: 'json' },
    [
      matchOrigin('https://test.com'),
      ({ request }) => request.responseType === 'json',
    ],
    true,
  ],
  [
    { url: 'https://test.com', method: 'GET' },
    [matchOrigin('https://wrong.com'), matchMethod('POST')],
    false,
  ],
  [
    { url: 'https://test.com', method: 'GET', responseType: 'arraybuffer' },
    [
      matchOrigin('https://test.com'),
      ({ request }) => request.responseType === 'json',
    ],
    false,
  ],
])('operator: and, index: %#', (requestArgs, requestCondition, expected) => {
  it('should determines whether all matchers returns true', () => {
    const request = createRequest({ ...requestArgs });
    expect(and(...requestCondition)({ request })).toBe(expected);
  });
});
