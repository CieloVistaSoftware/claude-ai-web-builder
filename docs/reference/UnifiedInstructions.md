---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Unified Web Development Instructions & Standards
## Core Rules

1. **All suggestions must include the full file path** in the "Apply to Editor" functionality
2. **All suggestions must be tested first. USE PLAYWRIGHT FOR ALL TESTING AND ALWAYS USE ES MODULES, DO NOT USE REQUIRE**

3.**We have claude.md files in every folder documenting component specifications and current issues** Each time you awake from a question or finish a task, scan claude.md files to identify priority issues. When you find a fix, you must update the fixes.md file and mark the issue as resolved in the relevant claude.md file. 
4.**Keep a log of all fixes in docs folder named fixes.md by putting new fixes with the date and eplaintion on the top of the list**
5. **Always read the file first** before making any suggestion
6. **Do not show a suggestion with no changes**
7. **We are using powershell in terminal but highly prefer npm scripts**
8. **You may not use simple Web browser for file based urls** 
9. **Do not use '*' for vscode plugin activation, use the event afterloaded, only use the afterloaded event**
10. **After deciding on a suggestion, merge all code into one file and delete all artifacts**
12. **Merge all code into one file** and delete all artifacts, do not leave any files behind
11. **Do not write mock tests AT ALL**
13. **Use dedicated port numbers, always kill that port before starting again**
14. **Never use commonjs module system, always use ES6 modules**
15. **Do not use anything but Websockets to communicate to the backend**
16. **Collapse all web elements not directly related to the current test. This avoids elements getting in the  way**.  
17. **Stop all tests on first error and fix the problem**
18. "No code can be changed without a reson which is logged in Fixes.md"
19. Delete all artifacts, do not leave any files behind. E.G. INDEX.NEW.HTML VS INDEX.HTML.
20. **MANDATORY: All new HTML pages MUST use the base template from /templates/base-template.html** - Copy it and modify it, never create HTML from scratch. This prevents dark mode issues, wrong CSS paths, and inline code violations.

## Proper Debugging Techniques
1. **If we repeatedly see the same error, YOU MUST TAKE THIS APPROACH**.
 - **Work from the problem backwards**.
 - Example: when changing a primary color, the element does not change.
```css 
.header h1 {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--md-primary);
}
```
Find the defintion, and work to find where -md-primary is altered.
This approach always works.

## Layout Formula System

### Golden Ratio Foundation (φ = 1.618)

#### Core Layout Variables
```css
:root {
  /* Golden Ratio Foundation */
  --golden-ratio: 1.618;
  --inverse-golden-ratio: 0.618;
  
  /* Layout Dimensions */
  --header-height: 20vh;
  --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% */
  --content-padding: calc(1rem * var(--golden-ratio)); /* ~26px */
  --grid-gap: 1rem; /* 16px */
  
  /* Typography Scale */
  --text-tiny: 0.75rem;    /* 12px */
  --text-small: 0.813rem;  /* 13px */
  --text-standard: 0.875rem; /* 14px */
  --text-medium: 0.938rem; /* 15px */
  --text-large: 1rem;      /* 16px */
  --text-xl: 1.125rem;     /* 18px */
  
  /* Spacing Scale */
  --space-xs: 0.25rem;     /* 4px */
  --space-sm: 0.5rem;      /* 8px */
  --space-md: 1rem;        /* 16px */
  --space-lg: calc(1rem * var(--golden-ratio)); /* ~26px */
  --space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio)); /* ~42px */
}
```

#### Grid Layout Variations
```css
/* 1. Left Navigation Layout */
.container-fluid {
  display: grid;
  grid-template-columns: var(--nav-width) 1fr;
  grid-template-areas: "nav content";
}

/* 2. Header + Side Navigation */
.container-fluid {
  grid-template-columns: var(--nav-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas: 
    "nav header"
    "nav content";
}

/* 3. Top Navigation Layout */
.container-fluid {
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas: "header" "content";
}
```

## Color System

### Complete Color Palette
```css
:root {
  /* Primary Colors */
  --primary: #007bff;
  --primary-light: #66b3ff;
  --primary-dark: #0056b3;
  --primary-contrast: #ffffff;
  
  /* Secondary Colors */
  --secondary: #6c757d;
  --secondary-light: #9ca3a9;
  --secondary-dark: #495057;
  --secondary-contrast: #ffffff;
  
  /* Accent Colors */
  --accent: #28a745;
  --accent-light: #71dd8a;
  --accent-dark: #1e7e34;
  --accent-contrast: #ffffff;
  
  /* Neutral Scale (9 Shades) */
  --neutral-50: #f8f9fa;   /* Lightest */
  --neutral-100: #e9ecef;
  --neutral-200: #dee2e6;
  --neutral-300: #ced4da;
  --neutral-400: #adb5bd;
  --neutral-500: #6c757d;  /* Middle */
  --neutral-600: #495057;
  --neutral-700: #343a40;
  --neutral-800: #212529;
  --neutral-900: #1a1d21;  /* Darkest */
  
  /* Semantic Colors */
  --background: var(--neutral-50);
  --surface: #ffffff;
  --text-primary: var(--neutral-800);
  --text-secondary: var(--neutral-600);
  --border: var(--neutral-300);
}
```

