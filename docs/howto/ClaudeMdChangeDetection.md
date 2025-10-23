# Claude.md Change Detection System

**Created**: October 19, 2025  
**Location**: `/docs/howto/ClaudeMdChangeDetection.md`  
**Purpose**: System for tracking which claude.md files have new content to aggregate

---

## 🎯 SYSTEM OVERVIEW

This system uses **marker characters** at the top of each claude.md file to indicate whether new content needs to be read and aggregated into currentstatus.md.

### Key Principles
1. **Efficiency**: Only read files that have changed
2. **Accuracy**: currentstatus.md is ALWAYS accurate
3. **Simplicity**: Single character marker system
4. **Override**: Can force full refresh when needed

---

## 📋 MARKER SYSTEM

Every claude.md file must start with ONE of these marker lines:

### Status Markers

```markdown
<!-- STATUS: NEW -->
<!-- STATUS: UPDATED -->
<!-- STATUS: READ -->
<!-- STATUS: ARCHIVED -->
```

### Marker Definitions

| Marker | Meaning | Action Required | Color |
|--------|---------|-----------------|-------|
| `<!-- STATUS: NEW -->` | File has never been aggregated | 🔴 MUST READ - Add to currentstatus.md | RED |
| `<!-- STATUS: UPDATED -->` | File has new content since last read | 🟡 MUST READ - Update currentstatus.md | YELLOW |
| `<!-- STATUS: READ -->` | File has been aggregated, no changes | ✅ SKIP - No action needed | GREEN |
| `<!-- STATUS: ARCHIVED -->` | File is old/deprecated, don't aggregate | ⚫ SKIP - Ignore permanently | GRAY |

---

## 🔄 WORKFLOW

### Step 1: Check for Updates

**Command**: "Check for claude.md updates"

**Process**:
1. Search for all claude.md files in project
2. Read ONLY the first line of each file
3. Count files by status:
   - NEW files (need first-time aggregation)
   - UPDATED files (need re-aggregation)
   - READ files (skip)
   - ARCHIVED files (skip)
4. Report summary to user

**Output Example**:
```
📊 Claude.md Status Check:
🔴 NEW: 3 files need first-time aggregation
🟡 UPDATED: 5 files have new content
✅ READ: 85 files are current
⚫ ARCHIVED: 3 files are deprecated
Total: 96 files

Next Action: Read 8 files and update currentstatus.md
```

---

### Step 2: Aggregate Changed Files

**Command**: "Aggregate changed claude.md files"

**Process**:
1. Read ALL files marked NEW or UPDATED
2. Extract tasks, issues, status from each file
3. Aggregate into currentstatus.md using priority system:
   - 🔴 CRITICAL tasks
   - ⚠️ HIGH priority tasks
   - 🟢 COMPLETED tasks
4. Update each processed file's marker to READ
5. Update currentstatus.md timestamp
6. Generate summary report

**Output**: Updated currentstatus.md with new content

---

### Step 3: Mark File as Changed (After Editing)

**When**: After editing ANY claude.md file

**Process**:
```markdown
<!-- STATUS: UPDATED -->
# Component Name - Claude.md

[Your new content here...]
```

**Important**: 
- Always change marker to UPDATED after editing
- This ensures changes get aggregated next run
- AI will detect and process on next check

---

### Step 4: Force Full Refresh (Override)

**Command**: "Force full claude.md refresh"

**When to Use**:
- First-time setup
- After major refactoring
- Suspect currentstatus.md is out of sync
- Need to rebuild from scratch

**Process**:
1. Ignore all markers
2. Read ALL claude.md files (except ARCHIVED)
3. Rebuild currentstatus.md from scratch
4. Mark all processed files as READ
5. Generate complete status report

**Warning**: This reads ~90+ files and takes several minutes

---

## 🛠️ IMPLEMENTATION

### PowerShell Script: Check Status

Create `/scripts/check-claude-status.ps1`:

