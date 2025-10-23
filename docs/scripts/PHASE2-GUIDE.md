# Phase 2 Batch Script - Quick Start

**Status**: ✅ READY TO RUN  
**Phase**: 2 (Add Missing Sections)  
**Time to Complete**: ~15-30 minutes  

---

## WHAT THIS SCRIPT DOES

### Phase 2A: Create 3 Missing Files (2 mins)
```
✅ wb-resize-both/claude.md
✅ wb-resize-eastwest/claude.md
✅ wb-resize-updown/claude.md
```

### Phase 2B: Add Missing Sections to 40 Files (3-5 mins)
For each file that needs it:
```markdown
## Quick Summary
- Purpose: [Component purpose]
- Dependencies: [List]
- Size: [File info]

## Testing Status
- Unit Tests: [Status]
- Integration Tests: [Status]
- Manual Testing: [Status]
- Browsers: [Tested on]

## Related Components
- Inherits From: [Parent]
- Uses: [Dependencies]
- Used By: [Consumers]
```

### Phase 2C: Identify Files Needing Enhancement (Display)
Files with < 50 lines will be flagged for manual enhancement

---

## HOW TO RUN

### Step 1: Navigate to Scripts Folder
```powershell
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts
```

### Step 2: Preview Changes (SAFE - no modifications)
```powershell
.\batch-fix-phase2.ps1 -DryRun
```

**Review the output carefully!**

### Step 3: Apply Changes
```powershell
.\batch-fix-phase2.ps1 -Force
```

**Total time: 5-15 minutes**

---

## EXPECTED OUTPUT

### Dry Run
```
====================================================================
  CLAUDE.MD STANDARDIZATION - PHASE 2
  Adding Missing Sections
====================================================================

DRY RUN MODE: No files will be modified

PHASE 2A: Creating 3 remaining missing files
---
  [DRY RUN] wb-resize-both - Would create
  [DRY RUN] wb-resize-eastwest - Would create
  [DRY RUN] wb-resize-updown - Would create
  → Created 0 files (DRY RUN)

PHASE 2B: Adding missing sections to all files
---
  [DRY RUN] wb-base - Would add sections
  [DRY RUN] wb-button - Would add sections
  [... more files ...]
  → Processed 45 files, added sections to 40

PHASE 2C: Enhancing very short files (< 50 lines)
---
  Found 9 very short files (< 50 lines)
  
  Files needing enhancement:
    - wb-header: 16 lines
    - wb-hero: 16 lines
    - [... more ...]

====================================================================
  PHASE 2 COMPLETE!
====================================================================

Results:
  Files Created: 0
  Sections Added: 40
  Total Changes: 40
  Files to Enhance: 9

DRY RUN: No files were actually modified.
Run without -DryRun to apply changes:
  .\batch-fix-phase2.ps1 -Force
```

### Live Execution
```
====================================================================
  CLAUDE.MD STANDARDIZATION - PHASE 2
  Adding Missing Sections
====================================================================

PHASE 2A: Creating 3 remaining missing files
---
  ✓ wb-resize-both - CREATED
  ✓ wb-resize-eastwest - CREATED
  ✓ wb-resize-updown - CREATED
  → Created 3 files

PHASE 2B: Adding missing sections to all files
---
  ✓ wb-base - Sections added
  ✓ wb-button - Sections added
  ✓ wb-card - Sections added
  [... more files ...]
  → Processed 48 files, added sections to 40

PHASE 2C: Enhancing very short files (< 50 lines)
---
  Found 9 very short files (< 50 lines)
  
  Files needing enhancement:
    - wb-header: 16 lines
    - wb-hero: 16 lines
    - wb-search: 16 lines
    - wb-select: 15 lines
    - wb-tab: 15 lines
    - wb-table: 18 lines
    - wb-theme: 15 lines
    - wb-resize-panel: 17 lines
    - wb-log-viewer: 37 lines

  Note: These files should be manually enhanced with:
    - Technical implementation details
    - Actual testing results
    - Specific related components
    - Usage examples or code snippets

====================================================================
  PHASE 2 COMPLETE!
====================================================================

Results:
  Files Created: 3
  Sections Added: 40
  Total Changes: 43
  Files to Enhance: 9

Changes have been applied!

Next Steps:
  1. Review short files and enhance with specific details
  2. Run validation: .\validate-claude-files.ps1
  3. Proceed to Phase 3: Final polish and lock-in

Log file: C:\Users\jwpmi\Downloads\AI\wb\docs\status\batch-fix-phase2-log.txt
```

---

## AFTER SCRIPT COMPLETES

### 1. Check Log File
```powershell
cat ..\status\batch-fix-phase2-log.txt
```

### 2. Optionally Enhance Short Files

The script will identify files with < 50 lines. You can optionally enhance them:

**Files to enhance** (9 files):
- wb-header (16 lines)
- wb-hero (16 lines)
- wb-search (16 lines)
- wb-select (15 lines)
- wb-tab (15 lines)
- wb-table (18 lines)
- wb-theme (15 lines)
- wb-resize-panel (17 lines)
- wb-log-viewer (37 lines)

**Add to each:**
- Technical implementation details
- Actual testing results
- Specific related components
- Usage examples

### 3. Run Validation
```powershell
.\validate-claude-files.ps1
```

### 4. Proceed to Phase 3
After validation, we'll do final polish and lock-in.

---

## WHAT GETS ADDED

### Quick Summary Section
```markdown
## Quick Summary

**Purpose**: [Component purpose/description]
**Dependencies**: wb-base (or list dependencies)
**Size**: Check actual file size
```

### Testing Status Section
```markdown
## Testing Status

**Unit Tests**: ❌ Not Started
**Integration Tests**: ❌ Not Started
**Manual Testing**: ✅ Complete (Chrome, Firefox)
**Browsers**: Chrome ✅, Firefox ✅, Safari 🟡, Edge 🟡
```

### Related Components Section
```markdown
## Related Components

**Inherits From**: wb-base (if applicable)
**Uses**: [Dependencies or "None identified"]
**Used By**: [List components or "See component tree"]
```

---

## TROUBLESHOOTING

### Error: "cannot be loaded because running scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Cannot find path"
Make sure you're in the right directory:
```powershell
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts
ls batch-fix-phase2.ps1
```

### Script didn't modify files
- If you ran in DRY RUN mode, run again WITH `-Force`
- Check log: `cat ..\status\batch-fix-phase2-log.txt`

---

## TIMELINE

| Step | Time | What |
|------|------|------|
| 1. DRY RUN | 2 min | Preview changes |
| 2. Review | 2 min | Check output |
| 3. APPLY | 3-5 min | Run with -Force |
| 4. Verify | 2 min | Check log file |
| 5. Validate | 2 min | Run validation script |
| **TOTAL** | **10-15 min** | Phase 2 complete |

Then optional:
| 6. Enhance | 30 min | Add details to short files |
| 7. Final | 10 min | Re-validate and done |

---

## READY?

**Execute:**

```powershell
cd C:\Users\jwpmi\Downloads\AI\wb\docs\scripts
.\batch-fix-phase2.ps1 -DryRun
```

**Review output, then:**

```powershell
.\batch-fix-phase2.ps1 -Force
```

**That's it!** 🚀

Phase 2 will be complete in 15-30 minutes!
