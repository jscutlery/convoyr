import { createPluginTester } from '@http-ext/core/testing';
import { schema } from 'normalizr';

import { NormalizerHandler } from './normalizer-handler';
import { createRequest } from '@http-ext/core';
import { of } from 'rxjs';

const data = {
  users: [
    { id: 1, name: 'Pacard' },
    { id: 2, name: 'Whymper' },
  ],
};

describe('NormalizerHandler', () => {
  it('should normalize data', async () => {
    const user = new schema.Entity('users');
    const usersSchema = { users: [user] };
    const schemas = { '/somewhere': usersSchema };

    const pluginTester = createPluginTester({
      handler: new NormalizerHandler({ schemas }),
    });

    pluginTester.next.mockReturnValue(of(data));

    const request = createRequest({ url: '/somewhere' });
    const response = await pluginTester.handle({ request }).toPromise();

    expect(response).toEqual(
      expect.objectContaining({
        result: { users: [1, 2] },
        entities: {
          users: {
            '1': { id: 1, name: 'Pacard' },
            '2': { id: 2, name: 'Whymper' },
          },
        },
      })
    );
  });
});
