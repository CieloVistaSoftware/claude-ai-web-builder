# Consolidated Color Bar Tests
# Date: June 10, 2025
# This file consolidates all color bar related tests from:
# - ColorBar.Tests.ps1
# - ColorBarAndFooterUpdates.Tests.ps1
# - ColorBarCombinedTest.ps1
# - ColorBarFunctionality.Tests.ps1
# - ColorBarImplementationTest.ps1
# - ColorBarTest.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== Consolidated Color Bar Tests ===" -ForegroundColor Cyan
Write-Host "Testing all color bar functionality for the Website Builder"

# Files to test
$htmlFile = "$projectRoot\wb.html"
$jsFile = "$projectRoot\wb.js"
$cssFile = "$projectRoot\wb.css"

# Test Results
$passCount = 0
$failCount = 0
$warningCount = 0

#region HTML Structure Tests
Write-Host "`n=== Testing HTML Structure for Color Controls ===" -ForegroundColor Yellow
$htmlContent = Get-Content -Path $htmlFile -Raw

# Check for color mode select
if ($htmlContent -match 'id="color-mode-select"') {
    Write-Host "✓ Color mode select element found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color mode select element missing" -ForegroundColor Red
    $failCount++
}

# Check for the color bar slider
if ($htmlContent -match 'id="color-bar"' -and $htmlContent -match 'class="color-bar-slider"') {
    Write-Host "✓ Color bar slider found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color bar slider missing" -ForegroundColor Red
    $failCount++
}

# Check for the color bar preview
if ($htmlContent -match 'id="color-bar-preview"' -and $htmlContent -match 'class="color-bar-preview"') {
    Write-Host "✓ Color bar preview element found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color bar preview element missing" -ForegroundColor Red
    $failCount++
}

# Check for primary color picker
if ($htmlContent -match 'id="primary-color"' -and $htmlContent -match 'type="color"') {
    Write-Host "✓ Primary color picker found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Primary color picker missing" -ForegroundColor Red
    $failCount++
}

# Check for lightness and saturation sliders
$lightnessSliderExists = $htmlContent -match 'id="lightness-slider"' -and $htmlContent -match 'min="20" max="80"'
$saturationSliderExists = $htmlContent -match 'id="saturation-slider"' -and $htmlContent -match 'min="30" max="100"'

if ($lightnessSliderExists -and $saturationSliderExists) {
    Write-Host "✓ Lightness and saturation adjustment sliders exist" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ One or more adjustment sliders not found" -ForegroundColor Red
    $failCount++
}
#endregion

#region CSS Tests
Write-Host "`n=== Testing CSS for Color Bar ===" -ForegroundColor Yellow
$cssContent = Get-Content -Path $cssFile -Raw

# Check for color bar slider styling
$colorBarSliderCss = $cssContent -match '\.color-bar-slider\s*\{'
if ($colorBarSliderCss) {
    Write-Host "✓ Color bar slider CSS found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color bar slider CSS missing" -ForegroundColor Red
    $failCount++
}

# Check for color gradient
$colorGradientCss = $cssContent -match 'linear-gradient\(to right,.*hsl'
if ($colorGradientCss) {
    Write-Host "✓ Color gradient CSS found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color gradient CSS missing" -ForegroundColor Red
    $failCount++
}

# Check for color preview styling
$colorPreviewCss = $cssContent -match '\.color-bar-preview\s*\{'
if ($colorPreviewCss) {
    Write-Host "✓ Color preview CSS found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color preview CSS missing" -ForegroundColor Red
    $failCount++
}
#endregion

#region JavaScript Tests
Write-Host "`n=== Testing JavaScript for Color Bar ===" -ForegroundColor Yellow
$jsContent = Get-Content -Path $jsFile -Raw

# Check for updateColorBar function
if ($jsContent -match 'function\s+updateColorBar\s*\(') {
    Write-Host "✓ updateColorBar function found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ updateColorBar function missing" -ForegroundColor Red
    $failCount++
}

# Check for color mode change listener
if ($jsContent -match 'colorModeSelect\.addEventListener\s*\(\s*[''"]change[''"]') {
    Write-Host "✓ Color mode change event listener found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color mode change event listener missing" -ForegroundColor Red
    $failCount++
}

# Check for color bar event listener
if ($jsContent -match 'colorBar\.addEventListener\s*\(\s*[''"]input[''"]') {
    Write-Host "✓ Color bar input event listener found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color bar input event listener missing" -ForegroundColor Red
    $failCount++
}

# Check for HSL to RGB conversion
if ($jsContent -match 'function\s+hslToRgb\s*\(') {
    Write-Host "✓ HSL to RGB conversion function found" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ HSL to RGB conversion function missing" -ForegroundColor Red
    $failCount++
}
#endregion

#region Integration Tests
Write-Host "`n=== Integration Tests for Color Bar ===" -ForegroundColor Yellow

# Check if all components are connected
$integratedCorrectly = $jsContent -match 'updateColorBarPreview\s*\(' -and
                       $jsContent -match 'colorBar\.addEventListener\s*\(\s*[''"]input' -and
                       $jsContent -match 'colorBarPreview\.style\.backgroundColor'

if ($integratedCorrectly) {
    Write-Host "✓ Color bar components are properly integrated" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "✗ Color bar components are not properly integrated" -ForegroundColor Red
    $failCount++
}
#endregion

# Summary
Write-Host "`n=== Color Bar Test Results Summary ===" -ForegroundColor Cyan
Write-Host "Total Tests: $($passCount + $failCount)"
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Warnings: $warningCount" -ForegroundColor Yellow

if ($failCount -gt 0) {
    Write-Host "❌ Some tests failed. Please fix the issues and run the tests again." -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ All color bar tests passed!" -ForegroundColor Green
    exit 0
}
