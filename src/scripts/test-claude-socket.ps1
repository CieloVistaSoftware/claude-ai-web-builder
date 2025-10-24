# test-claude-socket.ps1
# PowerShell script to start test server with Claude API key environment variable and WebSocket support

# Use a predefined port number as specified in coding instructions
$port = 5050

# Kill any existing process using the port
Write-Host "Checking for processes using port $port..." -ForegroundColor Yellow
$processInfo = netstat -ano | findstr ":$port "

if ($processInfo) {
    Write-Host "Found process using port $port. Terminating..." -ForegroundColor Yellow
    $processId = [regex]::Match($processInfo, '(\d+)$').Groups[1].Value
    if ($processId) {
        Stop-Process -Id $processId -Force
        Write-Host "Process $processId terminated" -ForegroundColor Green
    }
}

# Set environment variables
$env:CLAUDE_API_KEY = "test-claude-api-key-for-development-only"
Write-Host "Set environment variable CLAUDE_API_KEY for testing" -ForegroundColor Green

# Install required dependencies if not present
Write-Host "Checking and installing required dependencies..." -ForegroundColor Yellow
npm install --no-fund socket.io @types/socket.io typescript ts-node

# Check if TypeScript and dependencies are installed
Write-Host "Verifying TypeScript installation..." -ForegroundColor Yellow
$tsNodeInstalled = npm list ts-node
if (-not $tsNodeInstalled) {
    Write-Host "Installing ts-node globally..." -ForegroundColor Yellow
    npm install -g ts-node
}

# Create a package.json if it doesn't exist
if (-not (Test-Path "./package.json")) {
    Write-Host "Creating package.json..." -ForegroundColor Yellow
    $packageJson = @"
{
  "name": "claude-websocket-test",
  "version": "1.0.0",
  "description": "Claude WebSocket Test",
  "type": "module",
  "scripts": {
    "start": "ts-node ./claude-websocket-server.ts"
  },
  "dependencies": {
    "socket.io": "^4.7.2",
    "@types/socket.io": "^3.0.2"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1"
  }
}
"@
    Set-Content -Path "./package.json" -Value $packageJson -Encoding UTF8
}

# Create a tsconfig.json file if it doesn't exist
if (-not (Test-Path "./tsconfig.json")) {
    Write-Host "Creating tsconfig.json..." -ForegroundColor Yellow
    $tsconfigJson = @"
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
"@
    Set-Content -Path "./tsconfig.json" -Value $tsconfigJson -Encoding UTF8
}

# Start the server
Write-Host "Starting Claude WebSocket server on port $port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Run the server with ts-node
npx ts-node ./claude-websocket-server.ts

# Keep console window open if there was an error
if ($LASTEXITCODE -ne 0) {
    Write-Host "Server exited with code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Press any key to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
