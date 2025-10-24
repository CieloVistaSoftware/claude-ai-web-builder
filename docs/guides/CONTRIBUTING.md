# WB Component Project: Contribution & Review Checklist

This checklist must be reviewed before any code, documentation, or answer is considered complete.

## File & Naming Conventions
- All files must use kebab-case (e.g., wb-base.js, wb-base.css, wb-base-demo.html).
- Component logic and demo logic must be in the main component file (e.g., wb-base.js).
- No stray, backup, or non-conforming files (e.g., no demo-base-hover.js, wb-demo-base.js, etc.).
- All component styles must be in the component CSS file (e.g., wb-base.css). No separate demo CSS.
- Demo HTML must import main.css and the component's CSS only.

## Cleanup & Accuracy
- Remove all files that do not match conventions or are redundant.
- Move all inline or demo-specific styles to the component CSS file.
- Ensure all demo logic is centralized in the main component JS file.
- Check for and remove any unused, backup, or hidden files.

## Documentation
- All documentation must be in Markdown files named after the component (e.g., wb-base.md).
- Demo HTML must load documentation dynamically using the markdown attribute.
- All changes and conventions must be logged in claude.md for each component.
- This checklist file (CONTRIBUTING.md) must be referenced in every claude.md file.

## Review Steps
1. List all files in the component directory and check for compliance.
2. Confirm all styles are centralized and imported correctly.
3. Confirm all demo and component logic is in the main JS file.
4. Confirm documentation is up to date and loaded dynamically.
5. Reference this checklist in claude.md.

---

**Reference this file in all claude.md files:**

See [CONTRIBUTING.md](../CONTRIBUTING.md) for project rules and review checklist.
