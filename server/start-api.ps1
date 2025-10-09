#!/usr/bin/env pwsh

Write-Host "🚀 Starting Claude Events API Server..." -ForegroundColor Green

# Change to wb root directory 
$scriptDir = Split-Path -Parent $PSCommandPath
Set-Location $scriptDir/..

# Start server in a separate process that won't close on Ctrl+C
Start-Process -FilePath "node" -ArgumentList "server/claude-events-api.js" -WindowStyle Normal -PassThru

Write-Host "🌐 API Server starting at http://localhost:3001" -ForegroundColor Cyan
Write-Host "📊 API endpoints:" -ForegroundColor Gray
Write-Host "   GET  /api/health" -ForegroundColor Gray
Write-Host "   GET  /api/events" -ForegroundColor Gray
Write-Host "   GET  /api/errors" -ForegroundColor Gray
Write-Host "   GET  /api/events/dir?path=components/wb-button" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 Opening test client..." -ForegroundColor Yellow

# Wait a moment for server to start
Start-Sleep 2

# Open test client
$testClientPath = Join-Path $PWD "server/api-test-client.html"
Start-Process $testClientPath

Write-Host "✅ Done! API server is running in separate window." -ForegroundColor Green