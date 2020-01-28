/**
 * A plugin handle that just calls through the next plugin.
 * @hack use unknown type of request:
 *   If `HttpExtRequest` imported it fails building the core library.
 *   It works if `createSpyPlugin` import path is modified to `lib/core/testing` in libs/core/src/lib/http-ext.spec.ts, but it's pretty ugly... 😕
 *   Somehow, `http-ext.spec.ts` is considered part of `@http-ext/core` by ng-packagr.
 */
export function createSpyPlugin(
  condition: (request: unknown) => boolean = () => true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request }))
    }
  };
}
