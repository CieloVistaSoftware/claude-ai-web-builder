# 📝 Claude Logging System - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1️⃣ Start the Server
```powershell
node src/server/claude-events-api.js
```
Server runs on: `http://localhost:3001`

### 2️⃣ Open Any Demo/Test Page
All component demos will auto-load the logger

### 3️⃣ Log While Testing
```javascript
// Found an issue?
logIssue('Button not working', 'Should click', 'Does nothing');

// Fixed it?
logFix('Event handler', 'Added super.connectedCallback()');

// Test passed?
logTest('Button test', 'passed', 'Clicks work now');
```

## 📝 Quick Logging Commands

| Command | Usage | Example |
|---------|-------|---------|
| `logIssue(desc, expected, actual)` | Log a bug/issue | `logIssue('Color picker broken', 'Opens picker', 'Nothing happens')` |
| `logFix(issue, solution)` | Log a fix | `logFix('Picker issue', 'Fixed z-index conflict')` |
| `logTest(name, result, details)` | Log test result | `logTest('Picker test', 'passed', 'All colors work')` |
| `logNote(title, message)` | General note | `logNote('Performance', 'Renders in 50ms')` |

## 📁 Where Logs Go

Logs are automatically written to:
```
components/
  wb-button/
    claude.md  ← Logs for wb-button
  wb-card/
    claude.md  ← Logs for wb-card
  ...
```

## 🔧 Configuration

**File:** `src/config/components.config.json`

```json
{
  "claudeLogging": {
    "enabled": true,
    "autoCreateFiles": true,
    "logUserInteractions": true,
    "logComponentEvents": true,
    "logErrors": true
  }
}
```

## 🧪 Try the Demo

Open: `components/claude-logger-demo.html`

Interactive demo with example buttons and output display.

## ⚠️ Troubleshooting

**Logs not saving?**
- Check server is running: `http://localhost:3001/api/health`
- Logs fallback to localStorage if server down
- Export with: `ClaudeLogger.exportSessionLogs()`

**Can't find logs?**
```javascript
// View in console
ClaudeLogger.sessionLogs

// Download as file
ClaudeLogger.exportSessionLogs()
```

## 📚 Full Documentation

See: `docs/CLAUDE-LOGGING-GUIDE.md`

---

**Ready to log! 🎉**

When testing demos, just use:
```javascript
logIssue('what went wrong', 'expected', 'actual')
logFix('the problem', 'the solution')
logTest('test name', 'passed', 'details')
```

All logs automatically save to the component's `claude.md` file! ✨
