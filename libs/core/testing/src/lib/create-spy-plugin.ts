import { HttpExtRequest } from '@http-ext/core';

/**
 * A plugin handle that just calls through the next plugin.
 */
export function createSpyPlugin(
  shouldHandleRequest: (request: HttpExtRequest) => boolean = () => true
) {
  return {
    shouldHandleRequest: jest.fn(({ request }) => shouldHandleRequest(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request }))
    }
  };
}
