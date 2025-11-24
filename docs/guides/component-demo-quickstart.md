# Component Demo Quick Start Guide - CORRECTED

## 🚀 Fast Component Development with Vite

Start any component demo instantly using Vite's hot-reload dev server!

## ✅ Correct Usage

### Method 1: Specify Component Name (Recommended)

From anywhere in the project:

```bash
# From project root
npm run demo -- wb-xtest

# Or from inside the component folder
cd components/wb-xtest
npm run demo -- xtest

# The wb- prefix is optional
npm run demo -- button
```

**Note the `--`** - this is required to pass arguments to the script!

### Method 2: Direct Script Call

```bash
# From project root
node start-demo.js wb-xtest

# From component folder
node ../../start-demo.js xtest
```

## Real-World Workflow

### Starting a New Component:

```bash
# 1. Create the component
npm run new

# 2. Start developing (replace 'mycomponent' with your component name)
npm run demo -- mycomponent
```

### Working on Existing Component:

```bash
# Navigate to component (optional, works from anywhere)
cd components/wb-button

# Start demo with hot-reload
npm run demo -- button
```

**Now edit your files and see changes instantly!** 🎨

## What Gets Started

The script:
1. ✅ Finds your component by name
2. ✅ Locates the `*demo*.html` file (e.g., `wb-button-demo.html`)
3. ✅ Starts Vite dev server on port 5173
4. ✅ Opens your browser automatically
5. ✅ Watches for file changes (hot-reload enabled)

## Example Output

```
🔍 WB Component Demo Starter

🔍 Current directory: C:\Users\jwpmi\Downloads\AI\wb
📂 Directory name: wb

✅ Found component: wb-xtest
✅ Found demo: wb-xtest-demo.html

🚀 Starting Vite dev server...
📦 Component: wb-xtest
📄 Demo file: wb-xtest-demo.html
📂 Path: C:\Users\jwpmi\Downloads\AI\wb\components\wb-xtest

Running: npx vite --open /components/wb-xtest/wb-xtest-demo.html

──────────────────────────────────────────────────
  VITE v7.0.5  ready in 123 ms

  ➜  Local:   http://localhost:5173/components/wb-xtest/wb-xtest-demo.html
  ➜  press h + enter to show help
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run demo -- wb-button` | Start wb-button demo |
| `npm run demo -- button` | Same (wb- prefix optional) |
| `node start-demo.js xtest` | Direct script call |
| `npm run build` | Build manifest + open demos viewer |
| `npm run vite` | Start Vite without auto-open |

## Common Commands

```bash
# Test wb-button
npm run demo -- button

# Test wb-card
npm run demo -- card

# Test wb-xtest
npm run demo -- xtest
```

## Features

### 🎯 Smart Detection
- Finds component by name (with or without `wb-` prefix)
- Automatically locates the demo file
- Works from any directory in the project

### 🔥 Hot Module Replacement (HMR)
- Edit HTML, CSS, or JavaScript
- See changes instantly without refresh
- Fast development iteration

### 🌐 Multiple Demos
If you have multiple demo files:
- `wb-button-demo.html` (preferred)
- `wb-button-demo-clean.html`
- `wb-button-test-demo.html`

The script picks the main demo file automatically.

## Troubleshooting

### "Could not determine which component to start"

**Problem:** You ran `npm run demo` without specifying the component name.

**Solution:** Add the component name after `--`:
```bash
npm run demo -- xtest
```

### "Component not found: wb-xtest"

**Solution:** Check the spelling and that the component exists:
```bash
# List components
ls components/
```

### "No demo file found"

**Solution:** Create a demo file following the pattern:
```bash
# In components/wb-button/
touch wb-button-demo.html
```

### Port already in use

**Solution:** Kill existing Vite server:
```bash
npm run kill-port
```

## Pro Tips

### Tip 1: Keep Terminal Open
Leave the Vite server running while you work. It watches for changes automatically.

### Tip 2: Multiple Components
Open multiple terminals to work on different components simultaneously:
```bash
# Terminal 1
npm run demo -- button

# Terminal 2  
npm run demo -- card
```

### Tip 3: Create an Alias
Add to your `.bashrc` or `.zshrc`:
```bash
alias wbd='npm run demo --'
```

Then just:
```bash
wbd button
wbd card
wbd xtest
```

### Tip 4: PowerShell Function
Add to your PowerShell profile:
```powershell
function wbd { npm run demo -- $args }
```

Then:
```powershell
wbd button
wbd card
```

## Why the `--`?

The `--` tells npm to stop processing arguments and pass everything after it to the script. Without it, npm thinks `xtest` is an npm option, not a script argument.

**Wrong:**
```bash
npm run demo xtest  # npm looks for 'xtest' as an npm option
```

**Right:**
```bash
npm run demo -- xtest  # Passes 'xtest' to start-demo.js
```

---

**Updated**: October 21, 2025  
**Happy coding!** 🚀
