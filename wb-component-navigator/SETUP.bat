@echo off
echo ========================================
echo WB Component Navigator - Complete Setup
echo ========================================
echo.

echo Step 1: Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Root npm install failed
    pause
    exit /b 1
)
echo ✓ Done
echo.

echo Step 2: Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Client npm install failed
    pause
    exit /b 1
)
echo ✓ Done
echo.

echo Step 3: Compiling client...
call npx tsc
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Client compilation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Done
echo.

echo Step 4: Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Server npm install failed
    pause
    exit /b 1
)
echo ✓ Done
echo.

echo Step 5: Compiling server...
call npx tsc
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Server compilation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Done
echo.

echo ========================================
echo SUCCESS! Setup Complete!
echo ========================================
echo.
echo Files created:
if exist "client\out\extension.js" (
    echo ✓ client\out\extension.js
) else (
    echo ✗ client\out\extension.js MISSING
)

if exist "server\out\server.js" (
    echo ✓ server\out\server.js
) else (
    echo ✗ server\out\server.js MISSING
)
echo.
echo Next steps:
echo 1. Open this folder in VS Code
echo 2. Press F5 to launch the extension
echo 3. A new window will open
echo 4. In that window, open: C:\Users\jwpmi\Downloads\AI\wb
echo 5. Test by Ctrl+clicking on a component
echo.
pause
