require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const DOCS_FOLDER = path.join('C:', 'Users', 'jwpmi', 'Downloads', 'AI', 'wb', 'components', 'wb-control-panel', 'docs');

// Function to open browser
function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      console.log(`⚠️  Could not open browser automatically. Please visit: ${url}`);
    }
  });
}

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Cache for documentation content
let docsCache = {};
let docsIndex = [];

// Load all documentation files
async function loadDocumentation() {
  try {
    // Check if docs folder exists, create if it doesn't
    try {
      await fs.access(DOCS_FOLDER);
    } catch {
      console.log('📁 Creating docs folder...');
      await fs.mkdir(DOCS_FOLDER, { recursive: true });
      console.log('✅ Docs folder created! Add your WB documentation files here.');
      return;
    }
    
    const files = await fs.readdir(DOCS_FOLDER, { recursive: true });
    
    for (const file of files) {
      const filePath = path.join(DOCS_FOLDER, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile() && (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json'))) {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          docsCache[file] = content;
          docsIndex.push({
            filename: file,
            path: filePath,
            content: content.toLowerCase()
          });
          console.log(`📄 Loaded: ${file}`);
        } catch (err) {
          console.error(`Error reading ${file}:`, err.message);
        }
      }
    }
    
    console.log(`✅ Loaded ${docsIndex.length} documentation files`);
    
    if (docsIndex.length === 0) {
      console.log('⚠️  No documentation files found. Add .md, .txt, or .json files to the docs folder.');
    }
  } catch (error) {
    console.error('Error loading documentation:', error.message);
  }
}

// Search documentation for relevant content
function searchDocs(query) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  const results = [];
  
  for (const doc of docsIndex) {
    let score = 0;
    let matchedContent = [];
    
    for (const term of searchTerms) {
      if (doc.content.includes(term)) {
        score++;
        
        // Extract relevant snippet
        const index = doc.content.indexOf(term);
        const start = Math.max(0, index - 100);
        const end = Math.min(doc.content.length, index + 200);
        const snippet = docsCache[doc.filename].substring(start, end).trim();
        
        if (snippet && !matchedContent.includes(snippet)) {
          matchedContent.push(snippet);
        }
      }
    }
    
    if (score > 0) {
      results.push({
        filename: doc.filename,
        score: score,
        snippets: matchedContent.slice(0, 2) // Limit to 2 snippets per file
      });
    }
  }
  
  // Sort by relevance score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 3); // Return top 3 results
}

// WB Component knowledge base
const wbKnowledge = {
  'wb': 'WB is a comprehensive component with extensive documentation. Ask me anything about its features, usage, or implementation!',
  'component': 'The WB component is fully documented in the docs folder. I can search through all documentation to answer your questions.',
  'documentation': `All WB component documentation is stored in the docs folder. I have access to ${docsIndex.length} documentation files.`,
  'docs': `I have loaded ${docsIndex.length} documentation files about the WB component. Ask me anything specific!`,
  'help': 'I can search through all WB component documentation to answer your questions. Just ask naturally about any feature, function, or topic related to WB!',
  'files': `Currently loaded: ${docsIndex.length} documentation files from the docs folder.`
};

// Enhanced chatbot logic with documentation search
function getBotResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for exact matches in knowledge base
  for (const [key, value] of Object.entries(wbKnowledge)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }
  
  // Special greetings
  if (lowerMessage.match(/^(hello|hi|hey|greetings)/)) {
    return `Hello! I'm the WB Component Assistant. I have access to ${docsIndex.length} documentation files and can answer questions about any aspect of the WB component. What would you like to know?`;
  }
  
  if (lowerMessage.match(/^(bye|goodbye|see you)/)) {
    return 'Goodbye! Feel free to return anytime you have questions about the WB component!';
  }
  
  if (lowerMessage.includes('help') || lowerMessage === '?') {
    return `I can help you find information in the WB component documentation. I've loaded ${docsIndex.length} files. Just ask your question naturally, and I'll search through all the docs!`;
  }
  
  // Search documentation
  const searchResults = searchDocs(message);
  
  if (searchResults.length > 0) {
    let response = 'Here\'s what I found in the WB documentation:\n\n';
    
    searchResults.forEach((result, index) => {
      response += `📄 **${result.filename}**\n`;
      if (result.snippets.length > 0) {
        response += `${result.snippets[0]}\n`;
        if (result.snippets.length > 1) {
          response += `\n...${result.snippets[1]}\n`;
        }
      }
      response += '\n';
    });
    
    return response.trim();
  }
  
  // Default response
  return `I couldn't find specific information about "${message}" in the WB documentation. Try rephrasing your question or ask about general WB component features. You can also ask "help" to learn more about what I can do!`;
}

// Chatbot endpoint
app.post('/chat', (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }
    
    const botResponse = getBotResponse(userMessage);
    
    res.json({
      success: true,
      message: botResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong!',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Start server
app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  
  console.log(`🤖 Cielo Vista Software WB Chatbot is running!`);
  console.log(`🌐 Server: ${url}`);
  console.log(`📝 API endpoint: ${url}/chat`);
  console.log(`💚 Health check: ${url}/health`);
  console.log(`\n📚 Loading WB component documentation...`);
  
  await loadDocumentation();
  
  console.log(`\n✅ Ready to answer questions about the WB component!`);
  console.log(`\n🌍 Opening browser...`);
  
  // Open browser automatically
  setTimeout(() => openBrowser(url), 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
