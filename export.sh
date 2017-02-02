#!/usr/bin/env bash

BASEDIR=$(cd $(dirname $0) && pwd)
cd $BASEDIR

if [ `getconf LONG_BIT` = "64" ]
then
    cd ./server/linux_64
else
    cd ./server/linux_32
fi

./server noob --client="../../Code/client/" --file=export.js --system="../../data" --user="$1" --target="../../exported" --dist="../../server/" "$@"

echo "Application exported to ../../exported"