# WB Folder Cleanup Script
# Deletes duplicate folders, backup archives, and test artifacts

$rootPath = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "=== WB Folder Cleanup ===" -ForegroundColor Cyan
Write-Host ""

# Folders to delete (keeping wb-component-navigator)
$foldersToDelete = @(
    "WB2",
    "new",
    "saturday",
    "components-staging",
    "wb-fix-paths",
    "material-design.colorpicker",
    "playwright-report",
    "test-results"
)

# Files to delete (keeping wb-component-navigator/)
$filesToDelete = @(
    "saturday-backup.zip",
    "MIGRATION-SCAN-REPORT.md",
    "WB2-MIGRATION-GUIDE.md",
    "install-output.txt",
    "npm-test-results.json",
    "component-loader-test.html",
    "quick-test-improved.sh",
    "currentstatus.md",
    "OK-✅ claude.md",
    "package.json.md"
)

# Delete folders
Write-Host "Deleting folders..." -ForegroundColor Yellow
foreach ($folder in $foldersToDelete) {
    $fullPath = Join-Path $rootPath $folder
    if (Test-Path $fullPath) {
        Write-Host "  Removing: $folder" -ForegroundColor Gray
        Remove-Item -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue
        if (-not (Test-Path $fullPath)) {
            Write-Host "    ✓ Deleted" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Failed to delete" -ForegroundColor Red
        }
    } else {
        Write-Host "  Skipped: $folder (not found)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Deleting files..." -ForegroundColor Yellow
foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $rootPath $file
    if (Test-Path $fullPath) {
        Write-Host "  Removing: $file" -ForegroundColor Gray
        Remove-Item -Path $fullPath -Force -ErrorAction SilentlyContinue
        if (-not (Test-Path $fullPath)) {
            Write-Host "    ✓ Deleted" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Failed to delete" -ForegroundColor Red
        }
    } else {
        Write-Host "  Skipped: $file (not found)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Migrated components:"
Write-Host "  ✓ wb-linkedinAd -> components/wb-linkedinAd" -ForegroundColor Green
Write-Host ""
Write-Host "Preserved:"
Write-Host "  - All core components in components/" -ForegroundColor Gray
Write-Host "  - All build scripts and configs" -ForegroundColor Gray
Write-Host "  - Documentation in docs/" -ForegroundColor Gray
Write-Host "  - wb-component-navigator (kept as requested)" -ForegroundColor Gray
Write-Host ""
