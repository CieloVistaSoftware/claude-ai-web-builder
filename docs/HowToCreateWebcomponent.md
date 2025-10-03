# How to Create a New Web Component

## Overview

This guide provides step-by-step instructions for creating new web components in the Website Builder system. All components follow standardized patterns and conventions to ensure consistency, maintainability, and integration with the existing component ecosystem.

## Prerequisites

- Basic understanding of HTML, CSS, and JavaScript
- Familiarity with Web Components API (Custom Elements)
- Understanding of the WB component architecture
- Access to the WB codebase and component utilities

## Component Architecture Overview

### WB Component System Structure
```
components/
├── wb-component-utils.js     # Shared utilities (DO NOT MODIFY)
├── wb-component-base.js      # Base class for inheritance
├── your-component/           # Your new component folder
│   ├── your-component.js     # Component logic
│   ├── your-component.css    # Component styles
│   ├── your-component.json   # Configuration & metadata
│   ├── your-component.md     # Documentation
│   ├── your-component-demo.html # Demo page
│   └── claude.md             # Component-specific issues/notes
```

## Step-by-Step Component Creation

### Step 1: Create Component Directory

1. Navigate to the `/components` folder
2. Create a new directory following the naming convention: `wb-[component-name]`
3. Use kebab-case for multi-word names (e.g., `wb-color-picker`, `wb-data-table`)

```bash
mkdir components/wb-your-component
cd components/wb-your-component
```

### Step 2: Create Component Files

Create the following files in your component directory:

#### 2.1 Component JavaScript (`wb-your-component.js`)

```javascript
/**
 * WB Your Component - [Brief description]
 * 
 * A [detailed description of what this component does]
 * 
 * @example
 * <wb-your-component variant="primary" size="medium">
 *   Content here
 * </wb-your-component>
 * 
 * @events
 * - wb-your-component:change - Fired when component value changes
 * - wb-your-component:ready - Fired when component is fully initialized
 * 
 * @version 1.0.0
 * @author Website Builder Team
 */

(function() {
    'use strict';

    // Configuration fallback - used if JSON loading fails
    const fallbackConfig = {
        component: {
            name: 'wb-your-component',
            version: '1.0.0',
            description: 'Component description'
        },
        classes: {
            base: 'wb-your-component',
            variants: {
                primary: 'wb-your-component--primary',
                secondary: 'wb-your-component--secondary'
            },
            sizes: {
                small: 'wb-your-component--small',
                medium: 'wb-your-component--medium',
                large: 'wb-your-component--large'
            },
            states: {
                active: 'wb-your-component--active',
                disabled: 'wb-your-component--disabled',
                loading: 'wb-your-component--loading'
            }
        },
        defaults: {
            variant: 'primary',
            size: 'medium',
            disabled: false
        },
        attributes: {
            variant: 'variant',
            size: 'size',
            disabled: 'disabled',
            value: 'value'
        }
    };

    class WBYourComponent extends HTMLElement {
        constructor() {
            super();
            
            // Component state
            this.config = fallbackConfig;
            this.initialized = false;
            this.utils = null;
            
            // Bind methods
            this.handleClick = this.handleClick.bind(this);
            this.handleChange = this.handleChange.bind(this);
        }

        async connectedCallback() {
            try {
                await this.initialize();
            } catch (error) {
                console.error('WB Your Component initialization failed:', error);
                this.initializeFallback();
            }
        }

        disconnectedCallback() {
            this.cleanup();
        }

        async initialize() {
            // Load utilities
            await this.loadUtils();
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            await this.loadCSS();
            
            // Initialize component
            this.initializeComponent();
            
            // Mark as initialized
            this.initialized = true;
            
            // Dispatch ready event
            this.dispatchEvent(new CustomEvent('wb-your-component:ready', {
                detail: { component: this },
                bubbles: true
            }));
        }

        async loadUtils() {
            if (!window.WBComponentUtils) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = this.getComponentPath() + '../wb-component-utils.js';
                    script.onload = () => {
                        this.utils = window.WBComponentUtils;
                        resolve();
                    };
                    script.onerror = () => reject(new Error('Failed to load WBComponentUtils'));
                    document.head.appendChild(script);
                });
            } else {
                this.utils = window.WBComponentUtils;
            }
        }

        async loadConfig() {
            if (this.utils) {
                try {
                    const configPath = this.getComponentPath() + 'wb-your-component.json';
                    this.config = await this.utils.loadConfig(configPath, fallbackConfig);
                } catch (error) {
                    console.warn('Using fallback config:', error.message);
                    this.config = fallbackConfig;
                }
            }
        }

        async loadCSS() {
            if (this.utils) {
                const cssPath = this.getComponentPath() + 'wb-your-component.css';
                await this.utils.loadCSS('wb-your-component-styles', cssPath);
            }
        }

        initializeComponent() {
            // Set base classes
            this.classList.add(this.config.classes.base);
            
            // Apply initial attributes
            this.applyAttributes();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize content if empty
            if (!this.innerHTML.trim()) {
                this.initializeContent();
            }
            
            // Process existing content
            this.processContent();
        }

        initializeFallback() {
            console.warn('WB Your Component: Initializing with basic functionality');
            this.classList.add('wb-your-component');
            this.setupEventListeners();
        }

        applyAttributes() {
            // Apply variant
            const variant = this.getAttribute('variant') || this.config.defaults.variant;
            this.setVariant(variant);
            
            // Apply size
            const size = this.getAttribute('size') || this.config.defaults.size;
            this.setSize(size);
            
            // Apply disabled state
            if (this.hasAttribute('disabled')) {
                this.setDisabled(true);
            }
            
            // Apply other attributes as needed
            const value = this.getAttribute('value');
            if (value !== null) {
                this.setValue(value);
            }
        }

        initializeContent() {
            // Create default content structure
            this.innerHTML = `
                <div class="wb-your-component__content">
                    <slot></slot>
                </div>
            `;
        }

        processContent() {
            // Process and enhance existing content
            const content = this.querySelector('.wb-your-component__content');
            if (content) {
                // Add any necessary enhancements
            }
        }

        setupEventListeners() {
            this.addEventListener('click', this.handleClick);
            // Add other event listeners as needed
        }

        cleanup() {
            this.removeEventListener('click', this.handleClick);
            // Clean up other event listeners and resources
        }

        // Event Handlers
        handleClick(event) {
            if (this.hasAttribute('disabled')) {
                event.preventDefault();
                return;
            }

            // Handle click logic
            this.dispatchEvent(new CustomEvent('wb-your-component:click', {
                detail: { 
                    originalEvent: event,
                    component: this 
                },
                bubbles: true
            }));
        }

        handleChange(value) {
            this.dispatchEvent(new CustomEvent('wb-your-component:change', {
                detail: { 
                    value: value,
                    component: this 
                },
                bubbles: true
            }));
        }

        // Public API Methods
        setVariant(variant) {
            // Remove existing variant classes
            Object.values(this.config.classes.variants).forEach(cls => {
                this.classList.remove(cls);
            });
            
            // Add new variant class
            if (this.config.classes.variants[variant]) {
                this.classList.add(this.config.classes.variants[variant]);
                this.setAttribute('variant', variant);
            }
        }

        setSize(size) {
            // Remove existing size classes
            Object.values(this.config.classes.sizes).forEach(cls => {
                this.classList.remove(cls);
            });
            
            // Add new size class
            if (this.config.classes.sizes[size]) {
                this.classList.add(this.config.classes.sizes[size]);
                this.setAttribute('size', size);
            }
        }

        setDisabled(disabled) {
            if (disabled) {
                this.classList.add(this.config.classes.states.disabled);
                this.setAttribute('disabled', '');
            } else {
                this.classList.remove(this.config.classes.states.disabled);
                this.removeAttribute('disabled');
            }
        }

        setValue(value) {
            this.setAttribute('value', value);
            // Update internal value and trigger change event if needed
            this.handleChange(value);
        }

        getValue() {
            return this.getAttribute('value') || '';
        }

        // Utility Methods
        getComponentPath() {
            const scripts = document.querySelectorAll('script[src*="wb-your-component"]');
            if (scripts.length > 0) {
                const src = scripts[scripts.length - 1].src;
                return src.substring(0, src.lastIndexOf('/') + 1);
            }
            return '/components/wb-your-component/';
        }

        // Static methods for external use
        static create(options = {}) {
            const element = document.createElement('wb-your-component');
            
            Object.keys(options).forEach(key => {
                if (key === 'content') {
                    element.innerHTML = options[key];
                } else {
                    element.setAttribute(key, options[key]);
                }
            });
            
            return element;
        }
    }

    // Register the custom element
    if (!customElements.get('wb-your-component')) {
        customElements.define('wb-your-component', WBYourComponent);
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WBYourComponent;
    }

    // Global registration
    window.WBYourComponent = WBYourComponent;

})();
```

