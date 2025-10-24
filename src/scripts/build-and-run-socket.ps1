# Build and Run WebSocket Test Server
# This script compiles the TypeScript files and runs the WebSocket server

Write-Host "⚙️ Building TypeScript files..." -ForegroundColor Cyan

# Compile TypeScript files
npx tsc websocket-server-manager.ts start-websocket-server.ts claude-websocket-server.ts --esModuleInterop --resolveJsonModule --target ES2020 --module ES2020 --moduleResolution Node

# Check if compilation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ TypeScript compilation successful!" -ForegroundColor Green
Write-Host "🚀 Starting WebSocket server..." -ForegroundColor Cyan

# Run the WebSocket server
node start-websocket-server.js

# Open the test page in the default browser
Start-Process "http://localhost:3000/test-claude-socket.html"
