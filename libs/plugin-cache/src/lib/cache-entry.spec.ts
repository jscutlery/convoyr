import { createResponse } from '@convoyr/core';
import { advanceTo, clear } from 'jest-date-mock';

import { createCacheEntry } from './cache-entry';

describe('createCacheEntry', () => {
  beforeEach(() => advanceTo(new Date('2020-01-13T00:00:00.000Z')));

  afterEach(() => clear());

  it('should create a dated cache entry', () => {
    const response = createResponse({ status: 200, statusText: 'Ok' });
    const cacheEntryArgs = { createdAt: new Date().toString(), response };

    expect(createCacheEntry(cacheEntryArgs)).toEqual({
      createdAt: new Date('2020-01-13T00:00:00.000Z'),
      response,
    });
  });
});
