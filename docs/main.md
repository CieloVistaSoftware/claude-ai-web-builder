# ~~main.tsx~~ → wb.ts Documentation

## ⚠️ ARCHITECTURAL CHANGE

**The `main.tsx` file has been REMOVED** as part of a major architectural shift from React to pure TypeScript.

## New Architecture Overview

The Claude AI Website Builder now uses a **pure TypeScript + HTML approach** instead of React, located in the `wb/` folder:

### Current Entry Points
- **`index.html`** → Redirects to `wb/wb.html`
- **`wb/wb.html`** → Main website builder interface
- **`wb/wb.ts`** → Core TypeScript functionality (compiled to `wb.js`)
- **`wb/wb.css`** → Website builder styling

## New Implementation Structure

```html
<!-- wb/wb.html - Main Interface -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="wb.css">
</head>
<body>
    <!-- Website builder UI -->
    <script src="wb.js"></script>
</body>
</html>
```

```typescript
// wb/wb.ts - Core Functionality
// DOM manipulation, event handling, theme system
// Compiled to wb.js for browser execution
```

## Benefits of New Architecture
✅ **Faster Performance** - No React overhead  
✅ **Simpler Deployment** - Pure HTML/CSS/JS  
✅ **Better Compatibility** - Works everywhere  
✅ **Smaller Bundle Size** - No framework dependencies  
✅ **Direct DOM Control** - More precise interactions  

## Migration Status
✅ React dependencies removed from package.json  
✅ main.tsx deleted  
✅ wb.ts fully functional and compiled  
✅ All tests updated  
✅ Documentation updated

## Previous React Implementation (REMOVED)

The previous implementation used React:

```tsx
// This code has been REMOVED
import React from 'react';
import ReactDOM from 'react-dom/client';
import HybridWebsiteBuilder from '../lowcode_website_builder';
import '../css/custom.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HybridWebsiteBuilder />
  </React.StrictMode>
);
```

**Why the Change?**
- React was overkill for this use case
- Pure TypeScript provides better performance
- Simpler deployment and maintenance
- No framework dependencies to manage