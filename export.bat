ECHO OFF

setlocal
cd /d %~dp0

cd server/windows

set MYDIR=%1
set MYDIR1=%MYDIR:~0,-0%

for %%f in (%MYDIR1%) do set myfolder=%%~nxf

server.exe noob --file=export.js --system="..\\..\\data" --user="%1" --target="..\\..\\exported" --dist="..\\..\\server" --client="..\\..\\Code\\client\\" %*