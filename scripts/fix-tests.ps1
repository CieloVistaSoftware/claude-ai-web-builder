#!/usr/bin/env pwsh
# Fix Tests Loop with Issue Logging
# Usage: .\fix-tests.ps1

param(
    [string]$TestPattern = "",
    [int]$MaxTests = 999
)

$logFile = "test-fixes-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$issueFile = "test-issues-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

function Log {
    param([string]$Message)
    Write-Host $Message
    Add-Content -Path $logFile -Value "$(Get-Date -Format 'HH:mm:ss') $Message"
}

function LogIssue {
    param(
        [string]$TestName,
        [string]$Error,
        [string]$Status = "IN PROGRESS"
    )
    $entry = @"
═══════════════════════════════════════════
Test: $TestName
Status: $Status
Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Error: $Error
───────────────────────────────────────────
"@
    Add-Content -Path $issueFile -Value $entry
}

$count = 0
$fixed = 0

Write-Host ""
Log "═══════════════════════════════════════════"
Log "STARTING TEST FIX LOOP"
Log "Log file: $logFile"
Log "Issues file: $issueFile"
Log "═══════════════════════════════════════════"

while ($true) {
    Write-Host ""
    Log ""
    Log "═══════════════════════════════════════════"
    Log "Test Run #$($count + 1) | Fixed: $fixed"
    Log "═══════════════════════════════════════════"
    
    # Kill any hanging processes
    taskkill /F /IM node.exe /T 2>$null | Out-Null
    npm run kill-port 2>&1 | Out-Null
    Start-Sleep -Seconds 1
    
    # Run test
    Log "Running test..."
    
    $tempOutput = "temp-test-output-$([guid]::NewGuid()).txt"
    
    if ($TestPattern) {
        & npm run test:failfast 2>&1 | Tee-Object -FilePath $tempOutput | Out-Host
        $testName = $TestPattern
    } else {
        & npm run test:failfast 2>&1 | Tee-Object -FilePath $tempOutput | Out-Host
        $testName = "failfast"
    }
    
    $exitCode = $LASTEXITCODE
    
    # Kill report server that might be hanging
    taskkill /F /IM node.exe /T 2>$null | Out-Null
    Start-Sleep -Seconds 1
    
    $testOutput = Get-Content $tempOutput -Raw -ErrorAction SilentlyContinue
    
    Log "Exit Code: $exitCode"
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ TEST PASSED" -ForegroundColor Green
        Log "✅ TEST PASSED - Moving to next test"
        $fixed++
        $count++
        
        if ($count -ge $MaxTests) {
            break
        }
    }
    else {
        Write-Host ""
        Write-Host "❌ TEST FAILED (Exit Code: $exitCode)" -ForegroundColor Red
        Log "❌ TEST FAILED (Exit Code: $exitCode)"
        
        # Extract error message
        $errorLines = $testOutput | Select-String -Pattern "Error|error|failed|Failed|Timeout|timeout" | Select-Object -First 3
        $errorMsg = if ($errorLines) { $errorLines -join " | " } else { "See output above" }
        
        Write-Host ""
        Write-Host "ISSUE LOGGED" -ForegroundColor Yellow
        Log "ISSUE LOGGED - Working on fix..."
        
        # Log the issue
        LogIssue -TestName $testName -Error $errorMsg -Status "IN PROGRESS"
        
        Write-Host ""
        Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "FIX THE TEST IN YOUR CODE" -ForegroundColor Yellow
        Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "1. Open the test file that failed" -ForegroundColor White
        Write-Host "2. Fix the issue" -ForegroundColor White
        Write-Host "3. Save the file" -ForegroundColor White
        Write-Host "4. Type 'done' and press Enter" -ForegroundColor White
        Write-Host "═══════════════════════════════════════════" -ForegroundColor Yellow
        Write-Host ""
        
        $input = Read-Host "Type 'done' to retest"
        
        if ($input -eq "done") {
            Log "USER APPLIED FIX - Retesting..."
            $count++
        }
    }
    
    # Cleanup
    Remove-Item $tempOutput -ErrorAction SilentlyContinue
    
    # Kill everything before next iteration
    taskkill /F /IM node.exe /T 2>$null | Out-Null
}

Write-Host ""
Write-Host "✅ ALL TESTS PASSED" -ForegroundColor Green
Log ""
Log "✅ ALL TESTS PASSED - Fixed $fixed tests"
Log "═══════════════════════════════════════════"
Log ""

Write-Host "Logs saved to:"
Write-Host "  - $logFile" -ForegroundColor Cyan
Write-Host "  - $issueFile" -ForegroundColor Cyan
