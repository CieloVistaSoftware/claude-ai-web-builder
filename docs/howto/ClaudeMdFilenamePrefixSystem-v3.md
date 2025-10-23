# Claude.md Filename Status System v3.0

**IMPROVED DESIGN** - Status code comes AFTER "claude"

**Created**: October 19, 2025  
**Location**: `/docs/howto/ClaudeMdFilenamePrefixSystem-v3.md`  
**Purpose**: Better filename format with status after "claude"

---

## 🎯 THE IMPROVED SYSTEM

### Status Filename Format

**Pattern**: `claude.<STATUS>.md`

Every claude.md file should be named like this:

| Filename | Status | Action | Icon |
|----------|--------|--------|------|
| `claude.NEW.md` | New file, never aggregated | READ ME | 🔴 |
| `claude.UPD.md` | Updated, has changes | READ ME | 🟡 |
| `claude.OK.md` | Current, already read | SKIP | ✅ |
| `claude.ARC.md` | Archived, old/deprecated | SKIP | ⚫ |

### Why This Is Better

✅ **"claude" stays first** - Easier to find in file lists  
✅ **Groups all claude files** - Sorted alphabetically together  
✅ **Status is clear** - `.OK.` or `.UPD.` easy to see  
✅ **Consistent with naming** - Follows common patterns like `.test.js`, `.spec.js`  
✅ **Easy to type** - Natural filename structure  

---

## 📋 STATUS CODE REFERENCE

### Status Codes (Use in claude.index.md)

Create a `claude.index.md` file in the root that explains all codes:

```markdown
# Claude.md Status Codes Reference

## Status Codes

- **NEW** - New file, never aggregated into currentstatus.md
- **UPD** - Updated file, has new content to aggregate
- **OK** - Current file, already read and up-to-date
- **ARC** - Archived file, old/deprecated content

## Filename Format

All claude.md files follow this pattern:
`claude.<STATUS>.md`

Examples:
- claude.NEW.md - Brand new file
- claude.UPD.md - Has updates
- claude.OK.md - Current, no changes
- claude.ARC.md - Archived

## Status Workflow

1. Create new file: `claude.NEW.md`
2. After first read: AI renames to `claude.OK.md`
3. When you edit: Rename to `claude.UPD.md`
4. After aggregation: AI renames to `claude.OK.md`
5. To archive: Rename to `claude.ARC.md`

## Quick Commands

Check status:
```bash
npm run check-status
```

Mark as updated:
```bash
npm run mark-updated -- -Path "components/wb-input/claude.OK.md"
```

Initialize all:
```bash
npm run init-markers
```
```

---

## 🔄 WORKFLOW

### Step 1: Check for Updates (Fast!)

```bash
npm run check-status
```

Scans for files matching `claude.*.md` pattern and checks the status code.

**Output**:
```
📊 Claude.md Status Check:
🔴 NEW: 2 files (claude.NEW.md)
🟡 UPDATED: 3 files (claude.UPD.md)
✅ CURRENT: 91 files (claude.OK.md)
⚫ ARCHIVED: 0 files (claude.ARC.md)

⚡ Scan completed in 250 milliseconds!
```

---

### Step 2: Edit a File

When you edit any claude file, rename it:

```
Before: components/wb-input/claude.OK.md
After:  components/wb-input/claude.UPD.md
```

**Methods**:
1. Manual rename in file explorer
2. PowerShell script: `npm run mark-updated -- -Path "path/to/file"`
3. Tell AI: "Mark wb-input claude.md as updated"

---

### Step 3: Aggregate Changes

**Command**: "Aggregate changed claude.md files"

AI will:
1. Find all `claude.NEW.md` and `claude.UPD.md` files
2. Read only those files
3. Update currentstatus.md
4. Rename processed files to `claude.OK.md`

---

## 🛠️ POWERSHELL SCRIPTS

### Script 1: Check Status

File: `/scripts/check-claude-status-v3.ps1`

```powershell
# Fast check using filename pattern claude.*.md
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Scanning for claude.*.md files..." -ForegroundColor Cyan

# Find all files matching pattern claude.*.md
$allFiles = Get-ChildItem -Path $projectRoot -Filter "claude.*.md" -Recurse -File

$stats = @{
    NEW = @()
    UPD = @()
    OK = @()
    ARC = @()
    OTHER = @()
}

foreach ($file in $allFiles) {
    $name = $file.Name
    
    if ($name -eq "claude.NEW.md") {
        $stats.NEW += $file.FullName
    }
    elseif ($name -eq "claude.UPD.md") {
        $stats.UPD += $file.FullName
    }
    elseif ($name -eq "claude.OK.md") {
        $stats.OK += $file.FullName
    }
    elseif ($name -eq "claude.ARC.md") {
        $stats.ARC += $file.FullName
    }
    else {
        $stats.OTHER += $file.FullName
    }
}

# Report
Write-Host "`n📊 Claude.md Status Check:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔴 NEW: $($stats.NEW.Count) files (claude.NEW.md)" -ForegroundColor Red
Write-Host "🟡 UPDATED: $($stats.UPD.Count) files (claude.UPD.md)" -ForegroundColor Yellow
Write-Host "✅ CURRENT: $($stats.OK.Count) files (claude.OK.md)" -ForegroundColor Green
Write-Host "⚫ ARCHIVED: $($stats.ARC.Count) files (claude.ARC.md)" -ForegroundColor Gray
Write-Host "⚠️ OTHER: $($stats.OTHER.Count) files (unexpected names)" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$actionNeeded = $stats.NEW.Count + $stats.UPD.Count

