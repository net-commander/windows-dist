for /f %%i in ("%0") do set curpath=%%~dpi
cd /d %curpath%

copy y:\Code\client\src\xcf\dojo\xcf.js C:\CFMaster\Code\client\src\xcf\dojo\xcf.js
copy y:\server\nodejs\build\server\nxappmain\serverbuild.js.uncompressed.js C:\CFMaster\server\windows\nxappmain\serverbuild.js
copy Y:\Code\client\src\lib\xapp\build\main_build.js C:\CFMaster\Code\client\src\lib\xapp\build\main_build.js