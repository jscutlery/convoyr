import { Plugin } from '@http-ext/http-ext';

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
