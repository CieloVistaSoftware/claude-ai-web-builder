# ============================================================================
# WB Framework - Clean Root Folder Script
# Moves all loose files from root to proper organized folders
# ============================================================================

$componentsRoot = "C:\Users\jwpmi\Downloads\AI\wb\components"

Write-Host "🧹 Cleaning WB Framework Root Folder..." -ForegroundColor Cyan
Write-Host ""

# Create folder structure if needed
$docsFolderPath = Join-Path $componentsRoot "docs"
$scriptsFolderPath = Join-Path $componentsRoot "scripts"
$archiveFolderPath = Join-Path $componentsRoot "archive"

if (!(Test-Path $docsFolderPath)) { New-Item -ItemType Directory -Path $docsFolderPath -Force | Out-Null }
if (!(Test-Path $scriptsFolderPath)) { New-Item -ItemType Directory -Path $scriptsFolderPath -Force | Out-Null }
if (!(Test-Path $archiveFolderPath)) { New-Item -ItemType Directory -Path $archiveFolderPath -Force | Out-Null }

Write-Host "✅ Folders created/verified:" -ForegroundColor Green
Write-Host "   - docs/"
Write-Host "   - scripts/"
Write-Host "   - archive/"
Write-Host ""

# ============================================================================
# DOCUMENTATION FILES → docs/
# ============================================================================

$docFiles = @(
    "00-DOCUMENTATION-INDEX.md",
    "BATCH-MIGRATION-COMPLETE-STATUS.md",
    "BATCH-MIGRATION-EXECUTION-GUIDE.md",
    "CHANGELOG.md",
    "COMPONENT-MIGRATION-GUIDE.md",
    "CRITICAL-LIGHT-DOM-SETUP-REQUIREMENTS.md",
    "CSS-FIRST-ARCHITECTURE-PLAN.md",
    "CURRENT-STATUS-PHASE-2-5.md",
    "FINAL-GO-BATCH-MIGRATION.md",
    "html-files-list.txt",
    "MASTER-PROJECT-SUMMARY.md",
    "PHASE-1-COMPLETE.md",
    "PHASE-2-COMPLETE.md",
    "PROJECT-DELIVERY-SUMMARY.md",
    "QUICK-MIGRATION-REFERENCE.md",
    "WB-BUTTON-FIX-APPLIED.md"
)

Write-Host "📚 Moving documentation files to docs/..." -ForegroundColor Yellow
$docMoveCount = 0

foreach ($file in $docFiles) {
    $sourcePath = Join-Path $componentsRoot $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $docsFolderPath $file
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "   ✓ $file"
        $docMoveCount++
    }
}

Write-Host "✅ Moved $docMoveCount documentation files to docs/" -ForegroundColor Green
Write-Host ""

# ============================================================================
# SCRIPT FILES → scripts/
# ============================================================================

$scriptFiles = @(
    "batch-migrate.cjs",
    "link-ref-checker.cjs",
    "update-demo-pages.js",
    "custom-elements-manifest.config.mjs"
)

Write-Host "🔧 Moving script files to scripts/..." -ForegroundColor Yellow
$scriptMoveCount = 0

foreach ($file in $scriptFiles) {
    $sourcePath = Join-Path $componentsRoot $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $scriptsFolderPath $file
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "   ✓ $file"
        $scriptMoveCount++
    }
}

Write-Host "✅ Moved $scriptMoveCount script files to scripts/" -ForegroundColor Green
Write-Host ""

# ============================================================================
# BACKUP FILES → archive/
# ============================================================================

$backupFiles = @(
    "playwright.config.cjs.BACKUP"
)

Write-Host "📦 Moving backup files to archive/..." -ForegroundColor Yellow
$backupMoveCount = 0

foreach ($file in $backupFiles) {
    $sourcePath = Join-Path $componentsRoot $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $archiveFolderPath $file
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "   ✓ $file"
        $backupMoveCount++
    }
}

Write-Host "✅ Moved $backupMoveCount backup files to archive/" -ForegroundColor Green
Write-Host ""

# ============================================================================
# FINAL VERIFICATION
# ============================================================================

Write-Host "📋 Final Root Folder Contents:" -ForegroundColor Cyan
$rootFiles = Get-ChildItem -Path $componentsRoot -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name | Sort-Object

if ($rootFiles.Count -eq 0) {
    Write-Host "   ❌ ERROR: No files found!" -ForegroundColor Red
} else {
    foreach ($file in $rootFiles) {
        Write-Host "   - $file"
    }
}

Write-Host ""
Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "   Documentation files moved: $docMoveCount"
Write-Host "   Script files moved: $scriptMoveCount"
Write-Host "   Backup files moved: $backupMoveCount"
Write-Host "   Total files moved: $($docMoveCount + $scriptMoveCount + $backupMoveCount)"
Write-Host ""
Write-Host "🎉 CLEANUP COMPLETE!" -ForegroundColor Green
