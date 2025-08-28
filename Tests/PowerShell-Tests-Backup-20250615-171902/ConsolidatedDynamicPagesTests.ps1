# Consolidated Dynamic Pages Tests
# Date: June 10, 2025
# This file consolidates all dynamic pages related tests from:
# - DynamicPages.Tests.ps1
# - DynamicPagesFixed.Tests.ps1
# - DynamicPagesTest.ps1
# - test-dynamic-pages.html is referenced for testing

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== Consolidated Dynamic Pages Tests ===" -ForegroundColor Cyan
Write-Host "Testing all dynamic page functionality for the Website Builder"

#region Main Website Builder Tests
Write-Host "`n=== Testing Dynamic Pages in Main Website Builder ===" -ForegroundColor Yellow
$jsContent = Get-Content -Path "$projectRoot\wb.js" -Raw

# Test 1: Check if dynamic page creation functions exist in main JS
Write-Host "Test 1: Checking if dynamic page creation functions exist in main website builder..." -ForegroundColor Yellow

$setupFunctionExists = $jsContent -match 'function setupDynamicPagesNavigation\(\)'
$createPageFunctionExists = $jsContent -match 'function createNewPage\(pageName\)'
$showPageFunctionExists = $jsContent -match 'function showPage\(pageName\)'
$navEventListenerExists = $jsContent -match 'document\.addEventListener\(''click'', \(e\) => \{'

if ($setupFunctionExists -and $createPageFunctionExists -and $showPageFunctionExists -and $navEventListenerExists) {
    Write-Host "✅ Dynamic page creation functions exist in JavaScript." -ForegroundColor Green
} else {
    Write-Host "❌ One or more dynamic page functions are missing:" -ForegroundColor Red
    Write-Host "   Setup function exists: $setupFunctionExists" -ForegroundColor $(if ($setupFunctionExists) {"Green"} else {"Red"})
    Write-Host "   Create page function exists: $createPageFunctionExists" -ForegroundColor $(if ($createPageFunctionExists) {"Green"} else {"Red"})
    Write-Host "   Show page function exists: $showPageFunctionExists" -ForegroundColor $(if ($showPageFunctionExists) {"Green"} else {"Red"})
    Write-Host "   Navigation event listener exists: $navEventListenerExists" -ForegroundColor $(if ($navEventListenerExists) {"Green"} else {"Red"})
}

# Test 2: Check if page state saving is implemented in main JS
Write-Host "Test 2: Checking if page state saving is implemented..." -ForegroundColor Yellow

$saveStatePageExists = $jsContent -match 'state\.pages\s*='
$loadStatePageExists = $jsContent -match 'if\s*\(\s*state\.pages\s*\)'

if ($saveStatePageExists -and $loadStatePageExists) {
    Write-Host "✅ Page state saving is implemented." -ForegroundColor Green
} else {
    Write-Host "❌ Page state saving is not fully implemented:" -ForegroundColor Red
    Write-Host "   Save state for pages exists: $saveStatePageExists" -ForegroundColor $(if ($saveStatePageExists) {"Green"} else {"Red"})
    Write-Host "   Load state for pages exists: $loadStatePageExists" -ForegroundColor $(if ($loadStatePageExists) {"Green"} else {"Red"})
}

# Test 3: Check if init function includes setup for dynamic pages
Write-Host "Test 3: Checking if init function includes setup for dynamic pages..." -ForegroundColor Yellow

$initIncludesSetup = $jsContent -match 'setupDynamicPagesNavigation\(\);'

if ($initIncludesSetup) {
    Write-Host "✅ Init function includes setup for dynamic pages." -ForegroundColor Green
} else {
    Write-Host "❌ Init function does not include setup for dynamic pages." -ForegroundColor Red
}
#endregion

#region Test Files
Write-Host "`n=== Testing Dedicated Dynamic Pages Test Files ===" -ForegroundColor Yellow

# Test 1: Verify our test files exist
Write-Host "Test 1: Checking if test files exist..." -ForegroundColor Yellow
$testHtmlExists = Test-Path "$projectRoot\test-dynamic-pages.html"
$dynamicPagesJsExists = Test-Path "$projectRoot\dynamic-pages.js"

