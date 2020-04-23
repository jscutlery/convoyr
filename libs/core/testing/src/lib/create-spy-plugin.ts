import { ConvoyRequest } from '@convoyr/core';

/**
 * A plugin handle that just calls through the next plugin.
 */
export function createSpyPlugin(
  shouldHandleRequest: (request: ConvoyRequest) => boolean = () => true
) {
  return {
    shouldHandleRequest: jest.fn(({ request }) => shouldHandleRequest(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request })),
    },
  };
}
