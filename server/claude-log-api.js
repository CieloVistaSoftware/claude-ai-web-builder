/**
 * Claude Log API Server
 * Handles writing logs to claude.md files
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

export async function handleClaudeLog(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { component, entry } = JSON.parse(body);
            
            if (!component || !entry) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing component or entry' }));
                return;
            }

            // Determine claude.md file path
            const claudePath = path.join(PROJECT_ROOT, 'components', component, 'claude.md');
            
            // Check if file exists, create if needed
            await ensureClaudeMdExists(claudePath, component);
            
            // Append log entry to claude.md
            const logEntry = formatLogEntry(entry);
            await appendToClaudeMd(claudePath, logEntry);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: `Log written to ${component}/claude.md` 
            }));
            
            console.log(`📝 Log written to ${component}/claude.md`);
        } catch (error) {
            console.error('❌ Error writing to claude.md:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Failed to write log', 
                details: error.message 
            }));
        }
    });
}

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

---

## Session Logs

<!-- Session logs are appended below -->

`;
}

function formatLogEntry(entry) {
    const { timestamp, title, message, type, emoji, url, metadata } = entry;
    
    let formatted = `\n### ${emoji} ${title}\n\n`;
    formatted += `**Date:** ${timestamp}  \n`;
    formatted += `**Type:** ${type}  \n`;
    formatted += `**URL:** ${url}  \n\n`;
    formatted += `${message}\n\n`;
    
    if (metadata && Object.keys(metadata).length > 0) {
        formatted += `**Metadata:**\n\`\`\`json\n${JSON.stringify(metadata, null, 2)}\n\`\`\`\n\n`;
    }
    
    formatted += `---\n`;
    
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
        
        // Append new content
        const newContent = updated + content;
        
        await fs.writeFile(filePath, newContent, 'utf8');
    } catch (error) {
        throw new Error(`Failed to append to claude.md: ${error.message}`);
    }
}

export default handleClaudeLog;
