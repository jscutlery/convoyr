# Custom Plugins

You can write your own custom plugins.

## Custom Plugins Examples

### Add a custom header for requests sent to a specific origin

```ts
const addHeaders = (headers) => ({
  handle({ request, next }) {
    headers = { ...request.headers, ...headers };
    request = { ...request, headers };
    return next.handle({ request });
  },
});

@NgModule({
  imports: [
    ConvoyrModule.forRoot({
      plugins: [
        {
          shouldHandleRequest: matchOrigin('https://github.com'),
          handler: addHeaders({ 'x-my-headers': '🚀' }),
        },
      ],
    }),
  ],
})
export class AppModule {}
```

### Reject requests to unknown origins

```ts
@NgModule({
  imports: [
    ConvoyrModule.forRoot({
      plugins: [
        {
          shouldHandleRequest: not(matchOrigin('https://github.com')),
          handler: {
            handle({ request, next }) {
              return throwError(
                `🛑 requesting invalid origin. url: ${request.url}`
              );
            },
          },
        },
      ],
    }),
  ],
})
export class AppModule {}
```

## Implementing Custom Plugins

A plugin is an object that follows the `ConvoyrPlugin` interface:

```ts
export interface ConvoyrPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
```

All the logic is hold by the `handler` object which follow the following interface:

```ts
export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<ConvoyrResponse>;
}
```

The `handle` method lets you manipulate request and the response stream as well before passing it to the next plugin using the `next` function. The `SyncOrAsync<ConvoyrResponse>` allows you to deal with:

- synchronous response,
- Promise based response,
- Observable based response.

Note that Convoyr internally transforms the response to a stream using Observables. Here is an example using a literal `handler` object and returns a Promise based response:

```ts
import { ConvoyrPlugin, PluginHandler } from '@convoyr/core';
import { LoggerHandler } from './handler';

export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: ({ request }) => request.url.includes('api.github.com')
    handler: {
      async handle({ request, next }) {
        const response = await next.handle({ request }).toPromise();
        console.log({ response });
        return response;
      }
    }
  };
}
```

In this example the `handler` will be executed only if the URL includes `api.github.com`. Note that the `shouldHandleRequest` function is optional. Learn more about [conditional handling](https://github.com/jscutlery/convoyr#conditional-handling).

The following example uses a class to implement the `PluginHandler` interface and an Observable for handling the response:

```ts
import { PluginHandler, PluginHandlerArgs } from '@convoyr/core';
import { tap } from 'rxjs/operators';

export class LoggerHandler implements PluginHandler {
  handle({ request, next }: PluginHandlerArgs) {
    return next.handle({ request }).pipe(
      tap((response) => {
        console.log({ response });
      })
    );
  }
}

export function createLoggerPlugin(): ConvoyrPlugin {
  return { handler: new LoggerHandler() };
}
```

By piping the `next` function you can manipulate the response stream and leverage reactive powers using RxJS operators.

## Conditional handling

The `shouldHandleRequest` function checks for each outgoing request if the plugin handler should be executed:

```ts
export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: ({ request }) => {
      return request.method === 'GET' && request.url.includes('api.github.com');
    },
    handler: new LoggerHandler(),
  };
}
```

Here only `GET` requests with URL including `api.github.com` will be handled by the plugin.

Note that the `shouldHandleRequest` function is optional, but if not provided Convoyr will execute the plugin handler for **all outgoing requests**. For this reason it's better to provide the function and to be strict as possible. See the section below for handling exactly what you need using built-in matchers.

### Matchers

Matchers are utils functions for conditional request handling.

- _matchResponseType:_ `matchResponseType(expression: ResponseTypeMatchExpression) => RequestCondition`
- _matchMethod:_ `matchMethod(expression: MethodMatchExpression) => RequestCondition`
- _matchOrigin:_ `matchOrigin(expression: OriginMatchExpression) => RequestCondition`
- _matchPath:_ `matchOrigin(expression: string) => RequestCondition`

```ts
import { matchOrigin, ConvoyrPlugin } from '@convoyr/core';

export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: matchOrigin('https://secure-origin.com'),
    handler: new LoggerHandler(),
  };
}
```

Here only requests matching `https://secure-origin.com` origin will be logged.

### Combiners

Combiners are used to compose with matchers.

- _and:_ `and(...predicates: RequestCondition[]) => RequestCondition`
- _or:_ `or(...predicates: RequestCondition[]) => RequestCondition`
- _not:_ `not(predicate: RequestCondition) => RequestCondition`

```ts
import { matchOrigin, matchMethod, and, ConvoyrPlugin } from '@convoyr/core';

export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: and(
      matchMethod('GET'),
      matchOrigin('https://secure-origin.com'),
      matchOrigin('https://another-secure-origin.com')
    ),
    handler: new LoggerHandler(),
  };
}
```

Here only `GET` requests from `https://secure-origin.com` and `https://another-secure-origin.com` origins will be logged.
