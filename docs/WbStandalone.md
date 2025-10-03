# Website Builder Standalone Documentation

---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: Claude Code Assistant*
*Status: Current - Standalone implementation guide*
---

## Overview

The Website Builder (WB) Standalone is a comprehensive, client-side website creation tool that enables users to build, customize, and export responsive websites without requiring server-side processing. This document provides in-depth technical details about the architecture, components, and functionality.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
- [State Management](#state-management)
- [Theme System](#theme-system)
- [Layout System](#layout-system)
- [Save/Load System](#saveload-system)
- [Control Panel](#control-panel)
- [Plugin System](#plugin-system)
- [File Structure](#file-structure)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

### System Design

The Website Builder follows a modular, component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Website Builder Core                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │    State    │  │   Theme     │  │   Layout    │  │   UI    │ │
│  │ Management  │  │  Manager    │  │  Manager    │  │Controller│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ SaveLoad    │  │   Edit      │  │   Media     │  │ Control │ │
│  │  Manager    │  │  Manager    │  │  Manager    │  │  Panel  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Plugin    │  │ WebSocket   │  │    Dev      │             │
│  │   System    │  │   Loader    │  │   Plugins   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

- **Real-time Visual Editing**: WYSIWYG editing with live preview
- **Theme System**: Pre-built themes with customizable colors
- **Layout Management**: Multiple layout options (top, left, right navigation)
- **State Persistence**: Complete state saving and restoration
- **Plugin Architecture**: Extensible plugin system
- **Responsive Design**: Mobile-first, responsive layouts
- **Export Functionality**: Self-contained HTML export
- **Drag-and-Drop Interface**: Intuitive user experience

## Core Components

### 1. WebsiteBuilder (`core/WebsiteBuilder.ts`)

The main entry point and orchestrator for the entire system.

**Responsibilities:**
- Initialize all core managers
- Coordinate component interactions
- Handle application lifecycle
- Manage global event handling

**Key Methods:**
```typescript
class WebsiteBuilder {
  async initialize(): Promise<void>
  setupEventHandlers(): void
  getCurrentState(): WebsiteState
  destroy(): void
}
```

### 2. UIController (`core/UIController.ts`)

Manages all user interface interactions and control bindings.

**Responsibilities:**
- Control panel event handling
- UI state synchronization
- Status message management
- Color slider management

**Key Features:**
- Theme selector binding
- Layout toggle handling
- Dark/light mode switching
- Real-time color adjustment
- Edit mode management

### 3. WebsiteState (`core/state/WebsiteState.ts`)

Centralized state management system using the observer pattern.

**State Structure:**
```typescript
interface WebsiteState {
  theme: string;           // Current theme name
  mode: 'light' | 'dark';  // Display mode
  layout: string;          // Navigation layout
  isEditMode: boolean;     // Edit mode status
  isGradientMode: boolean; // Gradient effects
  colors: {
    hue: number;
    saturation: number;
    lightness: number;
    harmonyAngle: number;
    primary: string;
    secondary: string;
    accent: string;
    primaryLight: string;
    primaryDark: string;
    hoverColor: string;
  };
}
```

## State Management

### Observer Pattern Implementation

The state management system uses a publish-subscribe pattern for reactive updates:

```typescript
// Subscribe to state changes
const unsubscribe = WebsiteState.subscribe((newState, oldState) => {
  console.log('State changed:', { newState, oldState });
  // Update UI accordingly
});

// Update state (triggers all subscribers)
WebsiteState.setState({ theme: 'ocean', mode: 'dark' });

// Unsubscribe when no longer needed
unsubscribe();
```

### State Persistence

State is automatically persisted to localStorage and restored on page load:

```typescript
// Save current state
WebsiteState.saveToStorage();

// Load saved state
await WebsiteState.loadFromStorage();
```

### State Synchronization

All UI changes automatically update the central state:
- Theme selection → `setState({ theme, colors })`
- Layout changes → `setState({ layout })`
- Mode toggles → `setState({ mode })`
- Color adjustments → `setState({ colors })`

## Theme System

### ThemeManager (`core/theme/ThemeManager.ts`)

Handles theme application and color calculations.

### Available Themes

1. **Default**: Blue-based professional theme
2. **Ocean**: Aqua and blue tones
3. **Sunset**: Orange and red gradients
4. **Forest**: Green nature-inspired colors
5. **Cyberpunk**: Neon cyan and magenta

### Color Calculation System

The system uses HSL color space for dynamic color generation:

```typescript
// Calculate harmonious color palette
const colors = ThemeManager.calculateColors(
  hue,        // 0-360
  saturation, // 0-100
  lightness,  // 0-100
  harmonyAngle // 0-360
);
```

### CSS Variable System

Themes are implemented using CSS custom properties:

```css
:root {
  --primary: #6366f1;
  --secondary: #64748b;
  --accent: #10b981;
  --bg-primary: var(--dark-bg-primary);
  --text-primary: var(--dark-text-primary);
}
```

## Layout System

### LayoutManager (`core/layout/LayoutManager.ts`)

Manages website layout configurations using CSS Grid.

### Layout Types

#### 1. Top Navigation (`top-nav`)
```css
.site-container {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "nav"
    "content"
    "footer";
}
```

#### 2. Left Navigation (`left-nav`)
```css
.site-container {
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "nav content"
    "nav footer";
}
```

#### 3. Right Navigation (`right-nav`)
```css
.site-container {
  grid-template-columns: 1fr 200px;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "content nav"
    "footer nav";
}
```

### Layout Application

Layouts are applied by setting data attributes and CSS classes:

```typescript
// Apply layout
LayoutManager.applyLayout('left-nav');

// This sets:
// document.body.setAttribute('data-layout', 'left-nav');
// Updates CSS grid properties
// Repositions navigation elements
```

## Save/Load System

### SaveLoadManager (`core/save/SaveLoadManager.ts`)

Comprehensive save and import functionality with complete state preservation.

### Save Process

1. **State Capture**: Get complete website state
2. **Content Cloning**: Clone and clean site container
3. **HTML Generation**: Create standalone HTML document
4. **Asset Embedding**: Embed CSS and initialization scripts
5. **File Export**: Generate downloadable HTML file

### Export Features

- **Self-Contained**: All CSS and scripts embedded
- **State Preservation**: Complete theme and layout restoration
- **Clean Output**: Development tools and controls removed
- **Custom Naming**: User-defined titles and filenames

### Import Process

1. **File Parsing**: Parse imported HTML document
2. **State Extraction**: Extract theme, layout, and mode information
3. **Content Import**: Replace current site content
4. **State Restoration**: Apply imported settings
5. **UI Synchronization**: Update control panel to match

### Generated HTML Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="ocean" data-mode="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>/* Embedded CSS with theme variables */</style>
  <script>/* Initialization script with state */</script>
</head>
<body data-theme="ocean" data-mode="dark" data-layout="top-nav" 
      class="theme-ocean dark-mode">
  <!-- Site content -->
</body>
</html>
```

## Control Panel

### ControlPanel Component (`components/ControlPanel.ts`)

Web Component providing the main user interface.

### Features

- **Draggable Interface**: Click and drag to reposition
- **Collapsible Design**: Minimize/maximize functionality
- **Shadow DOM**: Encapsulated styling
- **Responsive Layout**: Adapts to different screen sizes

### Control Elements

1. **Theme Selector**: Dropdown for theme selection
2. **Layout Toggle**: Radio buttons for layout options
3. **Mode Switch**: Dark/light mode toggle
4. **Color Sliders**: HSL adjustment controls
5. **Action Buttons**: Save, import, edit mode toggles

### Drag Implementation

```typescript
// Drag functionality with boundary constraints
let isDragging = false, startX, startY, startLeft, startTop;

dragHandle.addEventListener('mousedown', (e) => {
  if (e.target.closest('button')) return; // Ignore button clicks
  isDragging = true;
  // Capture initial positions
  startX = e.clientX;
  startY = e.clientY;
  const rect = this.getBoundingClientRect();
  startLeft = rect.left;
  startTop = rect.top;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  // Calculate new position with boundary checking
  const newLeft = Math.max(0, Math.min(
    startLeft + deltaX, 
    window.innerWidth - this.offsetWidth
  ));
  const newTop = Math.max(0, Math.min(
    startTop + deltaY, 
    window.innerHeight - this.offsetHeight
  ));
  // Apply new position
  this.style.left = newLeft + 'px';
  this.style.top = newTop + 'px';
});
```

## Plugin System

### DevPluginSystem (`dev-plugins/dev-plugin-loader.ts`)

Extensible plugin architecture for development tools.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  version: string;
  initialize(): Promise<void>;
  beforeSave?(html: string): Promise<string>;
  afterLoad?(): Promise<void>;
  destroy?(): Promise<void>;
}
```

### Plugin Lifecycle

1. **Registration**: Plugins register with the system
2. **Initialization**: Plugins are initialized during startup
3. **Event Hooks**: Plugins can hook into save/load events
4. **Cleanup**: Plugins can clean up resources

### Available Hooks

- `beforeSave`: Modify HTML before export
- `afterLoad`: Execute after site load
- `onStateChange`: React to state changes
- `onThemeChange`: Handle theme transitions

## File Structure

```
Working/
├── core/                    # Core system modules
│   ├── WebsiteBuilder.ts   # Main orchestrator
│   ├── UIController.ts     # UI management
│   ├── api/               # API interfaces
│   ├── edit/              # Edit mode functionality
│   │   ├── EditModeManager.ts
│   │   └── MediaManager.ts
│   ├── layout/            # Layout management
│   │   └── LayoutManager.ts
│   ├── save/              # Save/load functionality
│   │   └── SaveLoadManager.ts
│   ├── state/             # State management
│   │   └── WebsiteState.ts
│   ├── theme/             # Theme system
│   │   └── ThemeManager.ts
│   └── utils/             # Utility functions
├── components/            # UI components
│   ├── ControlPanel.ts    # Main control panel
│   └── control-panel/     # Control panel modules
│       ├── ControlPanel.ts
│       ├── ControlPanelContent.html
│       ├── control-panel-content.css
│       ├── index.ts
│       └── loader.ts
├── dev-plugins/           # Development plugins
│   ├── dev-plugin-loader.ts
│   └── obfuscate/         # Code obfuscation plugin
├── plugins/               # Runtime plugins
│   └── search/            # Site search functionality
├── tests/                 # Test suites
├── docs/                  # Documentation
├── styles.css             # Main stylesheet
├── index.html             # Entry point
└── main.ts               # Application bootstrap
```

## API Reference

### WebsiteState API

```typescript
// Get current state
const state = WebsiteState.getState();

// Update state
WebsiteState.setState({
  theme: 'ocean',
  mode: 'dark',
  colors: { primary: '#0ea5e9' }
});

// Subscribe to changes
const unsubscribe = WebsiteState.subscribe((newState, oldState) => {
  // Handle state change
});

// Persistence
WebsiteState.saveToStorage();
await WebsiteState.loadFromStorage();
```

### ThemeManager API

```typescript
// Apply theme
ThemeManager.applyTheme('ocean');

// Calculate colors
const colors = ThemeManager.calculateColors(200, 70, 50, 30);

// Get available themes
const themes = ThemeManager.getAvailableThemes();
```

### SaveLoadManager API

```typescript
// Save website
await SaveLoadManager.saveWebsite();

// Import website
const file = /* File object */;
await SaveLoadManager.importWebsite(file);

// Get styles
const css = await SaveLoadManager.getStylesCSS();
```

### UIController API

```typescript
// Show status message
UIController.showStatusMessage('Success!', 3000);

// Toggle edit mode
UIController.toggleEditMode();

// Setup controls
UIController.setupControls();
```

## Usage Examples

### Basic Initialization

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website Builder</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="site-container" class="site-container">
    <!-- Site content -->
  </div>
  
  <control-panel>
    <span slot="title">Website Builder</span>
  </control-panel>
  
  <script type="module" src="main.js"></script>
</body>
</html>
```

### Custom Theme Creation

```typescript
// Register custom theme
ThemeManager.registerTheme('custom', {
  hue: 280,
  saturation: 80,
  lightness: 60,
  name: 'Custom Purple'
});

// Apply custom theme
WebsiteState.setState({ theme: 'custom' });
```

### Plugin Development

```typescript
class MyPlugin {
  name = 'MyPlugin';
  version = '1.0.0';
  
  async initialize() {
    console.log('Plugin initialized');
    // Setup plugin functionality
  }
  
  async beforeSave(html) {
    // Modify HTML before save
    return html.replace(/dev-only/g, '');
  }
  
  async destroy() {
    // Cleanup resources
  }
}

// Register plugin
DevPluginSystem.registerPlugin(new MyPlugin());
```

### State Management

```typescript
// Listen for theme changes
WebsiteState.subscribe((newState, oldState) => {
  if (newState.theme !== oldState.theme) {
    console.log(`Theme changed: ${oldState.theme} → ${newState.theme}`);
    // Update custom UI elements
  }
});

// Batch state updates
WebsiteState.setState({
  theme: 'sunset',
  mode: 'light',
  layout: 'left-nav',
  colors: {
    primary: '#f97316',
    secondary: '#fb923c'
  }
});
```

## Troubleshooting

### Common Issues

#### 1. Control Panel Not Appearing
**Symptoms**: Control panel doesn't render or appears without content

**Solutions**:
- Check that `ControlPanel.js` is loaded
- Verify `ControlPanelContent.html` exists
- Check browser console for loading errors
- Ensure web components are supported

#### 2. State Not Persisting
**Symptoms**: Settings reset on page reload

**Solutions**:
- Check localStorage availability
- Verify `WebsiteState.saveToStorage()` is called
- Check for localStorage quota exceeded
- Ensure proper state initialization

#### 3. Themes Not Applying
**Symptoms**: Theme selection doesn't change appearance

**Solutions**:
- Verify CSS custom properties support
- Check for CSS conflicts
- Ensure proper theme data structure
- Validate theme calculation logic

#### 4. Export Issues
**Symptoms**: Saved HTML doesn't match preview

**Solutions**:
- Check for incomplete state capture
- Verify CSS embedding process
- Ensure proper HTML cleanup
- Validate initialization script

### Debug Mode

Enable debug logging by setting:

```javascript
window.WB_DEBUG = true;
```

This provides detailed console output for:
- State changes
- Theme calculations
- Save/load operations
- Plugin lifecycle events

### Performance Optimization

#### 1. State Updates
- Batch multiple state changes
- Use debouncing for rapid updates
- Minimize subscriber count

#### 2. Theme Application
- Cache calculated colors
- Avoid redundant CSS updates
- Use CSS transitions sparingly

#### 3. Save Operations
- Optimize HTML cleanup process
- Compress embedded assets
- Use worker threads for large operations

## Best Practices

### Development

1. **State Management**
   - Always use `WebsiteState.setState()` for updates
   - Subscribe to state changes for reactive UI
   - Avoid direct state mutation

2. **Theme Development**
   - Use semantic color naming
   - Ensure sufficient contrast ratios
   - Test in both light and dark modes

3. **Plugin Development**
   - Implement proper cleanup in `destroy()`
   - Handle errors gracefully
   - Use namespaced naming conventions

4. **Performance**
   - Minimize DOM queries
   - Use event delegation
   - Implement lazy loading where possible

### Deployment

1. **Asset Optimization**
   - Minify CSS and JavaScript
   - Optimize images and icons
   - Use compression for large files

2. **Browser Compatibility**
   - Test in multiple browsers
   - Provide fallbacks for modern features
   - Validate HTML and CSS

3. **Security**
   - Sanitize user input
   - Validate imported files
   - Use CSP headers where appropriate

## Conclusion

The Website Builder Standalone provides a comprehensive, extensible platform for creating responsive websites. Its modular architecture, robust state management, and plugin system make it suitable for both simple websites and complex applications.

For additional support or feature requests, please refer to the project repository or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-19  
**Authors**: Website Builder Development Team