### Accessibility Requirements
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

## Repository Structure

```
project-root/
├── css/
│   ├── bootstrap.css
│   ├── custom.css
│   └── themes/
├── ts/
│   ├── framework.ts
│   ├── components/
│   └── vendor/
├── html/
│   ├── pages/
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── portfolio.html
│   │   ├── contact.html
│   │   └── blog/
│   ├── partials/
│   │   ├── navigation.html
│   │   ├── sidebar.html
│   │   └── forms/
│   └── layouts/
│       ├── main.html
│       ├── minimal.html
│       └── dashboard.html
├── images/
│   ├── portfolio/
│   ├── ui/
│   └── optimized/
├── templates/
│   ├── header.html
│   ├── footer.html
│   └── components/
└── docs/
    ├── README.md
    └── INSTRUCTIONS.md
```

## HTML5 Template Standards

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | Site Name</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Page description (150-160 characters)">
    <meta name="keywords" content="relevant, keywords, here">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://yoursite.com/image.jpg">
    <meta property="og:url" content="https://yoursite.com/current-page">
    <meta property="og:site_name" content="Your Site Name">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Page Title">
    <meta name="twitter:description" content="Page description">
    <meta name="twitter:image" content="https://yoursite.com/image.jpg">
    
    <!-- Color System CSS (Must be first) -->
    <style>:root { /* CSS Variables */ }</style>
    
    <!-- External CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/custom.css" rel="stylesheet">
</head>
```

## Scripting and Code Generation

### Windows-Only Development Environment
This system is a Windows system. **Do not use any Bash commands or scripts.** Use only:
- **Windows batch commands** (.bat, .cmd files)
- **PowerShell scripts** (.ps1 files) Don't use ps1 files for test scripts, use npm scripts instead.

#### Pre-Code Generation Safety
```powershell
# Always read existing code before overwriting
function Read-ExistingCode {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        Write-Host "📖 Reading existing file: $FilePath" -ForegroundColor Yellow
        $content = Get-Content $FilePath -Raw
        Write-Host "File size: $($content.Length) characters"
        
        # Create backup
        $backupPath = "$FilePath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $FilePath $backupPath
        Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green
        
        return $content
    }
    return $null
}

# Usage before any code generation
$existingCode = Read-ExistingCode "src/component.ts"
if ($existingCode) {
    Write-Host "Existing code found. Proceeding with merge/update..."
} else {
    Write-Host "Creating new file..."
}
```

## VS Code Development Instructions

### Code Suggestion Guidelines

#### Format Requirements
All code suggestions must follow be in markdown




#### Technology Focus
- **Primary**: JavaScript, TypeScript, Python, PowerShell, .NET
- **Never show shell (sh) commands** - Windows environment only
- **Recommend best practices** for code structure and organization

#### Suggestion Categories

**Variable Naming:**
```json
{
  "line": 15,
  "suggestion": "Consider renaming 'x' to 'userCount' for better readability",
  "filePath": "c:/projects/myapp/src/utils.ts"
}
```

**Function Length:**
```json
{
  "line": 42,
  "suggestion": "This function is 50+ lines. Consider breaking into smaller, focused functions",
  "filePath": "c:/projects/myapp/src/dataProcessor.ts"
}
```

**Error Handling:**
```json
{
  "line": 28,
  "suggestion": "Add try-catch block around this async operation for better error handling",
  "filePath": "c:/projects/myapp/src/apiClient.ts"
}
```

**Code Duplication:**
```json
{
  "line": 67,
  "suggestion": "This logic is duplicated on line 34. Consider creating a utility function",
  "filePath": "c:/projects/myapp/src/components/UserCard.ts"
}
```

**Type Annotations:**
```json
{
  "line": 12,
  "suggestion": "Add TypeScript type annotation: 'const users: User[] = []'",
  "filePath": "c:/projects/myapp/src/types.ts"
}
```

### VS Code Tips Format

When "Tips vscode" is used, follow this structure:

#### 1. Always Start with Menu Bar
```
📋 **File Menu Tips:**
1. Ctrl+N - New File
2. Ctrl+Shift+N - New Window  
3. Ctrl+O - Open File
4. Ctrl+S - Save File

