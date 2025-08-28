/**
 * Script to show MCP Server Functions
 * This script reads and displays the MCP integration code with syntax highlighting
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for basic syntax highlighting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * Simple syntax highlighter for TypeScript/JavaScript
 * @param {string} code - The code to highlight
 * @return {string} - The highlighted code
 */
function highlightSyntax(code) {
  // Keywords to highlight
  const keywords = [
    'class', 'interface', 'type', 'enum', 'function', 'constructor', 'private', 'public', 'protected',
    'async', 'await', 'export', 'import', 'from', 'const', 'let', 'var', 'return', 'if', 'else',
    'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'try', 'catch', 'finally',
    'throw', 'new', 'this', 'static', 'extends', 'implements', 'get', 'set', 'void', 'null', 'undefined',
    'true', 'false'
  ];

  // Highlight keywords
  let highlighted = code;
  
  // Highlight comments (// and /* */)
  highlighted = highlighted.replace(/(\/\/.*$)/gm, `${colors.green}$1${colors.reset}`);
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, `${colors.green}$1${colors.reset}`);
  
  // Highlight strings
  highlighted = highlighted.replace(/(['"`])(.*?)\1/g, `${colors.yellow}$1$2$1${colors.reset}`);
  
  // Highlight keywords
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `${colors.cyan}$1${colors.reset}`);
  }
  
  // Highlight function declarations
  highlighted = highlighted.replace(/\b(\w+)\s*\(/g, `${colors.magenta}$1${colors.reset}(`);
  
  return highlighted;
}

/**
 * Display a section header
 * @param {string} title - The title of the section
 */
function displayHeader(title) {
  console.log('\n' + colors.bgBlue + colors.white + colors.bright + ' ' + title + ' ' + colors.reset + '\n');
}

/**
 * Show specific MCP functions from the integration file
 */
function showMCPServerFunctions() {
  try {
    // MCP integration file path
    const mcpFilePath = path.join(__dirname, '..', 'mcp', 'mcp-integration.ts');
    
    // Check if file exists
    if (!fs.existsSync(mcpFilePath)) {
      console.error(`${colors.red}Error: MCP integration file not found at ${mcpFilePath}${colors.reset}`);
      return;
    }
    
    // Read the file content
    const mcpContent = fs.readFileSync(mcpFilePath, 'utf8');
    
    // Display the title
    console.log(colors.bright + colors.bgCyan + colors.white + ' MCP Server Integration Functions ' + colors.reset);
    console.log(colors.bright + `\nFile: ${mcpFilePath}` + colors.reset);
    
    // Display basic MCP information
    displayHeader('MCP Server Integration Overview');
    
    console.log(`The Model Context Protocol (MCP) integration enables AI models to generate websites
using a standardized API protocol. This integration exposes several key endpoints:

${colors.cyan}GET  /mcp/health${colors.reset}       - Health check and status endpoint
${colors.cyan}GET  /mcp/capabilities${colors.reset} - List supported website types and features
${colors.cyan}POST /mcp/validate${colors.reset}     - Validate website generation input
${colors.cyan}POST /mcp/generate${colors.reset}     - Generate websites using AI components
${colors.cyan}GET  /mcp/metrics${colors.reset}      - Performance and usage metrics

These endpoints follow the MCP specification to ensure compatibility with AI systems.
`);
    
    // Extract and display the main class declaration
    const classMatch = mcpContent.match(/class\s+MCPClaudeWebsiteBuilder\s*{[\s\S]*?constructor.*?{[\s\S]*?}/);
    if (classMatch) {
      displayHeader('Main MCP Class and Constructor');
      console.log(highlightSyntax(classMatch[0]));
    }
    
    // Extract and display the setup endpoints method
    const setupEndpointsMatch = mcpContent.match(/private\s+setupMCPEndpoints.*?{[\s\S]*?}/);
    if (setupEndpointsMatch) {
      displayHeader('MCP Endpoints Setup');
      console.log(highlightSyntax(setupEndpointsMatch[0]));
    }
    
    // Extract and display each endpoint setup function
    const endpointFunctions = [
      'setupGenerateEndpoint',
      'setupCapabilitiesEndpoint', 
      'setupHealthEndpoint', 
      'setupValidateEndpoint', 
      'setupMetricsEndpoint'
    ];
    
    for (const funcName of endpointFunctions) {
      const pattern = new RegExp(`private\\s+${funcName}.*?{[\\s\\S]*?}`);
      const match = mcpContent.match(pattern);
      if (match) {
        displayHeader(`Endpoint: ${funcName.replace('setup', '').replace('Endpoint', '')}`);
        console.log(highlightSyntax(match[0]));
      }
    }
    
    // Show a specific website generation function
    const generateWebsiteMatch = mcpContent.match(/private\s+async\s+generateWebsiteFromComponents.*?{[\s\S]*?}/);
    if (generateWebsiteMatch) {
      displayHeader('Website Generation Function');
      console.log(highlightSyntax(generateWebsiteMatch[0]));
    }
    
    // Show some utility functions
    displayHeader('Usage Instructions');
    console.log(`${colors.yellow}To use the MCP API:${colors.reset}

1. Start the server with: ${colors.cyan}npm start${colors.reset}
2. Send requests to the MCP endpoints:
   - Health check: ${colors.green}GET http://localhost:8000/mcp/health${colors.reset}
   - Get capabilities: ${colors.green}GET http://localhost:8000/mcp/capabilities${colors.reset}
   - Generate a website: ${colors.green}POST http://localhost:8000/mcp/generate${colors.reset}

Example POST body for website generation:
${colors.yellow}{
  "toolName": "claude-ai-website-builder",
  "website": {
    "type": "portfolio",
    "features": ["theme-generator", "table-theme"]
  },
  "content": {
    "title": "My Portfolio",
    "description": "A professionally designed portfolio"
  },
  "output": {
    "format": "files"
  }
}${colors.reset}

For more details, see: ${colors.cyan}mcp/mcp-integration-guide.md${colors.reset}
`);

  } catch (error) {
    console.error(`${colors.red}Error reading MCP integration file:${colors.reset}`, error);
  }
}

// Execute the function
showMCPServerFunctions();
