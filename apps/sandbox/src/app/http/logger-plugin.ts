import { HttpExtPlugin } from '@http-ext/http-ext';

export function loggerPlugin(): HttpExtPlugin {
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
