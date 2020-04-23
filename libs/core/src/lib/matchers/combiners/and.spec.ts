import { readAll } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
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
    [
      'match with async conditions',
      {
        requestArgs: {
          url: 'https://test.com',
          method: 'GET',
        },
        operatorArgs: [
          (...args) => of(true),
          (...args) => Promise.resolve(true),
        ],
        expected: true,
      },
    ],
    [
      'mismatch with async conditions',
      {
        requestArgs: {
          url: 'https://test.com',
          method: 'GET',
        },
        operatorArgs: [
          (...args) => of(true),
          (...args) => Promise.resolve(false),
        ],
        expected: false,
      },
    ],
  ])('should %s', async (name, { requestArgs, operatorArgs, expected }) => {
    const request = createRequest({ ...requestArgs });
    expect(
      await readAll(and(...operatorArgs)({ request }) as Observable<boolean>)
    ).toEqual([expected]);
  });
});
