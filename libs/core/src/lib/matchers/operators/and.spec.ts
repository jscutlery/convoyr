import { createRequest, RequestArgs } from '../../request';
import { RequestCondition } from '../../plugin';
import { matchOrigin, matchMethod } from '..';
import { and } from './and';

describe('operator: and', () => {
  it.each<
    [
      string,
      {
        requestArgs: RequestArgs<unknown>;
        operatorArgs: RequestCondition[];
        expected: boolean;
      }
    ]
  >([
    [
      'match origin and method',
      {
        requestArgs: { url: 'https://test.com', method: 'GET' },
        operatorArgs: [matchOrigin('https://test.com'), matchMethod('GET')],
        expected: true,
      },
    ],
    [
      'match origin and custom condition',
      {
        requestArgs: {
          url: 'https://test.com',
          method: 'GET',
          responseType: 'json',
        },
        operatorArgs: [
          matchOrigin('https://test.com'),
          ({ request }) => request.responseType === 'json',
        ],
        expected: true,
      },
    ],
    [
      'mismatch origin even if method matches',
      {
        requestArgs: { url: 'https://wrong.com', method: 'GET' },
        operatorArgs: [matchOrigin('https://test.com'), matchMethod('GET')],
        expected: false,
      },
    ],
    [
      'mismatch custom condition',
      {
        requestArgs: {
          url: 'https://test.com',
          method: 'GET',
          responseType: 'arraybuffer',
        },
        operatorArgs: [
          matchOrigin('https://test.com'),
          ({ request }) => request.responseType === 'json',
        ],
        expected: false,
      },
    ],
  ])('should %s', (name, { requestArgs, operatorArgs, expected }) => {
    const request = createRequest({ ...requestArgs });
    expect(and(...operatorArgs)({ request })).toBe(expected);
  });
});
