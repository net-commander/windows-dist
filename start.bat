setlocal
cd /d %~dp0
cd server\windows
server.exe noob --home=true --type=OFFLINE_RELEASE --release=true --root="..\.." %*
