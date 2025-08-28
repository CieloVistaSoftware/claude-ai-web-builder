# Master test runner for Claude AI Website Builder
# This script runs all test files to verify compliance with Unified Web Development Standards

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== Claude AI Website Builder Test Suite ===" -ForegroundColor Cyan
Write-Host "Running all tests to verify compliance with Unified Web Development Standards"

# Define all test files to run
$testFiles = @(
    "NavWidth.Tests.ps1",
    "CssStandardsValidation.Tests.ps1",
    "DynamicPagesTest.ps1",     # Consolidated dynamic pages test
    "FooterHiding.Tests.ps1",
    "GridLayout.Tests.ps1",
    "MediaPlaceholder.Tests.ps1",
    "ColorBarTest.ps1"          # Consolidated color bar test
)

# Run all tests
$totalPassed = 0
$totalFailed = 0

foreach ($testFile in $testFiles) {
    $testPath = Join-Path $scriptPath $testFile
    
    if (Test-Path $testPath) {
        Write-Host "`n`n----------------------------------------"
        Write-Host "Running test: $testFile" -ForegroundColor Magenta
        Write-Host "----------------------------------------`n"
        
        try {
            & $testPath
            
            if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
                $totalPassed++
                Write-Host "`nTest completed: $testFile" -ForegroundColor Green
            } else {
                $totalFailed++
                Write-Host "`nTest failed: $testFile" -ForegroundColor Red
            }
        } catch {
            $totalFailed++
            Write-Host "Error executing test: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Test file not found: $testPath" -ForegroundColor Red
        $totalFailed++
    }
}

# Show test summary
Write-Host "`n`n============================================"
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "============================================"
Write-Host "Total Tests: $($totalPassed + $totalFailed)"
Write-Host "Passed: $totalPassed" -ForegroundColor Green
Write-Host "Failed: $totalFailed" -ForegroundColor $(if ($totalFailed -gt 0) { "Red" } else { "Green" })
Write-Host "============================================`n"

# Return exit code based on test results
if ($totalFailed -gt 0) {
    exit 1
} else {
    Write-Host "All tests passed successfully!" -ForegroundColor Green
    exit 0
}