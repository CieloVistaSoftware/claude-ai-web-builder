# WB Event Log Component

## Issues Fixed

### ✅ Event Line Spacing Issue
**Problem**: Events were not displaying on separate lines properly - they appeared to run together without clear visual separation.

**Root Cause**: The CSS for `.wb-event-log-event` was missing proper spacing between individual event entries. While events were rendered as separate `div` elements with `display: flex`, there was no margin to create visual separation.

**Solution**: Added the following CSS properties to improve line separation:
- `.wb-event-log-events`: `display: block; width: 100%;` - Ensures proper container display
- `.wb-event-log-event`: `margin-bottom: 2px; border-bottom: 1px solid rgba(0, 0, 0, 0.05); clear: both;` - Creates visual separation between events
- `white-space: nowrap` - Prevents text wrapping within individual events
- `width: 100%` and `box-sizing: border-box` - Ensures proper sizing

**Location**: `wb-event-log.css` lines 164-186

**Status**: ✅ Fixed

### 🔍 Event Persistence Investigation
**Issue**: User reports that event log is not accumulating events properly - previous events may be getting cleared.

**Expected Behavior**: Events should accumulate up to maxEvents limit (1000) and only be cleared when user manually clicks the Clear button (🗑️).

**Current Implementation**: 
- `addEvent()` uses `renderEvent()` which calls `insertAdjacentHTML('afterbegin', eventHTML)` to add individual events
- `refreshEvents()` uses `innerHTML = this.renderEvents()` which rebuilds all events (called on filter changes, search, etc.)
- Events are stored in `this.events` array with `unshift()` (newest first)

**Investigation Needed**: Check if `refreshEvents()` is being called unnecessarily when new events are added.

**Status**: 🔍 Under investigation

## Component Overview

The WB Event Log is a passive, zero-configuration Web Component that automatically captures and displays application events. It listens for `wb:*` prefixed custom events and provides a clean, readable interface for debugging and monitoring.

### Key Features
- **Passive Operation**: No initialization required, just add `<wb-event-log></wb-event-log>` to HTML
- **Auto-capture**: Listens for `wb:info`, `wb:warning`, `wb:error`, `wb:success`, `wb:debug`, and `wb:user` events
- **Real-time Display**: Events appear immediately with proper line separation
- **Filtering**: Toggle event types on/off
- **Search**: Find specific events by content
- **Export**: Copy or export event data
- **Responsive**: Adjusts to container size

### Usage
```html
<!-- Simple usage - zero configuration -->
<wb-event-log></wb-event-log>
```

```javascript
// Dispatch events for logging
document.dispatchEvent(new CustomEvent('wb:info', {
    detail: { message: 'Component initialized' }
}));

document.dispatchEvent(new CustomEvent('wb:error', {
    detail: { message: 'Something went wrong', source: 'my-component' }
}));
```

## Technical Notes

- **Architecture**: Pure Web Component extending HTMLElement
- **Event System**: Uses document-level event listeners for `wb:*` events
- **Display**: Events show in newest-first order with proper line spacing
- **Styling**: Uses CSS flexbox with proper margins for clean line separation
- **Performance**: Maintains maximum event limit (configurable, default 1000)

## Dependencies

- Optional: `WBComponentUtils` for enhanced path detection and CSS loading
- Fallback: Works standalone without dependencies

## Configuration

The component loads configuration from `wb-event-log.json` but works with sensible defaults if the file is not available.