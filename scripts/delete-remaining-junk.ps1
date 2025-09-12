# Delete remaining junk files - PowerShell version

Write-Host "Deleting remaining junk files..." -ForegroundColor Yellow

$filesToDelete = @(
    "wb-new.js",
    "wb.bak.html",
    "wb.bak.js"
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
Write-Host "`nRemaining clean files:" -ForegroundColor Cyan
if (Test-Path "wb-import-simple.js") { Write-Host "- wb-import-simple.js" -ForegroundColor Green }
if (Test-Path "wb.html") { Write-Host "- wb.html" -ForegroundColor Green }
if (Test-Path "wb.css") { Write-Host "- wb.css" -ForegroundColor Green }
if (Test-Path "wb.js") { Write-Host "- wb.js" -ForegroundColor Green }

Write-Host "`nReady to test wb.html!" -ForegroundColor Yellow
Read-Host "`nPress Enter to continue"