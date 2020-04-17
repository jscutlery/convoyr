import { HttpExtPlugin } from '@http-ext/core';
import { tap } from 'rxjs/operators';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    handler: {
      handle({ request, next }) {
        return next({ request }).pipe(
          tap((response) =>
            console.log(`${request.method} ${request.url}`, response.body)
          )
        );
      },
    },
  };
}
