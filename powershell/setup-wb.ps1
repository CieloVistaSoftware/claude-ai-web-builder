# Quick setup script for Website Builder
Write-Host "🚀 Setting up Website Builder..." -ForegroundColor Yellow

# Check if wb directory exists
if (-not (Test-Path "wb")) {
    Write-Host "❌ wb directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found wb directory" -ForegroundColor Green

# Change to wb directory and install dependencies
Set-Location wb

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies in wb directory..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host "🎯 Setup complete! You can now run 'npm run dev' from the root directory" -ForegroundColor Yellow