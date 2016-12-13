#!/usr/bin/env bash
./configure \
  --prefix=$XCF \
  --with-config-file-path=$XCF/lib/ \
  --enable-bcmath \
  --enable-mbstring \
  --enable-static \
  --enable-sockets \
  --enable-cgi \
  --enable-zip \
  --without-pear \
  --with-bz2 \
  --with-curl \
  --with-zlib