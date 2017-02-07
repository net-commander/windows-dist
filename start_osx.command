cd -- "$(dirname "$0")"

if [ ! -d "../Contents/Frameworks" ]; then
    cd ../Contents
    tar xvf frameworks.tar
    cd ../Resources
fi

cd server/osx_64

./server noob --file=start.js