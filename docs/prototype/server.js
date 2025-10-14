// Simple Express server to serve prototype IDE and grant access to both components and styles folders
const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Serve prototype IDE static files
app.use('/', express.static(path.join(__dirname)));

// Serve components folder (read-only)
app.use('/components', express.static(path.resolve(__dirname, '../../../components')));

// Serve styles folder (read-only)
app.use('/styles', express.static(path.resolve(__dirname, '../../../styles')));

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/simple-ide.html`;
  console.log(`WB Prototype IDE server running at ${url}`);
  // Dynamically import open (ESM-only)
  import('open').then(mod => mod.default(url));
});
