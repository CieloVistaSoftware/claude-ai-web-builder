# NPM Scripts & Package Management Guide

## 📊 Overview

This document organizes all npm scripts by their dependency type:
- **Frontend Only** - No backend required
- **Requires Backend** - Needs server running
- **Optional Backend** - Works with or without server

---

## ✨ Frontend Only (Pure Client-Side)

These scripts run **entirely in the browser** with no backend requirements.

### Basic Development & Serving

| Command | Simplified | Purpose |
|---------|-----------|---------|
| `npm run dev:simple` | `npm run dev:s` | Start local server on port 8080, serve `wb.html` |
| `npm run dev:watch` | `npm run watch` | Watch component files for changes |
| `npm run serve:root` | `npm run serve:r` | Serve dist folder on port 8080 |
| `npm run kill-port` | `npm run kill` | Kill any running node process on ports |

### Component Development

| Command | Simplified | Purpose |
|---------|-----------|---------|
| `npm run new` | `npm new` | Create new web component (interactive) |
| `npm run discover` | `npm discover` | Auto-discover all components in project |
| `npm run build:html-data` | `npm run build:html` | Generate component JSON metadata |
| `npm run build:imports` | `npm run build:imports` | Generate main import statements |
| `npm run build:demos` | `npm run build:demos` | Generate demos manifest |
| `npm run build:audit` | `npm run audit` | Audit all components for issues |

### Schema & Documentation

| Command | Simplified | Purpose |
|---------|-----------|---------|
| `npm run schemas:list` | `npm run list:schemas` | List all `.schema.json` files |
| `npm run schemas:validate` | `npm run validate:schemas` | Validate all schemas |
| `npm run analyze:cem` | `npm run analyze` | Analyze with Custom Elements Manifest |

### File Operations

| Command | Simplified | Purpose |
|---------|-----------|---------|
| `npm run convert` | `npm convert` | Convert files using CLI converter |
| `npm run remove-puppeteer` | `npm remove:puppet` | Remove Puppeteer dependency |

---

## 🖥️ Requires Backend (Server Running)

These scripts need a backend server to function properly.

### API & Socket Server

| Command | Simplified | Purpose | Port | Backend |
|---------|-----------|---------|------|---------|
| `npm run api` | `npm api` | Start Claude Events API | 3000 | Node/Express |
| `npm run claude:server` | `npm claude:s` | Start Claude Socket Server | 3000 | Node/WebSocket |
| `npm run unified:server` | `npm unified:s` | Start Unified WebSocket Server | 3000 | Node/WebSocket |
| `npm run unified:server:mock` | `npm unified:mock` | Start Unified Server with mock responses | 3000 | Node/Mock |
| `npm run socket:test` | `npm socket:test` | Test WebSocket server | 3000 | Node/WebSocket |

### RAG & Knowledge Base Server

| Command | Simplified | Purpose | Backend |
|---------|-----------|---------|---------|
| `npm run rag` | `npm rag` | Start RAG server + build KB | Node/Express |
| `npm run rag:server` | `npm rag:s` | Start RAG server only | Node/Express |
| `npm run rag:demo` | `npm rag:demo` | Start RAG server (demo mode) | Node/Express |

### MCP (Model Context Protocol) Server

| Command | Simplified | Purpose | Backend |
|---------|-----------|---------|---------|
| `npm run start-mcp` | `npm mcp` | Start MCP docs server | Node/Express |

### Health & Status Checks

| Command | Simplified | Purpose | Requires |
|---------|-----------|---------|----------|
| `npm run check-server` | `npm check` | Check if backend is running | Backend Running |
| `npm run check-status` | `npm status` | Check Claude status (PowerShell) | PowerShell |
| `npm run mark-updated` | `npm mark` | Mark work as updated (PowerShell) | PowerShell |

---

## 🔄 Optional Backend (Works Either Way)

These can run with just frontend OR with backend server.

### Development Modes

| Command | Frontend? | Backend? | Purpose |
|---------|-----------|----------|---------|
| `npm run dev` | ✅ | ✅ | Full dev with hot-reload (requires backend) |
| `npm run dev:safe` | ✅ | ✅ | Safe dev (kills all nodes first) |
| `npm run assistant` | ✅ | ✅ | Build KB + start dev (requires backend) |
| `npm run assistant:kb` | ✅ | ❌ | Build KB only (no backend) |

### Testing

| Command | Requires Backend | Purpose |
|---------|-----------------|---------|
| `npm run test` | ❌ | Run Playwright tests |
| `npm run test:safe` | ✅ | Health check before testing |
| `npm run test:ui` | ❌ | Interactive Playwright test UI |
| `npm run test:all` | ❌ | Run all test categories |
| `npm run test:serve` | ✅ | Start server + run tests (combined) |
| `npm run test:failfast` | ❌ | Stop on first test failure |
| `npm run test:socket-only` | ✅ | Test socket functionality only |
| `npm run test:ui-only` | ❌ | Test UI components only |

### WB-Specific Commands

