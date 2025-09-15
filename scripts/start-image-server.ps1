# PowerShell Script to Auto-Start Image Server
# File: start-image-server.ps1

param(
    [string]$Port = "3000",
    [switch]$Force = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host @"
Image Server Auto-Starter
========================

Usage: .\start-image-server.ps1 [-Port <port>] [-Force] [-Help]

Parameters:
  -Port <port>    Specify port (default: 3000)
  -Force          Kill existing server and start new one
  -Help           Show this help message

Examples:
  .\start-image-server.ps1                    # Start on port 3000
  .\start-image-server.ps1 -Port 3001        # Start on port 3001
  .\start-image-server.ps1 -Force            # Force restart
"@
    exit 0
}

Write-Host "🚀 Image Server Auto-Starter" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to find available port
function Find-AvailablePort {
    $portsToTry = @(3000, 3001, 3002, 3003, 3004)
    foreach ($port in $portsToTry) {
        if (-not (Test-Port $port)) {
            return $port
        }
    }
    return $null
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess | 
                    Get-Process -Id { $_ } -ErrorAction SilentlyContinue
        
        foreach ($process in $processes) {
            Write-Host "🔄 Stopping process $($process.Name) (PID: $($process.Id)) on port $Port" -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-Host "⚠️ Could not stop process on port $Port" -ForegroundColor Yellow
    }
}

# Check if port is already in use
if (Test-Port $Port) {
    if ($Force) {
        Write-Host "🔄 Port $Port is in use. Force stopping..." -ForegroundColor Yellow
        Stop-ProcessOnPort $Port
    } else {
        Write-Host "✅ Server already running on port $Port" -ForegroundColor Green
        Write-Host "💡 Use -Force to restart or choose different port" -ForegroundColor Cyan
        
        # Test if it's actually our server
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/images" -TimeoutSec 5 -ErrorAction Stop
            $images = $response.Content | ConvertFrom-Json
            Write-Host "📁 Server has $($images.Count) images available" -ForegroundColor Green
            Write-Host "🌐 Access at: http://localhost:$Port" -ForegroundColor Cyan
            exit 0
        } catch {
            Write-Host "⚠️ Port $Port is occupied by a different service" -ForegroundColor Yellow
            $availablePort = Find-AvailablePort
            if ($availablePort) {
                Write-Host "💡 Try using port $availablePort instead" -ForegroundColor Cyan
                $Port = $availablePort
            } else {
                Write-Host "❌ No available ports found" -ForegroundColor Red
                exit 1
            }
        }
    }
}

# Find server files in order of preference
$serverFiles = @(
    @{ Name = "image-server.js"; Command = "node image-server.js" },
    @{ Name = "server.js"; Command = "node server.js" },
    @{ Name = "app.js"; Command = "node app.js" },
    @{ Name = "index.js"; Command = "node index.js" }
)

$serverToStart = $null
foreach ($server in $serverFiles) {
    if (Test-Path $server.Name) {
        $serverToStart = $server
        Write-Host "✅ Found $($server.Name)" -ForegroundColor Green
        break
    }
}

# Check for package.json with npm start
if (Test-Path "package.json") {
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if ($packageJson.scripts.start) {
            Write-Host "✅ Found npm start script" -ForegroundColor Green
            $serverToStart = @{ Name = "package.json"; Command = "npm start" }
        }
    } catch {
        Write-Host "⚠️ Could not parse package.json" -ForegroundColor Yellow
    }
}

if (-not $serverToStart) {
    Write-Host "❌ No server files found!" -ForegroundColor Red
    Write-Host @"
📝 Looking for:
   - image-server.js
   - server.js
   - app.js
   - index.js
   - package.json with npm start script

💡 Create one of these files or place them in the current directory.
"@ -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Starting server with: $($serverToStart.Command)" -ForegroundColor Cyan

# Set environment variable for port
$env:PORT = $Port

# Start server in background
try {
    $process = Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$PWD'; Write-Host '🌐 Server starting on port $Port...'; $($serverToStart.Command)"
    ) -PassThru
    
    Write-Host "🔄 Server process started (PID: $($process.Id))" -ForegroundColor Yellow
    Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor Yellow
    
    # Wait for server to start (max 30 seconds)
    $timeout = 30
    $elapsed = 0
    
    do {
        Start-Sleep -Seconds 1
        $elapsed++
        Write-Progress -Activity "Starting Server" -Status "Checking port $Port..." -PercentComplete (($elapsed / $timeout) * 100)
    } while (-not (Test-Port $Port) -and $elapsed -lt $timeout)
    
    Write-Progress -Completed -Activity "Starting Server"
    
    if (Test-Port $Port) {
        Write-Host "✅ Server successfully started on port $Port!" -ForegroundColor Green
        Write-Host "🌐 Access at: http://localhost:$Port" -ForegroundColor Cyan
        
        # Test server endpoint
        try {
            Start-Sleep -Seconds 2
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/images" -TimeoutSec 10 -ErrorAction Stop
            $images = $response.Content | ConvertFrom-Json
            Write-Host "📁 Server reports $($images.Count) images available" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ Server started but /images endpoint not available" -ForegroundColor Yellow
            Write-Host "💡 This might be a different type of server" -ForegroundColor Cyan
        }
        
        # Create a simple status file
        $status = @{
            Port = $Port
            ProcessId = $process.Id
            StartTime = Get-Date
            Command = $serverToStart.Command
        } | ConvertTo-Json
        
        $status | Out-File -FilePath "server-status.json" -Encoding UTF8
        Write-Host "📝 Server status saved to server-status.json" -ForegroundColor Cyan
        
    } else {
        Write-Host "❌ Server failed to start within $timeout seconds" -ForegroundColor Red
        Write-Host "💡 Check the server window for error messages" -ForegroundColor Yellow
        exit 1
    }
    
} catch {
    Write-Host "❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host @"

🎉 Server is running!
==================
🌐 URL: http://localhost:$Port
📁 Images endpoint: http://localhost:$Port/images
🔧 Process ID: $($process.Id)
⏹️  To stop: Stop-Process -Id $($process.Id)

"@ -ForegroundColor Green