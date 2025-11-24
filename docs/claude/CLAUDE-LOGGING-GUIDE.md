# 📝 Claude Logging System Guide

## Overview
The Claude Logging System automatically logs component testing, issues, fixes, and interactions to `claude.md` files in component directories. This creates a persistent development history that AI assistants can read to understand component evolution.

## Quick Start

### 1. Start the Server
```powershell
cd server
node claude-events-api.js
```
Or use the VS Code task: **Start Claude Events API Server**

### 2. Include the Logger in Your Demo/Test Page
```html
<script type="module">
    import ClaudeLogger from '../utils/claude-logger.js';
    await ClaudeLogger.init();
</script>
```

### 3. Use Quick Logging Functions
```javascript
// Log an issue you found while testing
logIssue('Button not responding in dark mode', 
         'Button should trigger event', 
         'Nothing happens on click');

// Log when you fix something
logFix('Button event handler', 
       'Added event listener in connectedCallback');

// Log test results
logTest('Button click test', 'passed', 
        'Event fires correctly');

// Log general notes
logNote('Performance Observation', 
        'Component renders smoothly at 60fps');
```

## Configuration

**File:** `src/config/components.config.json`

```json
{
  "eventLogging": true,
  "claudeLogging": {
    "enabled": true,
    "autoCreateFiles": true,
    "logUserInteractions": true,
    "logComponentEvents": true,
    "logErrors": true,
    "timestampFormat": "ISO",
    "maxEntriesPerSession": 50
  }
}
```

### Configuration Options

- **enabled**: Turn claude logging on/off globally
- **autoCreateFiles**: Auto-create `claude.md` if it doesn't exist
- **logUserInteractions**: Log clicks, inputs, etc.
- **logComponentEvents**: Log custom component events
- **logErrors**: Auto-log JavaScript errors
- **timestampFormat**: "ISO" or "locale"
- **maxEntriesPerSession**: Limit entries per browser session

## Logging API

### Quick Functions (Global)
```javascript
// These are available globally on any page with claude-logger.js

logIssue(description, expectedBehavior, actualBehavior)
logFix(issue, solution)
logTest(testName, result, details)
logNote(title, message)
```

### Full API (via ClaudeLogger object)
```javascript
// Main logging method
await ClaudeLogger.log(title, message, type, metadata)

// Specialized logging
await ClaudeLogger.logInteraction(action, details)
await ClaudeLogger.logEvent(eventName, eventData)
await ClaudeLogger.logError(error, context)
await ClaudeLogger.logTest(testName, result, details)
await ClaudeLogger.logFix(issue, solution)
await ClaudeLogger.logIssue(description, expected, actual)

// Session management
ClaudeLogger.exportSessionLogs()  // Download as markdown
ClaudeLogger.getStoredLogs()      // Get from localStorage
ClaudeLogger.clearStoredLogs()    // Clear localStorage
```

## Log Entry Format

Each entry is written to the component's `claude.md` file:

```markdown
### 🔴 Issue: Button not responding in dark mode

**Date:** 2025-11-21T10:30:00.000Z  
**Type:** issue  
**URL:** http://localhost:8080/components/wb-button/demo.html  

**Expected:** Button should trigger event

**Actual:** Nothing happens on click

**Metadata:**
```json
{
  "category": "issue",
  "description": "Button not responding in dark mode"
}
```

---
```

## Usage Scenarios

### Scenario 1: Testing a Component Demo
```javascript
// Open demo page: components/wb-button/demo.html
// Click around and test features

// Found an issue?
logIssue('Primary button unresponsive', 
         'Click should emit wb:click event',
         'No event fired, console shows nothing');

// After investigating and fixing
logFix('Button click handler', 
       'Added super.connectedCallback() to inherit event listeners');

// Verify fix works
logTest('Button interaction test', 'passed', 
        'Primary button now emits wb:click correctly');
```

