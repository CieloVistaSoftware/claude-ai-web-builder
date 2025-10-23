# Smart Migration Guide - Detect Unfinished Work

**Strategy**: Initialize to OK, then mark files with unfinished work as UPD  
**Date**: October 19, 2025

---

## 🎯 THE PROBLEM

Not all claude.md files should be marked as `claude.OK.md`!

Some files have:
- 🔴 Unfinished work
- 🔴 Open issues  
- 🔴 TODO items
- 🔴 Critical bugs
- 🔴 Incomplete features

**These should be marked as `claude.UPD.md` so AI reads them!**

---

## ✅ SMART MIGRATION STRATEGY

### Two-Phase Approach

**Phase 1**: Initialize all to `claude.OK.md` (baseline)  
**Phase 2**: Scan for unfinished work and mark as `claude.UPD.md`

---

## 📋 PHASE 1: BASELINE INITIALIZATION

### Step 1: Initial Migration
```bash
npm run init-markers
```

This renames all files to `claude.OK.md` as a starting point.

---

## 🔍 PHASE 2: DETECT UNFINISHED WORK

### Step 2: Scan for Keywords

Create a script to find files with unfinished work indicators:

**File**: `/scripts/detect-unfinished-work.ps1`

```powershell
# Scan all claude.OK.md files for unfinished work indicators
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Scanning for unfinished work in claude.OK.md files...`n" -ForegroundColor Cyan

# Keywords that indicate unfinished work
$keywords = @(
    "TODO",
    "FIXME", 
    "BUG",
    "BROKEN",
    "NOT WORKING",
    "NEEDS FIX",
    "INCOMPLETE",
    "IN PROGRESS",
    "⚠️",
    "❌",
    "🔴",
    "NOT STARTED",
    "CRITICAL",
    "HIGH PRIORITY",
    "URGENT",
    "Status.*NOT STARTED",
    "Status.*IN PROGRESS",
    "Status.*🔴"
)

# Find all claude.OK.md files
$files = Get-ChildItem -Path $projectRoot -Filter "claude.OK.md" -Recurse -File

$needsUpdate = @()
$stats = @{
    Scanned = 0
    HasIssues = 0
    IsOK = 0
}

foreach ($file in $files) {
    $stats.Scanned++
    $content = Get-Content $file.FullName -Raw
    $foundKeywords = @()
    
    foreach ($keyword in $keywords) {
        if ($content -match $keyword) {
            $foundKeywords += $keyword
        }
    }
    
    if ($foundKeywords.Count -gt 0) {
        $stats.HasIssues++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        
        $needsUpdate += @{
            Path = $file.FullName
            RelativePath = $relativePath
            Keywords = $foundKeywords
        }
        
        Write-Host "🟡 HAS ISSUES: $relativePath" -ForegroundColor Yellow
        Write-Host "   Found: $($foundKeywords -join ', ')" -ForegroundColor Gray
    }
    else {
        $stats.IsOK++
    }
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Scan Results:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  📁 Scanned: $($stats.Scanned) files" -ForegroundColor White
Write-Host "  🟡 Has Issues: $($stats.HasIssues) files (should be UPD)" -ForegroundColor Yellow
Write-Host "  ✅ Looks OK: $($stats.IsOK) files" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($needsUpdate.Count -gt 0) {
    Write-Host "`n🎯 Action Required:" -ForegroundColor Yellow
    Write-Host "   $($needsUpdate.Count) files should be marked as UPD`n" -ForegroundColor White
    
    $confirm = Read-Host "Automatically rename these files to claude.UPD.md? (y/n)"
    
    if ($confirm -eq "y") {
        Write-Host "`n🔄 Renaming files to claude.UPD.md...`n" -ForegroundColor Cyan
        $renamed = 0
        
        foreach ($item in $needsUpdate) {
            $directory = Split-Path $item.Path -Parent
            $newPath = Join-Path $directory "claude.UPD.md"
            
            try {
                Rename-Item -Path $item.Path -NewName "claude.UPD.md" -ErrorAction Stop
                $renamed++
                Write-Host "  ✅ $($item.RelativePath)" -ForegroundColor Green
            }
            catch {
                Write-Host "  ❌ Failed: $($item.RelativePath)" -ForegroundColor Red
            }
        }
        
        Write-Host "`n✅ Renamed $renamed files to claude.UPD.md" -ForegroundColor Green
        Write-Host "   Run 'npm run check-status' to verify`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "`n⏭️ Skipped automatic renaming" -ForegroundColor Yellow
        Write-Host "   Files saved to: scripts\unfinished-work-files.json`n" -ForegroundColor Gray
    }
}
else {
    Write-Host "`n✅ All files look complete! No UPD markers needed.`n" -ForegroundColor Green
}

# Save results
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Scanned = $stats.Scanned
    HasIssues = $stats.HasIssues
    IsOK = $stats.IsOK
    FilesNeedingUpdate = $needsUpdate
}

$resultsPath = Join-Path $projectRoot "scripts\unfinished-work-files.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts\unfinished-work-files.json" -ForegroundColor Green
Write-Host ""
```

---

## 🚀 COMPLETE MIGRATION PROCESS

### Step 1: Backup
```bash
git add .
git commit -m "Before smart migration to v3.0"
```

### Step 2: Initialize All to OK
```bash
npm run init-markers
```

Result: All 96 files → `claude.OK.md`

### Step 3: Detect Unfinished Work
```bash
pwsh -ExecutionPolicy Bypass -File ./scripts/detect-unfinished-work.ps1
```

**This will**:
1. Scan all `claude.OK.md` files
2. Look for keywords like TODO, FIXME, BUG, etc.
3. Show which files have unfinished work
4. Ask if you want to auto-rename them to `claude.UPD.md`

**Output Example**:
```
🔍 Scanning for unfinished work in claude.OK.md files...

