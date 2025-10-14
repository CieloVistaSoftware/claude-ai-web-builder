# Claude Events API Documentation

## Overview

The Claude Events API (`claude-events-api.js`) is an Express.js server that provides AI assistants with programmatic access to claude.md event logs across the Website Builder project. It offers RESTful endpoints for retrieving, filtering, and managing logged events to help AI assistants understand project status and document fixes.

## Features

- **Event Retrieval**: Access all events from claude.md files across the project
- **Error Filtering**: Get only error-level events that need attention
- **Time-based Filtering**: Retrieve events from specific time periods
- **Directory-specific Events**: Access events from specific component directories
- **Event Logging**: Save new events and fixes to claude.md files
- **Auto-discovery**: Automatically finds all claude.md files in the project
- **CORS Support**: Cross-origin requests enabled for web clients
- **Health Monitoring**: API status and uptime tracking

## Server Configuration

### Port and Binding
```javascript
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Claude Events API Server running on http://localhost:${PORT}`);
});
```

### Middleware Stack
```javascript
app.use(express.json());           // Parse JSON request bodies
app.use(express.static('.'));      // Serve static files from wb root
app.use(corsMiddleware);           // Enable CORS for all origins
```

### CORS Configuration
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
```

## API Endpoints

### Health Check

#### `GET /api/health`
Check API server status and get available endpoints.

**Response:**
```javascript
{
    "status": "healthy",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "uptime": 1234.56,
    "endpoints": [
        "GET /api/events/:directory",
        "GET /api/events",
        "GET /api/errors",
        "GET /api/recent/:hours",
        "POST /api/save-claude-log"
    ]
}
```

**Usage:**
```bash
curl http://localhost:3001/api/health
```

### Event Retrieval

#### `GET /api/events`
Get all events from all claude.md files in the project.

**Response:**
```javascript
{
    "totalFiles": 15,
    "totalEvents": 87,
    "files": [
        {
            "directory": "./components/wb-button",
            "filePath": "./components/wb-button/claude.md",
            "events": [
                {
                    "title": "Critical Error - Component Loading Failed",
                    "timestamp": "2025-01-15",
                    "type": "error",
                    "content": ["Error details..."],
                    "lineStart": 10,
                    "lineEnd": 25,
                    "errorType": "LoadingError",
                    "message": "Failed to load component CSS",
                    "file": "wb-button.js",
                    "line": "45"
                }
            ],
            "eventCount": 5,
            "lastModified": "2025-01-15T09:15:00.000Z",
            "size": 2048
        }
    ]
}
```

**Usage:**
```bash
curl http://localhost:3001/api/events
```

#### `GET /api/events/:directory`
Get events from a specific directory's claude.md file.

**Parameters:**
- `directory` (path): Directory path relative to project root

**Response:**
```javascript
{
    "directory": "components/wb-button",
    "eventCount": 5,
    "events": [...],
    "lastModified": "2025-01-15T09:15:00.000Z"
}
```

**Usage:**
```bash
curl http://localhost:3001/api/events/components/wb-button
curl http://localhost:3001/api/events/utils/wb
```

#### `GET /api/events/dir?path=directory`
Alternative endpoint for directory-specific events with query parameter.

**Query Parameters:**
- `path` (string): Directory path (URL encoded)

**Usage:**
```bash
curl "http://localhost:3001/api/events/dir?path=components/wb-color-picker"
```

### Error Filtering

#### `GET /api/errors`
Get only error-level events from all claude.md files.

**Error Detection Criteria:**
- `event.type === 'error'`
- `event.level === 'error'`
- Message contains "error" (case-insensitive)
- Content lines contain "error" (case-insensitive)

**Response:**
```javascript
{
    "errorFiles": 8,
    "totalErrors": 23,
    "files": [
        {
            "directory": "./components/wb-modal",
            "filePath": "./components/wb-modal/claude.md",
            "events": [
                {
                    "title": "🚨 Critical Error - Modal Not Displaying",
                    "type": "error",
                    "message": "Modal component fails to render",
                    "content": ["Error details..."]
                }
            ]
        }
    ]
}
```

**Usage:**
```bash
curl http://localhost:3001/api/errors
```

### Time-based Filtering

#### `GET /api/recent/:hours`
Get events from the last N hours across all files.

**Parameters:**
- `hours` (integer): Number of hours to look back (1-168)

