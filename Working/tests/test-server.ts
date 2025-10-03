// @ts-nocheck
// Enhanced HTTP server for testing
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3000;
const WORKING_DIR = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(__dirname, '..', '..');

console.log('Starting test server with directories:');
console.log('- Working dir: ', WORKING_DIR);
console.log('- Parent dir: ', PARENT_DIR);

// MIME types
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
};

// Create a server with improved error handling
const server = http.createServer((req, res): any => {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.url}`);

  // Parse URL and handle special cases
  let url = req.url;

  try {
    // Default to index.html if root is requested
    if (url === '/' || url === '/wb.html') {
      url = '/index.html';
    }

    // Add CORS headers to support cross-origin requests during testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Determine which directory to use based on URL prefix
    let basePath = WORKING_DIR;
    if (url.startsWith('/Working/')) {
      // Redirect to request from main project directory
      url = url.replace('/Working', '');
      console.log(`Rewriting URL to ${url}`);
    } else if (!url.startsWith('/Working') && url.startsWith('/')) {
      // When accessing from the root path, serve from Working dir
      basePath = WORKING_DIR;
    }

    // Construct the file path
    const filePath = path.join(basePath, url);
    console.log(`Serving: ${filePath}`);

    // Get the file extension
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read the file
    fs.readFile(filePath, (err, content): any => {
      if (err) {
        // Handle file not found
        if (err.code === 'ENOENT') {
          console.error(`[ERROR] File not found: ${filePath}`);

          // Try parent dir as fallback
          const parentFilePath = path.join(PARENT_DIR, url);
          console.log(`Trying parent directory: ${parentFilePath}`);

          fs.readFile(parentFilePath, (parentErr, parentContent): any => {
            if (parentErr) {
              console.error(`[ERROR] File not found in parent dir either: ${parentFilePath}`);
              res.writeHead(404);
              res.end(`File not found: ${url}`);
            } else {
              console.log(`Served from parent dir: ${parentFilePath}`);
              res.writeHead(200, { 'Content-Type': contentType });
              res.end(parentContent, 'utf-8');
            }
          });
        } else {
          // Handle other errors
          console.error(`[ERROR] Server error: ${err.code}`, err);
          res.writeHead(500);
          res.end(`Server error: ${err.code}`);
        }
      } else {
        // Successfully serve the file
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } catch (e) {
    console.error('[FATAL ERROR]', e);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Start the server only if this file is run directly
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  server.listen(PORT, (): any => {
    console.log(`Test server running at http://localhost:${PORT}/`);
  });
}

// Export server and port for ES modules
export { server, PORT };
