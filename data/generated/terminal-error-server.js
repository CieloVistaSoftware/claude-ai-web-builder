/**
 * Terminal Error Logging Server
 * Simple server to log browser errors to terminal console
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8081;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Terminal error logging endpoint
app.post('/api/terminal-log', (req, res) => {
    const { timestamp, type, message, data, url, stack } = req.body;
    
    // Log to terminal with clear formatting
    console.log('\n🚨 === BROWSER ERROR IN TERMINAL ===');
    console.log(`⏰ TIME: ${timestamp}`);
    console.log(`🏷️  TYPE: ${type}`);
    console.log(`📝 MESSAGE: ${message}`);
    console.log(`🌐 URL: ${url}`);
    console.log(`📜 STACK: ${stack}`);
    console.log('===================================\n');
    
    res.json({ success: true, logged: true });
});

// Legacy log-error endpoint (405 error fix)
app.all('/api/log-error', (req, res) => {
    if (req.method === 'POST') {
        const error = req.body;
        console.log('\n🚨 === LEGACY ERROR LOG ===');
        console.log(JSON.stringify(error, null, 2));
        console.log('==========================\n');
        res.json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed', allowed: ['POST'] });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        terminalLogging: true 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Terminal Error Logging Server running on http://localhost:${PORT}`);
    console.log('🔍 Browser errors will be displayed in this terminal');
});

module.exports = app;