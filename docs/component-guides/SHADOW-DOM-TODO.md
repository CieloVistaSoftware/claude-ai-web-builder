# WB Components Shadow DOM Migration TODO List

**Date Created:** November 22, 2025

## Priority Order & Steps

### 1. High Priority (Critical UI/Visual Components)
- **wb-modal**
- **wb-toggle**
- **wb-status**
- **wb-search**
- **wb-input**
- **wb-select**
- **wb-table**

### 2. Medium Priority (Reusable/Interactive Components)
- **wb-card**
- **wb-button**
- **wb-control-panel**
- **wb-footer**

### 3. Low Priority (Utility/Manager Components)
- **wb-event-log**
- **wb-log-error**
- **wb-keyboard-manager**
- **wb-theme-manager**
- **wb-change-text**

---

## How To Update Each Component

1. **Refactor Constructor**
   - Add `this.attachShadow({ mode: 'open' })` in the constructor if not present.
   - Move all rendering logic to use `this.shadowRoot`.

2. **Update Render Method**
   - Change all DOM updates to target `this.shadowRoot` instead of `this`.
   - Ensure styles are included inside the shadow root (inline `<style>` or via adoptedStyleSheets).

3. **CSS Handling**
   - Move component-specific CSS into the shadow root.
   - Remove or refactor global CSS selectors to avoid conflicts.

4. **Event Handling**
   - Ensure event listeners are attached to shadow DOM elements as needed.
   - Confirm custom events bubble correctly if needed (`bubbles`, `composed`).

5. **Testing**
   - Test component in isolation and within demos to confirm encapsulation and correct rendering.
   - Check for CSS conflicts and event propagation issues.

6. **Documentation**
   - Update `claude.md` and main component docs to reflect Shadow DOM usage and migration.
   - Add console log statements for registration and lifecycle events.

7. **Review & Commit**
   - Review code for consistency with WB standards.
   - Commit changes with clear migration notes.

---

> Follow this order and checklist for each component. Prioritize UI/visual components first for maximum impact on user experience and reliability.