**Response:**
```javascript
{
    "hoursBack": 24,
    "recentFiles": 5,
    "totalRecentEvents": 12,
    "files": [
        {
            "directory": "./components/wb-slider",
            "events": [
                {
                    "title": "Slider Value Update Issue",
                    "timestamp": "2025-01-15T08:30:00.000Z",
                    "type": "warning"
                }
            ]
        }
    ]
}
```

**Usage:**
```bash
curl http://localhost:3001/api/recent/24    # Last 24 hours
curl http://localhost:3001/api/recent/1     # Last hour
curl http://localhost:3001/api/recent/168   # Last week
```

### Event Logging

#### `POST /api/save-claude-log`
Save new events or fixes to a claude.md file.

**Request Body:**
```javascript
{
    "filename": "claude.md",
    "content": "## Fixed Issue - 2025-01-15\n\n**Type**: Bug Fix\n**Component**: wb-button\n**Issue**: Component loading failure\n**Resolution**: Updated CSS path resolution\n\n---\n\n",
    "folder": "components/wb-button",
    "referer": "http://localhost:3000/test-client.html"
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Saved to components/wb-button/claude.md",
    "directory": "components/wb-button",
    "filename": "claude.md"
}
```

**Usage:**
```bash
curl -X POST http://localhost:3001/api/save-claude-log \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "claude.md",
    "content": "## API Test Event\n\nTesting save functionality\n\n---\n\n",
    "folder": "."
  }'
```

## Event Parsing System

### `parseClaudeEvents(content)`
Parses claude.md content into structured event objects.

**Detection Patterns:**
```javascript
// Event headers
if (line.startsWith('## ') && (line.includes('Error') || line.includes('Event Log')))

// Event separators  
if (line.trim() === '---')

// Field extraction patterns
if (line.includes('**Type**:'))     // errorType
if (line.includes('**Message**:'))  // message  
if (line.includes('**File**:'))     // file
if (line.includes('**Line**:'))     // line
```

**Event Structure:**
```javascript
{
    title: "Critical Error - Component Loading Failed",
    timestamp: "2025-01-15",
    type: "error",           // error, warning, info, unknown
    content: ["Line 1", "Line 2", "..."],
    lineStart: 10,
    lineEnd: 25,
    errorType: "LoadingError",
    message: "Failed to load component CSS", 
    file: "wb-button.js",
    line: "45"
}
```

### `extractTimestamp(line)`
Extracts timestamps from event headers.

**Supported Formats:**
- ISO dates: `2025-01-15`
- US dates: `1/15/2025`
- Full dates: `January 15, 2025`

### `detectEventType(line)`
Determines event type from header content.

**Detection Rules:**
```javascript
if (lower.includes('error') || lower.includes('🚨')) return 'error';
if (lower.includes('warning') || lower.includes('⚠️')) return 'warning';
if (lower.includes('info') || lower.includes('ℹ️')) return 'info';
return 'unknown';
```

## File Discovery System

### `findAllClaudeFiles()`
Recursively scans the project for claude.md files.

**Scanning Rules:**
- Starts from current directory (`.`)
- Skips hidden directories (`.git`, `.vscode`)
- Skips `node_modules`
- Only processes files named exactly `claude.md`
- Handles read permission errors gracefully

**Return Structure:**
```javascript
[
    {
        directory: "./components/wb-button",
        filePath: "./components/wb-button/claude.md",
        events: [...],
        eventCount: 5,
        lastModified: "2025-01-15T09:15:00.000Z",
        size: 2048
    }
]
```

## Error Handling

### HTTP Error Responses
```javascript
// 400 Bad Request
{
    "error": "Missing filename or content"
}

// 500 Internal Server Error  
{
    "error": "ENOENT: no such file or directory"
}
```

### File Access Errors
```javascript
// File not found
{
    "events": [],
    "message": "No claude.md file found",
    "directory": "components/non-existent"
}
```

### Graceful Degradation
- Skips unreadable directories
- Continues processing if individual files fail
- Warns about read errors in console
- Returns partial results when possible

## Server Management

