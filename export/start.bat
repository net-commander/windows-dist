setlocal
cd /d %~dp0
cd server\windows
server.exe noob --uid=export --type=OFFLINE_RELEASE --release=true --root="..\.." %*