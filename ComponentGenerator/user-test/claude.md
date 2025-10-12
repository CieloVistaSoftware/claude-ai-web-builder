# UserTest - AI/Claude Documentation

---

## 📋 Component Metadata

**Component Name:** user-test  
**Component Class:** UserTest  
**Version:** 1.0.0  
**Created:** 2025-10-12T20:21:34.281Z  
**Last Updated:** 2025-10-12T20:21:34.281Z  
**Status:** 🟢 Active Development

### 📁 File Locations

```
user-test/
├── user-test.js           # Component implementation
├── user-test.css          # Component styles  
├── user-test.html         # Demo page
├── user-test.md           # Human documentation
├── claude.md                # This file (AI documentation)
└── schema.json              # Component schema
```

### 🔗 Important Links

- **Component Documentation:** [user-test.md](./user-test.md)
- **Demo Page:** [user-test.html](./user-test.html)
- **Component Schema:** [schema.json](./schema.json)
- **How to Create Web Components:** [../HowToCreateWebcomponent.md](../HowToCreateWebcomponent.md)
- **Component Guidelines:** [WB Standards](../HowToCreateWebcomponent.md#wb-specific-css-rules--patterns)

---

## 🐛 Issue Tracking

### Current Issues

<!-- Add new issues below with timestamp, line number, priority -->

```
No issues currently logged.
```

### Issue Template

When logging new issues, use this format:

```markdown
**[PRIORITY] Issue Title**  
- **Timestamp:** YYYY-MM-DD HH:MM:SS
- **File:** user-test.js
- **Line:** Line number(s)
- **Description:** Brief description of the issue
- **Impact:** How this affects functionality
- **Fix:** Proposed solution (if known)
```

**Priority Levels:**
- 🔴 **P0 - CRITICAL**: Blocks functionality, must fix immediately
- 🟠 **P1 - HIGH**: Major issue, fix before release
- 🟡 **P2 - MEDIUM**: Important but not blocking
- 🟢 **P3 - LOW**: Nice to have, minor issue
- 🔵 **P4 - ENHANCEMENT**: Future improvement

### Example Issue Entry

```markdown
**[P1 - HIGH] Event handler memory leak**
- **Timestamp:** 2025-01-15 14:30:00
- **File:** user-test.js
- **Line:** 145-150
- **Description:** Event listeners not properly cleaned up in disconnectedCallback
- **Impact:** Memory leaks when component is removed from DOM
- **Fix:** Add removeEventListener calls in disconnectedCallback method
```

---

This file provides AI-optimized documentation for the user-test Web Component.

## Component Purpose

test

This component is designed to test. It follows Web Components standards and can be used in any modern web application.

## Usage for AI

When generating code using this component, remember:

1. **Tag Name**: Always use `<user-test>` (with hyphen)
2. **Shadow DOM**: This component uses **open** shadow DOM
3. **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, etc.
4. **Self-Contained**: All styles are encapsulated

## Key Attributes


### name

- **Type**: `string`
- **Purpose**: the name
- **Required**: No


```html
<user-test name="example-value"></user-test>
```


## Events


### onclick

onclick

**Listening to the event:**

```javascript
const element = document.querySelector('user-test');
element.addEventListener('onclick', (event) => {
  console.log('Event fired:', event.detail);
  // Handle event
});
```

**Event Detail Structure:**

```javascript
{
  timestamp: number,
  // Additional event-specific data
}
```


### onClick



**Listening to the event:**

```javascript
const element = document.querySelector('user-test');
element.addEventListener('onClick', (event) => {
  console.log('Event fired:', event.detail);
  // Handle event
});
```

**Event Detail Structure:**

```javascript
{
  timestamp: number,
  // Additional event-specific data
}
```


## Slots


### default Slot

default

```html
<user-test>
  <div slot="default">
    default
  </div>
</user-test>
```


## Common Patterns

### Basic Usage

```html
<user-test name="example"></user-test>
```

### With All Attributes

```html
<user-test
  name="example-name"
></user-test>
```

### With Slots

```html
<user-test>
  <div slot="default">default</div>
</user-test>
```


### Programmatic Creation

```javascript
// Create element
const element = document.createElement('user-test');

// Set attributes
element.setAttribute('name', 'value');

// Add event listeners
element.addEventListener('onclick', (e) => {
  console.log('onclick:', e.detail);
});

element.addEventListener('onClick', (e) => {
  console.log('onClick:', e.detail);
});

// Append to DOM
document.body.appendChild(element);
```

## Code Examples

### Example 1: Simple Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="user-test.js"></script>
</head>
<body>
  <user-test name="Example"></user-test>
</body>
</html>
```

### Example 2: With Event Handling

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="user-test.js"></script>
</head>
<body>
  <user-test id="myComponent" name="Example"></user-test>
  
  <script>
    const component = document.getElementById('myComponent');
    
    component.addEventListener('onclick', (event) => {
      console.log('onclick fired:', event.detail);
      // Your handling logic here
    });
    
    component.addEventListener('onClick', (event) => {
      console.log('onClick fired:', event.detail);
      // Your handling logic here
    });
  </script>
</body>
</html>
```

### Example 3: Dynamic Content

```javascript
// Fetch data and populate component
async function loadData() {
  const data = await fetch('/api/data').then(r => r.json());
  
  const component = document.createElement('user-test');
  
  // Set attributes from data
  component.setAttribute('name', data.name || '');
  
  document.body.appendChild(component);
}

loadData();
```

## Integration Notes

### Framework Integration

#### Vanilla JavaScript

```javascript
document.querySelector('user-test').addEventListener('onclick', handler);
```

#### React

```jsx
function MyComponent() {
  const handleEvent = (e) => {
    console.log(e.detail);
  };
  
  return (
    <user-test
      name="value"
      ref={(el) => el && el.addEventListener('onclick', handleEvent)}
    />
  );
}
```

#### Vue

```vue
<template>
  <user-test
    :name="value"
    @onclick="handleEvent"
  />
</template>

<script>
export default {
  methods: {
    handleEvent(e) {
      console.log(e.detail);
    }
  }
}
</script>
```

#### Angular

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <user-test
      [attr.name]="value"
      (onclick)="handleEvent($event)"
    ></user-test>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  handleEvent(event: CustomEvent) {
    console.log(event.detail);
  }
}
```

### Browser Support

- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

### Performance Considerations

- Component uses Shadow DOM (open) for style encapsulation
- Minimal performance overhead
- Efficient re-rendering on attribute changes
- Proper cleanup in disconnectedCallback

### Accessibility

- Component includes basic ARIA attributes
- Keyboard navigation supported
- Screen reader compatible
- Consider adding aria-label attribute for better accessibility

## AI Code Generation Tips

When generating code that uses this component:

1. **Always include the hyphen** in the tag name (`user-test`)
2. **Import before use**: `<script type="module" src="user-test.js"></script>`
3. **Attribute types matter**: 
   - name: string
4. **Events bubble**: Set `bubbles: true` when dispatching
5. **Use composed**: Set `composed: true` to cross shadow boundaries

## Troubleshooting

### Component Not Displaying

**Check:**
1. Script tag present and loaded
2. Tag name has hyphen
3. Browser supports Custom Elements
4. No JavaScript errors in console

### Styles Not Applied

**Check:**
1. Shadow DOM mode is correct (open)
2. Styles are in shadowRoot, not document
3. CSS custom properties for theming

### Events Not Firing

**Check:**
1. Event name is correct (onclick)
2. Event listener attached after component loads
3. Event bubbles and composed flags set correctly

## Version History

- **v1.0.0**: Initial release
  - Basic functionality
  - All attributes implemented
  - Event handling
  - Slot support

## Author

jp

## Related Components

Consider using with:
- Other custom elements in your application
- Standard HTML elements
- Third-party Web Components

---

**This documentation is optimized for AI assistants like Claude to understand and generate code using this component.**