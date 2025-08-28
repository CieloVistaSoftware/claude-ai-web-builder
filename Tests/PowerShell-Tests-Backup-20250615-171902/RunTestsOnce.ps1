# This script runs tests properly the first time with proper error handling and reporting
# Date: June 10, 2025
# Updated to exclude obsolete files (any file or directory with "zzz" in its name)

$ErrorActionPreference = "Stop"

function Run-Test {
    param(
        [string]$TestScriptPath
    )
    
    # Skip files with "zzz" in their name
    if ($TestScriptPath -match "zzz") {
        Write-Host "⚠️ Skipping obsolete test: $TestScriptPath" -ForegroundColor Yellow
        return $true
    }
    
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "Running test: $TestScriptPath" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    
    try {
        # Get the full path to the script
        $fullPath = Resolve-Path $TestScriptPath -ErrorAction Stop
        
        # Execute the test script with proper error handling
        & $fullPath
        
        # Check the result
        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
            Write-Host "✅ Test executed successfully!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Test failed with exit code: $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error running test: $_" -ForegroundColor Red
        return $false
    }
}

function Run-All-Consolidated-Tests {
    Write-Host "====================================================" -ForegroundColor Magenta
    Write-Host "Running All Consolidated Tests" -ForegroundColor Magenta
    Write-Host "====================================================" -ForegroundColor Magenta
    
    $consolidatedTests = @(
        ".\ConsolidatedColorBarTests.ps1",
        ".\ConsolidatedDynamicPagesTests.ps1",
        ".\ConsolidatedFooterTests.ps1",
        ".\ConsolidatedThemeTests.ps1"
    )
    
    $allPassed = $true
    
    foreach ($test in $consolidatedTests) {
        $success = Run-Test $test
        if (-not $success) {
            $allPassed = $false
        }
        
        # Add a separator between tests
        Write-Host ""
    }
    
    return $allPassed
}

function Get-Available-Tests {
    $testFiles = Get-ChildItem -Path . -Filter "*.ps1" | Where-Object { $_.Name -notmatch "zzz" }
    
    # Group tests
    $consolidatedTests = $testFiles | Where-Object { $_.Name -match "Consolidated" } | Sort-Object Name
    $otherTests = $testFiles | Where-Object { $_.Name -notmatch "Consolidated" -and $_.Name -notmatch "Runner" } | Sort-Object Name
    
    Write-Host "Available Tests:" -ForegroundColor Green
    
    Write-Host "`nConsolidated Tests:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $consolidatedTests.Count; $i++) {
        Write-Host "  $($i+1). $($consolidatedTests[$i].Name)" -ForegroundColor White
    }
    
    Write-Host "`nOther Tests:" -ForegroundColor Yellow
    for ($i = 0; $i -lt $otherTests.Count; $i++) {
        Write-Host "  $($i+$consolidatedTests.Count+1). $($otherTests[$i].Name)" -ForegroundColor White
    }
    
    # Special options
    Write-Host "`nSpecial Options:" -ForegroundColor Magenta
    Write-Host "  a. Run All Consolidated Tests" -ForegroundColor White
    Write-Host "  l. List Available Tests (this list)" -ForegroundColor White
    Write-Host "  q. Quit" -ForegroundColor White
}

# Record current directory
$currentDir = Get-Location

# Change to the Tests directory to ensure proper relative path resolution
Set-Location -Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests"

# Process command-line argument or show menu
$testToRun = $args[0]

if (-not $testToRun) {
    Get-Available-Tests
    Write-Host "`nEnter your choice (number, 'a' for all, 'l' to list, or 'q' to quit):" -ForegroundColor Green
    $choice = Read-Host
    
    if ($choice -eq "q") {
        Write-Host "Exiting test runner." -ForegroundColor Yellow
        Set-Location -Path $currentDir
        exit 0
    }
    elseif ($choice -eq "l") {
        Get-Available-Tests
        Set-Location -Path $currentDir
        exit 0
    }
    elseif ($choice -eq "a") {
        $success = Run-All-Consolidated-Tests
    }
    else {
        # Try to convert to number and run the test
        try {
            $choiceNum = [int]$choice
            $testFiles = Get-ChildItem -Path . -Filter "*.ps1" | Where-Object { $_.Name -notmatch "zzz" } | Sort-Object Name
            
            if ($choiceNum -gt 0 -and $choiceNum -le $testFiles.Count) {
                $testToRun = ".\" + $testFiles[$choiceNum-1].Name
                $success = Run-Test $testToRun
            }
            else {
                Write-Host "Invalid choice. Please enter a valid number." -ForegroundColor Red
                $success = $false
            }
        }
        catch {
            Write-Host "Invalid input. Please enter a valid number or option." -ForegroundColor Red
            $success = $false
        }
    }
}
else {
    # Direct command-line argument
    if ($testToRun -eq "all" -or $testToRun -eq "consolidated") {
        $success = Run-All-Consolidated-Tests
    }
    elseif ($testToRun -eq "list") {
        Get-Available-Tests
        Set-Location -Path $currentDir
        exit 0
    }
    else {
        $success = Run-Test $testToRun
    }
}

# Return to original directory
Set-Location -Path $currentDir

# Exit with appropriate code
if ($success) {
    exit 0
} else {
    exit 1
}
