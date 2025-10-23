# WB Demo Template - Quick Reference

## Must-Have Features ✅

### 1. Header
```html
<title>&lt;wb-component&gt; - Demo</title>
<h1><code>&lt;wb-component&gt;</code> Demo</h1>
```

### 2. Two-Tab Structure
- 📖 Documentation (markdown)
- 🎯 Examples (live demos)

### 3. Example Sections
Each section needs:
- Live rendered components
- Code blocks showing HTML markup
- Clear section titles with emojis

### 4. Error Testing
```javascript
💥 Throw Test Error button
→ Simulates nested errors
→ Auto-scrolls to Event Log
→ Adds to browser history
```

### 5. Event Monitor (Bottom)
**Three parts:**
1. Code examples (how to listen)
2. Live event log with counter
3. Individual events with stack traces

### 6. Event Features
- ⏱️ Millisecond timestamps
- 🎨 Color-coded by type
- 📋 Click to copy stack trace
- ✅ Toast notification on copy
- 👉 Highlighted error source

### 7. Navigation
- Smooth scroll to events
- Browser back button works
- URL shows `#event-log`

## Copy/Paste Template

Use `/components/wb-xtest/wb-xtest-demo.html` as your base template.

## Color Palette
```css
Background:   #18181b
Text:         #fff
Primary:      #6366f1 (indigo)
Success:      #10b981 (green)
Warning:      #f59e0b (orange)
Error:        #ef4444 (red)
Change:       #8b5cf6 (purple)
Code:         #1a1a1a
Sections:     #23232b
```

## Required Functions
```javascript
logEvent(type, details, className)
showCopyToast()
toggleStackAndCopy(stackId)
throwTestError()
clearEventLog()
```

## Testing Checklist
- [ ] Click components → events log
- [ ] Throw error → scrolls down
- [ ] View stack trace → copies to clipboard
- [ ] Browser back → returns to top
- [ ] Clear log → resets counter
- [ ] All colors correct
- [ ] Documentation loads
- [ ] Toast notification shows

---
**Now standardized across all WB components!** 🚀
