# Trace Element Specification

## Overview

The Trace Element is a custom web component for structured, filterable, and visually rich event tracing in web applications. It is designed for debugging, monitoring, and auditing UI and API events in real time.

## Features

- **Structured event logging**: Supports levels (debug, info, warn, error), directions (incoming, outgoing, UI, API), and custom tags.
- **Filter and search**: Filter by level, direction, tag, or text. Search for specific events.
- **Performance**: Handles thousands of entries efficiently with virtual scrolling.
- **Accessibility**: Keyboard navigation, ARIA roles, and high-contrast support.
- **Customizable**: Theming, max entries, and custom renderers.

## Usage

### Basic Example
```html
<trace-element max-entries="1000" trace-level="debug"></trace-element>
<script type="module">
  import './trace-element.js';
  const trace = document.querySelector('trace-element');
  trace.addEntry({
    level: 'info',
    direction: 'ui',
    message: 'Component loaded',
    data: { user: 'alice' }
  });
</script>
```

### API

#### Properties
- `maxEntries` (number): Maximum number of entries to keep (default: 1000)
- `traceLevel` (string): Minimum level to display ('debug', 'info', 'warn', 'error')
- `theme` (string): 'light' | 'dark' (default: 'light')

#### Methods
- `addEntry(entry: TraceEntry)`: Add a new trace entry
- `clear()`: Remove all entries
- `filter({ level, direction, tag, text })`: Filter entries

#### Events
- `trace:entry-added`: Fired when a new entry is added
- `trace:cleared`: Fired when entries are cleared

#### Entry Format
```js
{
  level: 'info', // 'debug' | 'info' | 'warn' | 'error'
  direction: 'ui', // 'ui' | 'api' | 'incoming' | 'outgoing'
  tag: 'custom', // optional
  message: '...',
  data: { ... },
  timestamp: Date
}
```

## Accessibility

- ARIA roles: `log`, `listitem`, `button`
- Keyboard navigation: Up/Down, Home/End, Enter to expand
- High-contrast and reduced motion support

## Example: Integration with Component
```js
import { TraceElement } from './trace-element.js';
const trace = document.createElement('trace-element');
trace.setAttribute('max-entries', '500');
trace.setAttribute('trace-level', 'debug');
document.body.appendChild(trace);

trace.addEntry({
  level: 'info',
  direction: 'ui',
  message: 'User clicked button',
  data: { button: 'submit' }
});
```

## Theming

```css
trace-element[theme="dark"] {
  --trace-bg: #181a1b;
  --trace-fg: #f8f8f2;
  --trace-accent: #50fa7b;
}
```

## Performance

- Virtual scrolling for large logs
- Efficient DOM updates
- Batching and throttling

## Changelog

- **v1.2.0** (2025-09-13): Accessibility and theming improvements
- **v1.1.0** (2025-08-01): Virtual scrolling, performance optimizations
- **v1.0.0** (2025-07-01): Initial release
