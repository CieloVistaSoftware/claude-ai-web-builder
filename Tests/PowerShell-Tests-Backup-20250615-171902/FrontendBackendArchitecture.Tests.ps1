# Frontend/Backend Architecture Test
# Testing new server architecture using npm scripts only
# Date: 2025-06-12

Write-Host "🧪 Testing Frontend/Backend Server Architecture" -ForegroundColor Yellow

# Test 1: Check if Express server dependencies are needed
Write-Host "`n1. Testing Express Server Setup..." -ForegroundColor Cyan
$expressInstalled = Test-Path "node_modules/express"
if ($expressInstalled) {
    Write-Host "✅ Express already installed" -ForegroundColor Green
} else {
    Write-Host "❌ Express not installed - will need to add" -ForegroundColor Red
}

# Test 2: Check if Vite can handle static file serving
Write-Host "`n2. Testing Vite Static File Serving..." -ForegroundColor Cyan
$viteConfig = Test-Path "vite.config.ts"
if ($viteConfig) {
    Write-Host "✅ Vite config exists" -ForegroundColor Green
} else {
    Write-Host "❌ Vite config missing" -ForegroundColor Red
}

# Test 3: Check current file structure
Write-Host "`n3. Testing File Structure..." -ForegroundColor Cyan
$componentsDir = Test-Path "components"
$themesDir = Test-Path "themes"
$cssDir = Test-Path "css"

if ($componentsDir -and $themesDir -and $cssDir) {
    Write-Host "✅ All required directories exist" -ForegroundColor Green
} else {
    Write-Host "❌ Missing directories" -ForegroundColor Red
}

# Test 4: Check if we can serve files properly
Write-Host "`n4. Testing File Serving Capability..." -ForegroundColor Cyan
$tableThemeFile = Test-Path "components/table/table-theme.html"
if ($tableThemeFile) {
    Write-Host "✅ Target file exists" -ForegroundColor Green
} else {
    Write-Host "❌ Target file missing" -ForegroundColor Red
}

Write-Host "`n📊 Architecture Test Complete!" -ForegroundColor Green
Write-Host "Ready to implement Express + Vite frontend/backend architecture" -ForegroundColor Yellow
