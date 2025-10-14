# Component Issues & Refactor Checklist

## Dark Mode & Style System
- [x] All components and their .html demos use dark mode by default.
- [x] `data-driven-demo.html` sets `data-theme="dark"` on `<html>` and `<body>`.
- [x] All colors and backgrounds use CSS variables from the global style system.
- [x] Latest styles are imported via `<link rel="stylesheet" href="../styles/main.css">`.
- [x] No inline styles in JS; all styling is via CSS variables and component CSS.
- [x] Each component's CSS is unique, but global tokens/utilities come from the styles folder.

## Code Deduplication
- [ ] Review all component .js files for duplicate logic (e.g., event handling, property reflection, rendering helpers).
- [ ] Move shared logic to a new utility file (e.g., `components/component-utils.js`) and use composition (import/require) instead of copy-paste.
- [ ] Document which components use the shared utilities and remove redundant code.

## Outstanding Issues
- [ ] If `data-driven-demo.html` still does not appear in dark mode, check for:
    - Browser cache issues (force refresh)
    - Overridden or missing CSS variables in the styles folder
    - Conflicting styles in component CSS
- [ ] Audit all other component .html demos for dark mode and style system compliance.

---

**Summary:**
- The style system and dark mode are correctly set up in `data-driven-demo.html` and most components.
- Next, focus on code deduplication and a final audit of all demos for style compliance.