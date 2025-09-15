# Cleanup unused image finder files
# Run this in PowerShell to remove redundant files

Write-Host "🗑️ Cleaning up unused image finder files..." -ForegroundColor Yellow

$filesToRemove = @(
    ".\images\tools\imageFinder-server.html",
    ".\images\tools\imageFinder-working.html", 
    ".\images\tools\imageFinder.html"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✅ Removed: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "" 
Write-Host "📁 Remaining working files:" -ForegroundColor Cyan
Write-Host "  ✅ imageFinder-fixed.html (Main Canvas solution)" -ForegroundColor Green
Write-Host "  ✅ local-image-generator.html (Canvas generator)" -ForegroundColor Green  
Write-Host "  ✅ imageFinder-async.html (Original async version)" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Use imageFinder-fixed.html for the best experience!" -ForegroundColor Cyan