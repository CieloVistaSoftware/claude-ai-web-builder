# Claude Events API

A simple Express.js API server that provides AI assistants programmatic access to claude.md event logs throughout the WB project.

## Quick Start

From the wb root directory:
```bash
node server/claude-events-api.js
```

The API will be available at `http://localhost:3001`

## Endpoints

### Health Check
```
GET /api/health
```
Returns API status and available endpoints.

### Get All Events
```
GET /api/events
```
Returns all events from all claude.md files in the project.

### Get Events from Specific Directory
```
GET /api/events/components/wb-button
```
Returns events from `components/wb-button/claude.md`.

### Get Only Errors
```
GET /api/errors
```
Returns only error-level events from all files.

### Get Recent Events
```
GET /api/recent/24
```
Returns events from the last 24 hours (or any number of hours).

### Save New Events
```
POST /api/save-claude-log
Content-Type: application/json

{
  "filename": "claude.md",
  "content": "## New Event\n...",
  "folder": "components/wb-button"
}
```
Saves new content to a claude.md file.

## AI Assistant Usage

AI assistants like GitHub Copilot can now call these endpoints to:

1. **Get broken events**: `GET /api/errors` to see what's currently broken
2. **Check specific components**: `GET /api/events/components/wb-tab` to debug a specific component
3. **See recent issues**: `GET /api/recent/1` to get the last hour's problems
4. **Save fixes**: `POST /api/save-claude-log` to document what was fixed

## Test Client

Open `server/api-test-client.html` in your browser to test all endpoints interactively.

## Example Responses

### Error Events
```json
{
  "errorFiles": 2,
  "totalErrors": 5,
  "files": [
    {
      "directory": "components/wb-tab",
      "events": [
        {
          "title": "JavaScript Error - Cannot read property 'click'",
          "type": "error",
          "errorType": "TypeError",
          "message": "Cannot read property 'click' of null",
          "file": "wb-tab.js",
          "line": "45",
          "timestamp": "2025-10-05"
        }
      ]
    }
  ]
}
```

### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2025-10-05T10:30:00Z",
  "uptime": 3600,
  "endpoints": [
    "GET /api/events/:directory",
    "GET /api/events",
    "GET /api/errors",
    "GET /api/recent/:hours",
    "POST /api/save-claude-log"
  ]
}
```

## Integration with WB Components

The API automatically scans all claude.md files created by the wb-event-log system and provides structured access to:

- Error events with stack traces
- Component initialization issues
- Resource loading failures  
- JavaScript errors and warnings
- Page context and HTML state

This enables AI assistants to quickly identify and help fix issues across the entire WB component ecosystem.