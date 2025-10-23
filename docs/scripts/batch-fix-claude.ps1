#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Claude.md Standardization - Batch Fix Script (Phase 1)
.DESCRIPTION
    Automates critical Phase 1 fixes:
    - Creates 5 missing claude.md files
    - Fixes headers in 40 files
    - Converts dates to standard format
.PARAMETER DryRun
    Preview changes without modifying files
.PARAMETER Force
    Apply changes without prompting
.EXAMPLE
    .\batch-fix-claude.ps1 -DryRun
    .\batch-fix-claude.ps1 -Force
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
$LogFile = Join-Path $ProjectRoot "docs\status\batch-fix-log.txt"

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

# HEADER
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  CLAUDE.MD STANDARDIZATION - BATCH FIX (PHASE 1)" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE: No files will be modified" -ForegroundColor Yellow
    Write-Host ""
}

# Initialize log
"=" * 80 | Out-File -FilePath $LogFile -Force -Encoding UTF8
Log-Message "Starting Claude.md Batch Fix (Phase 1)"
Log-Message "Mode: $(if($DryRun){'DRY RUN'}else{'LIVE EXECUTION'})"
Log-Message "Project Root: $ProjectRoot"
Log-Message ""

# CHECK TEMPLATE
if (-not (Test-Path $TemplatePath)) {
    Log-Message "FATAL: Template file not found at $TemplatePath" "ERROR"
    Write-Host "Cannot proceed without template!" -ForegroundColor Red
    exit 1
}

Log-Message "Template found: $TemplatePath" "SUCCESS"

# LOAD TEMPLATE
$template = Get-Content -Path $TemplatePath -Raw -ErrorAction Stop

# ============================================================================
# PHASE 1A: CREATE MISSING FILES
# ============================================================================

Write-Host ""
Write-Host "PHASE 1A: Creating 5 missing claude.md files" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

$missingComponents = @("wb-1rem", "wb-chatbot", "wb-color-organ", "wb-css-loader", "wb-grid")
$createdCount = 0

foreach ($component in $missingComponents) {
    $componentDir = Join-Path $ComponentPath $component
    $claudeFile = Join-Path $componentDir "✅ claude.md"
    
    if (Test-Path $componentDir) {
        if (Test-Path $claudeFile) {
            Log-Message "  ✓ $component - File already exists" "INFO"
        } else {
            # Create file with customized template
            $customTemplate = $template `
                -replace "wb-component-name", $component `
                -replace "Component: wb-component-name", "Component: $component"
            
            if (-not $DryRun) {
                $customTemplate | Out-File -FilePath $claudeFile -Encoding UTF8 -Force
                $createdCount++
                Log-Message "  ✓ $component - CREATED" "SUCCESS"
            } else {
                Log-Message "  [DRY RUN] $component - Would create file" "INFO"
            }
        }
    } else {
        Log-Message "  ⚠ $component - Directory not found" "WARNING"
    }
}

Write-Host "  → Created $createdCount files" -ForegroundColor Green
Log-Message "Phase 1A Complete: $createdCount files created"

# ============================================================================
# PHASE 1B: FIX HEADERS IN ALL FILES
# ============================================================================

Write-Host ""
Write-Host "PHASE 1B: Fixing headers in all claude.md files" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

$componentDirs = Get-ChildItem -Path $ComponentPath -Directory -Filter "wb-*" -ErrorAction SilentlyContinue
$headerFixCount = 0
$headerSkipCount = 0

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (-not $claudeFile) {
        continue
    }
    
    try {
        $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction Stop
        
        # Check if already has correct header format
        if ($content -match "^# Component: $([regex]::Escape($componentName))") {
            $headerSkipCount++
            Log-Message "  ✓ $componentName - Header already correct" "INFO"
            continue
        }
        
        # Extract status line (if exists)
        $statusLine = "🟡 IN PROGRESS"
        if ($content -match "\*\*Status\*\*:\s*(.+?)(?=\n|\r)") {
            $statusLine = $matches[1].Trim()
        } elseif ($content -match "Status[:\s]+([^\n]+)") {
            $statusLine = $matches[1].Trim() -replace "^[\*_`]+|[\*_`]+$", ""
            # Map to standard indicator
            if ($statusLine -match "✅|COMPLETE|Completed") { $statusLine = "✅ COMPLETE" }
            elseif ($statusLine -match "🟢|FUNCTIONAL|Working") { $statusLine = "🟢 FUNCTIONAL" }
            elseif ($statusLine -match "🟡|PROGRESS|Development") { $statusLine = "🟡 IN PROGRESS" }
            elseif ($statusLine -match "🔴|BLOCKED|Cannot") { $statusLine = "🔴 BLOCKED" }
            elseif ($statusLine -match "⚠️|TESTING|Needs") { $statusLine = "⚠️ NEEDS TESTING" }
            else { $statusLine = "🟡 IN PROGRESS" }
        }
        
        # Get today's date
        $today = Get-Date -Format "MMMM dd, yyyy"
        
        # Create new header
        $newHeader = @"
# Component: $componentName

**Status**: $statusLine
**Last Updated**: $today
**Location**: /components/$componentName/claude.md

---

"@
        
        # Remove old header (everything before first real content)
        $remainingContent = $content
        
        # Remove lines that look like old headers
        $remainingContent = $remainingContent -replace "^[#]+\s+.*?\n", ""
        $remainingContent = $remainingContent -replace "^https?://.*?\n", ""
        $remainingContent = $remainingContent -replace "^\*\*See.*?\*\*\n\n", ""
        $remainingContent = $remainingContent -replace "^\[Documentation.*?\]\(.*?\)\n\n", ""
        $remainingContent = $remainingContent -replace "^\*\*Status\*\*:.*?\n", ""
        $remainingContent = $remainingContent -replace "^\*\*Last Updated\*\*:.*?\n", ""
        $remainingContent = $remainingContent -replace "^\*\*Location\*\*:.*?\n", ""
        $remainingContent = $remainingContent -replace "^---+\n\n", ""
        $remainingContent = $remainingContent -replace "^[^#]*?## ", "## "
        $remainingContent = $remainingContent.TrimStart()
        
        # Combine new header with content
        $newContent = $newHeader + $remainingContent
        
        if (-not $DryRun) {
            $newContent | Out-File -FilePath $claudeFile.FullName -Encoding UTF8 -Force
            $headerFixCount++
            Log-Message "  ✓ $componentName - Header fixed (Status: $statusLine)" "SUCCESS"
        } else {
            Log-Message "  [DRY RUN] $componentName - Would fix header (Status: $statusLine)" "INFO"
        }
    }
    catch {
        Log-Message "  ✗ $componentName - Error: $_" "ERROR"
    }
}