if ($testHtmlExists -and $dynamicPagesJsExists) {
    Write-Host "✅ All test files exist." -ForegroundColor Green
} else {
    Write-Host "❌ One or more test files are missing:" -ForegroundColor Red
    Write-Host "   Test HTML exists: $testHtmlExists" -ForegroundColor $(if ($testHtmlExists) {"Green"} else {"Red"})
    Write-Host "   Dynamic Pages JS exists: $dynamicPagesJsExists" -ForegroundColor $(if ($dynamicPagesJsExists) {"Green"} else {"Red"})
}

if ($testHtmlExists) {
    # Test 2: Check if HTML page links to correct JS file
    Write-Host "Test 2: Checking if test HTML references the correct JS file..." -ForegroundColor Yellow
    $htmlContent = Get-Content -Path "$projectRoot\test-dynamic-pages.html" -Raw
    $correctJsRef = $htmlContent -match '<script src="dynamic-pages.js"></script>'

    if ($correctJsRef) {
        Write-Host "✅ Test HTML references the correct JS file." -ForegroundColor Green
    } else {
        Write-Host "❌ Test HTML does not reference the correct JS file." -ForegroundColor Red
    }
}

if ($dynamicPagesJsExists) {
    # Test 3: Check if fixed code contains all required functions for dynamic page creation
    Write-Host "Test 3: Checking if all required functions exist in the dedicated dynamic-pages.js file..." -ForegroundColor Yellow
    $jsContent = Get-Content -Path "$projectRoot\dynamic-pages.js" -Raw

    $setupFunctionExists = $jsContent -match 'function setupDynamicPagesNavigation\('
    $createPageFunctionExists = $jsContent -match 'function createNewPage\('
    $showPageFunctionExists = $jsContent -match 'function showPage\('
    $showHomePageFunctionExists = $jsContent -match 'function showHomePage\('
    $handleHashExists = $jsContent -match 'handleHashNavigation'
    $currentPageVarExists = $jsContent -match 'let currentPage'

    if ($setupFunctionExists -and $createPageFunctionExists -and $showPageFunctionExists -and 
        $showHomePageFunctionExists -and $handleHashExists -and $currentPageVarExists) {
        Write-Host "✅ All required functions for dynamic page creation exist." -ForegroundColor Green
    } else {
        Write-Host "❌ One or more required functions are missing:" -ForegroundColor Red
        Write-Host "   Setup function exists: $setupFunctionExists" -ForegroundColor ($setupFunctionExists ? "Green" : "Red")
        Write-Host "   Create page function exists: $createPageFunctionExists" -ForegroundColor ($createPageFunctionExists ? "Green" : "Red")
        Write-Host "   Show page function exists: $showPageFunctionExists" -ForegroundColor ($showPageFunctionExists ? "Green" : "Red")
        Write-Host "   Show home page function exists: $showHomePageFunctionExists" -ForegroundColor ($showHomePageFunctionExists ? "Green" : "Red")
        Write-Host "   Handle hash navigation exists: $handleHashExists" -ForegroundColor ($handleHashExists ? "Green" : "Red")
        Write-Host "   Current page variable exists: $currentPageVarExists" -ForegroundColor ($currentPageVarExists ? "Green" : "Red")
    }
}
#endregion

# Summary
$totalTests = 6
$passedTests = ($setupFunctionExists -and $createPageFunctionExists -and $showPageFunctionExists -and $navEventListenerExists) +
               ($saveStatePageExists -and $loadStatePageExists) +
               ($initIncludesSetup) +
               ($testHtmlExists -and $dynamicPagesJsExists) +
               ($testHtmlExists -and $correctJsRef) +
               ($setupFunctionExists -and $createPageFunctionExists -and $showPageFunctionExists -and 
                $showHomePageFunctionExists -and $handleHashExists -and $currentPageVarExists)

Write-Host "`n=== Dynamic Pages Test Results Summary ===" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests"
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red

if ($totalTests - $passedTests -gt 0) {
    Write-Host "❌ Some tests failed. Please fix the issues and run the tests again." -ForegroundColor Red
} else {
    Write-Host "✅ All dynamic pages tests passed!" -ForegroundColor Green
}
