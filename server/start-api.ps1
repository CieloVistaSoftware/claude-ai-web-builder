# Start Claude Events API Server
# This server handles logging to claude.md files

Write-Host "🚀 Starting Claude Events API Server..." -ForegroundColor Cyan

# Navigate to project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

Set-Location $projectRoot

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "📡 Server starting on http://localhost:3001" -ForegroundColor Green
Write-Host "📝 Logs will be saved to components/*/claude.md files" -ForegroundColor Gray
Write-Host "" 
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

node src/server/claude-events-api.js
