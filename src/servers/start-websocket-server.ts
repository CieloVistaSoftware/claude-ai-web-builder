/**
 * WebSocket Server Starter
 * 
 * This script starts the WebSocket server with Claude integration.
 * It handles both dependency loading and Claude API communication.
 */

import { execSync } from 'child_process';
import WebSocketServerManager from './websocket-server-manager.js';
import * as http from 'http';
import { Server } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Define the port to use
const PORT = 3000;

// Kill any existing process using the port
async function killProcessOnPort(port: number): Promise<void> {
  try {
    console.log(`Checking for processes using port ${port}...`);
    
    if (process.platform === 'win32') {
      // Windows
      const findCommand = `netstat -ano | findstr :${port}`;
      const result = execSync(findCommand, { encoding: 'utf8' });
      
      if (result) {
        const processIdMatches = result.match(/(\d+)$/m);
        if (processIdMatches && processIdMatches[1]) {
          const pid = processIdMatches[1].trim();
          console.log(`Found process ${pid} using port ${port}. Terminating...`);
          execSync(`taskkill /F /PID ${pid}`);
          console.log(`Process ${pid} terminated`);
        }
      }
    } else {
      // Unix-like (Linux, macOS)
      try {
        const findCommand = `lsof -i :${port} -t`;
        const pid = execSync(findCommand, { encoding: 'utf8' }).trim();
        
        if (pid) {
          console.log(`Found process ${pid} using port ${port}. Terminating...`);
          execSync(`kill -9 ${pid}`);
          console.log(`Process ${pid} terminated`);
        }
      } catch (e) {
        // No process found on the port
      }
    }
  } catch (error) {
    console.log('No process found using the port, or error checking processes');
  }
}

// Set environment variables for development
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'test-claude-api-key-for-development-only';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Claude API key (from environment variable)
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'dummy-key-for-testing';

// Generate a mock response for testing
function generateMockResponse(prompt: string) {
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

// Main function to start the server
async function main(): any {
  try {
    // Kill any process using the port
    await killProcessOnPort(PORT);
    
    console.log(`Starting WebSocket server on port ${PORT}...`);
    console.log('All dependencies will be loaded via WebSocket');
    console.log(`CLAUDE_API_KEY is ${process.env.CLAUDE_API_KEY ? 'set' : 'not set'} in the environment`);
    
    // Create and start WebSocket server
    const wsServer = new WebSocketServerManager({ 
      port: PORT,
      serveStatic: true // Only for serving the initial HTML file
    });
    
    const server = await wsServer.start();
    
    // Add Claude WebSocket functionality to the server
    const io = new Server(server);
    
    // Socket.io event handlers for Claude API
    io.on('connection', (socket): any => {
      console.log(`Client connected to Claude API: ${socket.id}`);
      
      // Claude API requests
      socket.on('claude:request', async(data): any => {
        console.log(`Received Claude request from ${socket.id} with model ${data.model}`);
        
        try {
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
            message: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Client registration
      socket.on('register:client', (data) => {
        console.log(`Client registered: ${data.clientId} (${data.clientType})`);
        
        // Acknowledge registration
        socket.emit('register:ack', {
          success: true,
          message: 'Registration successful',
          timestamp: new Date().toISOString()
        });
      });
      
      socket.on('disconnect', (): any => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
    
    console.log(`WebSocket server started on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test-claude-socket.html`);
    console.log('Using Claude API Key:', CLAUDE_API_KEY.substring(0, 4) + '...' + CLAUDE_API_KEY.substring(CLAUDE_API_KEY.length - 4));
    
    // Handle graceful shutdown
    process.on('SIGINT', async (): any => {
      console.log('Shutting down WebSocket server...');
      await wsServer.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting WebSocket server:', error);
    process.exit(1);
  }
}

// Run the main function
main();
