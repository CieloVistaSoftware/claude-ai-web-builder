/**
 * Unified Claude WebSocket Server
 * 
 * This is a consolidated implementation that combines functionality from:
 * - claude-socket-server.ts
 * - claude-socket-test-server.ts
 * - claude-websocket-server.ts
 * 
 * The server provides WebSocket communication for Claude AI integration
 * and handles static file serving for testing purposes.
 */

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port (configurable via environment)
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Environment & Configuration
const USE_MOCK_RESPONSES = process.env.USE_MOCK_RESPONSES === 'true';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'dummy-key-for-testing';
const DEFAULT_MODEL = 'claude-3-sonnet-20240229';

// Kill any existing process on port (platform independent)
async function killProcessOnPort(port: number): Promise<void> {
  try {
    console.log(`Checking for processes using port ${port}...`);
    
    if (process.platform === 'win32') {
      // Windows
      try {
        const findCommand = `netstat -ano | findstr :${port}`;
        const result = execSync(findCommand, { encoding: 'utf8' });
        
        if (result) {
          const processIdMatches = result.match(/(\d+)$/m);
          if (processIdMatches && processIdMatches[1]) {
            const pid = processIdMatches[1].trim();
            console.log(`Killing process ${pid} using port ${port}...`);
            execSync(`taskkill /F /PID ${pid}`);
          }
        }
      } catch (e) {
        // No process found or unable to kill
        console.log(`No process found using port ${port} or unable to kill it.`);
      }
    } else {
      // Unix-like (Linux, macOS)
      try {
        const findCommand = `lsof -i :${port} -t`;
        const result = execSync(findCommand, { encoding: 'utf8' }).trim();
        
        if (result) {
          const pids = result.split('\n');
          for (const pid of pids) {
            if (pid) {
              console.log(`Killing process ${pid} using port ${port}...`);
              execSync(`kill -9 ${pid}`);
            }
          }
        }
      } catch (e) {
        // No process found or unable to kill
        console.log(`No process found using port ${port} or unable to kill it.`);
      }
    }
  } catch (error) {
    console.error(`Error checking for processes on port ${port}:`, error);
  }
}

// MIME types for file extensions
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

// Create HTTP server
const httpServer = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Only handle GET requests for static files
  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }
  
  // Serve requested file
  try {
    // Default to test-claude-socket.html
    let url = req.url === '/' ? '/test-claude-socket.html' : req.url;
    
    if (!url) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    // Normalize path and prevent directory traversal
    const safePath = path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(process.cwd(), safePath);
    
    // Check if file exists
    const fileStats = await fs.stat(filePath).catch(() => null);
    
    if (!fileStats || !fileStats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Read file and send response
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Generate a mock response for testing
function generateMockResponse(prompt: string): string {
  const greeting = "Hello! I'm Claude, an AI assistant created by Anthropic.";
  
  if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('what can you do')) {
    return `${greeting}\n\nI can help with a variety of tasks such as:\n\n- Answering questions on many topics\n- Writing and editing content\n- Explaining complex concepts\n- Providing summaries\n- Having thoughtful conversations\n\nHow can I assist you today?`;
  } 
  else if (prompt.toLowerCase().includes('weather')) {
    return `${greeting}\n\nI don't have the ability to check the current weather or make real-time weather forecasts. I don't have access to the internet or current data sources. To get accurate weather information, I'd recommend checking a weather service website or app.`;
  }
  else if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('program')) {
    return `${greeting}\n\nHere's a simple JavaScript function example:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to WebSocket testing.\`;\n}\n\nconsole.log(greet('User'));\n\`\`\`\n\nThis function takes a name parameter and returns a greeting message. Let me know if you'd like me to explain how it works or if you need help with something else!`;
  }
  else {
    return `${greeting}\n\nThank you for your message: "${prompt}"\n\nThis is a test response from the WebSocket implementation. In a real application, this would be an actual response from Claude AI through the Anthropic API. Is there anything specific you'd like me to help with?`;
  }
}

