# EXECUTION GUIDE - How to Fix Files

**Quick Start**: Start with ANY file, follow this process, repeat 48 times!

---

## BEFORE YOU START

### Files You'll Need Open

1. **Reference Template**: `/components/CLAUDE-MD-TEMPLATE.md`
2. **Your Component File**: `/components/wb-[name]/✅ claude.md`
3. **This Guide**: `/docs/status/VALIDATION-SUMMARY.md`

### Required Status Indicators

Use EXACTLY ONE of these:
```
✅ COMPLETE      - Fully functional, production ready
🟢 FUNCTIONAL    - Works but may need refinement
🟡 IN PROGRESS   - Active development
🔴 BLOCKED       - Cannot proceed
⚠️ NEEDS TESTING - Code ready, testing incomplete
```

### Date Format

ALL dates MUST be:
```
MMMM dd, YYYY

Examples:
- October 22, 2025 ✅
- Nov 15, 2024 ❌
- 2025-10-22 ❌
- 10/22/2025 ❌
```

---

## STEP-BY-STEP PROCESS

### STEP 1: Backup (30 seconds)

```powershell
# Make a copy of current file (optional but safe)
cp "C:\Users\jwpmi\Downloads\AI\wb\components\wb-button\✅ claude.md" `
   "C:\Users\jwpmi\Downloads\AI\wb\components\wb-button\✅ claude.md.backup"
```

### STEP 2: Open File (30 seconds)

Use your editor (VSCode, etc) to open:
```
C:\Users\jwpmi\Downloads\AI\wb\components\wb-button\✅ claude.md
```

### STEP 3: Replace First 10 Lines (2 minutes)

**DELETE everything at the top**, replace with:

```markdown
# Component: wb-button

**Status**: [PICK ONE]
**Last Updated**: October 22, 2025
**Location**: /components/wb-button/claude.md

---

## Quick Summary
```

Replace `[PICK ONE]` with actual status:
- If it works: `🟢 FUNCTIONAL`
- If in development: `🟡 IN PROGRESS`
- If complete: `✅ COMPLETE`
- If has issues: `⚠️ NEEDS TESTING`
- If blocked: `🔴 BLOCKED`

### STEP 4: Add Quick Summary Section (3 minutes)

After the heading separators, add:

```markdown
## Quick Summary

**Purpose**: One sentence what this component does
**Dependencies**: List dependencies or "None"
**Size**: Check file size in bytes, convert to KB

Example:
**Purpose**: Renders colored buttons with various states
**Dependencies**: wb-base, wb-color-utils
**Size**: 15 KB | 320 lines
```

### STEP 5: Find "Latest Update" Section (2 minutes)

Look for a section like:
- "Latest Update"
- "LATEST UPDATE"
- "Recent Changes"
- "What Changed"

If found:
- Keep it but ensure the date is `MMMM dd, YYYY` format
- Move it to appear AFTER Quick Summary

If NOT found:
- Add one:
```markdown
## Latest Update

### Most Recent Change (October 22, 2025)

- What changed
- What changed
- What changed

**Impact**: How this affects usage
**Next**: What's coming next
```

### STEP 6: Ensure Testing Status Section (5 minutes)

Look for:
- "Testing Status"
- "Test Coverage"
- "Tested"

If found:
- Format it like this:
```markdown
## Testing Status

**Unit Tests**: ✅ Complete / 🟡 In Progress / ❌ Not Started
**Integration Tests**: ✅ Complete / 🟡 In Progress / ❌ Not Started
**Manual Testing**: ✅ Complete / 🟡 In Progress / ❌ Not Started
**Browsers**: Chrome ✅, Firefox ✅, Safari ⚠️
```

If NOT found:
- Add it:
```markdown
## Testing Status

**Unit Tests**: ❌ Not Started
**Integration Tests**: ❌ Not Started
**Manual Testing**: ✅ Complete (Chrome, Firefox)
**Browsers**: Chrome ✅, Firefox ✅, Safari 🟡, Edge 🟡
```

### STEP 7: Add Related Components (3 minutes)

At the end of file, add:

```markdown
## Related Components

**Inherits From**:
- wb-base (if applicable)

**Uses**:
- wb-color-utils (if applicable)

**Used By**:
- List any components that use this

**Demo**:
- Link to demo file
```

If unsure about relationships, leave as:
```markdown
## Related Components

