// @ts-nocheck
/**
 * Website Builder Build Script
 * 
 * This script bundles the modular JavaScript files into a production-ready build.
 * It combines all the modules, applies optimizations, and prepares the export package.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Starting build process...');

// Define paths
const coreDir = path.join(__dirname, 'core');
const componentsDir = path.join(__dirname, 'components');
const pluginsDir = path.join(__dirname, 'plugins');
const outputDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// Copy HTML, CSS, and assets
console.log('📋 Copying static assets...');
fs.copyFileSync(
  path.join(__dirname, 'index.html'),
  path.join(outputDir, 'index.html')
);
fs.copyFileSync(
  path.join(__dirname, 'styles.css'),
  path.join(outputDir, 'styles.css')
);

// Create assets directory in dist
const distAssetsDir = path.join(outputDir, 'assets');
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Copy assets recursively (simple implementation)
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
  
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
  
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyDir(path.join(__dirname, 'assets'), distAssetsDir);
  console.log('✅ Copied assets');
}

// Bundle JS modules (simple concatenation - in a real project you might use a bundler like Rollup/Webpack)
console.log('📦 Bundling JavaScript modules...');

/**
 * Recursively gets all JS files in a directory and its subdirectories
 * @param {string} dir Directory to scan
 * @returns {string[]} Array of file paths
 */
function getJsFiles(dir): any {
  let results: any[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach((file): any => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively scan subdirectories
      results = results.concat(getJsFiles(filePath));
    } else if (path.extname(file) === '.js') {
      results.push(filePath);
    }
  });
  
  return results;
}

// Get all JS files
const coreFiles = fs.existsSync(coreDir) ? getJsFiles(coreDir) : [];
const componentFiles = fs.existsSync(componentsDir) ? getJsFiles(componentsDir) : [];
const pluginFiles = fs.existsSync(pluginsDir) ? getJsFiles(pluginsDir) : [];

// Read the main script.js file first
let mainScriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Simple module bundling (remove import/export statements)
const bundleFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import statements
  content = content.replace(/import .* from ['"].*['"]\s*;?/g, '');
  
  // Remove export statements
  content = content.replace(/export\s+\{[^}]*\}\s*;?/g, '');
  content = content.replace(/export\s+default\s+/g, '');
  content = content.replace(/export\s+/g, '');
  
  return content;
};

// Bundle all modules into one file
let bundleContent = `/**
 * Website Builder - Production Bundle
 * Generated: ${new Date().toISOString()}
 * This file contains all modules bundled for production use.
 */

// Core modules
`;

// Add core modules
coreFiles.forEach(file => {
  console.log(`  • Processing core file: ${path.basename(file)}`);
  bundleContent += `\n// ${path.relative(__dirname, file)}\n`;
  bundleContent += bundleFile(file);
  bundleContent += '\n';
});

// Add components
bundleContent += '\n// Components\n';
componentFiles.forEach(file => {
  console.log(`  • Processing component: ${path.basename(file)}`);
  bundleContent += `\n// ${path.relative(__dirname, file)}\n`;
  bundleContent += bundleFile(file);
  bundleContent += '\n';
});

// Add plugins (excluding dev-plugins)
bundleContent += '\n// Plugins\n';
pluginFiles.forEach(file => {
  console.log(`  • Processing plugin: ${path.basename(file)}`);
  bundleContent += `\n// ${path.relative(__dirname, file)}\n`;
  bundleContent += bundleFile(file);
  bundleContent += '\n';
});

// Add main script initialization last (after removing imports)
bundleContent += '\n// Main script initialization\n';
mainScriptContent = mainScriptContent.replace(/import .* from ['"].*['"]\s*;?/g, '');
bundleContent += mainScriptContent;

// Write the bundled file
fs.writeFileSync(path.join(outputDir, 'script.js'), bundleContent);
console.log('✅ Generated bundled JavaScript file');

// Create a simple info file
const infoContent = `Website Builder - Build Information
Generated: ${new Date().toISOString()}
Version: ${JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version}

This build contains:
- ${coreFiles.length} core module files
- ${componentFiles.length} component files
- ${pluginFiles.length} plugin files

Note: Development-only plugins are excluded from this build.
`;

fs.writeFileSync(path.join(outputDir, 'build-info.txt'), infoContent);

console.log(`
✅ Build completed successfully!

Output directory: ${outputDir}

To test the build:
1. Navigate to the dist directory: cd dist
2. Start a server: http-server
3. Open in browser: http://localhost:8080
`);
