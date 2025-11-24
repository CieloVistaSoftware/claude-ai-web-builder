# HTML Files Guide - Backend Requirements

**This document maps every HTML file to its backend requirements.**

---

## 🎯 Quick Summary

| Backend Needed? | Count | Examples |
|-----------------|-------|----------|
| ❌ No Backend | 17 | wb.html, index.html, test files, demos |
| ✅ Requires Backend | 2 | claude-api-test.html, api-test-client.html |
| 🔄 Optional Backend | 2 | depends on features used |

---

## ❌ Frontend Only - No Backend Required

These HTML files run **completely in the browser** with no server dependencies.

### Main Application Files

| File | Location | Purpose | Port | Notes |
|------|----------|---------|------|-------|
| **wb.html** | Root | Main WB Framework demo | 8080 | Uses CSS variables for theming, no API calls |
| **index.html** | Root | Complete semantic HTML5 demo | 8080 | Full control panel integration, interactive elements |

**How to run:**
```bash
npm run dev:s          # Serve on 8080
# Then open http://localhost:8080/wb.html or /index.html
```

---

### Component Test Files

| File | Location | Purpose | What It Tests |
|------|----------|---------|---------------|
| **test-simple-control-panel.html** | html/ | Control panel basic functionality | Hue/saturation/lightness sliders, mode toggle |
| **test-control-panel-events.html** | html/ | Event dispatching from control panel | wb:color-changed, wb:mode-changed events |
| **test-component-ecosystem.html** | html/ | Component registry integration | Component loading, dependency resolution |
| **test-color-bars.html** | html/ | Color bar components | Visual color display, harmonic relationships |
| **test-wb-layout-reactive.html** | html/ | Layout reactivity | Layout switching, responsive behavior |
| **control-panel-comprehensive-test.html** | html/ | Complete control panel testing | All sliders, all events, all modes |
| **components-fixed-test.html** | html/ | Component fixes validation | Bug fixes verification |
| **final-ecosystem-test.html** | html/ | Final integration tests | Complete ecosystem health check |

**How to run any test file:**
```bash
npm run dev:s
# Then navigate to http://localhost:8080/html/test-simple-control-panel.html
```

---

### Debug & Diagnostic Files

| File | Location | Purpose | What It Shows |
|------|----------|---------|---------------|
| **debug-control-panel.html** | html/ | Control panel debugging | Console logs, event details |
| **debug-console-check.html** | html/ | Console output verification | Checks if logs are outputting correctly |
| **component-diagnosis.html** | html/ | Component health check | Which components load, which fail |
| **debug-dropdown-issue.html** | html/ | Dropdown testing | Specific dropdown component issues |

**Purpose:**
- Use these to diagnose frontend issues
- No backend required - all debug output is client-side

---

### Utility & Generator Files

| File | Location | Purpose | Generates |
|------|----------|---------|-----------|
| **favicon-generator.html** | html/ | Favicon creation tool | SVG/PNG favicon files |
| **symbol_table_builder.html** | html/ | Symbol table builder | Component symbol maps |
| **validation-report.html** | html/ | Validation checker | Component validation reports |
| **wave-based-color-harmony-article.html** | html/ | Color harmony tutorial | Educational content on HCS |

---

### Color Harmony System

