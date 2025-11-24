@echo off
echo ========================================
echo Is Extension Working? Quick Check
echo ========================================
echo.

echo CHECK 1: Is extension installed?
echo Looking in extensions folder...
if exist "%USERPROFILE%\.vscode\extensions\wb-component-navigator" (
    echo ✓ YES - Extension folder exists
    echo   Location: %USERPROFILE%\.vscode\extensions\wb-component-navigator
) else (
    echo ✗ NO - Extension folder NOT found
    echo   Run MANUAL-INSTALL.bat first!
    goto :end
)
echo.

echo CHECK 2: Are compiled files present?
if exist "%USERPROFILE%\.vscode\extensions\wb-component-navigator\client\out\extension.js" (
    echo ✓ YES - client\out\extension.js exists
) else (
    echo ✗ NO - client\out\extension.js missing
    echo   Extension won't work without this!
)

if exist "%USERPROFILE%\.vscode\extensions\wb-component-navigator\server\out\server.js" (
    echo ✓ YES - server\out\server.js exists  
) else (
    echo ✗ NO - server\out\server.js missing
    echo   Extension won't work without this!
)
echo.

echo CHECK 3: VS Code running?
tasklist /FI "IMAGENAME eq Code.exe" 2>NUL | find /I /N "Code.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ YES - VS Code is currently running
    echo.
    echo   Close ALL VS Code windows and reopen for extension to load!
) else (
    echo ✗ NO - VS Code is not running
    echo.
    echo   Open VS Code and open folder: C:\Users\jwpmi\Downloads\AI\wb
)
echo.

echo ========================================
echo SUMMARY
echo ========================================
echo.
echo If all checks passed:
echo 1. Close ALL VS Code windows completely
echo 2. Open VS Code
echo 3. File → Open Folder → C:\Users\jwpmi\Downloads\AI\wb
echo 4. Wait 10 seconds
echo 5. Look in LEFT SIDEBAR below EXPLORER
echo 6. Should see: WB COMPONENTS
echo.
echo If checks failed:
echo 1. Run MANUAL-INSTALL.bat
echo 2. Make sure SETUP.bat was run to compile files
echo 3. Then follow steps above
echo.

:end
pause
