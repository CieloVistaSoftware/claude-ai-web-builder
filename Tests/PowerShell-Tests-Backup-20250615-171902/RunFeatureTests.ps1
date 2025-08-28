# Focused test runner for just the color bar and footer updates
# This script runs only the tests related to our changes

Write-Host "=== Claude AI Website Builder Feature Tests ===" -ForegroundColor Cyan
Write-Host "Running tests for color bar and footer position updates"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

# Define the specific test files we want to run
$testFiles = @(
    "ColorBarCombinedTest.ps1",
    "ColorBarAndFooterUpdates.Tests.ps1"
)

$allTestsPassed = $true

# Run each test file
foreach ($testFile in $testFiles) {
    $testPath = Join-Path $scriptPath $testFile
    
    Write-Host "`n======================================================="
    Write-Host "Running test: $testFile" -ForegroundColor Yellow
    Write-Host "======================================================="
    
    try {
        # Run the test script and capture its output
        & $testPath
        
        Write-Host "Test completed: $testFile" -ForegroundColor Green
    }
    catch {
        $allTestsPassed = $false
        Write-Host "Error running test: $_" -ForegroundColor Red
    }
}

# Overall result
if ($allTestsPassed) {
    Write-Host "`n✅ SUCCESS: All feature tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ FAILURE: Some tests failed!" -ForegroundColor Red
    exit 1
}