🟡 HAS ISSUES: components/wb-input/claude.OK.md
   Found: TODO, FIXME, NOT STARTED

🟡 HAS ISSUES: components/wb-nav/claude.OK.md
   Found: CRITICAL, BROKEN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Scan Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁 Scanned: 96 files
  🟡 Has Issues: 15 files (should be UPD)
  ✅ Looks OK: 81 files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Action Required:
   15 files should be marked as UPD

Automatically rename these files to claude.UPD.md? (y/n): y

🔄 Renaming files to claude.UPD.md...

  ✅ components/wb-input/claude.UPD.md
  ✅ components/wb-nav/claude.UPD.md
  ... (13 more)

✅ Renamed 15 files to claude.UPD.md
   Run 'npm run check-status' to verify
```

### Step 4: Verify
```bash
npm run check-status
```

**Expected Output**:
```
📊 Claude.md Status Check:
🔴 NEW: 0 files
🟡 UPDATED: 15 files (claude.UPD.md)
✅ CURRENT: 81 files (claude.OK.md)
⚫ ARCHIVED: 0 files

⚡ Scan completed in 250 milliseconds!

🎯 Next Action: Aggregate 15 changed files
```

### Step 5: First Aggregation
Tell AI: **"Aggregate changed claude.md files"**

AI will:
1. Read those 15 UPD files
2. Extract all TODO, FIXME, issues
3. Update `/docs/status/currentstatus.md`
4. Mark them appropriately based on content

---

## 🎯 ALTERNATIVE: MANUAL REVIEW

If you want to manually decide which files need updating:

### Step 1: Initialize All
```bash
npm run init-markers
```

### Step 2: Review Key Files

**Check these critical areas first**:
```bash
# Components with known issues
components/wb-input/claude.OK.md
components/wb-nav/claude.OK.md
components/wb-button/claude.OK.md
components/wb-demo/claude.OK.md
components/wb-control-panel/claude.OK.md

# Root level status
CLAUDE.md  (if exists as claude.OK.md now)

# Test files
tests/claude.OK.md
```

### Step 3: Manually Mark Files

If a file has unfinished work:
```bash
npm run mark-updated -- -Path "components/wb-input/claude.OK.md"
```

Or just rename in file explorer:
```
claude.OK.md → claude.UPD.md
```

---

## 📝 KEYWORDS THAT INDICATE UNFINISHED WORK

The detection script looks for:

### Status Indicators
- `TODO`
- `FIXME`
- `IN PROGRESS`
- `NOT STARTED`
- `INCOMPLETE`

### Priority Markers
- `CRITICAL`
- `HIGH PRIORITY`
- `URGENT`
- `BLOCKER`

### Problem Indicators
- `BUG`
- `BROKEN`
- `NOT WORKING`
- `NEEDS FIX`
- `ISSUE`

### Emoji Markers
- `⚠️` (warning)
- `❌` (error/problem)
- `🔴` (critical/red)
- `⏸️` (paused/blocked)

### Status Patterns
- `Status: NOT STARTED`
- `Status: IN PROGRESS`
- `Status: 🔴`
- `Priority: CRITICAL`

---

## 🔧 ADD TO package.json

```json
{
  "scripts": {
    "detect-unfinished": "pwsh -ExecutionPolicy Bypass -File ./scripts/detect-unfinished-work.ps1"
  }
}
```

Then you can run:
```bash
npm run detect-unfinished
```

---

## 📊 EXPECTED RESULTS

Based on the currentstatus.md we created earlier, we know:

### Likely UPD Files (Estimate ~15-20 files):
- Components with critical issues (wb-input, wb-nav, wb-demo, etc.)
- Root CLAUDE.md (has critical blockers)
- Test files (testing infrastructure broken)
- Files with TODO items

### Likely OK Files (Estimate ~75-80 files):
- Components already refactored and working
- Archive/prototype files
- Completed component docs

---

## ✅ RECOMMENDED MIGRATION WORKFLOW

### Complete Process:

1. **Backup**: `git commit -m "Before migration"`

2. **Initialize**: `npm run init-markers`
   - Result: All → `claude.OK.md`

3. **Detect Issues**: `npm run detect-unfinished`
   - Scans for unfinished work
   - Auto-marks files as `claude.UPD.md`

4. **Verify**: `npm run check-status`
   - Should show ~15-20 UPD files
   - Should show ~75-80 OK files

5. **First Aggregation**: Tell AI "Aggregate changed claude.md files"
   - AI reads all UPD files
   - Updates currentstatus.md
   - Marks truly finished ones as OK

6. **Done**: System active with accurate status!

---

## 🎉 SUMMARY

### Smart Migration = Two Phases

**Phase 1**: Initialize all to OK (baseline)  
**Phase 2**: Detect unfinished work and mark as UPD

### Result

- ✅ Files with no issues → `claude.OK.md` (skip reading)
- 🟡 Files with TODOs/issues → `claude.UPD.md` (AI reads them)
- 🎯 Accurate status from day one!

---

**Ready to do smart migration?**

```bash
# Step 1: Initialize
npm run init-markers

# Step 2: Detect unfinished work (create script first)
npm run detect-unfinished

# Step 3: Verify
npm run check-status
```

---

*Smart Migration Guide*  
*Created: October 19, 2025*  
*Location: `/docs/setup/SMART-MIGRATION-GUIDE.md`*
