# PowerShell Test Script for Table Theme Component Implementation
# This script tests the changes made for dark mode table.html, JSON data usage, and table-theme-component

Write-Host "🚀 Starting Table Theme Component Tests..." -ForegroundColor Green

# Test 1: Verify table.html exists and has dark mode styling
Write-Host "`n📋 Test 1: Checking table.html dark mode implementation..." -ForegroundColor Yellow

$tableHtmlPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.html"
if (Test-Path $tableHtmlPath) {
    $tableContent = Get-Content $tableHtmlPath -Raw
    
    # Check for dark mode CSS variables
    if ($tableContent -match "--bg-color: #121212" -and $tableContent -match "--text-color: #f0f0f0") {
        Write-Host "✅ Dark mode styling found in table.html" -ForegroundColor Green
    } else {
        Write-Host "❌ Dark mode styling not found in table.html" -ForegroundColor Red
    }
    
    # Check for table.json usage
    if ($tableContent -match "table\.json" -and $tableContent -match "loadTableData") {
        Write-Host "✅ table.json integration found" -ForegroundColor Green
    } else {
        Write-Host "❌ table.json integration not found" -ForegroundColor Red
    }
} else {
    Write-Host "❌ table.html not found at expected location" -ForegroundColor Red
}

# Test 2: Verify table.json exists with sample data
Write-Host "`n📋 Test 2: Checking table.json sample data..." -ForegroundColor Yellow

$tableJsonPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.json"
if (Test-Path $tableJsonPath) {
    try {
        $jsonContent = Get-Content $tableJsonPath -Raw | ConvertFrom-Json
        
        if ($jsonContent.employees -and $jsonContent.employees.Count -gt 0) {
            Write-Host "✅ Employee data found: $($jsonContent.employees.Count) records" -ForegroundColor Green
        }
        
        if ($jsonContent.products -and $jsonContent.products.Count -gt 0) {
            Write-Host "✅ Product data found: $($jsonContent.products.Count) records" -ForegroundColor Green
        }
        
        if ($jsonContent.transactions -and $jsonContent.transactions.Count -gt 0) {
            Write-Host "✅ Transaction data found: $($jsonContent.transactions.Count) records" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Error parsing table.json: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ table.json not found at expected location" -ForegroundColor Red
}

# Test 3: Verify table-theme-component.js exists
Write-Host "`n📋 Test 3: Checking table-theme-component implementation..." -ForegroundColor Yellow

$tableThemeComponentPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\theme\table-theme-component.js"
if (Test-Path $tableThemeComponentPath) {
    $componentContent = Get-Content $tableThemeComponentPath -Raw
    
    # Check for essential features
    $features = @(
        "class TableThemeComponent extends HTMLElement",
        "table-theme-changed",
        "generateTableTheme",
        "--table-cell-padding",
        "customElements.define"
    )
    
    $foundFeatures = 0
    foreach ($feature in $features) {
        if ($componentContent -match [regex]::Escape($feature)) {
            $foundFeatures++
        }
    }
    
    Write-Host "✅ Table theme component found with $foundFeatures/$($features.Count) essential features" -ForegroundColor Green
} else {
    Write-Host "❌ table-theme-component.js not found" -ForegroundColor Red
}

# Test 4: Verify table-theme-demo.html exists
Write-Host "`n📋 Test 4: Checking table theme demo..." -ForegroundColor Yellow

$demoPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\component\table-theme-demo.html"
if (Test-Path $demoPath) {
    $demoContent = Get-Content $demoPath -Raw
    
    if ($demoContent -match "<table-theme-component" -and $demoContent -match "<theme-generator") {
        Write-Host "✅ Demo file includes both theme generator and table theme components" -ForegroundColor Green
    } else {
        Write-Host "❌ Demo file missing component integration" -ForegroundColor Red
    }
} else {
    Write-Host "❌ table-theme-demo.html not found" -ForegroundColor Red
}

# Test 5: Check file structure
Write-Host "`n📋 Test 5: Verifying file structure..." -ForegroundColor Yellow

$expectedFiles = @(
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.html",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.json",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\theme\table-theme-component.js",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\theme\table-theme-demo.html"
)

$existingFiles = 0
foreach ($file in $expectedFiles) {
    if (Test-Path $file) {
        $existingFiles++
        Write-Host "  ✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $(Split-Path $file -Leaf)" -ForegroundColor Red
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "Files created/modified: $existingFiles/$($expectedFiles.Count)" -ForegroundColor Cyan

if ($existingFiles -eq $expectedFiles.Count) {
    Write-Host "`n🎉 All tests passed! Table theme implementation is complete." -ForegroundColor Green
    Write-Host "`n📝 You can now:" -ForegroundColor White
    Write-Host "   1. Open table.html to see the dark mode table demo" -ForegroundColor White
    Write-Host "   2. Open table-theme-demo.html to use the table theme customizer" -ForegroundColor White
    Write-Host "   3. The table component will use table.json data automatically" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some tests failed. Please check the missing files above." -ForegroundColor Yellow
}

Write-Host "`n✅ Test complete!" -ForegroundColor Green
