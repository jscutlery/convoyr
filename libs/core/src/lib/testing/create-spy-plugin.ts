import { HttpExtRequest } from '../request';

/* A plugin handle that just calls through the next plugin.*/
export function _createSpyPlugin(
  condition: (request: HttpExtRequest) => boolean = () => true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handler: {
      handle: jest.fn(({ request, next }) => next({ request }))
    }
  };
}
