# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.1.0](https://github.com/jscutlery/http-ext/compare/v1.0.0...v1.1.0) (2020-01-14)


### Bug Fixes

* **plugin-cache:** 🐞 fix build dependencies ([01c8377](https://github.com/jscutlery/http-ext/commit/01c83775382dbffc9c60526f772e29d59c88be8d))
* **plugin-cache:** 🐞 handle `undefined` maxSize ([5de2e60](https://github.com/jscutlery/http-ext/commit/5de2e60a6bdf086db21877059367361ad0bf3725))
* **plugin-cache:** 🐞 use `bufferFrom` polyfill ([25a98b5](https://github.com/jscutlery/http-ext/commit/25a98b506d1ab6ff4f77e89d5b9aeb39e32ce324))


### Features

* **plugin-cache:** ✅ handle human readable bytes `maxSize` ([ebf2bdc](https://github.com/jscutlery/http-ext/commit/ebf2bdcb4d0e2f040f9af9ffa8f15758828d94cd))





# [1.0.0](https://github.com/jscutlery/http-ext/compare/v0.1.1...v1.0.0) (2020-01-06)


### Features

* **plugin-cache:** ✅ add maxSize to MemoryStorage ([f7eb752](https://github.com/jscutlery/http-ext/commit/f7eb75250b189d9398070574e6b19a9f5a36aa38))
* ✅  handle plugin-cache request condition ([9e1bff6](https://github.com/jscutlery/http-ext/commit/9e1bff644d3b4cb4b52ec2e20bb793fa050f7517))


* feat!: :white_check_mark: use an object as plugin handler ([47a5e9f](https://github.com/jscutlery/http-ext/commit/47a5e9f87d9c4256578a005d77516cb2d7034327))


### BREAKING CHANGES

* the plugin handler become an object





## [0.1.1](https://github.com/jscutlery/http-ext/compare/v0.1.0...v0.1.1) (2019-11-20)


### Bug Fixes

* :beetle: remove broken imports ([607c4ea](https://github.com/jscutlery/http-ext/commit/607c4eac8ca7223219ff36358b00fc8098d01cab))





# 0.1.0 (2019-11-19)


### Bug Fixes

* :beetle: add missing `Omit` type ([8158da9](https://github.com/jscutlery/http-ext/commit/8158da9975df62ff15dbe77fa00ba53345d2ceca))


### Features

* :white_check_mark: handle query string in store key ([9d58a36](https://github.com/jscutlery/http-ext/commit/9d58a366d053dae62f1ca093a2be6e6d5bf4fe8f))
* :white_check_mark: refine metadata with `createdAt` property ([422b221](https://github.com/jscutlery/http-ext/commit/422b2216623ada34e14bd08a7b3dd2b32b879e22))
* :white_check_mark: use more generic interface for `CacheProvider` ([e88a28e](https://github.com/jscutlery/http-ext/commit/e88a28ef6a990848e0a3d8faf6bbdd65ea6ba967))
