# ./components/color-mapper/color-mapper.md - Color Mapper Utility

## Compliance Note
This module is **NOT compliant** with the project rules as of October 2025:
- Not a web component (plain JS utility)
- Uses imperative code (direct DOM manipulation, manual event listeners)
- Does NOT follow [docs/claude-md-compliance-table.md](../../docs/claude-md-compliance-table.md) requirements

**Component/Directory:** `components/color-mapper/`

---

## Overview

The Color Mapper utility maps and synchronizes CSS color variables for theme support across the application. It is not a web component and is not reactive by design.

- Provides global color mapping for theme switching
- Directly manipulates document styles and variables
- Used for compatibility with legacy and external themes

---

*See compliance table for project-wide status.*
