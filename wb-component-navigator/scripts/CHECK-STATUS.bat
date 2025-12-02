@echo off
echo ========================================
echo WB Component Navigator - Diagnostics
echo ========================================
echo.

echo Checking extension status...
echo.

echo 1. Checking if extension is installed:
code --list-extensions | findstr wb-component-navigator
if %ERRORLEVEL% EQU 0 (
    echo ✓ Extension is installed
) else (
    echo ✗ Extension is NOT installed
    echo.
    echo Run INSTALL-EXTENSION.bat to install it
)
echo.

echo 2. Checking compiled files:
if exist "client\out\extension.js" (
    echo ✓ client\out\extension.js exists
) else (
    echo ✗ client\out\extension.js MISSING
)

if exist "server\out\server.js" (
    echo ✓ server\out\server.js exists
) else (
    echo ✗ server\out\server.js MISSING
)
echo.

echo 3. Checking components directory:
if exist "..\components" (
    echo ✓ Found components directory at: ..\components
    echo.
    echo Components found:
    dir /b ..\components | findstr /b "wb-"
) else (
    echo ✗ Components directory NOT found at: ..\components
    echo.
    echo Make sure you're running this from: wb-component-navigator folder
    echo And that components folder exists at: ..\components
)
echo.

echo ========================================
echo.
echo If extension is installed but not working:
echo 1. Close ALL VS Code windows
echo 2. Open: C:\Users\jwpmi\Downloads\AI\wb
echo 3. Wait 5 seconds for extension to load
echo 4. Check View ^> Output ^> "WB Component Navigator"
echo.
pause
