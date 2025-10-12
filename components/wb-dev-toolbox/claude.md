# ./components/wb-dev-toolbox/claude.md - WB Dev Toolbox

## Compliance Note
This component is **compliant** with the project rules as of January 2025:
- Uses reactive coding with Proxy-based state management
- Is a proper Web Component extending HTMLElement
- Follows all requirements in [docs/claude-md-compliance-table.md](../../docs/claude-md-compliance-table.md)

**Component/Directory:** `components/wb-dev-toolbox/`

**Documentation:** [wb-dev-toolbox.md](./wb-dev-toolbox.md)

---

## 🕒 RECENT ACTIVITY (January 2025 - Most Recent First)

### ✅ Reactive Refactoring Complete (January 10, 2025)
- **Issue**: Component was using imperative code with direct event listeners
- **Fix**: Refactored to use reactive Proxy-based state management
- **Changes**:
  - Added reactive state proxy for log entries and settings
  - Added observedAttributes for show-local-log and max-entries
  - Implemented attributeChangedCallback for reactive attribute handling
  - Made render method reactive (triggered by state changes)
  - Added proper event listener cleanup
  - Added support for listening to wb: events from other components
- **Result**: Component now fully reactive and compliant

---
# WB Dev Toolbox

A web component that logs JavaScript errors and resource load failures directly in the page. Useful for debugging and live error monitoring in development environments.

## Features
- Captures and displays:
  - JavaScript runtime errors
  - Unhandled promise rejections
  - Resource load errors (scripts, images, links)
- Dark mode friendly, styled for visibility
- Keeps a rolling log of the last 50 events
- Easy to drop into any HTML page

## Usage
```html
<!-- Load the component -->
<script src="../../components/wb-dev-toolbox/wb-dev-toolbox.js"></script>
<!-- Place the toolbox anywhere in your page -->
<wb-dev-toolbox></wb-dev-toolbox>
```

## Example
```html
<wb-dev-toolbox></wb-dev-toolbox>
<button onclick="notAFunction()">Trigger JS Error</button>
<script src="missing-script.js"></script>
```

## Customization
- The component is styled for dark backgrounds by default.
- You can adjust the `maxEntries` property in JS if you want to keep more or fewer log entries.

## Limitations
- Some resource load errors (especially cross-origin) may not be fully visible due to browser security restrictions.
- Does not capture network requests that do not result in a DOM error (e.g., XHR/fetch failures).

---

**Author:** Claude AI Web Builder Team
