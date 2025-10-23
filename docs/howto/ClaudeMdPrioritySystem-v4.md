# Claude.md Priority-Based Filename System v4.0

**ENHANCED DESIGN** - Priority levels with emoji in filename!

**Format**: `claude.🔴.md`, `claude.🟡.md`, `claude.✅.md`  
**Created**: October 19, 2025  
**Location**: `/docs/howto/ClaudeMdPrioritySystem-v4.md`

---

## 🎯 THE PRIORITY SYSTEM

### Filename Format with Priority Emoji

**Pattern**: `claude.<EMOJI>.md`

| Priority | Filename | Meaning | Action |
|----------|----------|---------|--------|
| **CRITICAL** | `claude.🔴.md` | 🔴 Critical/blocking issues | **READ FIRST** |
| **HIGH** | `claude.🟡.md` | 🟡 Important updates/work | **READ SOON** |
| **CURRENT** | `claude.✅.md` | ✅ Up-to-date, no issues | **SKIP** |
| **NEW** | `claude.🆕.md` | 🆕 New file, never read | **READ** |
| **ARCHIVED** | `claude.⚫.md` | ⚫ Archived/deprecated | **SKIP** |

---

## 🎨 WHY THIS IS BRILLIANT

### Visual Priority at a Glance

**In File Explorer**:
```
components/wb-input/
  ├── claude.🔴.md        ← CRITICAL! Red = urgent
  ├── wb-input.css
  ├── wb-input.js
  └── wb-input.md

components/wb-button/
  ├── claude.🟡.md        ← Important, needs attention
  ├── wb-button.css
  └── wb-button.js

components/wb-card/
  ├── claude.✅.md        ← All good, skip
  ├── wb-card.css
  └── wb-card.js
```

**Instant Visual Feedback**:
- 🔴 Red = "Oh no, critical!"
- 🟡 Yellow = "Needs work soon"
- ✅ Green = "All good!"

---

## 📋 PRIORITY LEVELS EXPLAINED

### 🔴 CRITICAL (`claude.🔴.md`)

**When to Use**:
- Blocking bugs that prevent functionality
- Security vulnerabilities
- System is broken/unusable
- Critical errors in production
- Immediate attention required

**Keywords That Trigger**:
- `CRITICAL`
- `BLOCKER`
- `BROKEN`
- `URGENT`
- `SECURITY`
- `ERROR`
- `FAILED`
- `NOT WORKING`

**Example Issues**:
- "Testing infrastructure completely broken"
- "Component crashes on load"
- "Security vulnerability found"
- "Build system not working"

---

### 🟡 HIGH (`claude.🟡.md`)

**When to Use**:
- Important features incomplete
- High priority bugs (non-blocking)
- Missing documentation
- Performance issues
- TODO items that matter

**Keywords That Trigger**:
- `TODO`
- `FIXME`
- `HIGH PRIORITY`
- `NEEDS FIX`
- `IN PROGRESS`
- `NOT STARTED`
- `BUG` (non-critical)
- `WARNING`

**Example Issues**:
- "Component missing key feature"
- "Documentation incomplete"
- "Performance could be better"
- "TODO: Implement validation"

---

### ✅ CURRENT (`claude.✅.md`)

**When to Use**:
- Everything working as expected
- No open issues or TODOs
- Documentation complete
- Tests passing
- Ready for production

**Characteristics**:
- No critical keywords
- No blocking issues
- Component stable
- All features implemented

---

### 🆕 NEW (`claude.🆕.md`)

**When to Use**:
- Brand new component created
- Never been aggregated before
- Fresh file needs first-time reading

**Auto-assigned**:
- When you create a new component
- AI hasn't read it yet

---

### ⚫ ARCHIVED (`claude.⚫.md`)

**When to Use**:
- Old/deprecated components
- Legacy code no longer in use
- Historical reference only
- Don't aggregate anymore

---

## 🔍 SMART DETECTION SCRIPT

### Three-Tier Detection

**File**: `/scripts/detect-priority-levels.ps1`

```powershell
# Scan all claude files and assign priority levels based on content
$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Analyzing claude files for priority levels...`n" -ForegroundColor Cyan

