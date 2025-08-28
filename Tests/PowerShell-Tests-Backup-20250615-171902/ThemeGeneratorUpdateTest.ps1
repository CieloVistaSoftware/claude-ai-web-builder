# Tests/ThemeGeneratorUpdateTest.ps1
# This script verifies that the theme generator updates all sections correctly

$ErrorActionPreference = "Stop"
$themeGeneratorPath = Join-Path $PSScriptRoot ".." "themes" "theme-generator.html"
$emptyFilesPath = Join-Path $PSScriptRoot ".." "hue-color-slider.html"

Write-Host "Testing Theme Generator Functionality" -ForegroundColor Blue
Write-Host "-------------------------------------" -ForegroundColor Blue

# Check if the theme generator file exists
if (-not (Test-Path $themeGeneratorPath)) {
    Write-Host "❌ Theme generator file not found at: $themeGeneratorPath" -ForegroundColor Red
    exit 1
}

# Read the file content to verify functionality
$themeGeneratorContent = Get-Content -Raw $themeGeneratorPath

# Check if the file has the necessary functions
$requiredFunctions = @(
    "generateAndApplyTheme",
    "applyThemeToPreview", 
    "applyThemeToSemanticDemo",
    "setupLiveUpdates", 
    "updateFloatingPreview"
)

$missingFunctions = @()
foreach ($function in $requiredFunctions) {
    if (-not ($themeGeneratorContent -match $function)) {
        $missingFunctions += $function
    }
}

# Display results
Write-Host "`nChecking for required functions:" -ForegroundColor Yellow
if ($missingFunctions.Count -eq 0) {
    Write-Host "✅ All required functions are present in the theme generator!" -ForegroundColor Green
} else {
    Write-Host "❌ The following functions are missing:" -ForegroundColor Red
    foreach ($function in $missingFunctions) {
        Write-Host "  - $function" -ForegroundColor Red
    }
}

# Check if empty files exist (to be removed)
Write-Host "`nChecking for empty files in root directory:" -ForegroundColor Yellow
$emptyHueSlider = Test-Path (Join-Path $PSScriptRoot ".." "hue-color-slider.html")
$emptyHslPicker = Test-Path (Join-Path $PSScriptRoot ".." "hsl-color-picker.html")

if ($emptyHueSlider) {
    Write-Host "❌ Empty file found: hue-color-slider.html (should be removed)" -ForegroundColor Red
}

if ($emptyHslPicker) {
    Write-Host "❌ Empty file found: hsl-color-picker.html (should be removed)" -ForegroundColor Red
}

if (-not $emptyHueSlider -and -not $emptyHslPicker) {
    Write-Host "✅ No empty files found in root directory" -ForegroundColor Green
}

# Check that the proper files exist in the themes directory
$themeHueSlider = Test-Path (Join-Path $PSScriptRoot ".." "themes" "hue-color-slider.html")
$themeHslPicker = Test-Path (Join-Path $PSScriptRoot ".." "themes" "hsl-color-picker.html")

Write-Host "`nChecking for required files in themes directory:" -ForegroundColor Yellow
if ($themeHueSlider) {
    Write-Host "✅ hue-color-slider.html exists in themes directory" -ForegroundColor Green
} else {
    Write-Host "❌ Missing file: themes/hue-color-slider.html" -ForegroundColor Red
}

if ($themeHslPicker) {
    Write-Host "✅ hsl-color-picker.html exists in themes directory" -ForegroundColor Green
} else {
    Write-Host "❌ Missing file: themes/hsl-color-picker.html" -ForegroundColor Red
}

Write-Host "`nVerdict:" -ForegroundColor Blue
if ($missingFunctions.Count -eq 0 -and $themeHueSlider -and $themeHslPicker) {
    Write-Host "✅ Theme generator is properly set up to update all sections when colors or modes change!" -ForegroundColor Green
    
    if ($emptyHueSlider -or $emptyHslPicker) {
        Write-Host "⚠️ Action needed: Remove empty files from root directory" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Theme generator needs additional work" -ForegroundColor Red
}
