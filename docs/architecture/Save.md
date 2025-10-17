# Website Builder: Save Functionality Guide

## Overview

This document details the complete functionality and requirements for saving websites in the Website Builder tool. The save functionality allows users to:

1. Save their current website design as an HTML file
2. Preserve theme and layout settings in the saved file 
3. Ensure saved files can be properly imported later with all settings intact

## Save Process Components

### 1. User Interface Elements

- **Save Button**: Located in the control panel, triggers the save process
- **Status Message**: Updates user on the save progress and success/failure
- **Download Link**: Hidden element that manages the file download

### 2. Required Data to Save

The save process must capture and preserve:

- **Content**: All HTML content from the site container
- **Theme**: Current theme setting (`data-theme` attribute)
- **Layout**: Current layout setting (`data-layout` attribute) 
- **Mode**: Current mode (dark/light) setting (`data-mode` attribute)
- **CSS Variables**: All custom color variables applied to the design
- **Class Names**: Theme-specific class names on the body element
- **Meta Tags**: SEO and document metadata

### 3. Technical Implementation Details

#### DOM Manipulation for Save

```javascript
// Clone the site container
const siteContainer = document.getElementById("site-container");
const clonedSite = siteContainer.cloneNode(true);

// Create a new HTML document for export
const exportDoc = document.implementation.createHTMLDocument("Exported Website");
```

#### Capturing Theme & Layout Settings

```javascript
// Save current theme and layout settings
const currentTheme = document.body.getAttribute("data-theme") || 'default';
const currentLayout = document.body.getAttribute("data-layout") || 'top-nav';
const currentMode = document.body.getAttribute("data-mode") || 'dark';

// Apply to exported document
exportBody.setAttribute("data-theme", currentTheme);
exportBody.setAttribute("data-layout", currentLayout);
exportBody.setAttribute("data-mode", currentMode);
```

#### Initialization Script Injection

A critical component of the save process is injecting an initialization script that ensures settings are applied when the file is opened:

```javascript
// Add a script to initialize saved settings when the file is opened
const settingsScript = document.createElement('script');
settingsScript.textContent = `
  // Initialize saved settings
  document.addEventListener('DOMContentLoaded', function() {
    // These are the settings that were active when the file was saved
    const savedSettings = {
      theme: "${currentTheme}",
      layout: "${currentLayout}",
      mode: "${currentMode}"
    };

    // Apply saved theme and layout
    document.body.setAttribute('data-theme', savedSettings.theme);
    document.body.setAttribute('data-layout', savedSettings.layout);
    document.body.setAttribute('data-mode', savedSettings.mode);
    
    // Add appropriate class based on mode
    if (savedSettings.mode === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  });
`;
exportHead.appendChild(settingsScript);
```

#### CSS Variables Extraction

To ensure the design looks identical when imported:

```javascript
// Extract CSS variables from document.documentElement.style
const documentStyle = document.documentElement.style;
const cssVariables = [
  '--primary', '--secondary', '--accent', '--primary-light', '--primary-dark',
  '--bg-primary', '--bg-secondary', '--text-primary', '--text-secondary',
  '--hover-color'
];

let cssVariableStyles = ':root {\n';
cssVariables.forEach(prop => {
  const value = documentStyle.getPropertyValue(prop);
  if (value && value.trim()) {
    cssVariableStyles += `  ${prop}: ${value.trim()};\n`;
  }
});
cssVariableStyles += '}\n\n';
```

#### File Creation and Download

```javascript
// Generate the final HTML content
const htmlContent =
  '<!DOCTYPE html>\n<html lang="en">' +
  exportHead.outerHTML +
  exportBody.outerHTML +
  "</html>";

// Create a Blob with the HTML content
const blob = new Blob([htmlContent], { type: "text/html" });

// Create a download URL for the Blob
const url = URL.createObjectURL(blob);

// Trigger the download
downloadLink.href = url;
downloadLink.download = "my-website.html";
downloadLink.click();
```

### 4. Cleanup Operations

Before saving the website, these cleanup operations must be performed:

- Remove edit mode classes and attributes
- Remove contextual insert media buttons
- Make all editable elements non-editable
- Ensure proper CSS classes are preserved
- Remove any temporary UI elements

## Validation & Testing

### Test Cases for Save Functionality

1. **Basic Content Save**: Content of the website should be preserved
2. **Theme Preservation**: The saved file should maintain the selected theme
3. **Layout Preservation**: The layout structure should be maintained
4. **Mode Persistence**: Dark/light mode setting should be preserved
5. **CSS Variable Persistence**: Custom colors should be maintained
6. **Cleanup Verification**: No edit controls should be present in saved file
7. **Cross-Browser Compatibility**: Save function works in all supported browsers

## Import Compatibility

The save process must create files that are fully compatible with the import functionality:

1. The import process should recognize and extract the theme, layout and mode settings
2. Imported settings should be applied to the document body
3. All CSS variables should be properly restored
4. The content structure must be preserved exactly as saved

## Error Handling

The save process includes comprehensive error handling:

1. Try-catch blocks around critical operations
2. User-friendly error messages
3. Fallback to default settings if saved settings are corrupted
4. Console logging for debugging purposes

## LocalStorage Integration

While the save functionality primarily exports an HTML file, it should also:

1. Update localStorage with current settings when saving
2. Ensure consistency between file settings and localStorage settings
3. Use localStorage settings as fallbacks if file settings are missing

## Best Practices for Users

1. Always test imported websites after saving
2. Save frequently during complex design sessions
3. Use descriptive filenames for saved websites
4. Keep backups of important website designs

## Technical Limitations

1. External resources may not be properly bundled
2. Font files may need to be separately managed
3. JavaScript functionality limited to what's included in the save
4. Server-side components cannot be preserved

---

This document serves as the definitive reference for the Website Builder save functionality. All implementations should conform to these requirements to ensure consistent behavior across the application.
