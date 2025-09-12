/**
 * Script to add Zia Symbol favicon to all HTML files
 * 
 * This script scans all HTML files in the project directory and adds
 * the Zia Symbol SVG as a favicon to any file that doesn't already have it.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = __dirname;
const svgFilename = '/images/ziasymbol.svg';

// Find all HTML files recursively
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules or other specific directories
      if (file !== 'node_modules' && file !== '.git') {
        fileList = findHtmlFiles(filePath, fileList);
      }
    } else if (file.toLowerCase().endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Generate relative path from HTML file to SVG
function getRelativePath(htmlFilePath) {
  const htmlDir = path.dirname(htmlFilePath);
  const relativePathToRoot = path.relative(htmlDir, rootDir);
  return relativePathToRoot ? `${relativePathToRoot}/` : './';
}

// Check if file already has a favicon
function hasFavicon(content) {
  return content.includes('rel="icon"') || 
         content.includes('rel="shortcut icon"') ||
         content.includes('rel="apple-touch-icon"');
}

// Add favicon links after the title or meta tags
function addFavicon(filePath, content) {
  // Find </title> tag or last meta tag
  const titleEndRegex = /<\/title>/i;
  const titleMatch = content.match(titleEndRegex);
  
  if (!titleMatch) {
    return content; // No title tag found, skip
  }
  
  // Favicon links to insert
  const faviconLinks = `
    <!-- Favicon -->
    <link rel="icon" href="${svgFilename}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${svgFilename}">
    `;
  
  // Insert after title
  const position = titleMatch.index + titleMatch[0].length;
  const newContent = content.substring(0, position) + faviconLinks + content.substring(position);
  
  return newContent;
}

// Process each file
function processHtmlFiles() {
  const htmlFiles = findHtmlFiles(rootDir);
  let updatedFiles = 0;
  
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip if already has favicon
      if (hasFavicon(content)) {
        console.log(`✓ ${file} (already has favicon)`);
        return;
      }
      
      // Add favicon
      const newContent = addFavicon(file, content);
      
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✓ ${file} (updated)`);
        updatedFiles++;
      } else {
        console.log(`✗ ${file} (couldn't find title tag)`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  });
  
  console.log(`\nUpdated ${updatedFiles} files with Zia Symbol favicon`);
}

// Run the script
processHtmlFiles();
