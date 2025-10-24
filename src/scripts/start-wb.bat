@echo off
echo ===== Starting Website Builder =====

echo.
echo 1. Killing any existing processes on port 8080...
node kill-port.js

echo.
echo 2. Starting HTTP server for development...
start /b cmd /c "npx http-server -p 8080"

echo.
echo 3. Starting file watcher for automatic conversion...
start /b cmd /c "node conversion/file-watcher.js"

echo.
echo 4. Opening Website Builder in your browser...
timeout /t 2 > nul
start http://localhost:8080/index.html

echo.
echo Website Builder is now running!
echo.
echo === Access URLs ===
echo.
echo - Main Page: http://localhost:8080/index.html
echo - Material Design Editor: http://localhost:8080/Working/MaterialDesign.html
echo - Website Builder: http://localhost:8080/wb-core/wb.html
echo - Converter UI: http://localhost:8080/ui/converter-ui/index.html
echo.
echo Press Ctrl+C to stop the servers and exit...
cmd /k
