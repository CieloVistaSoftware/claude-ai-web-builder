/**
 * Claude WebSocket Server
 * 
 * This server handles WebSocket connections for communicating with Claude AI.
 * It uses Socket.io for WebSocket transport and leverages the Anthropic API.
 */

import * as http from 'http';
import { Server } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create HTTP server
const server = http.createServer((req, res): any => {
  // Serve static files
  const filePath = path.join(__dirname, req.url === '/' ? 'test-claude-socket.html' : req.url || '');
  const contentType = getContentType(filePath);
  
  fs.readFile(filePath, (err, content): any => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// Helper to determine content type
function getContentType(filePath): any {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    default:
      return 'text/plain';
  }
}

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Claude API key (from environment variable)
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'dummy-key-for-testing';

// Socket.io event handlers
io.on('connection', (socket): any => {
  console.log(`Client connected: ${socket.id}`);
  
  // Register event handlers for this socket
  registerSocketEvents(socket);
  
  socket.on('disconnect', (): any => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Register all event handlers for a socket
function registerSocketEvents(socket): any {
  // File requests
  socket.on('get:file', handleFileRequest);
  
  // Claude API requests
  socket.on('claude:request', handleClaudeRequest);
  
  // Environment variable requests
  socket.on('get:env', handleEnvRequest);
  
  // Client registration
  socket.on('register:client', handleClientRegistration);
  
  console.log(`Registered event handlers for socket ${socket.id}`);
  
  // Helper for file requests
  function handleFileRequest(data): any {
    try {
      const filePath = path.join(__dirname, data.path);
      
      // Security check - prevent directory traversal
      if (!filePath.startsWith(__dirname)) {
        socket.emit(`file:${data.path}`, { 
          error: 'Security violation: path traversal not allowed'
        });
        return;
      }
      
      fs.readFile(filePath, 'utf8', (err, content): any => {
        if (err) {
          console.error(`Error reading file ${data.path}:`, err);
          socket.emit(`file:${data.path}`, { 
            error: `Failed to read file: ${err.message}`
          });
          return;
        }
        
        socket.emit(`file:${data.path}`, {
          type: 'file',
          path: data.path,
          content: content
        });
        
        console.log(`Sent file ${data.path} to client ${socket.id}`);
      });
    } catch (error) {
      console.error(`Error handling file request:`, error);
      socket.emit(`file:${data.path}`, { 
        error: `Server error: ${error.message}`
      });
    }
  }
  
  // Helper for Claude API requests
  async function handleClaudeRequest(data): any {
    console.log(`Received Claude request from ${socket.id} with model ${data.model}`);
    
    try {
      // In a real implementation, this would call the Anthropic API
      // For this test, we'll just simulate a response
      
      // Send status updates
      socket.emit('claude:status', { status: 'processing' });
      
      // Simulate API call delay
      setTimeout((): any => {
        // Send mock response
        const response = generateMockResponse(data.prompt);
        
        socket.emit('claude:response', {
          content: response,
          model: data.model,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Sent Claude response to ${socket.id}`);
      }, 1500);
    } catch (error) {
      console.error(`Error processing Claude request:`, error);
      socket.emit('claude:error', { 
        message: `Error processing request: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Helper for environment variable requests
  function handleEnvRequest(data): any {
    console.log(`Received environment variable request for ${data.key}`);
    
    if (data.key === 'CLAUDE_API_KEY') {
      // Send the API key (in a real app, would need additional security)
      socket.emit('env:claude_api_key', { 
        value: CLAUDE_API_KEY,
        timestamp: new Date().toISOString()
      });
      console.log('Sent Claude API key to client');
    } else {
      socket.emit('env:error', {
        message: `Cannot access environment variable: ${data.key}`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Helper for client registration
  function handleClientRegistration(data): any {
    console.log(`Client registered: ${data.clientId} (${data.clientType})`);
    
    // Acknowledge registration
    socket.emit('register:ack', {
      success: true,
      message: 'Registration successful',
      timestamp: new Date().toISOString()
    });
  }
}

// Generate a mock response for testing
function generateMockResponse(prompt): any {
  const greeting = "Hello! I'm Claude, an AI assistant created by Anthropic.";
  
  if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('what can you do')) {
    return `${greeting}\n\nI can help with a variety of tasks such as:\n\n- Answering questions on many topics\n- Writing and editing content\n- Explaining complex concepts\n- Providing summaries\n- Having thoughtful conversations\n\nHow can I assist you today?`;
  } 
  else if (prompt.toLowerCase().includes('weather')) {
    return `${greeting}\n\nI don't have the ability to check the current weather or make real-time weather forecasts. I don't have access to the internet or current data sources. To get accurate weather information, I'd recommend checking a weather service website or app.`;
  }
  else if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('program')) {
    return `${greeting}\n\nHere's a simple JavaScript function example:\n\n\`\`\`javascript\nfunction greet(name): any {\n  return \`Hello, \${name}! Welcome to WebSocket testing.\`;\n}\n\nconsole.log(greet('User'));\n\`\`\`\n\nThis function takes a name parameter and returns a greeting message. Let me know if you'd like me to explain how it works or if you need help with something else!`;
  }
  else {
    return `${greeting}\n\nThank you for your message: "${prompt}"\n\nThis is a test response from the WebSocket implementation. In a real application, this would be an actual response from Claude AI through the Anthropic API. Is there anything specific you'd like me to help with?`;
  }
}

// Start the server
const PORT = process.env.PORT || 5050;
server.listen(PORT, (): any => {
  console.log(`Claude WebSocket Server running on port ${PORT}`);
  console.log(`Test page available at http://localhost:${PORT}/test-claude-socket.html`);
  console.log('Using Claude API Key:', CLAUDE_API_KEY.substring(0, 4) + '...' + CLAUDE_API_KEY.substring(CLAUDE_API_KEY.length - 4));
  console.log('Environment variable CLAUDE_API_KEY is ' + (process.env.CLAUDE_API_KEY ? 'SET' : 'NOT SET'));
});
