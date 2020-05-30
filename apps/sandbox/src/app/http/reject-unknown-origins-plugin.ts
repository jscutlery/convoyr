import { ConvoyrPlugin, matchOrigin, not } from '@convoyr/core';
import { throwError } from 'rxjs';

export const rejectUnknownOriginsPlugin: ConvoyrPlugin = {
  shouldHandleRequest: not(matchOrigin('https://www.codamit.dev')),
  handler: {
    handle({ request }) {
      return throwError(`🛑 Requesting invalid origin, url: ${request.url}`);
    },
  },
};
