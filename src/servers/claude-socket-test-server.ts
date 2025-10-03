// @ts-nocheck
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { readFile, stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create HTTP server
const httpServer = createServer(async (req, res): any => {
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
io.on('connection', (socket): any => {
  console.log('Client connected');
  
  // Handle client registration
  socket.on('register:client', (data) => {
    console.log('Client registered:', data.clientId);
    socket.emit('claude:status', { status: 'ready' });
  });
  
  // Handle Claude API requests
  socket.on('claude:request', async(data): any => {
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
    } catch (error) {
      console.error('Error processing Claude request:', error);
      socket.emit('claude:error', { 
        message: error.message,
        clientId: data.clientId || 'unknown'
      });
    }
  });
  
  // Handle file requests
  socket.on('get:file', async(data): any => {
    if (data && data.path) {
      try {
        const filePath = join(process.cwd(), data.path);
        const fileContent = await readFile(filePath, 'utf8');
        socket.emit(`file:${data.path}`, { content: fileContent });
      } catch (error) {
        socket.emit(`file:${data.path}`, { error: error.message });
      }
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', (): any => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = 3000;
httpServer.listen(PORT, (): any => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
  console.log(`Open test page at http://localhost:${PORT}/test-claude-socket.html`);
});
