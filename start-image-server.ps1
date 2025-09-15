# Image Server Setup and Start Script
# Run this in PowerShell to set up and start the image server

Write-Host "🚀 Setting up Claude Image Server..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install express sharp

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Start the server
Write-Host "🚀 Starting image server..." -ForegroundColor Green
Write-Host "📁 Server will run at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🌐 Open imageFinder-server.html in your browser" -ForegroundColor Cyan
Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

node image-server.js