# Commit messages convention

The JSCutlery team develops using techniques like Timeboxed TDD and TCR (Test && Commit || Revert). In other words, we commit a lot!!!

We use emojis for commits categorization:

| Type             | Example | When |
| ---------------- | ------- | ------------- |
| Work In Progress | `🚧 add craziness` | This is the commit message when working on a feature. Same message can be reused while working on the feature. |
| Feature          | `feat(plugin-cache): ✅ add craziness` | This is the final commit when the feature is finished and you want it to appear in the changelog. It can be an empty commit. |
| Fix              | `fix(plugin-cache): 🐞 fix craziness` | Anything that fixes a user facing bug. |
| Docs             | `docs(plugin-cache): 📝 add docs` | Documentation |
| Chore            | `chore(plugin-cache): 🛠 rename stuff` | This applies to all changes that don't bring new features or fix user facing bugs |

Breaking changes should add a `BREAKING CHANGE: ...` line in the body of the commit message with the explanation next to it.

Cf. https://www.conventionalcommits.org/

# Add a new plugin

Meanwhile we provide a schematic for this, here are the steps to follow when adding a new plugin:

1. Generate library
```sh
ng g @nrwl/angular:lib --publishable plugin-xyz
```

2. Disable IVy for production (until Angular 10 is here)
Add `tsconfig.lib.prod.json`
```
{
  "extends": "./tsconfig.lib.json",
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
```
and build architect configuration for production in `angular.json`
```
{
  "configurations": {
    "production": {
      "tsConfig": "libs/plugin-xyz/tsconfig.lib.prod.json"
    }
  }
}
```

3. Add test script to `package.json`
```json
{
  "scripts": {
    "test:plugin-auth": "ng test plugin-xyz --watch"
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