# Priority definitions
$priorities = @{
    CRITICAL = @{
        Emoji = "🔴"
        Keywords = @(
            "CRITICAL", "BLOCKER", "BROKEN", "URGENT", "SECURITY",
            "ERROR", "FAILED", "NOT WORKING", "CRASH", "DOWN",
            "BLOCKS", "BLOCKING", "EMERGENCY"
        )
    }
    HIGH = @{
        Emoji = "🟡"
        Keywords = @(
            "TODO", "FIXME", "HIGH PRIORITY", "NEEDS FIX", "IN PROGRESS",
            "NOT STARTED", "BUG", "WARNING", "⚠️", "INCOMPLETE",
            "MISSING", "REQUIRED"
        )
    }
    CURRENT = @{
        Emoji = "✅"
        Keywords = @()  # Default if no issues found
    }
}

# Find all claude.*.md files (after initial migration)
$files = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object {
    $_.Name -match "^claude\..*\.md$" -or $_.Name -eq "claude.md"
}

Write-Host "Found $($files.Count) claude files to analyze`n" -ForegroundColor White

$results = @{
    Critical = @()
    High = @()
    Current = @()
    Total = 0
}

foreach ($file in $files) {
    $results.Total++
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) {
        $results.Current += $file
        continue
    }
    
    # Check for CRITICAL issues first
    $criticalCount = 0
    foreach ($keyword in $priorities.CRITICAL.Keywords) {
        if ($content -match $keyword) {
            $criticalCount++
        }
    }
    
    if ($criticalCount -gt 0) {
        $results.Critical += @{
            File = $file
            Count = $criticalCount
            Priority = "CRITICAL"
        }
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "🔴 CRITICAL: $relativePath ($criticalCount issues)" -ForegroundColor Red
        continue
    }
    
    # Check for HIGH priority issues
    $highCount = 0
    foreach ($keyword in $priorities.HIGH.Keywords) {
        if ($content -match $keyword) {
            $highCount++
        }
    }
    
    if ($highCount -gt 0) {
        $results.High += @{
            File = $file
            Count = $highCount
            Priority = "HIGH"
        }
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "🟡 HIGH: $relativePath ($highCount issues)" -ForegroundColor Yellow
        continue
    }
    
    # Default to CURRENT (no issues found)
    $results.Current += $file
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Priority Analysis Results:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  📁 Total Files: $($results.Total)" -ForegroundColor White
Write-Host "  🔴 CRITICAL: $($results.Critical.Count) files" -ForegroundColor Red
Write-Host "  🟡 HIGH: $($results.High.Count) files" -ForegroundColor Yellow
Write-Host "  ✅ CURRENT: $($results.Current.Count) files" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Ask for confirmation
if ($results.Critical.Count -gt 0 -or $results.High.Count -gt 0) {
    Write-Host "`n🎯 Rename files with priority emoji? (y/n): " -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    
    if ($confirm -eq "y") {
        Write-Host "`n🔄 Renaming files with priority levels...`n" -ForegroundColor Cyan
        $renamed = 0
        
        # Rename CRITICAL files
        foreach ($item in $results.Critical) {
            $directory = $item.File.DirectoryName
            $newPath = Join-Path $directory "claude.🔴.md"
            
            if (Test-Path $newPath) {
                Write-Host "  ⚠️ Exists: claude.🔴.md in $directory" -ForegroundColor Yellow
                continue
            }
            
            try {
                Rename-Item -Path $item.File.FullName -NewName "claude.🔴.md" -ErrorAction Stop
                $renamed++
                $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
                Write-Host "  🔴 $relativePath" -ForegroundColor Red
            }
            catch {
                Write-Host "  ❌ Failed: $($item.File.FullName)" -ForegroundColor Red
            }
        }
        
        # Rename HIGH priority files
        foreach ($item in $results.High) {
            $directory = $item.File.DirectoryName
            $newPath = Join-Path $directory "claude.🟡.md"
            
            if (Test-Path $newPath) {
                Write-Host "  ⚠️ Exists: claude.🟡.md in $directory" -ForegroundColor Yellow
                continue
            }
            
            try {
                Rename-Item -Path $item.File.FullName -NewName "claude.🟡.md" -ErrorAction Stop
                $renamed++
                $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
                Write-Host "  🟡 $relativePath" -ForegroundColor Yellow
            }
            catch {
                Write-Host "  ❌ Failed: $($item.File.FullName)" -ForegroundColor Red
            }
        }
        
        # Rename CURRENT files
        foreach ($file in $results.Current) {
            $directory = $file.DirectoryName
            $newPath = Join-Path $directory "claude.✅.md"
            
            if (Test-Path $newPath) {
                continue
            }
            
            # Only rename if it's claude.md or claude.OK.md
            if ($file.Name -eq "claude.md" -or $file.Name -eq "claude.OK.md") {
                try {
                    Rename-Item -Path $file.FullName -NewName "claude.✅.md" -ErrorAction Stop
                    $renamed++
                }
                catch {
                    # Silently continue
                }
            }
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "✅ Renamed $renamed files with priority emoji" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        
        Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
        Write-Host "   1. npm run check-status    (verify priorities)" -ForegroundColor White
        Write-Host "   2. Tell AI to aggregate    (read 🔴 and 🟡 files)" -ForegroundColor White
        Write-Host ""
    }
}
else {
    Write-Host "`n✅ All files look good! No priority issues found.`n" -ForegroundColor Green
}

# Save results
$saveResults = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Total = $results.Total
    Critical = $results.Critical | ForEach-Object {
        @{
            Path = $_.File.FullName.Replace($projectRoot, "")
            Count = $_.Count
        }
    }
    High = $results.High | ForEach-Object {
        @{
            Path = $_.File.FullName.Replace($projectRoot, "")
            Count = $_.Count
        }
    }
    CurrentCount = $results.Current.Count
}

