# WB Component System - Comprehensive Test Launcher (PowerShell)
# Run comprehensive tests on the WB component ecosystem

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " WB Component System - Comprehensive Test Launcher" -ForegroundColor Cyan  
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Running Node.js Validation..." -ForegroundColor Yellow
node final-validation-test.js

Write-Host ""
Write-Host "🌐 Opening Browser Tests..." -ForegroundColor Green
Write-Host ""

Write-Host "   - Fixed Integration Test" -ForegroundColor White
Start-Process "components-fixed-test.html"
Start-Sleep -Seconds 2

Write-Host "   - Component Diagnosis Tool" -ForegroundColor White  
Start-Process "component-diagnosis.html"
Start-Sleep -Seconds 2

Write-Host "   - Final Ecosystem Test" -ForegroundColor White
Start-Process "final-ecosystem-test.html"

Write-Host ""
Write-Host "✅ All tests launched successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📋 CHECK THESE IN YOUR BROWSER:" -ForegroundColor Cyan
Write-Host "   1. components-fixed-test.html - Sequential loading test" -ForegroundColor White
Write-Host "   2. component-diagnosis.html - Error diagnosis" -ForegroundColor White  
Write-Host "   3. final-ecosystem-test.html - Full ecosystem test" -ForegroundColor White
Write-Host ""

Write-Host "🔧 DEBUGGING COMMANDS:" -ForegroundColor Cyan
Write-Host "   - node final-validation-test.js (File validation)" -ForegroundColor White
Write-Host "   - F12 Developer Tools (Browser console)" -ForegroundColor White
Write-Host "   - window.debugComponents() (Browser debug function)" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")