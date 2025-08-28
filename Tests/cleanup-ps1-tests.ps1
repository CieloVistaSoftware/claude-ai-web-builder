# PowerShell Test Cleanup Script
# Date: June 15, 2025
# Purpose: Remove all PowerShell test files after successful migration to Playwright

Write-Host "🗑️ PowerShell Test Cleanup Script" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow

$ErrorActionPreference = "Continue"  # Continue on errors to clean up as much as possible

# Get list of all PowerShell test files
$ps1TestFiles = Get-ChildItem -Path "." -Filter "*.ps1" | Where-Object { 
    $_.Name -ne "migrate-to-playwright.ps1" -and 
    $_.Name -ne "cleanup-ps1-tests.ps1" -and
    $_.Name -ne "setup-tests.ps1"
}

Write-Host "`n📋 PowerShell test files to be removed:" -ForegroundColor Cyan
foreach ($file in $ps1TestFiles) {
    Write-Host "   - $($file.Name)" -ForegroundColor Gray
}

Write-Host "`nTotal files to remove: $($ps1TestFiles.Count)" -ForegroundColor Yellow

# Confirmation prompt
$confirmation = Read-Host "`n⚠️ Are you sure you want to delete all these PowerShell test files? (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y' -or $confirmation -eq 'yes') {
    Write-Host "`n🗑️ Removing PowerShell test files..." -ForegroundColor Yellow
    
    $removedCount = 0
    $failedCount = 0
    
    foreach ($file in $ps1TestFiles) {
        try {
            Remove-Item $file.FullName -Force
            Write-Host "   ✅ Removed: $($file.Name)" -ForegroundColor Green
            $removedCount++
        } catch {
            Write-Host "   ❌ Failed to remove: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
            $failedCount++
        }
    }
    
    # Clean up any remaining test-related files
    Write-Host "`n🧹 Cleaning up additional test artifacts..." -ForegroundColor Yellow
    
    $additionalCleanup = @(
        "test-results",
        "playwright-report", 
        "*.log",
        "*.tmp"
    )
    
    foreach ($pattern in $additionalCleanup) {
        $items = Get-ChildItem -Path "." -Filter $pattern -ErrorAction SilentlyContinue
        foreach ($item in $items) {
            try {
                if ($item.PSIsContainer) {
                    Remove-Item $item.FullName -Recurse -Force
                    Write-Host "   🗂️ Removed directory: $($item.Name)" -ForegroundColor Gray
                } else {
                    Remove-Item $item.FullName -Force
                    Write-Host "   📄 Removed file: $($item.Name)" -ForegroundColor Gray
                }
            } catch {
                Write-Host "   ⚠️ Could not remove: $($item.Name)" -ForegroundColor Yellow
            }
        }
    }
    
    # Summary
    Write-Host "`n📊 Cleanup Summary:" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host "✅ Successfully removed: $removedCount files" -ForegroundColor Green
    if ($failedCount -gt 0) {
        Write-Host "❌ Failed to remove: $failedCount files" -ForegroundColor Red
    }
    
    Write-Host "`n🎉 PowerShell test cleanup completed!" -ForegroundColor Green
    Write-Host "Your project now uses modern Playwright testing exclusively." -ForegroundColor Cyan
    
    # Show remaining structure
    Write-Host "`n📁 Current test structure:" -ForegroundColor Cyan
    Write-Host "├── playwright/" -ForegroundColor White
    $playwrightTests = Get-ChildItem -Path "playwright" -Filter "*.spec.ts" -ErrorAction SilentlyContinue
    foreach ($test in $playwrightTests | Select-Object -First 5) {
        Write-Host "│   ├── $($test.Name)" -ForegroundColor Gray
    }
    if ($playwrightTests.Count -gt 5) {
        Write-Host "│   └── ... and $($playwrightTests.Count - 5) more test files" -ForegroundColor Gray
    }
    Write-Host "├── package.json" -ForegroundColor White
    Write-Host "├── playwright.config.ts" -ForegroundColor White
    Write-Host "└── tsconfig.json" -ForegroundColor White
    
    Write-Host "`n🚀 Ready to run: npm test" -ForegroundColor Green
    
} else {
    Write-Host "`n❌ Cleanup cancelled by user." -ForegroundColor Yellow
    Write-Host "PowerShell test files remain in place." -ForegroundColor Gray
}

Write-Host "`n✅ Cleanup script completed." -ForegroundColor Green
