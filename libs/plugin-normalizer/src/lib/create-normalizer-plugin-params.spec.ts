import { schema } from 'normalizr';
import { EMPTY } from 'rxjs';

import {
  createNormalizerPlugin,
  isGetMethodAndJsonResponseType,
} from './create-normalizer-plugin';
import { NormalizerHandler } from './normalizer-handler';

jest.mock('./normalizer-handler');

describe('NormalizerPlugin', () => {
  const mockNormalizerHandler = NormalizerHandler as jest.Mock;

  it('should create the normalizer handler with default options', () => {
    const schemaDictionary = {
      '/somewhere': { foo: [new schema.Entity('foo')] },
    };

    const plugin = createNormalizerPlugin({
      schemas: schemaDictionary,
    });

    mockNormalizerHandler.mockReturnValue(EMPTY);

    expect(plugin.shouldHandleRequest).toBe(isGetMethodAndJsonResponseType);
    expect(NormalizerHandler).toHaveBeenCalledWith({
      schemas: schemaDictionary,
    });
  });
});
