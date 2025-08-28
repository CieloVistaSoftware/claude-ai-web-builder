/**
 * Script to add the Zia Symbol to all Markdown files
 * 
 * This script scans all Markdown files in the project directory and adds
 * the Zia Symbol SVG reference to any file that doesn't already have it.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = __dirname;
const svgFilename = 'ziasymbol.svg';
const svgHtml = `<div align="center">
  <img src="{{relativePath}}${svgFilename}" alt="Zia Symbol Logo" width="150" height="100">
</div>

`;

// Find all markdown files recursively
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules or other specific directories
      if (file !== 'node_modules' && file !== '.git') {
        fileList = findMarkdownFiles(filePath, fileList);
      }
    } else if (file.toLowerCase().endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Generate relative path from markdown file to SVG
function getRelativePath(mdFilePath) {
  const mdDir = path.dirname(mdFilePath);
  const relativePathToRoot = path.relative(mdDir, rootDir);
  return relativePathToRoot ? `${relativePathToRoot}/` : './';
}

// Check if file already has the SVG
function hasZiaSymbol(content) {
  return content.includes('ziasymbol.svg') || 
         content.includes('Zia Symbol Logo');
}

// Add SVG after the first markdown heading
function addZiaSymbol(filePath, content) {
  // Find the first markdown heading
  const headingRegex = /^# .+$/m;
  const match = content.match(headingRegex);
  
  if (!match) return content; // No heading found
  
  const relativePath = getRelativePath(filePath);
  const svgToInsert = svgHtml.replace('{{relativePath}}', relativePath);
  
  // Insert after the first heading
  const position = match.index + match[0].length;
  const newContent = content.substring(0, position) + '\n\n' + 
                    svgToInsert + content.substring(position);
  
  return newContent;
}

// Process each file
function processMarkdownFiles() {
  const mdFiles = findMarkdownFiles(rootDir);
  let updatedFiles = 0;
  
  console.log(`Found ${mdFiles.length} Markdown files`);
  
  mdFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip if already has the SVG
      if (hasZiaSymbol(content)) {
        console.log(`✓ ${file} (already has Zia Symbol)`);
        return;
      }
      
      // Add the SVG
      const newContent = addZiaSymbol(file, content);
      
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✓ ${file} (updated)`);
        updatedFiles++;
      } else {
        console.log(`✗ ${file} (couldn't find heading to add after)`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  });
  
  console.log(`\nUpdated ${updatedFiles} files with Zia Symbol`);
}

// Run the script
processMarkdownFiles();
