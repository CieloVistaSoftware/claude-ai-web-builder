# WB Component Documentation Standard

## Overview

Every WB component should have a `.md` file with these standardized sections. This allows:
- **Humans** to read documentation easily
- **wb-chatbot** to parse and find sections reliably
- **Consistency** across all components

## Required Sections (in order)

```markdown
# wb-component-name

Brief one-line description.

## Overview
What this component does and when to use it.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
How to include and use.

## HTML Examples
```html
<wb-component attribute="value"></wb-component>
```

## Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| name | string | '' | Description |

## Events
| Event | Detail | Description |
|-------|--------|-------------|
| wb-component:ready | { component } | Fired when ready |

## CSS Variables
| Variable | Default | Description |
|----------|---------|-------------|
| --primary | #667eea | Main color |

## JavaScript API
```javascript
const el = document.querySelector('wb-component');
el.methodName();
```

## CSS Source
```css
/* Component styles */
.wb-component { ... }
```

## JavaScript Source
```javascript
// Key parts of the component
class WBComponent extends WBBaseComponent { ... }
```

## Theory / How It Works
Explanation of the underlying concepts.

## Related Components
- [wb-related](/components/wb-related/wb-related-demo.html)

## Version History
- v1.0.0 - Initial release
```

## Section Markers

The chatbot looks for these exact headers:
- `## Overview` - Component description
- `## Features` - Bullet list of features  
- `## HTML Examples` or `## Examples` or `## Usage` - Code samples
- `## Attributes` or `## Configuration` or `## Props` - Config table
- `## Events` - Events table
- `## CSS Variables` or `## CSS Custom Properties` - Styling options
- `## JavaScript API` or `## API` or `## Methods` - JS methods
- `## CSS Source` - Embedded stylesheet
- `## JavaScript Source` or `## Source Code` - Embedded JS
- `## Theory` or `## How It Works` - Concepts explanation

## Example: wb-button.md

```markdown
# wb-button

Interactive button component with variants, sizes, and states.

## Overview

The wb-button component provides a consistent, accessible button with multiple visual variants. It supports icons, loading states, and integrates with the WB color system.

## Features

- **Multiple Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **States**: disabled, loading, active
- **Icons**: Left and right icon slots
- **Accessibility**: Full keyboard support, ARIA labels

## HTML Examples

### Basic Button
```html
<wb-button>Click Me</wb-button>
```

### With Variant
```html
<wb-button variant="primary">Primary</wb-button>
<wb-button variant="outline">Outline</wb-button>
<wb-button variant="danger">Delete</wb-button>
```

### With Size
```html
<wb-button size="sm">Small</wb-button>
<wb-button size="lg">Large</wb-button>
```

### Disabled State
```html
<wb-button disabled>Can't Click</wb-button>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| variant | string | 'primary' | Button style: primary, secondary, outline, ghost, danger |
| size | string | 'md' | Button size: sm, md, lg |
| disabled | boolean | false | Disables the button |
| loading | boolean | false | Shows loading spinner |
| type | string | 'button' | Button type: button, submit, reset |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| wb-button:click | { originalEvent } | Fired on click (even when disabled shows intent) |
| wb-button:ready | { component } | Fired when component initializes |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| --wb-button-bg | var(--primary) | Background color |
| --wb-button-color | white | Text color |
| --wb-button-radius | 8px | Border radius |
| --wb-button-padding | 12px 20px | Padding |

## JavaScript API

```javascript
const btn = document.querySelector('wb-button');

// Methods
btn.click();           // Programmatic click
btn.focus();           // Focus the button
btn.setLoading(true);  // Show loading state

// Properties
btn.disabled = true;   // Disable
btn.variant = 'danger'; // Change variant
```

## CSS Source

```css
.wb-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: var(--wb-button-padding, 12px 20px);
    border-radius: var(--wb-button-radius, 8px);
    border: none;
    background: var(--wb-button-bg, var(--primary));
    color: var(--wb-button-color, white);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.wb-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.wb-button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.wb-button--outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
}
```

## Theory

Buttons follow the principle of **affordance** - they should look clickable. The WB button uses:

1. **Visual hierarchy** via variants (primary stands out, ghost blends in)
2. **Feedback** via hover/active states
3. **Accessibility** via focus rings and ARIA

## Related Components

- [wb-input](/components/wb-input/wb-input-demo.html) - Form inputs
- [wb-toggle](/components/wb-toggle/wb-toggle-demo.html) - Boolean toggle
- [wb-card](/components/wb-card/wb-card-demo.html) - Container for buttons

## Version History

- v2.0.0 - Added loading state, icon slots
- v1.1.0 - Added ghost and danger variants
- v1.0.0 - Initial release
```

## Benefits

1. **Single source of truth** - docs always match code
2. **Chatbot-friendly** - predictable sections to parse
3. **Human-readable** - standard markdown
4. **Searchable** - all content in one file
5. **Versionable** - git tracks changes
6. **Offline** - no server needed to read
