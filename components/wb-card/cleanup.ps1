# WB Card Cleanup Script - Remove junk documentation files
# Run this script to clean up the wb-card folder

$folderPath = $PSScriptRoot
$filesToDelete = @(
    "CHANGELOG.md",
    "DEMO-REBUILD.md",
    "ENHANCEMENTS-COMPLETE.md",
    "ENHANCEMENTS.md",
    "FILE-STRUCTURE.md",
    "HOW-PLACEHOLDERS-WORK.md",
    "INLINE-STYLES-FIX-COMPLETE.md",
    "issues.md",
    "QUICK-START.md",
    "README-DEMO.md",
    "STYLING-FIX-SUMMARY.md",
    "SUMMARY.md",
    "TEMPLATE-QUICK-START.md",
    "TEMPLATE-SYSTEM-MIGRATION.md",
    "THEME-UPDATE-GUIDE.md",
    "VERIFICATION-CHECKLIST.md",
    "wb-card.json",
    "wb-card.schema.json",
    "✅ claude.md"
)

Write-Host "🗑️  WB Card Cleanup Script" -ForegroundColor Yellow
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