#### 2.2 Component Styles (`wb-your-component.css`)

**🚨 CRITICAL: NO DUPLICATE CSS RULE**

**ALWAYS use existing `/styles` files first:**
1. `/styles/_variables.css` - Global CSS variables
2. `/styles/_base.css` - Reset and base styles  
3. `/styles/_utilities.css` - Utility classes

**Only add component-specific styles that don't exist in the global styles.**

```css
/**
 * WB Your Component Styles
 * 
 * Component: wb-your-component
 * Version: 1.0.0
 * 
 * DEPENDENCIES:
 * - /styles/_variables.css (REQUIRED - loaded globally)
 * - /styles/_base.css (REQUIRED - loaded globally)
 * - /styles/_utilities.css (OPTIONAL - if using utility classes)
 */

/* ================================================
   Component-Specific CSS Variables ONLY
   ================================================ */

:root {
  /* ONLY add variables that are unique to this component */
  /* DO NOT duplicate variables from /styles/_variables.css */
  
  /* Component-specific properties that aren't in global styles */
  --wb-your-component-specific-property: value;
  --wb-your-component-custom-animation: custom-animation-name;
  --wb-your-component-unique-spacing: calc(var(--space-md) + 0.5rem);
  
  /* Override global variables ONLY if component needs different values */
  /* Use sparingly - prefer using existing global variables */
}

/* ================================================
   Base Component Styles
   USE GLOBAL VARIABLES FROM /styles/_variables.css
   ================================================ */

.wb-your-component {
  /* Layout - use global variables */
  display: inline-block;
  position: relative;
  
  /* Appearance - ALWAYS use global CSS variables */
  background-color: var(--bg-primary);       /* from /styles/_variables.css */
  color: var(--text-primary);               /* from /styles/_variables.css */
  border: 1px solid var(--border-color);    /* from /styles/_variables.css */
  border-radius: var(--border-radius);      /* from /styles/_variables.css */
  
  /* Typography - use global typography variables */
  font-family: var(--font-family-base);     /* from /styles/_variables.css */
  font-size: var(--font-size-base);         /* from /styles/_variables.css */
  line-height: var(--line-height-base);     /* from /styles/_variables.css */
  
  /* Spacing - use global spacing scale */
  padding: var(--space-md);                 /* from /styles/_variables.css */
  margin: 0;                                /* default value */
  
  /* Interaction - use global interaction variables */
  cursor: pointer;
  user-select: none;
  transition: var(--transition-fast);       /* from /styles/_variables.css */
  
  /* Accessibility - use global focus variables */
  outline: none;
  box-sizing: border-box;                   /* from /styles/_base.css */
}

/* ================================================
   Component Content Area
   ================================================ */

.wb-your-component__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* ================================================
   Size Variants
   ================================================ */

.wb-your-component--small {
  --wb-your-component-padding: var(--space-sm);
  --wb-your-component-font-size: var(--font-size-sm);
}

.wb-your-component--medium {
  --wb-your-component-padding: var(--space-md);
  --wb-your-component-font-size: var(--font-size-base);
}

.wb-your-component--large {
  --wb-your-component-padding: var(--space-lg);
  --wb-your-component-font-size: var(--font-size-lg);
}

/* ================================================
   Style Variants
   ================================================ */

.wb-your-component--primary {
  --wb-your-component-bg: var(--primary);
  --wb-your-component-color: var(--primary-contrast);
  --wb-your-component-border: var(--primary);
}

.wb-your-component--secondary {
  --wb-your-component-bg: var(--secondary);
  --wb-your-component-color: var(--secondary-contrast);
  --wb-your-component-border: var(--secondary);
}

.wb-your-component--outline {
  --wb-your-component-bg: transparent;
  --wb-your-component-color: var(--primary);
  --wb-your-component-border: var(--primary);
}

/* ================================================
   Interactive States
   ================================================ */

.wb-your-component:hover:not(.wb-your-component--disabled) {
  background-color: var(--wb-your-component-hover-bg);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.wb-your-component:active:not(.wb-your-component--disabled) {
  background-color: var(--wb-your-component-active-bg);
  transform: translateY(0);
}

.wb-your-component:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

/* ================================================
   Component States
   ================================================ */

.wb-your-component--active {
  background-color: var(--wb-your-component-active-bg);
  color: var(--primary-contrast);
}

.wb-your-component--disabled {
  opacity: var(--wb-your-component-disabled-opacity);
  cursor: not-allowed;
  pointer-events: none;
}

.wb-your-component--loading {
  position: relative;
  pointer-events: none;
}

.wb-your-component--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: wb-loading-spin 1s linear infinite;
}

/* ================================================
   Responsive Design
   ================================================ */

@media (max-width: 768px) {
  .wb-your-component {
    /* Mobile-specific adjustments */
    min-height: 44px; /* Touch target size */
    font-size: var(--font-size-base);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wb-your-component {
    --wb-your-component-transition: none;
  }
  
  .wb-your-component--loading::after {
    animation: none;
  }
}

/* ================================================
   Dark Mode Support
   ================================================ */

[data-theme="dark"] .wb-your-component {
  /* Dark mode specific overrides if needed */
}

/* ================================================
   High Contrast Mode Support
   ================================================ */

@media (prefers-contrast: high) {
  .wb-your-component {
    border-width: 2px;
  }
  
  .wb-your-component:focus-visible {
    outline-width: 3px;
  }
}

/* ================================================
   Animations
   ================================================ */

@keyframes wb-loading-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ================================================
   Print Styles
   ================================================ */

@media print {
  .wb-your-component {
    background: transparent !important;
    color: black !important;
    border: 1px solid black !important;
    box-shadow: none !important;
  }
}
```

