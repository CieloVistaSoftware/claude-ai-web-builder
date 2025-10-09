// Test server for WB components
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use PORT from environment (set by Playwright) or find available port
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname.replace(path.sep + 'tests', '');

console.log('Starting WB test server...');
console.log('Root directory:', ROOT_DIR);
console.log('Target port:', PORT);

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

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    let url = req.url;
    
    // Default to index.html if root is requested
    if (url === '/') {
        url = '/index.html';
    }
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Construct the file path
    const filePath = path.join(ROOT_DIR, url);
    console.log(`Serving: ${filePath}`);
    
    // Get the file extension
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`File not found: ${filePath}`);
                res.writeHead(404);
                res.end(`File not found: ${url}`);
            } else {
                console.error(`Server error: ${err.code}`, err);
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start server on the specified port only (no fallback)
// Playwright will handle port management
server.listen(PORT, (err) => {
    if (err) {
        console.error(`❌ Failed to start server on port ${PORT}:`, err.message);
        process.exit(1);
    } else {
        console.log(`✅ WB test server running at http://localhost:${PORT}/`);
        console.log(`📁 Serving files from: ${ROOT_DIR}`);
    }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

export { server, PORT };