#!/usr/bin/env node
// open-in-vite.js
// Usage: node open-in-vite.js <absolute-file-path>
// Opens the corresponding Vite dev server URL in the default browser

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const VITE_PORT = 5173; // Change if you use a different port
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function toViteUrl(absPath) {
  // Get the path relative to the project root
  let rel = path.relative(PROJECT_ROOT, absPath).replace(/\\/g, '/');
  return `http://localhost:${VITE_PORT}/${rel}`;
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node open-in-vite.js <absolute-file-path>');
  process.exit(1);
}

const url = toViteUrl(file);
console.log('Opening', url);

// Windows: use start, Mac: open, Linux: xdg-open
const openCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
exec(openCmd);