#### 2.3 Component Configuration (`wb-your-component.json`)

```json
{
  "component": {
    "name": "wb-your-component",
    "version": "1.0.0",
    "description": "A reusable component for [specific purpose]",
    "author": "Website Builder Team",
    "license": "MIT",
    "tags": ["ui", "component", "interactive"],
    "dependencies": ["wb-component-utils"],
    "browser_support": {
      "chrome": ">=60",
      "firefox": ">=55",
      "safari": ">=12",
      "edge": ">=79"
    }
  },
  "configuration": {
    "cssVariables": {
      "--wb-your-component-bg": "Background color",
      "--wb-your-component-color": "Text color",
      "--wb-your-component-border": "Border color",
      "--wb-your-component-padding": "Internal spacing",
      "--wb-your-component-transition": "Animation timing"
    },
    "colorBindings": {
      "primary": "--primary",
      "secondary": "--secondary",
      "background": "--bg-primary",
      "text": "--text-primary"
    },
    "spacingBindings": {
      "small": "--space-sm",
      "medium": "--space-md",
      "large": "--space-lg"
    }
  },
  "classes": {
    "base": "wb-your-component",
    "content": "wb-your-component__content",
    "variants": {
      "primary": "wb-your-component--primary",
      "secondary": "wb-your-component--secondary",
      "outline": "wb-your-component--outline"
    },
    "sizes": {
      "small": "wb-your-component--small",
      "medium": "wb-your-component--medium",
      "large": "wb-your-component--large"
    },
    "states": {
      "active": "wb-your-component--active",
      "disabled": "wb-your-component--disabled",
      "loading": "wb-your-component--loading",
      "hover": "wb-your-component--hover",
      "focus": "wb-your-component--focus"
    }
  },
  "attributes": {
    "variant": {
      "type": "string",
      "default": "primary",
      "values": ["primary", "secondary", "outline"],
      "description": "Visual variant of the component"
    },
    "size": {
      "type": "string",
      "default": "medium",
      "values": ["small", "medium", "large"],
      "description": "Size variant of the component"
    },
    "disabled": {
      "type": "boolean",
      "default": false,
      "description": "Disables the component"
    },
    "value": {
      "type": "string",
      "default": "",
      "description": "Current value of the component"
    }
  },
  "events": {
    "wb-your-component:ready": {
      "description": "Fired when component is fully initialized",
      "detail": {
        "component": "The component instance"
      }
    },
    "wb-your-component:change": {
      "description": "Fired when component value changes",
      "detail": {
        "value": "The new value",
        "component": "The component instance"
      }
    },
    "wb-your-component:click": {
      "description": "Fired when component is clicked",
      "detail": {
        "originalEvent": "The original click event",
        "component": "The component instance"
      }
    }
  },
  "api": {
    "methods": {
      "setVariant(variant)": "Sets the component variant",
      "setSize(size)": "Sets the component size",
      "setDisabled(disabled)": "Sets disabled state",
      "setValue(value)": "Sets component value",
      "getValue()": "Gets current component value"
    },
    "properties": {
      "initialized": "Boolean indicating if component is ready",
      "config": "Component configuration object",
      "utils": "Reference to WBComponentUtils"
    }
  },
  "examples": [
    {
      "title": "Basic Usage",
      "code": "<wb-your-component>Default content</wb-your-component>"
    },
    {
      "title": "With Attributes",
      "code": "<wb-your-component variant=\"secondary\" size=\"large\">Large secondary component</wb-your-component>"
    },
    {
      "title": "Disabled State",
      "code": "<wb-your-component disabled>Disabled component</wb-your-component>"
    }
  ]
}
```

