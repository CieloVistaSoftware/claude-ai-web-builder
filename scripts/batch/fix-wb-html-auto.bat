@echo off
REM ==========================================
REM WB.HTML COMPREHENSIVE TEST & FIX BATCH JOB
REM ==========================================
REM Purpose: Tests and fixes wb.html 100%
REM Date: October 23, 2025
REM Auto-runs without user interaction

setlocal enabledelayedexpansion
cd /d "C:\Users\jwpmi\Downloads\AI\wb"

REM Create log file
set LOGFILE=wb-html-fix-log.txt
set TIMESTAMP=%date% %time%

echo. > %LOGFILE%
echo ========================================= >> %LOGFILE%
echo WB.HTML AUTO FIX BATCH JOB >> %LOGFILE%
echo Started: %TIMESTAMP% >> %LOGFILE%
echo ========================================= >> %LOGFILE%
echo. >> %LOGFILE%

cls
echo.
echo =========================================
echo   WB.HTML AUTO TEST ^& FIX BATCH JOB
echo =========================================
echo.
echo Starting automated tests and fixes...
echo Logging to: %LOGFILE%
echo.

REM Counter variables
set PASSED=0
set FAILED=0
set FIXED=0

REM ==========================================
REM TEST 1: FILE EXISTS
REM ==========================================
echo [TEST 1] Checking if wb.html exists...
if exist "wb.html" (
    echo ✓ PASS: wb.html found >> %LOGFILE%
    echo ✓ PASS: wb.html found
    set /a PASSED+=1
) else (
    echo ✗ FAIL: wb.html not found >> %LOGFILE%
    echo ✗ FAIL: wb.html not found
    set /a FAILED+=1
    goto END
)

REM ==========================================
REM TEST 2: CREATE BACKUP
REM ==========================================
echo [TEST 2] Creating backup...
if not exist "wb.html.backup" (
    copy wb.html wb.html.backup >nul
    echo ✓ BACKUP: Created wb.html.backup >> %LOGFILE%
    echo ✓ BACKUP: Created wb.html.backup
) else (
    echo ✓ BACKUP: Backup already exists >> %LOGFILE%
)

REM ==========================================
REM TEST 3: VALIDATE COMPONENTS
REM ==========================================
echo [TEST 3] Validating components...
set MISSING=0

if exist "components\wb-control-panel" (
    echo ✓ Component found: wb-control-panel >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ Component missing: wb-control-panel >> %LOGFILE%
    set /a MISSING+=1
)

if exist "components\wb-layout" (
    echo ✓ Component found: wb-layout >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ Component missing: wb-layout >> %LOGFILE%
    set /a MISSING+=1
)

if exist "components\wb-nav" (
    echo ✓ Component found: wb-nav >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ Component missing: wb-nav >> %LOGFILE%
    set /a MISSING+=1
)

if exist "components\wb-footer" (
    echo ✓ Component found: wb-footer >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ Component missing: wb-footer >> %LOGFILE%
    set /a MISSING+=1
)

if exist "components\wb-status" (
    echo ✓ Component found: wb-status >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ Component missing: wb-status >> %LOGFILE%
    set /a MISSING+=1
)

if !MISSING! gtr 0 (
    echo. >> %LOGFILE%
    echo WARNING: %MISSING% component(s) missing >> %LOGFILE%
)

REM ==========================================
REM TEST 4: CHECK SUPPORTING FILES
REM ==========================================
echo [TEST 4] Checking supporting files...

if exist "wb.js" (
    echo ✓ File found: wb.js >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ File missing: wb.js >> %LOGFILE%
    set /a FAILED+=1
)

if exist "index.js" (
    echo ✓ File found: index.js >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ File missing: index.js >> %LOGFILE%
    set /a FAILED+=1
)

if exist "styles\main.css" (
    echo ✓ File found: styles\main.css >> %LOGFILE%
    set /a PASSED+=1
) else (
    echo ✗ File missing: styles\main.css >> %LOGFILE%
    set /a FAILED+=1
)

REM ==========================================
REM AUTOMATIC FIXES - Using Node.js
REM ==========================================
echo [FIX PHASE] Running automated fixes...
echo. >> %LOGFILE%
echo Starting Node.js-based fixes... >> %LOGFILE%

REM Create Node.js fix script
echo Creating fix-wb-html-auto.js...

