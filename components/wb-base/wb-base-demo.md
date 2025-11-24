# WBBaseComponent Demo Guide

## Purpose
This document explains the usage, features, and testing strategy for the `wb-base-demo.html` demo file, which showcases the core capabilities of the `WBBaseComponent` web component base class.

---

## What is `wb-base-demo.html`?
- A demo HTML file for visually and interactively testing `WBBaseComponent`.
- Demonstrates how to extend and use the base class in custom WB components.
- Provides a simple UI to verify lifecycle, event logging, and slot/content helpers.

## Key Features Demonstrated
- **Shadow DOM attachment**
- **Automatic style loading**
- **Theme and event log integration**
- **Slot/content helpers**
- **Custom event dispatching**
- **Error reporting and logging**

## How to Use
1. Open `wb-base-demo.html` in your browser (served via local dev server).
2. Interact with the demo component (`<wb-demo-base>`), observe console logs and UI updates.
3. Test theme switching, event logging, and slot content.

## Demo Component Example
```html
<wb-demo-base></wb-demo-base>
```

## What to Look For
- The demo component should display a message: "WBBaseComponent is working!"
- Console logs should show lifecycle events and info/debug/error logs.
- Theme changes and custom events should be reflected in the UI and logs.

## Testing Checklist
- [ ] Component renders and attaches shadow root
- [ ] Styles load correctly
- [ ] Event log is accessible and updates
- [ ] Custom events are dispatched and received
- [ ] Slot/content helpers work as expected
- [ ] No errors in browser console

## Advanced Usage
- Extend `WBBaseComponent` in your own components and add them to the demo for further testing.
- Use browser console to call static methods (e.g., `WBBaseComponent.logEvent('Test', 'info')`).

## Troubleshooting
- If the demo does not render, check for missing imports or script errors in the console.
- Ensure the local dev server is running and serving the correct directory.
- Verify that `wb-base.js` is up to date and error-free.

---
*This documentation is auto-generated and reflects the state of the demo as of October 26, 2025.*
