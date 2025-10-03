# Website Builder - Monday Build

A modular web-based site builder with Material Design color integration and comprehensive test coverage. Create beautiful, responsive websites with real-time editing, authentic Material Design colors, and exportable HTML.


## Modular Architecture (Updated July 8, 2025)

The project has been restructured with a modular architecture for better maintainability:

`
Working/
├── core/             # Core application modules
│   ├── state/        # State management
│   ├── theme/        # Theme management
│   ├── layout/       # Layout functionality
│   ├── utils/        # Utility functions
│   └── api/          # API interfaces
├── components/       # Web components
├── plugins/          # User plugins (included in exports)
├── dev-plugins/      # Developer plugins (stripped during export)
├── assets/           # Static assets
├── index.html        # Main HTML file
├── script.js         # Main JS file (loads modular code)
└── styles.css        # Main CSS file
`

For detailed documentation, see [Modular Architecture Documentation](./docs/modular-architecture.md)


## Quick Start

### Development Server

```powershell
cd tests
npm start
```

This will:

1. Kill any processes on ports 3000 and 8080
2. Start the development server at http://localhost:3000
3. Serve the Monday folder with all assets

### Running Tests

```powershell
cd tests
npm test          # Run all tests in headless mode
npm run test:ui   # Run tests with Playwright UI
npm run test:headed  # Run tests with browser visible
```

## File Structure

- `index.html` - The main HTML structure of the application
- `MaterialDesign.html` - Material Design color editor with real Google Material Color Utilities
- `styles.css` - All the styling for the application
- `script.js` - All the JavaScript functionality
- `ControlPanel.js` - Web Component implementation of the control panel
- `ControlPanelContent.html` - HTML content for the control panel
- `control-panel-test.html` - Test page for control panel functionality
- `test-control-panel.js` - Test script for control panel events
- `fixes.md` - Log of fixes and improvements
- `wb_html_cleaned.html` - The original single-file version (for reference)
- `tests/` - Playwright test suite with comprehensive coverage

## Features

The Website Builder allows users to:

1. **Create and edit website content** with a visual interface
2. **Choose between different layout options** (top, left, or right navigation)
3. **Customize colors using real Material Design** - Uses Google's official Material Color Utilities
4. **Apply pre-built themes** (default, cyberpunk, ocean, sunset, forest)
5. **Toggle between dark and light mode** independently from the theme selection
6. **Enable gradient backgrounds** for sections
7. **Insert media** (images, video, audio) in any editable region
8. **Import/Export sites** - Save and load your designs
9. **Save the designed website** as a clean HTML file

## Material Design Integration

The `MaterialDesign.html` file provides authentic Material Design color generation:

- **Real Material Design colors** using Google's official Material Color Utilities CDN
- **Automatic palette generation** from any base color (primary, secondary, tertiary, error)
- **Light/dark theme variants** with proper contrast ratios
- **Live color preview** with interactive hue slider (0-360°)
- **Fallback color system** when CDN is unavailable with status indicator
- **Export functionality** to apply colors directly to the main site builder
- **Accessibility compliance** following Material Design 3 guidelines

## Control Panel Architecture

The control panel is implemented as a web component (`<control-panel>`) for better modularity and reusability:

1. **ControlPanel.js** - Defines the `<control-panel>` web component with shadow DOM
2. **ControlPanelContent.html** - Contains all the controls HTML that gets loaded into the panel
3. **index.html** - Contains the main website structure and initializes the control panel
4. **script.js** - Implements all event handlers and functionality

## Event Handler Initialization

Control panel handlers are initialized using a global function called `initControlPanelHandlers()` that can be called:

1. On initial page load
2. When control panel content is dynamically loaded
3. Via a custom event `controlpanel:contentloaded`

## Recent Fixes & Updates

### July 3, 2025 - Major Workflow Improvements

