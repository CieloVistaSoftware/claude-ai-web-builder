const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_DIR = path.join(__dirname);

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  // Parse URL to remove query parameters
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let requestPath = url.pathname;
  
  let filePath;
  if (requestPath === '/' || requestPath === '/index.html') {
    filePath = path.join(BASE_DIR, 'wb', 'wb.html');
  } else if (requestPath.startsWith('/dist/')) {
    filePath = path.join(BASE_DIR, requestPath);
  } else if (requestPath.endsWith('/')) {
    // Handle directory requests by looking for index.html
    filePath = path.join(BASE_DIR, requestPath, 'index.html');
  } else {
    filePath = path.join(BASE_DIR, requestPath);
  }
  
  console.log(`Attempting to serve: ${filePath}`);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
      } else {
        console.error(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Get file extension to determine content type
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      
      switch (ext) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log(`Successfully served: ${filePath}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving from directory: ${BASE_DIR}`);
  console.log(`Main page: http://localhost:${PORT}/wb/wb.html`);
});
