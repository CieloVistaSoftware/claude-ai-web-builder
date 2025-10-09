@echo off
echo =====================================================
echo  WB Component System - Comprehensive Test Launcher
echo =====================================================
echo.

echo 🔍 Running Node.js Validation...
node final-validation-test.js
echo.

echo 🌐 Opening Browser Tests...
echo.
echo   - Fixed Integration Test
start components-fixed-test.html

timeout /t 2 /nobreak >nul

echo   - Component Diagnosis Tool  
start component-diagnosis.html

timeout /t 2 /nobreak >nul

echo   - Final Ecosystem Test
start final-ecosystem-test.html

echo.
echo ✅ All tests launched successfully!
echo.
echo 📋 CHECK THESE IN YOUR BROWSER:
echo   1. components-fixed-test.html - Sequential loading test
echo   2. component-diagnosis.html - Error diagnosis
echo   3. final-ecosystem-test.html - Full ecosystem test
echo.
echo 🔧 DEBUGGING COMMANDS:
echo   - node final-validation-test.js (File validation)
echo   - F12 Developer Tools (Browser console)
echo   - window.debugComponents() (Browser debug function)
echo.
pause