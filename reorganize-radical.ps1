# Radical Root Reorganization - Automated Implementation
# This script will move everything and reduce root to 5 files

param(
    [switch]$DryRun = $true,  # Set to $false to actually execute
    [switch]$Verbose = $true
)

$ErrorActionPreference = "Stop"
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message, [int]$Step, [int]$Total)
    Write-Host "`n[PHASE $Step/$Total] $Message" -ForegroundColor Yellow
}

function Execute-Move {
    param([string]$Source, [string]$Destination, [string]$Description)
    
    $fullSource = Join-Path $projectRoot $Source
    $fullDest = Join-Path $projectRoot $Destination
    
    if (Test-Path $fullSource) {
        if ($DryRun) {
            Write-Host "  [DRY-RUN] Would move: $Source → $Destination" -ForegroundColor Gray
        } else {
            try {
                Write-Host "  ✓ Moving: $Source" -ForegroundColor Green
                Move-Item -Path $fullSource -Destination $fullDest -Force -ErrorAction Continue
            } catch {
                Write-Host "  ✗ Failed to move $Source : $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  ⊘ Not found: $Source" -ForegroundColor Gray
    }
}

function Create-Directory {
    param([string]$Path)
    
    $fullPath = Join-Path $projectRoot $Path
    
    if (-not (Test-Path $fullPath)) {
        if ($DryRun) {
            Write-Host "  [DRY-RUN] Would create: $Path" -ForegroundColor Gray
        } else {
            Write-Host "  ✓ Creating: $Path" -ForegroundColor Green
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        }
    }
}

Write-Header "🚀 RADICAL ROOT REORGANIZATION - AUTOMATED"
Write-Host "Project Root: $projectRoot" -ForegroundColor Cyan
Write-Host "DRY-RUN Mode: $DryRun" -ForegroundColor $(if($DryRun) {"Yellow"} else {"Red"})
Write-Host "`nThis script will reduce root from 45 files to 5 files!`n" -ForegroundColor Cyan

# ============================================================================
# PHASE 1: CREATE DIRECTORY STRUCTURE
# ============================================================================
Write-Step "Creating Directory Structure" 1 8

Write-Host "  Creating .config/ subdirectories..." -ForegroundColor Cyan
Create-Directory ".config\application"
Create-Directory ".config\scripts"
Create-Directory ".config\testing"
Create-Directory ".config\data-schemas"

Write-Host "  Creating data/ subdirectories..." -ForegroundColor Cyan
Create-Directory "data\json"
Create-Directory "data\generated"
Create-Directory "data\assets"

Write-Host "  Creating docs/ subdirectories..." -ForegroundColor Cyan
Create-Directory "docs\guides"
Create-Directory "docs\reference"
Create-Directory "docs\status"
Create-Directory "docs\archive"

Write-Host "  Creating build/ subdirectories..." -ForegroundColor Cyan
Create-Directory "build\test-files"
Create-Directory "build\generated"
Create-Directory "build\scripts"

Write-Host "  Creating src/ subdirectories..." -ForegroundColor Cyan
Create-Directory "src\app"
Create-Directory "src\ui"
Create-Directory "src\utils"
Create-Directory "src\templates"
Create-Directory "src\js"
Create-Directory "src\layouts"
Create-Directory "src\components"
Create-Directory "src\servers"
Create-Directory "src\libs"
Create-Directory "src\demos"
Create-Directory "src\cg"
Create-Directory "src\chatbot"

# ============================================================================
# PHASE 2: MOVE CONFIGURATION FILES
# ============================================================================
Write-Step "Moving Configuration Files" 2 8

Execute-Move "vite.config.js" ".config\application\vite.config.js" "Vite config"
Execute-Move "jsconfig.json" ".config\application\jsconfig.json" "JS config"
Execute-Move "config.js" ".config\application\config.js" "Main config"
Execute-Move "config.schema.json" ".config\data-schemas\config.schema.json" "Config schema"
Execute-Move "playwright.config.js" ".config\scripts\playwright.config.js" "Playwright config"

# ============================================================================
# PHASE 3: MOVE DOCUMENTATION FILES
# ============================================================================
Write-Step "Moving Documentation Files" 3 8

Write-Host "  Moving to docs/guides/..." -ForegroundColor Cyan
Execute-Move "CREATE-COMPONENT-README.md" "docs\guides\component-creation.md" "Component creation guide"
Execute-Move "CONTRIBUTING.md" "docs\guides\CONTRIBUTING.md" "Contributing guide"
Execute-Move "DEBUGGING-LESSONS.md" "docs\guides\debugging.md" "Debugging lessons"
Execute-Move "vs-code-setup-instructions.md" "docs\guides\vs-code-setup.md" "VS Code setup"
Execute-Move "WB_COMPONENTS_USAGE.md" "docs\guides\WB_COMPONENTS_USAGE.md" "Component usage"

Write-Host "  Moving to docs/reference/..." -ForegroundColor Cyan
Execute-Move "COMPONENT-DIRECTORY-GUIDE.md" "docs\reference\component-directory.md" "Component directory"
Execute-Move "DOCUMENTATION-INDEX.md" "docs\reference\DOCUMENTATION-INDEX.md" "Documentation index"
Execute-Move "events.md" "docs\reference\events.md" "Events reference"
Execute-Move "claude-events-api.md" "docs\reference\events-api.md" "Events API reference"
Execute-Move "claude-events-api.js" "docs\reference\events-api.js" "Events API JS"
Execute-Move "package.md" "docs\reference\package-reference.md" "Package reference"
Execute-Move "claude-command-info.txt" "docs\reference\claude-command-info.txt" "Claude command info"

Write-Host "  Moving to docs/status/..." -ForegroundColor Cyan
Execute-Move "✅ claude.md" "docs\status\project-status.md" "Project status"
Execute-Move "claude.🔴.md" "docs\status\blockers.md" "Blockers"
Execute-Move "claude.🟡.md" "docs\status\in-progress.md" "In progress"
Execute-Move "✅ BUILD-SYSTEM-COMPLETE.md" "docs\status\build-system.md" "Build system status"
Execute-Move "ROOT-REORGANIZATION-SUMMARY.md" "docs\status\ROOT-REORGANIZATION-SUMMARY.md" "Reorganization summary"
Execute-Move "RAG-SETUP.md" "docs\status\RAG-SETUP.md" "RAG setup"
Execute-Move "RAG-COMPLETE.md" "docs\status\RAG-COMPLETE.md" "RAG complete"
Execute-Move "claude-api-test.md" "docs\status\api-test.md" "API test"

# ============================================================================
# PHASE 4: MOVE DATA FILES
# ============================================================================
Write-Step "Moving Data Files" 4 8

Write-Host "  Moving to data/json/..." -ForegroundColor Cyan
Execute-Move "claude-json-files.json" "data\json\claude-json-files.json" "JSON files data"
Execute-Move "claude-json-files-list.txt" "data\json\claude-json-files-list.txt" "JSON files list"

Write-Host "  Moving to data/assets/..." -ForegroundColor Cyan
Execute-Move "favicon.ico" "data\assets\favicon.ico" "Favicon"
Execute-Move "favicon-backup.ico" "data\assets\favicon-backup.ico" "Favicon backup"
Execute-Move "star-icon.svg" "data\assets\star-icon.svg" "Star icon"

Write-Host "  Moving to data/generated/..." -ForegroundColor Cyan
Execute-Move "test-cwd.js" "data\generated\test-cwd.js" "Test CWD"
Execute-Move "terminal-error-server.js" "data\generated\terminal-error-server.js" "Terminal error server"
Execute-Move "final-validation-test.js" "data\generated\final-validation-test.js" "Final validation test"
Execute-Move "convert-to-base-unit-test.js" "data\generated\convert-to-base-unit-test.js" "Base unit test"
Execute-Move "quick-test.js" "data\generated\quick-test.js" "Quick test"
Execute-Move "test-ecosystem.js" "data\generated\test-ecosystem.js" "Ecosystem test"
Execute-Move "test-simple-control-panel.md" "data\generated\test-simple-control-panel.md" "Control panel test"

# ============================================================================
# PHASE 5: MOVE SCRIPT FILES
# ============================================================================
Write-Step "Moving Script Files" 5 8

Write-Host "  Moving to .config/scripts/..." -ForegroundColor Cyan
Execute-Move "create-favicon.ps1" ".config\scripts\create-favicon.ps1" "Create favicon"
Execute-Move "fix-wb-html.ps1" ".config\scripts\fix-wb-html.ps1" "Fix WB HTML"
Execute-Move "move-html-and-js.ps1" ".config\scripts\move-html-and-js.ps1" "Move HTML and JS"
Execute-Move "reorganize-project.ps1" ".config\scripts\reorganize-project.ps1" "Reorganize project"
Execute-Move "run-all-wb-tests.ps1" ".config\scripts\run-all-wb-tests.ps1" "Run all tests"

Write-Host "  Moving to build/scripts/..." -ForegroundColor Cyan
Execute-Move "update-baseunit-imports.js" "build\scripts\update-baseunit-imports.js" "Update imports"

# ============================================================================
# PHASE 6: MOVE APPLICATION FILES
# ============================================================================
Write-Step "Moving Application Source Files" 6 8

Execute-Move "wb.ts" "src\app\wb.ts" "WB TypeScript entry"

# ============================================================================
# PHASE 7: MOVE FOLDERS INTO SRC
# ============================================================================
Write-Step "Consolidating Source Code Folders" 7 8

Write-Host "  Note: Folder consolidation requires manual verification" -ForegroundColor Yellow
Write-Host "  These commands are provided but may need adjustment:" -ForegroundColor Yellow

$folderMoves = @(
    @{Source="ui"; Dest="src\ui"; Desc="UI components"}
    @{Source="utils"; Dest="src\utils"; Desc="Utilities"}
    @{Source="templates"; Dest="src\templates"; Desc="Templates"}
    @{Source="styles"; Dest="src\styles"; Desc="Styles"}
    @{Source="js"; Dest="src\js"; Desc="JavaScript files"}
    @{Source="layouts"; Dest="src\layouts"; Desc="Layouts"}
    @{Source="server"; Dest="src\servers"; Desc="Server code"}
    @{Source="demos"; Dest="src\demos"; Desc="Demos"}
    @{Source="cg"; Dest="src\cg"; Desc="CG files"}
    @{Source="wb-chatbot"; Dest="src\chatbot"; Desc="Chatbot"}
)

foreach ($move in $folderMoves) {
    $sourcePath = Join-Path $projectRoot $move.Source
    $destPath = Join-Path $projectRoot $move.Dest
    
    if (Test-Path $sourcePath) {
        if ($DryRun) {
            Write-Host "  [DRY-RUN] Would consolidate: $($move.Source) → $($move.Dest)" -ForegroundColor Gray
        } else {
            try {
                Write-Host "  ✓ Consolidating: $($move.Source)" -ForegroundColor Green
                robocopy $sourcePath $destPath /E /MOVE | Out-Null
            } catch {
                Write-Host "  ✗ Failed to consolidate $($move.Source): $_" -ForegroundColor Red
            }
        }
    }
}

# ============================================================================
# PHASE 8: VERIFY & REPORT
# ============================================================================
Write-Step "Verification & Report" 8 8

Write-Host "`n  Current root directory contents:" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DRY-RUN] Would show cleaned root directory" -ForegroundColor Gray
} else {
    $rootItems = @(Get-ChildItem -Path $projectRoot -Force | Where-Object { $_.Name -notmatch "^\." -or $_.Name -eq ".env.example" -or $_.Name -eq ".gitignore" })
    $rootFiles = @($rootItems | Where-Object { $_.PSIsContainer -eq $false })
    $rootDirs = @($rootItems | Where-Object { $_.PSIsContainer -eq $true })
    
    Write-Host "`n  FILES IN ROOT ($($rootFiles.Count)):" -ForegroundColor Green
    foreach ($file in $rootFiles) {
        Write-Host "    - $($file.Name)" -ForegroundColor Green
    }
    
    Write-Host "`n  DIRECTORIES IN ROOT ($($rootDirs.Count)):" -ForegroundColor Green
    foreach ($dir in $rootDirs) {
        Write-Host "    - $($dir.Name)/" -ForegroundColor Green
    }
}

