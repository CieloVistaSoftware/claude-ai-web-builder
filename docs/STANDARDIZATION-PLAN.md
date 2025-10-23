# Claude.md Standardization Plan

**Status**: Ready to Execute  
**Date**: October 22, 2025

---

## PROBLEM SUMMARY

From the audit report, we identified:

✗ **7 Missing Files**
- wb-1rem
- wb-chatbot  
- wb-color-organ
- wb-css-loader
- wb-grid
- wb-resize-both, wb-resize-eastwest, wb-resize-updown

✗ **5 Parse Errors** (script crashes on these)
- wb-keyboard-manager
- wb-log-viewer
- wb-select
- wb-table
- wb-theme

✗ **40 Inconsistent Status Formats**
- No standard indicator (mix of ✅, 🟢, 🔴, ⚠️, text)
- Dates in multiple formats
- No consistent structure

✗ **0 TODO/Done Items Captured**
- Extraction not working properly
- Need structured format

---

## SOLUTION: 3-PHASE PLAN

### PHASE 1: ESTABLISH STANDARD (TODAY)

✅ **Created**:
1. `/docs/CLAUDE-MD-SPECIFICATION.md` - Complete standardization spec
2. `/components/CLAUDE-MD-TEMPLATE.md` - Template for all files
3. `/docs/scripts/validate-claude-files.ps1` - Validation tool

**Next**: Run validation to see current state

```powershell
.\docs\scripts\validate-claude-files.ps1
```

---

### PHASE 2: TRIAGE & FIX (NEXT)

**Priority Order**:

1. **CRITICAL (Day 1)** - Must fix to make system work:
   - [ ] Create 7 missing claude.md files (copy template)
   - [ ] Fix 5 parse errors (bad file format)
   - [ ] Fix headers (all files need proper header)

2. **HIGH (Day 2-3)** - Standardize existing files:
   - [ ] Update status lines (use consistent indicators)
   - [ ] Add required sections (Quick Summary, Latest Update, Testing)
   - [ ] Add dates in proper format
   - [ ] Add TODO/Done items

3. **MEDIUM (Day 4-5)** - Polish:
   - [ ] Add Technical Notes where needed
   - [ ] Add Related Components
   - [ ] Ensure line count (150-600)
   - [ ] Final validation pass

---

### PHASE 3: AUTOMATE & LOCK (NEXT WEEK)

- Add pre-commit hook to validate format
- Update CONTRIBUTING.md with requirement
- Add CI/CD check for spec compliance
- Monthly audit runs

---

## STANDARDIZATION CHECKLIST

### REQUIRED IN EVERY FILE:

**Header Section:**
- [ ] `# Component: wb-name`
- [ ] `**Status**: ` followed by ONE of:
  - ✅ COMPLETE
  - 🟢 FUNCTIONAL
  - 🟡 IN PROGRESS
  - 🔴 BLOCKED
  - ⚠️ NEEDS TESTING
- [ ] `**Last Updated**: [Date]`
- [ ] `**Location**: [Path]`

**Content Sections (in order):**
- [ ] Quick Summary (Purpose, Dependencies, Size)
- [ ] Latest Update (What changed, when, impact)
- [ ] Current Status (State, production readiness)
- [ ] Current Issues (if any exist, with priority)
- [ ] TODO Items (if active work, with owners)
- [ ] Completed Work (phases/milestones)
- [ ] Testing Status (unit, integration, manual, browser)
- [ ] Documentation (links to related docs)
- [ ] Related Components (inheritance tree)
- [ ] Maintenance Notes (last review date, next review)

**Formatting Rules:**
- [ ] All status indicators from approved list only
- [ ] All dates in `MMMM dd, YYYY` format
- [ ] All issues marked with priority: CRITICAL/HIGH/MEDIUM/LOW
- [ ] All TODO items have owner and due date
- [ ] All Done items have completion date
- [ ] No code outside code blocks
- [ ] No TODO/FIXME comments outside TODO section
- [ ] 150-600 lines long
- [ ] No vague descriptions

---

## FILES CREATED

### Documentation
1. `/docs/CLAUDE-MD-SPECIFICATION.md` - Complete spec (THIS)
2. `/components/CLAUDE-MD-TEMPLATE.md` - Template to copy
3. `/docs/STANDARDIZATION-PLAN.md` - This file

### Tools
1. `/docs/scripts/validate-claude-files.ps1` - Validation script
2. `/docs/scripts/update-status.ps1` - Aggregation script (existing)
3. `/docs/scripts/audit-claude-files.ps1` - Audit script (existing)

### Reports
- `/docs/status/claude-audit-report.md` - Audit results
- `/docs/status/claude-validation-report.md` - Will generate
- `/docs/status/currentstatus.md` - Aggregated status

---

## EXECUTION STEPS

### RIGHT NOW:
1. Review this plan
2. Run: `.\docs\scripts\validate-claude-files.ps1`
3. Review: `/docs/status/claude-validation-report.md`

### DAY 1 (CRITICAL FIXES):
```powershell
# For each CRITICAL issue:
# 1. Copy template
# 2. Fill in component details
# 3. Run validation to verify

cp /components/CLAUDE-MD-TEMPLATE.md /components/wb-1rem/claude.md
# Edit to match wb-1rem specifically
.\docs\scripts\validate-claude-files.ps1
```

### DAY 2-3 (STANDARDIZATION):
- Review each non-valid file
- Update to match specification
- Add missing sections
- Verify with validation script

### DAY 4-5 (FINAL PASS):
- Run final validation on all files
- Generate final status report
- Document any exceptions
- Lock the format

---

## KEY PRINCIPLES

✅ **ONE FORMAT EVERYWHERE**
- No variations
- No exceptions  
- Consistent = Automatable

✅ **HUMAN READABLE**
- Clear sections
- Easy to navigate
- Good for manual reading

✅ **MACHINE PARSEABLE**
- Regex patterns work
- Status extraction works
- Aggregation works

✅ **MAINTAINABLE**
- Template provided
- Validation automated
- Format documented

---

## SUCCESS METRICS

After standardization complete:

✅ All 48 components have claude.md files  
✅ All files pass validation  
✅ Status aggregation captures 40+ status items  
✅ TODO/Done items properly extracted  
✅ Parse errors = 0  
✅ Format violations = 0  
✅ Re-run aggregation weekly with no errors  

---

## NEXT DOCUMENT

When Phase 1 complete, we'll create:
- Migration checklist for each component
- Per-component update guide
- Batch update script

**READY TO START?**

Run: `.\docs\scripts\validate-claude-files.ps1`

Then share the report and we'll proceed with Phase 2!