📝 **Edit Menu Tips:**
1. Ctrl+Z - Undo
2. Ctrl+Y - Redo
3. Ctrl+F - Find
4. Ctrl+H - Find and Replace
```

#### 2. Present in Numbered Lists
- Clear, sequential numbering
- Include keyboard shortcuts where relevant
- Add occasional humor to keep things engaging

#### 3. Cover Key Areas
- Navigation and file management
- Editing and selection features
- View and layout options
- Extensions and customization
- Terminal integration
- Debugging capabilities

## WB Component Architecture Standards

### Component System Overview
This project uses **WB Components** - a hybrid approach combining Web Components API with project-specific conventions:

#### WB Component Requirements:
1. **Naming Convention**: All components use `wb-` prefix (wb-layout, wb-nav, wb-card)
2. **File Structure**: Each component has `.js`, `.css`, `.md`, and `-demo.html` files
3. **claude.md Documentation**: Every component folder contains claude.md with specifications and issues
4. **CSS-First Architecture**: No inline styles, external CSS files only
5. **Two-Tab Demo Structure**: Documentation tab and Examples tab

#### Shadow DOM Usage Policy:
- **OPTIONAL**: Components MAY use Shadow DOM for style encapsulation
- **NOT REQUIRED**: Many WB components work without Shadow DOM
- **CURRENT STATE**: Only 8 of 29+ components use Shadow DOM (see analysis below)

### Web Components Standards (When Using Shadow DOM)

### Single Responsibility Principle
Each component should have ONE focused purpose.

#### WB Component Structure (Standard Pattern)
```javascript
class WBMyComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM is OPTIONAL - many WB components work without it
    // this.attachShadow({ mode: 'open' }); // Only if style encapsulation needed
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    // CSS-First Architecture: Use external CSS files
    this.innerHTML = `
      <div class="wb-my-component">
        <slot></slot>
      </div>
    `;
  }
  
  setupEventListeners() {
    // WB Components use event-driven architecture
    this.addEventListener('wb:update', this.handleUpdate.bind(this));
  }
}

customElements.define('wb-my-component', WBMyComponent);
```

#### Lifecycle Callbacks
```javascript
class LifecycleComponent extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'description'];
  }
  
  connectedCallback() {
    // Element added to DOM
    this.render();
  }
  
  disconnectedCallback() {
    // Element removed from DOM
    this.cleanup();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    // Attribute changed
    this.render();
  }
}
```

#### Component Communication
```javascript
// Event-based communication
class EventComponent extends HTMLElement {
  sendNotification(data) {
    this.dispatchEvent(new CustomEvent('notification', {
      detail: data,
      bubbles: true
    }));
  }
}

// Listen for events
document.addEventListener('notification', (event) => {
  console.log('Received:', event.detail);
});
```

#### WB Component Shadow DOM Guidelines

**IMPORTANT**: Only 8 of 29+ WB components use Shadow DOM. This is intentional.

```javascript
class WBEncapsulatedComponent extends HTMLElement {
  constructor() {
    super();
    
    // Use Shadow DOM ONLY for components that need style isolation
    // Examples: wb-color-picker, wb-tab, visual widgets
    if (this.requiresStyleEncapsulation()) {
      this.attachShadow({ mode: 'open' });
    }
  }
  
  requiresStyleEncapsulation() {
    // Override this method to determine Shadow DOM usage
    // Return true for complex styling components
    // Return false for layout/content components
    return false; // Default: CSS-First Architecture
  }
  
