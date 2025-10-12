

**See [CONTRIBUTING.md](../../CONTRIBUTING.md) for project rules and review checklist.**

[Documentation is found here](../wb-base.md)

# ./components/wb-base/claude.md - WB Base Component (`wb-base`)
## Compliance Note
This module is **NOT compliant** with the project rules as of October 2025:
- Not a web component (base class only)
- Not directly reactive (utility base, not a UI component)
- Does NOT follow [docs/claude-md-compliance-table.md](../../docs/claude-md-compliance-table.md) requirements

**Component/Directory:** `components/wb-base/`

---

---

## Activity Log

### 2025-10-11  (Most Recent First)

- 🆕 Refactored `wb-base-demo.html` to use dynamic Markdown loading. Removed hardcoded documentation and switched to `<wb-demo markdown="./wb-base.md">` pattern. This standardizes documentation loading and improves maintainability.
- 🆕 Created `wb-base.css` for naming consistency. All base/component CSS files now follow the naming convention and are easy to discover/import.
