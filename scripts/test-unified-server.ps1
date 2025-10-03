# Test script for Unified Claude WebSocket Server
Write-Host "Starting Unified Claude WebSocket Server Test" -ForegroundColor Green

# Check if port 3000 is in use
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "Port 3000 is in use. Attempting to kill the process..." -ForegroundColor Yellow
    $processId = ($portCheck -split '\s+')[-1]
    try {
        taskkill /F /PID $processId
        Write-Host "Successfully killed process on port 3000" -ForegroundColor Green
    } catch {
        Write-Host "Failed to kill process. Please close the application using port 3000 manually." -ForegroundColor Red
        exit 1
    }
}

# Build and start server
Write-Host "Building and starting Unified Claude WebSocket Server..." -ForegroundColor Cyan
npm run unified:build

# Start the server in mock mode in the background
Write-Host "Starting server in mock mode..." -ForegroundColor Cyan
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:USE_MOCK_RESPONSES = "true"
    node unified-claude-websocket-server.js
}

# Wait a moment for the server to start
Write-Host "Waiting for server to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# Open the test page in the default browser
Write-Host "Opening test page in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/test-claude-socket.html"

# Keep the script running until the user presses a key
Write-Host ""
Write-Host "Server is running in mock mode. Press any key to stop the server..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop the server
Write-Host "Stopping server..." -ForegroundColor Cyan
Stop-Job $serverJob
Remove-Job $serverJob

Write-Host "Test completed successfully." -ForegroundColor Green