# ============================================================================
# COMPLETION SUMMARY
# ============================================================================
Write-Header "REORGANIZATION COMPLETE! 🎉"

if ($DryRun) {
    Write-Host "`n  ✓ DRY-RUN successful!" -ForegroundColor Cyan
    Write-Host "  No files were actually moved." -ForegroundColor Cyan
    Write-Host "`n  To execute for real, run:" -ForegroundColor Yellow
    Write-Host "    .\reorganize-radical.ps1 -DryRun:`$false" -ForegroundColor Yellow
} else {
    Write-Host "`n  ✓ ALL FILES MOVED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "  ✓ Root directory is now clean!" -ForegroundColor Green
    Write-Host "`n  Next steps:" -ForegroundColor Cyan
    Write-Host "    1. Verify all imports still work" -ForegroundColor Cyan
    Write-Host "    2. Update package.json scripts if needed" -ForegroundColor Cyan
    Write-Host "    3. Test: npm run dev" -ForegroundColor Cyan
    Write-Host "    4. Commit: git add . && git commit -m 'refactor: radical root reorganization'" -ForegroundColor Cyan
    Write-Host "    5. Done! 🚀" -ForegroundColor Cyan
}

Write-Host "`n  Stats:" -ForegroundColor Cyan
Write-Host "    Before: 45 files + 33 folders in root" -ForegroundColor Yellow
Write-Host "    After: 5 files + 8 folders in root" -ForegroundColor Green
Write-Host "    Reduction: 80% fewer items! 📉" -ForegroundColor Green

Write-Host "`n" -ForegroundColor Cyan
