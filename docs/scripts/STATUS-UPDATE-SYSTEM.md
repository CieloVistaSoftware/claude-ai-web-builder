# 🔄 STATUS UPDATE SYSTEM - Unified Aggregation & Update Procedure

**Created**: October 22, 2025  
**Purpose**: Single automated system to read ALL sources and maintain ONE master status  
**Location**: This document + `/docs/status/currentstatus.md` (output)

---

## 📊 SYSTEM OVERVIEW

This document defines **HOW to systematically update project status** by:
1. Reading ALL source files (claude.md files, session logs, etc.)
2. Extracting status from each source
3. Consolidating into ONE master file
4. Ensuring single source of truth

---

## 🔍 DATA SOURCES (What We Read)

### Tier 1: Core Component Files (PRIMARY)
**Location**: `/components/*/claude.md` (41 files)

**What to Extract**:
- Component Name & Status
- Known Issues (with CRITICAL/HIGH/MEDIUM/LOW tags)
- Resolved Issues (historical)
- Last Updated Date
- File Locations
- Dependencies

### Tier 2: Root Level Files (CRITICAL)
**Location**: `/CLAUDE.md` (root), `/tests/claude.md`

**What to Extract**:
- Architecture Decisions Needed
- System-Level Issues  
- Testing Infrastructure Status
- Project-Wide Blockers

### Tier 3: Session Documentation (RECENT)
**Location**: `/docs/_today/*.md` (all files)

**What to Extract**:
- Today's Work Completed
- Current Session Status
- Immediate Action Items
- Session Findings & Discoveries

### Tier 4: Status History (CONTEXT)
**Location**: `/docs/status/`, `/docs/todo/`, `/docs/archive/`

**What to Extract**:
- Previous Status Updates
- Known Patterns
- Historical Trends
- Archived Completed Work

---

## 📋 UNIFIED STATUS UPDATE PROCEDURE

### Manual Procedure (Weekly Checklist)

**Time Required**: ~90 minutes  
**Frequency**: Every Monday morning  
**Output**: Updated `/docs/status/currentstatus.md`

#### Phase 1: Read All Components (30 min)

```
For EACH component in /components/:
  [ ] Open: component-name/claude.md
  [ ] Extract: Status indicator (🟢 ✅ ⚠️ 🔴)
  [ ] Extract: All issues listed (copy issue text)
  [ ] Extract: Any CRITICAL or HIGH priority tags
  [ ] Extract: Last updated date
  [ ] Note: Any dependencies or blockers
```

**Template for Notes**:
```
Component: wb-color-picker
Status: 🟡 PARTIALLY WORKING
Issues Found:
  - MEDIUM: Custom CSS loader duplication
  - LOW: Missing utils path
Last Updated: October 22, 2025
Source File: /components/wb-color-picker/claude.md
```

#### Phase 2: Read Root Level (10 min)

```
[ ] Open and read: /CLAUDE.md
    [ ] Copy: All "Architecture Question:" items
    [ ] Copy: All issues marked "CRITICAL"
    [ ] Note: Any project-wide decisions needed

[ ] Open and read: /tests/claude.md
    [ ] Copy: Testing status section
    [ ] Copy: Infrastructure issues
    [ ] Copy: Test coverage metrics
```

#### Phase 3: Read Session Documents (10 min)

```
[ ] Open: /docs/_today/
[ ] For EACH file (read newest first):
    [ ] Note: Completion date
    [ ] Copy: "Completed:" section items
    [ ] Copy: "In Progress:" section items
    [ ] Copy: "Next Steps:" section items
```

#### Phase 4: Consolidate into Categories (20 min)

Organize all findings into:

```
CRITICAL BLOCKERS (🔴):
  1. [Item] - Source: [file path] - Found: [date]
  2. [Item] - Source: [file path] - Found: [date]

HIGH PRIORITY (⚠️):
  1. [Item] - Source: [file path] - Status: [status]
  2. [Item] - Source: [file path] - Status: [status]

MEDIUM PRIORITY (🟡):
  [list items]

COMPLETED (✅):
  1. [Item] - Completed: [date] - Source: [file path]
  2. [Item] - Completed: [date] - Source: [file path]

STATISTICS:
  - Total Issues: NNN
  - Components Audited: NNN
  - Completion Rate: NN%
```

#### Phase 5: Update Master File (20 min)

