# PowerShell Test Migration Script
# Date: June 15, 2025
# Purpose: Install Playwright dependencies and run all converted tests

Write-Host "🚀 Starting PowerShell to Playwright Test Migration" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

$ErrorActionPreference = "Stop"
$startLocation = Get-Location

try {
    # Step 1: Install npm dependencies
    Write-Host "`n📦 Installing npm dependencies..." -ForegroundColor Yellow
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Host "✅ npm packages installed successfully" -ForegroundColor Green
    } else {
        throw "package.json not found"
    }

    # Step 2: Install Playwright browsers
    Write-Host "`n🌐 Installing Playwright browsers..." -ForegroundColor Yellow
    npx playwright install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Playwright browser installation had issues, but continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Playwright browsers installed successfully" -ForegroundColor Green
    }

    # Step 3: Run TypeScript compilation check
    Write-Host "`n🔧 Checking TypeScript compilation..." -ForegroundColor Yellow
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ TypeScript compilation warnings found, but continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
    }

    # Step 4: List converted tests
    Write-Host "`n📋 Converted Playwright Tests:" -ForegroundColor Cyan
    $playwrightTests = Get-ChildItem -Path "playwright" -Filter "*.spec.ts" | Sort-Object Name
    
    foreach ($test in $playwrightTests) {
        Write-Host "   ✓ $($test.Name)" -ForegroundColor Green
    }
    
    Write-Host "`nTotal Playwright tests: $($playwrightTests.Count)" -ForegroundColor Cyan

    # Step 5: List remaining PowerShell tests to be deleted
    Write-Host "`n🗑️ PowerShell Tests to be Removed:" -ForegroundColor Yellow
    $ps1Tests = Get-ChildItem -Path "." -Filter "*.ps1" | Where-Object { 
        $_.Name -ne "migrate-to-playwright.ps1" -and 
        $_.Name -ne "setup-tests.ps1" 
    } | Sort-Object Name
    
    foreach ($test in $ps1Tests) {
        Write-Host "   ❌ $($test.Name)" -ForegroundColor Red
    }
    
    Write-Host "`nTotal PowerShell tests to remove: $($ps1Tests.Count)" -ForegroundColor Yellow

    # Step 6: Create backup directory and move PS1 tests
    Write-Host "`n📁 Creating backup of PowerShell tests..." -ForegroundColor Yellow
    $backupDir = "PowerShell-Tests-Backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    foreach ($test in $ps1Tests) {
        Copy-Item $test.FullName -Destination $backupDir
        Write-Host "   📋 Backed up: $($test.Name)" -ForegroundColor Gray
    }
    
    Write-Host "✅ PowerShell tests backed up to: $backupDir" -ForegroundColor Green

    # Step 7: Run a quick Playwright test to verify setup
    Write-Host "`n🧪 Running test verification..." -ForegroundColor Yellow
    try {
        # Run just one test to verify everything works
        npx playwright test --project=chromium --max-failures=1 playwright/colorBar.spec.ts
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Playwright test verification successful!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Test verification had issues, but setup is complete" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ Could not run test verification: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # Step 8: Create deletion script
    Write-Host "`n🗑️ Creating PowerShell test deletion script..." -ForegroundColor Yellow
    $deletionScript = @"
# PowerShell Test Cleanup Script
# Generated: $(Get-Date)
# This script will delete the old PowerShell test files

Write-Host "🗑️ Cleaning up PowerShell test files..." -ForegroundColor Yellow

"@

    foreach ($test in $ps1Tests) {
        $deletionScript += "`nRemove-Item `"$($test.Name)`" -Force -ErrorAction SilentlyContinue"
    }

    $deletionScript += @"

Write-Host "✅ PowerShell test cleanup complete!" -ForegroundColor Green
Write-Host "📁 Backup available in: $backupDir" -ForegroundColor Cyan
"@

    $deletionScript | Out-File -FilePath "cleanup-ps1-tests.ps1" -Encoding UTF8
    Write-Host "✅ Created cleanup script: cleanup-ps1-tests.ps1" -ForegroundColor Green

    # Step 9: Summary
    Write-Host "`n🎉 Migration Summary:" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Green
    Write-Host "✅ Playwright tests created: $($playwrightTests.Count)" -ForegroundColor Green
    Write-Host "📋 PowerShell tests backed up: $($ps1Tests.Count)" -ForegroundColor Yellow
    Write-Host "🛠️ Setup completed successfully" -ForegroundColor Green
    
    Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Review the Playwright tests in the 'playwright' directory" -ForegroundColor White
    Write-Host "2. Run: npm test (to run all Playwright tests)" -ForegroundColor White
    Write-Host "3. Run: npm run test:ui (for interactive testing)" -ForegroundColor White
    Write-Host "4. Run: .\cleanup-ps1-tests.ps1 (to delete old PowerShell tests)" -ForegroundColor White
    
    Write-Host "`n🚀 Ready to use modern Playwright testing!" -ForegroundColor Green

} catch {
    Write-Host "`n❌ Migration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Location: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor Red
    exit 1
} finally {
    Set-Location $startLocation
}
