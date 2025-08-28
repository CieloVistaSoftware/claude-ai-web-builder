# Consolidated Footer Tests
# Date: June 10, 2025
# This file consolidates all footer related tests from:
# - FooterControl.Tests.ps1
# - FooterHiding.Tests.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== Consolidated Footer Tests ===" -ForegroundColor Cyan
Write-Host "Testing all footer functionality for the Website Builder"

# Files to test
$htmlFile = "$projectRoot\wb.html"
$jsFile = "$projectRoot\wb.js"
$cssFile = "$projectRoot\wb.css"

#region Footer Position Control Tests
Write-Host "`n=== Testing Footer Position Control ===" -ForegroundColor Yellow
$htmlContent = Get-Content -Path $htmlFile -Raw
$jsContent = Get-Content -Path $jsFile -Raw
$cssContent = Get-Content -Path $cssFile -Raw

# Check for footer position control in HTML
$footerControlExists = $htmlContent -match '<label for="footer-position-select">Footer Position</label>'
$footerSelectExists = $htmlContent -match '<select id="footer-position-select">'
$footerOptionsExist = $htmlContent -match '<option value="same-page">Same Page As Header</option>' -and
                     $htmlContent -match '<option value="each-page">On Each Page</option>'

if ($footerControlExists -and $footerSelectExists -and $footerOptionsExist) {
    Write-Host "✅ Footer position control was added to HTML." -ForegroundColor Green
} else {
    Write-Host "❌ Footer position control is missing from HTML:" -ForegroundColor Red
    Write-Host "   Label exists: $footerControlExists" -ForegroundColor $(if ($footerControlExists) {"Green"} else {"Red"})
    Write-Host "   Select exists: $footerSelectExists" -ForegroundColor $(if ($footerSelectExists) {"Green"} else {"Red"})
    Write-Host "   Options exist: $footerOptionsExist" -ForegroundColor $(if ($footerOptionsExist) {"Green"} else {"Red"})
}

# Check for footer position select variable in JS
$footerPositionVarExists = $jsContent -match 'let\s+.*footerPositionSelect'

if ($footerPositionVarExists) {
    Write-Host "✅ Footer position select variable exists in JS." -ForegroundColor Green
} else {
    Write-Host "❌ Footer position select variable is missing from JS." -ForegroundColor Red
}

# Check for footer position event listener in JS
$footerPositionListenerExists = $jsContent -match 'footerPositionSelect\.addEventListener\s*\(\s*[''"]change'

if ($footerPositionListenerExists) {
    Write-Host "✅ Footer position change event listener exists in JS." -ForegroundColor Green
} else {
    Write-Host "❌ Footer position change event listener is missing from JS." -ForegroundColor Red
}

# Check for footer position save in state
$footerPositionStateExists = $jsContent -match 'state\.footerPosition'

if ($footerPositionStateExists) {
    Write-Host "✅ Footer position is saved in state." -ForegroundColor Green
} else {
    Write-Host "❌ Footer position is not saved in state." -ForegroundColor Red
}
#endregion

#region Footer Visibility Tests
Write-Host "`n=== Testing Footer Visibility Control ===" -ForegroundColor Yellow

# Check for footer visibility toggle in HTML
$footerVisibilityToggleExists = $htmlContent -match '<input\s+type="checkbox"\s+id="footer-visibility"' -or
                              $htmlContent -match '<input\s+id="footer-visibility"\s+type="checkbox"'

if ($footerVisibilityToggleExists) {
    Write-Host "✅ Footer visibility toggle exists in HTML." -ForegroundColor Green
} else {
    Write-Host "❌ Footer visibility toggle is missing from HTML." -ForegroundColor Red
}

# Check for footer visibility CSS
$footerHiddenCssExists = $cssContent -match '\.footer-hidden' -or
                       $cssContent -match '\.site-footer\.hidden'

if ($footerHiddenCssExists) {
    Write-Host "✅ Footer hidden CSS exists." -ForegroundColor Green
} else {
    Write-Host "❌ Footer hidden CSS is missing." -ForegroundColor Red
}

# Check for footer visibility JS
$footerVisibilityJsExists = $jsContent -match 'footerVisibility\.addEventListener'

if ($footerVisibilityJsExists) {
    Write-Host "✅ Footer visibility event listener exists in JS." -ForegroundColor Green
} else {
    Write-Host "❌ Footer visibility event listener is missing from JS." -ForegroundColor Red
}
#endregion

# Summary
$totalTests = 7
$passedTests = ($footerControlExists -and $footerSelectExists -and $footerOptionsExist) +
              ($footerPositionVarExists) +
              ($footerPositionListenerExists) +
              ($footerPositionStateExists) +
              ($footerVisibilityToggleExists) +
              ($footerHiddenCssExists) +
              ($footerVisibilityJsExists)

Write-Host "`n=== Footer Test Results Summary ===" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests"
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red

if ($totalTests - $passedTests -gt 0) {
    Write-Host "❌ Some tests failed. Please fix the issues and run the tests again." -ForegroundColor Red
} else {
    Write-Host "✅ All footer tests passed!" -ForegroundColor Green
}
