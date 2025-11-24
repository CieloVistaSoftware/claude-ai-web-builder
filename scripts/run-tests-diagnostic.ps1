#!/usr/bin/env pwsh

<#
.SYNOPSIS
Run Playwright tests and capture detailed diagnostics

.DESCRIPTION
Executes npm test and logs all output for analysis
#>

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🚀 STARTING PLAYWRIGHT TESTS                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Create test results directory
$testResultsDir = "test-results"
if (-not (Test-Path $testResultsDir)) {
    New-Item -ItemType Directory -Path $testResultsDir | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$testResultsDir\test-run-$timestamp.log"

Write-Host "📝 Test Log: $logFile" -ForegroundColor Gray
Write-Host ""

# Run the tests and capture output
Write-Host "Running: npm test" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$output = @()
$process = Start-Process -FilePath "npm" -ArgumentList "test" -NoNewWindow -PassThru -RedirectStandardOutput "$testResultsDir\stdout-$timestamp.txt" -RedirectStandardError "$testResultsDir\stderr-$timestamp.txt" -Wait

$exitCode = $process.ExitCode

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Read the output files
$stdout = Get-Content "$testResultsDir\stdout-$timestamp.txt" -Raw
$stderr = Get-Content "$testResultsDir\stderr-$timestamp.txt" -Raw

# Display output
Write-Host "STDOUT:" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host $stdout

if ($stderr) {
    Write-Host ""
    Write-Host "STDERR:" -ForegroundColor Red
    Write-Host "──────────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host $stderr
}

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 TEST RESULTS:" -ForegroundColor Cyan
Write-Host "   Exit Code: $exitCode" -ForegroundColor Gray

if ($exitCode -eq 0) {
    Write-Host "   Status: ✅ PASSED" -ForegroundColor Green
} else {
    Write-Host "   Status: ❌ FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "📁 Logs saved to:" -ForegroundColor Yellow
Write-Host "   $logFile" -ForegroundColor Gray
Write-Host "   $testResultsDir\stdout-$timestamp.txt" -ForegroundColor Gray
Write-Host "   $testResultsDir\stderr-$timestamp.txt" -ForegroundColor Gray
Write-Host ""

exit $exitCode