// Register all event handlers for a socket
function registerSocketEvents(socket: Socket): void {
  console.log(`Client connected: ${socket.id}`);
  
  // Handle client registration
  socket.on('register:client', (data: any) => {
    console.log('Client registered:', data.clientId);
    socket.emit('claude:status', { status: 'ready' });
    
    // Acknowledge registration
    socket.emit('register:ack', {
      success: true,
      message: 'Registration successful',
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle Claude API requests
  socket.on('claude:request', async (data: any) => {
    console.log('Claude request received:', data);
    
    try {
      if (!data.prompt) {
        throw new Error('Missing prompt in request');
      }
      
      const modelName = data.model || DEFAULT_MODEL;
      console.log(`Making API request to Claude API using model: ${modelName}`);
      
      // Send status updates
      socket.emit('claude:status', { status: 'processing' });
      
      // If mock mode is enabled, use mock response
      if (USE_MOCK_RESPONSES) {
        setTimeout(() => {
          const response = generateMockResponse(data.prompt);
          
          socket.emit('claude:response', {
            model: modelName,
            content: response,
            created: new Date().toISOString(),
            clientId: data.clientId || 'unknown'
          });
          
          console.log('Sent mock Claude API response');
        }, 1500);
        return;
      }
      
      // Get API key from environment
      const apiKey = CLAUDE_API_KEY;
      if (!apiKey || apiKey === 'dummy-key-for-testing') {
        throw new Error('CLAUDE_API_KEY environment variable is not set or is using the dummy value');
      }
      
      // Prepare API request to Claude
      const requestBody = {
        model: modelName,
        messages: [
          { role: 'user', content: data.prompt }
        ],
        max_tokens: 1024
      };
      
      try {
        // Make real API request to Claude
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Claude API error (${response.status}): ${errorData}`);
        }
        
        const responseData = await response.json();
        
        // Send the real API response back to the client
        socket.emit('claude:response', {
          model: modelName,
          content: responseData.content[0].text,
          created: new Date().toISOString(),
          clientId: data.clientId || 'unknown'
        });
        console.log('Sent Claude API response');
      } catch (apiError) {
        // Handle and properly format API-specific errors
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
        console.error('Error processing Claude request:', errorMessage);
        socket.emit('claude:error', {
          message: errorMessage,
          clientId: data.clientId || 'unknown'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing Claude request:', errorMessage);
      socket.emit('claude:error', {
        message: errorMessage,
        clientId: data.clientId || 'unknown'
      });
    }
  });
  
  // Handle file requests via WebSocket
  socket.on('get:file', async (data: { path: string }) => {
    if (data && data.path) {
      try {
        // Security check - prevent directory traversal
        const filePath = path.join(process.cwd(), data.path);
        if (!filePath.startsWith(process.cwd())) {
          socket.emit(`file:${data.path}`, { 
            error: 'Security violation: path traversal not allowed'
          });
          return;
        }
        
        const content = await fs.readFile(filePath, 'utf8');
        socket.emit(`file:${data.path}`, { 
          type: 'file',
          path: data.path,
          content: content
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit(`file:${data.path}`, { error: errorMessage });
      }
    }
  });
  
  // Handle environment variable requests
  socket.on('get:env', (data: { key: string }) => {
    console.log(`Received environment variable request for ${data.key}`);
    
    if (data.key === 'CLAUDE_API_KEY') {
      // Send the API key (redacted for security)
      const apiKey = CLAUDE_API_KEY;
      socket.emit('env:claude_api_key', { 
        value: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4),
        timestamp: new Date().toISOString()
      });
      console.log('Sent redacted Claude API key to client');
    } else {
      socket.emit('env:error', {
        message: `Cannot access environment variable: ${data.key}`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}

// Socket.IO connection handler
io.on('connection', registerSocketEvents);

// Main function
async function main(): Promise<void> {
  try {
    // Kill any existing process on the port
    await killProcessOnPort(PORT);
    
    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`Unified Claude WebSocket server running on port ${PORT}`);
      console.log(`Open test page at: http://localhost:${PORT}/test-claude-socket.html`);
      console.log(`Environment settings:`);
      console.log(`- USE_MOCK_RESPONSES: ${USE_MOCK_RESPONSES ? 'true (using mock responses)' : 'false (using real API)'}`);
      console.log(`- CLAUDE_API_KEY: ${CLAUDE_API_KEY ? (CLAUDE_API_KEY === 'dummy-key-for-testing' ? 'using dummy key (mock only)' : 'set (redacted)') : 'not set'}`);
      console.log(`- DEFAULT_MODEL: ${DEFAULT_MODEL}`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down WebSocket server...');
      httpServer.close(() => {
        console.log('Server shutdown complete');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server
main();
