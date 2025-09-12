# Claude AI Website Builder Project Structure

## Overview

This document outlines the architecture and folder structure of the Claude AI Website Builder project. The project uses multiple architectural approaches, which have been organized into a clear structure to improve maintainability.

## Folder Structure

### `/pages`

Contains standalone web pages with their associated assets.

- `/pages/wizard` - The website builder wizard (entry point for users)
- `.` - The main website builder interface
- `/pages/templates` - Template example pages

### `/components`

Reusable components organized by functionality.

- `/components/core` - Core JavaScript/TypeScript utilities and shared functions
- `/components/table` - Table-related components
- `/components/theme` - Theme management components
- `/components/registry` - Component registration system
- `/components/ui` - UI components
- `/components/web` - Web components

### `/html`

Pure HTML files separated by purpose.

- `/html/layouts` - Layout templates
- `/html/pages` - Standalone HTML pages
- `/html/components` - HTML component templates

### `/themes`

Theme-related files and components.

- `/themes/generator` - Theme generator tool
- `/themes/components` - Theme-specific components
- `/themes/css` - Theme stylesheets

### `/css`

Global CSS files.

- `/css/bootstrap.css` - Bootstrap framework
- `/css/custom.css` - Custom global styles
- `/css/themes` - Theme-specific CSS files

### `/src`

TypeScript source files.

- `WebsiteBuilderWizard.ts` - Main wizard component
- `main.tsx` - Main entry point for React components
- Other TypeScript implementations

### `/Tests`

Test files and utilities.

- `/Tests/playwright` - Playwright test specs
- Other test utilities

### `/artifacts`

Legacy and deprecated files preserved for reference.

- `/artifacts/old-html` - Old HTML files
- `/artifacts/old-components` - Old component implementations
- `/artifacts/old-js` - Old JavaScript files
- `/artifacts/zzz` - Miscellaneous legacy items

- `bootstrap.css` - Bootstrap framework
- `custom.css` - Project-wide custom styles
- `/themes` - Theme-specific stylesheets

### `/dist`

Build output directory for TypeScript compilation.

### `/artifacts`

Legacy and deprecated files that are no longer in active use.

- `/artifacts/zzz` - Obsolete files from the old `zzz` folder
- `/artifacts/old-html` - Deprecated HTML files
- `/artifacts/old-components` - Deprecated component implementations

## Architectural Patterns

The project uses three main architectural patterns:

1. **Pure HTML with inline JS/CSS** - Simple, self-contained pages
2. **Web Components** - Reusable, encapsulated custom elements
3. **TypeScript Components** - Strongly-typed component implementations

## Migration Plan

The long-term goal is to migrate all functionality to TypeScript-based components, while maintaining backward compatibility during the transition period.
