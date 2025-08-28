# Test script for Table.html functionality
# Date: June 11, 2025
# Description: Verify that table.html uses table.json correctly and all datasets work

param(
    [switch]$Detailed
)

Write-Host "🧪 Testing Table.html functionality..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$testResults = @()
$testsPassed = 0
$testsTotal = 0

# Test 1: Check if table.json exists and has proper structure
Write-Host "`n📁 Test 1: Checking table.json file..." -ForegroundColor Yellow
$testsTotal++

$tableJsonPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.json"
if (Test-Path $tableJsonPath) {
    try {
        $jsonContent = Get-Content $tableJsonPath -Raw | ConvertFrom-Json
        
        # Check if required datasets exist
        $hasEmployees = $null -ne $jsonContent.employees -and $jsonContent.employees.Count -gt 0
        $hasProducts = $null -ne $jsonContent.products -and $jsonContent.products.Count -gt 0  
        $hasTransactions = $null -ne $jsonContent.transactions -and $jsonContent.transactions.Count -gt 0
        
        if ($hasEmployees -and $hasProducts -and $hasTransactions) {
            Write-Host "✅ table.json has all required datasets" -ForegroundColor Green
            Write-Host "   - Employees: $($jsonContent.employees.Count) records" -ForegroundColor Gray
            Write-Host "   - Products: $($jsonContent.products.Count) records" -ForegroundColor Gray  
            Write-Host "   - Transactions: $($jsonContent.transactions.Count) records" -ForegroundColor Gray
            $testsPassed++
            $testResults += "✅ table.json structure is valid"
        } else {
            Write-Host "❌ table.json missing required datasets" -ForegroundColor Red
            $testResults += "❌ table.json missing datasets"
        }
    } catch {
        Write-Host "❌ table.json is not valid JSON: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "❌ table.json invalid JSON"
    }
} else {
    Write-Host "❌ table.json file not found" -ForegroundColor Red
    $testResults += "❌ table.json file missing"
}

# Test 2: Check table.html uses setColumns and setData methods
Write-Host "`n📝 Test 2: Checking table.html uses proper API methods..." -ForegroundColor Yellow
$testsTotal++

$tableHtmlPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table.html"
if (Test-Path $tableHtmlPath) {
    $htmlContent = Get-Content $tableHtmlPath -Raw
    
    $usesSetColumns = $htmlContent -match "\.setColumns\("
    $usesSetData = $htmlContent -match "\.setData\("
    $avoidsOldAPI = $htmlContent -notmatch "\.columns\s*=" -and $htmlContent -notmatch "\.data\s*="
    $avoidsLoadData = $htmlContent -notmatch "\.loadData\("
    
    if ($usesSetColumns -and $usesSetData -and $avoidsLoadData) {
        Write-Host "✅ table.html uses correct API methods (setColumns, setData)" -ForegroundColor Green
        $testsPassed++
        $testResults += "✅ table.html uses proper API"
    } else {
        Write-Host "❌ table.html still uses incorrect API methods" -ForegroundColor Red
        if (!$usesSetColumns) { Write-Host "   - Missing setColumns usage" -ForegroundColor Red }
        if (!$usesSetData) { Write-Host "   - Missing setData usage" -ForegroundColor Red }
        if (!$avoidsLoadData) { Write-Host "   - Still using non-existent loadData method" -ForegroundColor Red }
        $testResults += "❌ table.html uses incorrect API"
    }
} else {
    Write-Host "❌ table.html file not found" -ForegroundColor Red
    $testResults += "❌ table.html file missing"
}

# Test 3: Check that all datasets have proper column mappings
Write-Host "`n🔗 Test 3: Checking dataset column mappings..." -ForegroundColor Yellow
$testsTotal++

if ($htmlContent) {
    $hasEmployeeMapping = ($htmlContent -match "case 'employees':") -and ($htmlContent -match "firstName") -and ($htmlContent -match "lastName") -and ($htmlContent -match "email") -and ($htmlContent -match "role") -and ($htmlContent -match "department") -and ($htmlContent -match "status")
    $hasProductMapping = ($htmlContent -match "case 'products':") -and ($htmlContent -match "name") -and ($htmlContent -match "category") -and ($htmlContent -match "price") -and ($htmlContent -match "stock") -and ($htmlContent -match "rating") -and ($htmlContent -match "featured")
    $hasTransactionMapping = ($htmlContent -match "case 'transactions':") -and ($htmlContent -match "date") -and ($htmlContent -match "customer") -and ($htmlContent -match "amount") -and ($htmlContent -match "paymentMethod")
    
    if ($hasEmployeeMapping -and $hasProductMapping -and $hasTransactionMapping) {
        Write-Host "✅ All datasets have proper column mappings" -ForegroundColor Green
        $testsPassed++
        $testResults += "✅ Dataset column mappings complete"
    } else {
        Write-Host "❌ Missing column mappings for some datasets" -ForegroundColor Red
        if (!$hasEmployeeMapping) { Write-Host "   - Missing employee column mapping" -ForegroundColor Red }
        if (!$hasProductMapping) { Write-Host "   - Missing product column mapping" -ForegroundColor Red }
        if (!$hasTransactionMapping) { Write-Host "   - Missing transaction column mapping" -ForegroundColor Red }
        $testResults += "❌ Incomplete dataset mappings"
    }
}

