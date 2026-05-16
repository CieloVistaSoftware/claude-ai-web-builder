---
docid: 700.5.buildsteps
id: build-steps-for-website-builder
title: Build Steps for Website Builder
project: ClaudeAIWebSiteBuilder
description: This document outlines the build process for creating distribution versions of the Website Builder application with optional code obfuscation.
status: active
tags: [buildsteps, build, steps]
category: 700.5 — AI Coordination
created: 2025-09-02
updated: 2026-04-27
version: 1.0.0
author: CieloVista Software
relativepath: docs/buildsteps.md
---
# Build Steps for Website Builder

## Overview
This document outlines the build process for creating distribution versions of the Website Builder application with optional code obfuscation.

## Prerequisites
- Node.js installed on your system
- Access to the project root directory
- Live Server or similar development server for testing

## Build Process

### 1. Standard Build
Creates a clean distribution version without obfuscation:

```powershell
node scripts/build-dist.js
```

**What it does:**
- Copies `wb.html`, `wb.css`, and `wb.js` from `/wb/` to `/dist/wb/`
- Copies all images from `/images/` to `/dist/images/`
- Updates file paths in HTML to reference correct locations
- Maintains readable code for debugging

### 2. Obfuscated Build
Creates a production-ready version with obfuscated JavaScript:

```powershell
node scripts/build-dist.js --obfuscate
```

**What it does:**
- All standard build steps, plus:
- **CSS Minification**: Removes comments, collapses whitespace
- **JavaScript Obfuscation**: 
  - Removes all comments and unnecessary whitespace
  - Renames variables (`isEditMode` → `a`, `builderConfig` → `b`, etc.)
  - Wraps code in IIFE (Immediately Invoked Function Expression)
  - Creates `wb.min.js` instead of `wb.js`
- Updates HTML to reference `wb.min.js`

## File Structure After Build

### Standard Build Output:
```
dist/
├── wb/
│   ├── wb.html
│   ├── wb.css
│   └── wb.js
└── images/
    ├── ziasymbol.svg
    ├── man-made-opalite.jpg
    └── [other image files]
```

### Obfuscated Build Output:
```
dist/
├── wb/
│   ├── wb.html (references wb.min.js)
│   ├── wb.css (minified)
│   └── wb.min.js (obfuscated)
└── images/
    ├── ziasymbol.svg
    ├── man-made-opalite.jpg
    └── [other image files]
```

## Testing Your Build

### Development Version (Source):
```
http://127.0.0.1:5502/wb/wb.html
```

### Distribution Version:
```
http://127.0.0.1:5502/dist/wb/wb.html
```

Both versions should look and function identically. If the dist version doesn't match the development version, run the build script again.

## Troubleshooting

### Common Issues:

1. **Dist version looks unstyled**
   - **Problem**: Missing CSS file
   - **Solution**: Run the build script to copy wb.css

2. **Control panel doesn't work**
   - **Problem**: Missing or incorrectly referenced JavaScript
   - **Solution**: Ensure wb.js (or wb.min.js for obfuscated) exists in dist/wb/

3. **Images don't display**
   - **Problem**: Incorrect image paths
   - **Solution**: Build script fixes paths automatically, rebuild

4. **JavaScript errors in obfuscated version**
   - **Problem**: Obfuscation broke code references
   - **Solution**: Check console for errors, may need to adjust obfuscation mapping

### Manual Verification Steps:

1. **Check file existence:**
   ```powershell
   ls dist/wb/
   ls dist/images/
   ```

2. **Verify HTML references:**
   - Open `dist/wb/wb.html` and check `<link>` and `<script>` tags
   - For obfuscated: should reference `wb.min.js`
   - For standard: should reference `wb.js`

3. **Test functionality:**
   - Control panel buttons (Edit Mode, Apply Color, Save Site)
   - Color explorer sliders
   - Theme selector
   - All interactive elements

## Build Script Details

### Variable Obfuscation Mapping:
```javascript
'isEditMode' → 'a'
'builderConfig' → 'b'
'currentTheme' → 'c'
'colorValues' → 'd'
'editMode' → 'e'
'siteContainer' → 'f'
'controlPanel' → 'g'
```

### CSS Minification Process:
- Removes `/* comments */`
- Collapses multiple spaces to single space
- Removes spaces around `{`, `}`, `;`
- Trims leading/trailing whitespace

### JavaScript Obfuscation Process:
- Removes `/* block comments */` and `// line comments`
- Collapses whitespace
- Renames key variables
- Wraps in IIFE: `(function(){[code]})();`

## Production Deployment

For production deployment, always use the obfuscated build:

1. Run obfuscated build
2. Test thoroughly in dist environment
3. Deploy `dist/wb/` folder contents
4. Ensure `dist/images/` is accessible at `../images/` relative to HTML
5. Verify all functionality works in production environment

## Security Considerations

- Obfuscation provides basic protection but is not encryption
- Sensitive operations should still be server-side
- Image paths are updated to relative paths for portability
- All edit indicators and debug code removed in production builds