import { createRequest, createResponse } from '@http-ext/core';
import { createPluginTester } from '@http-ext/core/testing';
import { schema } from 'normalizr';
import { of } from 'rxjs';

import { NormalizerHandler } from './normalizer-handler';

describe('NormalizerHandler', () => {
  const data = {
    users: [
      { id: 1, name: 'Paccard' },
      { id: 2, name: 'Whymper' },
    ],
  };
  const user = new schema.Entity('users');
  const usersSchema = { users: [user] };
  const schemas = { '/somewhere': usersSchema };
  const response$ = of(createResponse({ body: data }));

  it('should normalize response', async () => {
    const pluginTester = createPluginTester({
      handler: new NormalizerHandler({ schemas }),
    });

    pluginTester.next.mockReturnValue(response$);

    const request = createRequest({ url: '/somewhere' });
    const response = await pluginTester.handle({ request }).toPromise();

    expect(response).toEqual(
      expect.objectContaining({
        body: {
          result: { users: [1, 2] },
          entities: {
            users: {
              '1': { id: 1, name: 'Pacard' },
              '2': { id: 2, name: 'Whymper' },
            },
          },
        },
      })
    );
  });

  it('should return the original response when no schema found', async () => {
    const pluginTester = createPluginTester({
      handler: new NormalizerHandler({ schemas }),
    });

    pluginTester.next.mockReturnValue(response$);

    const request = createRequest({ url: '/nowhere' });
    const response = await pluginTester.handle({ request }).toPromise();

    expect(response).toEqual(
      expect.objectContaining({
        body: data,
      })
    );
  });
});
