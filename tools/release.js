#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

/* Create new release */
execSync('lerna version --no-push --conventional-commits --yes');

/* Build all libraries */
execSync('yarn nx affected:build --all --with-deps --prod');

/* Publish to NPM */
execSync('yarn workspaces run publish --non-interactive --access public');

/* Update `latest` tag and push to GitHub */
execSync('git tag -d latest && git tag latest && git push --follow-tags');
