# WB Website Builder Documentation

## Overview

WB Website Builder is a modular, component-based website creation system built with HTML, CSS, and JavaScript/TypeScript. It provides a visual interface for building professional websites with advanced theming, layouts, and interactive components.

## 🎯 TypeScript Migration Benefits

This component has been converted from JavaScript to TypeScript to provide **compile-time path validation** and prevent the reference errors we encountered during the utils folder reorganization.

### Problem Solved

**Before (JavaScript):** 
- Wrong paths like `../components/control-panel/control-panel.js` vs `../wb-control-panel/control-panel.js` were only caught at runtime
- Dynamic script loading with string paths had no validation
- Refactoring could break references without warning

**After (TypeScript):**
- ✅ All import paths validated at compile time
- ✅ Type-safe component configuration
- ✅ Immediate feedback on wrong references
- ✅ IDE autocomplete and error highlighting

### Build Process

```bash
# Install dependencies
npm install

# Type check without compilation
npm run typecheck

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run build:watch
```

## Core Architecture

### File Structure
```
wb-core/
├── wb.html              # Main application file
├── wb.css               # Core styles and CSS variables
├── wb.js                # Main application logic
├── wb.json              # Site content and configuration
├── wb-data-binding.js   # Data binding utilities
├── wb-status-service.js # Status management
└── backup/              # Archived files
    ├── wb-standalone.html     # Legacy standalone version
    └── wb-standalone-documentation.md

wb-website-builder/ (TypeScript Version)
├── wb-website-builder.ts       # Main component (TypeScript)
├── wb-component-loader.ts      # Component loader (TypeScript) 
├── wb-data-binding.ts          # Data binding (TypeScript)
├── types.ts                    # Type definitions
├── tsconfig.json              # TypeScript configuration
├── dist/                      # Compiled JavaScript output
│   ├── wb-website-builder.js
│   ├── wb-component-loader.js
│   └── wb-data-binding.js
└── demo-typescript-validation.ts # Demonstrates error catching
```

### Component System
```
../components/
├── control-panel/       # Main control interface
├── wb-button/          # Button component
├── wb-color-picker/    # Color picker component
├── wb-slider/          # Range slider component
├── wb-toggle/          # Toggle switch component
├── wb-select/          # Dropdown select component
├── wb-status/          # Status bar component
├── wb-modal/           # Modal dialog component
├── wb-nav-menu/        # Navigation menu component
├── wb-viewport/        # Viewport simulator
├── wb-log-error/       # Error logging component
└── ...                 # Other components
```

## Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Local web server (for file loading)
- Internet connection (for external dependencies)

### Installation
1. Clone or download the WB Website Builder files
2. Navigate to the `wb-core` directory
3. Start a local web server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   # or use any other local server
   ```
4. Open `http://localhost:8000/wb.html` in your browser

### Quick Start
1. Open wb.html in a web browser
2. The control panel will automatically load
3. Use the visual controls to:
   - Change colors and themes
   - Modify layout and typography
   - Edit content inline
   - Add/remove sections
   - Export your website

### Development Options

#### JavaScript Version (Legacy)
```html
<script src="../wb-website-builder/wb-website-builder.js"></script>
```

#### TypeScript Version (Recommended)
```html
<script type="module" src="dist/wb-website-builder.js"></script>
```

The TypeScript source provides all the benefits during development while the compiled JavaScript runs in the browser.

## Core Features

### 🎨 **Visual Theme System**
- **Dynamic Color Palettes**: HSL-based color generation
- **Pre-built Themes**: Multiple professional color schemes
- **Real-time Preview**: See changes instantly
- **CSS Custom Properties**: Consistent theming across components

### 🖼️ **Layout Management**
- **Responsive Grid**: Golden ratio-based layouts
- **Multiple Layout Types**: Top navigation, sidebar, full-width
- **Viewport Simulation**: Test different screen sizes
- **Mobile-first Design**: Optimized for all devices

### ✏️ **Content Editing**
- **Inline Editing**: Click to edit text content
- **Visual Controls**: Drag and drop interfaces
- **Media Management**: Upload and organize images
- **Content Persistence**: Auto-save functionality

### 🔧 **Component System**
- **Modular Architecture**: Reusable UI components
- **JSON Configuration**: Data-driven component setup
- **Event System**: Inter-component communication
- **Hot Reloading**: Dynamic component loading

### 📤 **Export Options**
- **Static HTML**: Complete standalone websites
- **Component Export**: Individual component exports
- **Theme Export**: Share color schemes
- **ZIP Download**: Complete site packages

## CSS Variables System

The WB system uses a comprehensive CSS custom properties system for theming:

