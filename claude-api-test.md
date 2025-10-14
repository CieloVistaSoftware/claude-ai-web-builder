# Claude API Test Client Documentation

## Overview

The Claude API Test Client (`claude-api-test.html`) is a comprehensive web-based testing interface for the Claude Events API. It provides a user-friendly way to test all API endpoints that AI assistants use to access and manage claude.md event logs across the Website Builder project.

## Features

- **Complete API Testing**: Test all available endpoints with real-time responses
- **Dark/Light Theme**: Toggleable theme with persistent storage
- **Responsive Design**: Mobile-friendly interface with adaptive layout
- **Real-time Status**: Live API server status monitoring
- **Form Validation**: Input validation and error handling
- **JSON Formatting**: Pretty-printed API responses
- **Error Highlighting**: Visual indicators for different response types

## Interface Components

### Header Section
- **Title and Branding**: Clear identification of the test client
- **Theme Toggle**: Switch between dark and light modes
- **API Status Indicator**: Real-time server connection status
- **Description**: Context about API functionality

### API Testing Sections

#### 1. Health Check (`GET /api/health`)
Test basic API connectivity and get server information.

```javascript
// Expected Response
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z", 
  "uptime": 1234,
  "endpoints": [
    "GET /api/events/:directory",
    "GET /api/events", 
    "GET /api/errors",
    "GET /api/recent/:hours",
    "POST /api/save-claude-log"
  ]
}
```

#### 2. All Events (`GET /api/events`)
Retrieve all events from all claude.md files in the project.

```javascript
// Expected Response Structure
{
  "totalFiles": 15,
  "totalEvents": 87,
  "files": [
    {
      "directory": "./components/wb-button",
      "filePath": "./components/wb-button/claude.md",
      "events": [...],
      "eventCount": 5,
      "lastModified": "2025-01-15T09:15:00.000Z",
      "size": 2048
    }
  ]
}
```

#### 3. Error Events (`GET /api/errors`)
Get only error-level events across all files.

**Filtering Criteria:**
- `event.type === 'error'`
- `event.level === 'error'`
- Message contains "error" (case-insensitive)
- Content contains "error" (case-insensitive)

#### 4. Recent Events (`GET /api/recent/:hours`)
Get events from the last N hours with configurable time range.

**Features:**
- Input field for hours (1-168 hours)
- Default: 24 hours
- Filters events by timestamp

#### 5. Directory Events (`GET /api/events/dir?path=directory`)
Get events from a specific directory's claude.md file.

**Features:**
- Text input for directory path
- Default: `components/wb-color-picker`
- URL encoding for special characters

#### 6. Save Event Log (`POST /api/save-claude-log`)
Save new content to claude.md files.

**Request Body:**
```javascript
{
  "filename": "claude.md",
  "content": "## New Event...",
  "folder": "components/wb-button",
  "referer": "http://localhost:3000/claude-api-test.html"
}
```

**Features:**
- Directory input field
- Large textarea for content
- Pre-filled with template content
- Automatic timestamp generation

## Theme System

### CSS Variables
The interface uses CSS custom properties for consistent theming:

```css
/* Light Theme (Default) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-accent: #667eea;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-accent: #4a5568;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #404040;
}
```

### Theme Persistence
Theme preference is stored in localStorage:

```javascript
// Save theme preference
localStorage.setItem('wb-theme', 'dark');

// Load saved theme on page load
const isDark = localStorage.getItem('wb-theme') === 'dark';
```

## JavaScript Functionality

### Core Functions

#### `checkApiStatus()`
Monitors API server availability and updates status indicator.

```javascript
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        if (response.ok) {
            // Show success status
            statusEl.className = 'status success';
        }
    } catch (error) {
        // Show error with instructions
        statusEl.className = 'status error';
    }
}
```

#### `testEndpoint(endpoint, options)`
Generic function for testing any API endpoint.

```javascript
async function testEndpoint(endpoint, options = {}) {
    // Show loading state
    body.classList.add('loading');
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        
        // Format and display response
        const formatted = JSON.stringify(data, null, 2);
        responseArea.innerHTML = formatted;
        
        // Apply visual indicators based on response
        if (data.totalErrors > 0) {
            responseArea.style.borderLeftColor = 'var(--error-color)';
        }
    } catch (error) {
        // Handle connection errors
    } finally {
        body.classList.remove('loading');
    }
}
```

#### `initializeForm()`
Sets up default form values with current timestamps.

```javascript
function initializeForm() {
    const defaultContent = `## API Test Event - ${new Date().toLocaleString()}

