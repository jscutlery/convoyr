import { createResponse } from '@http-ext/core';
import { advanceTo, clear } from 'jest-date-mock';

import { createCacheEntry } from './cache-entry';

describe('createCacheEntry', () => {
  afterEach(() => clear());

  it('should create a dated cache entry', () => {
    const response = createResponse({ status: 200, statusText: 'Ok' });
    advanceTo(new Date('2020-01-13T00:00:00.000Z'));

    const cacheEntry = { createdAt: new Date().toString(), response };

    expect(createCacheEntry(cacheEntry)).toEqual(
      expect.objectContaining({
        createdAt: new Date('2020-01-13T00:00:00.000Z'),
        response
      })
    );
  });
});
