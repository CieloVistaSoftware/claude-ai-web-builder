# Architecture Organization Guide

## Overview

This document explains the organization approach for the Claude AI Website Builder project, which contains a mix of different architectural patterns:

1. Pure HTML files
2. HTML component-based files
3. HTML with separate CSS and JS files
4. TypeScript/JavaScript modules

## Organization Principles

### 1. Separation by Technology Type

Files are organized by their technology type and purpose:

- **Pure HTML** → `/html/pages` and `/html/components`
- **Web Components** → `/components/web`
- **Theme Components** → `/themes/components`
- **JavaScript Utilities** → `/components/core`
- **TypeScript Modules** → `/src` and typed components
- **Full Pages** → `/pages/wizard` and `.`

### 2. Legacy and Deprecated Files

Files that are no longer actively used but kept for reference are organized into the `/artifacts` directory:

- **Old HTML** → `/artifacts/old-html`
- **Old Components** → `/artifacts/old-components`
- **Old JavaScript** → `/artifacts/old-js`
- **Miscellaneous Legacy** → `/artifacts/zzz`

### 3. Clear Import Paths

The organization maintains clear and consistent import paths:

- Components can be imported from `/components/{type}/{component-name}`
- Pages can be accessed at `/pages/{section}/{page-name}`
- Core utilities can be imported from `/components/core/{utility-name}`

## Migration Strategy

When migrating code between architectures:

1. **HTML to Components**:

   - Create the component structure in `/components/web` or `/components/ui`
   - Update references in existing HTML

2. **JavaScript to TypeScript**:

   - Create TypeScript equivalents in `/src` or appropriate component directory
   - Use gradual migration with compatibility layers

3. **Legacy Code**:
   - Move to `/artifacts/{appropriate-folder}`
   - Update documentation to reference new implementations

## File Organization Rules

### HTML Files

- Standalone HTML pages go in `/html/pages`
- HTML component templates go in `/html/components`
- HTML with associated JS/CSS go in `/pages/{section}`

### CSS Files

- Global CSS goes in `/css`
- Theme-specific CSS goes in `/css/themes`
- Component-specific CSS stays with the component

### JavaScript/TypeScript Files

- Core utilities go in `/components/core`
- Component logic stays with the component
- Main application logic goes in `/src`

## Keeping Organized

To maintain this organization:

1. Run the reorganization script periodically to catch misplaced files
2. When creating new files, place them in the appropriate directory
3. When refactoring, move legacy code to `/artifacts`
4. Update imports and references to reflect the new organization

## References

- See `PROJECT_STRUCTURE.md` for the complete folder structure
- Check `reorganize-project.ps1` for the automated organization script
