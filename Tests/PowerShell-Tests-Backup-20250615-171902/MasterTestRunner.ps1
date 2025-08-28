# Master Test Runner
# Date: June 10, 2025
# This script runs all the consolidated test files

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== ClaudeAIWebSiteBuilder Master Test Runner ===" -ForegroundColor Magenta
Write-Host "Running all consolidated test suites"
Write-Host "Date: $(Get-Date)`n"

$testFiles = @(
    "ConsolidatedColorBarTests.ps1",
    "ConsolidatedDynamicPagesTests.ps1",
    "ConsolidatedFooterTests.ps1",
    "ConsolidatedThemeTests.ps1"
)

$totalPassed = 0
$totalFailed = 0

foreach ($testFile in $testFiles) {
    $testFilePath = Join-Path -Path $scriptPath -ChildPath $testFile
    
    if (Test-Path $testFilePath) {
        Write-Host "`n`n====================================================" -ForegroundColor Magenta
        Write-Host "Running test suite: $testFile" -ForegroundColor Magenta
        Write-Host "====================================================`n" -ForegroundColor Magenta
        
        try {
            & $testFilePath
            if ($LASTEXITCODE -eq 0) {
                $totalPassed++
            } else {
                $totalFailed++
            }
        } catch {
            Write-Host "Error running test suite $testFile : $_" -ForegroundColor Red
            $totalFailed++
        }
    } else {
        Write-Host "Test file not found: $testFile" -ForegroundColor Red
        $totalFailed++
    }
}

Write-Host "`n`n====================================================" -ForegroundColor Magenta
Write-Host "All Test Suites Complete" -ForegroundColor Magenta
Write-Host "====================================================" -ForegroundColor Magenta
Write-Host "Total Test Suites: $($testFiles.Count)"
Write-Host "Passed: $totalPassed" -ForegroundColor Green
Write-Host "Failed: $totalFailed" -ForegroundColor Red

if ($totalFailed -gt 0) {
    Write-Host "`n❌ Some test suites failed. Please review the results above." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n✅ All test suites passed successfully!" -ForegroundColor Green
    exit 0
}
