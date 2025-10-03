# WB Component Discovery System

## Overview

This system addresses the core issue identified: **"components not fully known"** by providing compiler-like symbol discovery and validation for all WB components.

## The Problem

Previously, WB components existed in isolation without a central discovery mechanism. This led to:
- Difficulty finding available components
- No autocomplete or IDE support
- Unknown component usage across the project
- Manual tracking of component status
- Duplicate implementations of utilities

## The Solution

A comprehensive component discovery system that:
1. **Scans** all component directories and files
2. **Extracts** symbols, APIs, and metadata automatically
3. **Builds** a complete symbol table of all available components
4. **Validates** component usage across the project
5. **Generates** IDE-friendly autocomplete data
6. **Integrates** with build process for continuous validation

## Architecture

```
tools/
├── component-discovery.js    # Core discovery engine
├── build-symbols.js         # Build integration
├── component-ide.html       # Web-based IDE interface
└── README.md               # This documentation
```

## Components

### 1. Component Discovery Engine (`component-discovery.js`)

**Purpose**: Scans the components directory and builds a comprehensive symbol table.

**Features**:
- Automatic component detection
- Symbol extraction (classes, functions, custom elements)
- Web component identification
- API discovery (methods, events, attributes)
- Dependency tracking
- Status analysis (complete, broken, in-progress)

**Usage**:
```bash
node tools/component-discovery.js
```

**Output**:
- `component-discovery-reports/symbol-table.json`
- `component-discovery-reports/component-registry.json`
- `component-discovery-reports/discovery-metadata.json`

### 2. Build Integration (`build-symbols.js`)

**Purpose**: Integrates component discovery into the build process with validation.

**Features**:
- Project-wide component usage validation
- Build-time error detection
- TypeScript definitions generation
- Runtime symbol table creation
- IDE autocomplete data generation

**Usage**:
```bash
# Single build with validation
node tools/build-symbols.js build

# Strict mode (fails on validation errors)
node tools/build-symbols.js build --strict

# Watch mode for development
node tools/build-symbols.js watch

# Validation only
node tools/build-symbols.js validate
```

**Output**:
- `dist/symbols/wb-symbols.js` - Runtime symbol table
- `dist/symbols/wb-components.d.ts` - TypeScript definitions
- `dist/symbols/wb-autocomplete.json` - IDE autocomplete data
- `dist/symbols/wb-manifest.json` - Complete component manifest

### 3. Web IDE Interface (`component-ide.html`)

**Purpose**: Interactive web-based development environment with real-time component discovery.

**Features**:
- Live symbol table browsing
- Code editor with autocomplete
- Component usage validation
- Boilerplate generation
- Symbol export functionality

**Usage**:
Open `component-ide.html` in a web browser.

