# WB Status Component

The WB Status component provides a persistent status bar for displaying events, notifications, and current application settings. It features intelligent event queuing, duplicate detection, and seamless integration with the Website Builder control panel.

## Features

- **Event Management**: Queue-based event system with type-based styling
- **Smart Duplicate Detection**: Prevents showing the same message repeatedly
- **Color Event Grouping**: Intelligently groups related color change events
- **Real-time Settings Display**: Shows current application state
- **Customizable Positioning**: Bottom or top placement options
- **Dark Mode Support**: Automatic theme adaptation
- **CSS Override Support**: Easy custom styling while maintaining functionality
- **Event Types**: Info, success, warning, and error messages

## Basic Usage

### HTML

```html
<!-- Basic status bar -->
<div id="status-container"></div>

<script>
    // Create and append status bar
    const statusBar = WBStatus.create();
    document.getElementById('status-container').appendChild(statusBar);
</script>
```

### JavaScript API

```javascript
// Create status bar with options
const statusBar = WBStatus.create({
    position: 'sticky',  // 'sticky', 'top', or custom
    displayTime: 3000    // How long to show each event
});

// Add events
WBStatus.addEvent('Operation completed', 'success');
WBStatus.addEvent('Warning: Check your settings', 'warning');
WBStatus.addEvent('Error: Connection failed', 'error');
WBStatus.addEvent('Information updated', 'info');

// Update settings display
WBStatus.updateSetting('theme', 'dark');
WBStatus.updateSetting('layout', 'grid');
WBStatus.updateSetting('primary', '#6366f1');
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | string | 'sticky' | Status bar position: 'sticky', 'top', or custom |
| `displayTime` | number | 3000 | How long each event is displayed (ms) |
| `maxEvents` | number | 50 | Maximum events in queue before auto-cleanup |
| `preventDuplicates` | boolean | true | Prevent showing duplicate messages |
| `groupColorEvents` | boolean | true | Group related color change events |

## Event Types

### Info Events (Default)
```javascript
WBStatus.addEvent('Information message');
// or explicitly
WBStatus.addEvent('Information message', 'info');
```

### Success Events
```javascript
WBStatus.addEvent('Operation completed successfully', 'success');
```

### Warning Events
```javascript
WBStatus.addEvent('Please review your settings', 'warning');
```

### Error Events
```javascript
WBStatus.addEvent('Connection failed', 'error');
// High priority error
WBStatus.addEvent('Critical error', 'error', { priority: 10 });
```

## API Methods

### WBStatus.create(options)
Creates a new status bar instance.

```javascript
const statusBar = WBStatus.create({
    position: 'sticky',
    displayTime: 3000
});
```

### WBStatus.addEvent(message, type, options)
Adds an event to the status bar queue.

```javascript
WBStatus.addEvent('Message', 'success', {
    priority: 5,        // Higher priority events show first
    persistent: false   // Event won't be automatically cleared
});
```

### WBStatus.updateSetting(key, value, isError)
Updates the settings display.

```javascript
WBStatus.updateSetting('theme', 'dark');
WBStatus.updateSetting('connection', 'ERROR', true); // Error state
```

### WBStatus.clearEvents()
Clears all events from the queue.

```javascript
WBStatus.clearEvents();
```

### WBStatus.show() / WBStatus.hide()
Show or hide the status bar.

```javascript
WBStatus.hide();
// Later...
WBStatus.show();
```

## Events

The component dispatches these events:

### wbStatusReady
Fired when the component is initialized.

```javascript
document.addEventListener('wbStatusReady', () => {
    console.log('Status bar ready');
});
```

### wbStatusEventAdded
Fired when an event is added to the queue.

```javascript
document.addEventListener('wbStatusEventAdded', (e) => {
    console.log('Event added:', e.detail);
});
```

### wbStatusEventShown
Fired when an event is displayed.

```javascript
document.addEventListener('wbStatusEventShown', (e) => {
    console.log('Event shown:', e.detail);
});
```

### wbStatusSettingUpdated
Fired when a setting is updated.

```javascript
document.addEventListener('wbStatusSettingUpdated', (e) => {
    console.log('Setting updated:', e.detail);
});
```

## Custom Styling

The component uses CSS classes that can be overridden:

```css
/* Custom status bar style */
.wb-status-bar--custom {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
    height: 2rem !important;
}

.wb-status-bar--custom .wb-status-event {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px);
}

.wb-status-bar--custom .wb-status-event--success {
    background: rgba(34, 197, 94, 0.3) !important;
    border-color: rgba(34, 197, 94, 0.5) !important;
}
```

## Control Panel Integration

The status bar automatically integrates with the Website Builder control panel:

1. **Color Changes**: Receives and displays color change events
2. **Theme Updates**: Adapts to theme changes automatically
3. **Settings Sync**: Can display current control panel settings
4. **Event Broadcasting**: Control panel actions generate status events

## Smart Features

### Duplicate Detection
Prevents the same message from appearing multiple times in succession:

```javascript
WBStatus.addEvent('Saved'); // Shows
WBStatus.addEvent('Saved'); // Ignored
WBStatus.addEvent('Saved'); // Ignored
```

### Color Event Grouping
Groups rapid color changes into a single event:

```javascript
// These events...
WBStatus.addEvent('Hue changed to 240°');
WBStatus.addEvent('Saturation adjusted to 80%');
WBStatus.addEvent('Lightness modified to 60%');

// Become: "Color adjustments: Hue, Saturation, Lightness"
```

### Event Prioritization
Higher priority events jump the queue:

```javascript
WBStatus.addEvent('Normal event', 'info');
WBStatus.addEvent('URGENT!', 'error', { priority: 10 });
// URGENT! shows first
```

## Examples

### Basic Status Bar
```javascript
// Create and initialize
const statusBar = WBStatus.create();
document.body.appendChild(statusBar);

// Add some events
WBStatus.addEvent('Application loaded', 'success');
WBStatus.updateSetting('status', 'ready');
```

### Custom Positioned Status Bar
```javascript
// Top-positioned status bar
const topStatus = WBStatus.create({ position: 'top' });
topStatus.classList.add('wb-status--top');
document.body.insertBefore(topStatus, document.body.firstChild);
```

### Integration with Application
```javascript
// Save operation
async function saveDocument() {
    try {
        WBStatus.updateSetting('status', 'saving...');
        await save();
        WBStatus.addEvent('Document saved successfully', 'success');
        WBStatus.updateSetting('status', 'ready');
    } catch (error) {
        WBStatus.addEvent('Failed to save document', 'error');
        WBStatus.updateSetting('status', 'error', true);
    }
}
```

### Multiple Status Bars
```javascript
// Create two independent status bars
const mainStatus = WBStatus.create();
const debugStatus = WBStatus.create();
debugStatus.classList.add('debug-status');

// They can show different information
mainStatus._wbStatusManager.addEvent('User notification', 'info');
debugStatus._wbStatusManager.addEvent('Debug: API called', 'info');
```

## Best Practices

1. **Use Appropriate Event Types**: Match the event type to the message importance
2. **Keep Messages Concise**: Status bar space is limited
3. **Update Settings Meaningfully**: Only show relevant application state
4. **Handle Errors Gracefully**: Use error events for user-facing issues
5. **Avoid Event Spam**: Use the duplicate detection feature
6. **Test Custom Styles**: Ensure custom CSS doesn't break functionality

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design adapts to smaller screens