- **Removed all legacy .bat files** - Now using npm-only workflow exclusively
- **Enhanced Material Color Utilities loading** with backup CDN and proper status indication
- **Improved Material Design color editor** with real Google algorithms and fallback mode
- **Updated documentation** to reflect current npm-only development workflow
- **Verified test infrastructure** serves correct Monday folder for all scenarios

### July 1, 2025 - Control Panel & Event Handler Fixes

- **Fixed control panel event handlers** not working after dynamic content loading
- **Added proper re-initialization** of event handlers when content is loaded
- **Improved handler reliability** with fresh DOM element references
- **Added comprehensive test scripts** to verify functionality

## NPM Scripts

All development is now handled through npm scripts:

### In the `tests/` directory:

```powershell
npm start           # Start development server (kills ports, serves on :3000)
npm test            # Run all Playwright tests
npm run test:ui     # Run tests with Playwright UI
npm run test:headed # Run tests with browser visible
npm run kill-ports  # Kill processes on ports 3000 and 8080
```

## Usage

### Development Mode

1. `cd tests && npm start`
2. Navigate to http://localhost:3000
3. Use the control panel to customize your website
4. Access Material Design editor at http://localhost:3000/MaterialDesign.html

### Production Use

1. Toggle "Edit Mode" to make content editable
2. Insert media using the buttons that appear above editable regions in Edit Mode
3. Change layouts, colors and themes using the control panel
4. Use import/export to save and load your designs
5. Click "Save Website" when finished to download your creation

## Testing

Comprehensive Playwright test coverage includes:

### Test Files

- `material-design-colors.spec.js` - Material Design color generation and theme switching
- `theme-init-darkmode.spec.js` - Dark mode initialization and persistence
- `theme-darkmode-enhanced.spec.js` - Enhanced dark mode testing with CSS validation
- `control-panel.spec.js` - Control panel functionality and event handling
- `theme-persistence.spec.js` - Theme and mode persistence across page loads

### Test Infrastructure

- `test-server.js` - Development server with proper MIME types and CORS headers
- `playwright.config.js` - Playwright configuration optimized for the project
- `package.json` - NPM scripts with automated port management and test execution
- Automated port cleanup prevents conflicts during development

## Development

This application uses modern web standards and best practices:

### Architecture

- **Vanilla JavaScript** with ES6+ features and modules
- **CSS Grid and Flexbox** for responsive layouts
- **Web Components** for modular, reusable architecture
- **CSS Custom Properties** for consistent theming
- **Material Design 3** color system with authentic algorithms
- **Progressive enhancement** with graceful fallbacks

### Key Features

- **No build tools required** - runs directly in modern browsers
- **Modular file structure** for maintainability and debugging
- **Event-driven architecture** with proper cleanup and re-initialization
- **Comprehensive error handling** with user-friendly fallbacks
- **Accessibility-first design** following WCAG guidelines

### Dependencies

- **JSZip** - For import/export functionality
- **Google Material Color Utilities** - For authentic Material Design colors
- **Playwright** - For automated testing (dev dependency)

### Browser Support

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

### Browser Support

- **Chrome 60+** (recommended for best performance)
- **Firefox 55+** (full feature support)
- **Safari 12+** (Web Components supported)
- **Edge 79+** (Chromium-based, recommended)

### Project Structure

The code is organized into modular files for optimal maintainability:

- `index.html` - Main application structure and layout
- `MaterialDesign.html` - Dedicated Material Design color editor
- `ControlPanelContent.html` - Control panel UI components
- `ControlPanel.js` - Web component for modular control panel
- `styles.css` - Complete application styling with CSS custom properties
- `script.js` - Core functionality, event handling, and application logic
- `tests/` - Comprehensive Playwright test suite with CI/CD ready configuration

---

**Originally created:** June 23, 2025  
**Last updated:** July 3, 2025  
**Current version:** 2.0 (Modular NPM-based workflow)

