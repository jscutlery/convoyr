import { createResponse, PluginHandler, ResponseArgs } from '@http-ext/core';
import { isObservable, Observable, of } from 'rxjs';

export type TestObservableLike<T> = Observable<T> & {
  subscriptions: any[];
};

export type TestResponse =
  | ResponseArgs<unknown>
  | Observable<ConvoyrResponse>
  | TestObservableLike<unknown>;

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
