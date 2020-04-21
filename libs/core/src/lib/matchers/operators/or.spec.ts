import { createRequest, RequestArgs } from '../../request';
import { RequestCondition } from '../../plugin';
import { matchOrigin, matchMethod } from '..';
import { or } from './or';

describe.each<[RequestArgs<unknown>, RequestCondition[], boolean]>([
  [
    { url: 'https://test.com', method: 'GET' },
    [matchOrigin('https://answer.com'), matchMethod('GET')],
    true,
  ],
  [
    { url: 'https://test.com', responseType: 'json' },
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
      matchOrigin('https://answer.com'),
      ({ request }) => request.responseType === 'json',
    ],
    false,
  ],
])('operator: or, index: %#', (requestArgs, requestCondition, expected) => {
  it('should determines whether at least one matcher returns true', () => {
    const request = createRequest({ ...requestArgs });
    expect(or(...requestCondition)({ request })).toBe(expected);
  });
});
