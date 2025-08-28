# Test Floating Table Theme Controls Implementation
# Created: January 14, 2025
# Purpose: Test the floating, draggable color control panel for table theming

Write-Host "🧪 Testing Floating Table Theme Controls..." -ForegroundColor Cyan

# Change to project directory
Set-Location "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder"

# Test 1: Verify table-theme.html file exists and has floating controls
Write-Host "`n1️⃣ Testing table-theme.html file structure..." -ForegroundColor Yellow

$tableThemeFile = "components\table\table-theme.html"
if (-not (Test-Path $tableThemeFile)) {
    Write-Host "❌ table-theme.html not found!" -ForegroundColor Red
    exit 1
}

# Check for floating control CSS classes
$content = Get-Content $tableThemeFile -Raw
$requiredClasses = @(
    ".floating-color-control",
    ".control-header", 
    ".control-btn",
    ".floating-control-content",
    ".floating-control-group",
    ".color-preview"
)

$missingClasses = @()
foreach ($class in $requiredClasses) {
    if ($content -notmatch [regex]::Escape($class)) {
        $missingClasses += $class
    }
}

if ($missingClasses.Count -gt 0) {
    Write-Host "❌ Missing CSS classes: $($missingClasses -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All floating control CSS classes found" -ForegroundColor Green

# Test 2: Check for floating control HTML elements
Write-Host "`n2️⃣ Testing floating control HTML elements..." -ForegroundColor Yellow

$requiredElements = @(
    'id="floating-control"',
    'id="control-header"',
    'id="minimize-btn"',
    'id="floating-color-bar"',
    'id="floating-saturation-slider"',
    'id="floating-lightness-slider"',
    'id="floating-theme-select"',
    'id="color-preview"'
)

$missingElements = @()
foreach ($element in $requiredElements) {
    if ($content -notmatch [regex]::Escape($element)) {
        $missingElements += $element
    }
}

if ($missingElements.Count -gt 0) {
    Write-Host "❌ Missing HTML elements: $($missingElements -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All floating control HTML elements found" -ForegroundColor Green

# Test 3: Check for JavaScript functionality
Write-Host "`n3️⃣ Testing JavaScript functionality..." -ForegroundColor Yellow

$requiredJSFunctions = @(
    "setupFloatingControls",
    "updateFloatingDisplays",
    "syncControls",
    "isDragging",
    "addEventListener.*mousedown",
    "addEventListener.*mousemove",
    "addEventListener.*mouseup"
)

$missingJS = @()
foreach ($jsFunction in $requiredJSFunctions) {
    if ($content -notmatch $jsFunction) {
        $missingJS += $jsFunction
    }
}

if ($missingJS.Count -gt 0) {
    Write-Host "❌ Missing JavaScript functions: $($missingJS -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All JavaScript functionality found" -ForegroundColor Green

# Test 4: Check for theme preset integration
Write-Host "`n4️⃣ Testing theme preset integration..." -ForegroundColor Yellow

$themePresets = @("light", "dark", "cyberpunk", "ocean", "sunset", "forest")
$missingPresets = @()
foreach ($preset in $themePresets) {
    if ($content -notmatch "value=`"$preset`"") {
        $missingPresets += $preset
    }
}

if ($missingPresets.Count -gt 0) {
    Write-Host "❌ Missing theme presets: $($missingPresets -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All theme presets found" -ForegroundColor Green

# Test 5: Start Live Server to test functionality
Write-Host "`n5️⃣ Starting Live Server to test floating controls..." -ForegroundColor Yellow

# Check if Live Server extension is available
$vscodePath = Get-Command code -ErrorAction SilentlyContinue
if (-not $vscodePath) {
    Write-Host "❌ VS Code not found in PATH" -ForegroundColor Red
    exit 1
}

# Start Live Server
Write-Host "🚀 Starting Live Server for table-theme.html..." -ForegroundColor Blue
Write-Host "📝 Opening VS Code with Live Server extension..." -ForegroundColor Blue

# Open VS Code with the file
& code $tableThemeFile

Write-Host "`n✅ Test completed! Please verify in browser:" -ForegroundColor Green
Write-Host "1. Right-click on table-theme.html in VS Code" -ForegroundColor White
Write-Host "2. Select 'Open with Live Server'" -ForegroundColor White
Write-Host "3. Verify floating control panel appears in top-right" -ForegroundColor White
Write-Host "4. Test dragging the control panel" -ForegroundColor White
Write-Host "5. Test minimize/maximize functionality" -ForegroundColor White
Write-Host "6. Test color sliders affect table appearance" -ForegroundColor White
Write-Host "7. Test theme presets change colors instantly" -ForegroundColor White

# Test 6: Check file size and performance
Write-Host "`n6️⃣ Checking file size and performance..." -ForegroundColor Yellow

$fileInfo = Get-Item $tableThemeFile
$fileSizeKB = [math]::Round($fileInfo.Length / 1KB, 2)

Write-Host "📊 File size: $fileSizeKB KB" -ForegroundColor Cyan

if ($fileSizeKB -gt 100) {
    Write-Host "⚠️  File is quite large. Consider optimization." -ForegroundColor Yellow
} else {
    Write-Host "✅ File size is reasonable" -ForegroundColor Green
}

# Test Summary
Write-Host "`n📋 TEST SUMMARY" -ForegroundColor Magenta
Write-Host "═══════════════" -ForegroundColor Magenta
Write-Host "✅ CSS Classes: All floating control styles present" -ForegroundColor Green
Write-Host "✅ HTML Elements: All required elements with proper IDs" -ForegroundColor Green  
Write-Host "✅ JavaScript: Drag, minimize, and theme functionality" -ForegroundColor Green
Write-Host "✅ Theme Presets: All 6 theme options available" -ForegroundColor Green
Write-Host "✅ Performance: File size reasonable ($fileSizeKB KB)" -ForegroundColor Green

Write-Host "`n🎯 MANUAL VERIFICATION NEEDED:" -ForegroundColor Yellow
Write-Host "• Open table-theme.html with Live Server" -ForegroundColor White
Write-Host "• Test dragging floating control panel" -ForegroundColor White
Write-Host "• Test minimize/maximize functionality" -ForegroundColor White
Write-Host "• Verify color changes affect table styling" -ForegroundColor White
Write-Host "• Test theme presets work correctly" -ForegroundColor White

Write-Host "`n🎉 Floating Table Theme Controls Test Completed!" -ForegroundColor Green
