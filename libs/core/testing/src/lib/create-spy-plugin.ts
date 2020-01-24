/*
  @todo: Check why
  If `HttpExtRequest` imported it fails building the core library.
  It works if `_createSpyPlugin` import path is modified to `lib/core/testing` in libs/core/src/lib/http-ext.spec.ts, but it's pretty ugly... 😕
*/

// import { HttpExtRequest } from '@http-ext/core';

/* A plugin handle that just calls through the next plugin.*/
export function _createSpyPlugin(
  condition: (request: any) => boolean = () => true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request }))
    }
  };
}
