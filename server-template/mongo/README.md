# xcf-mongo

build &amp; script download script for embedded mongo-db

## Pre-requisites

### OSX 

    sudo port install scons 

### Debian & Friends

    sudo apt-get install scons

### Raspberry - PI

    # see https://github.com/skrabban/mongo-nonx86 and http://elsmorian.com/post/24395639198/building-mongodb-on-raspberry-pi
    sudo apt-get install git-core build-essential scons libpcre++-dev xulrunner-dev libboost-dev libboost-program-options-dev libboost-thread-dev libboost-filesystem-dev



### Installation

    sh downloadSource.sh
    bash build.sh

At this point, the mongod binary will be at ./mongod-[osx|linux|arm]
