#!/usr/bin/env node

const exec = require('child_process').execSync;

const execSync = (command) => exec(command, { stdio: 'inherit' });

/* Create new release */
execSync('lerna version --no-push --conventional-commits --yes');

/* Build all libraries */
execSync('ng build core --prod');
execSync('ng build angular --prod');
execSync('ng build plugin-auth --prod');
execSync('ng build plugin-retry --prod');
execSync('ng build plugin-cache --prod');

/* Publish to NPM */
execSync('yarn workspaces run publish --non-interactive --access public');

/* Update `latest` tag and push to GitHub */
execSync('git tag -d latest && git tag latest && git push --follow-tags');
