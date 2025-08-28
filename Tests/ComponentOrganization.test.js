// Component Organization Test - Using npm-based testing instead of PowerShell
// Test to identify and organize components into the components folder

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Component Organization Strategy...\n');

// Define the workspace root
const workspaceRoot = process.cwd();
const componentsDir = path.join(workspaceRoot, 'components');

// Component patterns to identify
const componentPatterns = [
  /\.component\.(js|ts|html)$/,
  /component\.html$/,
  /-component\.(js|ts|html)$/,
  /theme.*component/i,
  /generator.*component/i
];

// Folders to scan for components
const foldersToScan = ['themes', 'zzz', '.', 'html'];

function isComponentFile(filename) {
  return componentPatterns.some(pattern => pattern.test(filename));
}

function scanForComponents() {
  const foundComponents = [];
  
  foldersToScan.forEach(folder => {
    const folderPath = path.join(workspaceRoot, folder);
    
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath, { withFileTypes: true });
      
      files.forEach(file => {
        if (file.isFile() && isComponentFile(file.name)) {
          foundComponents.push({
            name: file.name,
            currentPath: path.join(folderPath, file.name),
            folder: folder
          });
        } else if (file.isDirectory()) {
          // Scan subdirectories
          const subDirPath = path.join(folderPath, file.name);
          try {
            const subFiles = fs.readdirSync(subDirPath);
            subFiles.forEach(subFile => {
              if (isComponentFile(subFile)) {
                foundComponents.push({
                  name: subFile,
                  currentPath: path.join(subDirPath, subFile),
                  folder: `${folder}/${file.name}`
                });
              }
            });
          } catch (err) {
            // Skip if can't read directory
          }
        }
      });
    }
  });
  
  return foundComponents;
}

// Test the scanning
console.log('📂 Scanning for component files...');
const components = scanForComponents();

console.log(`\n✅ Found ${components.length} component files:`);
components.forEach((comp, index) => {
  console.log(`${index + 1}. ${comp.name} (in ${comp.folder})`);
});

// Check current components directory structure
console.log('\n📁 Current components directory:');
if (fs.existsSync(componentsDir)) {
  const currentComponents = fs.readdirSync(componentsDir, { withFileTypes: true });
  currentComponents.forEach(item => {
    console.log(`   ${item.isDirectory() ? '📁' : '📄'} ${item.name}`);
  });
} else {
  console.log('   Components directory does not exist');
}

// Suggest organization structure
console.log('\n📋 Suggested component organization:');
const suggestionsByType = {
  'table': [],
  'theme': [],
  'generator': [],
  'other': []
};

components.forEach(comp => {
  if (comp.name.includes('table')) {
    suggestionsByType.table.push(comp);
  } else if (comp.name.includes('theme')) {
    suggestionsByType.theme.push(comp);
  } else if (comp.name.includes('generator')) {
    suggestionsByType.generator.push(comp);
  } else {
    suggestionsByType.other.push(comp);
  }
});

Object.keys(suggestionsByType).forEach(type => {
  if (suggestionsByType[type].length > 0) {
    console.log(`\n   📂 components/${type}/`);
    suggestionsByType[type].forEach(comp => {
      console.log(`      📄 ${comp.name}`);
    });
  }
});

console.log('\n🎯 Component Organization Test Completed!');
console.log('Ready to move components to organized structure.');

process.exit(0);
