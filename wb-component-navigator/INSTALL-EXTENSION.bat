@echo off
echo ========================================
echo Installing WB Component Navigator
echo ========================================
echo.

echo This will install the extension into VS Code so it runs automatically.
echo No need to press F5!
echo.

echo Step 1: Checking if vsce is installed...
call npx vsce --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing vsce...
    call npm install -g @vscode/vsce
)
echo ✓ vsce is ready
echo.

echo Step 2: Packaging extension...
call npx vsce package --no-dependencies
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to package extension
    pause
    exit /b 1
)
echo ✓ Extension packaged
echo.

echo Step 3: Installing extension into VS Code...
for %%f in (*.vsix) do (
    echo Found: %%f
    call code --install-extension %%f --force
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Extension installed successfully!
    ) else (
        echo ERROR: Failed to install extension
        pause
        exit /b 1
    )
)
echo.

echo ========================================
echo SUCCESS! Extension Installed!
echo ========================================
echo.
echo The extension is now permanently installed in VS Code.
echo.
echo Next steps:
echo 1. Close ALL VS Code windows
echo 2. Open your WB folder: C:\Users\jwpmi\Downloads\AI\wb
echo 3. The extension will load automatically!
echo 4. Look for "WB COMPONENTS" in the sidebar
echo 5. Test: Ctrl+Click on any component
echo.
echo No F5 needed - it just works now!
echo.
pause
