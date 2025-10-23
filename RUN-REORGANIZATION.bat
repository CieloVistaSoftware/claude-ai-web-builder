@echo off
REM ============================================================================
REM RADICAL ROOT REORGANIZATION - EXECUTION BATCH FILE
REM ============================================================================
REM Double-click this file to start the reorganization!
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🚀 RADICAL ROOT REORGANIZATION - STARTING...          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Change to project directory
cd /d C:\Users\jwpmi\Downloads\AI\wb

REM Check if PowerShell script exists
if not exist "execute-now.ps1" (
    echo ERROR: execute-now.ps1 not found!
    echo This batch file must be in: C:\Users\jwpmi\Downloads\AI\wb\
    pause
    exit /b 1
)

REM Run PowerShell script
echo Running reorganization script...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "execute-now.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                    ✅ SUCCESS! DONE!                           ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Next steps:
    echo   1. Run: npm run dev
    echo   2. Run: npm test
    echo   3. If all works: git commit
    echo.
) else (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                      ❌ ERROR OCCURRED                         ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Rollback: git checkout backup/pre-reorganization-[timestamp]
    echo.
)

pause
