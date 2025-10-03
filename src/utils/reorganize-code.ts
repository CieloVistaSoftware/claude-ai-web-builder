// @ts-nocheck
// Code Reorganization Tool
// This script helps safely reorganize the file structure

import * as fs from "fs";
import * as path from "path";

// Configuration for file moves
const fileMoves = [
  // Core Website Builder
  { from: 'wb.html', to: 'wb-core/wb.html' },
  { from: 'wb.css', to: 'wb-core/wb.css' },
  { from: 'wb.js', to: 'wb-core/wb.js' },

  // Web Component Controller
  { from: 'wb-controller.js', to: 'components/wb-controller/wb-controller.js' },

  // File Conversion System
  { from: 'converter-util.js', to: 'conversion/conversion-engine.js' },
  { from: 'convert-file.js', to: 'conversion/cli-converter.js' },
  { from: 'file-watcher.js', to: 'conversion/file-watcher.js' },

  // File Stacking System
  { from: 'file-stacker.js', to: 'stacking/file-stacker.js' },
  { from: 'auto-stack-files.js', to: 'stacking/auto-stacker.js' },

  // UI Components
  { from: 'converter.html', to: 'ui/converter-ui/index.html' },
  { from: 'converter.css', to: 'ui/converter-ui/styles.css' },
  { from: 'converter.js', to: 'ui/converter-ui/script.js' },
];

// Create directories
function createDirectories(): any {
  const dirs = [
    'wb-core',
    'components',
    'components/wb-controller',
    'conversion',
    'stacking',
    'ui',
    'ui/converter-ui',
    'ui/stacker-ui',
  ];

  console.log('Creating directories...');

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
}

// Move files
function moveFiles(): any {
  console.log('Moving files...');

  fileMoves.forEach(move => {
    const sourceFile = move.from;
    const targetFile = move.to;

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`Source file does not exist: ${sourceFile}`);
      return;
    }

    // Create target directory if it doesn't exist
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy the file
    try {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`Copied ${sourceFile} to ${targetFile}`);
    } catch (error) {
      console.error(`Error copying ${sourceFile}: ${error.message}`);
    }
  });

  console.log('File moves complete. Original files have been kept for safety.');
}

// Update import paths in a file
function updateImportPaths(filePath): any {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Store original content for comparison
    const originalContent = content;

    // Replace import paths
    fileMoves.forEach(move => {
      const fromPath = move.from.replace(/\\/g, '/');
      const toPath = move.to.replace(/\\/g, '/');

      // Handle various import patterns
      const patterns = [
        // Script tags with src
        new RegExp(`src=["']\\.\\.?/${fromPath}["']`, 'g'),
        new RegExp(`src=["']/${fromPath}["']`, 'g'),
        new RegExp(`src=["']${fromPath}["']`, 'g'),

        // Link tags with href
        new RegExp(`href=["']\\.\\.?/${fromPath}["']`, 'g'),
        new RegExp(`href=["']/${fromPath}["']`, 'g'),
        new RegExp(`href=["']${fromPath}["']`, 'g'),

        // JavaScript imports
        new RegExp(`import .* from ["']\\.\\.?/${fromPath}["']`, 'g'),
        new RegExp(`import .* from ["']/${fromPath}["']`, 'g'),
        new RegExp(`import .* from ["']${fromPath}["']`, 'g'),

        // JavaScript requires
        new RegExp(`require\\(["']\\.\\.?/${fromPath}["']\\)`, 'g'),
        new RegExp(`require\\(["']/${fromPath}["']\\)`, 'g'),
        new RegExp(`require\\(["']${fromPath}["']\\)`, 'g'),
      ];

      // Apply each pattern
      patterns.forEach(pattern => {
        // Calculate relative path from current file to the new location
        const relativePath = path.relative(
          path.dirname(filePath),
          path.dirname(toPath)
        ).replace(/\\/g, '/');

        const replacement = relativePath ? `../${relativePath}/${path.basename(toPath)}` : `./${path.basename(toPath)}`;

        content = content.replace(pattern, (match): any => {
          if (match.includes('src=')) {
            return `src="${replacement}"`;
          } else if (match.includes('href=')) {
            return `href="${replacement}"`;
          } else if (match.includes('import')) {
            return match.replace(/(from\s+["']).+?(['"])/, `$1${replacement}$2`);
          } else if (match.includes('require')) {
            return match.replace(/(require\(["']).+?(['"])/, `$1${replacement}$2`);
          }
          return match;
        });
      });
    });

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(`${filePath}.updated`, content, 'utf8');
      console.log(`Updated import paths in: ${filePath} (saved as ${filePath}.updated)`);
    } else {
      console.log(`No changes needed in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error.message}`);
  }
}

// Update all moved files
function updateAllFiles(): any {
  console.log('Updating import paths...');

  fileMoves.forEach(move => {
    updateImportPaths(move.to);
  });
}

// Cleanup function - remove .updated extension if file looks good
function finalizeFiles(): any {
  console.log('To finalize updated files:');
  console.log('1. Review all .updated files');
  console.log('2. If they look good, rename them to replace the originals');
  console.log('3. Remove the original files from the root directory when ready');
}

// Main function
function main(): any {
  console.log('=== Website Builder Code Reorganization ===');

  try {
    createDirectories();
    moveFiles();
    updateAllFiles();
    finalizeFiles();
    console.log('\nReorganization process completed successfully.');
  } catch (error) {
    console.error('Error during reorganization:', error);
  }
}

// Run the script
main();
