// @ts-nocheck
/**
 * Script to remove Puppeteer dependencies from the project
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removePuppeteer(): any {
  console.log('Removing Puppeteer dependencies from the project...');
  
  try {
    // 1. Update package.json to remove puppeteer
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    if (packageJson.devDependencies && packageJson.devDependencies.puppeteer) {
      console.log('Removing puppeteer from devDependencies...');
      delete packageJson.devDependencies.puppeteer;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Removed puppeteer from package.json');
    } else {
      console.log('Puppeteer not found in package.json');
    }
    
    // 2. Add a note to the files where Puppeteer was used
    const filesToAnnotate = [
      path.join(__dirname, 'tests', 'claude-socket-node.test.js'),
      path.join(__dirname, 'tests', 'claude-socket.test.js')
    ];
    
    for (const filePath of filesToAnnotate) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        
        if (content.includes('puppeteer')) {
          console.log(`Adding deprecation notice to ${filePath}...`);
          
          const deprecationNotice = `/**
 * DEPRECATED: This test file uses Puppeteer and is kept for reference only.
 * Please use the claude-socket-direct.test.js file instead, which doesn't use browser automation.
 * 
 * @deprecated Use claude-socket-direct.test.js instead
 */\n\n`;
          
          if (!content.includes('DEPRECATED')) {
            await fs.writeFile(filePath, deprecationNotice + content, 'utf8');
            console.log(`✅ Added deprecation notice to ${filePath}`);
          }
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`File ${filePath} not found, skipping`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('\n✅ Successfully removed Puppeteer dependencies!');
    console.log('\nNOTE: You should run "npm uninstall puppeteer" to remove the dependency from node_modules');
    console.log('Use "npm run test:claude:direct" to run the Puppeteer-free tests');
  } catch (error) {
    console.error('Error removing Puppeteer dependencies:', error);
    process.exit(1);
  }
}

// Run the script
removePuppeteer();
