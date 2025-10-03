# Start-ObfuscatorServer.ps1
# PowerShell script to start the obfuscator plugin server

# Define function to check if a command exists
function Test-Command {
    param (
        [string]$Command
    )
    
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
    
    return $false
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "Node.js is not installed. Please install Node.js to run this server." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerDir = Join-Path $ScriptDir ".."
$ServerPath = Join-Path $ServerDir "server.js"

# Check if the server.js file exists
if (-not (Test-Path $ServerPath)) {
    Write-Host "server.js not found at: $ServerPath" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "npm is not installed. Please install Node.js with npm to run this server." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
$PackageJson = Join-Path $ServerDir "package.json"
$NodeModules = Join-Path $ServerDir "node_modules"

if ((Test-Path $PackageJson) -and (-not (Test-Path $NodeModules))) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $ServerDir
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Please run 'npm install' manually in the directory: $ServerDir" -ForegroundColor Red
        exit 1
    }
}

# Check if port 3000 is in use
$PortCheck = netstat -ano | Select-String "TCP" | Select-String ":3000"
if ($PortCheck) {
    Write-Host "Port 3000 is already in use. Please close the application using this port or modify the port in server.js." -ForegroundColor Yellow
    
    # Attempt to identify the process
    $ProcessId = ($PortCheck -split ' ')[-1]
    if ($ProcessId) {
        try {
            $Process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
            if ($Process) {
                Write-Host "Process using port 3000: $($Process.ProcessName) (PID: $ProcessId)" -ForegroundColor Yellow
                
                # Offer to kill the process
                $confirmation = Read-Host "Do you want to kill this process? (y/n)"
                if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
                    Stop-Process -Id $ProcessId -Force
                    Write-Host "Process terminated." -ForegroundColor Green
                } else {
                    Write-Host "Process not terminated. Please close it manually or change the port in server.js." -ForegroundColor Yellow
                    exit 1
                }
            }
        } catch {
            Write-Host "Could not identify the process using port 3000." -ForegroundColor Red
        }
    }
}

# Set environment variables if needed
# $env:DEBUG = "obfuscator:*"

# Start the server
Write-Host "Starting Obfuscator API Server..." -ForegroundColor Green
Set-Location $ServerDir

# Run in a new window to keep it separate
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"

# Wait a moment and then open the demo page
Start-Sleep -Seconds 2

# Check if the server started successfully
$ServerCheck = try { Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 } catch { $null }

if ($ServerCheck) {
    Write-Host "Server is running!" -ForegroundColor Green
    
    # Open the demo page if it exists
    $DemoPath = Join-Path $ServerDir "obfuscator-demo.html"
    if (Test-Path $DemoPath) {
        Write-Host "Opening demo page..." -ForegroundColor Green
        Start-Process $DemoPath
    }
} else {
    Write-Host "Server may not have started correctly. Please check the server window for errors." -ForegroundColor Yellow
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