### Core Variables
```css
:root {
  /* Primary Colors */
  --primary: #6366f1;
  --primary-light: #a5b4fc;
  --primary-dark: #4338ca;
  
  /* Layout */
  --header-height: 80px;
  --nav-width: 22.4vw;
  --content-padding: 2rem;
  
  /* Typography */
  --font-sans: system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  
  /* Spacing (Golden Ratio) */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.618rem;
  --space-xl: 2.618rem;
}
```

### Component Variables
Each component defines its own CSS variables that inherit from or extend the core system:

```css
/* Example: Button Component */
.wb-button {
  --btn-padding: var(--space-sm) var(--space-md);
  --btn-radius: var(--radius-md);
  --btn-primary-bg: var(--primary);
  --btn-primary-text: white;
}
```

## 🛡️ TypeScript Type Safety Features

### 1. Compile-time Path Validation
```typescript
// ✅ TypeScript validates these paths exist
import '@utils/wb/wb-component-utils.js';
import '../wb-event-log/wb-event-log.js';

// ❌ TypeScript would error on wrong paths
// import '../components/wb-button/wb-button.js';  // Wrong structure
```

### 2. Type-safe Component Registry
```typescript
type ComponentPath = 
  | '@components/wb-button/wb-button.js'
  | '@components/wb-modal/wb-modal.js'
  | /* other valid paths */;

interface ComponentConfig {
  script: ComponentPath;  // Only allows valid paths
  css: CSSPath;          // Only allows valid CSS paths
  priority: 'essential' | 'high' | 'lazy';
  dependencies: string[];
}
```

### 3. Path Mapping with Validation
```typescript
// TypeScript validates these aliases resolve to real files
"paths": {
  "@utils/*": ["../../utils/*"],
  "@components/*": ["../*"],
  "@styles/*": ["../../styles/*"]
}
```

### 4. Testing TypeScript Validation

Run this to see TypeScript catch errors:
```bash
# This will show any type or path errors
npm run typecheck
```

See `demo-typescript-validation.ts` for examples of what TypeScript catches vs allows.

### 5. Migration Benefits

1. **Immediate Error Detection**: Wrong paths caught during development, not in production
2. **Refactoring Safety**: Moving files automatically updates import validation
3. **Better IDE Support**: Autocomplete, go-to-definition, error highlighting
4. **Documentation**: Types serve as living documentation
5. **Team Collaboration**: Prevents common path mistakes

### 6. TypeScript vs JavaScript Error Detection

**YES!** TypeScript would have caught:
- ✅ Wrong import paths (`utils/wb-component-utils.js` vs `../../utils/wb/wb-component-utils.js`)
- ✅ Missing files during static imports
- ✅ Incorrect component registry paths
- ✅ Type mismatches in configuration objects

**But NOT:**
- ❌ Dynamic script loading with string paths (runtime issue)
- ❌ CSS file paths in template literals (just strings to TS)

**Solution:** We converted dynamic loading to static imports where possible, and used typed string literals for paths that must remain dynamic.

## Component Development

### Creating a New Component

1. **Create Component Directory**:
   ```
   components/your-component/
   ├── your-component.js
   ├── your-component.css
   ├── your-component.json
   ├── your-component-demo.html
   └── your-component.md
   ```

2. **Component Structure** (your-component.js):
   ```javascript
   (function() {
       'use strict';
       
       const COMPONENT_NAME = 'your-component';
       
       // Load configuration
       async function loadConfig() {
           // Component initialization
       }
       
       // Public API
       window.YourComponent = {
           // Public methods
       };
       
       // Initialize
       loadConfig();
   })();
   ```

3. **Configuration** (your-component.json):
   ```json
   {
     "name": "your-component",
     "version": "1.0.0",
     "description": "Component description",
     "classes": {
       "base": "your-component",
       "container": "your-component-container"
     },
     "defaults": {
       "theme": "dark",
       "size": "medium"
     }
   }
   ```

### Component Integration

To integrate a component with the main system:

1. **Add CSS Import** to wb.html:
   ```html
   <link rel="stylesheet" href="../components/your-component/your-component.css" />
   ```

2. **Add JavaScript Import**:
   ```html
   <script src="../components/your-component/your-component.js"></script>
   ```

3. **Register with Control Panel** (if needed):
   ```javascript
   // In control panel configuration
   window.WBControlPanel.addComponent('your-component', config);
   ```

## Data Binding System

WB uses a reactive data binding system through `wb-data-binding.js`:

### Basic Usage
```javascript
// Bind data to elements
WBDataBinding.bind('site-title', {
  content: 'My Website',
  editable: true
});

// Listen for changes
WBDataBinding.onChange('site-title', (newValue) => {
  console.log('Title changed:', newValue);
});
```

### Configuration-Driven Content
Content is managed through `wb.json`:

