# TypeScript Migration Strategy for Web Components

## Overview
A practical, low-risk approach to migrating from JavaScript to TypeScript while maintaining development velocity and browser compatibility.

## Guiding Principles
1. **No breaking changes** - Existing JS components continue to work
2. **Gradual adoption** - Migrate at your own pace
3. **Maintain simplicity** - Don't over-engineer
4. **Browser-first** - Always ship working JavaScript

## Phase 1: Foundation (Week 1-2)

### 1.1 Set Up Dual Development Environment
```bash
# Install Deno for TS development
curl -fsSL https://deno.land/install.sh | sh

# Keep existing npm setup for JS components
npm install --save-dev typescript @types/node
```

### 1.2 Create TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./components",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowJs": true,  // Important: allows gradual migration
    "checkJs": false  // Don't type-check JS files yet
  },
  "include": ["components/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.3 Create Deno Configuration
```json
// deno.json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --watch server.ts",
    "build": "deno run --allow-read --allow-write scripts/build.ts",
    "typecheck": "deno check components/**/*.ts"
  },
  "imports": {
    "@wb/": "./components/"
  },
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "deno.ns"]
  }
}
```

## Phase 2: Type Definitions (Week 2-3)

### 2.1 Create Base Interfaces
```typescript
// types/base.d.ts
export interface WBComponentConfig {
  theme?: 'light' | 'dark';
  responsive?: boolean;
  animations?: boolean;
}

export interface WBCustomElement extends HTMLElement {
  config?: WBComponentConfig;
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
```

### 2.2 Add Type Definitions for Existing Components
```typescript
// components/wb-button/wb-button.d.ts
export interface WBButtonElement extends HTMLElement {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  loading: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'wb-button': WBButtonElement;
  }
}
```

### 2.3 Create Utility Type Definitions
```typescript
// components/wb-component-utils/wb-component-utils.d.ts
export interface WBComponentUtils {
  loadCSS(href: string): Promise<void>;
  generateId(prefix?: string): string;
  ColorUtils: {
    hslToHex(h: number, s: number, l: number): string;
    hexToHsl(hex: string): [number, number, number];
  };
}
```

## Phase 3: New Components in TypeScript (Week 3+)

### 3.1 Component Template
```typescript
// components/wb-new-component/wb-new-component.ts
import { WBComponentUtils } from '@wb/wb-component-utils/mod.ts';

export interface WBNewComponentConfig {
  // Component-specific config
}

export class WBNewComponent extends HTMLElement {
  static observedAttributes = ['theme', 'disabled'] as const;
  
  private config: WBNewComponentConfig;
  
  constructor() {
    super();
    this.config = this.loadConfig();
  }
  
  connectedCallback(): void {
    this.render();
    WBComponentUtils.loadCSS('./wb-new-component.css');
  }
  
  attributeChangedCallback(
    name: string, 
    oldValue: string | null, 
    newValue: string | null
  ): void {
    // Handle attribute changes
  }
  
  private loadConfig(): WBNewComponentConfig {
    // Load from JSON or defaults
    return {};
  }
  
  private render(): void {
    // Component rendering logic
  }
}

// Register the component
if (!customElements.get('wb-new-component')) {
  customElements.define('wb-new-component', WBNewComponent);
}
```

### 3.2 Build Script for Distribution
```typescript
// scripts/build.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./dist");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./dist",
  shims: {
    deno: false,
  },
  package: {
    name: "@wb/components",
    version: "1.0.0",
    description: "Web Builder Components",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/your-repo/wb-components.git",
    },
  },
});

// Copy CSS files
await Deno.copyFile("./components/styles.css", "./dist/styles.css");
```

## Phase 4: Gradual Component Migration (Month 2+)

### 4.1 Migration Priority Order
1. **Utility modules first** (easiest, no UI)
   - wb-component-utils
   - Event handlers
   - Theme managers

2. **Simple components** (minimal logic)
   - wb-button
   - wb-toggle
   - wb-badge

3. **Complex components** (lots of state/logic)
   - control-panel
   - wb-viewport
   - wb-modal

### 4.2 Migration Steps for Each Component
```bash
# 1. Copy JS file to TS
cp wb-button.js wb-button.ts

# 2. Add type annotations gradually
# 3. Fix type errors
# 4. Test thoroughly
# 5. Update build to include new TS file
# 6. Keep JS file until confident
```

### 4.3 Example Migration
```typescript
// Before: wb-toggle.js
class WBToggle extends HTMLElement {
  constructor() {
    super();
    this.state = false;
  }
  
  get checked() {
    return this.state;
  }
  
  set checked(value) {
    this.state = !!value;
    this.render();
  }
}

// After: wb-toggle.ts
export class WBToggle extends HTMLElement {
  private state: boolean = false;
  
  constructor() {
    super();
  }
  
  get checked(): boolean {
    return this.state;
  }
  
  set checked(value: boolean) {
    this.state = Boolean(value);
    this.render();
  }
  
  private render(): void {
    // Type-safe rendering
  }
}
```

## Phase 5: Distribution Strategy

### 5.1 Package Structure
```
dist/
├── esm/           # ES modules for modern browsers
│   ├── wb-button.js
│   ├── wb-button.d.ts
├── cjs/           # CommonJS for older tools
├── types/         # TypeScript definitions
└── wb-components.js  # Bundled version
```

### 5.2 Package.json Updates
```json
{
  "name": "@wb/components",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "browser": "./dist/wb-components.js"
    }
  },
  "types": "./dist/types/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "npm run build:ts && npm run build:deno",
    "build:ts": "tsc",
    "build:deno": "deno task build"
  }
}
```

## Monitoring Progress

### Success Metrics
- [ ] All new components written in TypeScript
- [ ] 25% of existing components migrated (Month 1)
- [ ] 50% of existing components migrated (Month 2)
- [ ] 100% type coverage for public APIs
- [ ] Zero breaking changes for consumers

### Migration Checklist per Component
- [ ] Type definitions created
- [ ] Component migrated to .ts
- [ ] Tests updated and passing
- [ ] Documentation updated
- [ ] Build process updated
- [ ] Demo still works
- [ ] No breaking changes

## Common Pitfalls to Avoid

### 1. Over-typing
```typescript
// Bad: Too specific
type ButtonVariant = 'primary-default' | 'primary-hover' | 'primary-active';

// Good: Flexible but safe
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

### 2. Breaking Existing APIs
```typescript
// Bad: Changes API
class WBButton {
  setVariant(variant: ButtonVariant): void { } // New method
}

// Good: Maintains compatibility
class WBButton {
  set variant(value: ButtonVariant) { } // Existing setter
}
```

### 3. Complex Build Processes
- Keep it simple
- Use Deno's built-in bundler
- Avoid webpack/rollup complexity initially

## Rollback Plan

If TypeScript causes issues:
1. **Immediate**: Use compiled JS files (always available)
2. **Short-term**: Pause new TS development
3. **Long-term**: Keep hybrid JS/TS as permanent solution

## Success Criteria

The migration is successful when:
1. ✅ Development is as fast as pure JS (thanks to Deno)
2. ✅ All components have type definitions
3. ✅ No breaking changes for users
4. ✅ Better IDE support achieved
5. ✅ Can publish to both NPM and Deno registries