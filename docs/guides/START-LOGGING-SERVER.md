# 🚀 Starting the Claude Logging Server

## Quick Start

The Claude logging server is required to save logs to `claude.md` files when testing demos.

### Option 1: VS Code Task (Recommended)
1. Press `Ctrl+Shift+P`
2. Type "Run Task"
3. Select **"Start Claude Events API Server"**

### Option 2: PowerShell Script
```powershell
.\server\start-api.ps1
```

### Option 3: Direct Command
```powershell
node src/server/claude-events-api.js
```

## Server Details

- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Port**: 3001 (change with `PORT=3002 node src/server/claude-events-api.js`)

## What Happens When Server is Running

✅ **With Server:**
- Logs are written directly to `components/{component}/claude.md` files
- Auto-creates claude.md if it doesn't exist
- Appends to existing files
- Updates timestamps

❌ **Without Server:**
- Logs are stored in browser localStorage
- Must manually export logs using "Export Session Logs"
- No persistence across sessions

## Testing the Server

1. Start the server using any method above
2. Open `components/claude-logger-demo.html` in browser
3. Look for **✅ Server Connected** message
4. Click "Log Issue" and fill in the form
5. Check `components/claude-logger-demo/claude.md` to see your log

## Troubleshooting

### Port Already in Use
```powershell
# Use a different port
$env:PORT=3002
node src/server/claude-events-api.js
```

### Server Not Detected in Demo
- Refresh the browser page
- Wait 10 seconds (auto-checks every 10s)
- Check browser console for errors
- Verify server is running: http://localhost:3001/api/health

### Logs Not Saving
1. Check server console for errors
2. Verify component name is correct
3. Check file permissions in components folder
4. Look in localStorage as fallback

## Endpoints Available

- `GET /api/health` - Server health check
- `POST /api/claude-log` - Write log entry to claude.md
- `GET /api/events` - Get all events from all claude.md files
- `GET /api/errors` - Get only error events
- `GET /api/recent/:hours` - Get recent events

## For Development

The server runs in the background and:
- Auto-reloads on file changes (if using nodemon)
- Logs all operations to console
- Handles CORS for browser requests
- Creates directories and files as needed

## Stop the Server

Press `Ctrl+C` in the terminal where it's running.
