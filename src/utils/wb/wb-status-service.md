# WB Status Service Documentation

## Overview

`WBStatusService` is a centralized status messaging and file import utility for the Website Builder platform. It provides a unified interface for displaying status messages, handling file imports, and managing status bar functionality with automatic wb-status component integration.

## Features

- **Centralized Status Management**: Single point of control for all status messages
- **File Import Handling**: Complete file import workflow with validation and error handling
- **Component Integration**: Seamless integration with wb-status component
- **Auto-timeout Support**: Optional automatic message clearing
- **Edit Mode Integration**: Status updates for edit mode changes
- **Event System**: Custom events for status changes and file operations
- **Error Recovery**: Graceful degradation when status elements are unavailable

## Core Features

### Status Message Management

The service provides different message types with appropriate styling and behavior:

- **Info**: General information messages (blue theme)
- **Success**: Confirmation messages (green theme)  
- **Warning**: Cautionary messages (yellow/orange theme)
- **Error**: Error and failure messages (red theme)

### File Import System

Complete file handling workflow including:

- **File Validation**: Type, size, and format checking
- **Content Processing**: HTML parsing and integration
- **Backup Creation**: Automatic content backup before imports
- **Error Handling**: Comprehensive error reporting and recovery

## API Reference

### Initialization

The service auto-initializes when the DOM is ready:

```javascript
// Manual initialization (usually not needed)
StatusService.init();

// Check if initialized
if (StatusService.getStatus().initialized) {
    console.log('Status service is ready');
}
```

### Status Message Methods

#### `updateStatus(message, type, timeout)`

Update the status display with a new message.

```javascript
// Basic status update
StatusService.updateStatus('Component loaded successfully', 'success');

// Status with custom timeout
StatusService.updateStatus('Processing...', 'info', 3000);

// Error message
StatusService.updateStatus('Failed to save changes', 'error');

// Warning message
StatusService.updateStatus('Unsaved changes detected', 'warning');
```

**Parameters:**
- `message` (string): The status message to display
- `type` (string): Message type - 'info', 'success', 'warning', 'error'
- `timeout` (number, optional): Auto-clear timeout in milliseconds

#### `clearStatus()`

Clear the current status message and reset to default state.

```javascript
// Clear current status
StatusService.clearStatus();
// Status will show "Ready" with info styling
```

#### `getStatus()`

Get current status information.

```javascript
const currentStatus = StatusService.getStatus();
console.log(`Current message: ${currentStatus.message}`);
console.log(`Message type: ${currentStatus.type}`);
console.log(`Service initialized: ${currentStatus.initialized}`);
```

### Edit Mode Integration

#### `updateEditModeStatus(isEnabled)`

Update edit mode indicator in status bar.

```javascript
// Enable edit mode indicator
StatusService.updateEditModeStatus(true);
// Shows: "Edit mode: ON"

// Disable edit mode indicator  
StatusService.updateEditModeStatus(false);
// Shows: "Edit mode: OFF"
```

**Auto-Integration:**
The service automatically listens for `editModeChanged` events:

```javascript
// Dispatch edit mode change (automatically handled)
document.dispatchEvent(new CustomEvent('editModeChanged', {
    detail: { enabled: true }
}));
```

### File Import System

#### `handleFileImport(file)`

Process file import with full validation and error handling.

```javascript
// Handle file import (usually triggered by file input)
const fileInput = document.getElementById('import-input');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        StatusService.handleFileImport(file);
    }
});

// Programmatic file import
async function importFromFile(file) {
    try {
        await StatusService.handleFileImport(file);
        console.log('Import completed successfully');
    } catch (error) {
        console.error('Import failed:', error);
    }
}
```

**File Validation:**
- **Type Checking**: Validates HTML file extensions (.html, .htm)
- **Size Limits**: 10MB maximum file size
- **Content Validation**: Ensures non-empty content

#### `readFileAsText(file)`

Read file content as text (Promise-based FileReader).

```javascript
// Read file content
try {
    const content = await StatusService.readFileAsText(file);
    console.log('File content:', content);
} catch (error) {
    console.error('Failed to read file:', error);
}
```

#### `processImportedHTML(htmlContent, filename)`

Process and integrate imported HTML content.

```javascript
// Process HTML content
try {
    await StatusService.processImportedHTML(htmlContent, 'imported-page.html');
    console.log('HTML content integrated successfully');
} catch (error) {
    console.error('Failed to process HTML:', error);
}
```

