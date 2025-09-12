# Website Builder Development Startup
Write-Host "🚀 Starting Website Builder Development Environment" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "wb")) {
    Write-Host "❌ wb directory not found!" -ForegroundColor Red
    Write-Host "Please run this from the project root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found wb directory" -ForegroundColor Green
Write-Host "📁 Changing to wb directory..." -ForegroundColor Cyan

# Change to wb directory
Set-Location wb

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found in wb directory!" -ForegroundColor Red
    Write-Host "Setting up wb dependencies..." -ForegroundColor Yellow
    
    # Install dependencies
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "🚀 Starting Website Builder development server..." -ForegroundColor Blue
Write-Host "💡 This will serve index.html from project root" -ForegroundColor Cyan
Write-Host "🌐 Browser will open automatically" -ForegroundColor Cyan
Write-Host ""

# Start the development server
npm run dev