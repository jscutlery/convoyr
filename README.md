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

Http-ext is a **pluggable library** that aims to enhance Angular's `HttpClient`. It comes with the idea of `Plugin` that allows you to intercept and transform network requests in a fancy way. Writing your own `HttpInterceptor` might be painful and error prone, that's why http-ext brings an abstraction on the top of it.

## Ecosystem

| Name                                                                           | Description  |
| ------------------------------------------------------------------------------ | ------------ |
| [@http-ext/core](https://www.npmjs.com/package/@http-ext/core)                 | Core module  |
| [@http-ext/plugin-cache](https://www.npmjs.com/package/@http-ext/plugin-cache) | Plugin Cache |

## Changelog

[View changes](CHANGELOG.md)

## License

http-ext is MIT licensed
