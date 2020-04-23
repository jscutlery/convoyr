import { ConvoyPlugin, and, matchMethod, matchOrigin } from '@convoy/core';

export function createLoggerPlugin(): ConvoyPlugin {
  return {
    shouldHandleRequest: and(
      matchMethod('GET'),
      matchOrigin('http://localhost:3333')
    ),
    handler: {
      handle({ request, next }) {
        console.log(`[${request.method}] ${request.url}`);
        return next({ request });
      },
    },
  };
}
