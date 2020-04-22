import { matchMethod, matchOrigin } from '..';
import { RequestCondition } from '../../plugin';
import { createRequest, RequestArgs } from '../../request';
import { or } from './or';

describe('operator: or', () => {
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
      'match method while origin mismatch',
      {
        requestArgs: { url: 'https://wrong.com', method: 'GET' },
        operatorArgs: [matchOrigin('https://test.com'), matchMethod('GET')],
        expected: true,
      },
    ],
    [
      'match custom condition while origin mismatch',
      {
        requestArgs: {
          url: 'https://wrong.com',
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
      'mismatch because nothing matches',
      {
        requestArgs: { url: 'https://wrong.com', method: 'POST' },
        operatorArgs: [matchOrigin('https://test.com'), matchMethod('GET')],
        expected: false,
      },
    ],
    [
      'mismatch custom condition',
      {
        requestArgs: {
          url: 'https://wrong.com',
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
    expect(or(...operatorArgs)({ request })).toBe(expected);
  });
});
