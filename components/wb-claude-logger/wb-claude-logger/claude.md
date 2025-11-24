# wb-claude-logger Component

## Overview

A floating issue logger web component for WB framework demos. Provides quick issue tracking without leaving the demo page.

## Status

✅ **Complete** - Ready for integration into all demo files

## Purpose

Enable developers to quickly log issues while testing components. Issues are saved to localStorage or a backend server for review.

## Architecture

- **Type:** Web Component (Custom Element)
- **Shadow DOM:** Yes (encapsulated styles)
- **Base Class:** HTMLElement (vanilla, no framework dependencies)
- **Dependencies:** None

## Files

- `wb-claude-logger.js` - Main component
- `wb-claude-logger-demo.html` - Demo/example
- `server.js` - Optional Node.js backend
- `package.json` - Backend dependencies
- `README.md` - Integration guide
- `claude.md` - This file

## Integration

### Add to Demo Files

```html
<script type="module" src="../../wb-claude-logger.js"></script>
<wb-claude-logger></wb-claude-logger>
```

### Path Adjustments

Adjust path based on directory depth:
- Root → components: `./components/wb-claude-logger/wb-claude-logger.js`
- Component demo → logger: `../../wb-claude-logger/wb-claude-logger.js`
- Nested demo → logger: `../../../wb-claude-logger/wb-claude-logger.js`

## Configuration

### Attributes

```html
<!-- Position -->
<wb-claude-logger position="bottom-right"></wb-claude-logger>
<wb-claude-logger position="bottom-left"></wb-claude-logger>
<wb-claude-logger position="top-right"></wb-claude-logger>
<wb-claude-logger position="top-left"></wb-claude-logger>

<!-- With Backend -->
<wb-claude-logger 
    backend-url="http://localhost:3000/api/log"
    use-backend="true">
</wb-claude-logger>
```

## Data Model

### Issue Object

```javascript
{
    description: string,      // Required
    expected: string | null,  // Optional
    actual: string | null,    // Optional
    filePath: string | null,  // Optional
    timestamp: string,        // ISO format
    component: string         // Auto-detected
}
```

## Storage

### localStorage (Default)

- **Key:** `wb-claude-logs` - JSON array of issues
- **Key:** `wb-claude-logs-markdown` - Markdown format

### Backend (Optional)

Saves to `claude.md` in markdown format.

## Events

### `issue-logged`

Dispatched when issue is successfully logged.

```javascript
document.querySelector('wb-claude-logger')
    .addEventListener('issue-logged', (e) => {
        const { description, component, timestamp } = e.detail;
        // Handle logged issue
    });
```

## API Endpoints (Backend)

### POST `/api/log`

Log new issue.

**Request:**
```json
{
    "description": "Issue description",
    "expected": "Expected behavior (optional)",
    "actual": "Actual behavior (optional)",
    "filePath": "path/to/file.js (optional)",
    "timestamp": "2025-11-21T22:00:00.000Z",
    "component": "wb-button"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Issue logged successfully",
    "file": "/path/to/claude.md"
}
```

### GET `/api/logs`

Get all logged issues.

**Response:**
```json
{
    "success": true,
    "content": "# Claude Issues Log\n\n..."
}
```

### GET `/api/health`

Health check.

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2025-11-21T22:00:00.000Z"
}
```

## Future Enhancements

### Planned

- [ ] Export issues to CSV
- [ ] Filter issues by component
- [ ] Search functionality
- [ ] Issue categories/tags
- [ ] Screenshot capture
- [ ] Issue status (open/closed)
- [ ] Integration with GitHub Issues

### Considerations

- [ ] Add to base component template
- [ ] Auto-inject in all demos via build script
- [ ] Integration with WB control panel
- [ ] Theme/dark mode styling
- [ ] Keyboard shortcuts (e.g., Ctrl+L to open)

## Known Issues

None currently.

## Testing

### Manual Testing

1. Open wb-claude-logger-demo.html
2. Click 📝 button
3. Fill form and submit
4. Verify localStorage or claude.md file
5. Test all positions
6. Test with/without backend

### Backend Testing

```bash
# Start backend
npm install
npm start

# Test health endpoint
curl http://localhost:3000/api/health

# Test log endpoint
curl -X POST http://localhost:3000/api/log \
  -H "Content-Type: application/json" \
  -d '{"description":"Test issue","timestamp":"2025-11-21T22:00:00.000Z","component":"wb-test"}'

# Get logs
curl http://localhost:3000/api/logs
```

## Integration Checklist

- [x] Component created
- [x] Demo file created
- [x] Backend server created
- [x] Documentation written
- [ ] Added to component demos
- [ ] Build script created
- [ ] Integration with base component (optional)

## Deployment

### Development

Component works immediately in development with no build step.

### Production

1. Decide: localStorage or backend
2. If backend: Deploy server.js to hosting
3. Update `backend-url` attribute
4. Set `use-backend="true"`

## Performance

- **Component Size:** ~12KB unminified
- **Shadow DOM:** Minimal render impact
- **localStorage:** Limited to ~5-10MB
- **Backend:** No size limits

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- IE11: ❌ (Web Components not supported)

## Notes

- Component is completely self-contained
- No dependencies on WB framework internals
- Can be used in non-WB projects
- Shadow DOM prevents style conflicts
- Auto-detects component name from page

## Changelog

### v1.0.0 (2025-11-21)

- Initial release
- Floating button with modal
- localStorage and backend support
- Auto component detection
- Event dispatching
- Shadow DOM encapsulation

---

Last Updated: 2025-11-21
