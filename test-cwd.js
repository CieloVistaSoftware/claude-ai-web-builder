// test-cwd.js - Quick test to see what the actual CWD is
console.log('Current Working Directory:', process.cwd());
console.log('Directory Name:', require('path').basename(process.cwd()));
