# Component: wb-xtest

**Status**: ✅ COMPLETE
**Last Updated**: October 22, 2025

---

## Quick Summary

**Purpose**: [Component purpose/description]
**Dependencies**: wb-base (or list dependencies)
**Size**: Check actual file size
**Location**: /components/wb-xtest/claude.md

---
## Component Status: 🟢 Complete Demo Template

### Last Updated
October 21, 2025

## Purpose

This component serves as the **official template and reference implementation** for creating WB component demo pages. It demonstrates all required features, patterns, and best practices.

## What Was Built

### Component Demo Page (`wb-xtest-demo.html`)
A fully-featured demo page template with:

#### 1. **Two-Tab Navigation**
- 📖 Documentation Tab - Markdown rendering
- 🎯 Examples Tab - Live component demos

#### 2. **Example Sections**
- Multiple demo sections with live components
- Code blocks showing the HTML markup
- Clear, scannable format

#### 3. **💥 Error Testing Section**
- Red "Throw Test Error" button
- Simulates nested errors (level1 → level2 → level3)
- Auto-scrolls to Event Log
- Browser history integration (back button works!)

#### 4. **📡 Event Monitor** (at bottom)
Three-part system:

**A. Event Listener Code Examples**
Shows developers how to listen for:
- `component:ready` events
- `component:change` events
- Click events on components

**B. Live Event Log**
- Real-time event display
- Event counter
- Clear button
- Color-coded by type:
  - 🟢 Green - READY
  - 🟠 Orange - CLICK
  - 🟣 Purple - CHANGE
  - 🔴 Red - ERROR

**C. Stack Traces with Auto-Copy**
- Click "📋 View Stack Trace" to:
  - ✅ Copy to clipboard
  - 👉 Highlight error source (first line)
  - 🎉 Show green toast notification
- Formatted with syntax highlighting
- Scrollable for long traces

#### 5. **Advanced Features**
- ⏱️ **Millisecond timestamps** - HH:MM:SS.mmm
- 🔙 **History API** - Back button returns to previous scroll position
- 🎨 **Smooth scrolling** - Professional animations
- 📋 **One-click copy** - Stack traces to clipboard
- ✅ **Toast notifications** - Animated feedback
- 🎯 **Error highlighting** - Shows where to look first

## Technical Implementation

### Key Functions
```javascript
logEvent(type, details, className)        // Logs events with stack traces
showCopyToast()                           // Shows copy notification
toggleStackAndCopy(stackId)               // Copies & toggles stack trace
throwTestError()                          // Error simulation + auto-scroll
clearEventLog()                           // Resets the event log
```

### History API Integration
```javascript
// Saves scroll position before navigating
history.pushState({ scrollPosition: currentPosition }, '', '#event-log');

// Restores position on back button
window.addEventListener('popstate', (event) => { ... });
```

### Event Capture System
- Captures all component lifecycle events
- Records precise timestamps with milliseconds
- Captures full stack traces for debugging
- Stores last 50 events (rolling window)

## How It Works

### For Developers Using This Template

1. **Copy `wb-xtest-demo.html`** as your starting point
2. **Find/Replace** `xtest` → your component name
3. **Add your examples** in the Examples tab
4. **Update documentation** in the markdown file
5. **Test all features**:
   - Click components → see events
   - Throw error → see auto-scroll
   - View stack trace → see clipboard copy
   - Click back button → return to position

### Event Flow

```
User Action (click, etc.)
    ↓
Event Listener fires
    ↓
logEvent() called
    ↓
Captures: timestamp, stack trace, details
    ↓
Creates HTML entry with:
    - Timestamp display
    - Event type & details
    - Collapsible stack trace
    - Auto-copy functionality
    ↓
Adds to event log (top position)
    ↓
User can click to view/copy stack trace
```

### Auto-Scroll Flow

```
Click "Throw Test Error"
    ↓
Save current scroll position
    ↓
Push to browser history
    ↓
Add #event-log to URL
    ↓
Smooth scroll to Event Log
    ↓
User clicks back button ←
    ↓
Restore previous scroll position
```

## Documentation References

### Created Documentation
- **Complete Guide**: `/docs/demo-template-guide.md`
  - Full specifications
  - All features explained
  - Implementation details
  - Code examples

- **Quick Reference**: `/docs/demo-template-checklist.md`
  - Fast lookup
  - Must-have features
  - Testing checklist
  - Color palette

### Template Files
- **Demo HTML**: `wb-xtest-demo.html` (use this!)
- **Component JS**: `wb-xtest.js`
- **Component CSS**: `wb-xtest.css`
- **Documentation**: `wb-xtest.md`

## Issues Resolved

### ✅ Module Loading
- Fixed ES6 import issues
- Proper Vite integration
- Shadow DOM rendering

### ✅ Markdown Parsing
- Added marked.js CDN
- Proper async loading
- Error handling

### ✅ Stack Trace Display
- Formatted with highlighting
- Error source highlighted (👉 first line)
- Scrollable containers
- Plain text for clipboard

### ✅ Browser Integration
- History API for navigation
- Smooth scroll animations
- URL hash updates
- Back/forward button support

### ✅ UX Enhancements
- Millisecond timestamps
- Color-coded events
- Toast notifications
- One-click copy
- Auto-scroll to events

## Known Issues

### None Currently
All features working as designed.

## Testing Checklist

- [x] Click components → events log correctly
- [x] Throw error → auto-scrolls to log
- [x] View stack trace → copies to clipboard
- [x] Toast notification → appears and fades
- [x] Browser back → returns to position
- [x] Browser forward → returns to log
- [x] Clear log → resets counter
- [x] All colors render correctly
- [x] Documentation loads and parses
- [x] Millisecond timestamps display
- [x] Error source highlighted
- [x] All event types color-coded

## Component Architecture

### Web Component (wb-xtest.js)
- Extends WBBaseComponent
- Uses shadow DOM
- Reactive signal-based state
- Custom events dispatched
- Attribute observation

### Styling (wb-xtest.css)
- Button-like appearance
- Hover effects
- Two variants (primary/secondary)
- Responsive design

### Demo Page (wb-xtest-demo.html)
- Standalone HTML file
- No build step required
- Loads component as ES6 module
- Full-featured debugging environment

## Next Steps for New Components

1. Copy this template
2. Rename files and component
3. Implement component logic
4. Add specific examples
5. Update documentation
6. Test thoroughly
7. Deploy

---

## Why This Template Matters

This isn't just a demo—it's a **complete debugging and development environment** that:

✅ Shows developers exactly how to use your component  
✅ Provides real-time event monitoring  
✅ Captures full stack traces for debugging  
✅ Integrates with browser navigation  
✅ Gives professional UX feedback  
✅ Makes it easy to copy/paste error details  
✅ Works standalone (no build required)  

**Every WB component should use this template as its foundation.** 🎯




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

