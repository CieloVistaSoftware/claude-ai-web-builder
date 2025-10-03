# Control Panel Web Component

A self-contained web component that provides comprehensive control panel functionality for the Website Builder application.

## Overview

The Control Panel component manages all user interface controls for customizing websites including:
- Edit mode toggling
- Theme and layout selection
- Color system controls
- File operations
- Layout configurations
- Template cloning system

## Features

### Core Functionality
- **Edit Mode Toggle**: Enable/disable content editing
- **Theme Selection**: Dark, light, auto, and custom themes
- **Layout Control**: Multiple navigation layouts (top, left, right, ad)
- **Color System**: HSL color picker with palette presets
- **File Operations**: Save, import, export, and reset functionality
- **Template Cloning**: Create new website projects from current template

### Component Architecture
- **Fully Self-contained**: HTML template embedded in JavaScript, CSS auto-loaded
- **Zero Configuration**: Works immediately with just a script tag
- **Event-driven**: Communicates through DOM events only
- **Modular**: Can be used independently or integrated with existing systems
- **Auto-initialization**: Starts working as soon as the script loads
- **Path-aware**: Automatically detects its location and loads dependencies
- **Responsive**: Works on desktop and mobile devices

### Recent Fixes
- **✅ Arrow Key Support**: Color sliders now support left/right arrow keys for fine-tuning
- **✅ Focus Indicators**: Enhanced slider thumbs with proper styling
- **✅ Color Bar Navigation**: Keyboard navigation with Home/End support
- **⚠️ Event Log Integration**: wb-eventlog not receiving events from color palette presets (known issue)

## Installation

### Basic Usage (Recommended)

Simply include the JavaScript file in your HTML - that's it! The component is completely self-contained:

```html
<!-- Just include the JavaScript - CSS and HTML are loaded automatically -->
<script src="../components/control-panel/control-panel.js"></script>
```

The component will automatically:
1. Load its own CSS file
2. Create its HTML structure
3. Initialize all functionality
4. Attach event listeners

### Alternative: Manual CSS Loading

If you prefer to load CSS manually for performance reasons:
```html
<!-- Optional: Pre-load CSS -->
<link rel="stylesheet" href="../components/control-panel/control-panel.css" />

<!-- JavaScript component -->
<script src="../components/control-panel/control-panel.js"></script>
```

**Note**: The external `control-panel.html` file is no longer needed as the template is embedded in the JavaScript component.

## Configuration

### Built-in Color Palettes

The component includes several built-in color palettes:
- Material Design 3
- Material Design Dark
- Tailwind Blue
- Dracula Theme
- GitHub Dark
- Nord Theme
- One Dark
- Solarized Dark
- Tech Brands

### Layout Options

- **Top Navigation**: Standard horizontal navigation
- **Left Navigation**: Sidebar navigation
- **Right Navigation**: Right-side navigation
- **Ad Layout**: Advertisement-optimized layout

## API

### Events Dispatched

The component dispatches these events:

#### Edit Mode Events
```javascript
// When edit mode is enabled
document.addEventListener('editModeEnabled', (e) => {
    console.log('Edit mode enabled');
});

// When edit mode is disabled
document.addEventListener('editModeDisabled', (e) => {
    console.log('Edit mode disabled');
});

// Generic edit mode change event
document.addEventListener('editModeChanged', (e) => {
    console.log('Edit mode:', e.detail.enabled);
    console.log('Source:', e.detail.source); // 'controlPanel'
});
```

#### Component Ready Event
```javascript
document.addEventListener('controlPanelReady', (e) => {
    console.log('Control panel component is ready');
});
```

### Global API

The component exposes a global `ControlPanel` instance:

```javascript
// Access the component instance
const panel = window.ControlPanel;

// Check if component is initialized
if (panel.initialized) {
    console.log('Control panel is ready');
}

// Access current color settings
console.log(panel.currentColors);
```

## Integration with Website Builder

The control panel integrates seamlessly with the Website Builder system:

1. **Color System**: Updates CSS custom properties for live preview
2. **Edit Mode**: Toggles contentEditable on elements with `.editable` class
3. **Theme System**: Updates `data-theme` attribute on body
4. **Layout System**: Updates `data-layout` attribute on body
5. **Local Storage**: Saves user preferences

## Customization

### CSS Variables

The component uses CSS custom properties that can be overridden:

```css
:root {
    --primary: #6366f1;
    --secondary: #64748b;
    --accent: #10b981;
    /* ... and many more */
}
```

### Adding Custom Palettes

To add custom color palettes, extend the global WB object:

```javascript
window.WB = window.WB || {};
window.WB.colorPalettes = window.WB.colorPalettes || {};

window.WB.colorPalettes['my-custom-palette'] = {
    name: 'My Custom Palette',
    colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        tertiary: '#45b7d1',
        surface: '#ffffff',
        background: '#f8f9fa',
        error: '#e74c3c'
    }
};
```

