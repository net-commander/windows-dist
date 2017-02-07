#!/usr/bin/env bash

if [ `getconf LONG_BIT` = "64" ]
then
    cd ./server/linux_64
else
    cd ./server/linux_32
fi

if [ -z "$DISPLAY" ]; then
    ./server noob --export=true --web=false --file=start.js "$@"
else
    gnome-terminal -e "./server noob --export=true --web=false --file=start.js \"$@\""
fi
