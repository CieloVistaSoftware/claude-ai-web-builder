# Run Claude WebSocket Test Server
# This script starts the WebSocket server and opens the test page

Write-Host "🔍 Checking if port 3000 is in use..." -ForegroundColor Cyan

# Kill any existing process on port 3000
$processInfo = netstat -ano | findstr :3000
if ($processInfo) {
    $processId = ($processInfo -split '\s+')[-1]
    if ($processId -match '^\d+$') {
        Write-Host "🛑 Killing process $processId using port 3000..." -ForegroundColor Yellow
        taskkill /F /PID $processId
    }
}

Write-Host "🔧 Compiling TypeScript files..." -ForegroundColor Cyan

# Compile the necessary TypeScript files
npx tsc websocket-server-manager.ts --target ES2020 --module ESNext --moduleResolution Node

# Check if compilation succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting WebSocket server..." -ForegroundColor Green

# Create a simple server.js file to run
$serverScript = @"
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile, stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create HTTP server
const httpServer = createServer(async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Serve files
    let url = req.url === '/' ? '/test-claude-socket.html' : req.url;
    const filePath = join(process.cwd(), url);
    
    try {
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile()) {
        // Determine content type based on extension
        const ext = url.split('.').pop().toLowerCase();
        const contentTypes = {
          'html': 'text/html',
          'css': 'text/css',
          'js': 'text/javascript',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        };
        
        const contentType = contentTypes[ext] || 'text/plain';
        const content = await readFile(filePath);
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not found');
      } else {
        console.error('Error serving file:', error);
        res.writeHead(500);
        res.end('Server error');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.writeHead(500);
    res.end('Server error');
  }
});

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Handle client registration
  socket.on('register:client', (data) => {
    console.log('Client registered:', data.clientId);
    socket.emit('claude:status', { status: 'ready' });
  });
  
  // Handle Claude API requests
  socket.on('claude:request', (data) => {
    console.log('Claude request received:', data);
    
    // Simulate Claude response with a delay
    setTimeout(() => {
      if (data.prompt) {
        const modelName = data.model || 'claude-3-sonnet-20240229';
        const response = {
          model: modelName,
          content: \`Here is a response from the Claude WebSocket integration test using \${modelName}:\n\nYou sent: "\${data.prompt}"\n\nThis is a simulated response from the test server. In a real implementation, this would be a response from the Claude API. WebSocket communication is working correctly!\`,
          created: new Date().toISOString(),
          clientId: data.clientId || 'unknown'
        };
        
        socket.emit('claude:response', response);
        console.log('Sent Claude response');
      } else {
        socket.emit('claude:error', { 
          message: 'Invalid request: missing prompt',
          clientId: data.clientId || 'unknown'
        });
      }
    }, 1000);
  });
  
  // Handle file requests
  socket.on('get:file', async (data) => {
    if (data && data.path) {
      try {
        const filePath = join(process.cwd(), data.path);
        const fileContent = await readFile(filePath, 'utf8');
        socket.emit(\`file:\${data.path}\`, { content: fileContent });
      } catch (error) {
        socket.emit(\`file:\${data.path}\`, { error: error.message });
      }
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}/\`);
  console.log(\`WebSocket server available at ws://localhost:\${PORT}\`);
  console.log(\`Open test page at http://localhost:\${PORT}/test-claude-socket.html\`);
});
"@

Set-Content -Path "claude-socket-test-server.js" -Value $serverScript

# Run the server
node claude-socket-test-server.js

# Open the test page in the default browser
Start-Process "http://localhost:3000/test-claude-socket.html"