```json
{
  "site": {
    "title": "My Website",
    "description": "Website description"
  },
  "navigation": [
    {"text": "Home", "href": "#home"},
    {"text": "About", "href": "#about"}
  ],
  "sections": {
    "hero": {
      "title": "Welcome",
      "description": "Hero section content"
    }
  }
}
```

## Status System

The status system provides real-time feedback through `wb-status-service.js`:

```javascript
// Show status messages
WBStatus.info('Component loaded successfully');
WBStatus.error('Failed to save configuration');
WBStatus.warning('Unsaved changes detected');

// Progress indicators
WBStatus.progress('Saving...', 50);
WBStatus.complete('Save completed');
```

## Error Logging

The wb-log-error component provides comprehensive error tracking:

```javascript
// Manual error logging
WBLogError.error('Something went wrong', 'component.js');
WBLogError.warn('Deprecated feature used');

// Automatic error capture
// Console errors, unhandled exceptions, and promise rejections
// are automatically captured and logged

// Export error logs
WBLogError.export('issues'); // Downloads issues.md file
```

## Theming and Customization

### Creating Custom Themes

1. **Define Color Palette**:
   ```javascript
   const customTheme = {
     primary: '#your-color',
     secondary: '#your-secondary',
     accent: '#your-accent'
   };
   ```

2. **Apply Theme**:
   ```javascript
   WBTheme.apply(customTheme);
   ```

3. **Save Theme**:
   ```javascript
   WBTheme.save('my-custom-theme');
   ```

### Layout Customization

Modify layout through CSS variables:

```css
:root {
  --nav-width: 25vw;           /* Wider navigation */
  --header-height: 100px;      /* Taller header */
  --content-padding: 3rem;     /* More content padding */
}
```

## Performance Optimization

### Lazy Loading
Components are loaded on-demand:

```javascript
// Load component when needed
async function loadComponent(name) {
  if (!window[name]) {
    await import(`../components/${name}/${name}.js`);
  }
}
```

### CSS Optimization
- CSS custom properties for efficient styling
- Minimal reflows through careful DOM manipulation
- Efficient selector strategies

### JavaScript Optimization
- Event delegation for dynamic content
- Debounced user input handling
- Minimal global scope pollution

## Testing

### Component Testing
Each component includes:
- Demo page for visual testing
- Unit tests for functionality
- Integration tests with the main system

### Browser Testing
Supported browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility Testing
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support

## Deployment

### Static Deployment
1. **Build Process**: No build step required - direct file deployment
2. **File Structure**: Maintain relative paths for assets
3. **Server Configuration**: Ensure proper MIME types for all files

### CDN Deployment
1. Upload all files to CDN
2. Update paths in wb.html if needed
3. Configure proper cache headers

### Self-Contained Export
Use the export functionality to create standalone websites:
1. Click "Export" in the control panel
2. Download the generated ZIP file
3. Deploy the extracted files to any web server

## API Reference

### Main Application (wb.js)
```javascript
window.WB = {
  // Core functionality
  init(),
  loadConfig(),
  saveConfig(),
  
  // Theme management
  setTheme(theme),
  getTheme(),
  
  // Layout management
  setLayout(layout),
  getLayout(),
  
  // Content management
  updateContent(section, data),
  getContent(section)
};
```

### Control Panel
```javascript
window.WBControlPanel = {
  show(),
  hide(),
  toggle(),
  addComponent(name, config),
  removeComponent(name)
};
```

### Data Binding
```javascript
window.WBDataBinding = {
  bind(selector, data),
  unbind(selector),
  onChange(selector, callback),
  getValue(selector),
  setValue(selector, value)
};
```

## Troubleshooting

### Common Issues

1. **Components Not Loading**
   - Check file paths in wb.html
   - Verify local server is running
   - Check browser console for errors

2. **Styles Not Applying**
   - Verify CSS file paths
   - Check for CSS variable conflicts
   - Ensure proper CSS cascade

3. **Data Not Persisting**
   - Check localStorage availability
   - Verify JSON syntax in wb.json
   - Check data binding configuration

### Debug Mode
Enable debug mode for detailed logging:

```javascript
window.WB_DEBUG = true;
```

### Error Logging
The wb-log-error component automatically captures:
- JavaScript errors
- Promise rejections
- Console warnings
- Component failures

Access logs through:
- Visual error panel (Ctrl+Shift+E)
- Export to issues.md file
- Browser developer tools

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes following the coding standards
4. Test thoroughly
5. Submit a pull request

### Coding Standards
- Use ES6+ features
- Follow consistent naming conventions
- Document all public APIs
- Include component demos
- Write comprehensive tests

### Component Guidelines
- Self-contained functionality
- Minimal external dependencies
- Consistent API patterns
- Accessibility compliance
- Performance optimization

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review component documentation
- Submit issues through the error logging system
- Consult the API reference

---

*Generated by WB Website Builder Documentation System*