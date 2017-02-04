#!/usr/bin/env bash

if [ `getconf LONG_BIT` = "64" ]
then
    cd ./server/linux_64
else
    cd ./server/linux_32
fi

if [ -z "$DISPLAY" ]; then
    ./server noob --print=true --type=OFFLINE_RELEASE --release=true --root="../.." "$@"
else
    gnome-terminal -e "./server noob --print=true --type=OFFLINE_RELEASE --release=true --root=\"../..\" \"$@\""
fi