**Inherits From**: wb-base (standard)
**Uses**: None identified yet
**Used By**: See component tree in project docs
```

### STEP 8: Fix All Dates (5 minutes)

Search through file for ANY dates and convert to `MMMM dd, YYYY`:
- Find: `Dec 19` → Replace: `December 19, 2025`
- Find: `October 6` → Replace: `October 6, 2025`
- Find: `2025-10-22` → Replace: `October 22, 2025`

### STEP 9: Check Line Count (1 minute)

Count total lines. Target is 150-400 lines.

- If < 150 lines: Need to add content (sections, examples, notes)
- If 150-400 lines: Perfect! ✅
- If > 600 lines: Need to split into multiple sections or files

### STEP 10: Save File (30 seconds)

Save with Ctrl+S or File → Save

### STEP 11: Verify Format (1 minute)

Quick checklist before moving to next file:

- [ ] Header format correct (# Component: [name])
- [ ] Status indicator is ONE of the 5 options
- [ ] Date in `MMMM dd, YYYY` format
- [ ] Has Quick Summary section
- [ ] Has Latest Update section
- [ ] Has Testing Status section
- [ ] Has Related Components section
- [ ] No parse errors when opened
- [ ] File saves without errors

---

## TIME ESTIMATE PER FILE

- **Well-organized file**: 5-10 minutes
- **Messy file**: 10-15 minutes
- **Very long file**: 15-20 minutes
- **Very short file**: 5-8 minutes

**Average**: ~10 minutes per file  
**48 files**: ~480 minutes (~8 hours)

---

## COMMON ISSUES & FIXES

### Issue: Emoji character not showing

**Problem**: Copy emoji doesn't work or looks wrong  
**Solution**: Use this in the status line:
```
**Status**: ✅ COMPLETE
**Status**: 🟢 FUNCTIONAL  
**Status**: 🟡 IN PROGRESS
**Status**: 🔴 BLOCKED
**Status**: ⚠️ NEEDS TESTING
```

### Issue: Can't find Latest Update section

**Problem**: Don't see "Latest Update" heading  
**Solution**: Look for these alternatives:
- "Recent Changes"
- "RECENT ACTIVITY"
- "Activity Log"
- "What's New"
- "Updates"

If still can't find, just add a new section.

### Issue: Date is scattered throughout

**Problem**: Multiple different date formats  
**Solution**: Use Find & Replace:
1. Find: `([A-Za-z]+) (\d{1,2}), 20(\d{2})`
2. Check each match
3. Replace: `[Month] [Day], 20[Year]`

### Issue: No status indicator at all

**Problem**: File has status but no emoji  
**Solution**: Add the emoji:
```
Before: Status: Completed
After:  **Status**: ✅ COMPLETE
```

### Issue: Multiple statuses in one file

**Problem**: Different status in different sections  
**Solution**: 
1. Find the MOST CURRENT status (usually near top)
2. Use that ONE in the header
3. Keep detail in Latest Update section

---

## BATCH PROCESS (Multiple Files)

If you want to do several at once:

### Day 1: Create Missing (30 mins)
1. Copy template to 5 missing components
2. Quick customization for each
3. Done!

### Day 2: Fix Headers (3 hours)
1. Do ALL 40 files' headers
2. Fix ALL status lines
3. Fix ALL dates

### Day 3: Add Sections (4 hours)
1. Add Quick Summary to each
2. Ensure Latest Update section
3. Ensure Testing Status section

### Day 4: Polish (2 hours)
1. Enhance short files
2. Check all line counts
3. Final validation pass

---

## VALIDATION CHECK

After editing each file, verify by checking:

✅ Opens without errors  
✅ Status is ONE of 5 options  
✅ All dates in `MMMM dd, YYYY`  
✅ Header has # Component: name  
✅ Has Quick Summary  
✅ Has Latest Update  
✅ Has Testing Status  
✅ No TODO/FIXME comments outside TODO section  
✅ 150-400 lines long (unless justified)  

---

## EXAMPLE: Before & After

### BEFORE (Current)
```markdown
**See [CONTRIBUTING.md](../../CONTRIBUTING.md) for ...**

[Documentation is found here](../wb-button.md)

# WB Button Component (wb-button)

http://127.0.0.1:8083/components/wb-button/wb-button-demo.html 
doesn't show green, red, or yellow status lights.

## 🔴 **LATEST UPDATE: WBBaseComponent Inheritance Refactor** (October 16, 2025)

### ✅ **Component Inheritance Standardized**

**Refactoring Applied**: Converted from HTMLElement...

[Lots of narrative text and sections]
```

### AFTER (Standardized)
```markdown
# Component: wb-button

**Status**: ✅ COMPLETE
**Last Updated**: October 22, 2025
**Location**: /components/wb-button/claude.md

---

## Quick Summary

**Purpose**: Renders clickable buttons with multiple states and styles
**Dependencies**: wb-base, wb-color-utils
**Size**: 18 KB | 280 lines

---

## Latest Update

### WBBaseComponent Inheritance Refactor (October 16, 2025)

- Converted from HTMLElement to WBBaseComponent inheritance
- Standardized logging with this.logInfo(), this.logWarning()
- Unified event handling through fireEvent()
- Automatic theme management integration

**Impact**: Component now uses standardized base class  
**Next**: Integration testing across all pages

---

## Testing Status

**Unit Tests**: ✅ Complete (12 tests passing)
**Integration Tests**: ✅ Complete
**Manual Testing**: ✅ Complete
**Browsers**: Chrome ✅, Firefox ✅, Safari ✅

---

## Related Components

**Inherits From**: wb-base
**Uses**: wb-color-utils
**Used By**: wb-page, wb-demo
**Demo**: ./wb-button-demo.html

---

[Rest of file continues with organized sections]
```

---

## READY TO START?

Pick a file and follow the 11 steps above!

**Start with**: A SHORT file first (easier to practice)  
**Recommended first file**: wb-header or wb-hero (< 50 lines, easy win)

**Questions?** Review:
- Template: `/components/CLAUDE-MD-TEMPLATE.md`
- Specification: `/docs/CLAUDE-MD-SPECIFICATION.md`
