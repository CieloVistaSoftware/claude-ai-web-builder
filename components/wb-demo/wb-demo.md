# WB Demo Component

## Overview
A reusable component for creating two-tab documentation and examples layouts following WB component standards.

## Features
- ✅ Two-tab structure (Documentation/Examples) 
- ✅ Built-in event logging system with one message per line enforcement
- ✅ Slotted content architecture
- ✅ Dark theme styling
- ✅ CSS-first architecture with external stylesheet
- ✅ Reusable across all WB components

## File Structure
```
components/wb-demo/
├── wb-demo.js              # Main component (ES6 class)
├── wb-demo.css             # External styles (CSS-first)
├── wb-demo-demo.html       # Two-tab demo
├── wb-demo.md              # Component documentation
└── claude.md               # Development log
```

## Usage Example
```html
<wb-demo>
    <span slot="title">🧪 My Component Demo</span>
    
    <div slot="documentation">
        <h2>Documentation Content</h2>
        <p>Component docs go here...</p>
    </div>
    
    <div slot="examples">
        <h2>Examples Content</h2>
        <p>Interactive examples go here...</p>
    </div>
</wb-demo>
```

## Standards Compliance
- ✅ **wb- prefix**: wb-demo
- ✅ **CSS-First**: External wb-demo.css file
- ✅ **ES6 modules**: No CommonJS
- ✅ **Two-tab demo**: wb-demo-demo.html
- ✅ **Shadow DOM**: Used appropriately for reusable UI component
- ✅ **Event logging**: Built-in logging system with one message per line enforcement
- ✅ **Composition**: Supports slotted content

## Event Logging Requirements
**CRITICAL: One Message Per Line Rule**
- All event messages are automatically flattened to single lines
- Multi-line messages have line breaks converted to spaces
- Excessive whitespace is normalized for clean readability
- This ensures consistent event log formatting across all components

## API

### Slots
- `title`: Component title displayed in header
- `documentation`: Content for Documentation tab
- `examples`: Content for Examples tab

### Methods
- `logEvent(message, type)`: Log an event to the built-in event log
- `clearEventLog()`: Clear the event log display
- `testEventLogging()`: Generate a test event
- `generateMultipleEvents()`: Generate multiple test events
- `toggleFilter(type)`: Toggle event type filter
- `selectAllFilters()`: Enable all event filters
- `clearAllFilters()`: Disable all event filters
- `saveEventLog()`: Export event log to JSON file

### Event Types
- `info`: Informational messages (default)
- `warning`: Warning messages
- `error`: Error messages  
- `success`: Success messages
- `debug`: Debug messages
- `user`: User interaction messages

## Integration
This component is designed to be used across all WB component demo pages to provide a consistent two-tab structure with built-in event logging capabilities.

---
*Status: COMPONENT COMPLETE AND STANDARDS COMPLIANT*