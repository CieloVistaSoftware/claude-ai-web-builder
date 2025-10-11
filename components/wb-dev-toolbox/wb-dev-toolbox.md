

# WB Dev Toolbox

A web component that logs JavaScript errors and resource load failures directly in the page. Useful for debugging and live error monitoring in development environments.

## Integration with wb-event-log
`wb-dev-toolbox` now publishes all log entries as custom events (e.g., `wb:error`, `wb:info`) on `document`. This allows `wb-event-log` to act as an observer and display all errors, warnings, and info messages captured by the toolbox. For best results, use both components together in your demos or apps.

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

*This file is required for documentation to show in WB demos. Rename or update as needed.*
