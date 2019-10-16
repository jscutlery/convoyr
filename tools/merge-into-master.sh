#!/bin/sh

set -e

if [ $# -eq 0 ]
then
  echo "Usage:"
  echo "    $0 commit-ish"
  echo
  echo "Ex. $0 develop"
  echo "Ex. $0 0123abc..."
  echo
  exit 1
fi

set -x

# Update master.
git checkout master
git pull

# Merge into master only if fast-forward.
git merge --ff-only "$1"

# Push master.
git push

# Go back to develop.
git checkout develop
