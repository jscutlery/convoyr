# Commit messages convention

The JSCutlery team develops using techniques like Timeboxed TDD and TCR (Test && Commit || Revert). In other words, we commit a lot!!!

We use emojis for commits categorization:

| Type             | Example                                | When                                                                                                                         |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Work In Progress | `wip(plugin-cache): 🚧 do craziness`   | This is the commit message when working on a feature. Same message can be reused while working on the feature.               |
| Feature          | `feat(plugin-cache): ✅ add craziness` | This is the final commit when the feature is finished and you want it to appear in the changelog. It can be an empty commit. |
| Fix              | `fix(plugin-cache): 🐞 fix craziness`  | Anything that fixes a user facing bug.                                                                                       |
| Anything else    | `chore(plugin-cache): 🛠 rename stuff`  | This applies to all changes that don't bring new features or fix user facing bugs.                                           |
| Docs             | `docs(plugin-cache): 📝 add docs`      | Documentation                                                                                                                |

- Each commit type can be scoped by package name like `feat(core,plugin-cache):`, or no scope at all _(i.e. `feat:`)_ if it affects everything

- The `wip` type is allowed to be compliant with TCR

- Breaking changes should add `!` or a `BREAKING CHANGE: ...` line in the body of the commit message with the explanation next to it.

Cf. https://www.conventionalcommits.org/

# Add a new plugin

Meanwhile we provide a schematic for this, here are the steps to follow when adding a new plugin:

1. Generate library

```sh
yarn nx g @nrwl/workspace:library --publishable plugin-xyz
```

2. Setup `libs/plugin-xyz/package.json`

```json
{
  "name": "@convoyr/plugin-xyz",
  "version": "2.1.0",
  "license": "MIT",
  "private": false,
  "repository": "git@github.com:jscutlery/convoyr.git",
  "scripts": {
    "publish": "yarn publish ../../dist/libs/plugin-xyz"
  },
  "peerDependencies": {
    "@convoyr/core": "^2.0.0"
  }
}
```

3. Add test script to `package.json`

```json
{
  "scripts": {
    "test:plugin-xyz": "ng test plugin-xyz --watch"
  }
}
```

4. Codecov setup by adding the following to codecov.yml

```yaml
coverage:
  status:
    project:
      plugin-xyz:
        target: 90%
        flags: plugin-xyz
flags:
  plugin-xyz:
    paths:
      - libs/plugin-xyz/src
```

🚧 Work In Progress 🚧
