# Dynamic Component Loading System

## Overview

The WB Website Builder uses a **dynamic component loading system** that automatically discovers and loads components based on a generated manifest file.

## How It Works

### 1. Build Phase (Development)

Run the build script to scan the filesystem and generate `manifest.json`:

```bash
npm run build:manifest
```

This script:
- Scans `utils/wb/` for infrastructure files
- Scans `styles/` for style utilities  
- Scans `components/` for all `wb-*` components
- Analyzes dependencies between components
- Generates `components/manifest.json`

### 2. Runtime Phase (Browser)

When `index.js` loads:
1. Fetches `components/manifest.json`
2. If found, uses the manifest to determine load order
3. If not found, falls back to hardcoded defaults
4. Loads scripts sequentially in the correct order

## Adding a New Component

### Option 1: Automatic (Recommended)

1. Create your component:
   ```
   components/
     wb-mynew/
       wb-mynew.js
       wb-mynew.css
   ```

2. Rebuild the manifest:
   ```bash
   npm run build:manifest
   ```

3. Refresh your browser - component will be loaded automatically!

### Option 2: Manual

Edit `components/manifest.json` directly:

```json
{
  "components": [
    "wb-event-log",
    "wb-control-panel",
    "wb-mynew"  ← Add here
  ]
}
```

### Option 3: Runtime (Dynamic Loading)

Load a component on-demand:

```javascript
// After page load
await window.WBLoader.loadComponent('wb-button');
```

## Component Categories

### Infrastructure
Core utilities from `utils/wb/`:
- `wb-safe-logger.js` - Logging system
- `wb-component-utils.js` - Component utilities

### Styles
Style utilities from `styles/`:
- `main.js` - Main style loader

### Dependencies
Components used by other components (loaded first):
- `wb-toggle` - Toggle switch
- `wb-select` - Dropdown select
- `wb-color-bar` - Color picker bar
- `wb-color-bars` - Multiple color bars

### Main Components
Application components (loaded last):
- `wb-event-log` - Event logging display
- `wb-control-panel` - Main control interface

## Load Order

```
1. Infrastructure files (sequential)
2. Style utilities (sequential)
3. Dependency components (sequential)
4. Main components (sequential)
```

## API Reference

### window.WBLoader

```javascript
// Load a single component dynamically
await window.WBLoader.loadComponent('wb-button');

// Load any script
await window.WBLoader.loadScript('path/to/script.js');

// Reload the manifest
const manifest = await window.WBLoader.reloadManifest();
```

### Events

```javascript
// Fired when all components are loaded
window.addEventListener('wb-ready', (e) => {
    console.log('Scripts loaded:', e.detail.scriptsLoaded);
    console.log('Manifest:', e.detail.manifest);
});

// Fired on loading error
window.addEventListener('wb-error', (e) => {
    console.error('Load failed:', e.detail.error);
});
```

## Build Script Details

### What it scans:
- `utils/wb/*.js` → infrastructure
- `styles/*.js` → styles
- `components/wb-*/wb-*.js` → components

### How it categorizes:
- Known dependencies (wb-toggle, wb-select, etc.) → dependencies
- Components with declared dependencies → dependencies
- Everything else → main components

### Generated manifest structure:
```json
{
  "version": "1.0.0",
  "generated": "2025-10-08T...",
  "infrastructure": ["wb-safe-logger.js", ...],
  "styles": ["main.js"],
  "dependencies": ["wb-toggle", ...],
  "components": ["wb-event-log", ...],
  "metadata": { ... }
}
```

## Development Workflow

### During Development:
```bash
# After adding/removing components
npm run build:manifest

# Start dev server
npm run serve:root
```

### Pre-Deployment:
```bash
# Rebuild manifest to include all components
npm run build:manifest

# Verify the manifest
cat components/manifest.json
```

### Troubleshooting:

**Component not loading?**
1. Check if manifest includes it: `cat components/manifest.json`
2. Rebuild manifest: `npm run build:manifest`
3. Check browser console for load errors

**Wrong load order?**
1. Components should declare dependencies in code:
   ```javascript
   const dependencies = ['wb-toggle', 'wb-select'];
   ```
2. Rebuild manifest to pick up dependency changes

**Want to skip manifest?**
- Delete `components/manifest.json`
- Loader will use hardcoded fallback list

## Benefits

✅ **Automatic discovery** - No manual maintenance of component lists  
✅ **Correct load order** - Dependencies load before components that use them  
✅ **Easy to add components** - Just create the folder and rebuild  
✅ **Fallback support** - Works even without manifest  
✅ **Runtime loading** - Load additional components on-demand  
✅ **Build-time validation** - Catch missing files before deployment
