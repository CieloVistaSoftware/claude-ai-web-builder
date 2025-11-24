# WB Component Demo Template - Complete Guide

## Overview
This document defines the standard template for creating component demo pages in the WB (Website Builder) system.

## File Structure
Every component demo consists of:
```
/components/wb-{component-name}/
├── wb-{component-name}.js         # Component logic
├── wb-{component-name}.css        # Component styles
├── wb-{component-name}-demo.html  # Demo page (this template)
├── wb-{component-name}.md         # Documentation
└── wb-{component-name}.schema.json # Schema/config
```

## Demo Page Template Features

### 1. **Page Structure**
- **Browser Title**: `<wb-component-name> - Demo`
- **H1 Header**: `<code><wb-component-name></code> Demo`
  - Component name styled as code element
  - Purple/indigo color (#6366f1)
  - Monospace font
  - Larger than normal text

### 2. **Tab Navigation**
Two main tabs:
- 📖 **Documentation** - Rendered markdown
- 🎯 **Examples** - Live component examples

### 3. **Examples Tab Sections**

#### A. Component Examples (Multiple Sections)
Each example section includes:
- **Section Title** (h2 with emoji)
- **Demo Row** - Live rendered components
- **Code Label** - "💻 Code"
- **Code Block** - HTML markup to create the examples

Example structure:
```html
<div class="demo-section">
    <h2>🎯 Basic Usage</h2>
    <div class="demo-row">
        <!-- Live components here -->
    </div>
    <span class="code-label">💻 Code</span>
    <div class="code-block">
        <pre><code><!-- HTML markup here --></code></pre>
    </div>
</div>
```

#### B. Error Testing Section
- **Purpose**: Test error handling
- **Button**: "💥 Throw Test Error"
- **Functionality**: 
  - Simulates nested error (level1 → level2 → level3)
  - Auto-scrolls to Event Log
  - Adds to browser history (back button works)
- **Shows Code**: How the error test works

#### C. Event Monitor Section (Bottom)
Located at the bottom with three parts:

**Part 1: Event Listener Code Examples**
```javascript
// Shows developers how to listen for:
- component:ready events
- component:change events  
- Click events on components
```

**Part 2: Live Event Log**
Features:
- **Event Counter** - Total events logged
- **Clear Button** - Reset the log
- **Real-time Display** - Events appear instantly
- **Color Coding**:
  - 🟢 Green - READY events
  - 🟠 Orange - CLICK events
  - 🟣 Purple - CHANGE events
  - 🔴 Red - ERROR events

**Part 3: Event Entry Details**
Each event shows:
- ⏱️ **Timestamp** - HH:MM:SS.mmm (with milliseconds)
- **Event Type** - READY, CLICK, CHANGE, ERROR
- **Event Details** - Specific information
- **Stack Trace Toggle** - "📋 View Stack Trace (Click to Copy)"
  - Click to view/hide stack trace
  - **Auto-copies to clipboard**
  - **Green toast notification** - "✅ Stack trace copied to clipboard!"
  - **First line highlighted** (for errors) - 👉 Shows where error originated

### 4. **Stack Trace Features**

#### Highlighting
For ERROR events:
- First stack line highlighted in **yellow/gold**
- Bold text with left border
- 👉 Arrow indicator
- Shows developer exactly where to look first

#### Copy to Clipboard
When clicking "View Stack Trace":
1. Copies plain text to clipboard
2. Shows animated toast notification (3 seconds)
3. Toast slides in from right
4. Toast slides out automatically

### 5. **Auto-Scroll with History**

When "💥 Throw Test Error" is clicked:
1. Logs error to Event Monitor
2. **Saves current scroll position** to history
3. Adds `#event-log` to URL
4. **Smoothly scrolls** to Event Log
5. Browser back button (←) returns to previous position
6. Browser forward button (→) returns to Event Log

History API usage:
```javascript
history.pushState(
    { scrollPosition: currentPosition }, 
    '', 
    '#event-log'
);
```

### 6. **Styling Standards**

#### Colors
- Background: `#18181b` (dark)
- Text: `#fff` (white)
- Primary: `#6366f1` (indigo)
- Success/Ready: `#10b981` (green)
- Warning/Click: `#f59e0b` (orange)
- Error: `#ef4444` (red)
- Change: `#8b5cf6` (purple)
- Code blocks: `#1a1a1a`
- Demo sections: `#23232b`

#### Typography
- Body font: `system-ui, sans-serif`
- Code font: `'Courier New', monospace`
- H1: `2.5rem`, weight `700`
- H2: `1.5rem`
- Code in H1: `2.25rem`, color `#6366f1`

#### Layout
- Max width: `1200px` (centered)
- Padding: `2rem`
- Border radius: `6px` (cards), `8px` (sections)
- Gap between elements: `1rem`

### 7. **Required Scripts**

#### External Dependencies
```html
<!-- Markdown parser -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

#### Component Loading
```html
<script type="module">
    import './wb-{component-name}.js';
</script>
```

#### Event System
Must implement:
- `logEvent(type, details, className)` - Log events with stack traces
- `showCopyToast()` - Display copy notification
- `toggleStackAndCopy(stackId)` - Toggle and copy stack trace
- `throwTestError()` - Error simulation with auto-scroll
- `clearEventLog()` - Clear all events

### 8. **Documentation Tab**

Features:
- Loads markdown from `wb-{component-name}.md`
- Parses with marked.js
- Displays in styled container
- Handles errors gracefully

### 9. **Responsive Design**

- Works on desktop and mobile
- Flexbox layouts with wrapping
- Scrollable event log (400px max height)
- Scrollable stack traces (250px max height)

## Implementation Checklist

When creating a new component demo:

- [ ] Update component name in title (browser tab)
- [ ] Update component name in H1 with `<code>` tags
- [ ] Create at least 3 example sections
- [ ] Include code blocks for all examples
- [ ] Add Error Testing section
- [ ] Implement Event Monitor with:
  - [ ] Event listener code examples
  - [ ] Live event log
  - [ ] Stack trace with copy
  - [ ] Toast notifications
  - [ ] Auto-scroll with history
- [ ] Style with standard colors
- [ ] Load component as ES6 module
- [ ] Test all event types
- [ ] Test browser back/forward navigation
- [ ] Verify markdown documentation loads

## Key Benefits

✅ **Professional debugging** - Stack traces with one-click copy  
✅ **Developer-friendly** - Shows exact code to use  
✅ **Interactive** - Live components + real-time events  
✅ **Complete documentation** - Markdown + examples  
✅ **Browser integration** - History API for navigation  
✅ **Visual feedback** - Toast notifications, color coding  
✅ **Detailed timing** - Millisecond timestamps  
✅ **Error highlighting** - Shows where to look first  

## Files to Reference

- **This Template**: `/components/wb-xtest/wb-xtest-demo.html`
- **Component JS**: `/components/wb-xtest/wb-xtest.js`
- **Component CSS**: `/components/wb-xtest/wb-xtest.css`
- **Documentation**: `/components/wb-xtest/wb-xtest.md`

## Usage

Copy `wb-xtest-demo.html` as your starting template, then:
1. Find/replace `xtest` with your component name
2. Add your specific examples
3. Update documentation
4. Test all features

---

**This is now the official WB Component Demo Template Standard** 🎯
