// @ts-nocheck
// Server for Website Builder - Frontend & Backend
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3000;
const WORKING_DIR = __dirname;

console.log('🚀 Starting Website Builder Server');
console.log('- Working directory:', WORKING_DIR);
console.log('- Port:', PORT);

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res): any => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  try {
    // Parse URL and handle special cases
    let url = req.url;

    // Default to index.html for root requests
    if (url === '/' || url === '/index' || url === '/home') {
      url = '/index.html';
    }

    // Add CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Construct file path
    const filePath = path.join(WORKING_DIR, url);

    // Security: ensure file is within working directory
    if (!filePath.startsWith(WORKING_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden: Access denied');
      return;
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`[ERROR] File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - File Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .error { color: #e74c3c; }
            .path { background: #f8f9fa; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - File Not Found</h1>
          <p>The requested file could not be found:</p>
          <div class="path">${url}</div>
          <p><a href="/">← Back to Home</a></p>
        </body>
        </html>
      `);
      return;
    }

    // Get file stats
    const stats = fs.statSync(filePath);

    // If it's a directory, try to serve index.html
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return serveFile(indexPath, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: Directory listing not allowed');
        return;
      }
    }

    // Serve the file
    serveFile(filePath, res);

  } catch (error) {
    console.error('[ERROR] Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

// Helper function to serve files
function serveFile(filePath, res): any {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve the file
    const content = fs.readFileSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': 'no-cache' // Disable caching for development
    });
    res.end(content);

    console.log(`[SUCCESS] Served: ${filePath} (${contentType})`);
  } catch (error) {
    console.error('[ERROR] Error serving file:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
}

// Start the server
server.listen(PORT, (): any => {
  console.log('✅ Website Builder Server running successfully!');
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 Backend API: http://localhost:${PORT}/api`);
  console.log('🔄 Auto-reload enabled for development');
  console.log('');
  console.log('📁 Serving files from:', WORKING_DIR);
  console.log('🛠️  Ready for development!');
});

// Handle server errors
server.on('error', (error): any => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Run 'npm run kill-ports' first.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', (): any => {
  console.log('\\n🛑 Shutting down server gracefully...');
  server.close((): any => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', (): any => {
  console.log('\\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close((): any => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});
