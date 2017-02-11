@ECHO OFF
:: Kill all these processes
taskkill /f /IM nginx-windows.exe
taskkill /f /IM php-cgi.exe
taskkill /f /im server.exe
taskkill /f /im mongod-windows.exe

EXIT