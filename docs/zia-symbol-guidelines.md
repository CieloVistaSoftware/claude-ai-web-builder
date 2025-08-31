# Zia Symbol Usage Guidelines

<div align="center">
  <img src="../images/ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>

## Overview

The Zia Symbol is our company trademark and should be used consistently across all project files, websites, and documentation. This document provides guidelines for using the symbol correctly.

## Including the Zia Symbol

### In HTML Files

```html
<!-- Favicon (in <head> section) -->
<link rel="icon" href="/images/ziasymbol.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/ziasymbol.svg">

<!-- As content (in <body> section) -->
<div class="logo-container">
  <img src="/images/ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>
```

### In Markdown Files

```markdown
<div align="center">
  <img src="/images/ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>
```

## Automated Tools

We've created two helper scripts that can automatically add the Zia Symbol to all appropriate files:

1. `add-zia-symbol.js` - Adds the Zia Symbol to all Markdown files after the first heading
2. `add-favicon.js` - Adds favicon links to all HTML files

To run these scripts:

```bash
node add-zia-symbol.js
node add-favicon.js
```

## Relative Path Calculation

When adding the symbol manually, make sure to use the correct relative path based on where the file is located:

- All files should use: `/images/ziasymbol.svg` (absolute path from root)
- This ensures consistent references across all project files
- The SVG is centrally located in the `/images/` directory

## Symbol Specifications

- Use SVG format for best scaling
- Maintain aspect ratio when resizing
- Standard display size: width="150" height="100"
- Colors: Yellow background (#FFD700) with red symbol (#C41E3A)

## Support

If you need help adding the Zia Symbol to your files, or if you notice any files missing the symbol, please contact the branding team.
