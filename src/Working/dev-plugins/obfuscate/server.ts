// @ts-nocheck
/**
 * Obfuscator Plugin - Local API Server
 * 
 * This is an example server that demonstrates how to create a local API
 * to handle obfuscation requests from the Website Builder obfuscator plugin.
 * 
 * The server integrates with command-line obfuscation tools:
 * - JavaScript: javascript-obfuscator (https://github.com/javascript-obfuscator/javascript-obfuscator)
 * - CSS: clean-css-cli (https://github.com/clean-css/clean-css-cli)
 * - HTML: html-minifier (https://github.com/kangax/html-minifier)
 * 
 * To use this server:
 * 1. Install the required dependencies:
 *    npm install express cors javascript-obfuscator clean-css html-minifier
 * 
 * 2. Run the server:
 *    node server.js
 * 
 * 3. Configure the obfuscator plugin to use this API at http://localhost:3000/api/obfuscate
 */

import * as express from "express";
import * as cors from "cors";
const { exec } = require('child_process');
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
const { v4: uuidv4 } = require('uuid');

// Import JavaScript obfuscator library
let JavaScriptObfuscator;
try {
  JavaScriptObfuscator = require('javascript-obfuscator');
} catch (error) {
  console.warn('JavaScript-obfuscator not installed. JS obfuscation will use fallback method.');
}

// Import CSS minifier library
let CleanCSS;
try {
  CleanCSS = require('clean-css');
} catch (error) {
  console.warn('Clean-CSS not installed. CSS minification will use fallback method.');
}