#### 2.4 Component Documentation (`wb-your-component.md`)

```markdown
# WB Your Component

## Overview

[Brief description of what this component does and its purpose in the Website Builder system]

## Features

- ✅ **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Themeable**: Supports dark/light modes and custom themes
- ✅ **Interactive**: Supports keyboard and mouse interactions
- ✅ **Configurable**: Extensive customization through attributes and CSS variables

## Basic Usage

### HTML
```html
<wb-your-component variant="primary" size="medium">
  Component content here
</wb-your-component>
```

### JavaScript
```javascript
// Create programmatically
const component = WBYourComponent.create({
  variant: 'secondary',
  size: 'large',
  content: 'Dynamic content'
});

document.body.appendChild(component);
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String | `"primary"` | Visual style variant |
| `size` | String | `"medium"` | Size of the component |
| `disabled` | Boolean | `false` | Disables the component |
| `value` | String | `""` | Current value |

### Variant Options
- `primary` - Primary theme colors
- `secondary` - Secondary theme colors  
- `outline` - Outlined style with transparent background

### Size Options
- `small` - Compact size for dense layouts
- `medium` - Standard size for most use cases
- `large` - Larger size for emphasis

## Events

### wb-your-component:ready
Fired when the component is fully initialized and ready to use.

```javascript
element.addEventListener('wb-your-component:ready', (event) => {
  console.log('Component ready:', event.detail.component);
});
```

### wb-your-component:change  
Fired when the component value changes.

```javascript
element.addEventListener('wb-your-component:change', (event) => {
  console.log('New value:', event.detail.value);
});
```

### wb-your-component:click
Fired when the component is clicked.

```javascript
element.addEventListener('wb-your-component:click', (event) => {
  console.log('Component clicked');
});
```

## Methods

### setVariant(variant)
Changes the visual variant of the component.

```javascript
component.setVariant('secondary');
```

### setSize(size)
Changes the size of the component.

```javascript
component.setSize('large');
```

### setDisabled(disabled)
Enables or disables the component.

```javascript
component.setDisabled(true);  // Disable
component.setDisabled(false); // Enable
```

### setValue(value) / getValue()
Sets or gets the component value.

```javascript
component.setValue('new value');
const currentValue = component.getValue();
```

## Styling

### CSS Variables

The component can be customized using CSS custom properties:

```css
:root {
  --wb-your-component-bg: #ffffff;
  --wb-your-component-color: #333333;
  --wb-your-component-border: #cccccc;
  --wb-your-component-padding: 1rem;
  --wb-your-component-transition: all 0.2s ease;
}
```

### Custom Styling

```css
/* Custom variant */
.wb-your-component.my-custom-variant {
  --wb-your-component-bg: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  --wb-your-component-color: white;
}
```

## Accessibility

- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Focus management
- ✅ ARIA attributes

### Keyboard Shortcuts
- `Enter/Space` - Activate component
- `Tab` - Navigate to component
- `Escape` - Cancel action (if applicable)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Examples

### Example 1: Basic Component
```html
<wb-your-component>
  Basic content
</wb-your-component>
```

### Example 2: Styled Component
```html
<wb-your-component variant="secondary" size="large">
  Large secondary component
</wb-your-component>
```