## Integration with Package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "discover": "node tools/component-discovery.js",
    "build:symbols": "node tools/build-symbols.js build",
    "validate:components": "node tools/build-symbols.js validate",
    "dev:watch": "node tools/build-symbols.js watch",
    "prebuild": "npm run build:symbols"
  }
}
```

## IDE Integration

### VS Code

Create `.vscode/settings.json`:
```json
{
  "html.customData": ["./dist/symbols/wb-autocomplete.json"],
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### TypeScript Support

The build process generates `wb-components.d.ts` with full type definitions:

```typescript
// Auto-generated types for all WB components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wb-button': any;
      'wb-table': any;
      'wb-select': any;
      // ... all discovered web components
    }
  }
}

declare class WBButton {
  static create(elementId: string, config?: any): WBButton;
  static init(): void;
}
// ... all discovered classes
```

## Runtime Symbol Access

The generated runtime symbol table is available globally:

```javascript
// Check if a web component exists
if (window.WB_SYMBOLS.webComponents['wb-button']) {
  // Component is available
}

// List all available components
console.log(Object.keys(window.WB_SYMBOLS.webComponents));

// Access component metadata
console.log(window.WB_SYMBOLS.metadata);
```

## Validation Rules

The system validates:

1. **Unknown Components**: Usage of non-existent web components
2. **Broken Components**: Usage of components marked as broken
3. **Duplicate Definitions**: Multiple `customElements.define()` for same tag
4. **Missing Dependencies**: Components using undefined classes/functions
5. **API Compatibility**: Method and event usage validation

## Example Output

### Discovery Results
```
🔍 Starting WB Component Discovery...
📁 Scanning: ./components
📊 Found 25 component directories
🔍 Analyzing: wb-button
🔍 Analyzing: wb-table
...
📊 Symbol table built: 89 symbols
📄 Reports generated in: component-discovery-reports
✅ Component discovery complete!

📊 Discovery Summary:
Total components: 25
Web components: 4
Legacy components: 21
Broken components: 3
Total symbols: 89
```

### Validation Results
```
🔍 Validating component usage...
📊 Validation complete: 0 errors, 2 warnings

⚠️ Warnings:
  ./demo.html - Using broken component: wb-input
  ./test.html - Using broken component: change-text
```

## Benefits

This system solves the "compiler not being used to find all symbols" issue by providing:

1. **Complete Discovery**: All components are automatically found and cataloged
2. **IDE Support**: Full autocomplete and validation in editors
3. **Build Integration**: Continuous validation during development
4. **Type Safety**: Generated TypeScript definitions
5. **Runtime Access**: Symbol table available at runtime
6. **Developer Experience**: Web IDE for interactive development

## Files Generated

```
component-discovery-reports/
├── symbol-table.json          # Complete symbol mapping
├── component-registry.json    # Component status and metadata
└── discovery-metadata.json    # Discovery statistics

dist/symbols/
├── wb-symbols.js              # Runtime symbol table
├── wb-components.d.ts         # TypeScript definitions
├── wb-autocomplete.json       # IDE autocomplete data
└── wb-manifest.json           # Build manifest
```

## Troubleshooting

### No Components Found
- Verify `components/` directory exists
- Check component naming follows `wb-*` convention
- Ensure components have `.js` files

### Validation Errors
- Run `npm run validate:components` to see specific errors
- Check component imports and usage
- Verify web component tags match `customElements.define()` names

### TypeScript Issues
- Ensure `wb-components.d.ts` is in your `tsconfig.json` includes
- Restart TypeScript language server
- Check generated types match your usage

## Extending the System

### Adding New Component Types
Modify `component-discovery.js` to recognize additional patterns:

```javascript
// In extractSymbols method
if (content.includes('MyCustomPattern')) {
  symbols.push({
    name: extractedName,
    type: 'custom-type',
    source: type
  });
}
```

### Custom Validation Rules
Add validation logic in `build-symbols.js`:

```javascript
// In validateProjectUsage method
if (customCondition) {
  results.errors.push({
    file: filePath,
    type: 'custom-error',
    message: 'Custom validation failed'
  });
}
```

This system ensures that **all WB components are discoverable** and provides the compiler-like functionality needed for proper symbol resolution and validation.

---

# VS Code IntelliSense for WB Components

## Overview

Enhanced VS Code IntelliSense support for WB web components, providing autocomplete for component tags, attributes, and CSS custom properties.

## Files

- **`wb-components.html-data.json`** - VS Code HTML custom data for WB component tags and attributes
- **`wb-components.css-data.json`** - VS Code CSS custom data for CSS custom properties  
- **`generate-vscode-data.cjs`** - Script to generate HTML custom data from schema files
- **`generate-css-data.cjs`** - Script to generate CSS custom data from component CSS files

## Setup

VS Code configuration is set in `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./tools/wb-components.html-data.json"
  ],
  "css.customData": [
    "./tools/wb-components.css-data.json" 
  ]
}
```

## Features

### HTML IntelliSense
- **Component Tags** - Type `<wb-` to see all available WB components
- **Attributes** - Get autocomplete for all component attributes
- **Attribute Values** - Enum values provided for applicable attributes

### CSS IntelliSense  
- **Custom Properties** - Type `var(--` to see all CSS custom properties
- **Categorized Suggestions** - Properties grouped by type (colors, sizing, typography, etc.)

## Supported Components

21 WB components with full IntelliSense support including:
- `wb-button`, `wb-toggle`, `wb-select`, `wb-slider`, `wb-modal`
- `wb-input`, `wb-status`, `wb-viewport`, `wb-event-log`, `wb-color-picker`
- And many more...

## CSS Custom Properties

595+ CSS custom properties available including:
- Color variables: `--bg-primary`, `--text-primary`, `--accent`
- Component variables: `--wb-btn-*`, `--wb-toggle-*`, `--wb-modal-*`
- Layout variables: sizing, spacing, borders, animations

## Testing IntelliSense

Use the test file to verify functionality:
```bash
code tests/intellisense-test.html
```

## Regenerating Data Files

Update IntelliSense files when components change:

```bash
# Regenerate HTML data from schema files
node tools/generate-vscode-data.cjs

# Regenerate CSS data from component CSS files  
node tools/generate-css-data.cjs
```

## Integration with Package.json

Add regeneration scripts:

```json
{
  "scripts": {
    "intellisense:html": "node tools/generate-vscode-data.cjs",
    "intellisense:css": "node tools/generate-css-data.cjs", 
    "intellisense:build": "npm run intellisense:html && npm run intellisense:css"
  }
}
```