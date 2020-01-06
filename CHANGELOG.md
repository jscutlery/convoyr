# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0](https://github.com/jscutlery/http-ext/compare/v0.1.1...v1.0.0) (2020-01-06)


### Bug Fixes

* :beetle: sandbox `loggerPlugin` use handler object ([89783d9](https://github.com/jscutlery/http-ext/commit/89783d99e966c7251cad794220a735b00b06dfbd))


### Features

* **plugin-cache:** ✅ add maxSize to MemoryStorage ([f7eb752](https://github.com/jscutlery/http-ext/commit/f7eb75250b189d9398070574e6b19a9f5a36aa38))
* ✅  add max size ([9a32e30](https://github.com/jscutlery/http-ext/commit/9a32e304307beed7731b49bde765397cb4d29130))
* ✅  handle plugin-cache request condition ([9e1bff6](https://github.com/jscutlery/http-ext/commit/9e1bff644d3b4cb4b52ec2e20bb793fa050f7517))
* ✅ add cache max age ([8d5db1c](https://github.com/jscutlery/http-ext/commit/8d5db1c8ee7462bb77cc9ac505fbe72fdb656a62))
* ✅ make storage async ([a632de9](https://github.com/jscutlery/http-ext/commit/a632de92f3ded22d92448548cc2f756a699e499f))


* feat!: :white_check_mark: use an object as plugin handler ([47a5e9f](https://github.com/jscutlery/http-ext/commit/47a5e9f87d9c4256578a005d77516cb2d7034327))


### BREAKING CHANGES

* the plugin handler become an object





## [0.1.1](https://github.com/jscutlery/http-ext/compare/v0.1.0...v0.1.1) (2019-11-20)


### Bug Fixes

* :beetle: remove broken imports ([607c4ea](https://github.com/jscutlery/http-ext/commit/607c4eac8ca7223219ff36358b00fc8098d01cab))





# 0.1.0 (2019-11-19)


### Bug Fixes

* :beetle: add missing `Omit` type ([8158da9](https://github.com/jscutlery/http-ext/commit/8158da9975df62ff15dbe77fa00ba53345d2ceca))
* :beetle: package dependency build ([b510752](https://github.com/jscutlery/http-ext/commit/b51075254dc2e337e3e8b5ef293156abf4bf54ff))
* :beetle: use path mapping to internally expose `_createSpyPlugin` ([9f1e845](https://github.com/jscutlery/http-ext/commit/9f1e8459738c2d0571cde0e95d4f9be19d64a440))
* 🐞 fix AOT issue "Expression form not supported" when using inline type with `@Inject` ([5a93caf](https://github.com/jscutlery/http-ext/commit/5a93caf536df1df9e01e3049cc2d8aed2f088eba))
* 🐞 fix AOT issue due to logic in `forRoot` ([9f2a093](https://github.com/jscutlery/http-ext/commit/9f2a093dda9b5f42b47fefcdefa735f1582380be))
* **deps:** update dependency core-js to v3 ([46459a7](https://github.com/jscutlery/http-ext/commit/46459a70847d5196fad6e591643c923dae86c8d6))
* **deps:** update dependency rxjs to ~6.5.0 ([5a0e80f](https://github.com/jscutlery/http-ext/commit/5a0e80f3819a7c67f9785c6d43324b79b341c427))
* **deps:** update dependency zone.js to ^0.10.0 ([feb4677](https://github.com/jscutlery/http-ext/commit/feb4677ce448297747c8bb9000992bce720620a1))
* 🐞 throw InvalidUrlError instead of crashing when given an invalid URL ([417e080](https://github.com/jscutlery/http-ext/commit/417e080346ba37ebcd54d10403c82fe2abcf4392))


### Features

* :white_check_mark: handle query string in store key ([9d58a36](https://github.com/jscutlery/http-ext/commit/9d58a366d053dae62f1ca093a2be6e6d5bf4fe8f))
* :white_check_mark: refine metadata with `createdAt` property ([422b221](https://github.com/jscutlery/http-ext/commit/422b2216623ada34e14bd08a7b3dd2b32b879e22))
* :white_check_mark: split packages ([77b22c0](https://github.com/jscutlery/http-ext/commit/77b22c01f5de59f02aa28e8bd3fd46e2c49d3bff))
* :white_check_mark: use more generic interface for `CacheProvider` ([e88a28e](https://github.com/jscutlery/http-ext/commit/e88a28ef6a990848e0a3d8faf6bbdd65ea6ba967))
* ✅ add method matcher ([68c6088](https://github.com/jscutlery/http-ext/commit/68c60885c9ec4afc7903ee25b58b9418721bf736))
* ✅ fail if matchOrigin is given an valid match expression ([5cafd3b](https://github.com/jscutlery/http-ext/commit/5cafd3ba42ab68742f4f70d905764e9cd35b18e5))
* ✅ handle async plugin condition ([2c6676b](https://github.com/jscutlery/http-ext/commit/2c6676b16a138ee093b2f70146dd21ce5a744a7b))
* ✅ throw error if invalid url is given to `getOrigin` ([a6a7aac](https://github.com/jscutlery/http-ext/commit/a6a7aacf3e3ea60cfa751f7c9df23be0eb42f2ad))


### Reverts

* Revert "Pin dependencies" ([dd3149a](https://github.com/jscutlery/http-ext/commit/dd3149a587ae63f9d6a99a6801d87b8f90780389))
* Revert "Pin dependencies" ([0dc45bc](https://github.com/jscutlery/http-ext/commit/0dc45bc7838ee46677a0fc8cb2241c5427873fbd))
* Revert "Pin dependencies" ([d311d4a](https://github.com/jscutlery/http-ext/commit/d311d4ad177d46493cc5dff4897726d7339acde4))





## 0.0.1 (2019-10-11)

**Note:** Version bump only for package http-ext