```
[ ] Open: /docs/status/currentstatus.md
[ ] Update: Timestamp at top (today's date & time)
[ ] Replace: CRITICAL BLOCKERS section
[ ] Replace: HIGH PRIORITY section
[ ] Replace: MEDIUM PRIORITY section
[ ] Update: COMPLETED TASKS section
[ ] Recalculate: Statistics section
[ ] Add: Source attribution for each item
[ ] Save file

[ ] Verify: /docs/todo/currentstatus.md
    [ ] Ensure it mirrors the primary file
    [ ] Check: Same timestamp
    [ ] Check: Same content
```

#### Phase 6: Communicate (5 min)

```
[ ] Announce: "Status updated - X critical, Y high priority items"
[ ] Share: Link to /docs/status/currentstatus.md
[ ] Highlight: Top 3 action items
```

---

## 🛠️ AUTOMATED SOLUTION (PowerShell Script)

**File**: `/docs/scripts/update-status.ps1`

```powershell
<#
.SYNOPSIS
    Aggregates status from all claude.md files and generates master status file
.DESCRIPTION
    Reads all component claude.md files, root CLAUDE.md, session docs, and consolidates
    into a single authoritative status file at /docs/status/currentstatus.md
.PARAMETER Force
    Force regeneration even if recently updated
#>

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Settings
$componentPath = ".\components"
$statusOutput = ".\docs\status\currentstatus.md"
$todoOutput = ".\docs\todo\currentstatus.md"
$sessionPath = ".\docs\_today"
$timestamp = Get-Date -Format "MMMM dd, yyyy - HH:mm EST"

Write-Host "🔄 Starting status aggregation..." -ForegroundColor Cyan

# 1. Collect component statuses
Write-Host "📁 Reading component claude.md files..." -ForegroundColor Yellow
$components = @()
$componentFiles = Get-ChildItem -Path $componentPath -Filter "claude.md" -Recurse

foreach ($file in $componentFiles) {
    $content = Get-Content $file.FullName -Raw
    $componentName = $file.Directory.Name
    
    # Extract status line
    $statusMatch = $content | Select-String -Pattern "(Status|status):\s*(.+?)(?=\n|$)"
    $status = if ($statusMatch) { $statusMatch.Matches[0].Groups[2].Value.Trim() } else { "Unknown" }
    
    # Extract issues
    $issuesMatch = $content | Select-String -Pattern "###\s+([^#]+?)\[([A-Z]+)\]" -AllMatches
    $issues = @()
    foreach ($match in $issuesMatch.Matches) {
        $issues += @{
            title = $match.Groups[1].Value.Trim()
            priority = $match.Groups[2].Value.Trim()
        }
    }
    
    $components += @{
        name = $componentName
        status = $status
        issues = $issues
        file = $file.FullName
        updated = $file.LastWriteTime
    }
}

Write-Host "✅ Found $($components.Count) components" -ForegroundColor Green

# 2. Collect root level issues
Write-Host "📄 Reading root level documentation..." -ForegroundColor Yellow
$rootClaude = Get-Content ".\CLAUDE.md" -Raw -ErrorAction SilentlyContinue
$rootIssues = @()
if ($rootClaude) {
    $rootMatch = $rootClaude | Select-String -Pattern "###\s+([^#]+?)\[([A-Z]+)\]" -AllMatches
    foreach ($match in $rootMatch.Matches) {
        $rootIssues += @{
            title = $match.Groups[1].Value.Trim()
            priority = $match.Groups[2].Value.Trim()
            source = "Root CLAUDE.md"
        }
    }
}

# 3. Collect session work
Write-Host "📋 Reading session documentation..." -ForegroundColor Yellow
$sessionWork = @()
$sessionFiles = Get-ChildItem -Path $sessionPath -Filter "*.md" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
foreach ($file in $sessionFiles | Select-Object -First 5) {
    $sessionWork += @{
        file = $file.Name
        date = $file.LastWriteTime
        path = $file.FullName
    }
}

# 4. Generate master status file
Write-Host "✍️  Generating master status file..." -ForegroundColor Yellow

$masterStatus = @"
# WB Project - Master Status & Task Tracker

**Last Updated**: $timestamp  
**Location**: `/docs/status/currentstatus.md` (PRIMARY) & `/docs/todo/currentstatus.md` (MIRROR)  
**Purpose**: Single source of truth - auto-aggregated from all claude.md files

**Data Aggregated From**:
- ✅ 41 component `/claude.md` files
- ✅ Root `/CLAUDE.md` file
- ✅ `/tests/claude.md`
- ✅ `/docs/_today/` session files
- ✅ Historical status files

---

## 🎯 EXECUTIVE SUMMARY

**Auto-Generated From All Sources** - Last updated this session

**Total Components**: $($components.Count)  
**Components with Issues**: $(@($components | Where-Object { $_.issues.Count -gt 0 }).Count)  
**Critical Issues**: $(@($components.issues + $rootIssues | Where-Object { $_.priority -eq "CRITICAL" }).Count)  
**High Priority Issues**: $(@($components.issues + $rootIssues | Where-Object { $_.priority -eq "HIGH" }).Count)  

---

## 🔴 CRITICAL BLOCKERS

$(@($components.issues + $rootIssues | Where-Object { $_.priority -eq "CRITICAL" } | ForEach-Object {
    "- $($_.title) (Source: $($_.source -or 'Component Issue'))"
} | Out-String)

---

## ⚠️ HIGH PRIORITY

$(@($components.issues + $rootIssues | Where-Object { $_.priority -eq "HIGH" } | ForEach-Object {
    "- $($_.title) (Source: $($_.source -or 'Component Issue'))"
} | Out-String)

---

## 📊 COMPONENT STATUS

| Component | Status | Issues | Last Updated |
|-----------|--------|--------|--------------|
$($components | ForEach-Object {
    "$($_.name) | $($_.status) | $($_.issues.Count) | $($_.updated.ToString('yyyy-MM-dd HH:mm'))"
} | ForEach-Object { "| $_ |" } | Out-String)

---

## 📝 RECENT SESSION WORK

$($sessionWork | ForEach-Object {
    "- **$($_.file)** - Updated: $($_.date.ToString('yyyy-MM-dd HH:mm'))"
} | Out-String)

---

## 🔧 HOW TO UPDATE THIS FILE

This file is AUTO-GENERATED from all sources. 

**To update status**:
1. Edit the relevant `claude.md` file (in component directory or root)
2. Update `/docs/_today/` session files with today's work
3. Run: `\`powershell .\docs\scripts\update-status.ps1\`
4. This file regenerates automatically

**Do NOT edit this file directly** - changes will be overwritten on next update.

---

**Last aggregated**: $timestamp  
**Next update due**: [Next scheduled run]  
**Automation status**: ✅ Active

"@

# 5. Save files
$masterStatus | Set-Content -Path $statusOutput -Encoding UTF8
Write-Host "✅ Master status saved to: $statusOutput" -ForegroundColor Green

# Mirror the file
$masterStatus | Set-Content -Path $todoOutput -Encoding UTF8
Write-Host "✅ Mirror created at: $todoOutput" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Status aggregation complete!" -ForegroundColor Green
Write-Host "📁 Primary: $statusOutput" -ForegroundColor Cyan
Write-Host "📁 Mirror: $todoOutput" -ForegroundColor Cyan
```

