# Website Builder (wb.ts)

## Overview

The Website Builder (`wb.ts`) is the core TypeScript file that powers the Claude AI Website Builder application. It provides an intuitive, browser-based interface for designing, customizing, and exporting responsive websites without requiring coding knowledge.

## Features

- **Edit Mode**: Directly edit content in the browser with a simple toggle
- **Theme Management**: Switch between light, dark, and custom themes
- **System Color Detection**: Automatically adapt to system light/dark preferences
- **Layout Options**: Change between top navigation, side navigation, and other layouts
- **Color Customization**: Interactive color bar and sliders for theme customization
- **Media Support**: Add images, videos, and audio through placeholders
- **Dynamic Page Creation**: Automatically generate pages when navigating to non-existent sections
- **State Management**: Save and restore website design state
- **Right-click Context Menus**: Insert media above/below content through context menus
- **Export Functionality**: Generate complete website files (HTML, CSS, JS)

## Architecture

The file is organized into several functional areas:

1. **Type Definitions**: TypeScript interfaces for state management
2. **Global State**: Variables tracking application state
3. **DOM Element References**: Strongly typed references to UI elements
4. **Initialization**: Setup functions run on page load
5. **UI Controls**: Event handlers for buttons, dropdowns, and sliders
6. **Color Management**: Functions for color manipulation and theme application
7. **Content Management**: Handlers for editable content and media
8. **Dynamic Page Creation**: Functions to generate new page sections
9. **State Persistence**: Save/load functions using localStorage
10. **Utility Functions**: Helper functions for common tasks

## Technical Details

- Written in TypeScript for improved type safety
- No external dependencies - pure vanilla TypeScript/JavaScript
- Uses modern browser APIs (localStorage, File API, etc.)
- Supports all modern browsers (Chrome, Firefox, Safari, Edge)

## Dependencies

- **wb.html**: The HTML interface that loads this script
- **wb.css**: Styling for the website builder interface

## Usage

The Website Builder is intended to be loaded through the wb.html file. Users interact with the builder through a visual interface without needing to modify the code directly.

## File History

The file was originally created as a JavaScript file (wb.js) and later converted to TypeScript (wb.ts) to improve maintainability, type safety, and documentation.

## Compilation

To compile the TypeScript file to JavaScript, use:

```bash
tsc -p tsconfig.wb.json
```

This will generate the JavaScript file in the dist/wb directory.

## Main Functions

- **init()**: Initializes the application and sets up all event handlers
- **setupEditMode()**: Configures the content editing functionality
- **setColorMode()**: Controls theme switching between light/dark/custom modes
- **createDynamicPage()**: Generates new page sections on demand
- **saveWebsiteFiles()**: Exports the final website as HTML, CSS, and JS files
- **saveState()** / **loadSavedState()**: Manage persistent application state
