# Launch Website Builder
Write-Host "Launching Website Builder application..." -ForegroundColor Cyan

# Check if http-server is installed
$httpServerInstalled = $null
try {
    $httpServerInstalled = npm list -g http-server
} catch {
    $httpServerInstalled = $null
}

# If http-server is not installed, install it
if (-not $httpServerInstalled -or $httpServerInstalled -like "*empty*") {
    Write-Host "Installing http-server..." -ForegroundColor Yellow
    npm install -g http-server
}

# Get the current directory path
$currentDir = Get-Location

# Find a free port
$port = 8080
$portAvailable = $false
while (-not $portAvailable) {
    $testSocket = New-Object System.Net.Sockets.TcpClient
    try {
        $testSocket.Connect("localhost", $port)
        Write-Host "Port $port is in use, trying next port" -ForegroundColor Yellow
        $port++
    } catch {
        $portAvailable = $true
    } finally {
        $testSocket.Close()
    }
}

# Kill any existing processes using the port
try {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) {
        Stop-Process -Id $process -Force
        Write-Host "Killed process using port $port" -ForegroundColor Yellow
    }
} catch {
    # No process using the port
}

# Start http-server
Write-Host "Starting website builder on http://localhost:$port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Cyan

# Open the browser
Start-Process "http://localhost:$port"

# Start the server
http-server -p $port -c-1 --cors
