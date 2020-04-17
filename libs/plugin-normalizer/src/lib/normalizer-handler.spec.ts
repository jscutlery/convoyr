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

const user = new schema.Entity('users');
const usersSchema = { users: [user] };
const schemas = { '/somewhere': usersSchema };

describe('NormalizerHandler', () => {
  it('should normalize response', async () => {
    const pluginTester = createPluginTester({
      handler: new NormalizerHandler({ schemas }),
    });

    pluginTester.next.mockReturnValue(of(data));

    const request = createRequest({ url: '/somewhere' });
    const response = await pluginTester.handle({ request }).toPromise();

    expect(response).toEqual({
      result: { users: [1, 2] },
      entities: {
        users: {
          '1': { id: 1, name: 'Pacard' },
          '2': { id: 2, name: 'Whymper' },
        },
      },
    });
  });

  it('should return the original response when no schema found', async () => {
    const pluginTester = createPluginTester({
      handler: new NormalizerHandler({ schemas }),
    });

    pluginTester.next.mockReturnValue(of(data));

    const request = createRequest({ url: '/nowhere' });
    const response = await pluginTester.handle({ request }).toPromise();

    expect(response).toEqual(response);
  });
});