### Startup Process
```javascript
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Claude Events API Server running on http://localhost:${PORT}`);
    console.log(`📊 Available endpoints:`);
    // ... endpoint listing
    console.log(`\n🤖 AI assistants can now call these endpoints!`);
});
```

### Error Handling
```javascript
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
    } else {
        console.error(`❌ Server error:`, error);
    }
    process.exit(1);
});
```

### Graceful Shutdown
```javascript
process.on('SIGINT', () => {
    console.log('\n📴 Shutting down Claude Events API Server...');
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});
```

## Usage Examples

### AI Assistant Workflows

#### 1. Check for Current Issues
```javascript
// Get all current errors
const response = await fetch('http://localhost:3001/api/errors');
const errors = await response.json();

console.log(`Found ${errors.totalErrors} errors in ${errors.errorFiles} files`);
errors.files.forEach(file => {
    console.log(`${file.directory}: ${file.events.length} errors`);
});
```

#### 2. Debug Specific Component
```javascript
// Check specific component for issues
const component = 'components/wb-modal';
const response = await fetch(`http://localhost:3001/api/events/${component}`);
const data = await response.json();

if (data.eventCount > 0) {
    console.log(`Found ${data.eventCount} events in ${component}`);
    data.events.forEach(event => {
        console.log(`- ${event.type}: ${event.title}`);
    });
}
```

#### 3. Document a Fix
```javascript
// Save a fix to claude.md
const fix = {
    filename: 'claude.md',
    content: `## Fixed Modal Display Issue - ${new Date().toISOString().split('T')[0]}

**Type**: Bug Fix
**Component**: wb-modal
**Issue**: Modal not displaying properly
**Root Cause**: CSS z-index conflict
**Resolution**: Updated modal z-index to 9999

**Files Modified**:
- components/wb-modal/wb-modal.css

**Testing**: Verified modal displays correctly in all browsers

---

`,
    folder: 'components/wb-modal'
};

const response = await fetch('http://localhost:3001/api/save-claude-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fix)
});

const result = await response.json();
console.log('Fix documented:', result.message);
```

#### 4. Monitor Recent Activity
```javascript
// Check what happened in the last hour
const response = await fetch('http://localhost:3001/api/recent/1');
const recent = await response.json();

if (recent.totalRecentEvents > 0) {
    console.log(`${recent.totalRecentEvents} events in the last hour:`);
    recent.files.forEach(file => {
        file.events.forEach(event => {
            console.log(`${event.timestamp}: ${event.title}`);
        });
    });
}
```

## Performance Considerations

### File System Optimization
- **Recursive scanning**: Efficiently traverses directory tree
- **Error resilience**: Continues on permission errors
- **Memory management**: Processes files individually
- **Caching**: No built-in caching (stateless design)

### Response Size Management
- **Pagination**: Not implemented (consider for large projects)
- **Filtering**: Multiple filtering options to reduce response size
- **Compression**: Consider enabling gzip compression

### Scalability Considerations
- **Concurrent requests**: Express handles multiple requests
- **File locking**: No file locking (append-only operations)
- **Memory usage**: All file contents loaded into memory

## Security Considerations

### Input Validation
```javascript
if (!filename || !content) {
    return res.status(400).json({ error: 'Missing filename or content' });
}
```

### Path Security
- **Directory traversal**: Paths are resolved safely
- **Restricted access**: Only serves files from project root
- **No arbitrary file access**: Limited to claude.md files

### CORS Policy
- **Open CORS**: Allows all origins (development setup)
- **Production**: Should restrict origins in production

## Development Setup

### Prerequisites
```bash
# Node.js 16+ required
node --version

# Install dependencies (if using modules)
npm install express
```

### Running the Server
```bash
# Development mode
node server/claude-events-api.js

# Production mode (with PM2)
pm2 start server/claude-events-api.js --name claude-api

# Docker mode
docker run -p 3001:3001 -v $(pwd):/app wb-claude-api
```

### Environment Variables
```bash
PORT=3001              # Server port
NODE_ENV=development   # Environment mode
```

## Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Get all events
curl http://localhost:3001/api/events

# Get errors only
curl http://localhost:3001/api/errors

# Test save functionality
curl -X POST http://localhost:3001/api/save-claude-log \
  -H "Content-Type: application/json" \
  -d '{"filename":"claude.md","content":"Test event\n","folder":"."}'
```

### Automated Testing
Consider implementing:
- Unit tests for parsing functions
- Integration tests for API endpoints
- Load testing for performance validation

## Related Documentation

- [Claude API Test Client](claude-api-test.md)
- [WB Status Service](utils/wb/wb-status-service.md)
- [Component Architecture](docs/component-architecture.md)