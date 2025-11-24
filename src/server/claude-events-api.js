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
 * POST /api/claude-log
 * Append log entries to component claude.md files (used by claude-logger.js)
 */
app.post('/api/claude-log', async (req, res) => {
    try {
        const { component, entry } = req.body;
        
        console.log('📥 Received log request:', { component, entry });
        
        if (!component || !entry) {
            console.error('❌ Missing required fields:', { component, entry });
            return res.status(400).json({ error: 'Missing component or entry' });
        }

        // Determine component directory
        const componentDir = path.join(__dirname, '..', '..', 'components', component);
        
        // Check which claude.md file exists (green, red, or plain)
        const greenPath = path.join(componentDir, '✅ claude.md');
        const redPath = path.join(componentDir, '🔴 claude.md');
        const plainPath = path.join(componentDir, 'claude.md');
        
        let claudePath = plainPath;
        try {
            await fs.access(greenPath);
            claudePath = greenPath;
        } catch {
            try {
                await fs.access(redPath);
                claudePath = redPath;
            } catch {
                // Use plain path
            }
        }
        
        console.log('📂 Writing to:', claudePath);
        
        // Ensure directory and file exist
        await ensureClaudeMdExists(claudePath, component);
        
        // Determine if this is an error
        const isError = entry.type === 'error' || 
                       (entry.description && entry.description.toLowerCase().includes('error'));
        
        // Rename file based on error status
        let finalPath = claudePath;
        if (isError) {
            // Should be red
            if (claudePath !== redPath) {
                try {
                    await fs.rename(claudePath, redPath);
                    finalPath = redPath;
                    console.log('🔴 RENAMED to red (has errors):', redPath);
                } catch (err) {
                    console.error('Failed to rename to red:', err.message);
                }
            }
            // Create error marker
            const errorMarkerPath = path.join(componentDir, '.HAS-ERRORS');
            await fs.writeFile(errorMarkerPath, `Error logged at: ${new Date().toISOString()}\n`, 'utf8');
        } else {
            // No error - should be green (if not already)
            if (claudePath !== greenPath && claudePath !== redPath) {
                try {
                    await fs.rename(claudePath, greenPath);
                    finalPath = greenPath;
                    console.log('✅ RENAMED to green (no errors):', greenPath);
                } catch (err) {
                    console.error('Failed to rename to green:', err.message);
                }
            } else {
                finalPath = claudePath;
            }
        }
        
        // Format and append log entry to the final path
        const logEntry = formatLogEntry(entry);
        await appendToClaudeMd(finalPath, logEntry);
        
        console.log(`✅ [${entry.type}] ${entry.title || entry.description} → ${component}/claude.md`);
        
        res.json({ 
            success: true, 
            message: `Log written to ${component}/claude.md`,
            component,
            filePath: claudePath,
            timestamp: entry.timestamp,
            hasErrors: isError
        });
        
    } catch (error) {
        console.error('❌ Error writing to claude.md:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to write log', 
            details: error.message 
        });
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
            'POST /api/claude-log',
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
 * Helper functions for claude-log API
 */
async function ensureClaudeMdExists(filePath, component) {
    try {
        await fs.access(filePath);
    } catch (error) {
        // File doesn't exist, create it with template
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        
        const template = createClaudeMdTemplate(component);
        await fs.writeFile(filePath, template, 'utf8');
        
        console.log(`📄 Created new claude.md for ${component}`);
    }
}

function createClaudeMdTemplate(component) {
    const date = new Date().toISOString().split('T')[0];
    
    return `# ${component} - Development Log

**Component:** ${component}  
**Created:** ${date}  
**Last Updated:** ${date}

## Overview
This file tracks development progress, issues, fixes, and testing for the ${component} component.

---

## Issues

<!-- Issues will be logged here automatically -->

---

## Fixes

<!-- Fixes will be logged here automatically -->

---

## Tests

<!-- Test results will be logged here automatically -->

---

## Notes

<!-- General notes will be logged here automatically -->

`;
}

function formatLogEntry(entry) {
    const timestamp = entry.timestamp || new Date().toISOString();
    const type = entry.type || 'issue';
    const title = entry.title || entry.description || 'Untitled Entry';
    
    // Detect if this is an error
    const isError = type === 'error' || 
                   (entry.description && entry.description.toLowerCase().includes('error')) ||
                   (title && title.toLowerCase().includes('error'));
    
    // Use red circle emoji for errors
    const icon = isError ? '🔴' : '📝';
    
    let formatted = `\n### ${icon} ${title}\n\n`;
    formatted += `**Date:** ${timestamp.split('T')[0]} ${timestamp.split('T')[1]?.split('.')[0] || ''}  \n`;
    formatted += `**Type:** ${type}${isError ? ' ⚠️' : ''}  \n`;
    
    // Handle description-based entries from claude-logger
    if (entry.description && entry.description !== title) {
        formatted += `\n**Description:** ${entry.description}\n\n`;
    }
    
    if (entry.expected) {
        formatted += `**Expected Behavior:** ${entry.expected}  \n`;
    }
    
    if (entry.actual) {
        formatted += `**Actual Behavior:** ${entry.actual}  \n`;
    }
    
    if (entry.filePath) {
        formatted += `**File Path:** \`${entry.filePath}\`  \n`;
    }
    
    // Handle message-based entries
    if (entry.message && entry.message !== title) {
        formatted += `\n${entry.message}\n\n`;
    }
    
    if (entry.url) {
        formatted += `**URL:** ${entry.url}  \n`;
    }
    
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        formatted += `\n**Metadata:**\n\`\`\`json\n${JSON.stringify(entry.metadata, null, 2)}\n\`\`\`\n\n`;
    }
    
    formatted += `\n---\n`;
    
    return formatted;
}

async function appendToClaudeMd(filePath, content) {
    try {
        const existing = await fs.readFile(filePath, 'utf8');
        
        // Update "Last Updated" timestamp
        const updated = existing.replace(
            /\*\*Last Updated:\*\* .+/,
            `**Last Updated:** ${new Date().toISOString().split('T')[0]}`
        );
        
        // PREPEND new content right after Issues header (most recent first)
        const issuesMarker = '<!-- Issues will be logged here automatically -->';
        const markerIndex = updated.indexOf(issuesMarker);
        
        if (markerIndex !== -1) {
            const insertPosition = markerIndex + issuesMarker.length;
            const newContent = updated.slice(0, insertPosition) + '\n' + content + updated.slice(insertPosition);
            await fs.writeFile(filePath, newContent, 'utf8');
        } else {
            // Fallback: try old Session Logs marker
            const sessionLogsMarker = '<!-- Session logs are appended below -->';
            const sessionIndex = updated.indexOf(sessionLogsMarker);
            if (sessionIndex !== -1) {
                const insertPosition = sessionIndex + sessionLogsMarker.length;
                const newContent = updated.slice(0, insertPosition) + '\n' + content + updated.slice(insertPosition);
                await fs.writeFile(filePath, newContent, 'utf8');
            } else {
                // Last resort: append to end
                const newContent = updated + content;
                await fs.writeFile(filePath, newContent, 'utf8');
            }
        }
    } catch (error) {
        throw new Error(`Failed to append to claude.md: ${error.message}`);
    }
}

/**
 * Helper functions for event parsing
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
    console.log(`   POST /api/claude-log - Append log to component claude.md (from claude-logger.js)`);
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