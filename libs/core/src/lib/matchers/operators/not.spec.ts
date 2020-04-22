import { createRequest, RequestArgs } from '../../request';
import { RequestCondition } from '../../plugin';
import { matchOrigin, matchMethod } from '..';
import { not } from './not';

describe.each<[RequestArgs<unknown>, RequestCondition, boolean]>([
  [{ url: 'https://test.com', method: 'GET' }, matchMethod('POST'), true],
  [
    { url: 'https://test.com', responseType: 'json' },
    matchOrigin('https://wrong.com'),
    true,
  ],
  [
    { url: 'https://test.com', method: 'GET' },
    matchOrigin('https://test.com'),
    false,
  ],
  [
    { url: 'https://test.com', method: 'GET', responseType: 'json' },
    ({ request }) => request.responseType === 'json',
    false,
  ],
])('operator: not, index: %#', (requestArgs, requestCondition, expected) => {
  it('should returns the opposite of the given matcher', () => {
    const request = createRequest({ ...requestArgs });
    expect(not(requestCondition)({ request })).toBe(expected);
  });
});
