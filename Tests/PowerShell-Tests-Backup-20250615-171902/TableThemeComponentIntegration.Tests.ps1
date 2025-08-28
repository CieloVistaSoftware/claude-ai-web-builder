 Table Theme Component Integration Test
# Date: 2025-06-12
# Purpose: Test that table-theme.html properly integrates with table-theme-component

Write-Host "🧪 Testing Table Theme Component Integration" -ForegroundColor Cyan

$testResults = @()
$basePath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder"

# Test 1: Check if table-theme.html exists and has proper structure
Write-Host "Test 1: Checking table-theme.html structure..." -ForegroundColor Yellow
$tableThemeHtml = Join-Path $basePath "components\table\table-theme.html"

if (Test-Path $tableThemeHtml) {
    $content = Get-Content $tableThemeHtml -Raw
    
    # Check for required elements
    $hasColorBarEvent = $content -match "color-bar-changed"
    $hasTableThemeComponent = $content -match "<table-theme-component"
    $hasColorBarState = $content -match "colorBarState"
    $hasThemeControls = $content -match "setupThemeControls"
    
    if ($hasColorBarEvent -and $hasTableThemeComponent -and $hasColorBarState -and $hasThemeControls) {
        Write-Host "✅ table-theme.html has proper integration structure" -ForegroundColor Green
        $testResults += "PASS: table-theme.html structure"
    } else {
        Write-Host "❌ table-theme.html missing required integration elements" -ForegroundColor Red
        Write-Host "   - color-bar-changed event: $hasColorBarEvent" -ForegroundColor Red
        Write-Host "   - table-theme-component: $hasTableThemeComponent" -ForegroundColor Red
        Write-Host "   - colorBarState: $hasColorBarState" -ForegroundColor Red
        Write-Host "   - setupThemeControls: $hasThemeControls" -ForegroundColor Red
        $testResults += "FAIL: table-theme.html structure"
    }
} else {
    Write-Host "❌ table-theme.html not found" -ForegroundColor Red
    $testResults += "FAIL: table-theme.html not found"
}

# Test 2: Check if table-theme-component.js has color-bar-changed listener
Write-Host "`nTest 2: Checking table-theme-component.js integration..." -ForegroundColor Yellow
$themeComponentJs = Join-Path $basePath "components\theme\table-theme-component.js"

if (Test-Path $themeComponentJs) {
    $content = Get-Content $themeComponentJs -Raw
    
    $hasColorBarListener = $content -match "color-bar-changed"
    $hasCreateThemeFromColorBar = $content -match "createThemeFromColorBarState"
    $hasInitializeFromColorBar = $content -match "initializeFromColorBarState"
    
    if ($hasColorBarListener -and $hasCreateThemeFromColorBar -and $hasInitializeFromColorBar) {
        Write-Host "✅ table-theme-component.js has proper event integration" -ForegroundColor Green
        $testResults += "PASS: table-theme-component.js integration"
    } else {
        Write-Host "❌ table-theme-component.js missing integration methods" -ForegroundColor Red
        Write-Host "   - color-bar-changed listener: $hasColorBarListener" -ForegroundColor Red
        Write-Host "   - createThemeFromColorBarState: $hasCreateThemeFromColorBar" -ForegroundColor Red
        Write-Host "   - initializeFromColorBarState: $hasInitializeFromColorBar" -ForegroundColor Red
        $testResults += "FAIL: table-theme-component.js integration"
    }
} else {
    Write-Host "❌ table-theme-component.js not found" -ForegroundColor Red
    $testResults += "FAIL: table-theme-component.js not found"
}

# Test 3: Check if all required files exist
Write-Host "`nTest 3: Checking required files exist..." -ForegroundColor Yellow
$requiredFiles = @(
    "components\table\table-component.js",
    "components\table\table.json",
    "wb.js",
    "wb.css"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $basePath $file
    if (Test-Path $fullPath) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    $testResults += "PASS: Required files exist"
} else {
    $testResults += "FAIL: Missing required files"
}

# Test 4: Start Live Server to test integration (if available)
Write-Host "`nTest 4: Testing with Live Server..." -ForegroundColor Yellow
$liveServerAvailable = Get-Command "live-server" -ErrorAction SilentlyContinue

if ($liveServerAvailable) {
    Write-Host "🌐 Starting Live Server for manual testing..." -ForegroundColor Blue
    Write-Host "📁 Serving from: $basePath" -ForegroundColor Blue
    Write-Host "🔗 Open: http://localhost:8080/components/table/table-theme.html" -ForegroundColor Blue
    Write-Host "⚠️  Press Ctrl+C to stop server and continue tests" -ForegroundColor Yellow
    
    Set-Location $basePath
    try {
        live-server --port=8080 --open=/components/table/table-theme.html
    } catch {
        Write-Host "⚠️  Live Server interrupted or not available" -ForegroundColor Yellow
    }
    
    $testResults += "MANUAL: Live Server test available"
} else {
    Write-Host "⚠️  Live Server not available - install with 'npm install -g live-server'" -ForegroundColor Yellow
    $testResults += "SKIP: Live Server not available"
}

# Summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
$passed = ($testResults | Where-Object { $_ -like "PASS:*" }).Count
$failed = ($testResults | Where-Object { $_ -like "FAIL:*" }).Count
$skipped = ($testResults | Where-Object { $_ -like "SKIP:*" -or $_ -like "MANUAL:*" }).Count

Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
Write-Host "⚠️  Skipped/Manual: $skipped" -ForegroundColor Yellow

foreach ($result in $testResults) {
    if ($result -like "PASS:*") {
        Write-Host "  $result" -ForegroundColor Green
    } elseif ($result -like "FAIL:*") {
        Write-Host "  $result" -ForegroundColor Red
    } else {
        Write-Host "  $result" -ForegroundColor Yellow
    }
}

if ($failed -eq 0) {
    Write-Host "`n🎉 All critical tests passed! Table theme integration is working." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n💥 $failed test(s) failed. Check implementation." -ForegroundColor Red
    exit 1
}