```powershell
# Check all claude.md files for status markers
$files = Get-ChildItem -Path "C:\Users\jwpmi\Downloads\AI\wb" -Filter "claude.md" -Recurse
$stats = @{
    NEW = @()
    UPDATED = @()
    READ = @()
    ARCHIVED = @()
    MISSING = @()
}

foreach ($file in $files) {
    $firstLine = Get-Content $file.FullName -First 1
    
    if ($firstLine -match "STATUS: NEW") {
        $stats.NEW += $file.FullName
    }
    elseif ($firstLine -match "STATUS: UPDATED") {
        $stats.UPDATED += $file.FullName
    }
    elseif ($firstLine -match "STATUS: READ") {
        $stats.READ += $file.FullName
    }
    elseif ($firstLine -match "STATUS: ARCHIVED") {
        $stats.ARCHIVED += $file.FullName
    }
    else {
        $stats.MISSING += $file.FullName
    }
}

# Report
Write-Host "📊 Claude.md Status Check:" -ForegroundColor Cyan
Write-Host "🔴 NEW: $($stats.NEW.Count) files" -ForegroundColor Red
Write-Host "🟡 UPDATED: $($stats.UPDATED.Count) files" -ForegroundColor Yellow
Write-Host "✅ READ: $($stats.READ.Count) files" -ForegroundColor Green
Write-Host "⚫ ARCHIVED: $($stats.ARCHIVED.Count) files" -ForegroundColor Gray
Write-Host "⚠️ MISSING MARKER: $($stats.MISSING.Count) files" -ForegroundColor Magenta
Write-Host "Total: $($files.Count) files"

# Show files needing attention
if ($stats.NEW.Count -gt 0 -or $stats.UPDATED.Count -gt 0) {
    Write-Host "`n📋 Files Needing Aggregation:" -ForegroundColor Yellow
    $stats.NEW | ForEach-Object { Write-Host "  🔴 $_" -ForegroundColor Red }
    $stats.UPDATED | ForEach-Object { Write-Host "  🟡 $_" -ForegroundColor Yellow }
}

# Show files missing markers
if ($stats.MISSING.Count -gt 0) {
    Write-Host "`n⚠️ Files Missing Status Marker:" -ForegroundColor Magenta
    $stats.MISSING | ForEach-Object { Write-Host "  ⚠️ $_" }
}
```

**Usage**: `.\scripts\check-claude-status.ps1`

---

### PowerShell Script: Update Marker

Create `/scripts/mark-claude-updated.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPDATED", "READ", "ARCHIVED")]
    [string]$Status = "UPDATED"
)

if (-not (Test-Path $FilePath)) {
    Write-Host "❌ File not found: $FilePath" -ForegroundColor Red
    exit 1
}

# Read entire file
$content = Get-Content $FilePath -Raw

# Check if marker exists
if ($content -match "^<!-- STATUS: \w+ -->") {
    # Replace existing marker
    $content = $content -replace "^<!-- STATUS: \w+ -->", "<!-- STATUS: $Status -->"
    Write-Host "✅ Updated marker to: $Status" -ForegroundColor Green
}
else {
    # Add marker at top
    $content = "<!-- STATUS: $Status -->`n" + $content
    Write-Host "✅ Added marker: $Status" -ForegroundColor Green
}

# Write back to file
Set-Content -Path $FilePath -Value $content -NoNewline

Write-Host "📝 File updated: $FilePath" -ForegroundColor Cyan
```

**Usage**: 
```powershell
# Mark file as updated
.\scripts\mark-claude-updated.ps1 -FilePath "C:\path\to\claude.md" -Status UPDATED

# Mark file as read
.\scripts\mark-claude-updated.ps1 -FilePath "C:\path\to\claude.md" -Status READ
```

---

### PowerShell Script: Bulk Initialize Markers

Create `/scripts/initialize-claude-markers.ps1`:

```powershell
# Initialize all claude.md files with READ marker (for existing files)
$files = Get-ChildItem -Path "C:\Users\jwpmi\Downloads\AI\wb" -Filter "claude.md" -Recurse

Write-Host "🚀 Initializing status markers for $($files.Count) files..." -ForegroundColor Cyan

$initialized = 0
$skipped = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has marker
    if ($content -match "^<!-- STATUS: \w+ -->") {
        $skipped++
        continue
    }
    
    # Add READ marker to existing files
    $newContent = "<!-- STATUS: READ -->`n" + $content
    Set-Content -Path $file.FullName -Value $newContent -NoNewline
    $initialized++
    
    Write-Host "  ✅ Initialized: $($file.FullName)" -ForegroundColor Green
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Initialized: $initialized files" -ForegroundColor Green
Write-Host "  ⏭️ Skipped: $skipped files" -ForegroundColor Yellow
Write-Host "  📝 Total: $($files.Count) files"
```

**Usage**: `.\scripts\initialize-claude-markers.ps1`

---

## 📝 CLAUDE AI COMMANDS

### Command 1: Quick Status Check

**User Says**: "Check claude.md status"

**AI Response**:
```
I'll check the status of all claude.md files...

