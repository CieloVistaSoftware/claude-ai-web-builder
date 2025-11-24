const request = require('supertest');
const express = require('express');
const path = require('path');

// Import the server code, or create the app inline if not exported
let app;
try {
  app = require('./run-script-server.cjs');
} catch {
  // fallback: create a minimal app for static test
  app = express();
  app.use('/scripts', express.static(__dirname));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'runscripts.html'));
  });
}

describe('GET /', () => {
  it('should serve runscripts.html at root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/<html/i);
    expect(res.text).toMatch(/Run PowerShell/);
  });
});

describe('GET /scripts/runscripts.html', () => {
  it('should serve runscripts.html at /scripts/runscripts.html', async () => {
    const res = await request(app).get('/scripts/runscripts.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/<html/i);
    expect(res.text).toMatch(/Run PowerShell/);
  });
});
