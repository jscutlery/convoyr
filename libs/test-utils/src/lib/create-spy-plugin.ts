/* A plugin handle that just calls through the next plugin.*/
export function createSpyPlugin(
  condition: (request: any) => boolean = (request: any) => true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handle: jest.fn(({ request, next }) => next({ request }))
  };
}
