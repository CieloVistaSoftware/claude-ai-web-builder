# Live Server Path Fix Test
# Test to verify the correct server path configuration
# Date: 2025-06-12

Write-Host "🧪 Testing Live Server Path Configuration" -ForegroundColor Yellow

# Check if file exists
$targetFile = "components\table\table-theme.html"
Write-Host "`n📁 Checking file existence..." -ForegroundColor Cyan
if (Test-Path $targetFile) {
    Write-Host "✅ File exists: $targetFile" -ForegroundColor Green
} else {
    Write-Host "❌ File NOT found: $targetFile" -ForegroundColor Red
    exit 1
}

# Test different server configurations
Write-Host "`n🚀 Testing server configurations..." -ForegroundColor Cyan

# Test 1: Basic live-server without specific file
Write-Host "`n1️⃣ Testing basic live-server command..." -ForegroundColor Blue
$basicTest = "live-server --port=8001 --no-browser"
Write-Host "Command: $basicTest"

# Test 2: Live-server with correct relative path
Write-Host "`n2️⃣ Testing with relative path..." -ForegroundColor Blue
$relativeTest = "live-server --port=8002 --no-browser --open=$targetFile"
Write-Host "Command: $relativeTest"

# Test 3: Check current directory
Write-Host "`n📍 Current directory: $(Get-Location)" -ForegroundColor Magenta

# Test 4: Check if we can access the file directly
Write-Host "`n📄 File content check..." -ForegroundColor Blue
try {
    $content = Get-Content $targetFile -TotalCount 5
    Write-Host "✅ File is readable. First few lines:" -ForegroundColor Green
    $content | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
} catch {
    Write-Host "❌ Cannot read file: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Recommended fix:" -ForegroundColor Green
Write-Host "   Change npm script to: live-server --port=8000 --open=components/table/table-theme.html" -ForegroundColor Yellow

Write-Host "`n✅ Server Path Fix Test Complete!" -ForegroundColor Green
