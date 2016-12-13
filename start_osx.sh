#!/usr/bin/env bash
cd -- "$(dirname "$0")"

if [ ! -d "../Contents/Frameworks" ]; then
    cd ../Contents
    tar xvf frameworks.tar
    cd ../Resources
fi


cd server/nodejs

./server noob --file=start.js

