# Contributing - Claude.md Standardization

## Adding New Components

When creating a new component, ensure you include a properly formatted claude.md file.

### Quick Steps

1. Create component directory: /components/wb-componentname/
2. Copy template: 
   `
   cp /components/CLAUDE-MD-TEMPLATE.md /components/wb-componentname/claude.md
   `
3. Edit the file with your component details
4. Follow the specification below

### Specification

All \claude.md\ files MUST follow: /docs/CLAUDE-MD-SPECIFICATION.md

### Template

Template available at: /components/CLAUDE-MD-TEMPLATE.md

### Validation

Before committing, validate your file:

`powershell
.\docs\scripts\validate-claude-files.ps1
`

## File Format Requirements

### Header (Required)
`markdown
# Component: wb-componentname

**Status**: [ONE OF: ✅ COMPLETE | 🟢 FUNCTIONAL | 🟡 IN PROGRESS | 🔴 BLOCKED | ⚠️ NEEDS TESTING]
**Last Updated**: MMMM dd, yyyy
**Location**: /components/wb-componentname/claude.md
`

### Required Sections
- **Quick Summary** - Purpose, dependencies, size
- **Latest Update** - Recent changes and impact
- **Current Status** - Production readiness
- **Testing Status** - Test coverage by type
- **Related Components** - Inheritance and dependencies

### Optional Sections
- Current Issues (if applicable)
- TODO Items (if active work)
- Technical Notes (if complex)
- Completed Work (phases/milestones)

## Status Indicators

Use EXACTLY ONE status indicator:

| Indicator | Meaning |
|-----------|---------|
| ✅ COMPLETE | Fully functional, production ready |
| 🟢 FUNCTIONAL | Works but may need refinement |
| 🟡 IN PROGRESS | Active development |
| 🔴 BLOCKED | Cannot proceed |
| ⚠️ NEEDS TESTING | Code ready, testing incomplete |

## Date Format

All dates MUST be in format: **MMMM dd, yyyy**

Examples:
- ✅ October 22, 2025
- ❌ Oct 22, 2025
- ❌ 2025-10-22
- ❌ 10/22/2025

## File Size

Recommended: **150-400 lines**

- Too short (< 50): Add implementation details
- Too long (> 600): Consider splitting into sections or separate docs

## Pre-Commit Validation

The repository includes a pre-commit hook that validates all \claude.md\ files.

To check before committing:
`powershell
.\docs\scripts\validate-claude-files.ps1
`

## Questions?

Refer to:
- Specification: \/docs/CLAUDE-MD-SPECIFICATION.md\
- Template: \/components/CLAUDE-MD-TEMPLATE.md\
- Examples: See any existing component's \claude.md\ file

---

**Last Updated**: October 22, 2025
