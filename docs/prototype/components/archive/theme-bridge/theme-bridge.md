# ./components/theme-bridge/theme-bridge.md - Theme Bridge Utility

## Compliance Note
This module is **NOT compliant** with the project rules as of October 2025:
- Not a web component (plain JS utility)
- Uses imperative code (direct DOM manipulation, manual event listeners, cross-frame messaging)
- Does NOT follow [docs/claude-md-compliance-table.md](../../docs/claude-md-compliance-table.md) requirements

**Component/Directory:** `components/theme-bridge/`

---

## Overview

The Theme Bridge utility synchronizes theme changes across frames. It is not a web component and is not reactive by design.

- Broadcasts and listens for theme change events
- Directly manipulates document and window messaging
- Used for cross-frame theme sync

---

*See compliance table for project-wide status.*
