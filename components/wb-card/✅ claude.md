# Component: wb-card
# Directory: components/wb-card

**See [CONTRIBUTING.md](../../CONTRIBUTING.md) for project rules and review checklist.**

---

## Quick Summary

**Purpose**: [Component purpose/description]
**Dependencies**: wb-base (or list dependencies)
**Size**: Check actual file size

---

## Compliance Note
- As of October 11, 2025, this component is fully compliant with the new project rule: **All components must use reactive coding only. Imperative code is not allowed.**
- See compliance table in docs/claude-md-compliance-table.md for status tracking.

---

# WB Card Component Development Log
<link rel="stylesheet" href="../wb-event-log/wb-event-log.css"> remove this each compnent is fully contained and uses the comopnent .css in the component no need to re referece.
no inline styles or .js
no floating event log it should arleady be a part of our base component
use wb-nav not nav
udr wb-btn not button
use wb-card for all card examples
use wb-demo for the two tab layout 1) Documentation and 2) examples must work 100% 

## 🕒 RECENT ACTIVITY (October 11, 2025)
- Refactored wb-card.js to use a reactive pattern (signals/observables, declarative rendering, no imperative code) for full compliance with project rules.
- Updated compliance table and this claude.md accordingly.

### ✅ Duplicate Code Cleanup (December 19, 2024)
- **Issue**: CSS loading code duplicated across components
- **Status**: Already using WBComponentUtils pattern with fallback
- **Code Pattern**:
  ```javascript
  if (window.WBComponentUtils) {
      const cssPath = window.WBComponentUtils.getPath('wb-card.js', '../components/wb-card/') + 'wb-card.css';
      window.WBComponentUtils.loadCSS('wb-card', cssPath);
  } else {
      // Fallback CSS loading
  }
  ```
- **Result**: No changes needed - already follows best practices

## Component Overview

The WB Card component provides flexible card layouts with multiple variants and states.

### Features
- Multiple variants (elevated, outlined, filled, glass)
- Different sizes (compact, standard, large)
- Flexible layouts (vertical, horizontal, media positions)
- State management (hover, active, disabled, loading)
- Event dispatching for interactions

## Testing Status

**Unit Tests**: ❌ Not Started
**Integration Tests**: ❌ Not Started
**Manual Testing**: ✅ Complete (Chrome, Firefox)
**Browsers**: Chrome ✅, Firefox ✅, Safari 🟡, Edge 🟡


## Related Components

**Inherits From**: wb-base (if applicable)
**Uses**: [Dependencies or "None identified"]
**Used By**: [List components or "See component tree"]

---

