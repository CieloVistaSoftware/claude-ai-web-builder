# Image Insert Component Documentation

## Overview

The Image Insert Component is a lightweight, auto-attaching JavaScript module that enables double-click image insertion and editing for semantic HTML elements. It automatically enhances all semantic elements (header, nav, main, article, section, aside, figure, footer) with image management capabilities without requiring any manual initialization or markup changes.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Events](#events)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Configuration](#configuration)
7. [Styling](#styling)
8. [Technical Details](#technical-details)
9. [Browser Support](#browser-support)
10. [Troubleshooting](#troubleshooting)
11. [Examples](#examples)

## Features

### Core Features
- **Auto-attachment**: Automatically attaches to all semantic HTML elements
- **Double-click activation**: Simple double-click to add or edit images
- **Drag-and-drop modal**: Draggable modal interface for image management
- **Image positioning**: Place images at top, bottom, left, or right of content
- **Custom sizing**: Set custom width and height for images
- **Preview functionality**: Live preview of images before insertion
- **File validation**: Validates image types and file sizes
- **Responsive design**: Works on desktop and mobile devices

### Visual Features
- **Hover indicators**: Visual hints on hoverable elements
- **Edit mode styling**: Clear visual feedback during editing
- **Dark theme support**: Compatible with dark mode interfaces
- **Smooth animations**: Polished transitions and interactions

## Installation

### Basic Installation

1. Include the CSS file in your HTML head:
```html
<link rel="stylesheet" href="path/to/image-insert.css">
```

2. Include the JavaScript file before closing body tag:
```html
<script src="path/to/image-insert.js"></script>
```

### Integration with Website Builder

For integration with the Website Builder project:
```html
<!-- In wb.html -->
<script src="../components/image-insert/image-insert.js"></script>
```

The component automatically integrates with the Website Builder's edit mode system through events. See the [Events](#events) section for complete integration details.

## Events

The Image Insert Component uses a **complete event-driven architecture** for communication. Instead of calling methods directly or checking global variables, all interaction happens through DOM events. This provides loose coupling, making the component highly flexible and easy to integrate with any application.

**In this section:**
- [Quick Start](#quick-start-with-events) - Get started in 2 lines of code
- [How Events Work](#how-events-work) - Understanding the DOM Event API mechanics
- [Event Types](#event-types) - All supported events and their formats
- [Integration Patterns](#integration-patterns) - Real-world examples for different frameworks
- [Testing & Debugging](#event-debugging) - Tools for troubleshooting event flow

### Quick Start with Events

**Your client application dispatches these events to control the image-insert component:**

**Enable image editing:**
```javascript
document.dispatchEvent(new CustomEvent('editModeEnabled'));
```

**Disable image editing:**
```javascript
document.dispatchEvent(new CustomEvent('editModeDisabled'));
```

**That's it!** The image-insert component automatically receives these events and updates its behavior accordingly. Your application controls the component entirely through these event dispatches - no direct method calls or property access needed.

### Website Builder Integration Example

When used with the Website Builder:
1. User clicks the "Edit Mode" button in the control panel
2. Website Builder dispatches `editModeEnabled` event
3. Image-insert component receives the event and enables editing
4. Semantic elements show hover outlines 
5. Double-click functionality becomes active
6. When user clicks "Exit Edit", `editModeDisabled` is dispatched
7. Component disables editing and removes visual hints

### Architecture Philosophy

The event system is designed around these core principles:

1. **Loose Coupling**: Components communicate through events rather than direct method calls or property access
2. **Flexibility**: Multiple event formats are supported for compatibility with different systems
3. **Unidirectional Flow**: Clear data flow from external systems to the component
4. **Testability**: Events can be easily mocked and dispatched for testing
5. **Extensibility**: New event types can be added without breaking existing functionality

### Event Types

#### Primary Events

**`editModeEnabled`**
- **Purpose**: Notifies the component that edit mode has been activated
- **Payload**: None
- **Usage**: Simple on/off notification

```javascript
document.dispatchEvent(new CustomEvent('editModeEnabled'));
```

**`editModeDisabled`**
- **Purpose**: Notifies the component that edit mode has been deactivated
- **Payload**: None
- **Usage**: Simple on/off notification

```javascript
document.dispatchEvent(new CustomEvent('editModeDisabled'));
```

#### Generic Event

**`editModeChanged`**
- **Purpose**: Generic event that can handle both enable/disable with additional metadata
- **Payload**: `event.detail.enabled` (boolean), optional additional data
- **Usage**: When you need to pass additional context or prefer a single event type

```javascript
// Enable with context
document.dispatchEvent(new CustomEvent('editModeChanged', {
    detail: { 
        enabled: true, 
        source: 'websiteBuilder',
        timestamp: Date.now()
    }
}));

// Disable with context
document.dispatchEvent(new CustomEvent('editModeChanged', {
    detail: { 
        enabled: false, 
        reason: 'userAction',
        source: 'websiteBuilder'
    }
}));
```

#### Namespaced Events

**`wb:editModeOn`** / **`wb:editModeOff`**
- **Purpose**: Website Builder specific events for avoiding naming conflicts
- **Payload**: None
- **Usage**: When integrating with systems that might have conflicting event names

```javascript
// Website Builder specific events
document.dispatchEvent(new CustomEvent('wb:editModeOn'));
document.dispatchEvent(new CustomEvent('wb:editModeOff'));
```

### How Events Work

The event system is built on the native DOM Event API, specifically using `CustomEvent` and the `document` object as the event bus.

#### Core Mechanics

**1. Event Dispatching (Publisher)**
```javascript
// Any part of your application can dispatch an event
document.dispatchEvent(new CustomEvent('editModeEnabled'));
```

**2. Event Listening (Subscriber)**
```javascript
// The Image Insert component listens for events
document.addEventListener('editModeEnabled', function(event) {
    // Handle the event
    setEditMode(true);
});
```

**3. Event Propagation**
Events are dispatched on the `document` object, which means:
- They're globally accessible to any part of the application
- Multiple components can listen to the same event
- Events bubble up through the DOM hierarchy
- No direct references between components are needed

#### CustomEvent Structure

```javascript
// Basic event (no data)
const event = new CustomEvent('editModeEnabled');

// Event with data
const event = new CustomEvent('editModeChanged', {
    detail: {
        enabled: true,
        source: 'websiteBuilder',
        timestamp: Date.now()
    }
});

// Dispatching the event
document.dispatchEvent(event);
```

#### Event Lifecycle

1. **Creation**: `new CustomEvent()` creates an event object
2. **Dispatch**: `document.dispatchEvent()` sends the event into the DOM
3. **Propagation**: Event travels through the DOM tree
4. **Capture**: Registered listeners receive the event
5. **Handling**: Listener functions execute with event data
6. **Cleanup**: Event object is garbage collected

#### Synchronous vs Asynchronous

DOM events are **synchronous by default**:
```javascript
console.log('Before dispatch');
document.dispatchEvent(new CustomEvent('editModeEnabled'));
console.log('After dispatch'); // This runs AFTER all listeners complete
```

For asynchronous handling:
```javascript
// Defer to next tick
setTimeout(() => {
    document.dispatchEvent(new CustomEvent('editModeEnabled'));
}, 0);

// Or use Promise
Promise.resolve().then(() => {
    document.dispatchEvent(new CustomEvent('editModeEnabled'));
});
```

### Event Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Host System   │    │   Event Bus     │    │ Image Insert    │
│ (Website Builder)│    │   (document)    │    │   Component     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. User clicks        │                       │
         │    "Edit Mode"        │                       │
         │                       │                       │
         │ 2. toggleEditMode()   │                       │
         │                       │                       │
         │ 3. new CustomEvent()  │                       │
         │                       │                       │
         │ 4. dispatchEvent() ───┼──── editModeEnabled ──┤ 5. Event received
         │                       │                       │
         │                       │                       │ 6. handleEvent()
         │                       │                       │
         │                       │                       │ 7. setEditMode()
         │                       │                       │
         │                       │                       │ 8. updateUI()
         │ 9. Event complete ◄───┼───────────────────────┤
         │                       │                       │
```

#### Multiple Listeners

Multiple components can listen to the same event:

```javascript
// Component A
document.addEventListener('editModeEnabled', () => {
    console.log('Component A: Edit mode enabled');
});

// Component B  
document.addEventListener('editModeEnabled', () => {
    console.log('Component B: Edit mode enabled');
});

// When dispatched, BOTH listeners execute
document.dispatchEvent(new CustomEvent('editModeEnabled'));
// Output:
// Component A: Edit mode enabled
// Component B: Edit mode enabled
```

#### Event Data Access

Listeners receive the full event object:

```javascript
document.addEventListener('editModeChanged', function(event) {
    console.log('Event type:', event.type);           // 'editModeChanged'
    console.log('Event target:', event.target);       // document
    console.log('Event detail:', event.detail);       // { enabled: true, ... }
    console.log('Event timestamp:', event.timeStamp); // When event was created
});
```

#### Error Handling in Events

Events don't automatically handle errors between components:

```javascript
// If one listener throws, others still execute
document.addEventListener('editModeEnabled', () => {
    throw new Error('Something went wrong');
});

document.addEventListener('editModeEnabled', () => {
    console.log('This still runs despite the error above');
});

// Best practice: Handle errors within listeners
document.addEventListener('editModeEnabled', (event) => {
    try {
        setEditMode(true);
    } catch (error) {
        console.error('Failed to enable edit mode:', error);
    }
});
```

#### Event Timing and Order

Understanding when and in what order events execute is crucial:

**Registration Order Matters:**
```javascript
// These will execute in registration order
document.addEventListener('editModeEnabled', () => console.log('First'));
document.addEventListener('editModeEnabled', () => console.log('Second'));
document.addEventListener('editModeEnabled', () => console.log('Third'));

document.dispatchEvent(new CustomEvent('editModeEnabled'));
// Output: First, Second, Third
```

**Immediate vs Deferred Execution:**
```javascript
// Immediate (synchronous)
console.log('A');
document.dispatchEvent(new CustomEvent('editModeEnabled'));
console.log('B');
// Order: A, [all event listeners], B

// Deferred (asynchronous)
console.log('A');
setTimeout(() => document.dispatchEvent(new CustomEvent('editModeEnabled')), 0);
console.log('B');
// Order: A, B, [all event listeners]
```

**Event Removal:**
```javascript
// Store reference to remove later
function handleEditMode() {
    console.log('Edit mode changed');
}

document.addEventListener('editModeEnabled', handleEditMode);

// Later, remove the listener
document.removeEventListener('editModeEnabled', handleEditMode);
```

#### Memory Management

Proper cleanup prevents memory leaks:

```javascript
// Component lifecycle example
class MyComponent {
    constructor() {
        // Bind methods to maintain 'this' context
        this.handleEditMode = this.handleEditMode.bind(this);
        document.addEventListener('editModeEnabled', this.handleEditMode);
    }
    
    handleEditMode(event) {
        // Handle event with proper 'this' context
        this.updateState(event.detail);
    }
    
    destroy() {
        // Always clean up listeners
        document.removeEventListener('editModeEnabled', this.handleEditMode);
    }
}
```

### Event Handling Implementation

The component sets up event listeners during initialization:

```javascript
// Multiple event listeners for compatibility
document.addEventListener('editModeEnabled', handleEditModeEnabled);
document.addEventListener('editModeDisabled', handleEditModeDisabled);
document.addEventListener('editModeChanged', handleEditModeChanged);
document.addEventListener('wb:editModeOn', handleEditModeEnabled);
document.addEventListener('wb:editModeOff', handleEditModeDisabled);
```

### Internal State Management

The component maintains its own internal state to avoid external dependencies:

```javascript
let isEditModeEnabled = false; // Internal state

function setEditMode(enabled) {
    isEditModeEnabled = enabled;
    
    // Update all visual elements
    updateElementStates();
    
    // Close modal if edit mode disabled
    if (!enabled && isModalOpen()) {
        closeModal();
    }
    
    console.log(`Image Insert: Edit mode ${enabled ? 'enabled' : 'disabled'}`);
}
```

### Integration Patterns

#### Basic Integration

For simple on/off control:

```javascript
// Enable image editing
document.dispatchEvent(new CustomEvent('editModeEnabled'));

// Disable image editing
document.dispatchEvent(new CustomEvent('editModeDisabled'));
```

#### Advanced Integration

For applications that need to pass context:

```javascript
class MyApp {
    toggleEditMode() {
        this.editMode = !this.editMode;
        
        // Dispatch with full context
        document.dispatchEvent(new CustomEvent('editModeChanged', {
            detail: {
                enabled: this.editMode,
                source: 'myApp',
                user: this.currentUser,
                timestamp: Date.now(),
                permissions: this.getUserPermissions()
            }
        }));
    }
}
```

#### Framework Integration

**React Example:**
```javascript
function MyComponent() {
    const [editMode, setEditMode] = useState(false);
    
    useEffect(() => {
        const eventType = editMode ? 'editModeEnabled' : 'editModeDisabled';
        document.dispatchEvent(new CustomEvent(eventType));
    }, [editMode]);
    
    return <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Exit Edit' : 'Edit Mode'}
    </button>;
}
```

**Vue Example:**
```javascript
export default {
    data() {
        return { editMode: false };
    },
    watch: {
        editMode(newValue) {
            const eventType = newValue ? 'editModeEnabled' : 'editModeDisabled';
            document.dispatchEvent(new CustomEvent(eventType));
        }
    }
};
```

### Error Handling and Validation

The component includes built-in error handling for malformed events:

```javascript
function handleEditModeChanged(e) {
    // Validate event structure
    if (!e.detail || typeof e.detail.enabled !== 'boolean') {
        console.warn('ImageInsert: Invalid editModeChanged event format');
        return;
    }
    
    setEditMode(e.detail.enabled);
}
```

### Event Debugging

Enable debug mode to see all event activity:

```javascript
// Add this to image-insert.js for debugging
const DEBUG_EVENTS = true;

if (DEBUG_EVENTS) {
    ['editModeEnabled', 'editModeDisabled', 'editModeChanged', 'wb:editModeOn', 'wb:editModeOff']
        .forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                console.log(`[ImageInsert Debug] Received ${eventType}:`, e.detail || 'no detail');
            });
        });
}
```

### Custom Event Extensions

You can extend the system with your own events:

```javascript
// Custom permission-based events
document.addEventListener('imageEditPermissionGranted', () => {
    ImageInsert.setEditMode(true);
});

document.addEventListener('imageEditPermissionRevoked', () => {
    ImageInsert.setEditMode(false);
});

// Dispatch from your permission system
function updateUserPermissions(permissions) {
    const canEdit = permissions.includes('edit_images');
    const eventType = canEdit ? 'imageEditPermissionGranted' : 'imageEditPermissionRevoked';
    document.dispatchEvent(new CustomEvent(eventType, {
        detail: { permissions, user: getCurrentUser() }
    }));
}
```

### Performance Considerations

The event system is designed for optimal performance:

1. **Event Delegation**: Single listeners handle all events of each type
2. **Efficient State Management**: Internal state prevents unnecessary DOM queries
3. **Debouncing**: Rapid state changes are handled efficiently
4. **Memory Management**: Event listeners are properly cleaned up

### Testing the Event System

```javascript
// Unit test example
describe('ImageInsert Event System', () => {
    beforeEach(() => {
        // Reset component state
        ImageInsert.setEditMode(false);
    });
    
    it('should enable edit mode on editModeEnabled event', () => {
        document.dispatchEvent(new CustomEvent('editModeEnabled'));
        expect(isEditModeActive()).toBe(true);
    });
    
    it('should handle editModeChanged event with detail', () => {
        document.dispatchEvent(new CustomEvent('editModeChanged', {
            detail: { enabled: true, source: 'test' }
        }));
        expect(isEditModeActive()).toBe(true);
    });
});
```

### Basic Usage

Once included, the component automatically initializes and attaches to all semantic elements. No additional JavaScript code is required.

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="image-insert.css">
</head>
<body>
    <header>
        <h1>My Website Header</h1>
        <p>Double-click to add an image here</p>
    </header>
    
    <main>
        <h2>Main Content</h2>
        <p>Double-click anywhere in this section to add images</p>
    </main>
    
    <script src="image-insert.js"></script>
</body>
</html>
```

### User Interaction Flow

1. **Adding an Image**:
   - Double-click any semantic element
   - Modal appears with image upload interface
   - Click "Add Image" or drag an image file
   - Adjust size and position as needed
   - Click "Done" to insert

2. **Editing an Existing Image**:
   - Double-click an element containing an image
   - Modal shows current image with controls
   - Modify size, position, or replace image
   - Click "Done" to save changes

3. **Removing an Image**:
   - Double-click element with image
   - Click "Remove Image" button
   - Click "Done" to confirm

## API Reference

### Global Object

The component exposes a global `ImageInsert` object with the following methods:

#### `ImageInsert.close()`
Closes the currently open image edit modal.

```javascript
// Close modal programmatically
ImageInsert.close();
```

#### `ImageInsert.removeImage()`
Removes the currently selected image from the active element.

```javascript
// Remove image from current element
ImageInsert.removeImage();
```

#### `ImageInsert.setEditMode(enabled)`
Sets the edit mode state programmatically.

```javascript
// Enable edit mode
ImageInsert.setEditMode(true);

// Disable edit mode
ImageInsert.setEditMode(false);
```

#### `ImageInsert.enable()`
Shorthand for enabling edit mode.

```javascript
ImageInsert.enable();
```

#### `ImageInsert.disable()`
Shorthand for disabling edit mode.

```javascript
ImageInsert.disable();
```

### Events

The component doesn't emit custom events but responds to native DOM events:

- `dblclick` - Opens image editor
- `mouseenter/mouseleave` - Shows/hides hover hints
- `change` - Handles file selection
- `input` - Updates size controls
- `click` - Various button actions
- `keydown` - ESC key to close modal

## Configuration

### Supported Elements

By default, the component attaches to these semantic elements:
- `<header>`
- `<nav>`
- `<main>`
- `<article>`
- `<section>`
- `<aside>`
- `<figure>`
- `<footer>`

### Image Constraints

- **File Types**: All image/* MIME types (jpg, png, gif, svg, webp, etc.)
- **Max File Size**: 5MB
- **Size Range**: 50px to 1200px (width/height)

### Position Options

Images can be positioned relative to the element's content:
- **Bottom** (default): Image appears after content
- **Top**: Image appears before content
- **Left**: Image and content side-by-side, image on left
- **Right**: Image and content side-by-side, image on right

## Styling

### CSS Variables

The component uses CSS variables for theming:

```css
:root {
    /* Background Colors */
    --bg-primary: #1a1a1a;
    --bg-secondary: #2a2a2a;
    --bg-modal: #2a2a2a;
    --bg-input: #1a1a1a;
    
    /* Text Colors */
    --text-primary: #e0e0e0;
    --text-secondary: #999;
    --text-white: white;
    
    /* Border Colors */
    --border-primary: #404040;
    --border-secondary: #555;
    
    /* Accent Colors */
    --accent-primary: #6200ee;
    --accent-primary-hover: #4a00b8;
    
    /* Overlay */
    --overlay: rgba(0, 0, 0, 0.5);
}
```

### Custom Styling

Override component styles by targeting specific classes:

```css
/* Customize modal appearance */
.image-insert-modal {
    background: white;
    border-radius: 12px;
}

/* Customize hover effect */
.semantic-element:hover {
    border-color: #00ff00;
}

/* Customize inserted images */
.inserted-image {
    border: 2px solid #ccc;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Dark Mode Support

The component automatically adapts to dark themes:

```css
/* Your dark theme */
body[data-theme="dark"] {
    --bg-primary: #000;
    --text-primary: #fff;
}

/* Component will inherit these values */
```

## Technical Details

### Event-Driven Architecture

The component implements a sophisticated event-driven architecture (detailed in the [Event System](#event-system) section) for maximum flexibility and loose coupling:

**Core Benefits:**
- **Decoupled**: No direct dependencies on global objects or specific implementations
- **Flexible**: Works with any system that dispatches the supported events
- **Maintainable**: Easy to integrate without modifying existing code
- **Testable**: Can be tested in isolation by dispatching events
- **Extensible**: New event types can be added without breaking existing functionality

**Event Communication Flow:**
```
External System → CustomEvent → Document → ImageInsert Component → Internal State → UI Update
```

**Key Event Types:**
- `editModeEnabled` / `editModeDisabled` - Simple on/off control
- `editModeChanged` - Generic event with metadata support
- `wb:editModeOn` / `wb:editModeOff` - Namespaced variants for conflict avoidance

This design allows for complete integration flexibility while maintaining component isolation.

### Architecture

The component follows a modular, self-contained architecture:

```
ImageInsert Component
├── Initialization (IIFE)
├── Modal Creation
├── Event Listeners
│   ├── Double-click Handler
│   ├── File Input Handler
│   ├── Size Controls Handler
│   └── Drag Handler
├── Content Management
│   ├── Image Insertion
│   ├── Position Logic
│   └── DOM Manipulation
└── Global API
```

### State Management

Internal state is managed through closure variables:
- `currentElement`: Currently editing element
- `selectedImage`: Selected image data
- `modalElement`: Modal DOM reference
- `dragState`: Modal drag position

### DOM Structure

The component creates this DOM structure:

```html
<div id="imageInsertOverlay" class="image-insert-overlay">
    <div class="image-insert-modal">
        <div class="image-insert-header">
            <h3 class="image-insert-title">Edit [ELEMENT] Image</h3>
            <button class="image-insert-close">×</button>
        </div>
        <div class="image-upload-section">
            <!-- Upload controls -->
        </div>
        <div class="edit-actions">
            <button class="btn btn-primary">Done</button>
        </div>
    </div>
</div>
```

### Image Storage

Images are stored as data URLs (base64) directly in the HTML:
```html
<img src="data:image/jpeg;base64,..." class="inserted-image">
```

## Browser Support

### Supported Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Required Features
- ES6 (const, let, arrow functions)
- FileReader API
- Data URLs
- CSS Variables
- Flexbox

### Polyfills

No polyfills are required for modern browsers. For legacy support, consider:
- ES6 polyfills
- CSS Variables ponyfill

## Troubleshooting

### Common Issues

#### 1. Modal Doesn't Appear
**Problem**: Double-clicking doesn't open the modal
**Solutions**:
- Ensure JavaScript file is loaded
- Check browser console for errors
- Verify element is a semantic HTML element
- Confirm no other scripts are preventing event propagation

#### 2. Images Don't Save
**Problem**: Images disappear after page reload
**Solutions**:
- Images are stored in DOM only
- Implement server-side storage for persistence
- Use localStorage for temporary persistence

#### 3. Styling Conflicts
**Problem**: Component looks broken
**Solutions**:
- Check for CSS conflicts
- Ensure CSS file is loaded
- Verify CSS variable definitions
- Use more specific selectors

#### 4. Performance Issues
**Problem**: Large images cause lag
**Solutions**:
- Compress images before upload
- Implement image optimization
- Set reasonable size limits
- Consider lazy loading for multiple images

### Debug Mode

Enable console logging by modifying initialization:

```javascript
// In image-insert.js
console.log('Image Insert Debug Mode Enabled');
// Add more console.log statements as needed
```

## Examples

### Example 1: Basic Blog Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog with Image Insert</title>
    <link rel="stylesheet" href="image-insert.css">
</head>
<body>
    <header>
        <h1>My Blog</h1>
        <p>Travel & Photography</p>
    </header>
    
    <main>
        <article>
            <h2>My Latest Adventure</h2>
            <p>Double-click to add photos from your trip...</p>
        </article>
        
        <aside>
            <h3>About Me</h3>
            <p>Double-click to add your profile picture...</p>
        </aside>
    </main>
    
    <footer>
        <p>© 2024 My Blog</p>
    </footer>
    
    <script src="image-insert.js"></script>
</body>
</html>
```

### Example 2: Custom Styling

```css
/* Custom theme for image insert */
:root {
    --accent-primary: #e91e63;
    --bg-modal: #ffffff;
    --text-primary: #333333;
}

/* Round images */
.inserted-image {
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.inserted-image:hover {
    transform: scale(1.05);
}

/* Custom modal styling */
.image-insert-modal {
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    border: none;
}
```

### Example 3: Integration with Save System

```javascript
// Save all images to localStorage
function saveImages() {
    const images = [];
    document.querySelectorAll('.inserted-image').forEach((img, index) => {
        images.push({
            parent: img.parentElement.tagName,
            index: index,
            src: img.src,
            alt: img.alt,
            style: img.getAttribute('style')
        });
    });
    localStorage.setItem('savedImages', JSON.stringify(images));
}

// Restore images on load
function restoreImages() {
    const saved = localStorage.getItem('savedImages');
    if (saved) {
        const images = JSON.parse(saved);
        images.forEach(data => {
            const elements = document.getElementsByTagName(data.parent);
            if (elements[data.index]) {
                const img = document.createElement('img');
                img.src = data.src;
                img.alt = data.alt;
                img.className = 'inserted-image';
                if (data.style) img.setAttribute('style', data.style);
                elements[data.index].appendChild(img);
            }
        });
    }
}
```

### Example 4: Programmatic Control

```javascript
// Disable image editing on certain elements
document.querySelectorAll('.no-edit').forEach(el => {
    el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });
});

// Add image programmatically
function addImageToElement(element, imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'inserted-image';
    element.appendChild(img);
}

// Remove all images
function removeAllImages() {
    document.querySelectorAll('.inserted-image').forEach(img => {
        img.remove();
    });
}
```

## Best Practices

### Performance
1. Compress images before uploading
2. Use appropriate image formats (JPEG for photos, PNG for graphics)
3. Set reasonable size limits based on use case
4. Consider lazy loading for image-heavy pages

### Accessibility
1. Always provide meaningful alt text
2. Ensure modal can be closed with keyboard (ESC)
3. Maintain focus management
4. Provide visual feedback for all interactions

### Security
1. Validate file types on server if saving
2. Sanitize file names
3. Implement file size limits
4. Consider CSP headers for data URLs

### User Experience
1. Provide clear visual hints
2. Show upload progress for large files
3. Maintain image aspect ratios
4. Allow undo/redo functionality

## Future Enhancements

Potential improvements for future versions:

1. **Image Editing**
   - Crop functionality
   - Rotate options
   - Filter effects
   - Brightness/contrast adjustment

2. **Advanced Features**
   - Drag-and-drop file upload
   - Multiple image selection
   - Image gallery mode
   - URL input option

3. **Integration**
   - Server upload endpoint
   - Cloud storage integration
   - CDN optimization
   - WordPress/CMS plugins

4. **Performance**
   - WebP format support
   - Automatic compression
   - Progressive loading
   - Thumbnail generation

## License

This component is part of the Website Builder project. Please refer to the main project license for usage terms.

## Support

For issues, feature requests, or contributions:
1. Check existing documentation
2. Review troubleshooting guide
3. Submit issues to the project repository
4. Include browser info and steps to reproduce

---

Last Updated: 2024
Version: 1.0.0