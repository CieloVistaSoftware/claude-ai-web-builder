@echo off
REM generate-demos-manifest.bat
REM Windows batch file to generate demos manifest
REM Double-click this file to run it

echo.
echo ========================================
echo   Demo Manifest Generator
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js...
    node generate-demos-manifest.js
    goto :end
)

REM Check if PowerShell is available (should always be on Windows)
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using PowerShell...
    powershell -ExecutionPolicy Bypass -File generate-demos-manifest.ps1
    goto :end
)

echo ERROR: Neither Node.js nor PowerShell found!
echo Please install Node.js from https://nodejs.org/
pause
exit /b 1

:end
echo.
echo ========================================
echo   Done! Refresh index.html to see updates
echo ========================================
echo.
pause
