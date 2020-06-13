import { ConvoyrPlugin, matchOrigin, not } from '@convoyr/core';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const rejectUnknownOriginsPlugin: ConvoyrPlugin = {
  shouldHandleRequest: not(matchOrigin('https://localhost:3333')),
  handler: {
    handle({ request }) {
      return throwError(`🛑 Requesting invalid origin, url: ${request.url}`);
    },
  },
};
