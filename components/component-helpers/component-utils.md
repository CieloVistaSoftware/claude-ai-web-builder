# component-utils.js Usage Report

**Date:** October 26, 2025

## Users of component-utils.js

### Direct Imports/References
- `wb-base.js` (located in `components/wb-base/wb-base.js`)
  - Uses: `reflectAttribute`, `getAttributeOrDefault`, `dispatchWBEvent`, `defineObservedAttributes`

### Indirect Usage via Base Class
- All components that extend `WBBaseComponent` (which itself uses component-utils.js):
  - `wb-event-log.js` (located in `components/wb-event-log/wb-event-log.js`)
  - Any other custom elements extending `WBBaseComponent` (e.g., `WBDemoBase`)

## Details
- `reflectAttribute`, `getAttributeOrDefault`, `dispatchWBEvent`, and `defineObservedAttributes` are utility functions used for attribute reflection, event dispatching, and observed attributes in web components.
- `WBBaseComponent` is the main consumer and exposes these utilities to its subclasses.
- `wb-event-log.js` now extends `WBBaseComponent`, so it also indirectly uses these utilities.

## How Usage Was Determined
- Searched for direct imports and function usages in the codebase.
- Traced inheritance from `WBBaseComponent` to its subclasses.

---
*This report is auto-generated and reflects the state of the codebase as of the date above.*
