@echo off
echo ========================================
echo Manual Extension Installation - INSIDERS
echo ========================================
echo.
echo This will copy the extension to VS Code INSIDERS extensions folder.
echo.
pause

set "SOURCE=%cd%"
set "TARGET=%USERPROFILE%\.vscode-insiders\extensions\wb-component-navigator"

echo Source: %SOURCE%
echo Target: %TARGET%
echo.

if exist "%TARGET%" (
    echo Extension folder already exists. Deleting old version...
    rmdir /S /Q "%TARGET%"
)

echo Copying extension files...
xcopy /E /I /Y "%SOURCE%" "%TARGET%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Extension Installed!
    echo ========================================
    echo.
    echo Location: %TARGET%
    echo.
    echo Next steps:
    echo 1. Close ALL VS Code Insiders windows
    echo 2. Open VS Code Insiders
    echo 3. Open folder: C:\Users\jwpmi\Downloads\AI\wb
    echo 4. Look for "WB COMPONENTS" in the sidebar
    echo.
) else (
    echo.
    echo ERROR: Failed to copy files
    echo.
)

pause
