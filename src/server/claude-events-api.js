/**
 * Claude Events API Server
 * Simple Express server to provide AI assistants with access to logged events
 * Endpoints for retrieving, filtering, and managing claude.md events
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Simple CORS middleware (no external package needed)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve from wb root

/**
 * GET /api/events/dir?path=components/wb-button
 * Get all events from a specific directory's claude.md file
 */
app.get('/api/events/dir', async (req, res) => {
    try {
        const directory = req.query.path || '';
        const claudePath = path.join(__dirname, '..', directory, 'claude.md');
        
        // Check if file exists
        try {
            await fs.access(claudePath);
        } catch {
            return res.json({ events: [], message: 'No claude.md file found', directory });
        }
        
        const content = await fs.readFile(claudePath, 'utf8');
        const events = parseClaudeEvents(content);
        
        res.json({
            directory,
            eventCount: events.length,
            events,
            lastModified: (await fs.stat(claudePath)).mtime
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/events
 * Get all events from all claude.md files in the project
 */
app.get('/api/events', async (req, res) => {
    try {
        const allEvents = await findAllClaudeFiles();
        res.json({
            totalFiles: allEvents.length,
            totalEvents: allEvents.reduce((sum, file) => sum + file.events.length, 0),
            files: allEvents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/errors
 * Get only error-level events from all claude.md files
 */
app.get('/api/errors', async (req, res) => {
    try {
        const allEvents = await findAllClaudeFiles();
        const errorEvents = allEvents.map(file => ({
            ...file,
            events: file.events.filter(event => 
                event.type === 'error' || 
                event.level === 'error' ||
                event.message?.toLowerCase().includes('error') ||
                event.title?.toLowerCase().includes('error')
            )
        })).filter(file => file.events.length > 0);
        
        res.json({
            errorFiles: errorEvents.length,
            totalErrors: errorEvents.reduce((sum, file) => sum + file.events.length, 0),
            files: errorEvents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/recent/:hours
 * Get events from the last N hours across all files
 */
app.get('/api/recent/:hours', async (req, res) => {
    try {
        const hours = parseInt(req.params.hours) || 24;
        const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
        
        const allEvents = await findAllClaudeFiles();
        const recentEvents = allEvents.map(file => ({
            ...file,
            events: file.events.filter(event => 
                event.timestamp && new Date(event.timestamp) > cutoffTime
            )
        })).filter(file => file.events.length > 0);
        
        res.json({
            hoursBack: hours,
            recentFiles: recentEvents.length,
            totalRecentEvents: recentEvents.reduce((sum, file) => sum + file.events.length, 0),
            files: recentEvents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/save-claude-log
 * Save events to a specific directory's claude.md file
 */
app.post('/api/save-claude-log', async (req, res) => {
    try {
        const { filename, content, folder, referer } = req.body;
        
        if (!filename || !content) {
            return res.status(400).json({ error: 'Missing filename or content' });
        }
        
        // Determine directory based on referer URL or folder parameter
        let targetDirectory;
        if (referer) {
            // Extract directory from referer URL
            const refererPath = new URL(referer).pathname;
            const refererDir = path.dirname(refererPath);
            // Remove leading slash and resolve relative to project root
            targetDirectory = path.join(__dirname, '..', refererDir.substring(1));
        } else {
            // Fallback to folder parameter or current directory
            targetDirectory = path.join(__dirname, '..', folder || '.');
        }
        
        const filePath = path.join(targetDirectory, filename);
        
        // Ensure directory exists
        await fs.mkdir(targetDirectory, { recursive: true });
        
        // Prepend to existing file or create new
        let existingContent = '';
        try {
            existingContent = await fs.readFile(filePath, 'utf8');
        } catch (error) {
            // File doesn't exist, that's fine
        }
        
        // Prepend new content at the top
        const newContent = content + '\n' + existingContent;
        await fs.writeFile(filePath, newContent);
        
        console.log(`✅ Saved ${content.length} characters to ${filePath}`);
        console.log(`📝 Content preview: ${content.substring(0, 100)}...`);
        
        res.json({ 
            success: true, 
            message: `Saved to ${filePath}`,
            directory: path.relative(path.join(__dirname, '..'), targetDirectory),
            filename,
            actualPath: filePath,
            contentLength: content.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health
 * API health check
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints: [
            'GET /api/events/dir?path=directory',
            'GET /api/events',
            'GET /api/errors', 
            'GET /api/recent/:hours',
            'POST /api/save-claude-log'
        ]
    });
});

/**
 * Parse claude.md content into structured events
 */
function parseClaudeEvents(content) {
    const events = [];
    const lines = content.split('\n');
    let currentEvent = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detect event headers
        if (line.startsWith('## ') && (line.includes('Error') || line.includes('Event Log') || line.includes('JavaScript'))) {
            if (currentEvent) events.push(currentEvent);
            
            currentEvent = {
                title: line.replace('## ', ''),
                timestamp: extractTimestamp(line),
                type: detectEventType(line),
                content: [],
                lineStart: i
            };
        } else if (currentEvent && line.trim()) {
            currentEvent.content.push(line);
            
            // Extract specific fields
            if (line.includes('**Type**:')) {
                currentEvent.errorType = line.split('**Type**:')[1]?.trim();
            }
            if (line.includes('**Message**:')) {
                currentEvent.message = line.split('**Message**:')[1]?.trim();
            }
            if (line.includes('**File**:')) {
                currentEvent.file = line.split('**File**:')[1]?.trim();
            }
            if (line.includes('**Line**:')) {
                currentEvent.line = line.split('**Line**:')[1]?.trim();
            }
        }
        
        // End event on separator
        if (line.trim() === '---' && currentEvent) {
            currentEvent.lineEnd = i;
            events.push(currentEvent);
            currentEvent = null;
        }
    }
    
    // Don't forget the last event
    if (currentEvent) events.push(currentEvent);
    
    return events;
}

/**
 * Find all claude.md files in the project
 */
async function findAllClaudeFiles() {
    const results = [];
    const rootDir = path.join(__dirname, '..');
    
    async function scanDirectory(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    await scanDirectory(fullPath);
                } else if (entry.name === 'claude.md') {
                    try {
                        const content = await fs.readFile(fullPath, 'utf8');
                        const events = parseClaudeEvents(content);
                        const stats = await fs.stat(fullPath);
                        
                        results.push({
                            directory: path.relative(rootDir, dir),
                            filePath: path.relative(rootDir, fullPath),
                            events,
                            eventCount: events.length,
                            lastModified: stats.mtime,
                            size: stats.size
                        });
                    } catch (error) {
                        console.warn(`Error reading ${fullPath}:`, error.message);
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }
    
    await scanDirectory(rootDir);
    return results;
}

/**
 * Helper functions
 */
function extractTimestamp(line) {
    const match = line.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/);
    return match ? match[1] : null;
}

function detectEventType(line) {
    const lower = line.toLowerCase();
    if (lower.includes('error') || lower.includes('🚨')) return 'error';
    if (lower.includes('warning') || lower.includes('⚠️')) return 'warning';
    if (lower.includes('info') || lower.includes('ℹ️')) return 'info';
    return 'unknown';
}

/**
 * Start server
 */
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Claude Events API Server running on http://localhost:${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   GET  /api/health - API health check`);
    console.log(`   GET  /api/events - All events from all files`);
    console.log(`   GET  /api/errors - Only error events`);
    console.log(`   GET  /api/recent/24 - Events from last 24 hours`);
    console.log(`   GET  /api/events/dir?path=components/wb-button - Events from specific directory`);
    console.log(`   POST /api/save-claude-log - Save new events to claude.md`);
    console.log(`\n🤖 AI assistants can now call these endpoints to get and fix broken events!`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port or kill the existing process.`);
    } else {
        console.error(`❌ Server error:`, error);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n📴 Shutting down Claude Events API Server...');
    server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
    });
});

export default app;