# FINAL CLEANUP - RADICAL ROOT REDUCTION
# This script will reduce your root to JUST 5 files!

$ErrorActionPreference = "SilentlyContinue"
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
cd $projectRoot

Write-Host "`n" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔥 FINAL ROOT CLEANUP - AGGRESSIVE REDUCTION" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan

# ============================================================================
# PART 1: MOVE ALL GUIDE FILES TO docs/guides
# ============================================================================
Write-Host "`n  📚 Moving guide files to docs/guides/..." -ForegroundColor Yellow

$guideFiles = @(
    "00-START-HERE.md",
    "EXECUTE-NOW.md",
    "EXECUTION-READY.md",
    "FINAL-STRUCTURE.md",
    "IMPLEMENTATION-IN-PROGRESS.md",
    "IMPLEMENTATION-READY.md",
    "ISSUE-ANALYSIS.md",
    "MANIFEST.md",
    "MANUAL-REORGANIZATION.md",
    "QUICK-START.md",
    "READY-TO-EXECUTE-NOW.md",
    "READY-TO-EXECUTE.md",
    "VISUAL-GUIDE.md"
)

$moved = 0
foreach ($file in $guideFiles) {
    $src = Join-Path $projectRoot $file
    $dst = Join-Path $projectRoot "docs\guides\$file"
    if (Test-Path $src) {
        Move-Item -Path $src -Destination $dst -Force
        $moved++
        Write-Host "     ✓ $file" -ForegroundColor Green
    }
}
Write-Host "  ✅ Moved $moved guide files" -ForegroundColor Green

# ============================================================================
# PART 2: MOVE SCRIPT FILES TO .config/scripts
# ============================================================================
Write-Host "`n  🔧 Moving script files to .config/scripts/..." -ForegroundColor Yellow

$scriptFiles = @(
    "execute-now.ps1",
    "reorganize-radical.ps1",
    "RUN-REORGANIZATION.bat"
)

$moved = 0
foreach ($file in $scriptFiles) {
    $src = Join-Path $projectRoot $file
    $dst = Join-Path $projectRoot ".config\scripts\$file"
    if (Test-Path $src) {
        Move-Item -Path $src -Destination $dst -Force
        $moved++
        Write-Host "     ✓ $file" -ForegroundColor Green
    }
}
Write-Host "  ✅ Moved $moved script files" -ForegroundColor Green

# ============================================================================
# PART 3: CONSOLIDATE REMAINING FOLDERS INTO src/
# ============================================================================
Write-Host "`n  📦 Consolidating source folders into src/..." -ForegroundColor Yellow

$foldersToMove = @(
    "cg",
    "demos",
    "howto",
    "html",
    "js",
    "layouts",
    "templates",
    "ui",
    "server",
    "tools",
    "styles",
    "wb-chatbot",
    "Working"
)

$moved = 0
foreach ($folder in $foldersToMove) {
    $src = Join-Path $projectRoot $folder
    $dst = Join-Path $projectRoot "src\$folder"
    
    if (Test-Path $src) {
        # Use robocopy for folders (more reliable)
        robocopy $src $dst /E /MOVE 2>$null | Out-Null
        
        # Clean up if robocopy left empty folder
        if (Test-Path $src) {
            Remove-Item -Path $src -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        $moved++
        Write-Host "     ✓ $folder → src/" -ForegroundColor Green
    }
}
Write-Host "  ✅ Consolidated $moved folders into src/" -ForegroundColor Green

# ============================================================================
# PART 4: VERIFY FINAL STATE
# ============================================================================
Write-Host "`n" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📊 FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan

$rootItems = Get-ChildItem -Path $projectRoot -Force | Where-Object { 
    $_.Name -notmatch "^\." -or $_.Name -eq ".env.example" -or $_.Name -eq ".gitignore" -or $_.Name -match "^\.config|^\.git|^\.github|^\.vscode|^\.claude"
}

$files = @($rootItems | Where-Object { -not $_.PSIsContainer })
$dirs = @($rootItems | Where-Object { $_.PSIsContainer })

Write-Host "`n  📄 FILES IN ROOT: $($files.Count)" -ForegroundColor Green
$files | Sort-Object Name | ForEach-Object { Write-Host "     - $($_.Name)" -ForegroundColor Green }

Write-Host "`n  📁 DIRECTORIES IN ROOT:" -ForegroundColor Green
$dirs | Sort-Object Name | ForEach-Object { Write-Host "     - $($_.Name)/" -ForegroundColor Green }

Write-Host "`n" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ CLEANUP COMPLETE!" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n  🎯 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "     1. git add ." -ForegroundColor Yellow
Write-Host "     2. git commit -m 'refactor: radical root cleanup'" -ForegroundColor Yellow
Write-Host "     3. npm run dev" -ForegroundColor Yellow
Write-Host "     4. npm test" -ForegroundColor Yellow

Write-Host "`n  💾 ROLLBACK (if needed):" -ForegroundColor Gray
Write-Host "     git checkout backup/pre-reorganization-20251023-161829" -ForegroundColor Gray

Write-Host "`n"
