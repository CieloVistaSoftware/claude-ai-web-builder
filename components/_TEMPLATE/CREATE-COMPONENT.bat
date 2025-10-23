@echo off
REM ========================================
REM WB Component Template Setup Script
REM ========================================

echo.
echo ========================================
echo  WB Component Template Setup
echo ========================================
echo.

REM Get the component name from user
set /p COMPONENT_NAME="Enter component name (e.g., my-test): "

REM Remove wb- prefix if user included it
set COMPONENT_NAME=%COMPONENT_NAME:wb-=%

REM Create PascalCase name (user will need to verify this)
REM Simple replace: remove hyphens and capitalize
set COMPONENT_CLASS=%COMPONENT_NAME:-=%

echo.
echo Creating component: wb-%COMPONENT_NAME%
echo Class name will be: WB%COMPONENT_CLASS%
echo.
echo WARNING: You may need to manually fix the PascalCase class name!
echo Example: my-test-button should become MyTestButton
echo.
pause

REM Create folder
mkdir "wb-%COMPONENT_NAME%" 2>nul
cd "wb-%COMPONENT_NAME%"

echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Copy these files from _TEMPLATE folder:
echo    - wb-COMPONENT-NAME.js
echo    - wb-COMPONENT-NAME.css  
echo    - wb-COMPONENT-NAME-demo.html
echo    - wb-COMPONENT-NAME.md
echo    - wb-COMPONENT-NAME.schema.json
echo    - ✅ claude.md
echo.
echo 2. Use VS Code or text editor to Find/Replace in ALL files:
echo    - COMPONENT-NAME    =^>  %COMPONENT_NAME%
echo    - ComponentName     =^>  %COMPONENT_CLASS%
echo    - wb-COMPONENT-NAME =^>  wb-%COMPONENT_NAME%
echo    - WBComponentName   =^>  WB%COMPONENT_CLASS%
echo.
echo 3. Rename the files:
echo    - wb-COMPONENT-NAME.js         =^>  wb-%COMPONENT_NAME%.js
echo    - wb-COMPONENT-NAME.css        =^>  wb-%COMPONENT_NAME%.css
echo    - wb-COMPONENT-NAME-demo.html  =^>  wb-%COMPONENT_NAME%-demo.html
echo    - wb-COMPONENT-NAME.md         =^>  wb-%COMPONENT_NAME%.md
echo    - wb-COMPONENT-NAME.schema.json =^> wb-%COMPONENT_NAME%.schema.json
echo.
echo 4. Run: npm run build
echo.
echo 5. Test at: /components/wb-%COMPONENT_NAME%/wb-%COMPONENT_NAME%-demo.html
echo.
echo ========================================

pause
