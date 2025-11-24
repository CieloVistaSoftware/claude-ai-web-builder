const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Log issue endpoint
app.post('/api/log', async (req, res) => {
  try {
    const { description, expected, actual, filePath, timestamp } = req.body;

    // Validate required field
    if (!description) {
      return res.status(400).json({ 
        error: 'Description is required' 
      });
    }

    // Generate markdown
    let markdown = `## 📝 ${new Date(timestamp).toLocaleString()}\n\n`;
    markdown += `### Description\n\n${description}\n\n`;
    
    if (expected) {
      markdown += `**Expected:** ${expected}  \n`;
    }
    
    if (actual) {
      markdown += `**Actual:** ${actual}  \n`;
    }
    
    if (filePath) {
      markdown += `**File:** \`${filePath}\`  \n`;
    }
    
    markdown += `\n---\n\n`;

    // Find or create claude.md file
    const claudeFile = path.join(process.cwd(), 'claude.md');
    
    // Check if file exists
    try {
      await fs.access(claudeFile);
    } catch {
      // Create file with header if it doesn't exist
      const header = `# Claude Issues Log\n\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
      await fs.writeFile(claudeFile, header);
    }

    // Append the new issue
    await fs.appendFile(claudeFile, markdown);

    console.log(`✅ Logged issue at ${new Date(timestamp).toLocaleString()}`);

    res.json({ 
      success: true, 
      message: 'Issue logged successfully',
      file: claudeFile
    });

  } catch (error) {
    console.error('❌ Error logging issue:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Get all logs endpoint (optional)
app.get('/api/logs', async (req, res) => {
  try {
    const claudeFile = path.join(process.cwd(), 'claude.md');
    
    try {
      const content = await fs.readFile(claudeFile, 'utf8');
      res.json({ 
        success: true, 
        content 
      });
    } catch {
      res.json({ 
        success: true, 
        content: '# No logs yet' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Claude Logger Backend Running!

📍 Server: http://localhost:${PORT}
📝 Logs will be saved to: ${path.join(process.cwd(), 'claude.md')}

Endpoints:
- POST /api/log     - Log a new issue
- GET  /api/logs    - Get all logged issues
- GET  /api/health  - Health check

Press Ctrl+C to stop
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Claude Logger backend...');
  process.exit(0);
});