Write-Host "  → Fixed $headerFixCount headers, skipped $headerSkipCount (already correct)" -ForegroundColor Green
Log-Message "Phase 1B Complete: $headerFixCount headers fixed"

# ============================================================================
# PHASE 1C: FIX DATE FORMATS
# ============================================================================

Write-Host ""
Write-Host "PHASE 1C: Converting dates to standard format" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Cyan

$dateFixCount = 0
$dateSkipCount = 0

$months = @{
    "January" = "01"; "February" = "02"; "March" = "03"; "April" = "04"
    "May" = "05"; "June" = "06"; "July" = "07"; "August" = "08"
    "September" = "09"; "October" = "10"; "November" = "11"; "December" = "12"
    "Jan" = "01"; "Feb" = "02"; "Mar" = "03"; "Apr" = "04"
    "Jun" = "06"; "Jul" = "07"; "Aug" = "08"; "Sep" = "09"
    "Oct" = "10"; "Nov" = "11"; "Dec" = "12"
}

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (-not $claudeFile) {
        continue
    }
    
    try {
        $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Pattern 1: "Oct 6, 2025" -> "October 6, 2025"
        foreach ($abbr in $months.Keys | Where-Object { $_.Length -eq 3 }) {
            $pattern = "\b$abbr\s+(\d{1,2}),\s+(20\d{2})\b"
            $fullMonth = if ($abbr.Length -eq 3) {
                @("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")[([int]$months[$abbr]) - 1]
            } else { $abbr }
            $content = [regex]::Replace($content, $pattern, "$fullMonth `$1, `$2")
        }
        
        # Pattern 2: "2025-10-06" -> "October 6, 2025"
        $pattern2 = "\b(\d{4})-(\d{2})-(\d{2})\b"
        $content = [regex]::Replace($content, $pattern2, {
            $year = $args[0].Groups[1].Value
            $monthNum = [int]$args[0].Groups[2].Value
            $day = [int]$args[0].Groups[3].Value
            $monthNames = @("", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
            "$($monthNames[$monthNum]) $day, $year"
        })
        
        # Pattern 3: "10/6/2025" or "10/06/2025" -> "October 6, 2025"
        $pattern3 = "\b(\d{1,2})/(\d{1,2})/(\d{4})\b"
        $content = [regex]::Replace($content, $pattern3, {
            $month = [int]$args[0].Groups[1].Value
            $day = [int]$args[0].Groups[2].Value
            $year = $args[0].Groups[3].Value
            $monthNames = @("", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
            if ($month -ge 1 -and $month -le 12) {
                "$($monthNames[$month]) $day, $year"
            } else {
                $args[0].Value
            }
        })
        
        if ($content -ne $originalContent) {
            if (-not $DryRun) {
                $content | Out-File -FilePath $claudeFile.FullName -Encoding UTF8 -Force
                $dateFixCount++
                Log-Message "  ✓ $componentName - Dates converted" "SUCCESS"
            } else {
                Log-Message "  [DRY RUN] $componentName - Would convert dates" "INFO"
            }
        } else {
            $dateSkipCount++
        }
    }
    catch {
        Log-Message "  ✗ $componentName - Error: $_" "ERROR"
    }
}

Write-Host "  → Fixed $dateFixCount files, skipped $dateSkipCount (already correct)" -ForegroundColor Green
Log-Message "Phase 1C Complete: $dateFixCount files updated"

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  PHASE 1 COMPLETE!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""

$totalChanges = $createdCount + $headerFixCount + $dateFixCount
Write-Host "Results:" -ForegroundColor Cyan
Write-Host "  Files Created: $createdCount" -ForegroundColor Green
Write-Host "  Headers Fixed: $headerFixCount" -ForegroundColor Green
Write-Host "  Dates Converted: $dateFixCount" -ForegroundColor Green
Write-Host "  Total Changes: $totalChanges" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN: No files were actually modified." -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes:" -ForegroundColor Yellow
    Write-Host "  .\batch-fix-claude.ps1 -Force" -ForegroundColor Gray
} else {
    Write-Host "Changes have been applied!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Log file: $LogFile" -ForegroundColor Gray
Write-Host ""

Log-Message "Phase 1 Complete - Total changes: $totalChanges"
Log-Message "Mode was: $(if($DryRun){'DRY RUN'}else{'LIVE EXECUTION'})"