### Scenario 2: Debugging Dark Mode
```javascript
// Component not showing in dark mode
logIssue('Component not dark', 
         'Should use dark theme variables',
         'Still showing light colors');

// Check the fix
logNote('Dark mode investigation', 
        'Found missing super.connectedCallback() call');

logFix('Dark mode inheritance', 
       'Added super.connectedCallback() as first line');
```

### Scenario 3: Performance Testing
```javascript
logNote('Performance baseline', 
        'Initial render: 120ms, no jank observed');

// After optimization
logNote('Performance improvement', 
        'Reduced render to 45ms using virtual DOM');

logTest('Performance benchmark', 'passed', 
        'All frames under 16ms, 60fps maintained');
```

## File Structure

### Auto-Created claude.md Template
When a component folder doesn't have a `claude.md` file, the system creates:

```markdown
# wb-component-name - Development Log

**Component:** wb-component-name  
**Created:** 2025-11-21  
**Last Updated:** 2025-11-21

## Overview
This file tracks development progress, issues, fixes, and testing.

---

## Issues
<!-- Issues will be logged here automatically -->

---

## Fixes
<!-- Fixes will be logged here automatically -->

---

## Tests
<!-- Test results will be logged here automatically -->

---

## Notes
<!-- General notes will be logged here automatically -->

---

## Session Logs
<!-- Session logs are appended below -->
```

## Server Endpoints

The claude-events-api.js server provides these endpoints:

### POST /api/claude-log
Write log entries to component claude.md files
```javascript
fetch('/api/claude-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        component: 'wb-button',
        entry: {
            timestamp: new Date().toISOString(),
            title: 'Test completed',
            message: 'All tests passed',
            type: 'info',
            emoji: '✅'
        }
    })
});
```

### GET /api/events
Retrieve all logged events from all claude.md files

### GET /api/errors
Get only error-level events

### GET /api/recent/24
Get events from last 24 hours

## Fallback Behavior

When the server is unavailable:
1. Logs are stored in browser localStorage
2. Retrieve with: `ClaudeLogger.getStoredLogs()`
3. Export as markdown: `ClaudeLogger.exportSessionLogs()`
4. Console message: "💾 Log stored in localStorage (server unavailable)"

## Best Practices

### DO ✅
- Log issues as you find them while testing
- Log fixes immediately after applying them
- Use descriptive titles and clear messages
- Include expected vs actual behavior for issues
- Log test results (passed/failed)
- Add relevant metadata for context

### DON'T ❌
- Log every single interaction (be selective)
- Log sensitive data or credentials
- Forget to start the server before testing
- Ignore localStorage warnings (export logs manually)
- Use vague descriptions like "broken" or "doesn't work"

## Troubleshooting

### Logs not appearing in claude.md?
1. Check server is running: `http://localhost:3001/api/health`
2. Check browser console for errors
3. Verify component name is correct
4. Check localStorage: `ClaudeLogger.getStoredLogs()`

### Server port conflict?
```powershell
# Change port in claude-events-api.js
const PORT = process.env.PORT || 3002;  # Use different port
```

### Can't find logs?
```javascript
// Export from localStorage as fallback
ClaudeLogger.exportSessionLogs();
```

## Demo Page

Test the system: `components/claude-logger-demo.html`

This interactive demo shows:
- How to log issues, fixes, tests, and notes
- Session log display
- Export functionality
- LocalStorage fallback

## Integration with Existing Components

To add logging to any component demo:

```html
<!-- Add to your demo HTML -->
<script type="module">
    import ClaudeLogger from '../../utils/claude-logger.js';
    
    // Set component context
    ClaudeLogger.currentComponent = 'wb-your-component';
    
    // Now use logging functions
    document.querySelector('#test-btn').addEventListener('click', () => {
        logNote('User clicked test button', 'Testing interaction');
    });
</script>
```

## AI Assistant Benefits

AI assistants (Claude, GitHub Copilot, etc.) can:
1. Read `claude.md` files to understand component history
2. See what issues were found and how they were fixed
3. Learn testing patterns from logged test results
4. Understand component evolution over time
5. Provide better suggestions based on actual usage

---

**Happy Logging! 📝**
