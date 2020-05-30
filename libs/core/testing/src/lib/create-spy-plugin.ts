import {
  ConvoyrResponse,
  ConvoyrRequest,
  NextHandler,
  RequestCondition,
} from '@convoyr/core';
import { Observable } from 'rxjs';

export interface SpyPlugin {
  shouldHandleRequest: jest.Mock<
    ReturnType<RequestCondition>,
    [{ request: ConvoyrRequest }]
  >;
  handler: {
    handle: jest.Mock<
      Observable<ConvoyrResponse>,
      [{ request: ConvoyrRequest; next: NextHandler }]
    >;
  };
}

/**
 * A plugin handle that just calls through the next plugin.
 */
export function createSpyPlugin({
  shouldHandleRequest = ({ request }) => true,
}: {
  shouldHandleRequest?: RequestCondition;
} = {}): SpyPlugin {
  return {
    shouldHandleRequest: jest.fn(shouldHandleRequest),
    handler: {
      handle: jest.fn(({ request, next }) => next.handle({ request })),
    },
  };
}
