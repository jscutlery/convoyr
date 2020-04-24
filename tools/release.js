#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

/* Build all libraries */
execSync(
  'nx affected:build --exclude sandbox --all --parallel --maxParallel 10 --prod'
);

/* Publish to NPM */
execSync('lerna publish from-package --dist-tag latest --yes');
