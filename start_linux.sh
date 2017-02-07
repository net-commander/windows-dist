#!/usr/bin/env bash

chmod +x ./mongo/mongod

if [ `getconf LONG_BIT` = "64" ]
then
    cd ./server/linux_64
else
    cd ./server/linux_32
fi
chmod +x ./server

if [ -z "$DISPLAY" ]; then
    ./server noob --type=OFFLINE_RELEASE --release=true --root="../.." "$@"
else
    gnome-terminal -e "./server noob --type=OFFLINE_RELEASE --release=true --root=\"../..\" \"$@\""
fi