**Content Integration:**
- **Container Detection**: Looks for main content containers
- **Backup Creation**: Backs up current content before replacement
- **Event Dispatch**: Fires `contentImported` event on success

### Configuration

#### `configure(options)`

Configure service behavior and options.

```javascript
// Configure status service
StatusService.configure({
    defaultTimeout: 3000,        // Auto-clear timeout
    enableAutoTimeout: true,     // Enable auto-clearing
    enableConsoleLogging: false, // Disable console logs
    validStatusTypes: ['info', 'success', 'warning', 'error', 'debug']
});
```

**Configuration Options:**
- `defaultTimeout` (number): Default auto-clear timeout in milliseconds
- `enableAutoTimeout` (boolean): Enable automatic message clearing
- `enableConsoleLogging` (boolean): Enable console logging
- `validStatusTypes` (array): Valid message types

#### Timeout Management

```javascript
// Enable auto-timeout with custom duration
StatusService.enableAutoTimeout(5000); // 5 second timeout

// Disable auto-timeout
StatusService.disableAutoTimeout();
```

## Component Integration

### wb-status Component

The service automatically detects and integrates with wb-status components:

```html
<!-- wb-status component integration -->
<wb-status id="main-status-bar"></wb-status>
```

```javascript
// Automatically uses wb-status if available
StatusService.updateStatus('Component loaded', 'success');
// Message appears in wb-status component
```

### Fallback Elements

For pages without wb-status, the service works with traditional elements:

```html
<!-- Traditional status elements -->
<div id="status-message" class="status-display"></div>
<div id="status-info" class="edit-mode-indicator"></div>
<div id="status-actions">
    <button id="import-btn">Import HTML</button>
    <input type="file" id="import-html-input" accept=".html,.htm" style="display: none;">
</div>
```

## Event System

### Dispatched Events

The service dispatches custom events for integration:

```javascript
// Listen for status updates
document.addEventListener('statusUpdated', (event) => {
    const { message, type, timestamp } = event.detail;
    console.log(`Status updated: [${type}] ${message}`);
});

// Listen for content imports
document.addEventListener('contentImported', (event) => {
    const { filename, timestamp } = event.detail;
    console.log(`Content imported from: ${filename}`);
    
    // Trigger any necessary updates
    updateComponentsAfterImport();
});

// Listen for edit mode changes (auto-handled)
document.addEventListener('editModeChanged', (event) => {
    const { enabled } = event.detail;
    // Service automatically updates status
});
```

### Event Details

**statusUpdated Event:**
```javascript
{
    message: "Component loaded successfully",
    type: "success", 
    timestamp: 1634567890123
}
```

**contentImported Event:**
```javascript
{
    filename: "imported-page.html",
    timestamp: 1634567890123
}
```

## Usage Examples

### Basic Status Updates

```javascript
// Show loading state
StatusService.updateStatus('Loading components...', 'info');

// Simulate async operation
setTimeout(() => {
    StatusService.updateStatus('All components loaded successfully', 'success', 3000);
}, 2000);

// Handle errors
try {
    await riskyOperation();
    StatusService.updateStatus('Operation completed', 'success');
} catch (error) {
    StatusService.updateStatus(`Operation failed: ${error.message}`, 'error');
}
```

### File Import Integration

```javascript
// Set up file import button
function setupFileImport() {
    const importBtn = document.getElementById('import-btn');
    const fileInput = document.getElementById('import-html-input');
    
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            await StatusService.handleFileImport(file);
            // Success status is automatically shown by service
        } catch (error) {
            // Error status is automatically shown by service
            console.error('Import error:', error);
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', setupFileImport);
```

### Edit Mode Integration

```javascript
// Edit mode toggle with status updates
function toggleEditMode() {
    const isEnabled = !document.body.classList.contains('edit-mode');
    
    document.body.classList.toggle('edit-mode', isEnabled);
    
    // Dispatch event - status service handles automatically
    document.dispatchEvent(new CustomEvent('editModeChanged', {
        detail: { enabled: isEnabled }
    }));
    
    // Optional: Additional status message
    if (isEnabled) {
        StatusService.updateStatus('Edit mode enabled - Click elements to edit', 'info', 5000);
    } else {
        StatusService.updateStatus('Edit mode disabled', 'info', 2000);
    }
}
```

### Component Lifecycle Integration