$resultsPath = Join-Path $projectRoot "scripts\priority-analysis.json"
$saveResults | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts/priority-analysis.json" -ForegroundColor Green
Write-Host ""
```

---

## 🚀 COMPLETE PRIORITY-BASED MIGRATION

### Step 1: Backup
```bash
git add .
git commit -m "Before priority-based migration v4.0"
```

### Step 2: Analyze Priority Levels
```bash
npm run detect-priority
```

**What It Does**:
1. Scans all claude files
2. Checks for CRITICAL keywords (BLOCKER, BROKEN, CRITICAL, etc.)
3. Checks for HIGH priority keywords (TODO, FIXME, BUG, etc.)
4. Assigns priority levels
5. Renames files with emoji

**Output Example**:
```
🔍 Analyzing claude files for priority levels...

🔴 CRITICAL: components/wb-nav/claude.md (5 issues)
🔴 CRITICAL: CLAUDE.md (3 issues)
🟡 HIGH: components/wb-input/claude.md (7 issues)
🟡 HIGH: components/wb-button/claude.md (2 issues)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Priority Analysis Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁 Total Files: 96
  🔴 CRITICAL: 6 files
  🟡 HIGH: 15 files
  ✅ CURRENT: 75 files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Rename files with priority emoji? (y/n): y

🔄 Renaming files with priority levels...

  🔴 components/wb-nav/claude.🔴.md
  🔴 CLAUDE.🔴.md
  🟡 components/wb-input/claude.🟡.md
  ... (18 more)

✅ Renamed 96 files with priority emoji
```

### Step 3: Verify
```bash
npm run check-status
```

**Expected Output**:
```
📊 Claude.md Status Check (Priority-Based):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 CRITICAL: 6 files (claude.🔴.md)
🟡 HIGH: 15 files (claude.🟡.md)
✅ CURRENT: 75 files (claude.✅.md)
⚫ ARCHIVED: 0 files (claude.⚫.md)

⚡ Scan completed in 250 milliseconds!

🎯 Next Action: Read 6 CRITICAL and 15 HIGH priority files
```

### Step 4: AI Aggregation by Priority

Tell me: **"Aggregate critical claude.md files first"**

I'll:
1. Read all `claude.🔴.md` files FIRST (critical!)
2. Then read `claude.🟡.md` files (high priority)
3. Skip `claude.✅.md` files (current, no issues)
4. Update currentstatus.md with proper priorities

---

## 📊 SORTING AND FILTERING

### In File Explorer

Files naturally sort by emoji:
```
components/wb-input/
  ├── claude.🔴.md        ← Sorts first (critical!)
  ├── wb-input.css
  └── wb-input.js

components/wb-button/
  ├── claude.🟡.md        ← Sorts second (high)
  ├── wb-button.css
  └── wb-button.js

