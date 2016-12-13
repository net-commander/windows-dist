setlocal
cd /d %~dp0
SET npm_config_arch=ia32
rmdir /Q /S node_modules
npm3 install --arch=ia32  2> nul