  render() {
    const content = `
      <div class="wb-component-container">
        <slot></slot>
      </div>
    `;
    
    if (this.shadowRoot) {
      // Shadow DOM components can include internal styles
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            /* CSS variables pass through Shadow DOM */
            --wb-padding: var(--space-md);
          }
          .wb-component-container {
            padding: var(--wb-padding);
          }
        </style>
        ${content}
      `;
    } else {
      // CSS-First: Use external stylesheets
      this.innerHTML = content;
    }
  }
}
```

**Current WB Components using Shadow DOM:**
- wb-tab (complex tab interface)
- wb-color-picker (style isolation needed)  
- wb-color-bar (visual widget)
- wb-color-bars (visual widget)

**Most WB Components use CSS-First Architecture** (no Shadow DOM).

#### Performance Optimization
```javascript
class OptimizedComponent extends HTMLElement {
  constructor() {
    super();
    this._renderRequested = false;
    this._isConnected = false;
  }
  
  connectedCallback() {
    this._isConnected = true;
    this.requestRender();
  }
  
  disconnectedCallback() {
    this._isConnected = false;
  }
  
  requestRender() {
    if (!this._renderRequested && this._isConnected) {
      this._renderRequested = true;
      requestAnimationFrame(() => {
        this.render();
        this._renderRequested = false;
      });
    }
  }
  
  render() {
    // Expensive rendering logic here
  }
}
```

## CSS Standards

### BEM Naming Convention
```css
/* Block */
.portfolio { }

/* Element */
.portfolio__item { }
.portfolio__title { }

/* Modifier */
.portfolio--featured { }
.portfolio__item--large { }
```

### Component Styling
```css
/* Use CSS custom properties */
.btn-primary {
  background: var(--primary);
  color: var(--primary-contrast);
  padding: var(--space-md);
  border-radius: calc(var(--space-xs) * 2);
}

.btn-primary:hover {
  background: var(--primary-dark);
}
```

### Responsive Design Patterns
```css
/* Mobile-first approach */
.component {
  padding: var(--space-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: var(--space-md);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-lg);
  }
}
```

## Development Guidelines

### Code Quality Rules
1. Use CSS custom properties for all colors and dimensions
2. Follow BEM naming convention
3. Mobile-first responsive design
4. Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`)
5. Proper heading hierarchy (h1 → h2 → h3...)
6. ARIA labels for accessibility
7. Valid HTML5 markup

### TypeScript/JavaScript Standards
- ES6+ compliance
- Single responsibility per file/component
- Proper error handling
- Event-driven architecture
- Progressive enhancement

### WB Component File Organization
```
components/
├── wb-component-name/          # Each WB component has its own folder
│   ├── wb-component-name.js    # Component logic (ES6 modules)
│   ├── wb-component-name.css   # Component styles (CSS-First)
│   ├── wb-component-name.md    # API documentation  
│   ├── wb-component-name-demo.html # Two-tab demo (Documentation/Examples)
│   ├── claude.md              # Development log and current issues
│   └── wb-component-name.schema.json # (Optional) Data validation
├── utils/                     # Shared utility functions
├── styles/                    # Global theme variables
└── tests/                     # Playwright test suites
    └── wb-component-name/     # Component-specific tests
```

**Key WB Component Rules:**
1. **All components start with `wb-`** (wb-layout, wb-nav, wb-card)
2. **claude.md required** in every component folder
3. **CSS-First Architecture** - external CSS files only
4. **Two-tab demo structure** - Documentation and Examples tabs
5. **ES6 modules only** - no CommonJS

### Documentation Standards
```typescript
/**
 * A reusable button component following single responsibility principle
 * 
 * @example
 * ```html
 * <custom-button type="primary" size="large">
 *   Click me!
 * </custom-button>
 * ```
 */
class CustomButton extends HTMLElement {
  // Implementation
}
```

## Quality Assurance Checklist

### Code Quality (25 points)
- [ ] HTML5 validation passes
- [ ] CSS validation passes  
- [ ] TypeScript/JavaScript ES6+ compliance
- [ ] BEM naming conventions followed
- [ ] Documentation complete

### Accessibility (30 points)
- [ ] WCAG AA compliance verified
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility
- [ ] Color contrast 4.5:1 minimum
- [ ] ARIA labels implemented

### Performance (25 points)
- [ ] Core Web Vitals passing
- [ ] Image optimization complete
- [ ] CSS/JS minification applied
- [ ] Lazy loading implemented
- [ ] Caching strategies active

### SEO & Security (20 points)
- [ ] Meta tags optimized
- [ ] Structured data implemented
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Input validation secure

## Browser Support

- **Chrome**: 60+ (recommended)
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

Include polyfills for:
- CSS Custom Properties
- Web Components
- Intersection Observer
- Service Workers

## Deployment and Build Process

### PowerShell Build Script
```powershell
# build.ps1
param(
    [string]$Environment = "development"
)

Write-Host "🚀 Starting build process for $Environment" -ForegroundColor Green

# Read existing configuration
if (Test-Path "config.json") {
    $config = Get-Content "config.json" | ConvertFrom-Json
    Write-Host "📖 Configuration loaded" -ForegroundColor Yellow
}

# Build steps
Write-Host "🔨 Compiling TypeScript..." -ForegroundColor Blue
tsc --build

Write-Host "🎨 Processing CSS..." -ForegroundColor Blue
# CSS processing commands

Write-Host "📦 Bundling assets..." -ForegroundColor Blue
# Asset bundling commands

Write-Host "✅ Build complete!" -ForegroundColor Green
```

### Batch File for Quick Setup
```batch
@echo off
title Project Setup

echo 🚀 Setting up development environment...

REM Create directory structure
mkdir css ts html\pages html\partials html\layouts images\portfolio templates docs

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Setup complete
echo ✅ Setup complete! Ready for development.
pause
```

---

*This document consolidates all web development standards for consistent implementation across projects, including VS Code development guidelines and Windows-specific tooling.*