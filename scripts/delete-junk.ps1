# Delete import junk files - PowerShell version

Write-Host "Deleting import junk files..." -ForegroundColor Yellow

$filesToDelete = @(
    "wb-control-panel-import.js",
    "wb-error-handler-fixed.js", 
    "wb-error-handler.js",
    "wb-import-auto.js",
    "wb-import-clean.js",
    "wb-import-final.js",
    "wb-import-fixed.js",
    "wb-import-new.js",
    "wb-import.css",
    "wb-import.js"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Red
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "`nRemaining files:" -ForegroundColor Cyan
if (Test-Path "wb-import-simple.js") { Write-Host "- wb-import-simple.js (KEEP)" -ForegroundColor Green }
if (Test-Path "wb.html") { Write-Host "- wb.html (KEEP)" -ForegroundColor Green }

Read-Host "`nPress Enter to continue"