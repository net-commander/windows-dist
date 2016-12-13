## xcf-servers

This is a basic stack (php/nginx/mongod) of pre-compiled server modules for OSX/Linux/Windows/ARM-7.  

## Remarks

- This package is designed to be consumed by higher build tasks. The folder structure 
 is simple and your build task only need to grab each binary by a suffix: "osx", "linux", "arm" and "windows".
 
- This is part of the [Net-Commander](http://net-commander.com) application, the used build configurations are meant for
  low consumption and most features are disabled per server module. Please adjust your build configuration in each sub module your self. 


## Content

Notice: you must checkout all sub modules before you see all binaries!  

### 1. Pre-compiled *php-cgi* for windows/linux/osx/arm

Locations:

- **Windows:** php/php-dist-windows/

- **Linux:** php/php-dist-linux/bin/php-cgi

- **Arm-7:** php/php-dist-arm/bin/php-cgi

- **OSX:** php/php-dist-osx/bin/php-cgi

Notice: Please check after installation the php/Readme.md file for more details

### 2. Pre-compiled *nginx* for windows/linux/osx/arm

Locations:

- **Windows:** nginx/nginx.exe

- **Linux:** nginx/nginx-linux

- **Arm-7:** nginx/nginx-arm

- **OSX:** nginx/nginx-osx

Notice: Please check after installation the nginx/Readme.md file for more details

### 3. Pre-compiled *mongod* for windows/linux/osx/arm

Locations: 

- **Windows:** mongo/mongod-windows.exe

- **Linux:** mongo/mongod-linux

- **Arm-7:** mongo/mongod-arm

- **OSX:** mongo/mongod-osx

Notice: Please check after installation the mongo/Readme.md file for more details
ARM: https://groups.google.com/forum/#!msg/mongodb-dev/G-kGjZEEam0/ipGaGb_SAQAJ

## Installation

    git submodule update --init
    git submodule foreach "git checkout master ; git pull"

## Re-compile server modules (Optional)

To recompile each server module, the shell commands are mostly the same. Please check each server modules folder for its Readme.md file.

### PHP

    cd php
    bash build.sh
    
### NGINX

    cd nginx
    bash build.sh
    
### MONGO

    cd mongo
    #  Optional this repo has already the latest gzipped version
    # sh downloadSource.sh 
    bash build.sh

 
