# Quick Start Guide

Get the WB Component Navigator running in 5 minutes.

## Step 1: Install Dependencies

```bash
cd wb-component-navigator
npm install
```

This will install dependencies for root, client, and server automatically.

## Step 2: Compile TypeScript

```bash
npm run compile
```

This compiles both client and server TypeScript to JavaScript.

## Step 3: Launch Extension

1. Open the `wb-component-navigator` folder in VS Code
2. Press `F5` (or Run → Start Debugging)
3. A new "Extension Development Host" window opens
4. In that window, open your WB Framework workspace

## Step 4: Test It Out

### Test Go to Definition:

1. Open any HTML file (like `index.html`)
2. Find a component usage like `<wb-button>`
3. `Ctrl+Click` (or `Cmd+Click` on Mac) on `wb-button`
4. **You should jump to `wb-button.js`!**

### Test Find References:

1. In any HTML file, right-click on `<wb-button>`
2. Select "Find All References" (or press `Shift+F12`)
3. **You should see all usages across your project!**

### Test Component Tree:

1. Look at the left sidebar
2. You should see "WB COMPONENTS" section
3. Expand any component to see its files
4. **Click any file to open it!**

### Test Hover:

1. Hover your mouse over `<wb-button>` in HTML
2. **You should see component info popup!**

### Test Auto-Complete:

1. In HTML, type `<`
2. **You should see WB component suggestions!**

## Troubleshooting

### "Component index empty"

**Problem**: No components showing in tree view

**Solution**: 
1. Check that `components/` directory exists in your workspace
2. Run command: `Ctrl+Shift+P` → "Refresh Component Index"
3. Check VS Code Output panel → "WB Component Navigator" for errors

### "Go to Definition not working"

**Problem**: Ctrl+Click doesn't navigate

**Solution**:
1. Ensure component files follow naming: `wb-button/wb-button.js`
2. Check that `customElements.define('wb-button', WBButton)` exists
3. Try refreshing component index

### "Extension not activating"

**Problem**: No tree view, no features working

**Solution**:
1. Check you're in Extension Development Host (title bar shows this)
2. Open a file with `.html`, `.js`, or `.ts` extension
3. Check VS Code Output panel for errors

## What's Next?

Now that it's working, try:

1. **Navigate your components** - Use `F12` to jump between files
2. **Find usages** - See where components are used with `Shift+F12`
3. **Organize files** - Use the tree view to manage related files
4. **Check hover info** - Learn about components without opening files

## Development Workflow

### Making Changes

1. Edit files in `client/src/` or `server/src/`
2. Run `npm run compile` to rebuild
3. Press `F5` again to test changes

### Watch Mode (Auto-Compile)

```bash
npm run watch
```

Now changes auto-compile as you save files!

### Debugging

1. Set breakpoints in TypeScript files
2. Press `F5` to launch with debugger attached
3. Use Debug Console to inspect variables

## Common Commands

| Command | Action |
|---------|--------|
| `F5` | Launch extension |
| `Ctrl+Shift+P` | Command palette |
| `F12` | Go to Definition |
| `Shift+F12` | Find References |
| `Ctrl+Space` | Trigger auto-complete |

## Need Help?

Check the full [README.md](README.md) for detailed documentation.

## Report Issues

If something doesn't work:
1. Check VS Code Output → "WB Component Navigator"
2. Look for error messages
3. Check that file paths match your actual structure

---

**You're ready to go!** Start navigating your WB components like a pro. 🚀