if ($actionNeeded -gt 0) {
    Write-Host "`n🎯 Next Action: Aggregate $actionNeeded changed files" -ForegroundColor Yellow
}
```

---

### Script 2: Mark as Updated

File: `/scripts/mark-claude-updated-v3.ps1`

```powershell
# Rename claude.OK.md to claude.UPD.md (or other status)
param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPD", "OK", "ARC")]
    [string]$Status = "UPD"
)

# Get directory and current filename
$directory = Split-Path $Path -Parent
$currentFile = Split-Path $Path -Leaf

# Build new filename
$newFile = "claude.$Status.md"
$newPath = Join-Path $directory $newFile

if (-not (Test-Path $Path)) {
    Write-Host "❌ File not found: $Path" -ForegroundColor Red
    exit 1
}

if ($currentFile -eq $newFile) {
    Write-Host "✅ File already has status: $Status" -ForegroundColor Green
    exit 0
}

Rename-Item -Path $Path -NewName $newFile -ErrorAction Stop
Write-Host "✅ Renamed to: $newFile" -ForegroundColor Green
```

---

### Script 3: Initialize All Files

File: `/scripts/initialize-claude-v3.ps1`

```powershell
# Initialize all claude.md files to claude.OK.md
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

# Find all files matching claude.md or CLAUDE.md
$allFiles = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object { 
    $_.Name -match "^claude\.md$" -or $_.Name -match "^CLAUDE\.md$"
}

$stats = @{
    Renamed = 0
    Skipped = 0
}

foreach ($file in $allFiles) {
    # Skip if already has status code
    if ($file.Name -match "^claude\.\w+\.md$") {
        $stats.Skipped++
        continue
    }
    
    $directory = $file.DirectoryName
    $newFile = "claude.OK.md"
    $newPath = Join-Path $directory $newFile
    
    if (Test-Path $newPath) {
        Write-Host "⚠️ Target exists: $newPath" -ForegroundColor Yellow
        continue
    }
    
    Rename-Item -Path $file.FullName -NewName $newFile -ErrorAction Stop
    $stats.Renamed++
    Write-Host "✅ Initialized: $newPath" -ForegroundColor Green
}

Write-Host "`n📊 Summary: $($stats.Renamed) renamed, $($stats.Skipped) skipped"
```

---

## 📂 EXAMPLE DIRECTORY STRUCTURE

### Before Initialization
```
/components/
├── wb-input/
│   └── claude.md              ⚠️ No status code
├── wb-button/
│   └── claude.md              ⚠️ No status code
└── wb-nav/
    └── CLAUDE.md              ⚠️ No status code
```

### After Initialization
```
/components/
├── wb-input/
│   └── claude.OK.md           ✅ Current
├── wb-button/
│   └── claude.OK.md           ✅ Current
└── wb-nav/
    └── claude.OK.md           ✅ Current (lowercase now)
```

### User Edits wb-input
```
/components/
├── wb-input/
│   └── claude.UPD.md          🟡 Marked as updated
├── wb-button/
│   └── claude.OK.md           ✅ Current
└── wb-nav/
    └── claude.OK.md           ✅ Current
```

### After AI Aggregation
```
/components/
├── wb-input/
│   └── claude.OK.md           ✅ Back to current
├── wb-button/
│   └── claude.OK.md           ✅ Current
└── wb-nav/
    └── claude.OK.md           ✅ Current
