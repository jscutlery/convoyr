<div align="center">
  <h1>http-ext</h1>
  <a href="https://github.com/jscutlery/http-ext/actions">
    <img src="https://github.com/jscutlery/http-ext/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/http-ext">
    <img src="https://codecov.io/gh/jscutlery/http-ext/branch/master/graph/badge.svg" />
  </a>
</div>

<p align="center">
  Enhanced HTTP capabilities, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

**Reactive** and **extensible** library built on the top of HTTP. The main building block is a **plugin** which is a simple function that let you intercept network communications in a fancy way. The goal is to provide useful behaviors to extend the power of HTTP. You can create your own plugin or directly use the built-in collection to start as fast as possible.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                                                           | Description           | Goal                  |
| ------------------------------------------------------------------------------ | --------------------- | --------------------- |
| [@http-ext/core](https://www.npmjs.com/package/@http-ext/core)                 | Core module           | Extensibility         |
| [@http-ext/angular](https://www.npmjs.com/package/@http-ext/angular)           | Angular module        | Angular compatibility |
| [@http-ext/plugin-cache](https://www.npmjs.com/package/@http-ext/plugin-cache) | Cache plugin          | Fast and reactive UI  |
| @http-ext/plugin-retry                                                         | Retry back-off plugin | Resilience            |
| @http-ext/plugin-authentication                                                | Authentication plugin | Security              |

## Quick start

1. Install packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular @http-ext/plugin-cache
```

Or using npm.

```bash
npm i @http-ext/core @http-ext/angular @http-ext/plugin-cache
```

2. Import `HttpExtModule` in the root module using the `forRoot` function.

```ts
import { HttpExtModule } from '@http-ext/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot(/* ... */)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

3. Define plugins and provide global configuration.

```ts
import { cachePlugin } from '@http-ext/plugin-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    /* ... */
    HttpExtModule.forRoot({
      plugins: [cachePlugin({ addCacheMetadata: true })]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Changelog

Changes are [available here](CHANGELOG.md).

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

## License

This project is MIT licensed.