components/wb-card/
  ├── claude.✅.md        ← Sorts last (all good)
  ├── wb-card.css
  └── wb-card.js
```

### Search by Priority

**Find all critical issues**:
```powershell
Get-ChildItem -Path . -Filter "claude.🔴.md" -Recurse
```

**Find all high priority**:
```powershell
Get-ChildItem -Path . -Filter "claude.🟡.md" -Recurse
```

---

## 🎯 AI WORKFLOW WITH PRIORITIES

### Priority-Based Aggregation

**AI can aggregate by priority**:

1. **"Aggregate critical files"** → Reads only 🔴 files
2. **"Aggregate high priority files"** → Reads only 🟡 files
3. **"Aggregate all changed files"** → Reads 🔴 + 🟡 files
4. **"Check if any critical issues"** → Scans for 🔴 files

### Automatic Prioritization in currentstatus.md

When aggregating, I'll organize by priority:
```markdown
## 🔴 CRITICAL PRIORITY - DO THESE FIRST

### 1. Testing Infrastructure Broken
**File**: `/CLAUDE.🔴.md`
**Severity**: CRITICAL
...

## 🟡 HIGH PRIORITY - DO AFTER CRITICAL

### 2. wb-input Missing Config
**File**: `/components/wb-input/claude.🟡.md`
**Severity**: HIGH
...

## ✅ COMPLETED TASKS

### 3. wb-card Refactored
**File**: `/components/wb-card/claude.✅.md`
**Status**: COMPLETE
...
```

---

## 📋 UPDATED STATUS CODES REFERENCE

### For claude.index.md

```markdown
# Claude.md Priority-Based Status System

## Priority Levels (Emoji in Filename)

| Emoji | Filename | Priority | Meaning | Action |
|-------|----------|----------|---------|--------|
| 🔴 | `claude.🔴.md` | CRITICAL | Blocking issues, broken functionality | **READ IMMEDIATELY** |
| 🟡 | `claude.🟡.md` | HIGH | Important work, TODOs, bugs | **READ SOON** |
| ✅ | `claude.✅.md` | CURRENT | Up-to-date, working | **SKIP** |
| 🆕 | `claude.🆕.md` | NEW | New file, unread | **READ** |
| ⚫ | `claude.⚫.md` | ARCHIVED | Deprecated | **SKIP** |

## Visual Priority

In your file explorer, you'll instantly see:
- 🔴 Red files = URGENT! Fix now!
- 🟡 Yellow files = Important, do soon
- ✅ Green files = All good, relax

## Example

```
/components/
├── wb-nav/
│   └── claude.🔴.md        ← OH NO! Critical issue!
├── wb-input/
│   └── claude.🟡.md        ← Needs attention
└── wb-card/
    └── claude.✅.md        ← All good!
```
```

---

## 🎉 ADVANTAGES OF PRIORITY SYSTEM

### Visual vs Text Codes

| Approach | Visibility | Priority Clear | Natural Sort |
|----------|------------|----------------|--------------|
| `claude.OK.md` | ⚠️ Meh | ❌ No priority | ✅ Yes |
| `claude.🔴.md` | ✅ **INSTANT!** | ✅ **OBVIOUS!** | ✅ **Perfect!** |

### Real-World Benefits

1. ✅ **Instant visual priority** - Red = urgent!
2. ✅ **Natural sorting** - Critical files appear first
3. ✅ **AI can filter** - "Read only critical files"
4. ✅ **Team communication** - Everyone sees urgency
5. ✅ **No confusion** - Emoji meaning is universal

---

## 📝 SUMMARY

### The Priority System

**Format**: `claude.<EMOJI>.md`

**Levels**:
- 🔴 CRITICAL - Blocking, broken, urgent
- 🟡 HIGH - Important, TODOs, bugs
- ✅ CURRENT - Working, no issues
- 🆕 NEW - Unread file
- ⚫ ARCHIVED - Deprecated

### Migration

1. Run `npm run detect-priority`
2. Script analyzes all files
3. Assigns priority based on keywords
4. Renames with emoji
5. Done! Visual priorities everywhere!

---

**This is BRILLIANT!** 🎯  
Emoji in filenames = instant visual priority system!

---

*Priority-Based System v4.0*  
*Created: October 19, 2025*  
*Location: `/docs/howto/ClaudeMdPrioritySystem-v4.md`*
