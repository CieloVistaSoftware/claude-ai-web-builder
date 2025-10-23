import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImportPaths(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (['node_modules', '.git', 'playwright-report'].includes(item)) {
          continue;
        }
        walkDir(fullPath);
      } else if (item.endsWith('.spec.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

function fixImportInFile(filePath) {
  console.log(`Fixing imports in: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix wrong import paths
  content = content.replace(
    /import \{ BaseUnitTest \} from '\.\/helpers\/BaseUnitTestSimple\.js';/g,
    "import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';"
  );
  
  content = content.replace(
    /import \{ BaseUnitTest \} from 'helpers\/BaseUnitTestSimple\.js';/g,
    "import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';"
  );
  
  // For files already in tests/ root, use relative path
  if (filePath.includes('tests\\') && !filePath.includes('tests\\wb-')) {
    content = content.replace(
      /import \{ BaseUnitTest \} from '\.\.\/helpers\/BaseUnitTestSimple\.js';/g,
      "import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';"
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

const testsDir = path.join(__dirname, 'tests');
console.log(`🔧 Fixing import paths in: ${testsDir}`);

const testFiles = fixImportPaths(testsDir);
console.log(`📄 Found ${testFiles.length} test files to fix`);

for (const file of testFiles) {
  fixImportInFile(file);
}

console.log(`✅ Fixed import paths in ${testFiles.length} files`);