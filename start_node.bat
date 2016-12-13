setlocal
cd /d %~dp0

SET DATA_ROOT=data
SET MONGO_PREFIX=_MONGO
SET "MONGO_DATA=%DATA_ROOT%\%MONGO_PREFIX%"
del "%MONGO_DATA%\mongod.lock"

cd server\windows
node start.js --web=false --export=false %*