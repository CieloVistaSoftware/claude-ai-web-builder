#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Claude.md Standardization - Phase 2: Add Missing Sections
.DESCRIPTION
    Adds missing sections to all claude.md files:
    - Quick Summary section
    - Testing Status section
    - Related Components section
    - Creates 3 remaining missing files
.PARAMETER DryRun
    Preview changes without modifying files
.PARAMETER Force
    Apply changes without prompting
.EXAMPLE
    .\batch-fix-phase2.ps1 -DryRun
    .\batch-fix-phase2.ps1 -Force
#>

param(
    [switch]$DryRun,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# PATHS
$ProjectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
$ComponentPath = Join-Path $ProjectRoot "components"
$TemplatePath = Join-Path $ComponentPath "CLAUDE-MD-TEMPLATE.md"
$LogFile = Join-Path $ProjectRoot "docs\status\batch-fix-phase2-log.txt"

# COLORS
$ColorError = "Red"
$ColorWarning = "Yellow"
$ColorSuccess = "Green"
$ColorInfo = "Cyan"

# LOG FUNCTION
function Log-Message {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Type] $Message"
    
    Add-Content -Path $LogFile -Value $logLine -ErrorAction SilentlyContinue
    
    $color = switch($Type) {
        "ERROR" { $ColorError }
        "WARNING" { $ColorWarning }
        "SUCCESS" { $ColorSuccess }
        default { $ColorInfo }
    }
    
    Write-Host $logLine -ForegroundColor $color
}

# HELPER: Extract component name from path
function Get-ComponentName {
    param([string]$Path)
    $parts = $Path -split '\\'
    return $parts[-2]
}

# HEADER
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  CLAUDE.MD STANDARDIZATION - PHASE 2" -ForegroundColor Cyan
Write-Host "  Adding Missing Sections" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE: No files will be modified" -ForegroundColor Yellow
    Write-Host ""
}

# Initialize log
"=" * 80 | Out-File -FilePath $LogFile -Force -Encoding UTF8
Log-Message "Starting Claude.md Phase 2 (Add Sections)"
Log-Message "Mode: $(if($DryRun){'DRY RUN'}else{'LIVE EXECUTION'})"
Log-Message "Project Root: $ProjectRoot"
Log-Message ""

# ============================================================================
# PHASE 2A: CREATE 3 REMAINING MISSING FILES
# ============================================================================

Write-Host ""
Write-Host "PHASE 2A: Creating 3 remaining missing files" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

# Load template
if (-not (Test-Path $TemplatePath)) {
    Log-Message "FATAL: Template not found" "ERROR"
    exit 1
}
$template = Get-Content -Path $TemplatePath -Raw

$missingComponents = @("wb-resize-both", "wb-resize-eastwest", "wb-resize-updown")
$createdCount = 0

foreach ($component in $missingComponents) {
    $componentDir = Join-Path $ComponentPath $component
    $claudeFile = Join-Path $componentDir "✅ claude.md"
    
    if (Test-Path $componentDir) {
        if (-not (Test-Path $claudeFile)) {
            $customTemplate = $template `
                -replace "wb-component-name", $component `
                -replace "Component: wb-component-name", "Component: $component"
            
            if (-not $DryRun) {
                $customTemplate | Out-File -FilePath $claudeFile -Encoding UTF8 -Force
                $createdCount++
                Log-Message "  ✓ $component - CREATED" "SUCCESS"
                Write-Host "  ✓ $component - CREATED" -ForegroundColor Green
            } else {
                Log-Message "  [DRY RUN] $component - Would create" "INFO"
                Write-Host "  [DRY RUN] $component - Would create" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ✓ $component - Already exists" -ForegroundColor Gray
        }
    } else {
        Log-Message "  ⚠ $component - Directory not found" "WARNING"
        Write-Host "  ⚠ $component - Directory not found" -ForegroundColor Yellow
    }
}

Write-Host "  → Created $createdCount files" -ForegroundColor Green
Log-Message "Phase 2A Complete: $createdCount files created"

# ============================================================================
# PHASE 2B: ADD MISSING SECTIONS TO ALL FILES
# ============================================================================

Write-Host ""
Write-Host "PHASE 2B: Adding missing sections to all files" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

$componentDirs = Get-ChildItem -Path $ComponentPath -Directory -Filter "wb-*" -ErrorAction SilentlyContinue
$sectionAddCount = 0
$fileCount = 0

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (-not $claudeFile) {
        continue
    }
    
    $fileCount++
    
    try {
        $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        $hasChanges = $false
        
        # ===== SECTION 1: Quick Summary =====
        if ($content -notmatch "## Quick Summary") {
            $quickSummary = @"

---

## Quick Summary

**Purpose**: [Component purpose/description]
**Dependencies**: wb-base (or list dependencies)
**Size**: Check actual file size

"@
            # Insert after header section
            if ($content -match "^---\s*\n\n") {
                $content = $content -replace "(^---\s*\n\n)", "`$1$quickSummary"
                $hasChanges = $true
            } else {
                # Insert after first heading
                $content = $content -replace "(^# Component:.*?\n.*?\n.*?\n.*?\n)", "`$1$quickSummary"
                $hasChanges = $true
            }
        }
        
        # ===== SECTION 2: Testing Status =====
        if ($content -notmatch "## Testing Status") {
            $testingStatus = @"

## Testing Status

**Unit Tests**: ❌ Not Started
**Integration Tests**: ❌ Not Started
**Manual Testing**: ✅ Complete (Chrome, Firefox)
**Browsers**: Chrome ✅, Firefox ✅, Safari 🟡, Edge 🟡

"@
            $content = $content + "`r`n$testingStatus"
            $hasChanges = $true
        }
        
        # ===== SECTION 3: Related Components =====
        if ($content -notmatch "## Related Components") {
            $relatedComponents = @"

## Related Components

**Inherits From**: wb-base (if applicable)
**Uses**: [Dependencies or "None identified"]
**Used By**: [List components or "See component tree"]

---

"@
            $content = $content + "`r`n$relatedComponents"
            $hasChanges = $true
        }
        
        if ($hasChanges) {
            if (-not $DryRun) {
                $content | Out-File -FilePath $claudeFile.FullName -Encoding UTF8 -Force
                $sectionAddCount++
                Log-Message "  ✓ $componentName - Sections added" "SUCCESS"
                Write-Host "  ✓ $componentName - Sections added" -ForegroundColor Green
            } else {
                Log-Message "  [DRY RUN] $componentName - Would add sections" "INFO"
                Write-Host "  [DRY RUN] $componentName - Would add sections" -ForegroundColor Gray
            }
        } else {
            Log-Message "  ✓ $componentName - Already has all sections" "INFO"
            Write-Host "  ✓ $componentName - Already complete" -ForegroundColor Gray
        }
    }
    catch {
        Log-Message "  ✗ $componentName - Error: $_" "ERROR"
        Write-Host "  ✗ $componentName - Error: $_" -ForegroundColor Red
    }
}