```

---

## 📋 BENEFITS OF v3 DESIGN

### Better File Organization

| Aspect | v2 (OK-claude.md) | v3 (claude.OK.md) | Winner |
|--------|-------------------|-------------------|---------|
| Grouping | Splits by status | Groups all claude.* | 🏆 v3 |
| Alphabetical | Split up | Together | 🏆 v3 |
| Clarity | Prefix unclear | Status clear | 🏆 v3 |
| Typing | Awkward | Natural | 🏆 v3 |
| Standards | Unusual | Common (.test.js, .spec.js) | 🏆 v3 |

### File Sorting

**v2 (prefix before):**
```
ARC-claude.md
NEW-claude.md
OK-claude.md
UPD-claude.md
other-file.md
```
Files scattered by status!

**v3 (status after):**
```
claude.ARC.md
claude.NEW.md
claude.OK.md
claude.UPD.md
other-file.md
```
All claude files grouped together! ✅

---

## 🎯 ADVANTAGES

1. ✅ **Groups all claude files** - Sorted alphabetically together
2. ✅ **"claude" stays first** - Easy to find
3. ✅ **Status is clear** - `.OK.` or `.UPD.` obvious
4. ✅ **Follows standards** - Like `.test.js`, `.spec.js` naming
5. ✅ **Natural to type** - `claude.OK.md` feels right
6. ✅ **Still super fast** - Same performance as v2

---

## 📄 CREATE claude.index.md

Put this file at `/claude.index.md` (project root):

```markdown
# Claude.md File Status System

## Purpose
This project uses a filename-based status system for all claude.md files.

## Filename Format
`claude.<STATUS>.md`

## Status Codes

| Code | Filename | Meaning | Action |
|------|----------|---------|--------|
| **NEW** | claude.NEW.md | New file, never read | 🔴 AI must read |
| **UPD** | claude.UPD.md | Updated content | 🟡 AI must read |
| **OK** | claude.OK.md | Current, no changes | ✅ Skip reading |
| **ARC** | claude.ARC.md | Archived/old | ⚫ Skip reading |

## How It Works

1. **Developer edits** a claude file
2. **Developer renames** `claude.OK.md` → `claude.UPD.md`
3. **Developer runs** `npm run check-status` (optional)
4. **Developer tells AI** "Aggregate changed claude.md files"
5. **AI reads** only NEW and UPD files
6. **AI updates** currentstatus.md
7. **AI renames** processed files to `claude.OK.md`

## Commands

### Check Status (Fast!)
```bash
npm run check-status
```

### Mark File as Updated
```bash
npm run mark-updated -- -Path "components/wb-input/claude.OK.md"
```

Or manually rename in file explorer:
`claude.OK.md` → `claude.UPD.md`

### Initialize All Files (First Time)
```bash
npm run init-markers
```

Renames all `claude.md` → `claude.OK.md`

## Workflow Example

### Day 1: Edit wb-input
```
1. Edit: components/wb-input/claude.OK.md
2. Rename: claude.OK.md → claude.UPD.md
3. Check: npm run check-status
4. Tell AI: "Aggregate changed claude.md files"
5. AI renames back: claude.UPD.md → claude.OK.md
```

### Result
✅ currentstatus.md updated with wb-input changes
✅ claude.OK.md marked as current
✅ System ready for next edit

## Benefits

- ⚡ **Super fast** - No file reading for status check
- 👁️ **Instantly visible** - See status in filename
- 🎯 **Simple** - Just rename the file
- 📁 **Groups files** - All claude.* files together
- 🚀 **Efficient** - Read only changed files

## File Locations

- Status scripts: `/scripts/check-claude-status-v3.ps1`
- Complete guide: `/docs/howto/ClaudeMdFilenamePrefixSystem-v3.md`
- Quick reference: `/docs/howto/ClaudeMdQuickRef-v3.md`

## Status Tracking

Master status file: `/docs/status/currentstatus.md`
Change log: `/docs/status/fixes.md`

---

*See /docs/howto/ for complete documentation*
```

---

## 🚀 IMPLEMENTATION

### NPM Scripts (Update package.json)

```json
{
  "scripts": {
    "check-status": "pwsh -ExecutionPolicy Bypass -File ./scripts/check-claude-status-v3.ps1",
    "mark-updated": "pwsh -ExecutionPolicy Bypass -File ./scripts/mark-claude-updated-v3.ps1",
    "init-markers": "pwsh -ExecutionPolicy Bypass -File ./scripts/initialize-claude-v3.ps1"
  }
}
```

---

## 📝 SUMMARY

### What Changed from v2

**v2**: `OK-claude.md` (status before)  
**v3**: `claude.OK.md` (status after) ✅

### Why v3 Is Better

1. All claude files grouped together alphabetically
2. "claude" stays at the front (easier to find)
3. Status code is clear (`.OK.`, `.UPD.`)
4. Follows common naming patterns (`.test.js`, `.spec.js`)
5. More natural and professional

### Result

✅ **Same speed** (still super fast!)  
✅ **Better organization** (files grouped)  
✅ **Clearer naming** (status obvious)  
✅ **More standard** (common pattern)  

---

*Version 3.0 - Status After "claude"*  
*Created: October 19, 2025*  
*Location: `/docs/howto/ClaudeMdFilenamePrefixSystem-v3.md`*