### Example 3: Interactive Component
```html
<wb-your-component id="interactive-example">
  Click me!
</wb-your-component>

<script>
document.getElementById('interactive-example')
  .addEventListener('wb-your-component:click', () => {
    alert('Component clicked!');
  });
</script>
```

## Integration with Other Components

[Describe how this component works with other WB components]

## Best Practices

1. **Use semantic content** - Provide meaningful content inside the component
2. **Handle events properly** - Always listen for component events for dynamic behavior  
3. **Test accessibility** - Verify keyboard navigation and screen reader compatibility
4. **Performance** - Use the component efficiently, avoid unnecessary re-initialization
5. **Styling** - Use CSS variables for customization instead of overriding styles

## Troubleshooting

### Component not loading
- Ensure `wb-component-utils.js` is available
- Check browser console for errors
- Verify file paths are correct

### Styles not applying
- Check that CSS file is loaded
- Verify CSS variable values
- Ensure proper cascade order

### Events not firing
- Verify event listener syntax
- Check that component is fully initialized
- Ensure component is not disabled

## Version History

- **1.0.0** - Initial release

## Contributing

When contributing to this component:

1. Follow the established code patterns
2. Update tests for any changes
3. Update documentation
4. Test across all supported browsers
5. Verify accessibility compliance
```

#### 2.5 Demo Page (`wb-your-component-demo.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WB Your Component - Demo</title>
    
    <!-- Base styles -->
    <link rel="stylesheet" href="../../styles/_variables.css">
    <link rel="stylesheet" href="../../styles/_base.css">
    
    <style>
        body {
            font-family: var(--font-family-base);
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: var(--bg-primary);
            color: var(--text-primary);
        }
        
        .demo-section {
            margin-bottom: 3rem;
            padding: 2rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--bg-secondary);
        }
        
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .demo-example {
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--bg-primary);
        }
        
        .demo-code {
            background: var(--bg-code, #f5f5f5);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
        }
        
        .demo-code code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
        }
        
        .event-log {
            height: 200px;
            overflow-y: auto;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            padding: 1rem;
            margin: 1rem 0;
            font-family: monospace;
            font-size: 0.875rem;
        }
        
        .controls {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        }
        
        .controls button {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--bg-primary);
            color: var(--text-primary);
            cursor: pointer;
        }
        
        .controls button:hover {
            background: var(--bg-secondary);
        }
    </style>
</head>
<body>
    <header>
        <h1>WB Your Component Demo</h1>
        <p>Interactive demonstration of the wb-your-component web component.</p>
    </header>

    <main>
        <!-- Basic Examples -->
        <section class="demo-section">
            <h2>Basic Examples</h2>
            
            <div class="demo-grid">
                <div class="demo-example">
                    <h3>Default</h3>
                    <wb-your-component>Default Component</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Primary</h3>
                    <wb-your-component variant="primary">Primary Variant</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Secondary</h3>
                    <wb-your-component variant="secondary">Secondary Variant</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Outline</h3>
                    <wb-your-component variant="outline">Outline Variant</wb-your-component>
                </div>
            </div>
        </section>

        <!-- Size Variants -->
        <section class="demo-section">
            <h2>Size Variants</h2>
            
            <div class="demo-grid">
                <div class="demo-example">
                    <h3>Small</h3>
                    <wb-your-component size="small">Small Size</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Medium</h3>
                    <wb-your-component size="medium">Medium Size</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Large</h3>
                    <wb-your-component size="large">Large Size</wb-your-component>
                </div>
            </div>
        </section>

        <!-- States -->
        <section class="demo-section">
            <h2>Component States</h2>
            
            <div class="demo-grid">
                <div class="demo-example">
                    <h3>Normal</h3>
                    <wb-your-component>Normal State</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Disabled</h3>
                    <wb-your-component disabled>Disabled State</wb-your-component>
                </div>
                
                <div class="demo-example">
                    <h3>Active</h3>
                    <wb-your-component class="wb-your-component--active">Active State</wb-your-component>
                </div>
            </div>
        </section>

        <!-- Interactive Demo -->
        <section class="demo-section">
            <h2>Interactive Demo</h2>
            
            <div class="demo-example">
                <wb-your-component id="interactive-demo" variant="primary" size="medium">
                    Interactive Component
                </wb-your-component>
                
                <div class="controls">
                    <button onclick="changeVariant()">Change Variant</button>
                    <button onclick="changeSize()">Change Size</button>
                    <button onclick="toggleDisabled()">Toggle Disabled</button>
                    <button onclick="setValue()">Set Value</button>
                    <button onclick="clearLog()">Clear Log</button>
                </div>
                
                <div class="demo-code">
                    <code id="current-config">
                        Current: variant="primary" size="medium" disabled="false"
                    </code>
                </div>
                
                <div class="event-log" id="event-log">
                    Event log will appear here...
                </div>
            </div>
        </section>

        <!-- Code Examples -->
        <section class="demo-section">
            <h2>Code Examples</h2>
            
            <h3>HTML Usage</h3>
            <div class="demo-code">
                <code>&lt;wb-your-component variant="primary" size="large"&gt;
    Content here
&lt;/wb-your-component&gt;</code>
            </div>
            
            <h3>JavaScript Creation</h3>
            <div class="demo-code">
                <code>const component = WBYourComponent.create({
    variant: 'secondary',
    size: 'medium',
    content: 'Dynamic content'
});

