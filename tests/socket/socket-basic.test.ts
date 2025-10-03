// @ts-nocheck

import test from 'node:test';
import assert from 'node:assert/strict';
import { io } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

test('Basic Socket.io Connection Test', async (t): any => {
  // Create basic server
  const httpServer = createServer();
  const io_server = new Server(httpServer);
  const PORT = 5051;
  
  // Set up test
  await t.test('Should connect to socket.io server', async (): any => {
    // Create connection handler
    io_server.on('connection', (socket): any => {
      socket.emit('welcome', { message: 'Connected successfully' });
      
      socket.on('echo', (data): any => {
        socket.emit('echo:response', data);
      });
    });
    
    // Start server
    await new Promise(resolve => {
      httpServer.listen(PORT, () => resolve());
    });
    
    // Connect client
    const socket = io(`http://localhost:${PORT}`);
    
    // Wait for connection and welcome message
    const welcomeData = await new Promise((resolve): any => {
      socket.on('welcome', (data) => resolve(data));
    });
    
    assert.equal(welcomeData.message, 'Connected successfully');
    
    // Test echo functionality
    const testData = { test: 'data', timestamp: Date.now() };
    
    socket.emit('echo', testData);
    
    const response = await new Promise((resolve): any => {
      socket.on('echo:response', (data) => resolve(data));
    });
    
    assert.deepEqual(response, testData);
    
    // Clean up
    socket.disconnect();
    httpServer.close();
  });
});
