# Website Builder Web Components

## Overview
This project uses a modern Web Components architecture with NPM for package management and delivery. The components are built using the Web Components API (custom elements) and follow a consistent pattern for organization and implementation.

## Current State (January 2025)

### Modernization Progress
- **65% of components** are now proper Web Components (extend HTMLElement)
- **15 components converted** to modern Web Component standard
- **Shared utilities implemented** via `WBComponentUtils` system

### Remaining Technical Debt
- **~250-300 lines of duplicate code** across components
- **8 legacy IIFE components** still need conversion to Web Components
- **18 components** with manual CSS loading patterns that need consolidation

## Component Architecture

### Structure
Each component follows this standard directory structure:
```
components/
├── component-name/
│   ├── component-name.js      # Component logic
│   ├── component-name.css     # Component styles
│   ├── component-name.json    # Data-driven config
│   ├── component-name-demo.html # Demo page
│   ├── component-name.md      # Documentation
│   └── component-name.issues.md # Known issues
```

### Implementation Pattern
Modern components extend HTMLElement and use custom elements:
```javascript
class WBComponent extends HTMLElement {
    constructor() {
        super();
        // Component initialization
    }
    
    connectedCallback() {
        // DOM connection logic
    }
    
    disconnectedCallback() {
        // Cleanup logic
    }
}

customElements.define('wb-component', WBComponent);
```

## Component Library

### Core Components
- **wb-button** - Button component with variants and themes
- **wb-color-picker** - Color picker with Material Design support
- **wb-slider** - Range slider for numeric inputs
- **wb-toggle** - Toggle switch component
- **wb-select** - Dropdown select component
- **wb-status** - Status bar for events and settings
- **wb-modal** - Modal dialog component
- **wb-nav-menu** - Navigation menu component
- **wb-viewport** - Viewport simulator for responsive testing
- **control-panel** - Main control panel for website builder
- **wb-event-log** - Event logging component (passive, zero-configuration)

### Utility Components
- **WBComponentUtils** - Shared utilities for all components
  - `loadCSS()` - CSS loading utility
  - `generateId()` - ID generation
  - `ColorUtils.hslToHex()` - Color conversion utilities

## NPM Package Management

### Workspace Configuration
The project uses NPM workspaces for managing multiple packages:
```json
{
  "workspaces": [
    "packages/*",
    "components/*"
  ]
}
```

### Build System
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and modern JavaScript features
- **Jest** - Unit testing
- **Playwright** - E2E testing

### Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm test          # Run tests
npm run lint      # Lint code
npm run typecheck # Type checking
```

## Best Practices

### Component Development
1. **Extend HTMLElement** - All components should be proper Web Components
2. **Use Custom Elements** - Register with `customElements.define()`
3. **Shared Utilities** - Use `WBComponentUtils` for common functionality
4. **Avoid Duplication** - Don't duplicate utility functions

### CSS Management
- Use `WBComponentUtils.loadCSS()` instead of manual CSS loading
- Support both light and dark themes via CSS variables
- Keep styles scoped to the component

### Event Handling
- Use `wb:` prefix for custom events
- Example: `document.dispatchEvent(new CustomEvent('wb:info', { detail: { message: 'text' }}))`
- Components should be passive listeners when appropriate

### Zero-Configuration Components
Some components (like wb-event-log) are designed to work with zero configuration:
- Just include the component tag in HTML
- No initialization required
- Component sets up listeners immediately

## Migration Tasks

### High Priority
1. **Convert CSS Loading** - 18 files need to use shared utility
2. **Complete Web Component Conversions** - 8 legacy components remaining

### Medium Priority
1. **Consolidate Color Utilities** - 6 components have duplicate functions
2. **Fix Critical Component Issues**:
   - wb-input: Input elements not functional
   - control-panel-new: JSON parsing errors
   - change-text: Edit mode functionality broken

### Low Priority
1. **Final ID Generation Cleanup** - 2 components with local functions
2. **Minor UI Enhancements**:
   - color-bar: Add tabs for documentation
   - image-insert: Add edit button
   - wb-viewport: Fix content darkness in smaller viewports

## Testing Strategy

### Unit Tests
- Component-specific tests in `/tests`
- Use Jest for unit testing
- Test component APIs and methods

### E2E Tests
- Playwright tests for user interactions
- Test full component workflows
- Verify cross-component integrations

### Demo Pages
- Each component has a `-demo.html` file
- Use for manual testing and documentation
- Showcase all component features and variations

## Deno Support

### Why Deno?
Deno provides several advantages for Web Components development:
- **Native TypeScript support** - No configuration needed
- **Built-in tooling** - Formatter, linter, test runner included
- **Secure by default** - Explicit permissions model
- **Web standard APIs** - Better alignment with browser APIs
- **URL imports** - Direct imports from URLs without npm

### Deno Configuration
Create a `deno.json` configuration file:
```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --watch server.ts",
    "build": "deno bundle mod.ts dist/wb-components.js",
    "test": "deno test --allow-read",
    "fmt": "deno fmt",
    "lint": "deno lint"
  },
  "imports": {
    "@wb/": "./components/",
    "@utils/": "./utils/"
  },
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "deno.ns"]
  }
}
```

### Component Module Structure
Organize components as ES modules for Deno:
```typescript
// components/wb-button/mod.ts
export { WBButton } from './wb-button.ts';
export type { ButtonProps, ButtonVariant } from './types.ts';

// Import in other modules
import { WBButton } from '@wb/wb-button/mod.ts';
```

### Dual Package Support (NPM + Deno)
Support both NPM and Deno users:
```typescript
// wb-components.ts - Main entry point
export * from './components/wb-button/mod.ts';
export * from './components/wb-select/mod.ts';
export * from './components/wb-toggle/mod.ts';
// ... other components

// For NPM compatibility
if (typeof module !== 'undefined') {
  module.exports = { WBButton, WBSelect, WBToggle /* ... */ };
}
```

### Distribution Strategy
1. **NPM Package**: Traditional npm publish with compiled JavaScript
2. **Deno Module**: Host on deno.land/x or serve from your domain
3. **CDN Support**: Use esm.sh or skypack for URL imports

Example usage:
```html
<!-- NPM users -->
<script type="module">
  import { WBButton } from '@wb/components';
</script>

<!-- Deno/Browser users -->
<script type="module">
  import { WBButton } from 'https://deno.land/x/wb_components@v1.0.0/mod.ts';
</script>

<!-- CDN users -->
<script type="module">
  import { WBButton } from 'https://esm.sh/@wb/components';
</script>
```

### Development Workflow with Deno
```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Development server
deno task dev

# Run tests
deno task test

# Build for distribution
deno task build

# Format code
deno task fmt

# Lint
deno task lint
```

### Testing with Deno
```typescript
// tests/wb-button.test.ts
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { WBButton } from "@wb/wb-button/mod.ts";

Deno.test("WBButton renders correctly", () => {
  const button = new WBButton();
  button.setAttribute('variant', 'primary');
  assertEquals(button.variant, 'primary');
});
```

## Future Roadmap

1. **Complete Modernization** - Convert all components to Web Components
2. **Dual Publishing** - NPM package + Deno module
3. **TypeScript Migration** - Full TypeScript with Deno-first approach
4. **Documentation Site** - Build with Deno's Fresh framework
5. **Storybook Integration** - Visual component development environment
6. **Performance Optimization** - Tree-shaking and lazy loading support