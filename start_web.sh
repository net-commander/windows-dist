#!/usr/bin/env bash
cd ./server/nodejs
node start.js --export=false --web=true "$@"