---
docid: 700.5.build-instructions
id: build-commands-for-website-builder
title: Build Commands for Website Builder
project: ClaudeAIWebSiteBuilder
description: node scripts/build-dist.js
status: active
tags: [build, instructions, commands]
category: 700.5 — AI Coordination
created: 2025-09-02
updated: 2026-04-27
version: 1.0.0
author: CieloVista Software
relativepath: docs/BUILD_INSTRUCTIONS.md
---
# Build Commands for Website Builder

## To create a regular dist build:
```powershell
node scripts/build-dist.js
```

## To create an obfuscated dist build:
```powershell
node scripts/build-dist.js --obfuscate
```

## What the build script does:

1. **Copies files from `/wb/` to `/dist/wb/`**
   - wb.html
   - wb.css  
   - wb.js

2. **Copies images from `/images/` to `/dist/images/`**

3. **For obfuscated builds:**
   - Minifies CSS (removes comments, whitespace)
   - Obfuscates JavaScript (renames variables, removes comments, wraps in IIFE)
   - Creates `wb.min.js` instead of `wb.js`

4. **Updates file paths in HTML**
   - Ensures image paths point to `../images/`
   - Updates script references for obfuscated builds

## Testing:
- Working version: `http://127.0.0.1:5502/wb/wb.html`
- Dist version: `http://127.0.0.1:5502/dist/wb/wb.html`

The reason the dist version doesn't look like the working version is because the CSS/JS files are missing or incorrectly referenced. This build script will fix that issue.