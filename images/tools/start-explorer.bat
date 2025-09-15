@echo off
echo Starting File Explorer Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server on http://localhost:3001
echo.
echo After the server starts:
echo 1. Open imageFinder.html in your browser
echo 2. You can now browse your entire file system!
echo.
echo Press Ctrl+C to stop the server
echo.

node fileExplorerServer.js