## File Structure

```
components/control-panel/
├── control-panel.css          # Component styles (auto-loaded)
├── control-panel.js           # Component logic (contains embedded HTML template)
├── control-panel.json         # Component configuration
├── control-panel.md           # Documentation (this file)
├── control-panel-demo.html    # Demo page
└── claude.md                  # Development notes and known issues
```

**Note**: Only the `.js` and `.css` files are required for the component to function. The HTML template is embedded within the JavaScript file.

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Required Features
- ES6 Classes
- CSS Custom Properties
- DOM Events
- Local Storage
- ES6 Modules (for component auto-loading)
- Path detection APIs

## Template Clone Feature

The control panel includes a powerful template cloning system that allows users to create new website projects from the current template.

### How Clone Works

1. **Click "📋 Clone Template"**: Button above Edit Mode in control panel
2. **Enter Project Name**: User provides a name for the new website folder
3. **Select Destination**: Modern browsers show folder picker to choose destination
4. **Automatic Collection**: System fetches all wb.** files from the current project
5. **Direct File Creation**: Files are created directly in the selected folder (or ZIP for older browsers)
6. **Guided Setup**: Provides clear instructions to open the new project

### Files Included in Clone

The clone operation includes all essential files:
- **wb-core/**: All core website builder files (wb.html, wb.css, wb.js, wb.ts, wb.json, etc.)
- **components/**: All component files (control-panel, image-insert, etc.)
- **README.md**: Auto-generated project documentation

### Clone Benefits

- **Template Preservation**: Original template remains unchanged
- **Direct Folder Creation**: Files created directly where you want them (modern browsers)
- **Complete Projects**: Each clone is a fully functional website
- **Project Organization**: Proper folder structure maintained
- **Documentation**: Each clone includes setup instructions
- **Version Control Ready**: Clean project structure for git repositories
- **Cross-Browser Support**: Falls back to ZIP download for older browsers
- **Clear Guidance**: Step-by-step instructions to access new project

### Example Clone Process

```javascript
// Click clone button triggers:
const cloneBtn = document.getElementById('clone-btn');
cloneBtn.addEventListener('click', async () => {
    const projectName = prompt('Enter project name:', 'my-website');
    // System creates: my-website.zip with complete project
});
```

## Dependencies

The component has minimal dependencies:
- Modern browser with ES6 support
- CSS Grid and Flexbox support
- JSZip library (for template cloning functionality)
- No other external libraries required

## Integration Example

### Simple Integration (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <!-- No CSS needed - automatically loaded by component -->
</head>
<body>
    <!-- Your website content -->
    
    <!-- Just include the component script - everything else is automatic -->
    <script src="components/control-panel/control-panel.js"></script>
    
    <script>
        // Optional: Listen for component ready
        document.addEventListener('controlPanelReady', () => {
            console.log('Control panel loaded and ready!');
        });
        
        // Optional: Listen for edit mode changes
        document.addEventListener('editModeChanged', (e) => {
            if (e.detail.enabled) {
                console.log('Edit mode enabled');
                // Enable editing features
            } else {
                console.log('Edit mode disabled');
                // Disable editing features
            }
        });
    </script>
</body>
</html>
```

### Performance-Optimized Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <!-- Pre-load CSS for better performance -->
    <link rel="stylesheet" href="components/control-panel/control-panel.css">
</head>
<body>
    <!-- Your website content -->
    
    <!-- Component will detect CSS is already loaded and skip auto-loading -->
    <script src="components/control-panel/control-panel.js"></script>
</body>
</html>
```

## Troubleshooting

### Common Issues

1. **Component not loading**: 
   - Check the JavaScript file path in your script tag
   - Ensure the component's CSS file exists in the same directory
   - Check browser console for any 404 errors

2. **Styles not applying**: 
   - The component automatically loads its CSS file
   - If CSS isn't loading, check the console for path resolution errors
   - Verify both `.js` and `.css` files are in the same directory

3. **Events not firing**: 
   - Component events fire after auto-initialization
   - Listen for `controlPanelReady` event to know when component is ready
   - Ensure you're listening for events after the script tag

4. **Path resolution issues**:
   - Component auto-detects its path from the script src
   - Ensure the script src path is correct relative to your HTML file
   - CSS file must be in the same directory as the JavaScript file

### Debug Mode

The component includes comprehensive console logging with emoji indicators:
- 🎛️ Control Panel messages
- ✅ Success operations  
- ❌ Error conditions
- ⚠️ Warnings

All debug information is automatically logged to the browser console. Check the console if you're experiencing issues.

## License

This component is part of the Website Builder project. Please refer to the main project license for usage terms.