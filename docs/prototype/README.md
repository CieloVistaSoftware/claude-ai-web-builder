# WB Component IDE - Prototype

A visual IDE for developing and testing Web Components with the Website Builder system.

## 🎯 Quick Start

1. Open `simple-ide.html` in your browser
2. Components auto-discover from `../../components/` folder
3. **Single-click** = View documentation
4. **Double-click** = Insert component into editor

## 📁 File Structure

```
wb/
├── components/           # Your WB components (auto-discovered)
│   ├── wb-button/
│   │   ├── wb-button.js
│   │   ├── wb-button.css      # Component-specific styles only
│   │   ├── wb-button.md       # Documentation
│   │   └── wb-button.schema.json
│   └── ... (all wb-* components)
├── styles/              # Central style system (DO NOT add component styles here)
│   ├── main.css        # Entry point (imports all below)
│   ├── _variables.css  # Global CSS variables
│   ├── _base.css       # Resets and foundations
│   ├── _utilities.css  # Utility classes
│   └── layouts.css     # Layout system
└── docs/
    └── prototype/       # This IDE
        ├── simple-ide.html
        ├── simple-ide.css
        └── simple-ide.js
```

## 🎨 Architecture Principles

### Component CSS Isolation
Each component has its **own CSS file**:
```
components/wb-button/wb-button.css  ✅ Component-specific styles here
```

**NEVER add component styles to:**
```
styles/_variables.css  ❌ Only global design tokens
styles/_base.css       ❌ Only resets and foundations
styles/_utilities.css  ❌ Only reusable utilities
styles/layouts.css     ❌ Only layout system
```

### Style Loading Pattern
```html
<!-- In component demos: -->
<link rel="stylesheet" href="../../styles/main.css">  <!-- Global foundation -->
<link rel="stylesheet" href="wb-component.css">       <!-- Component-specific -->
<script src="wb-component.js"></script>
```

### Preview HTML Template
The initial editor template uses the proper structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Web Component Project</title>
  <link rel="stylesheet" href="../../styles/main.css">  ✅ Uses central styles
</head>
<body data-theme="dark">  <!-- Dark mode by default -->
  <header>...</header>
  <nav>...</nav>
  <main>...</main>
  <footer>...</footer>
</body>
</html>
```

## 🔧 Features

### Dynamic Component Discovery
- Reads `../../components/` directory automatically
- Falls back to component probing if directory listing unavailable
- Shows 4 example components if no components folder found

### Three View Modes
1. **📝 Edit** - Write and edit HTML/CSS/JS
2. **👁️ Preview** - Live preview with dark mode
3. **📖 Documentation** - View component `.md` files

### Schema-Based Insertion
When you double-click a component:
1. Reads `component.schema.json` for attributes
2. Generates proper HTML with default values
3. Inserts at cursor position with proper formatting

### Responsive Design
- Desktop: Full sidebar + editor
- Tablet: Narrower sidebar
- Mobile: Collapsible sidebar with hamburger menu

## 🎯 CSS Variables System

Components use CSS variables from `styles/_variables.css`:

```css
/* In your component CSS: */
.wb-button {
  background: var(--primary);          /* Uses global primary color */
  color: var(--text-primary);          /* Uses global text color */
  padding: var(--space-md);            /* Uses global spacing */
  border-radius: var(--radius-md);     /* Uses global border radius */
}
```

**Benefits:**
- ✅ Automatic theme support (light/dark/custom)
- ✅ Consistent design tokens
- ✅ Real-time theme changes via control panel
- ✅ No hardcoded colors/spacing

## 🚀 Creating New Components

1. **Create component folder:**
   ```
   components/wb-mycomponent/
   ```

2. **Add required files:**
   ```
   wb-mycomponent.js        # Web Component class
   wb-mycomponent.css       # Component styles (uses CSS variables)
   wb-mycomponent.md        # Documentation
   wb-mycomponent.schema.json  # Metadata and attributes
   ```

3. **Component CSS structure:**
   ```css
   /* wb-mycomponent.css */
   
   .wb-mycomponent {
     /* Use global variables, never hardcode */
     background: var(--bg-primary);
     color: var(--text-primary);
     padding: var(--space-md);
     border: 1px solid var(--border-color);
     border-radius: var(--radius-md);
   }
   
   .wb-mycomponent:hover {
     background: var(--bg-secondary);
   }
   ```

4. **Reload IDE** - Your component appears automatically!

## 📖 Documentation Format

Create `wb-component.md` with standard markdown:

```markdown
# wb-component

## Overview
Brief description of what this component does.

## Usage
\`\`\`html
<wb-component variant="primary" size="medium">
  Content here
</wb-component>
\`\`\`

## Attributes
- **variant**: Style variant (primary, secondary, success)
- **size**: Component size (small, medium, large)

## Examples
More examples here...
```

## 🎨 Theme System Integration

Your components automatically support all themes:

```css
/* Your component CSS automatically works with: */
[data-theme="dark"]      /* Dark theme (default) */
[data-theme="light"]     /* Light theme */
[data-theme="cyberpunk"] /* Cyberpunk theme */
[data-theme="ocean"]     /* Ocean theme */
[data-theme="sunset"]    /* Sunset theme */
[data-theme="forest"]    /* Forest theme */
```

No extra code needed - just use CSS variables!

## 🐛 Troubleshooting

### Components not appearing?
- Check if `../../components/wb-*/` folders exist
- Verify each component has a `.js` file
- Open browser console for error messages

### Preview not in dark mode?
- Ensure `<link rel="stylesheet" href="../../styles/main.css">` is in template
- Add `data-theme="dark"` to `<body>` tag

### Component styles not working?
- Verify component CSS uses `var(--variable-name)` not hardcoded values
- Check that component CSS is loaded: `<link rel="stylesheet" href="wb-component.css">`

## 🔗 Related Documentation

- [Color Theory](../color-theory.md) - Understanding the HSL color system
- [Style Architecture](../../styles/claude.md) - Complete style system documentation
- [Layout System](../../styles/layouts.css) - Layout patterns and responsive design

## 💡 Tips

1. **Use CSS Variables** - Never hardcode colors/spacing
2. **Keep CSS Isolated** - Each component owns its styles
3. **Follow Naming Convention** - All components start with `wb-`
4. **Document Everything** - Good `.md` files help everyone
5. **Test Responsive** - Use browser dev tools to test mobile/tablet

## 🎉 That's It!

You now have a fully functional IDE for building and testing WB components with proper architecture, theme support, and responsive design.

Happy coding! 🚀
