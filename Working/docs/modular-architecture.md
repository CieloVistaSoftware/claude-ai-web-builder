# Modular Architecture Documentation

## Overview

This project has been restructured into a modular architecture that improves maintainability and clarity. The new structure separates core functionality, web components, plugins, and development-only plugins into distinct directories.

## Folder Structure

```
Working/
├── core/             # Core application modules
│   ├── state/        # State management
│   ├── theme/        # Theme management
│   ├── layout/       # Layout functionality
│   ├── utils/        # Utility functions
│   └── api/          # API interfaces
├── components/       # Web components
│   ├── control-panel/
│   ├── color-picker/
│   └── layout-editor/
├── plugins/          # User plugins (included in exports)
├── dev-plugins/      # Developer plugins (stripped during export)
├── assets/           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── index.html        # Main HTML file
├── script.js         # Main JS file (loads modular code)
└── styles.css        # Main CSS file
```

## Module Structure

### Core Modules

The core functionality has been split into modules:

- **state**: Website state management
- **theme**: Theme handling, color management
- **layout**: Layout management and manipulation
- **utils**: Helper functions
- **api**: External service interactions

### Components

Web components are self-contained UI elements:

- **ControlPanel**: The main control interface for the application
- **ColorPicker**: Color selection component
- **LayoutEditor**: Interface for editing layouts

### Plugins vs Dev-Plugins

- **plugins/**: Features that are included in exported websites
- **dev-plugins/**: Development tools that are not included in exports

## How To Use

1. Import modules as needed in your JS files:
   ```js
   import { WebsiteState } from './core/state/website-state.js';
   ```

2. Create new components in the components/ directory with their own directories

3. Add new plugins in the appropriate plugins directory

## Migration Notes

- The old monolithic script.js has been replaced with modular code
- The application uses ES modules (import/export) for dependencies
- Web Components are used for UI elements

## Development Workflow

1. Work on individual modules in their respective directories
2. Use the main.js file as the application entry point
3. Keep plugins in their appropriate directories based on whether they should be included in exports
