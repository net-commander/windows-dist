#!/usr/bin/env bash

VERSION_STRING=1.9.13
NGINX_SOURCE=$(pwd)/nginx-$VERSION_STRING

if [ ! -d "$NGINX_SOURCE" ]; then
    echo "Extract to " $NGINX_SOURCE
    tar xf ./nginx-$VERSION_STRING.tar
fi


lowercase(){
    echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/"
}

OS=`lowercase \`uname\``
KERNEL=`uname -r`
MACH=`uname -m`
ARCH='';

if [ $MACH == "i686" ]; then
 ARCH="_32"
fi

if [ $MACH == "x86_64" ]; then
 ARCH="_64"
fi

set LD_OPTS="--with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro'"

if [ "{$OS}" == "windowsnt" ]; then
    OS=windows
elif [ "{$OS}" == "darwin" ]; then
    OS=mac
else
    OS=`uname`

    if [ $OS == "Darwin" ] ; then
        OS="osx"
    fi

    if [ $MACH == "armv7l" ] ; then
        OS="arm"
    fi

    if [ "${OS}" = "SunOS" ] ; then
        OS=Solaris
        ARCH=`uname -p`
        OSSTR="${OS} ${REV}(${ARCH} `uname -v`)"
    elif [ "${OS}" = "AIX" ] ; then
        OSSTR="${OS} `oslevel` (`oslevel -r`)"
    elif [ "${OS}" = "Linux" ] ; then
        if [ -f /etc/redhat-release ] ; then
            DistroBasedOn='RedHat'
            DIST=`cat /etc/redhat-release |sed s/\ release.*//`
            PSUEDONAME=`cat /etc/redhat-release | sed s/.*\(// | sed s/\)//`
            REV=`cat /etc/redhat-release | sed s/.*release\ // | sed s/\ .*//`
        elif [ -f /etc/SuSE-release ] ; then
            DistroBasedOn='SuSe'
            PSUEDONAME=`cat /etc/SuSE-release | tr "\n" ' '| sed s/VERSION.*//`
            REV=`cat /etc/SuSE-release | tr "\n" ' ' | sed s/.*=\ //`
        elif [ -f /etc/mandrake-release ] ; then
            DistroBasedOn='Mandrake'
            PSUEDONAME=`cat /etc/mandrake-release | sed s/.*\(// | sed s/\)//`
            REV=`cat /etc/mandrake-release | sed s/.*release\ // | sed s/\ .*//`
        elif [ -f /etc/debian_version ] ; then
            DistroBasedOn='Debian'
            DIST=`cat /etc/lsb-release | grep '^DISTRIB_ID' | awk -F=  '{ print $2 }'`
            PSUEDONAME=`cat /etc/lsb-release | grep '^DISTRIB_CODENAME' | awk -F=  '{ print $2 }'`
            REV=`cat /etc/lsb-release | grep '^DISTRIB_RELEASE' | awk -F=  '{ print $2 }'`
        fi
        if [ -f /etc/UnitedLinux-release ] ; then
            DIST="${DIST}[`cat /etc/UnitedLinux-release | tr "\n" ' ' | sed s/VERSION.*//`]"
        fi
        OS=`lowercase $OS`
        DistroBasedOn=`lowercase $DistroBasedOn`
        readonly OS
        readonly DIST
        readonly DistroBasedOn
        readonly PSUEDONAME
        readonly REV
        readonly KERNEL
        readonly MACH
    fi

fi

set -x
echo 'Build Nginx ' $OS$ARCH;
cd $NGINX_SOURCE

make clean
./configure --with-cc-opt='-g -O2 -fstack-protector --param=ssp-buffer-size=4 -Wformat -Werror=format-security -D_FORTIFY_SOURCE=2' --prefix=./ --conf-path=conf/nginx_linux.conf --http-log-path=access.log --error-log-path=error.log --lock-path=./nginx.lock --pid-path=nginx.pid --http-client-body-temp-path=temp/body --http-fastcgi-temp-path=temp/fastcgi --http-proxy-temp-path=temp/proxy --http-scgi-temp-path=temp/scgi --http-uwsgi-temp-path=temp/uwsgi --with-debug --with-pcre-jit --with-ipv6 --with-http_stub_status_module --with-http_realip_module --with-http_addition_module --with-http_gzip_static_module --with-http_sub_module

make
set -x
cp ./objs/nginx ../nginx-$OS$ARCH
chmod +x ../nginx-$OS$ARCH

git add ../nginx-$OS$ARCH
git commit -m="nginx binary compiled"
git push
