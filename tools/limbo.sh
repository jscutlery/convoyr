#!/bin/sh

while :;
do
  git pull --rebase
  git push
done