#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

/* Build all libraries */
execSync('nx affected:build --all --prod --parallel');

/* Publish to NPM */
execSync('lerna publish --dist-tag latest --yes');
