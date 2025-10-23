# NPM Build Integration - Complete! ✅

## What Was Done

I've integrated the demo manifest generation into your npm build system. The manifest will now **automatically regenerate** when you run common npm commands.

## 🎯 NPM Scripts Added

### Primary Commands
```bash
npm run build          # Generates demos manifest
npm run build:demos    # Generates demos manifest (explicit)
```

### Auto-Generation (Pre-hooks)
The manifest now automatically regenerates before these commands:
```bash
npm run dev      # Auto-builds demos before starting dev server
npm start        # Auto-builds demos before starting
npm run build    # Includes demos in build process
```

## 📋 Workflow

### Adding a New Demo
1. Create your `*demo*.html` file in any component directory
2. Run any of these commands:
   ```bash
   npm run build      # Just rebuild demos
   npm start          # Start dev (auto-builds demos first)
   npm run dev        # Start dev (auto-builds demos first)
   ```
3. Refresh `components/index.html` in browser

### Zero-Config Usage
Because of the pre-hooks, you'll rarely need to think about regenerating the manifest. It happens automatically when you:
- Start the dev server (`npm run dev`)
- Run the project (`npm start`)
- Build the project (`npm run build`)

## 📁 Files Structure

```
/wb
├── package.json                          # ✅ Updated with build scripts
├── /components
│   ├── index.html                        # Main index page
│   ├── demos-manifest.json               # Auto-generated
│   ├── generate-demos-manifest.js        # Node scanner
│   ├── generate-demos-manifest.ps1       # PowerShell scanner
│   ├── generate-demos-manifest.bat       # Windows batch file
│   ├── README-INDEX.md                   # ✅ Updated documentation
│   └── /wb-{component}
│       └── *demo*.html                   # Your demo files
```

## 🚀 Quick Reference

### Most Common Commands

```bash
# Start dev server (auto-builds demos)
npm start

# Just rebuild demos
npm run build:demos

# Manual generation (if needed)
cd components
node generate-demos-manifest.js
```

## ✨ Features

- **Auto-Discovery**: Finds ALL `*demo*.html` files
- **NPM Integration**: Runs automatically with common commands
- **Cross-Platform**: Works on Windows, Mac, Linux
- **Pre-hooks**: Always up-to-date manifest
- **Manual Override**: Can still run scripts directly if needed

## 🎉 Benefits

1. **No Manual Updates**: Manifest regenerates automatically
2. **Developer-Friendly**: Works with existing npm workflow
3. **Always Current**: Pre-hooks ensure manifest is never stale
4. **Flexible**: Multiple ways to regenerate (npm, node, PowerShell, batch)
5. **Zero Config**: Just add demo files and go

---

**That's it!** Your build system now automatically manages the demos manifest. Just focus on creating components and demos! 🎨