// Import HTML minifier library
let htmlMinifier;
try {
  htmlMinifier = require('html-minifier');
} catch (error) {
  console.warn('HTML-minifier not installed. HTML minification will use fallback method.');
}

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create temporary directory for processing files
const TEMP_DIR = path.join(os.tmpdir(), 'wb-obfuscator');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// API endpoint for obfuscation
app.post('/api/obfuscate', async (req, res): any => {
  try {
    const { code, type, options } = req.body;
    
    if (!code) {
      return res.status(400).send('No code provided');
    }
    
    if (!type || !['js', 'css', 'html'].includes(type)) {
      return res.status(400).send('Invalid code type. Must be "js", "css", or "html"');
    }
    
    console.log(`Received ${type.toUpperCase()} obfuscation request`);
    
    let result;
    
    // Process based on code type
    switch (type) {
      case 'js':
        result = await obfuscateJavaScript(code, options);
        break;
      case 'css':
        result = await minifyCSS(code, options);
        break;
      case 'html':
        result = await minifyHTML(code, options);
        break;
      default:
        return res.status(400).send('Unsupported code type');
    }
    
    res.send(result);
  } catch (error) {
    console.error('Error processing obfuscation request:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// API endpoint for command-line tool execution
app.post('/api/execute-obfuscator', async (req, res): any => {
  try {
    const { code, type, command, args } = req.body;
    
    if (!code || !type || !command) {
      return res.status(400).send('Missing required parameters');
    }
    
    console.log(`Executing command-line tool for ${type.toUpperCase()}`);
    
    // Create temporary files
    const id = uuidv4();
    const inputFile = path.join(TEMP_DIR, `input-${id}.${type}`);
    const outputFile = path.join(TEMP_DIR, `output-${id}.${type}`);
    
    // Write input code to temporary file
    fs.writeFileSync(inputFile, code);
    
    // Build command with arguments
    const commandWithArgs = `${command} ${args.join(' ')} "${inputFile}" -o "${outputFile}"`;
    console.log(`Executing: ${commandWithArgs}`);
    
    // Execute command
    await executeCommand(commandWithArgs);
    
    // Read output file
    const result = fs.readFileSync(outputFile, 'utf8');
    
    // Clean up temporary files
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
    
    res.send(result);
  } catch (error) {
    console.error('Error executing command-line tool:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Execute a command as a Promise
function executeCommand(command): any {
  return new Promise((resolve, reject): any => {
    exec(command, (error, stdout, stderr): any => {
      if (error) {
        console.error(`Command execution error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return reject(error);
      }
      resolve(stdout);
    });
  });
}

// JavaScript obfuscation using javascript-obfuscator library
async function obfuscateJavaScript(code, options = {}): any {
  try {
    // Use the library if available
    if (JavaScriptObfuscator) {
      console.log('Using JavaScript-Obfuscator library');
      const result = JavaScriptObfuscator.obfuscate(code, options);
      return result.getObfuscatedCode();
    }
    
    // Fallback to command-line tool if available
    console.log('Falling back to command-line JavaScript-Obfuscator');
    
    // Create temporary files
    const id = uuidv4();
    const inputFile = path.join(TEMP_DIR, `input-${id}.js`);
    const outputFile = path.join(TEMP_DIR, `output-${id}.js`);
    
    // Write input code to temporary file
    fs.writeFileSync(inputFile, code);
    
    // Build command with options
    const args = buildJavaScriptObfuscatorArgs(options);
    const command = `javascript-obfuscator "${inputFile}" --output "${outputFile}" ${args}`;
    
    try {
      // Execute command
      await executeCommand(command);
      
      // Read output file
      const result = fs.readFileSync(outputFile, 'utf8');
      
      // Clean up temporary files
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
      
      return result;
    } catch (error) {
      // If command-line tool fails, use simple minification as last resort
      console.warn('Command-line obfuscator failed, using simple minification');
      return simpleJavaScriptMinification(code);
    }
  } catch (error) {
    console.error('JavaScript obfuscation error:', error);
    // Last resort fallback
    return simpleJavaScriptMinification(code);
  }
}

// Build command-line arguments for JavaScript obfuscator
function buildJavaScriptObfuscatorArgs(options): any {
  const args: any[] = [];
  
  if (options.compact !== undefined) {
    args.push(`--compact=${options.compact}`);
  }
  
  if (options.controlFlowFlattening !== undefined) {
    args.push(`--control-flow-flattening=${options.controlFlowFlattening}`);
  }
  
  if (options.controlFlowFlatteningThreshold !== undefined) {
    args.push(`--control-flow-flattening-threshold=${options.controlFlowFlatteningThreshold}`);
  }
  
  if (options.deadCodeInjection !== undefined) {
    args.push(`--dead-code-injection=${options.deadCodeInjection}`);
  }
  
  if (options.deadCodeInjectionThreshold !== undefined) {
    args.push(`--dead-code-injection-threshold=${options.deadCodeInjectionThreshold}`);
  }
  
  if (options.debugProtection !== undefined) {
    args.push(`--debug-protection=${options.debugProtection}`);
  }
  
  if (options.disableConsoleOutput !== undefined) {
    args.push(`--disable-console-output=${options.disableConsoleOutput}`);
  }
  
  if (options.identifierNamesGenerator) {
    args.push(`--identifier-names-generator=${options.identifierNamesGenerator}`);
  }
  
  if (options.stringArray !== undefined) {
    args.push(`--string-array=${options.stringArray}`);
  }
  
  if (options.stringArrayThreshold !== undefined) {
    args.push(`--string-array-threshold=${options.stringArrayThreshold}`);
  }
  
  return args.join(' ');
}

// Simple JavaScript minification for fallback
function simpleJavaScriptMinification(code): any {
  // Remove comments
  let minified = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  
  // Remove whitespace
  minified = minified.replace(/\s+/g, ' ');
  minified = minified.replace(/\s*{\s*/g, '{');
  minified = minified.replace(/\s*}\s*/g, '}');
  minified = minified.replace(/\s*:\s*/g, ':');
  minified = minified.replace(/\s*;\s*/g, ';');
  minified = minified.replace(/\s*,\s*/g, ',');
  
  return `/* Simple minification - JavaScript obfuscator not available */\n${minified}`;
}

// CSS minification using clean-css library
async function minifyCSS(code, options = {}): any {
  try {
    // Use the library if available
    if (CleanCSS) {
      console.log('Using Clean-CSS library');
      const cleanCSS = new CleanCSS(options);
      const result = cleanCSS.minify(code);
      return result.styles;
    }
    
    // Fallback to command-line tool if available
    console.log('Falling back to command-line CleanCSS');
    
    // Create temporary files
    const id = uuidv4();
    const inputFile = path.join(TEMP_DIR, `input-${id}.css`);
    const outputFile = path.join(TEMP_DIR, `output-${id}.css`);
    
    // Write input code to temporary file
    fs.writeFileSync(inputFile, code);
    
    // Build command with options
    const args = buildCleanCSSArgs(options);
    const command = `cleancss ${args} -o "${outputFile}" "${inputFile}"`;
    
    try {
      // Execute command
      await executeCommand(command);
      
      // Read output file
      const result = fs.readFileSync(outputFile, 'utf8');
      
      // Clean up temporary files
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
      
      return result;
    } catch (error) {
      // If command-line tool fails, use simple minification as last resort
      console.warn('Command-line CSS minifier failed, using simple minification');
      return simpleCSSMinification(code, options);
    }
  } catch (error) {
    console.error('CSS minification error:', error);
    // Last resort fallback
    return simpleCSSMinification(code, options);
  }
}

// Build command-line arguments for CleanCSS
function buildCleanCSSArgs(options): any {
  const args: any[] = [];
  
  if (options.restructure !== undefined) {
    args.push(options.restructure ? '--level=2' : '--level=1');
  } else {
    args.push('--level=2'); // Default to level 2
  }
  
  if (options.removeComments !== undefined && options.removeComments) {
    args.push('--remove-comments');
  }
  
  return args.join(' ');
}

// Simple CSS minification for fallback
function simpleCSSMinification(code, options = {}): any {
  let minified = code;
  
  // Remove comments if specified
  if (options.removeComments) {
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  
  // Remove whitespace
  minified = minified.replace(/\s+/g, ' ');
  minified = minified.replace(/\s*{\s*/g, '{');
  minified = minified.replace(/\s*}\s*/g, '}');
  minified = minified.replace(/\s*:\s*/g, ':');
  minified = minified.replace(/\s*;\s*/g, ';');
  minified = minified.replace(/;\s*}/g, '}'); // Remove trailing semicolons before closing braces
  minified = minified.replace(/\s*,\s*/g, ',');
  
  return `/* Simple minification - CleanCSS not available */\n${minified}`;
}

// HTML minification using html-minifier library
async function minifyHTML(code, options = {}): any {
  try {
    // Use the library if available
    if (htmlMinifier) {
      console.log('Using HTML-Minifier library');
      return htmlMinifier.minify(code, {
        collapseWhitespace: options.collapseWhitespace !== undefined ? options.collapseWhitespace : true,
        removeComments: options.removeComments !== undefined ? options.removeComments : true,
        removeEmptyAttributes: options.removeEmptyAttributes !== undefined ? options.removeEmptyAttributes : true,
        removeRedundantAttributes: options.removeRedundantAttributes !== undefined ? options.removeRedundantAttributes : true,
        removeScriptTypeAttributes: options.removeScriptTypeAttributes !== undefined ? options.removeScriptTypeAttributes : true,
        removeStyleLinkTypeAttributes: options.removeStyleLinkTypeAttributes !== undefined ? options.removeStyleLinkTypeAttributes : true,
        removeAttributeQuotes: options.removeAttributeQuotes !== undefined ? options.removeAttributeQuotes : false,
        minifyCSS: options.minifyCSS !== undefined ? options.minifyCSS : true,
        minifyJS: options.minifyJS !== undefined ? options.minifyJS : true
      });
    }
    
    // Fallback to command-line tool if available
    console.log('Falling back to command-line HTML-Minifier');
    
    // Create temporary files
    const id = uuidv4();
    const inputFile = path.join(TEMP_DIR, `input-${id}.html`);
    const outputFile = path.join(TEMP_DIR, `output-${id}.html`);
    
    // Write input code to temporary file
    fs.writeFileSync(inputFile, code);
    
    // Build command with options
    const args = buildHTMLMinifierArgs(options);
    const command = `html-minifier ${args} -o "${outputFile}" "${inputFile}"`;
    
    try {
      // Execute command
      await executeCommand(command);
      
      // Read output file
      const result = fs.readFileSync(outputFile, 'utf8');
      
      // Clean up temporary files
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
      
      return result;
    } catch (error) {
      // If command-line tool fails, use simple minification as last resort
      console.warn('Command-line HTML minifier failed, using simple minification');
      return simpleHTMLMinification(code, options);
    }
  } catch (error) {
    console.error('HTML minification error:', error);
    // Last resort fallback
    return simpleHTMLMinification(code, options);
  }
}

// Build command-line arguments for HTML Minifier
function buildHTMLMinifierArgs(options): any {
  const args: any[] = [];
  
  if (options.collapseWhitespace) {
    args.push('--collapse-whitespace');
  }
  
  if (options.removeComments) {
    args.push('--remove-comments');
  }
  
  if (options.removeEmptyAttributes) {
    args.push('--remove-empty-attributes');
  }
  
  if (options.removeRedundantAttributes) {
    args.push('--remove-redundant-attributes');
  }
  
  if (options.removeScriptTypeAttributes) {
    args.push('--remove-script-type-attributes');
  }
  
  if (options.removeStyleLinkTypeAttributes) {
    args.push('--remove-style-link-type-attributes');
  }
  
  if (options.removeAttributeQuotes) {
    args.push('--remove-attribute-quotes');
  }
  
  if (options.minifyCSS) {
    args.push('--minify-css');
  }
  
  if (options.minifyJS) {
    args.push('--minify-js');
  }
  
  return args.join(' ');
}

// Simple HTML minification for fallback
function simpleHTMLMinification(code, options = {}): any {
  let minified = code;
  
  // Remove comments if specified
  if (options.removeComments) {
    minified = minified.replace(/<!--[\s\S]*?-->/g, '');
  }
  
  // Collapse whitespace if specified
  if (options.collapseWhitespace) {
    minified = minified.replace(/>\s+</g, '><');
    minified = minified.replace(/\s{2,}/g, ' ');
  }
  
  return `<!-- Simple minification - HTML Minifier not available -->\n${minified}`;
}

// Start the server
app.listen(PORT, (): any => {
  console.log(`Obfuscator API server running at http://localhost:${PORT}`);
  console.log(`Temp directory: ${TEMP_DIR}`);
  console.log('Available endpoints:');
  console.log('  POST /api/obfuscate - For library-based obfuscation');
  console.log('  POST /api/execute-obfuscator - For command-line tool execution');
});

// Handle process termination
process.on('SIGINT', (): any => {
  console.log('Shutting down server...');
  process.exit(0);
});

// Export for testing
export default app;
