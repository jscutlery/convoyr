import { HttpExtPlugin } from '@http-ext/core';

export function loggerPlugin(): HttpExtPlugin {
  return {
    handle({ request, next }) {
      console.log(`[${request.method}] ${request.url}`);
      return next({ request });
    }
  };
}
