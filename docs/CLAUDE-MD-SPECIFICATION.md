# Claude.md Standardization Specification

**Version**: 1.0  
**Last Updated**: October 22, 2025  
**Purpose**: Unified format for all component claude.md files

---

## MANDATORY STRUCTURE

Every `claude.md` file MUST follow this exact structure:

### 1. HEADER (Lines 1-5)
```markdown
# Component: wb-component-name

**Status**: [STATUS_INDICATOR]  
**Last Updated**: October 22, 2025  
**Location**: /components/wb-component-name/claude.md
```

**Rules:**
- Line 1: Always `# Component: [name]`
- Line 3: `**Status**:` followed by one of these ONLY:
  - `✅ COMPLETE` (fully functional, production ready)
  - `🟢 FUNCTIONAL` (works but may need refinement)
  - `🟡 IN PROGRESS` (active development)
  - `🔴 BLOCKED` (cannot proceed)
  - `⚠️ NEEDS TESTING` (code ready, testing incomplete)
- Line 4: Always `**Last Updated**: [DATE]`
- Line 5: Always `**Location**: /components/[name]/claude.md`

---

### 2. QUICK SUMMARY (Lines 7-10)
```markdown
## Quick Summary

**Purpose**: One sentence describing what this component does  
**Dependencies**: List any dependencies (e.g., wb-base, wb-color-utils)  
**Size**: X KB | Y lines of code
```

---

### 3. LATEST UPDATE (Lines 12+)
```markdown
## Latest Update

### What Changed (Date)
- Specific change 1
- Specific change 2
- Specific change 3

**Impact**: Brief description of impact
**Next**: What comes next
```

---

### 4. CURRENT ISSUES (if any)
```markdown
## Current Issues

### [PRIORITY] Issue Name
**Component**: [part affected]  
**Description**: What's wrong  
**Workaround**: How to work around it  
**Fix**: Planned solution  

---
```

**PRIORITY OPTIONS** (use ONE):
- `CRITICAL` - Blocks usage
- `HIGH` - Major functionality broken
- `MEDIUM` - Minor functionality broken
- `LOW` - Nice to have fix

---

### 5. TODO ITEMS (if any)
```markdown
## TODO Items

- [ ] Task 1 - Owner: name
- [ ] Task 2 - Owner: name
- [x] Completed task
```

**Rules:**
- Use `[ ]` for pending
- Use `[x]` for completed
- Always include owner
- Always be specific

---

### 6. COMPLETED WORK
```markdown
## Completed Work

- [x] Task 1 - Completed: Date
- [x] Task 2 - Completed: Date
- [x] Task 3 - Completed: Date
```

---

### 7. TECHNICAL NOTES (optional)
```markdown
## Technical Notes

### Key Implementation Details
- Detail 1
- Detail 2

### Performance Considerations
- Consideration 1
- Consideration 2
```

---

### 8. TESTING STATUS
```markdown
## Testing Status

**Unit Tests**: ✅ Complete / 🟡 In Progress / ❌ Not Started  
**Integration Tests**: ✅ Complete / 🟡 In Progress / ❌ Not Started  
**Manual Testing**: ✅ Complete / 🟡 In Progress / ❌ Not Started  
**Browser Compatibility**: Tested on Chrome, Firefox, Safari
```

---

### 9. DOCUMENTATION
```markdown
## Documentation

- Component README: [Link to README.md]
- API Docs: [Link if exists]
- Demo: [Link to demo file]
- Tests: [Link to test files]
```

---

### 10. RELATED COMPONENTS
```markdown
## Related Components

- **wb-base**: Inherited from this
- **wb-color-utils**: Uses this
- **wb-demo**: Demonstrated by this
```

---

## FORMATTING RULES

### ✅ DO:
- Use `**text**` for bold
- Use `###` for section headers
- Use bullet lists with `-`
- Use code blocks with triple backticks
- Use emoji indicators: ✅ 🟢 🟡 🔴 ⚠️
- Be specific and concrete
- Include dates in `MMMM dd, YYYY` format
- Keep status line consistent

### ❌ DON'T:
- Use multiple status indicators
- Mix date formats
- Use vague descriptions like "working"
- Leave status as "unknown" or blank
- Use different heading levels inconsistently
- Mix TODO and Done items together
- Include code examples without code blocks
- Have sections longer than 50 lines

---

## EXAMPLES

### ✅ CORRECT
```markdown
**Status**: ✅ COMPLETE  
- [x] Feature built and tested
- Completed: October 15, 2025
```

### ❌ WRONG
```markdown
Status: kinda working  
- [ ] needs fixing maybe
- worked on sometime last month
```

---

## FILE SIZE TARGETS

- **Minimum**: 150 lines (need substance)
- **Optimal**: 200-400 lines (good detail)
- **Maximum**: 600 lines (too verbose, split it)

---

## SECTION FREQUENCY

**MUST APPEAR IN EVERY FILE:**
1. Header
2. Quick Summary
3. Latest Update
4. Status

**SHOULD APPEAR:**
5. Current Issues (if any exist)
6. Testing Status
7. Related Components

**OPTIONAL:**
8. TODO Items (only if active work)
9. Technical Notes (if complex)
10. Documentation (link if available)

---

## MIGRATION CHECKLIST

For each component, verify:

- [ ] Header is correct format
- [ ] Status is ONE of the 5 options
- [ ] Date is MMMM dd, YYYY format
- [ ] Has Quick Summary section
- [ ] Has Latest Update section
- [ ] Has Testing Status section
- [ ] All issues marked with priority
- [ ] All TODO items have owners
- [ ] All Done items have dates
- [ ] Related components listed
- [ ] No vague descriptions
- [ ] All code in code blocks
- [ ] No TODO/FIXME comments outside TODO section
- [ ] File is 150-600 lines

---

## AUTOMATED VALIDATION

File will be validated for:
1. Header format (regex match)
2. Status is valid (one of 5 options)
3. Date format (MM/DD/YYYY pattern)
4. Section headers exist
5. TODO format consistency
6. No duplicate sections
7. Line count in range

Run: `.\validate-claude-files.ps1`

---

## NEXT STEPS

1. Create template file
2. Validate all existing files
3. Fix errors in phases
4. Lock format in git pre-commit hook
5. Document in CONTRIBUTING.md