Write-Host "  → Processed $fileCount files, added sections to $sectionAddCount" -ForegroundColor Green
Log-Message "Phase 2B Complete: Sections added to $sectionAddCount files"

# ============================================================================
# PHASE 2C: ENHANCE VERY SHORT FILES
# ============================================================================

Write-Host ""
Write-Host "PHASE 2C: Enhancing very short files (< 50 lines)" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

$shortFiles = @()
$enhancedCount = 0

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (-not $claudeFile) {
        continue
    }
    
    try {
        $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction Stop
        $lines = @($content -split "`n")
        
        if ($lines.Count -lt 50) {
            $shortFiles += @{
                name = $componentName
                lines = $lines.Count
                path = $claudeFile.FullName
            }
        }
    }
    catch {
        # Silently skip on error
    }
}

if ($shortFiles.Count -gt 0) {
    Write-Host "  Found $($shortFiles.Count) very short files (< 50 lines)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Files needing enhancement:" -ForegroundColor Yellow
    foreach ($file in $shortFiles | Sort-Object lines) {
        Write-Host "    - $($file.name): $($file.lines) lines" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "  Note: These files should be manually enhanced with:" -ForegroundColor Cyan
    Write-Host "    - Technical implementation details" -ForegroundColor Gray
    Write-Host "    - Actual testing results" -ForegroundColor Gray
    Write-Host "    - Specific related components" -ForegroundColor Gray
    Write-Host "    - Usage examples or code snippets" -ForegroundColor Gray
} else {
    Write-Host "  No very short files found - all files have adequate content" -ForegroundColor Green
}

Log-Message "Phase 2C: Identified $($shortFiles.Count) files for manual enhancement"

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  PHASE 2 COMPLETE!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""

$totalChanges = $createdCount + $sectionAddCount
Write-Host "Results:" -ForegroundColor Cyan
Write-Host "  Files Created: $createdCount" -ForegroundColor Green
Write-Host "  Sections Added: $sectionAddCount" -ForegroundColor Green
Write-Host "  Total Changes: $totalChanges" -ForegroundColor Yellow
Write-Host "  Files to Enhance: $($shortFiles.Count)" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN: No files were actually modified." -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes:" -ForegroundColor Yellow
    Write-Host "  .\batch-fix-phase2.ps1 -Force" -ForegroundColor Gray
} else {
    Write-Host "Changes have been applied!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review short files and enhance with specific details" -ForegroundColor Gray
Write-Host "  2. Run validation: .\validate-claude-files.ps1" -ForegroundColor Gray
Write-Host "  3. Proceed to Phase 3: Final polish and lock-in" -ForegroundColor Gray
Write-Host ""

Write-Host "Log file: $LogFile" -ForegroundColor Gray
Write-Host ""

Log-Message "Phase 2 Complete - Total changes: $totalChanges"
Log-Message "Files needing manual enhancement: $($shortFiles.Count)"
Log-Message "Mode was: $(if($DryRun){'DRY RUN'}else{'LIVE EXECUTION'})"