| File | Location | Purpose | Demonstrates |
|------|----------|---------|--------------|
| **Color Harmony System/** | html/ | Complete color system | All HCS features, calculations |

---

## ✅ Requires Backend - Must Run Server

These HTML files **need a backend server** to function.

### API Test Files

#### 1. **claude-api-test.html**

**Location:** `html/claude-api-test.html`

**What it does:**
- Tests Claude Events API endpoints
- Queries event logs from all `claude.md` files
- Can save new events to claude.md files

**Backend requirements:**
```bash
npm run api              # Starts Events API server on port 3000
```

**What it tests:**
```
GET /api/health          # Check if API is running
GET /api/events          # Get all events
GET /api/errors          # Get error-level events only
GET /api/recent/N        # Get events from last N hours
GET /api/events/directory # Get events from specific directory
POST /api/save-claude-log # Save new event log
```

**How to use:**
```bash
# Terminal 1
npm run api              # Start the API server

# Terminal 2  
npm run dev:s            # Start frontend server

# Browser
http://localhost:8080/html/claude-api-test.html
```

**What to expect:**
- All buttons will show green ✅ if API is running
- Buttons will show red ❌ if API is down
- Click buttons to test each endpoint

---

#### 2. **api-test-client.html**

**Location:** `html/api-test-client.html`

**What it does:**
- Alternative API testing interface
- Similar functionality to claude-api-test.html
- Different UI, same backend

**Backend requirements:**
```bash
npm run api              # Same API server
```

**How to use:**
```bash
# Terminal 1
npm run api

# Terminal 2  
npm run dev:s

# Browser
http://localhost:8080/html/api-test-client.html
```

---

## 🔄 Optional Backend (Works Either Way)

These CAN run without backend but have better features WITH backend.

### 1. Demos with Optional Features

Some demo files work without backend but may have reduced functionality:

```html
<!-- These work fine without backend -->
wb.html              ✅ Works 100% without backend
index.html           ✅ Works 100% without backend

<!-- These might have demo/real data options -->
final-ecosystem-test.html  ✅ Frontend works, backend optional for real data
```

---

## 📊 HTML Files by Directory

### Root Level
```
wb.html                    ❌ Frontend only
index.html                 ❌ Frontend only
api-test-client.html       ✅ Requires Backend (API)
claude-api-test.html       ✅ Requires Backend (API)
```

### html/ Directory
```
# Component Tests (All Frontend Only)
test-simple-control-panel.html         ❌ Frontend
test-control-panel-events.html         ❌ Frontend
test-component-ecosystem.html          ❌ Frontend
test-color-bars.html                   ❌ Frontend
test-wb-layout-reactive.html           ❌ Frontend
control-panel-comprehensive-test.html  ❌ Frontend
components-fixed-test.html             ❌ Frontend
final-ecosystem-test.html              ❌ Frontend

# Debug Files (All Frontend Only)
debug-control-panel.html               ❌ Frontend
debug-console-check.html               ❌ Frontend
component-diagnosis.html               ❌ Frontend
debug-dropdown-issue.html              ❌ Frontend

# Utilities (All Frontend Only)
favicon-generator.html                 ❌ Frontend
symbol_table_builder.html              ❌ Frontend
validation-report.html                 ❌ Frontend
wave-based-color-harmony-article.html  ❌ Frontend
```

---

## 🚀 Quick Start Scenarios

### Scenario 1: Test Control Panel
```bash
npm run dev:s          # Frontend only
# Open: http://localhost:8080/html/test-simple-control-panel.html
```

### Scenario 2: Test Components Integration
```bash
npm run dev:s          # Frontend only
# Open: http://localhost:8080/html/test-component-ecosystem.html
```

### Scenario 3: Test API Features
```bash
# Terminal 1
npm run api            # Backend API server

# Terminal 2  
npm run dev:s          # Frontend server

# Browser
http://localhost:8080/html/claude-api-test.html
```

### Scenario 4: Full Demo Experience
```bash
npm run dev:s          # Frontend only
# Open: http://localhost:8080/wb.html or /index.html
```

---

## 🔍 How to Tell What a File Needs

### Check the HTML file for these clues:

**Signs it needs BACKEND:**
```javascript
// API calls
fetch('/api/health')
fetch('http://localhost:3000/api/...')

// WebSocket connections
new WebSocket('ws://localhost:3000')

// Socket.io
io('http://localhost:3000')

// Server-side data
document.addEventListener('wb:backend-data-received')
```

**Signs it's FRONTEND ONLY:**
```javascript
// Local calculations
const colors = generateHarmonicColors(hue)

// Component registration
customElements.define('wb-color-bar', WBColorBar)

// Event dispatching (no server involved)
document.dispatchEvent(new CustomEvent('wb:color-changed'))

// Canvas/SVG generation
const canvas = document.createElement('canvas')
```

---

## 📋 Testing Checklist

### For Frontend-Only Files
```bash
✅ npm run dev:s
✅ Navigate to file
✅ Check browser console (F12)
✅ Look for any errors about "localhost:3000" or "Cannot fetch"
✅ If no backend errors = File is truly frontend-only
```

### For Backend-Requiring Files
```bash
❌ npm run dev:s alone (will show errors)
✅ npm run api (Terminal 1)
✅ npm run dev:s (Terminal 2)
✅ Navigate to file
✅ Check if API endpoints respond
✅ If all green = Backend is working
```

---

## 🗂️ Recommended File Organization

### For Documentation:
```
docs/
├── html-files-guide.md (this file)
├── backend-requirements/
│   ├── frontend-only.md
│   ├── api-required.md
│   └── optional-backend.md
```

### For Quick Reference:
```
Create a comments section in each HTML file:

<!-- 
BACKEND REQUIREMENTS: Frontend Only
REQUIRED SERVERS: None
HOW TO RUN: npm run dev:s
RUN AT: http://localhost:8080/html/test-simple-control-panel.html
-->

<!-- 
BACKEND REQUIREMENTS: Requires Backend (API)
REQUIRED SERVERS: npm run api (port 3000)
HOW TO RUN: Terminal 1: npm run api | Terminal 2: npm run dev:s
RUN AT: http://localhost:8080/html/claude-api-test.html
-->
```

---

## 🎯 Summary Table

| File | Backend | Port | Command | Browser URL |
|------|---------|------|---------|------------|
| **wb.html** | ❌ No | 8080 | `npm run dev:s` | http://localhost:8080/wb.html |
| **index.html** | ❌ No | 8080 | `npm run dev:s` | http://localhost:8080/index.html |
| **test-simple-control-panel.html** | ❌ No | 8080 | `npm run dev:s` | http://localhost:8080/html/test-simple-control-panel.html |
| **claude-api-test.html** | ✅ Yes (API) | 8080 + 3000 | `npm run api` + `npm run dev:s` | http://localhost:8080/html/claude-api-test.html |
| **api-test-client.html** | ✅ Yes (API) | 8080 + 3000 | `npm run api` + `npm run dev:s` | http://localhost:8080/html/api-test-client.html |

---

## ⚡ Pro Tips

### Tip 1: Add Custom Comments to HTML Files
```html
<!-- START: Header Block -->
<!-- 
📋 FILE METADATA
Name: test-simple-control-panel.html
Purpose: Test control panel slider functionality
Backend: ❌ Frontend Only - No Backend Required
How to Run: npm run dev:s
Access At: http://localhost:8080/html/test-simple-control-panel.html
-->
<!-- END: Header Block -->
```

### Tip 2: Create Navigation File
```html
<!-- Create html/INDEX.html with links to all test files -->
<h1>WB Component Tests</h1>

<h2>Frontend Only (No Server Needed)</h2>
<ul>
  <li><a href="test-simple-control-panel.html">Simple Control Panel Test</a></li>
  <li><a href="test-control-panel-events.html">Control Panel Events</a></li>
  <li>...</li>
</ul>

<h2>Requires Backend (API Server)</h2>
<ul>
  <li><a href="claude-api-test.html">Claude API Test</a> - Requires: npm run api</li>
  <li>...</li>
</ul>
```

### Tip 3: Automated Backend Detection
```javascript
// Add to every HTML file's console for instant feedback
(function() {
  const hasBackend = {
    api: false,
    socket: false,
    mcp: false
  };
  
  // Test API
  fetch('http://localhost:3000/api/health')
    .then(() => { hasBackend.api = true; })
    .catch(() => { hasBackend.api = false; });
  
  setTimeout(() => {
    console.log('🖥️ Backend Status:', hasBackend);
  }, 1000);
})();
```

---

**Last Updated:** October 2025  
**Framework:** WB (Website Builder)  
**Total HTML Files:** 19  
**Frontend Only:** 17 | **Requires Backend:** 2
