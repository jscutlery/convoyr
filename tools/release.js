#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

const libraries = [
  'core',
  'angular',
  'plugin-auth',
  'plugin-cache',
  'plugin-retry',
];

/* Create new release */
execSync('lerna version --no-push --conventional-commits --yes');

/* Build all libraries */
execSync('nx affected:build --prod --all');

/* Publish to NPM */
for (const library of libraries) {
  execSync(
    'yarn publish --non-interactive --access public dist/libs/' + library
  );
}

/* Update `latest` tag and push to GitHub */
execSync('git tag -d latest && git tag latest && git push --follow-tags');
