for /f %%i in ("%0") do set curpath=%%~dpi
cd /d %curpath%

copy y:\Code\client\src\xcf\dojo\xcf.js .\Code\client\src\xcf\dojo\xcf.js
copy y:\server\nodejs\build\server\nxappmain\serverbuild.js.uncompressed.js .\server\windows\nxappmain\serverbuild.js
copy Y:\Code\client\src\lib\xapp\build\main_build.js .\Code\client\src\lib\xapp\build\main_build.js
xcopy /y /s y:\server\nodejs\dist\all\_build server\windows\_build