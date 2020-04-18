import { createResponse, ConvoyrResponse, PluginHandler } from '@convoyr/core';
import { Observable, of, isObservable } from 'rxjs';

export type TestResponse = ConvoyrResponse | Observable<ConvoyrResponse>;

export function createPluginTester({ handler }: { handler: PluginHandler }) {
  const nextSpy = (response: TestResponse): any => {
    const fakeHttpResponse = isObservable(response) ? response : of(response);

    return jest.fn(() => fakeHttpResponse);
  };

  return {
    handle({
      request,
      response = createResponse({ status: 200, statusText: 'ok' }),
    }: {
      request: ConvoyrResponse;
      response?: TestResponse;
    }) {
      const next = nextSpy(response);

      /* Expose next spy in specs */
      this.next = next;

      return handler.handle({ request, next }) as Observable<ConvoyrResponse>;
    },

    next() {
      return jest.fn();
    },
  };
}
