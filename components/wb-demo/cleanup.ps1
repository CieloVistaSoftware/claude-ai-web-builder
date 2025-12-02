# WB Demo Cleanup Script - Remove old Shadow DOM files
# Run this script to clean up the wb-demo folder

$folderPath = $PSScriptRoot
$filesToDelete = @(
    "wb-demo.backup.js",
    "wb-demo.schema.json",
    "✅ claude.md",
    "eventlog.png"
)

# Keep marked.min.js and demo files in card-showcase folder

Write-Host "🗑️  WB Demo Cleanup Script" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Folder: $folderPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files to delete:" -ForegroundColor Red

$deletedCount = 0

foreach ($file in $filesToDelete) {
    $filePath = Join-Path $folderPath $file
    if (Test-Path $filePath) {
        Write-Host "  ❌ $file"
        Remove-Item $filePath -Force
        $deletedCount++
    }
}

Write-Host ""
Write-Host "✅ Deleted $deletedCount files" -ForegroundColor Green
Write-Host ""
Write-Host "Remaining files:" -ForegroundColor Cyan
Get-ChildItem $folderPath -File | ForEach-Object { Write-Host "  ✓ $($_.Name)" }