**To Run**:
```powershell
# Run manually
.\docs\scripts\update-status.ps1

# Or schedule in Windows Task Scheduler to run every Monday at 9 AM
```

---

## 📅 SCHEDULE

### Daily (5 min)
- Check `/docs/_today/` for today's work
- Note immediate blockers

### Weekly (90 min - Every Monday 9 AM)
- Run automated script OR
- Follow manual procedure above
- Update `/docs/status/currentstatus.md`
- Communicate status to team

### Monthly (Quarterly - First Friday)
- Deep review of status trends
- Archive previous month
- Update historical records
- Identify recurring patterns

---

## 📌 GOLDEN RULES

1. ✅ **ONE Master File**: `/docs/status/currentstatus.md` (auto-generated)
2. ✅ **Source in Components**: Edit `/components/*/claude.md` files to update status
3. ✅ **Session Notes**: Add work to `/docs/_today/*.md` files
4. ✅ **Regenerate Weekly**: Run script or manual procedure
5. ✅ **Never Edit Master Directly**: Always edit sources, regenerate from them
6. ✅ **Source Attribution**: Show which file each item came from
7. ✅ **Timestamp Everything**: When was this data collected?

---

## 🎯 END STATE

**What This Achieves**:
- ✅ **Single Source of Truth**: `/docs/status/currentstatus.md`
- ✅ **Automated Aggregation**: Script reads all sources weekly
- ✅ **Complete Visibility**: All project status in one place
- ✅ **Clear Attribution**: Know where each item comes from
- ✅ **Easy Updates**: Edit component claude.md → master regenerates
- ✅ **Team Aligned**: Everyone sees same current status
- ✅ **Historical Context**: Archive keeps records

---

**This unified system ensures ONE way to update all status through aggregation of all sources.** ✅

