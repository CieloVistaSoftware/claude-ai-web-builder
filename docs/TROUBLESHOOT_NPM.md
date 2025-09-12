# NPM Start Troubleshooting Guide

## Issue: `npm run start` not working

### **Most Common Causes:**

1. **package.json not updated** - The original package.json still has the old scripts
2. **Missing dependencies** - http-server not installed
3. **Wrong directory** - Running from wrong folder
4. **Node.js issues** - Version compatibility problems

---

## **Quick Fix Steps:**

### Step 1: Update package.json
Replace your current `package.json` with this content:

```json
{
  "name": "claude-ai-web-builder",
  "version": "1.0.0",
  "description": "Claude AI Website Builder - A powerful, interactive website builder",
  "main": "wb/wb.html",
  "scripts": {
    "dev": "cd wb && npx http-server -p 3000 -o wb.html -c-1",
    "start": "npm run dev",
    "serve": "cd wb && npx http-server -p 8080 -c-1",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["website-builder", "ai", "claude"],
  "author": "Claude AI Assistant",
  "license": "ISC",
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Try Again
```bash
npm run start
```

---

## **Alternative Solutions:**

### Option A: Direct Command
If npm scripts still don't work, run directly:
```bash
cd wb
npx http-server -p 3000 -o wb.html -c-1
```

### Option B: Global Install
Install http-server globally:
```bash
npm install -g http-server
cd wb
http-server -p 3000 -o wb.html -c-1
```

### Option C: Python Server (if Node.js issues)
```bash
cd wb
python -m http.server 3000
# Then manually open: http://localhost:3000/wb.html
```

---

## **Diagnostic Commands:**

Check what's wrong:
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check current package.json scripts
npm run

# Check if in right directory
ls package.json

# Check if wb folder exists
ls wb/
```

---

## **Expected Output:**

When working correctly, you should see:
```
> claude-ai-web-builder@1.0.0 start
> npm run dev

> claude-ai-web-builder@1.0.0 dev  
> cd wb && npx http-server -p 3000 -o wb.html -c-1

Starting up http-server, serving ./
Available on:
  http://127.0.0.1:3000
  http://192.168.x.x:3000
Opening browser to http://127.0.0.1:3000/wb.html
```

The browser should automatically open to `http://localhost:3000/wb.html`