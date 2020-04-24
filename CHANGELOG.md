# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/jscutlery/convoyr/compare/v2.2.0...v3.0.0) (2020-04-24)


### Features

* ✅ `NextFn` to `NextHandler` object ([530cb97](https://github.com/jscutlery/convoyr/commit/530cb97dab4404bfc9e2ad5b035a855a73b95a39))


### BREAKING CHANGES

* The `NextFn` type used for calling the next plugin and
the final HTTP handler is removed in favor of an object following the `NextHandler` interface.





# [2.2.0](https://github.com/jscutlery/convoyr/compare/v2.1.1...v2.2.0) (2020-04-23)

### Bug Fixes

- 📦 update angular monorepo to v9.1.3 ([fb3a984](https://github.com/jscutlery/convoyr/commit/fb3a984655ebbb0df68b43d32efcd57bc952a615))

### Features

- **core:** ✅ add `and` operator ([6fee476](https://github.com/jscutlery/convoyr/commit/6fee476711e942680cfaea6d2c05bf5c11437c18))
- **core:** ✅ add `not` operator ([1375107](https://github.com/jscutlery/convoyr/commit/1375107e16852f2b896872254af55be5e9174fc3))
- **core:** ✅ add `or` operator ([e94339f](https://github.com/jscutlery/convoyr/commit/e94339f2aca3b75be1859a589d409d9f011dd617))
- **core:** ✅ handle async conditions in `and` operator ([d0574a0](https://github.com/jscutlery/convoyr/commit/d0574a0074685841bbd778c1cad2193673b3b40e))
- **core:** ✅ handle async conditions in `or` operator ([172b321](https://github.com/jscutlery/convoyr/commit/172b32116249d8a0de01d541c4ded4eae10199b8))

## [2.1.1](https://github.com/jscutlery/convoyr/compare/v2.1.0...v2.1.1) (2020-04-16)

### Bug Fixes

- 📦 update angular monorepo to v9.1.2 ([a5a5b8f](https://github.com/jscutlery/convoyr/commit/a5a5b8f3688f98122d3e53167d3a975f076d80f8))
- 📦 update angularmaterial monorepo to v9.2.1 ([332b8f2](https://github.com/jscutlery/convoyr/commit/332b8f2aa625d8d6ec2d9642adcb07a89070e79f))

# [2.1.0](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.1.0) (2020-04-11)

### Bug Fixes

- **plugin-auth:** 🐞 don't send token if null or undefined ([b9eacd5](https://github.com/jscutlery/convoyr/commit/b9eacd585cb06b36d8e9e21cdf79a07c16a9258d))
- **plugin-auth:** 🐞 fix token nullish stream value ([afb73d7](https://github.com/jscutlery/convoyr/commit/afb73d70fcf38fd3bdcc4bf4aae8e036e8c7fb57))
- **plugin-auth:** 🐞 forward error instead of silently fail ([135db10](https://github.com/jscutlery/convoyr/commit/135db100e52e451dc7fe4e216af1fb14af9034ea))
- **sandbox:** 🐞 fix routing ([cf8acb2](https://github.com/jscutlery/convoyr/commit/cf8acb2a0b6c1b0c76ccf079ae3a1ee1f0f96bf1))
- **sandbox:** 🐞 fix tokens endpoint url ([9f4b423](https://github.com/jscutlery/convoyr/commit/9f4b4237e47f3e63609c3522859961b02ed11f7f))

### Features

- **plugin-auth:** ✅ make sure we are always using the latest token ([e1e313d](https://github.com/jscutlery/convoyr/commit/e1e313d1e1a1361cbcf78fac08c99dc7eaa42705))
- **sandbox:** ✅ add IsSignedIn guard ([af84e1e](https://github.com/jscutlery/convoyr/commit/af84e1e5af66f2145c000ed027aaabd5f54204ca))
- **sandbox:** ✅ add mark token as expired ([d20e45a](https://github.com/jscutlery/convoyr/commit/d20e45a28bd7194f80df12f5e178fd810b8c2aab))
- **sandbox:** ✅ redirect to bikes after signin ([db1a1d3](https://github.com/jscutlery/convoyr/commit/db1a1d32cab9126d841451fd199c12f297d25251))
- **sandbox:** ✅ redirect to signin if unauthenticated ([5085a9c](https://github.com/jscutlery/convoyr/commit/5085a9c069ebb1c79cd6a39835c73352764b82d9))

## [2.0.2](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.0.2) (2020-04-08)

### Bug Fixes

- **plugin-auth:** 🐞 forward error instead of silently fail ([135db10](https://github.com/jscutlery/convoyr/commit/135db100e52e451dc7fe4e216af1fb14af9034ea))

## [2.0.1](https://github.com/jscutlery/convoyr/compare/v2.0.0...v2.0.1) (2020-04-07)

### Bug Fixes

- **plugin-auth:** 🐞 fix `onUnauthorized` function call ([fc4b030](https://github.com/jscutlery/convoyr/commit/fc4b030c1872bc6b3f4fd5ced3748099aa2e7f9e))

### Features

- **sandbox:** ✅ add auth example ([e41e199](https://github.com/jscutlery/convoyr/commit/e41e199020b40ebbe4d8970cf31d1687394bdfc0))

# [2.0.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v2.0.0) (2020-04-01)

### Bug Fixes

- **plugin-cache:** 🐞 fix build dependencies ([01c8377](https://github.com/jscutlery/convoyr/commit/01c83775382dbffc9c60526f772e29d59c88be8d))
- **plugin-cache:** 🐞 fix undefined global `Buffer` object ([9e753e5](https://github.com/jscutlery/convoyr/commit/9e753e5bd650c3ccdbbc28e80893a2f11e75df5c))
- **plugin-cache:** 🐞 handle `undefined` maxSize ([5de2e60](https://github.com/jscutlery/convoyr/commit/5de2e60a6bdf086db21877059367361ad0bf3725))
- **plugin-cache:** 🐞 use `bufferFrom` polyfill ([25a98b5](https://github.com/jscutlery/convoyr/commit/25a98b506d1ab6ff4f77e89d5b9aeb39e32ce324))
- **plugin-cache:** 🐞 whitelist buffer package ([954ed61](https://github.com/jscutlery/convoyr/commit/954ed61572d74a833075093b10dbe630113a2a3d))

### Features

- ✅ rename `condition` to `shouldHandleRequest` ([9e93b5d](https://github.com/jscutlery/convoyr/commit/9e93b5d20e4c3cb0ef94b5b6a1440565b685b6c7))
- **angular:** ✅ use dynamic configuration ([5ab1596](https://github.com/jscutlery/convoyr/commit/5ab1596cc1099e2a78158a9af9ec94ae83943ce4))
- **core:** ✅ deprecate `condition` in favor of `shouldHandleRequest` ([11b7fbb](https://github.com/jscutlery/convoyr/commit/11b7fbb9b818b15699c3c441245b3a299c6f4851))
- **plugin-auth:** ✅ add auth plugin: add onUnauthorized callback ([f9f25be](https://github.com/jscutlery/convoyr/commit/f9f25bed1650b603d987c5088a909fe27fc1e1e6))
- **plugin-cache:** ✅ handle human readable bytes `maxSize` ([ebf2bdc](https://github.com/jscutlery/convoyr/commit/ebf2bdcb4d0e2f040f9af9ffa8f15758828d94cd))
- **plugin-retry:** ✅ add plugin-retry ([1317aaf](https://github.com/jscutlery/convoyr/commit/1317aaf601484224a1f6adb6f3c33038ae4d807a))

### BREAKING CHANGES

- rename `condition` to `shouldHandleRequest`

Co-authored-by: Edouard Bozon <bozonedouard@gmail.com>

# [1.2.0](https://github.com/jscutlery/convoyr/compare/v1.1.0...v1.2.0) (2020-03-31)

### Features

- **angular:** ✅ use dynamic configuration ([5ab1596](https://github.com/jscutlery/convoyr/commit/5ab1596cc1099e2a78158a9af9ec94ae83943ce4))
- **core:** ✅ deprecate `condition` in favor of `shouldHandleRequest` ([11b7fbb](https://github.com/jscutlery/convoyr/commit/11b7fbb9b818b15699c3c441245b3a299c6f4851))
- **plugin-auth:** ✅ add auth plugin: add onUnauthorized callback ([f9f25be](https://github.com/jscutlery/convoyr/commit/f9f25bed1650b603d987c5088a909fe27fc1e1e6))

# [1.1.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v1.1.0) (2020-01-14)

### Bug Fixes

- **plugin-cache:** 🐞 fix build dependencies ([01c8377](https://github.com/jscutlery/convoyr/commit/01c83775382dbffc9c60526f772e29d59c88be8d))
- **plugin-cache:** 🐞 handle `undefined` maxSize ([5de2e60](https://github.com/jscutlery/convoyr/commit/5de2e60a6bdf086db21877059367361ad0bf3725))
- **plugin-cache:** 🐞 use `bufferFrom` polyfill ([25a98b5](https://github.com/jscutlery/convoyr/commit/25a98b506d1ab6ff4f77e89d5b9aeb39e32ce324))

### Features

- **plugin-cache:** ✅ handle human readable bytes `maxSize` ([ebf2bdc](https://github.com/jscutlery/convoyr/commit/ebf2bdcb4d0e2f040f9af9ffa8f15758828d94cd))
- **plugin-retry:** ✅ add plugin-retry ([1317aaf](https://github.com/jscutlery/convoyr/commit/1317aaf601484224a1f6adb6f3c33038ae4d807a))

# [1.0.0](https://github.com/jscutlery/convoyr/compare/v0.1.1...v1.0.0) (2020-01-06)

### Bug Fixes

- :beetle: sandbox `loggerPlugin` use handler object ([89783d9](https://github.com/jscutlery/convoyr/commit/89783d99e966c7251cad794220a735b00b06dfbd))

### Features

- **plugin-cache:** ✅ add maxSize to MemoryStorage ([f7eb752](https://github.com/jscutlery/convoyr/commit/f7eb75250b189d9398070574e6b19a9f5a36aa38))
- ✅ add max size ([9a32e30](https://github.com/jscutlery/convoyr/commit/9a32e304307beed7731b49bde765397cb4d29130))
- ✅ handle plugin-cache request condition ([9e1bff6](https://github.com/jscutlery/convoyr/commit/9e1bff644d3b4cb4b52ec2e20bb793fa050f7517))
- ✅ add cache max age ([8d5db1c](https://github.com/jscutlery/convoyr/commit/8d5db1c8ee7462bb77cc9ac505fbe72fdb656a62))
- ✅ make storage async ([a632de9](https://github.com/jscutlery/convoyr/commit/a632de92f3ded22d92448548cc2f756a699e499f))

* feat!: :white_check_mark: use an object as plugin handler ([47a5e9f](https://github.com/jscutlery/convoyr/commit/47a5e9f87d9c4256578a005d77516cb2d7034327))

### BREAKING CHANGES

- the plugin handler become an object

## [0.1.1](https://github.com/jscutlery/convoyr/compare/v0.1.0...v0.1.1) (2019-11-20)

### Bug Fixes

- :beetle: remove broken imports ([607c4ea](https://github.com/jscutlery/convoyr/commit/607c4eac8ca7223219ff36358b00fc8098d01cab))

# 0.1.0 (2019-11-19)

### Bug Fixes

- :beetle: add missing `Omit` type ([8158da9](https://github.com/jscutlery/convoyr/commit/8158da9975df62ff15dbe77fa00ba53345d2ceca))
- :beetle: package dependency build ([b510752](https://github.com/jscutlery/convoyr/commit/b51075254dc2e337e3e8b5ef293156abf4bf54ff))
- :beetle: use path mapping to internally expose `_createSpyPlugin` ([9f1e845](https://github.com/jscutlery/convoyr/commit/9f1e8459738c2d0571cde0e95d4f9be19d64a440))
- 🐞 fix AOT issue "Expression form not supported" when using inline type with `@Inject` ([5a93caf](https://github.com/jscutlery/convoyr/commit/5a93caf536df1df9e01e3049cc2d8aed2f088eba))
- 🐞 fix AOT issue due to logic in `forRoot` ([9f2a093](https://github.com/jscutlery/convoyr/commit/9f2a093dda9b5f42b47fefcdefa735f1582380be))
- **deps:** update dependency core-js to v3 ([46459a7](https://github.com/jscutlery/convoyr/commit/46459a70847d5196fad6e591643c923dae86c8d6))
- **deps:** update dependency rxjs to ~6.5.0 ([5a0e80f](https://github.com/jscutlery/convoyr/commit/5a0e80f3819a7c67f9785c6d43324b79b341c427))
- **deps:** update dependency zone.js to ^0.10.0 ([feb4677](https://github.com/jscutlery/convoyr/commit/feb4677ce448297747c8bb9000992bce720620a1))
- 🐞 throw InvalidUrlError instead of crashing when given an invalid URL ([417e080](https://github.com/jscutlery/convoyr/commit/417e080346ba37ebcd54d10403c82fe2abcf4392))

### Features

- :white_check_mark: handle query string in store key ([9d58a36](https://github.com/jscutlery/convoyr/commit/9d58a366d053dae62f1ca093a2be6e6d5bf4fe8f))
- :white_check_mark: refine metadata with `createdAt` property ([422b221](https://github.com/jscutlery/convoyr/commit/422b2216623ada34e14bd08a7b3dd2b32b879e22))
- :white_check_mark: split packages ([77b22c0](https://github.com/jscutlery/convoyr/commit/77b22c01f5de59f02aa28e8bd3fd46e2c49d3bff))
- :white_check_mark: use more generic interface for `CacheProvider` ([e88a28e](https://github.com/jscutlery/convoyr/commit/e88a28ef6a990848e0a3d8faf6bbdd65ea6ba967))
- ✅ add method matcher ([68c6088](https://github.com/jscutlery/convoyr/commit/68c60885c9ec4afc7903ee25b58b9418721bf736))
- ✅ fail if matchOrigin is given an valid match expression ([5cafd3b](https://github.com/jscutlery/convoyr/commit/5cafd3ba42ab68742f4f70d905764e9cd35b18e5))
- ✅ handle async plugin condition ([2c6676b](https://github.com/jscutlery/convoyr/commit/2c6676b16a138ee093b2f70146dd21ce5a744a7b))
- ✅ throw error if invalid url is given to `getOrigin` ([a6a7aac](https://github.com/jscutlery/convoyr/commit/a6a7aacf3e3ea60cfa751f7c9df23be0eb42f2ad))

### Reverts

- Revert "Pin dependencies" ([dd3149a](https://github.com/jscutlery/convoyr/commit/dd3149a587ae63f9d6a99a6801d87b8f90780389))
- Revert "Pin dependencies" ([0dc45bc](https://github.com/jscutlery/convoyr/commit/0dc45bc7838ee46677a0fc8cb2241c5427873fbd))
- Revert "Pin dependencies" ([d311d4a](https://github.com/jscutlery/convoyr/commit/d311d4ad177d46493cc5dff4897726d7339acde4))

## 0.0.1 (2019-10-11)

**Note:** Version bump only for package convoyr