document.body.appendChild(component);</code>
            </div>
            
            <h3>Event Handling</h3>
            <div class="demo-code">
                <code>component.addEventListener('wb-your-component:change', (event) => {
    console.log('Value changed:', event.detail.value);
});</code>
            </div>
        </section>
    </main>

    <!-- Load the component -->
    <script src="wb-your-component.js"></script>
    
    <script>
        // Demo functionality
        const interactiveDemo = document.getElementById('interactive-demo');
        const eventLog = document.getElementById('event-log');
        const currentConfig = document.getElementById('current-config');
        
        const variants = ['primary', 'secondary', 'outline'];
        const sizes = ['small', 'medium', 'large'];
        let currentVariantIndex = 0;
        let currentSizeIndex = 1;
        let isDisabled = false;
        
        // Log events
        function logEvent(message) {
            const timestamp = new Date().toLocaleTimeString();
            eventLog.innerHTML += `[${timestamp}] ${message}\n`;
            eventLog.scrollTop = eventLog.scrollHeight;
        }
        
        function updateConfig() {
            const variant = variants[currentVariantIndex];
            const size = sizes[currentSizeIndex];
            currentConfig.textContent = `Current: variant="${variant}" size="${size}" disabled="${isDisabled}"`;
        }
        
        function changeVariant() {
            currentVariantIndex = (currentVariantIndex + 1) % variants.length;
            const newVariant = variants[currentVariantIndex];
            interactiveDemo.setVariant(newVariant);
            logEvent(`Variant changed to: ${newVariant}`);
            updateConfig();
        }
        
        function changeSize() {
            currentSizeIndex = (currentSizeIndex + 1) % sizes.length;
            const newSize = sizes[currentSizeIndex];
            interactiveDemo.setSize(newSize);
            logEvent(`Size changed to: ${newSize}`);
            updateConfig();
        }
        
        function toggleDisabled() {
            isDisabled = !isDisabled;
            interactiveDemo.setDisabled(isDisabled);
            logEvent(`Disabled state: ${isDisabled}`);
            updateConfig();
        }
        
        function setValue() {
            const newValue = `value-${Date.now()}`;
            interactiveDemo.setValue(newValue);
            logEvent(`Value set to: ${newValue}`);
        }
        
        function clearLog() {
            eventLog.innerHTML = 'Event log cleared...\n';
        }
        
        // Listen to all component events
        interactiveDemo.addEventListener('wb-your-component:ready', (event) => {
            logEvent('Component ready and initialized');
        });
        
        interactiveDemo.addEventListener('wb-your-component:click', (event) => {
            logEvent('Component clicked');
        });
        
        interactiveDemo.addEventListener('wb-your-component:change', (event) => {
            logEvent(`Value changed: ${event.detail.value}`);
        });
        
        // Initialize
        updateConfig();
        logEvent('Demo page loaded');
    </script>
</body>
</html>
```

#### 2.6 Component Issues (`claude.md`)

```markdown
# WB Your Component - Development Notes

## Current Status
- ✅ Basic structure implemented
- ✅ CSS styling complete  
- ✅ JavaScript functionality working
- ✅ Demo page created
- ⚠️ Testing needed
- ⚠️ Documentation review required

## Known Issues
*None currently identified*

## TODO Items
- [ ] Add comprehensive unit tests
- [ ] Test accessibility with screen readers
- [ ] Verify cross-browser compatibility
- [ ] Performance testing
- [ ] Integration testing with other components

## Enhancement Ideas
- Add animation options
- Support for custom icons
- Expand variant options
- Add keyboard shortcuts
- Mobile gesture support

## Testing Checklist
- [ ] Component loads without errors
- [ ] All variants render correctly
- [ ] All sizes display properly
- [ ] Event handlers work correctly
- [ ] Accessibility features function
- [ ] Responsive design works
- [ ] Dark mode compatibility
- [ ] Performance is acceptable

## Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Integration Notes
*Document any integration considerations with other WB components*
```

### Step 3: Register Component

Add your component to the component registry:

#### 3.1 Update Component Registry (`components/component-registry.json`)

```json
{
  "components": [
    // ... existing components
    {
      "name": "wb-your-component",
      "version": "1.0.0",
      "path": "./wb-your-component/wb-your-component.js",
      "css": "./wb-your-component/wb-your-component.css",
      "config": "./wb-your-component/wb-your-component.json",
      "demo": "./wb-your-component/wb-your-component-demo.html",
      "docs": "./wb-your-component/wb-your-component.md",
      "category": "ui", // or "layout", "form", "data", "utility"
      "tags": ["interactive", "customizable"],
      "status": "stable" // or "beta", "alpha", "deprecated"
    }
  ]
}
```

### Step 4: Testing

#### 4.1 Create Basic Tests

Create tests in `/tests/` directory following existing patterns:

```javascript
// tests/wb-your-component.spec.js
const { test, expect } = require('@playwright/test');