**Type**: Test Entry
**Source**: Claude Events API Test Client
**Timestamp**: ${new Date().toISOString()}
**Message**: Testing API save functionality

This entry was created by the API test client.

---

`;
    document.getElementById('saveContent').value = defaultContent;
}
```

### Specialized Test Functions

#### `testRecentEvents()`
```javascript
async function testRecentEvents() {
    const hours = document.getElementById('hoursInput').value || 24;
    await testEndpoint(`/api/recent/${hours}`);
}
```

#### `testDirectoryEvents()`
```javascript
async function testDirectoryEvents() {
    const directory = document.getElementById('directoryInput').value;
    await testEndpoint(`/api/events/dir?path=${encodeURIComponent(directory)}`);
}
```

#### `testSaveEvent()`
```javascript
async function testSaveEvent() {
    const payload = {
        filename: 'claude.md',
        content: document.getElementById('saveContent').value,
        folder: document.getElementById('saveDirectory').value,
        referer: window.location.href
    };
    
    await testEndpoint('/api/save-claude-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}
```

## Visual Feedback System

### Status Indicators
The interface provides visual feedback for different response types:

```css
.status.success {
    background: rgba(40, 167, 69, 0.1);
    color: var(--success-color);
    border-left-color: var(--success-color);
}

.status.error {
    background: rgba(220, 53, 69, 0.1);
    color: var(--error-color);
    border-left-color: var(--error-color);
}
```

### Loading States
```css
.loading {
    opacity: 0.6;
    pointer-events: none;
}
```

### Response Highlighting
The response area dynamically changes border color based on content:
- **Red**: Error responses or responses with errors
- **Green**: Healthy/successful responses
- **Blue**: Informational responses

## Usage Instructions

### For Developers

1. **Start the API Server**:
   ```bash
   node server/claude-events-api.js
   ```

2. **Open the Test Client**:
   ```
   http://localhost:8081/claude-api-test.html
   ```

3. **Test Endpoints**:
   - Click buttons to test different endpoints
   - Use form inputs to customize requests
   - View formatted responses in the response area

### For AI Assistants

The test client provides clear instructions for AI assistants:

```
🚀 Instructions for AI Assistants:
- Use GET /api/errors to see what's currently broken
- Use GET /api/events/dir?path=components/wb-tab to debug specific components  
- Use GET /api/recent/1 to get the latest issues
- Use POST /api/save-claude-log to document fixes
```

## API Configuration

### Base URL Configuration
```javascript
const API_BASE = 'http://localhost:3001';
```

### Request Headers
```javascript
{
    'Content-Type': 'application/json'
}
```

### CORS Support
The client expects the API server to have CORS enabled for cross-origin requests.

## Error Handling

### Connection Errors
```javascript
catch (error) {
    responseArea.innerHTML = `❌ Error: ${error.message}

Make sure the API server is running:
node server/claude-events-api.js`;
    responseArea.style.borderLeftColor = 'var(--error-color)';
}
```

### HTTP Errors
HTTP status codes are displayed along with response data:
```javascript
responseArea.innerHTML = `Status: ${response.status}
Endpoint: ${endpoint}
Response: ${formatted}`;
```

## Responsive Design

### Mobile Optimizations
```css
@media (max-width: 768px) {
    body { padding: 15px; }
    .header { padding: 20px; }
    .header h1 { font-size: 1.5em; }
    .api-section { padding: 20px; }
}
```

### Flexible Layout
- Flexbox header with wrapping
- Responsive input groups
- Scrollable response areas
- Touch-friendly buttons

## Security Considerations

### Content Sanitization
- User inputs are properly encoded in URLs
- JSON payloads are validated
- No direct HTML injection

### CORS Policy
- API requires proper CORS configuration
- Referer tracking for audit trails
- No sensitive data exposure

## Browser Support

### Required Features
- **ES6+**: async/await, arrow functions
- **Fetch API**: Modern HTTP requests
- **CSS Custom Properties**: Theme system
- **localStorage**: Theme persistence
- **JSON**: API communication

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Setup

### Prerequisites
1. Claude Events API server running on port 3001
2. Static file server for serving the HTML file
3. Modern web browser

### Local Development
```bash
# Start API server
node server/claude-events-api.js

# Serve static files (if needed)
npx http-server -p 8081

# Open test client
open http://localhost:8081/claude-api-test.html
```

## Related Documentation

- [Claude Events API](claude-events-api.md)
- [WB Status Service](utils/wb/wb-status-service.md)
- [API Server Documentation](server/README.md)