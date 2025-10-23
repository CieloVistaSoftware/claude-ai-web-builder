/**
 * WB Framework RAG Server
 * 
 * Simple Express server that:
 * 1. Serves the RAG assistant HTML
 * 2. Proxies Claude API requests (avoiding CORS issues)
 * 3. Serves the knowledge base JSON
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Simple .env loader (no dependencies needed)
function loadEnv() {
    const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                process.env[key.trim()] = value;
            }
        });
        console.log('✅ Loaded .env file');
    }
}

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(rootDir)); // Serve from project root

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
    try {
        console.log('📨 Proxying request to Claude API...');
        
        const { userMessage, context } = req.body;
        
        // Validate API key
        const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
        if (!apiKey || apiKey === 'your-api-key-here') {
            console.error('❌ No valid API key found!');
            return res.status(500).json({
                success: false,
                error: 'API key not configured. Set CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable.'
            });
        }
        
        const systemPrompt = `You are an expert AI assistant for the WB Framework, a comprehensive web component library.

${context}

CRITICAL Instructions:
- Answer questions based on the context provided above
- Be specific and reference actual component names, methods, and examples from the framework  
- Provide code examples when helpful
- Be friendly and concise
- ALWAYS respond in PURE MARKDOWN format only
- NEVER use HTML tags like <br>, <strong>, <code>, etc in your response
- Use markdown syntax: **bold**, *italic*, \`code\`, \`\`\`code blocks\`\`\`, # headers, - lists
- Code blocks must use proper markdown fences with language specified
- Example: \`\`\`javascript\ncode here\n\`\`\``;

        console.log('🔑 Using API key:', apiKey.substring(0, 10) + '...');
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 2000,
                messages: [
                    { role: "user", content: userMessage }
                ],
                system: systemPrompt
            })
        });

        console.log('📡 API Response Status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Claude API Error Response:', errorText);
            return res.status(response.status).json({
                success: false,
                error: `Claude API error (${response.status}): ${errorText.substring(0, 200)}`
            });
        }

        const data = await response.json();
        console.log('✅ Claude responded successfully');
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            console.error('❌ Unexpected API response format:', JSON.stringify(data));
            return res.status(500).json({
                success: false,
                error: 'Unexpected API response format'
            });
        }
        
        res.json({
            success: true,
            response: data.content[0].text
        });

    } catch (error) {
        console.error('❌ Server Error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'WB RAG Server' });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 WB Framework RAG Server Started!');
    console.log('==========================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🤖 Demo: http://localhost:${PORT}/components/wb-rag/wb-rag-demo.html`);
    console.log(`📚 Knowledge Base: http://localhost:${PORT}/knowledge-base.json`);
    console.log('\n💡 Make sure to set ANTHROPIC_API_KEY in .env file!');
    console.log('==========================================\n');
});
