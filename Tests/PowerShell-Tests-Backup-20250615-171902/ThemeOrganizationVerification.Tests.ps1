# ThemeOrganizationVerification.Tests.ps1
# This script verifies that theme-related files are organized correctly

# Define project root
$projectRoot = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder"

Write-Host "===== Theme Organization Verification ====="

# 1. Check themes directory exists
$themesDir = Join-Path $projectRoot "themes"
$themesExists = Test-Path $themesDir
Write-Host "Themes directory exists: $themesExists"

# 2. Check expected theme files exist in themes directory
$expectedThemeFiles = @(
    "hsl-color-picker.html",
    "hue-color-slider.html",
    "theme-generator.html"
)

foreach ($file in $expectedThemeFiles) {
    $filePath = Join-Path $themesDir $file
    $fileExists = Test-Path $filePath
    Write-Host "Theme file '$file' exists in themes directory: $fileExists"
}

# 3. Check CSS themes directory exists
$cssThemesDir = Join-Path $projectRoot "css\themes"
$cssThemesDirExists = Test-Path $cssThemesDir
Write-Host "CSS themes directory exists: $cssThemesDirExists"

# 4. Check themes.css exists
$themesCssPath = Join-Path $cssThemesDir "themes.css"
$themesCssExists = Test-Path $themesCssPath
Write-Host "themes.css exists: $themesCssExists"

# 5. Check theme-related test files
$testFiles = Get-ChildItem -Path (Join-Path $projectRoot "Tests") -Filter "*Theme*.ps1" | ForEach-Object { $_.Name }
Write-Host "Theme-related test files found in Tests directory:"
foreach ($file in $testFiles) {
    Write-Host "- $file"
}

# 6. Verify that there are no theme-related files incorrectly placed
$incorrectlyPlacedFiles = Get-ChildItem -Path $projectRoot -File -Recurse -Exclude "*.css", "*.js" | Where-Object { 
    ($_.Name -like "*theme*" -or $_.Name -like "*color*") -and 
    $_.Name -notlike "zzz*" -and 
    $_.FullName -notlike "*\themes\*" -and
    $_.FullName -notlike "*\css\themes\*" -and
    $_.FullName -notlike "*\Tests\*"
}

if ($incorrectlyPlacedFiles) {
    Write-Host "Warning: Found theme-related files not in themes directory:"
    foreach ($file in $incorrectlyPlacedFiles) {
        Write-Host "- $($file.FullName)"
    }
} else {
    Write-Host "No incorrectly placed theme files found."
}

Write-Host "===== Verification Complete ====="
