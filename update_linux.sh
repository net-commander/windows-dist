#!/usr/bin/env bash

git clean -f
git reset --hard origin
git pull
git lfs pull
git clean -f
echo "You can close this window now"


