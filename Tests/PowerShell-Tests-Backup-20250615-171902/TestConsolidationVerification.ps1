# Test Consolidation Verification
# Date: June 10, 2025
# This script verifies that the test consolidation was successful

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "=== Test Consolidation Verification ===" -ForegroundColor Cyan

# Check that all consolidated files exist
$consolidatedFiles = @(
    "ConsolidatedColorBarTests.ps1",
    "ConsolidatedDynamicPagesTests.ps1",
    "ConsolidatedFooterTests.ps1",
    "ConsolidatedThemeTests.ps1",
    "MasterTestRunner.ps1"
)

$allExist = $true

foreach ($file in $consolidatedFiles) {
    $filePath = Join-Path -Path $scriptPath -ChildPath $file
    $exists = Test-Path $filePath
    
    if ($exists) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file does not exist" -ForegroundColor Red
        $allExist = $false
    }
}

# Check that each file contains appropriate content
if ($allExist) {
    Write-Host "`nVerifying file contents..." -ForegroundColor Yellow
    
    $checks = @{
        "ConsolidatedColorBarTests.ps1" = @("ColorBar", "updateColorBar", "color-bar-slider")
        "ConsolidatedDynamicPagesTests.ps1" = @("DynamicPages", "createNewPage", "showPage")
        "ConsolidatedFooterTests.ps1" = @("Footer", "footer-position", "footer-visibility")
        "ConsolidatedThemeTests.ps1" = @("Theme", "theme-select", "setupThemeControl")
        "MasterTestRunner.ps1" = @("ConsolidatedColorBarTests", "ConsolidatedDynamicPagesTests", "ConsolidatedFooterTests", "ConsolidatedThemeTests")
    }
    
    $contentValid = $true
    
    foreach ($file in $consolidatedFiles) {
        $filePath = Join-Path -Path $scriptPath -ChildPath $file
        $content = Get-Content -Path $filePath -Raw
        $termsToCheck = $checks[$file]
        $allTermsFound = $true
        
        foreach ($term in $termsToCheck) {
            if ($content -match [regex]::Escape($term)) {
                # Term found
            } else {
                Write-Host "❌ Term '$term' not found in $file" -ForegroundColor Red
                $allTermsFound = $false
                $contentValid = $false
            }
        }
        
        if ($allTermsFound) {
            Write-Host "✅ $file content verification passed" -ForegroundColor Green
        } else {
            Write-Host "❌ $file content verification failed" -ForegroundColor Red
        }
    }
    
    if ($contentValid) {
        Write-Host "`n✅ All file content verifications passed" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Some file content verifications failed" -ForegroundColor Red
    }
    
    # Try running the master test runner
    Write-Host "`nAttempting to run MasterTestRunner.ps1..." -ForegroundColor Yellow
    try {
        & "$scriptPath\MasterTestRunner.ps1" -ErrorAction Stop
        Write-Host "`n✅ MasterTestRunner.ps1 executed without errors" -ForegroundColor Green
    } catch {
        Write-Host "`n❌ MasterTestRunner.ps1 execution failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Some consolidated files are missing. Please create them first." -ForegroundColor Red
}

Write-Host "`nTest consolidation verification complete." -ForegroundColor Cyan