[Runs check-claude-status.ps1 or equivalent]

📊 Claude.md Status Check:
🔴 NEW: 2 files need aggregation
🟡 UPDATED: 3 files have changes
✅ READ: 91 files are current
⚫ ARCHIVED: 0 files

Files needing attention:
🔴 /components/wb-new-component/claude.md
🔴 /tests/new-test/claude.md
🟡 /components/wb-input/claude.md
🟡 /components/wb-nav/claude.md
🟡 /CLAUDE.md

Would you like me to aggregate these 5 files now?
```

---

### Command 2: Aggregate Changes

**User Says**: "Aggregate changed claude.md files" or "Update currentstatus"

**AI Process**:
1. Find all NEW and UPDATED files
2. Read each file completely
3. Extract tasks, issues, priorities
4. Update currentstatus.md with new information
5. Mark processed files as READ
6. Report what was changed

**AI Response**:
```
✅ Aggregated 5 changed files:

Added to currentstatus.md:
- 🔴 2 CRITICAL issues from /CLAUDE.md
- ⚠️ 3 HIGH priority tasks from /components/wb-input/claude.md
- ✅ 1 COMPLETED task from /components/wb-nav/claude.md

Updated components:
- wb-input: Added missing config issue
- wb-nav: Updated interactive examples status
- Root: Added testing infrastructure blocker

All processed files marked as READ.
currentstatus.md updated with timestamp.

📊 Current Status:
- CRITICAL: 8 tasks (was 6)
- HIGH: 9 tasks (was 6)
- COMPLETED: 9 tasks (was 8)
```

---

### Command 3: Mark File as Updated

**User Says**: "Mark wb-input claude.md as updated"

**AI Process**:
1. Find the file
2. Update status marker to UPDATED
3. Confirm change

**AI Response**:
```
✅ Marked as UPDATED: /components/wb-input/claude.md

This file will be included in the next aggregation.
Would you like me to aggregate changes now?
```

---

### Command 4: Force Full Refresh

**User Says**: "Force full claude.md refresh" or "Rebuild currentstatus from scratch"

**AI Warning**:
```
⚠️ WARNING: This will read ALL 96 claude.md files and rebuild currentstatus.md

This process may take 5-10 minutes and will:
- Read all files (except ARCHIVED)
- Completely rebuild currentstatus.md
- Mark all files as READ
- Override current status

Are you sure you want to proceed? (yes/no)
```

**If Yes**:
```
🚀 Starting full refresh...
📖 Reading 93 files...
[Progress indicator]

✅ Full refresh complete!

Summary:
- Read 93 files
- Found 25 tasks total
- 🔴 CRITICAL: 6 tasks
- ⚠️ HIGH: 8 tasks
- 🟢 COMPLETED: 11 tasks

