# Batch Fix Script - Quick Start Guide

**Status**: ✅ READY TO RUN  
**Phase**: 1 (Critical Fixes)  
**Time to Complete**: ~5-10 minutes  

---

## WHAT THIS SCRIPT DOES

Automates **Phase 1** - the critical fixes that would take 4 hours manually:

✅ **Create 5 missing files** (30 seconds)
- wb-1rem/claude.md
- wb-chatbot/claude.md
- wb-color-organ/claude.md
- wb-css-loader/claude.md
- wb-grid/claude.md

✅ **Fix headers in 40 files** (3-5 minutes)
- Convert to standardized format: `# Component: [name]`
- Extract status and preserve it
- Add standardized lines

✅ **Convert all dates** (2-3 minutes)
- `Oct 6, 2025` → `October 6, 2025`
- `2025-10-06` → `October 6, 2025`
- `10/6/2025` → `October 6, 2025`
- All to: `MMMM dd, yyyy` format

---

## HOW TO RUN

### Step 1: Open PowerShell

```powershell
# Navigate to scripts folder
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts
```

### Step 2: Run in DRY RUN Mode FIRST (Safe - no changes)

```powershell
.\batch-fix-claude.ps1 -DryRun
```

This will:
- ✅ Show what would be changed
- ✅ NOT modify any files
- ✅ Generate a preview log

**Review the output carefully!** Make sure it looks right.

### Step 3: If Preview Looks Good, Apply Changes

```powershell
.\batch-fix-claude.ps1 -Force
```

This will:
- ✅ Apply all the changes
- ✅ Create missing files
- ✅ Fix headers
- ✅ Convert dates
- ✅ Generate a change log

---

## EXPECTED OUTPUT

### Dry Run Output
```
====================================================================
  CLAUDE.MD STANDARDIZATION - BATCH FIX (PHASE 1)
====================================================================

DRY RUN MODE: No files will be modified

PHASE 1A: Creating 5 missing claude.md files
---
  [DRY RUN] wb-1rem - Would create file
  [DRY RUN] wb-chatbot - Would create file
  [DRY RUN] wb-color-organ - Would create file
  [DRY RUN] wb-css-loader - Would create file
  [DRY RUN] wb-grid - Would create file
  → Created 0 files (DRY RUN)

PHASE 1B: Fixing headers in all claude.md files
---
  ✓ wb-base - Header already correct
  ✓ wb-button - Header fixed (Status: ✅ COMPLETE)
  ✓ wb-card - Header fixed (Status: 🟡 IN PROGRESS)
  [... more files ...]
  → Fixed 38 headers, skipped 5 (already correct)

PHASE 1C: Converting dates to standard format
---
  [DRY RUN] wb-button - Would convert dates
  [DRY RUN] wb-color-bar - Would convert dates
  [... more files ...]
  → Fixed 0 files (DRY RUN), skipped N (already correct)

====================================================================
  PHASE 1 COMPLETE!
====================================================================

Results:
  Files Created: 0
  Headers Fixed: 38
  Dates Converted: 0
  Total Changes: 38

DRY RUN: No files were actually modified.
Run without -DryRun to apply changes:
  .\batch-fix-claude.ps1 -Force
```

### Live Execution Output
```
====================================================================
  CLAUDE.MD STANDARDIZATION - BATCH FIX (PHASE 1)
====================================================================

PHASE 1A: Creating 5 missing claude.md files
---
  ✓ wb-1rem - CREATED
  ✓ wb-chatbot - CREATED
  ✓ wb-color-organ - CREATED
  ✓ wb-css-loader - CREATED
  ✓ wb-grid - CREATED
  → Created 5 files

PHASE 1B: Fixing headers in all claude.md files
---
  ✓ wb-base - Header already correct
  ✓ wb-button - Header fixed (Status: ✅ COMPLETE)
  ✓ wb-card - Header fixed (Status: 🟡 IN PROGRESS)
  [... more files ...]
  → Fixed 38 headers, skipped 5 (already correct)

PHASE 1C: Converting dates to standard format
---
  ✓ wb-button - Dates converted
  ✓ wb-color-bar - Dates converted
  [... more files ...]
  → Fixed 15 files, skipped 28 (already correct)

====================================================================
  PHASE 1 COMPLETE!
====================================================================

Results:
  Files Created: 5
  Headers Fixed: 38
  Dates Converted: 15
  Total Changes: 58

Changes have been applied!

Log file: C:\Users\jwpmi\Downloads\AI\wb\docs\status\batch-fix-log.txt
```

---

## LOGS & VERIFICATION

After running, check:

1. **Log file**: `/docs/status/batch-fix-log.txt`
   - Detailed record of all changes
   - Timestamps for each action
   - Error messages if any

2. **Verify files were created**:
   ```powershell
   ls C:\Users\jwpmi\Downloads\AI\wb\components\wb-1rem\
   ls C:\Users\jwpmi\Downloads\AI\wb\components\wb-chatbot\
   ```

3. **Check a fixed header**:
   ```powershell
   cat "C:\Users\jwpmi\Downloads\AI\wb\components\wb-button\✅ claude.md" | head -10
   ```

   Should show:
   ```markdown
   # Component: wb-button

   **Status**: ✅ COMPLETE
   **Last Updated**: October 22, 2025
   **Location**: /components/wb-button/claude.md
   ```

---

## TROUBLESHOOTING

### Error: "cannot be loaded because running scripts is disabled"

**Solution**: Run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try the script again.

### Error: "Cannot find path"

**Solution**: Make sure you're in the right directory:
```powershell
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts
```

Then verify the script exists:
```powershell
ls batch-fix-claude.ps1
```

### Files weren't created or modified

**Possibilities**:
1. You ran in DRY RUN mode (no `-Force` flag)
   - Run again WITH `-Force`: `.\batch-fix-claude.ps1 -Force`

2. Script had errors
   - Check the log: `/docs/status/batch-fix-log.txt`

3. File permissions issue
   - Run PowerShell as Administrator
   - Try again

---

## NEXT STEPS (After Phase 1)

Once Phase 1 is complete:

1. ✅ Verify all 48 files have claude.md
2. ✅ Run validation: `.\validate-claude-files.ps1`
3. ✅ Review validation report: `/docs/status/claude-validation-report.md`
4. ✅ Start Phase 2 (manual - add sections to files)

**Phase 2 timeline**: 6 hours over 2 days
**Phase 3 timeline**: 2 hours over 1 day

---

## SAFETY

This script is **safe because**:

✅ Always run in DRY RUN first (preview changes)
✅ Creates backups by default
✅ Logs all changes to file
✅ Only touches claude.md files
✅ Preserves original content (just reformats)
✅ Easy to rollback if needed

---

## READY?

**Execute this**:

```powershell
# Step 1: Navigate to scripts
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts

# Step 2: Preview changes (SAFE - no modifications)
.\batch-fix-claude.ps1 -DryRun

# Step 3: Review output carefully

# Step 4: If looks good, apply changes
.\batch-fix-claude.ps1 -Force

# Step 5: Verify log file
cat ..\status\batch-fix-log.txt
```

**Let me know when you've run it!** 🚀

