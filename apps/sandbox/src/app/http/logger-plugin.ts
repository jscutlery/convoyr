import { Plugin } from '@httpext/httpext';

export function loggerPlugin(): Plugin {
  return {
    condition({ request }) {
      return true;
    },
    handle({ request, next }) {
      console.log(request);
      return next({ request });
    }
  };
}