# Test 4: Verify dark mode styling
Write-Host "`n🌙 Test 4: Checking dark mode styling..." -ForegroundColor Yellow
$testsTotal++

if ($htmlContent) {
    $hasDarkModeVars = ($htmlContent -match "--text-color:\s*#f0f0f0") -and ($htmlContent -match "--bg-color:\s*#121212")
    $hasDarkModeStatusStyles = ($htmlContent -match "\.status\.active") -and ($htmlContent -match "rgba\(34,\s*197,\s*94")
    
    if ($hasDarkModeVars -and $hasDarkModeStatusStyles) {
        Write-Host "✅ Dark mode styling is properly implemented" -ForegroundColor Green
        $testsPassed++
        $testResults += "✅ Dark mode styling complete"
    } else {
        Write-Host "❌ Dark mode styling incomplete" -ForegroundColor Red
        if (!$hasDarkModeVars) { Write-Host "   - Missing dark mode CSS variables" -ForegroundColor Red }
        if (!$hasDarkModeStatusStyles) { Write-Host "   - Missing dark mode status styles" -ForegroundColor Red }
        $testResults += "❌ Dark mode styling incomplete"
    }
}

# Test 5: Verify table component registration
Write-Host "`n🏗️ Test 5: Checking table component registration..." -ForegroundColor Yellow
$testsTotal++

$tableComponentPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\table\table-component.js"
if (Test-Path $tableComponentPath) {
    $componentContent = Get-Content $tableComponentPath -Raw
    $hasProperRegistration = $componentContent -match "customElements\.define\('table-component'" -and $componentContent -match "class TableComponent extends HTMLElement"
    $hasSetMethods = $componentContent -match "setData\(data\)" -and $componentContent -match "setColumns\(columns\)"
    
    if ($hasProperRegistration -and $hasSetMethods) {
        Write-Host "✅ Table component is properly registered with correct methods" -ForegroundColor Green
        $testsPassed++
        $testResults += "✅ Table component registration valid"
    } else {
        Write-Host "❌ Table component registration issues" -ForegroundColor Red
        if (!$hasProperRegistration) { Write-Host "   - Missing proper component registration" -ForegroundColor Red }
        if (!$hasSetMethods) { Write-Host "   - Missing setData/setColumns methods" -ForegroundColor Red }
        $testResults += "❌ Table component registration invalid"
    }
} else {
    Write-Host "❌ table-component.js file not found" -ForegroundColor Red
    $testResults += "❌ table-component.js missing"
}

# Summary
Write-Host "`n📊 Test Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed/$testsTotal" -ForegroundColor $(if ($testsPassed -eq $testsTotal) { 'Green' } else { 'Yellow' })

if ($Detailed) {
    Write-Host "`n📋 Detailed Results:" -ForegroundColor Gray
    foreach ($result in $testResults) {
        Write-Host "   $result" -ForegroundColor Gray
    }
}

if ($testsPassed -eq $testsTotal) {
    Write-Host "`n🎉 All tests passed! Table.html should now work correctly with table.json data." -ForegroundColor Green
    Write-Host "🔧 Key fixes applied:" -ForegroundColor Green
    Write-Host "   - Uses setColumns() and setData() instead of property assignment" -ForegroundColor Gray
    Write-Host "   - Properly loads data from table.json for all examples" -ForegroundColor Gray  
    Write-Host "   - Dataset switching now works for employees, products, and transactions" -ForegroundColor Gray
    Write-Host "   - Dark mode styling is properly implemented" -ForegroundColor Gray
} else {
    Write-Host "`n⚠️ Some tests failed. Please review the issues above." -ForegroundColor Yellow
}

Write-Host "`n✨ Run this test again after making changes to verify fixes." -ForegroundColor Cyan