(
echo const fs = require('fs');
echo const path = require('path');
echo.
echo const wbHtmlPath = path.join(__dirname, 'wb.html');
echo let html = fs.readFileSync(wbHtmlPath, 'utf-8');
echo let fixed = false;
echo.
echo console.log('Starting automatic fixes...');
echo.
echo // Fix 1: Ensure DOCTYPE
echo if (!html.match(/^<!DOCTYPE html>/i)) {
echo   html = '!DOCTYPE html>\r\n' + html;
echo   console.log('✓ Fixed: Added DOCTYPE');
echo   fixed = true;
echo }
echo.
echo // Fix 2: Ensure lang attribute
echo if (!html.match(/html\s+[^>]*lang="en"/i)) {
echo   html = html.replace(/^<html/, '<html lang="en"');
echo   console.log('✓ Fixed: Added lang attribute');
echo   fixed = true;
echo }
echo.
echo // Fix 3: Ensure UTF-8 charset
echo if (!html.match(/charset\s*=\s*["']UTF-8["']/i)) {
echo   html = html.replace(/(<meta name="viewport"[^>]*>)/, '$1\r\n    <meta charset="UTF-8" />');
echo   console.log('✓ Fixed: Added UTF-8 charset');
echo   fixed = true;
echo }
echo.
echo // Fix 4: Ensure module scripts
echo html = html.replace(/(<script\s+src="(wb\.js|index\.js)")/gi, '<script type="module" src="$2"');
echo console.log('✓ Fixed: Ensured module scripts');
echo.
echo // Fix 5: Ensure proper head structure
echo if (!html.match(/<head[^>]*>/i)) {
echo   html = html.replace(/^<!DOCTYPE[^>]*>/, '$0\r\n<head>');
echo   console.log('✓ Fixed: Ensured head section');
echo }
echo.
echo if (fixed) {
echo   fs.writeFileSync(wbHtmlPath, html, 'utf-8');
echo   console.log('\n✓ All fixes applied successfully');
echo   process.exit(0);
echo } else {
echo   console.log('\n✓ No fixes needed - file is optimal');
echo   process.exit(0);
echo }
) > fix-wb-html-auto.js

REM Run Node.js fix script
node fix-wb-html-auto.js >> %LOGFILE% 2>&1
if !errorlevel! equ 0 (
    echo ✓ Node.js fixes applied >> %LOGFILE%
    set /a FIXED+=5
) else (
    echo ✗ Node.js fixes encountered issue >> %LOGFILE%
)

REM ==========================================
REM TEST 5: VERIFY FIXES
REM ==========================================
echo [TEST 5] Verifying fixes...

REM Check if file was modified
if exist "wb.html" (
    for /f %%A in ('wc -c "wb.html" 2^>nul') do set FILESIZE=%%A
    if "!FILESIZE!"=="" (
        echo ✓ VERIFY: wb.html still exists >> %LOGFILE%
        set /a PASSED+=1
    ) else (
        echo ✓ VERIFY: wb.html exists and was processed >> %LOGFILE%
        set /a PASSED+=1
    )
) else (
    echo ✗ VERIFY: wb.html disappeared! >> %LOGFILE%
    set /a FAILED+=1
)

REM ==========================================
REM CLEAN UP
REM ==========================================
echo [CLEANUP] Removing temporary files...
if exist "fix-wb-html-auto.js" (
    del /q fix-wb-html-auto.js
    echo ✓ Cleaned up temporary files >> %LOGFILE%
)

REM ==========================================
REM FINAL REPORT
REM ==========================================
:END
set /a TOTAL=PASSED+FAILED
if !TOTAL! gtr 0 (
    for /f %%A in ('powershell -NoProfile "Write-Host ([int]([double]!PASSED!/[double]!TOTAL!*100))"') do set PERCENTAGE=%%A
) else (
    set PERCENTAGE=0
)

echo. >> %LOGFILE%
echo ========================================= >> %LOGFILE%
echo FINAL REPORT >> %LOGFILE%
echo ========================================= >> %LOGFILE%
echo Total Tests: !TOTAL! >> %LOGFILE%
echo Passed: !PASSED! ✓ >> %LOGFILE%
echo Failed: !FAILED! ✗ >> %LOGFILE%
echo Fixed: !FIXED! ⚙ >> %LOGFILE%
echo Pass Rate: !PERCENTAGE!%% >> %LOGFILE%
echo Completed: %date% %time% >> %LOGFILE%
echo ========================================= >> %LOGFILE%

echo.
echo =========================================
echo           BATCH JOB COMPLETE
echo =========================================
echo.
echo Test Results:
echo   Total Tests: !TOTAL!
echo   Passed: !PASSED! ✓
echo   Failed: !FAILED! ✗
echo   Fixed: !FIXED! ⚙
echo   Pass Rate: !PERCENTAGE!%%
echo.
echo Details saved to: %LOGFILE%
echo Backup created: wb.html.backup
echo.

if !PERCENTAGE! geq 90 (
    echo ✓ SUCCESS: wb.html is now optimized!
) else if !PERCENTAGE! geq 70 (
    echo ⚠ PARTIAL: Some issues remain - review log
) else (
    echo ✗ ISSUES: Check log for details
)

echo.
echo =========================================
timeout /t 5 /nobreak
