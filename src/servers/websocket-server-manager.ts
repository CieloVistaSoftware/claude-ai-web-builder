/**
 * WebSocket Server Manager
 * 
 * This module provides WebSocket functionality for serving dependencies
 * instead of using HTTP requests. It uses a pure Node.js HTTP server
 * to handle file requests through the WebSocket connection.
 */

import * as http from 'http';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define interfaces for type safety
interface FileRequest {
  path: string;
  name?: string;
}

interface FileResponse {
  content?: string;
  error?: string;
}

interface ServerOptions {
  port?: number;
  serveStatic?: boolean;
}

class WebSocketServerManager {
  private port: number;
  private server: http.Server;
  private io: Server;
  
  constructor(options: ServerOptions = {}) {
    this.port = options.port || 3000;
    
    // Create a pure Node.js HTTP server
    this.server = http.createServer(this.handleHttpRequest.bind(this));
    this.io = new Server(this.server);
    
    // Setup WebSocket handlers
    this.setupSocketHandlers();
    
    // Log configuration
    console.log(`WebSocketServerManager: Using pure WebSockets communication`);
  }
  
  private handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle simple static file requests for basic HTML/CSS/JS files
    // This is only for the initial page load - all other assets should be loaded via WebSocket
    if (req.method === 'GET' && req.url) {
      this.serveStaticFile(req, res);
    } else {
      // Method not allowed
      res.statusCode = 405;
      res.end('Method not allowed');
    }
  }
  
  private async serveStaticFile(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      if (!req.url) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      
      // Normalize the URL path and prevent directory traversal
      const urlPath = req.url === '/' ? '/index.html' : req.url;
      const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(process.cwd(), safePath);
      
      // Check if file exists and get MIME type
      const fileStats = await fs.stat(filePath).catch(() => null);
      
      if (!fileStats || !fileStats.isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      
      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes: Record<string, string> = {
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
      };
      
      const contentType = contentTypes[ext] || 'text/plain';
      res.setHeader('Content-Type', contentType);
      
      // Read and serve the file
      const content = await fs.readFile(filePath);
      res.statusCode = 200;
      res.end(content);
    } catch (error) {
      console.error('Error serving static file:', error);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }
  
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected');
      
      // Handle environment variable requests
      socket.on('get:env', (data: { key: string }) => {
        console.log('Environment variable requested:', data);
        if (data && data.key) {
          // Send the requested environment variable
          const value = process.env[data.key] || null;
          socket.emit(`env:${data.key.toLowerCase()}`, { value });
          console.log(`Sent environment variable: ${data.key}`);
        }
      });
      
      // Handle file requests
      socket.on('get:file', async (data: FileRequest) => {
        if (data && data.path) {
          const filePath = path.resolve(process.cwd(), data.path.replace(/^\.\//, ''));
          console.log(`File requested via socket: ${filePath}`);
          
          try {
            // Check if file exists
            const fileStats = await fs.stat(filePath).catch(() => null);
            
            if (fileStats && fileStats.isFile()) {
              // Read file content
              const content = await fs.readFile(filePath, 'utf8');
              
              // Send file content via socket
              socket.emit(`file:${data.path}`, { content });
              console.log(`File sent via socket: ${data.path}`);
            } else {
              // File not found
              socket.emit(`file:${data.path}`, { error: 'File not found' });
              console.log(`File not found: ${filePath}`);
            }
          } catch (error) {
            // Error reading file
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            socket.emit(`file:${data.path}`, { error: errorMessage });
            console.error(`Error serving file ${filePath}:`, error);
          }
        }
      });
      
      // Handle plugin loading
      socket.on('load:plugin', async (data: { name: string }) => {
        if (data && data.name) {
          const pluginPath = path.resolve(process.cwd(), 'plugins', `${data.name}.js`);
          console.log(`Plugin requested via socket: ${pluginPath}`);
          
          try {
            // Check if plugin exists
            const fileStats = await fs.stat(pluginPath).catch(() => null);
            
            if (fileStats && fileStats.isFile()) {
              // Read plugin content
              const content = await fs.readFile(pluginPath, 'utf8');
              
              // Send plugin content via socket
              socket.emit(`plugin:${data.name}`, { content });
              console.log(`Plugin sent via socket: ${data.name}`);
            } else {
              // Try with .ts extension
              const tsPluginPath = pluginPath.replace(/\.js$/, '.ts');
              const tsFileStats = await fs.stat(tsPluginPath).catch(() => null);
              
              if (tsFileStats && tsFileStats.isFile()) {
                // Read plugin content
                const content = await fs.readFile(tsPluginPath, 'utf8');
                
                // Send plugin content via socket
                socket.emit(`plugin:${data.name}`, { content });
                console.log(`Plugin sent via socket: ${data.name} (TypeScript)`);
              } else {
                // Plugin not found
                socket.emit(`plugin:${data.name}`, { error: 'Plugin not found' });
                console.log(`Plugin not found: ${pluginPath}`);
              }
            }
          } catch (error) {
            // Error reading plugin
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            socket.emit(`plugin:${data.name}`, { error: errorMessage });
            console.error(`Error serving plugin ${pluginPath}:`, error);
          }
        }
      });
      
      // Handle component loading
      socket.on('load:component', async (data: { name: string }) => {
        if (data && data.name) {
          const componentPath = path.resolve(process.cwd(), 'components', data.name);
          console.log(`Component requested via socket: ${componentPath}`);
          
          try {
            // Check if component exists
            const fileStats = await fs.stat(componentPath).catch(() => null);
            
            if (fileStats && fileStats.isFile()) {
              // Read component content
              const content = await fs.readFile(componentPath, 'utf8');
              
              // Send component content via socket
              socket.emit(`component:${data.name}`, { content });
              console.log(`Component sent via socket: ${data.name}`);
            } else {
              // Try HTML extension if not specified
              const htmlPath = !componentPath.endsWith('.html') ? componentPath + '.html' : componentPath;
              const htmlStats = await fs.stat(htmlPath).catch(() => null);
              
              if (htmlStats && htmlStats.isFile()) {
                // Read HTML component content
                const content = await fs.readFile(htmlPath, 'utf8');
                
                // Send component content via socket
                socket.emit(`component:${data.name}`, { content });
                console.log(`Component sent via socket: ${data.name}`);
              } else {
                // Try TypeScript extension
                const tsComponentPath = componentPath.replace(/\.js$/, '.ts');
                const tsFileStats = await fs.stat(tsComponentPath).catch(() => null);
                
                if (tsFileStats && tsFileStats.isFile()) {
                  // Read TypeScript component content
                  const content = await fs.readFile(tsComponentPath, 'utf8');
                  
                  // Send component content via socket
                  socket.emit(`component:${data.name}`, { content });
                  console.log(`Component sent via socket: ${data.name} (TypeScript)`);
                } else {
                  // Component not found
                  socket.emit(`component:${data.name}`, { error: 'Component not found' });
                  console.log(`Component not found: ${componentPath}`);
                }
              }
            }
          } catch (error) {
            // Error reading component
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            socket.emit(`component:${data.name}`, { error: errorMessage });
            console.error(`Error serving component ${componentPath}:`, error);
          }
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', (): any => {
        console.log('Client disconnected');
      });
    });
  }
  
  public start(): Promise<http.Server> {
    return new Promise((resolve): any => {
      this.server.listen(this.port, (): any => {
        console.log(`WebSocket Server running on port ${this.port}`);
        console.log(`Server ready to serve dependencies via WebSockets`);
        resolve(this.server);
      });
    });
  }
  
  public stop(): Promise<void> {
    return new Promise((resolve): any => {
      if (this.server) {
        this.server.close((): any => {
          console.log('WebSocket Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default WebSocketServerManager;