```javascript
// Component loading workflow
async function loadComponent(componentName) {
    StatusService.updateStatus(`Loading ${componentName}...`, 'info');
    
    try {
        // Simulate component loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if component loaded successfully
        if (customElements.get(componentName)) {
            StatusService.updateStatus(`${componentName} loaded successfully`, 'success', 3000);
            return true;
        } else {
            throw new Error('Component registration failed');
        }
    } catch (error) {
        StatusService.updateStatus(`Failed to load ${componentName}: ${error.message}`, 'error');
        return false;
    }
}

// Batch component loading
async function loadAllComponents() {
    const components = ['wb-button', 'wb-input', 'wb-modal'];
    const results = await Promise.allSettled(
        components.map(component => loadComponent(component))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    StatusService.updateStatus(
        `Loaded ${successful}/${components.length} components`, 
        successful === components.length ? 'success' : 'warning'
    );
}
```

## Advanced Configuration

### Custom Status Types

```javascript
// Extend valid status types
StatusService.configure({
    validStatusTypes: ['info', 'success', 'warning', 'error', 'debug', 'progress']
});

// Use custom type
StatusService.updateStatus('Debug information', 'debug');
```

### Content Import Customization

```javascript
// Override content processing
const originalProcess = StatusService.processImportedHTML;
StatusService.processImportedHTML = async function(htmlContent, filename) {
    // Custom preprocessing
    const processedContent = preprocessHTML(htmlContent);
    
    // Call original processing
    return originalProcess.call(this, processedContent, filename);
};

function preprocessHTML(html) {
    // Remove unwanted elements
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove scripts for security
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    return tempDiv.innerHTML;
}
```

### Storage Integration

```javascript
// Save status history
const statusHistory = [];

document.addEventListener('statusUpdated', (event) => {
    statusHistory.push({
        ...event.detail,
        id: Date.now()
    });
    
    // Keep only last 50 status messages
    if (statusHistory.length > 50) {
        statusHistory.shift();
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('wb-status-history', JSON.stringify(statusHistory));
    } catch (error) {
        console.warn('Failed to save status history:', error);
    }
});

// Load status history on page load
function loadStatusHistory() {
    try {
        const saved = localStorage.getItem('wb-status-history');
        if (saved) {
            const history = JSON.parse(saved);
            console.log(`Loaded ${history.length} previous status messages`);
            return history;
        }
    } catch (error) {
        console.warn('Failed to load status history:', error);
    }
    return [];
}
```

## Global Functions

For backwards compatibility, the service provides global functions:

```javascript
// Global status update function
updateStatus('Page loaded', 'success');

// Global file import function
handleFileImport(file);

// Access full service
const service = window.StatusService;
service.configure({ enableAutoTimeout: true });
```

## Error Handling

### Graceful Degradation

```javascript
// Service works even without status elements
if (!document.getElementById('status-message')) {
    console.log('Status display not available - messages logged to console');
}

// Always safe to call
StatusService.updateStatus('This works regardless of available elements', 'info');
```

### Import Error Recovery

```javascript
// Restore content on import failure
document.addEventListener('contentImported', () => {
    // Success - clear any backups older than 24 hours
    cleanupOldBackups();
});

// Handle import errors
StatusService.handleFileImport = (function(originalMethod) {
    return async function(file) {
        try {
            return await originalMethod.call(this, file);
        } catch (error) {
            // Restore from backup if available
            restoreFromBackup();
            throw error;
        }
    };
})(StatusService.handleFileImport);

function restoreFromBackup() {
    try {
        const backup = sessionStorage.getItem('wb-content-backup');
        if (backup) {
            const { content } = JSON.parse(backup);
            const container = document.getElementById('site-container');
            if (container && content) {
                container.innerHTML = content;
                StatusService.updateStatus('Content restored from backup', 'info');
            }
        }
    } catch (error) {
        console.error('Failed to restore from backup:', error);
    }
}
```

## Browser Support

- **Modern Browsers**: ES6+ features required
- **File API**: FileReader support needed for imports
- **Storage API**: localStorage and sessionStorage
- **DOM Events**: CustomEvent support
- **Promises**: async/await support

## Related Documentation

- [WB Component Base](wb-component-base.md)
- [WB Component Utils](wb-component-utils.md)
- [WB Component Registry](wb-component-registry.md)
- [wb-status Component](../../components/wb-status/wb-status.md)