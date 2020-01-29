import { HttpExtRequest } from '@http-ext/core';

/**
 * A plugin handle that just calls through the next plugin.
 */
export function createSpyPlugin(
  condition: (request: HttpExtRequest) => boolean = () => true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request }))
    }
  };
}
