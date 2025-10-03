/**
 * Claude WebSocket Server
 * 
 * Simple WebSocket server that handles Claude API requests
 * and serves static files. No Express, pure Node.js with Socket.IO.
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

// Define the port
const PORT = 3000;

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
const httpServer = http.createServer(async (req, res): any => {
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

// Socket.IO connection handler
io.on('connection', (socket: Socket) => {
  console.log('Client connected');
  
  // Handle client registration
  socket.on('register:client', (data: any) => {
    console.log('Client registered:', data.clientId);
    socket.emit('claude:status', { status: 'ready' });
  });
  
  // Handle Claude API requests
  socket.on('claude:request', async (data: any) => {
    console.log('Claude request received:', data);
    
    try {
      if (!data.prompt) {
        throw new Error('Missing prompt in request');
      }
      
      // Get API key from environment
      const apiKey = process.env.CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('CLAUDE_API_KEY environment variable is not set');
      }
      
      const modelName = data.model || 'claude-3-sonnet-20240229';
      console.log(`Making API request to Claude API using model: ${modelName}`);
      
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
        const filePath = path.join(process.cwd(), data.path);
        const content = await fs.readFile(filePath, 'utf8');
        socket.emit(`file:${data.path}`, { content });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit(`file:${data.path}`, { error: errorMessage });
      }
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', (): any => {
    console.log('Client disconnected');
  });
});

// Main function
async function main(): any {
  try {
    // Kill any existing process on the port
    await killProcessOnPort(PORT);
    
    // Start the server
    httpServer.listen(PORT, (): any => {
      console.log(`Claude WebSocket server running on port ${PORT}`);
      console.log(`Open test page at: http://localhost:${PORT}/test-claude-socket.html`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server
main();
