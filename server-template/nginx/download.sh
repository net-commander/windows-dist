#!/usr/bin/env bash
#sudo apt-get install libpcre3 libpcre3-dev
wget http://nginx.org/download/nginx-1.9.13.tar.gz -O nginx-1.9.13.tar.gz
gunzip nginx-1.9.13.tar.gz
tar xvf nginx-1.9.13.tar
bash build.sh