| Command | Requires Backend | Purpose |
|---------|-----------------|---------|
| `npm run wb:serve` | ❌ | Serve WB demo on port 8080 |
| `npm run wb:serve:demo` | ❌ | Serve WB website builder demo |
| `npm run wb:serve:root` | ❌ | Serve root index.html |
| `npm run wb:build` | ❌ | Build WB component |
| `npm run wb:build:watch` | ❌ | Watch & rebuild WB component |
| `npm run wb:dev` | ❌ | Full WB dev setup |
| `npm run wb:setup` | ❌ | Install & build WB |

### Demo Servers

| Command | Requires Backend | Purpose | Port |
|---------|-----------------|---------|------|
| `npm run demo` | ❌ | Start demo server | 8080 |
| `npm run demo:debug` | ❌ | Debug environment info | 8080 |
| `npm run vite` | ❌ | Start Vite dev server | 5173 |
| `npm run serve` | ❌ | Serve dist on port 3000 | 3000 |

---

## 📋 Quick Reference by Use Case

### 🎨 I Want to Design/Build Components (No Server Needed)
```bash
npm run dev:s          # Start simple dev server
npm run new            # Create new component
npm run discover       # Find all components
npm run build:audit    # Check component quality
```

### 🧪 I Want to Test
```bash
npm run test           # Run all tests
npm run test:ui        # Interactive test UI
npm run test:failfast  # Stop on first failure
```

### 🚀 I Want Full Development (Needs Backend)
```bash
npm run dev            # Start dev with auto-reload
# or
npm run assistant      # Dev + build knowledge base
```

### 📡 I Want to Run Backend Services
```bash
npm run claude:s       # WebSocket server
npm run api            # Events API server
npm run rag            # RAG server
npm run mcp            # MCP docs server
```

### 🎯 I Want to Build & Deploy
```bash
npm run build          # Generate all manifests
npm run wb:build       # Build WB component
npm run build:kb       # Build knowledge base
```

---

## 🔧 Dependencies Analysis

### Frontend Only (No Backend Required)
```json
{
  "devDependencies": {
    "http-server": "Simple web server",
    "vite": "Fast build tool",
    "playwright": "Browser automation/testing",
    "typescript": "Type checking",
    "concurrently": "Run multiple commands"
  }
}
```

### Requires Backend
```json
{
  "dependencies": {
    "express": "Web framework",
    "socket.io": "WebSocket server",
    "socket.io-client": "WebSocket client"
  }
}
```

### Optional/Development
```json
{
  "devDependencies": {
    "jest": "Testing framework",
    "jsdom": "DOM simulation",
    "chokidar": "File watcher",
    "@custom-elements-manifest/analyzer": "Component analysis"
  }
}
```

---

## ⚡ Simplified Command Aliases

### Add to package.json to simplify:

```json
"scripts": {
  "s": "npm run dev:simple",
  "w": "npm run dev:watch",
  "k": "npm run kill-port",
  "test:q": "npm run test:failfast",
  "test:i": "npm run test:ui",
  "build": "npm run build:demos",
  "server": "npm run claude:server",
  "api": "npm run api",
  "rag": "npm run rag:server"
}
```

**Then use:**
```bash
npm run s      # dev:simple
npm run w      # watch
npm run k      # kill
npm run test:q # test:failfast
npm run server # claude:server
```

---

## 🎯 Recommended Daily Workflows

### Option 1: Pure Frontend Development
```bash
npm run dev:s          # Terminal 1 - Serve on 8080
npm run dev:watch      # Terminal 2 - Watch for changes
```

### Option 2: Full Development with Backend
```bash
npm run dev            # Terminal 1 - Dev + auto-reload
npm run claude:s       # Terminal 2 - WebSocket server (if needed)
```

### Option 3: Backend-Only Development
```bash
npm run claude:s       # Start WebSocket server
npm run api            # Or: Start API server (different terminal)
```

### Option 4: Testing + Development
```bash
npm run dev:s          # Terminal 1 - Dev server
npm run test:i         # Terminal 2 - Interactive tests
```

---

## 🚨 Common Issues & Solutions

### Issue: "Port 8080 already in use"
```bash
npm run kill          # Kill all node processes
npm run dev:s         # Try again
```

### Issue: TypeScript errors in Claude server
```bash
npm run claude:s      # Automatically compiles TS → JS
```

### Issue: Tests fail randomly
```bash
npm run test:serve    # Starts server first, then tests
```

### Issue: Components not discovering
```bash
npm run discover      # Re-run component discovery
npm run build:audit   # Check for issues
```

---

## 📊 Server Port Map

| Port | Service | Command | Type |
|------|---------|---------|------|
| 3000 | Backend APIs | `npm run api` or `npm run claude:s` | Server |
| 5173 | Vite Dev | `npm run vite` | Dev Server |
| 8080 | Frontend Server | `npm run dev:s` or `npm run serve:r` | Web Server |
| WebSocket | Socket.IO | `npm run claude:s` | Server |

---

## ✅ Summary

### When You Need Backend:
- ✅ `npm run claude:s` - WebSocket server
- ✅ `npm run api` - Events API
- ✅ `npm run rag:s` - RAG server
- ✅ `npm run mcp` - MCP server

### When You Don't Need Backend:
- ✅ `npm run dev:s` - Simple dev
- ✅ `npm run test` - Tests
- ✅ `npm run wb:dev` - WB development
- ✅ `npm run new` - Create components

---

**Last Updated:** October 2025  
**Framework:** WB (Website Builder)  
**Version:** 1.0.0
