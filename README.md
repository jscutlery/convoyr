<div align="center">
  <h1>HttpExt</h1>
  <a href="https://github.com/jscutlery/http-ext/actions" rel="nofollow">
    <img src="https://github.com/jscutlery/http-ext/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/http-ext" rel="nofollow">
    <img src="https://badgen.net/codecov/c/github/jscutlery/http-ext" />
  </a>
  <a href="https://github.com/jscutlery/http-ext/blob/master/LICENSE" rel="nofollow">
    <img src="https://badgen.net/npm/license/@http-ext/core">
  </a>
  <a href="https://www.npmjs.com/package/@http-ext/core" rel="nofollow">
    <img src="https://badgen.net/npm/v/@http-ext/core">
  </a>
</div>

<p align="center">
  Enhanced HTTP capabilities, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

HttpExt is a **reactive** and **extensible** library built on the top of HTTP. The main building block is a **plugin** which is a simple object that let you intercept network communications in a fancy way. The goal is to provide useful behaviors to extend the power of HTTP. You can create your own plugin or directly use the built-in plugin collection to start as fast as possible.

For now this library only supports the Angular's `HttpClient` but it's planned to support the [Axios client](https://github.com/axios/axios) to run HttpExt both on the browser and the server.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                          | Description           | Goal                  | Size                                                                   |
| --------------------------------------------- | --------------------- | --------------------- | ---------------------------------------------------------------------- |
| [@http-ext/core](./libs/core)                 | Core module           | Extensibility         | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/core)         |
| [@http-ext/angular](./libs/angular)           | Angular module        | Angular compatibility | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/angular)      |
| [@http-ext/plugin-cache](./libs/plugin-cache) | Cache plugin          | Fast and reactive UI  | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-cache) |
| @http-ext/plugin-retry                        | Retry back-off plugin | Resilience            |                                                                        |
| @http-ext/plugin-authentication               | Authentication plugin | Security              |                                                                        |

## Quick start

1. Install packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular @http-ext/plugin-cache
```

2. Import the module and define plugins you want to use.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { cachePlugin } from '@http-ext/plugin-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [cachePlugin()]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

More documentation about [@http-ext/plugin-cache](./libs/plugin-cache).

## Custom plugin

You can easily create your own plugin. Plugins are plain objects that implement the `HttpExtPlugin` interface.

The `handle` function provides a way to access both `request` and `response` objects. The response is accessible through piping the `next` function. Here you can transform the response event stream as well.

```ts
import { HttpExtPlugin } from '@http-ext/core';
import { tap } from 'rxjs/operators';

export function loggerPlugin(): HttpExtPlugin {
  return {
    handle({ request, next }) {
      /* Here you can access the request. */
      console.log(`[${request.method}] ${request.url}`);

      /* By piping the next function you can manipulate the response. */
      return next({ request }).pipe(
        tap(response => {
          console.log(`[${response.status}] ${request.url}`);
        })
      );
    }
  };
}
```

It's also possible to define a plugin using an ES6 class.

```ts
import { HttpExtPlugin, HandlerArgs } from '@http-ext/core';
import { map } from 'rxjs/operators';

export class AddElapsedTimePlugin implements HttpExtPlugin {
  handle({ request, next }: HandlerArgs) {
    const startAt = performance.now();

    return next({ request }).pipe(
      map(response => {
        const elapsedTimeInMs = performance.now() - startAt;

        /* Note that you can transform the response */
        return {
          ...response,
          body: { ...response.body, elapsedTimeInMs }
        };
      })
    );
  }
}
```

Be careful when adding properties to the response's body because you can override a field and loose some data.

### Conditional handling

To select a subset of outgoing requests you can use the `condition` function. This function checks for each request if the plugin handler should be executed.

```ts
export function customPlugin(): HttpExtPlugin {
  return {
    /* Here you can access the request object and decide which request you need to handle */
    condition({ request }) {
      return request.method === 'GET' && request.url.includes('books');
    },

    handle({ request, next }) {
      /* ... */
    }
  };
}
```

The `condition` function is not required in a plugin. Be careful because if not provided HttpExt will handle the plugin for **any requests** executed through the HTTP client. For example you don't want to send an authentication token to the wrong origin for obvious security reasons.

### Matchers

A `Matcher` helps you to select requests in a safer and easier way than a raw condition as seen below.

```ts
import { matchOrigin } from '@http-ext/core';

export function customPlugin(): HttpExtPlugin {
  return {
    condition: matchOrigin('https://secure-origin.com'),

    handle({ request, next }) {
      /* ... */
    }
  };
}
```

Built-in matchers:

- `matchOrigin(arg: string | string[] | RegExp | MatchOriginPredicate)`
- `matchMethod(arg: HttpMethod | HttpMethod[])`

## Road-map

For incoming evolutions [check-out the board](https://github.com/jscutlery/http-ext/projects/1).

## Changelog

For new features or breaking changes [see the changelog](CHANGELOG.md).

## Authors

<table border="0">
  <tr>
    <td align="center">
      <a href="https://github.com/yjaaidi" style="color: white">
        <img src="https://github.com/yjaaidi.png?s=150" width="150"/>
      </a>
      <p style="margin: 0;"><strong>Younes Jaaidi</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/yjaaidi">@yjaaidi</a></p>
    </td>
    <td align="center">
      <a href="https://github.com/Edouardbozon" style="color: white">
        <img src="https://github.com/Edouardbozon.png?s=150" width="150"/>
      </a>
      <p style="margin: 0;"><strong>Edouard Bozon</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/edouardbozon">@edouardbozon</a></p>
    </td>
  </tr>
</table>

## Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

This project is MIT licensed.
