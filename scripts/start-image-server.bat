@echo off
:: Image Server Auto-Starter Batch File
:: File: start-image-server.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Image Server Auto-Starter
echo =============================

:: Default port
set PORT=3000
set FORCE=false

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :start_server
if "%~1"=="-port" (
    set PORT=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="-force" (
    set FORCE=true
    shift
    goto :parse_args
)
if "%~1"=="-help" (
    goto :show_help
)
shift
goto :parse_args

:show_help
echo.
echo Usage: start-image-server.bat [-port ^<port^>] [-force] [-help]
echo.
echo Parameters:
echo   -port ^<port^>    Specify port (default: 3000)
echo   -force          Kill existing server and start new one
echo   -help           Show this help message
echo.
echo Examples:
echo   start-image-server.bat                    # Start on port 3000
echo   start-image-server.bat -port 3001        # Start on port 3001
echo   start-image-server.bat -force            # Force restart
echo.
goto :end

:start_server
echo 🔍 Checking for existing server on port %PORT%...

:: Check if port is in use using netstat
netstat -an | findstr ":%PORT% " >nul 2>&1
if %errorlevel%==0 (
    if "%FORCE%"=="true" (
        echo 🔄 Port %PORT% is in use. Force stopping...
        :: Find and kill process on port
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% "') do (
            echo 🔄 Stopping process ID %%a
            taskkill /PID %%a /F >nul 2>&1
        )
        timeout /t 2 >nul
    ) else (
        echo ✅ Server already running on port %PORT%
        echo 💡 Use -force to restart or choose different port
        
        :: Test if it's our image server
        curl -s "http://localhost:%PORT%/images" >nul 2>&1
        if %errorlevel%==0 (
            echo 📁 Image server is responding
            echo 🌐 Access at: http://localhost:%PORT%
            goto :end
        ) else (
            echo ⚠️ Port %PORT% is occupied by a different service
            echo 💡 Try using -port 3001 or -port 3002
            goto :end
        )
    )
)

:: Look for server files
echo 🔍 Looking for server files...

if exist "image-server.js" (
    set SERVER_FILE=image-server.js
    set SERVER_CMD=node image-server.js
    echo ✅ Found image-server.js
    goto :start_found_server
)

if exist "server.js" (
    set SERVER_FILE=server.js
    set SERVER_CMD=node server.js
    echo ✅ Found server.js
    goto :start_found_server
)

if exist "app.js" (
    set SERVER_FILE=app.js
    set SERVER_CMD=node app.js
    echo ✅ Found app.js
    goto :start_found_server
)

if exist "package.json" (
    echo ✅ Found package.json, checking for start script...
    findstr "start" package.json >nul 2>&1
    if %errorlevel%==0 (
        set SERVER_FILE=package.json
        set SERVER_CMD=npm start
        echo ✅ Found npm start script
        goto :start_found_server
    )
)

:: No server files found
echo ❌ No server files found!
echo.
echo 📝 Looking for:
echo    - image-server.js
echo    - server.js
echo    - app.js
echo    - package.json with npm start script
echo.
echo 💡 Create one of these files or place them in the current directory.
goto :end

:start_found_server
echo 🚀 Starting server with: %SERVER_CMD%
echo 🌐 Server will start on port %PORT%

:: Create a batch file to run the server
echo @echo off > temp_server.bat
echo echo 🌐 Starting server on port %PORT%... >> temp_server.bat
echo set PORT=%PORT% >> temp_server.bat
echo %SERVER_CMD% >> temp_server.bat
echo pause >> temp_server.bat

:: Start server in new window
start "Image Server - Port %PORT%" temp_server.bat

:: Wait for server to start
echo ⏳ Waiting for server to be ready...
set /a attempts=0
:wait_loop
timeout /t 1 >nul
set /a attempts+=1

:: Check if server is responding (using curl if available, otherwise skip check)
curl -s "http://localhost:%PORT%/images" >nul 2>&1
if %errorlevel%==0 (
    goto :server_ready
)

if %attempts% geq 15 (
    echo ⚠️ Server may still be starting. Check the server window.
    goto :server_info
)
goto :wait_loop

:server_ready
echo ✅ Server successfully started on port %PORT%!

:: Test the images endpoint
echo 📁 Testing images endpoint...
curl -s "http://localhost:%PORT%/images" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Images endpoint is responding
) else (
    echo ⚠️ Images endpoint not available (might be a different server type)
)

:server_info
echo.
echo 🎉 Server Information
echo ====================
echo 🌐 URL: http://localhost:%PORT%
echo 📁 Images endpoint: http://localhost:%PORT%/images
echo 🔧 Command: %SERVER_CMD%
echo 📝 Server file: %SERVER_FILE%
echo.
echo 💡 Tips:
echo    - Open http://localhost:%PORT% in your browser
echo    - Use Ctrl+C in server window to stop
echo    - Close the server window to stop the server
echo.

:: Clean up temp file after a delay
timeout /t 5 >nul
if exist temp_server.bat del temp_server.bat >nul 2>&1

:end
echo.
pause