#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

/* Build all libraries */
execSync('nx affected:build --all --with-deps --prod');

/* Publish to NPM */
execSync('lerna publish --yes');

/* Push to GitHub */
execSync('git push --follow-tags');
