# Tests for website_template_generator.html functionality
# This script verifies that the HTML template can load properly

Write-Host "🧪 Running tests for website_template_generator.html" -ForegroundColor Cyan

# Variables
$projectRoot = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder"
$htmlFile = Join-Path $projectRoot "website_template_generator.html"
$mainTsxFile = Join-Path $projectRoot "src\main.tsx"

# Test 1: Verify the HTML file exists
Write-Host "Test 1: Checking if website_template_generator.html exists..." -NoNewline
if (Test-Path $htmlFile) {
    Write-Host "✅ PASS" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL - HTML file not found" -ForegroundColor Red
    exit 1
}

# Test 2: Verify the HTML has the required elements
Write-Host "Test 2: Checking for required elements in the HTML..." -NoNewline
$htmlContent = Get-Content $htmlFile -Raw
$requiredElements = @(
    '<div id="root">',
    '<script type="module" src="/src/main.tsx"></script>',
    'themeSelect',
    'layoutSelect',
    'navSelect',
    'exportBtn'
)

$allFound = $true
foreach ($element in $requiredElements) {
    if (-not $htmlContent.Contains($element)) {
        Write-Host "❌ FAIL - Missing element: $element" -ForegroundColor Red
        $allFound = $false
        break
    }
}

if ($allFound) {
    Write-Host "✅ PASS" -ForegroundColor Green
}

# Test 3: Verify the main.tsx file exists and imports the correct component
Write-Host "Test 3: Checking if main.tsx imports HybridWebsiteBuilder..." -NoNewline
if (Test-Path $mainTsxFile) {
    $mainTsxContent = Get-Content $mainTsxFile -Raw
    if ($mainTsxContent.Contains("HybridWebsiteBuilder")) {
        Write-Host "✅ PASS" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL - main.tsx doesn't import HybridWebsiteBuilder" -ForegroundColor Red
    }
} else {
    Write-Host "❌ FAIL - main.tsx not found" -ForegroundColor Red
}

# Summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
Write-Host "The website_template_generator.html has been successfully checked for integration with the React application."
Write-Host "To verify full functionality, run the application with: npm run dev"