test.describe('WB Your Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/wb-your-component/wb-your-component-demo.html');
    await page.waitForSelector('wb-your-component');
  });

  test('should render component', async ({ page }) => {
    const component = page.locator('wb-your-component').first();
    await expect(component).toBeVisible();
  });

  test('should apply variant classes', async ({ page }) => {
    const component = page.locator('wb-your-component[variant="primary"]').first();
    await expect(component).toHaveClass(/wb-your-component--primary/);
  });

  test('should handle click events', async ({ page }) => {
    const component = page.locator('#interactive-demo');
    await component.click();
    
    // Check that click event was logged
    const eventLog = page.locator('#event-log');
    await expect(eventLog).toContainText('Component clicked');
  });
});
```

### Step 5: Documentation

Update relevant documentation:

#### 5.1 Update Component List

Add your component to:
- `/docs/components.md`
- `/docs/component-issues-proposal.md` (if addressing specific issues)
- Main README files as appropriate

#### 5.2 Create Usage Examples

Include your component in integration examples and documentation.

### Step 6: Integration

#### 6.1 Test Integration

- Test with existing components
- Verify theme compatibility
- Check responsive behavior
- Test accessibility features

#### 6.2 Performance Testing

- Bundle size impact
- Load time measurements
- Runtime performance
- Memory usage

## WB CSS Architecture & No-Duplication Principle

### 🚨 CRITICAL RULE: NO DUPLICATE CSS

**The Website Builder follows a strict CSS hierarchy to eliminate duplication:**

#### CSS Loading Order (NEVER DUPLICATE):
1. **`/styles/_variables.css`** - Global CSS variables (colors, spacing, typography)
2. **`/styles/_base.css`** - Reset styles, base element styling
3. **`/styles/_utilities.css`** - Utility classes (.text-center, .mb-4, etc.)
4. **Component-specific CSS** - ONLY unique styles for the component

#### What MUST be in Global Styles:
- **Colors**: `--primary`, `--bg-primary`, `--text-primary`, `--border-color`
- **Spacing**: `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`
- **Typography**: `--font-size-sm`, `--font-size-base`, `--line-height-base`
- **Transitions**: `--transition-fast`, `--transition-slow`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- **Border radius**: `--border-radius`, `--border-radius-sm`, `--border-radius-lg`

#### What CAN be in Component CSS:
- **Component-specific layouts** that don't exist globally
- **Unique animations** for the component
- **Component-specific calculations** using global variables
- **Component states** (hover, active, disabled) with component-specific behavior

#### Example of CORRECT Component CSS:
```css
/* ✅ CORRECT - Uses global variables */
.wb-my-component {
  background-color: var(--bg-primary);    /* Global variable */
  color: var(--text-primary);            /* Global variable */
  padding: var(--space-md);               /* Global variable */
  border-radius: var(--border-radius);   /* Global variable */
  
  /* Component-specific layout only */
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-sm);                   /* Still uses global */
}
```

#### Example of WRONG Component CSS:
```css
/* ❌ WRONG - Duplicates global variables */
.wb-my-component {
  --component-primary: #6366f1;          /* Duplicates --primary */
  --component-spacing: 1rem;             /* Duplicates --space-md */
  --component-font: 1rem;                /* Duplicates --font-size-base */
  
  background-color: var(--component-primary);
  padding: var(--component-spacing);
  font-size: var(--component-font);
}
```

### How to Check for Duplicates:
1. **Before adding CSS**: Check `/styles/_variables.css` for existing variables
2. **Before adding utilities**: Check `/styles/_utilities.css` for existing classes
3. **Before adding base styles**: Check `/styles/_base.css` for existing element styles

## WB-Specific CSS Rules & Patterns

### 1. CSS Variable Naming Convention
All WB components must follow the standardized CSS variable naming pattern:

```css
:root {
    /* Component-specific variables with wb- prefix */
    --wb-component-name-property: value;
    --wb-btn-height: 1.5rem;
    --wb-btn-font-size: clamp(0.5rem, 2vw, 0.75rem);
    --wb-btn-border-radius: 6px;
    --wb-btn-transition: all 0.2s ease;
}
```

**Required Pattern:**
- Start with `--wb-`
- Include component name
- Use kebab-case for properties
- Example: `--wb-your-component-bg`, `--wb-your-component-padding`

### 2. Responsive Typography with clamp()
WB components use `clamp()` for responsive typography:

```css
.wb-component {
    /* Responsive font size: min, preferred (responsive), max */
    font-size: clamp(0.5rem, 2vw, 0.75rem);
    
    /* Responsive spacing */
    padding: clamp(0.25rem, 1vw, 0.5rem);
    margin: clamp(0.5rem, 2vw, 1rem);
}
```

### 3. Important Declarations Usage
WB components strategically use `!important` for:

```css
.wb-component {
    /* Layout properties that must not be overridden */
    height: var(--wb-component-height) !important;
    min-height: var(--wb-component-height) !important;
    max-height: var(--wb-component-height) !important;
    
    /* Box model properties */
    box-sizing: border-box !important;
    
    /* Display and alignment */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
```

**Use `!important` for:**
- Critical layout properties that ensure component integrity
- Box model properties that prevent layout breaks
- Display properties that maintain component structure
- **Avoid `!important` for:** colors, decorative properties, optional styling

### 4. Component Class Structure (BEM-like)
```css
/* Base component */
.wb-component-name { }

/* Component elements */
.wb-component-name__element { }

/* Component modifiers/variants */
.wb-component-name--variant { }
.wb-component-name--size { }
.wb-component-name--state { }
```

### 5. Standard Layout Properties
```css
.wb-component {
    /* Consistent box model */
    box-sizing: border-box !important;
    
    /* Prevent content overflow */
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Flexible layout */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    
    /* Text handling */
    white-space: nowrap;
    word-wrap: break-word;
    hyphens: auto;
}
```

### 6. Theme Integration Requirements
```css
/* Use WB theme variables */
.wb-component {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

/* Dark mode compatibility */
[data-theme="dark"] .wb-component {
    /* Automatic theme switching via CSS variables */
    /* No additional rules needed if using theme variables correctly */
}
```

### 7. Accessibility CSS Requirements
```css
.wb-component {
    /* Focus indicators */
    outline: none;
}

.wb-component:focus-visible {
    outline: 2px solid var(--focus-color, var(--primary)) !important;
    outline-offset: 2px !important;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .wb-component {
        border-width: 2px;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .wb-component {
        transition: none;
        animation: none;
    }
}
```

### 8. Mobile-First Responsive Design
```css
.wb-component {
    /* Mobile base styles */
    min-height: 44px; /* Touch target size */
    font-size: clamp(0.875rem, 2.5vw, 1rem);
}

/* Tablet and desktop enhancements */
@media (min-width: 768px) {
    .wb-component {
        /* Larger screen adjustments */
    }
}
```

## Best Practices

### 1. Naming Conventions
- Use `wb-` prefix for all components and CSS variables
- Use kebab-case for component names
- Use consistent class naming (BEM methodology)
- Follow semantic versioning

### 2. Code Standards
- Follow existing code patterns
- Use ES6+ features appropriately
- Include comprehensive error handling
- Write self-documenting code
- Add appropriate comments

### 3. Accessibility
- Include proper ARIA attributes
- Support keyboard navigation
- Provide screen reader support
- Test with accessibility tools
- Follow WCAG 2.1 AA guidelines

### 4. Performance
- Lazy load resources when possible
- Minimize bundle size impact
- Use efficient DOM manipulation
- Implement proper cleanup
- Optimize for mobile devices

### 5. Testing
- Write comprehensive unit tests
- Include integration tests
- Test across browsers
- Verify accessibility
- Performance testing

### 6. Documentation
- Write clear, comprehensive docs
- Include practical examples
- Document all APIs thoroughly
- Provide troubleshooting guides
- Keep documentation updated

## Common Patterns

### Error Handling
```javascript
try {
  await this.initialize();
} catch (error) {
  console.error(`${this.constructor.name} initialization failed:`, error);
  this.initializeFallback();
}
```

### Event Dispatching
```javascript
this.dispatchEvent(new CustomEvent('wb-component:event', {
  detail: { data: value },
  bubbles: true
}));
```

### CSS Variable Updates
```javascript
this.style.setProperty('--component-property', value);
```

### Responsive Handling
```javascript
const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addListener(this.handleResponsiveChange.bind(this));
```

## Troubleshooting

### Component Not Loading
1. Check file paths in script src
2. Verify wb-component-utils.js is available
3. Check browser console for errors
4. Ensure custom element name is unique

### Styles Not Applying
1. Verify CSS file loads correctly
2. Check CSS variable values
3. Ensure proper cascade order
4. Check for conflicting styles

### Events Not Working
1. Verify event listener syntax
2. Check component initialization
3. Ensure proper event bubbling
4. Verify event names match

### Performance Issues
1. Check for memory leaks
2. Optimize event listeners
3. Minimize DOM operations
4. Use efficient selectors

## Resources

- [Web Components Specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 📋 Documentation Maintenance

**🚨 CRITICAL: Keep This Guide Updated**

As noted in `/docs/claude.md`: *"They should all be kept up to date as specs change often."*

### 📅 Recommended: Add Last Updated Dates to ALL Documentation

**All WB documentation files should include:**
```markdown
---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: [Name/Team]*
---
```

**Benefits:**
- ✅ **Quick freshness check** - See if docs are current at a glance
- ✅ **Maintenance tracking** - Know which docs need attention
- ✅ **Version correlation** - Match docs to system version
- ✅ **Accountability** - Track who last updated documentation
- ✅ **Change frequency** - Understand how often specs change

**Recommended for:**
- All `/docs/*.md` files
- Component documentation (`*.md` files)
- API documentation
- Architecture guides
- Setup instructions

### Update This Guide When:
- **CSS Architecture Changes** - New variables added to `/styles/_variables.css`
- **Component Base Class Updates** - Changes to `wb-component-base.js` or `wb-component-utils.js`
- **New WB Conventions** - Updated naming patterns, file structures, or best practices
- **API Changes** - Modifications to component loading, event system, or configuration
- **Build Process Updates** - Changes to testing, bundling, or deployment processes

### Maintenance Checklist:
- [ ] Review CSS template for new global variables
- [ ] Update JavaScript template for base class changes
- [ ] Verify JSON configuration schema is current
- [ ] Check that examples use latest WB patterns
- [ ] Update browser support requirements
- [ ] Refresh performance guidelines
- [ ] Validate accessibility requirements
- [ ] **Update last modified date** at bottom of document
- [ ] **Update version number** if changes are significant

### Version History:
- **1.0.0** (2025-09-29) - Initial creation with no-duplicate CSS principle
- **Next Update** - [Add changes here when updating]

---

*This guide is part of the Website Builder component system documentation.*  
*Keep synchronized with system evolution per /docs/claude.md requirements.*  
*Version: 1.0.0*  
*Last Updated: 2025-09-29*