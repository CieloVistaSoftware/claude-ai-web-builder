# WB Chatbot Component

A documentation-aware chatbot component that provides interactive exploration of the WB Framework. It reads actual component files and documentation to give detailed, accurate answers.

## Overview

The WB Chatbot is an intelligent assistant that helps developers explore and understand WB Framework components. Unlike static documentation, it provides contextual answers, remembers conversation context, and offers drill-down capabilities into any component's source code, CSS, schemas, and more.

## Features

### Core Features
- **Documentation-Aware**: Reads actual `.md` files for accurate information
- **File Explorer**: Lists and links to all component files (JS, CSS, demo, schema)
- **Context Memory**: Remembers which component you're discussing
- **Drill-Down**: Explore attributes, events, CSS variables, examples, API methods
- **Markdown Rendering**: Formats code blocks, links, lists, and emphasis

### Navigation Features
- **Clickable Links**: All file references are clickable
- **Same-Window Navigation**: Links open in the same browser window
- **Quick Actions**: Suggested follow-up queries for deeper exploration

## Installation

### Basic Usage

```html
<!-- Include via main.js (recommended) -->
<script type="module" src="/src/js/main.js"></script>

<!-- Use in HTML -->
<wb-chatbot></wb-chatbot>
```

### With Custom Title

```html
<wb-chatbot title="Help Bot"></wb-chatbot>
```

### In a Demo Page

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>Chatbot Demo</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <wb-demo>
        <span slot="title">WB Chatbot Demo</span>
        <div slot="content">
            <wb-chatbot title="WB Assistant"></wb-chatbot>
        </div>
    </wb-demo>
    <script type="module" src="/src/js/main.js"></script>
</body>
</html>
```

## Configuration Options

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | 'WB Assistant' | Header title displayed in the chatbot |

## Query Types

### Component Exploration

```
"Tell me about wb-slider"     → Overview with quick links
"What files does it have?"    → List all component files
"Show me the source"          → Link to .js file
"Show me the CSS"             → Link to .css file
"Schema"                      → Link to .schema.json
"Dev notes"                   → Link to claude.md
```

### Documentation Queries

```
"What attributes does it have?"  → Configuration options
"What events does it fire?"      → Event documentation
"CSS variables"                  → Styling custom properties
"Show me examples"               → Usage examples
"API methods"                    → JavaScript API
```

### General Queries

```
"List components"        → All WB components by category
"Color system"           → Harmonic Color System info
"Testing"                → Playwright testing info
"CSS architecture"       → Style organization
"Help"                   → Available commands
```

## Events

### `wb-chatbot:ready`
Fired when the component initializes.

```javascript
document.addEventListener('wb-chatbot:ready', (e) => {
    console.log('Chatbot ready:', e.detail.component);
});
```

### `wb-chatbot:message`
Fired when the user sends a message.

```javascript
document.addEventListener('wb-chatbot:message', (e) => {
    console.log('User message:', e.detail.message);
});
```

## CSS Variables

The component uses CSS custom properties for theming:

```css
/* Container */
--bg-primary: #1a1a2e;
--bg-secondary: #16213e;
--border-color: #3f3f46;

/* Text */
--text-primary: #e4e4e7;
--text-muted: #71717a;

/* Accent */
--primary: #667eea;
```

## Theming

### Dark Theme (Default)

```html
<html data-theme="dark">
    <wb-chatbot></wb-chatbot>
</html>
```

### Light Theme

```html
<html data-theme="light">
    <wb-chatbot></wb-chatbot>
</html>
```

### Custom Theme

```css
:root {
    --bg-primary: #0a192f;
    --bg-secondary: #112240;
    --primary: #64ffda;
    --text-primary: #ccd6f6;
}
```

## Examples

### Basic Chatbot

```html
<wb-chatbot></wb-chatbot>
```

### Custom Title

```html
<wb-chatbot title="Framework Help"></wb-chatbot>
```

### Multiple Chatbots

```html
<div style="display: flex; gap: 20px;">
    <wb-chatbot title="Component Help"></wb-chatbot>
    <wb-chatbot title="CSS Help"></wb-chatbot>
</div>
```

### Programmatic Access

```javascript
const chatbot = document.querySelector('wb-chatbot');

// Listen for messages
chatbot.addEventListener('wb-chatbot:message', (e) => {
    console.log('User asked:', e.detail.message);
});

// Access internal state (for debugging)
console.log('Current context:', chatbot._context);
```

## Architecture

### File Structure

```
/components/wb-chatbot/
├── wb-chatbot.js          # Component logic
├── wb-chatbot.css         # Styles
├── wb-chatbot-demo.html   # Demo page
├── wb-chatbot.md          # This documentation
└── ✅ claude.md           # Development notes
```

### How It Works

1. **Query Parsing**: Identifies component names and query types
2. **Context Tracking**: Remembers current component for follow-up questions
3. **Documentation Loading**: Fetches `.md` files via HTTP
4. **Section Extraction**: Parses markdown for relevant sections
5. **Response Formatting**: Converts markdown to HTML for display

## Best Practices

1. **Start with overview**: Ask "Tell me about [component]" first
2. **Use context**: Say "its events" instead of repeating component name
3. **Explore files**: Use "what files" to see all available resources
4. **Click links**: All file references are navigable

## Troubleshooting

### No documentation found
- Check if the component has a `.md` file
- The chatbot will show available files instead

### Links not working
- Ensure the dev server is running
- Check browser console for 404 errors

### Context not remembered
- Context resets when you ask about a different component
- Use pronouns like "it" or "this" to maintain context

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Version History

- **v2.1.0**: Added drill-down file explorer, same-window navigation
- **v2.0.0**: Added documentation-aware responses, context memory
- **v1.0.0**: Initial release with basic knowledge base
