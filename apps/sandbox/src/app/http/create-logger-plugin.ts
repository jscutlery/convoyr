import { ConvoyrPlugin, and, matchMethod, matchOrigin } from '@convoyr/core';

export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: and(
      matchMethod('GET'),
      matchOrigin('http://localhost:3333')
    ),
    handler: {
      handle({ request, next }) {
        console.log(`[${request.method}] ${request.url}`);
        return next.handle({ request });
      },
    },
  };
}