currentstatus.md completely rebuilt.
All files marked as READ.
```

---

## 🎯 BEST PRACTICES

### For Developers

1. **Always Update Marker When Editing**
   ```markdown
   <!-- STATUS: UPDATED -->
   # Your Claude.md file
   ```

2. **Use Descriptive Status Updates**
   - Don't just say "Fixed issue"
   - Say "Fixed wb-input config loading - added wb-input.json"

3. **Follow Priority Levels**
   - 🔴 CRITICAL: Blocking, breaking, security
   - ⚠️ HIGH: Important features, major bugs
   - 🟢 COMPLETED: Successfully finished tasks

4. **Date Your Changes**
   ```markdown
   ## 🕒 RECENT ACTIVITY (October 19, 2025)
   
   ### ✅ Fixed Issue XYZ
   **Status**: ✅ COMPLETE
   ```

### For AI Assistant

1. **Check Status Daily**
   - Run status check at start of work session
   - Aggregate before major work begins

2. **Update After Every Change**
   - Mark files as UPDATED after edits
   - Aggregate frequently during active work

3. **Weekly Full Refresh**
   - Run full refresh every Monday
   - Ensures no drift in status tracking

4. **Archive Old Content**
   - Mark deprecated files as ARCHIVED
   - Keeps aggregation fast and relevant

---

## 📊 MONITORING & MAINTENANCE

### Daily Check

```bash
npm run check-status
# or
.\scripts\check-claude-status.ps1
```

### Daily Aggregation

```bash
npm run aggregate-status
# or trigger AI: "Aggregate changed claude.md files"
```

### Weekly Full Refresh

```bash
npm run refresh-status
# or trigger AI: "Force full claude.md refresh"
```

---

## 🔧 NPM SCRIPTS

Add to `package.json`:

```json
{
  "scripts": {
    "check-status": "pwsh -ExecutionPolicy Bypass -File ./scripts/check-claude-status.ps1",
    "mark-updated": "pwsh -ExecutionPolicy Bypass -File ./scripts/mark-claude-updated.ps1",
    "init-markers": "pwsh -ExecutionPolicy Bypass -File ./scripts/initialize-claude-markers.ps1"
  }
}
```

**Usage**:
```bash
npm run check-status
npm run mark-updated -- -FilePath "./components/wb-input/claude.md"
npm run init-markers
```

---

## 🚀 INITIALIZATION STEPS

### First Time Setup

1. **Create Scripts Directory**
   ```bash
   mkdir scripts
   ```

2. **Create PowerShell Scripts**
   - Copy check-claude-status.ps1
   - Copy mark-claude-updated.ps1
   - Copy initialize-claude-markers.ps1

3. **Initialize All Existing Files**
   ```bash
   npm run init-markers
   ```

4. **Run First Check**
   ```bash
   npm run check-status
   ```

5. **Do Full Aggregation**
   - Say to AI: "Force full claude.md refresh"

6. **Verify currentstatus.md**
   - Check that all content is present
   - Verify all priorities are correct

---

## 📝 EXAMPLE CLAUDE.MD FILE

```markdown
<!-- STATUS: READ -->
# ./components/wb-input/claude.md - WB Input Component Development Log

## 🕒 RECENT ACTIVITY (October 19, 2025)

### ✅ Fixed Missing Configuration File
**Status**: ✅ COMPLETE
**Priority**: MEDIUM
**Date**: October 19, 2025

**Problem**: Component was loading wb-input.json but file didn't exist

**Solution**: 
- Created wb-input.json with proper schema
- Updated config loading code
- Tested with various configurations

**Files Changed**:
- `/components/wb-input/wb-input.json` (NEW)
- `/components/wb-input/wb-input.js` (line 213-220)

**Impact**: Component now uses proper configuration instead of fallback

---

## 🔴 OUTSTANDING ISSUES

### Issue: Deprecated Utils Path
**Status**: 🔴 NOT STARTED
**Priority**: LOW
**Severity**: LOW

**Description**: Loading `../wb-component-utils.js` but actual path is `../component-utils.js`

**Solution**: Update path in wb-input.js line 200

**File**: `/components/wb-input/wb-input.js` line 200

---

[Rest of claude.md content...]
```

---

## ❓ FAQ

### Q: What if I forget to mark a file as UPDATED?
**A**: Run a full refresh weekly to catch any missed updates.

### Q: Can I mark multiple files at once?
**A**: Yes, create a script or use PowerShell foreach loop.

### Q: What if a file has no marker?
**A**: The check script will flag it. Add marker manually or run init script.

### Q: Should I mark trivial changes as UPDATED?
**A**: Only mark if the change affects currentstatus.md (tasks, issues, priorities).

### Q: How do I archive old component files?
**A**: Change marker to `<!-- STATUS: ARCHIVED -->` at top of file.

### Q: Can I undo an aggregation?
**A**: Yes, use git to revert currentstatus.md and change file markers back to UPDATED.

---

## 🎓 SUMMARY

This system provides:
- ✅ **Efficient** aggregation (only read changed files)
- ✅ **Accurate** status tracking (always current)
- ✅ **Simple** marker system (one line at top)
- ✅ **Override** capability (force full refresh)
- ✅ **Automated** scripts (PowerShell + npm)
- ✅ **Clear** workflow (check → aggregate → mark)

**Result**: currentstatus.md is ALWAYS accurate and up-to-date! 🎯

---

*Document Created: October 19, 2025*  
*Location: `/docs/howto/ClaudeMdChangeDetection.md`*  
*Version: 1.0*
