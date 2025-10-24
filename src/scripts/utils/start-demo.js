// start-demo.js
// Smart script that detects which component folder you're in and starts the demo
// Usage: node start-demo.js [optional-component-name]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findDemoInDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir);
    
    // Look for *demo*.html files
    const demoFiles = entries.filter(file => {
      const lower = file.toLowerCase();
      return lower.includes('demo') && lower.endsWith('.html');
    });
    
    if (demoFiles.length === 0) {
      return null;
    }
    
    // Prefer exact match like "wb-button-demo.html" over variants
    const exactMatch = demoFiles.find(file => file.endsWith('-demo.html'));
    return exactMatch || demoFiles[0];
    
  } catch (error) {
    return null;
  }
}

function detectCurrentComponent() {
  // NPM sets INIT_CWD to the directory where npm was invoked
  const initCwd = process.env.INIT_CWD || process.cwd();
  const initDirName = path.basename(initCwd);
  
  console.log(`🔍 Invoked from: ${initCwd}`);
  console.log(`📂 Directory name: ${initDirName}\n`);
  
  // Check if we're in a component folder (starts with wb-)
  if (initDirName.startsWith('wb-')) {
    const demoFile = findDemoInDirectory(initCwd);
    if (demoFile) {
      console.log(`✅ Detected component from folder name: ${initDirName}`);
      console.log(`✅ Found demo: ${demoFile}\n`);
      return {
        name: initDirName,
        path: initCwd,
        demoFile: demoFile,
        demoPath: path.join(initCwd, demoFile)
      };
    } else {
      console.log(`⚠️  No demo file found in ${initDirName}`);
      console.log(`💡 Create a demo file like: ${initDirName}-demo.html\n`);
    }
  }
  
  // Check if we're in the components directory
  if (initDirName === 'components') {
    console.log('⚠️  You are in the components root directory');
    console.log('💡 Navigate to a specific component folder (e.g., cd wb-button)\n');
    return null;
  }
  
  // Check if we're in the project root
  const componentsDir = path.join(initCwd, 'components');
  if (fs.existsSync(componentsDir)) {
    console.log('⚠️  You are in the project root directory');
    console.log('💡 Specify a component name: npm run demo -- wb-button\n');
    return null;
  }
  
  return null;
}

function findComponentByName(componentName) {
  // Normalize component name (add wb- prefix if missing)
  if (!componentName.startsWith('wb-')) {
    componentName = `wb-${componentName}`;
  }
  
  // Always look in the components directory relative to project root
  const projectRoot = __dirname;
  const componentsDir = path.join(projectRoot, 'components');
  
  if (!fs.existsSync(componentsDir)) {
    console.error('❌ Components directory not found');
    console.log(`Looking for: ${componentsDir}\n`);
    return null;
  }
  
  const componentPath = path.join(componentsDir, componentName);
  
  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Component not found: ${componentName}`);
    console.log(`💡 Looking in: ${componentsDir}\n`);
    
    // List available components
    try {
      const available = fs.readdirSync(componentsDir)
        .filter(name => name.startsWith('wb-') && fs.statSync(path.join(componentsDir, name)).isDirectory())
        .slice(0, 10);
      
      if (available.length > 0) {
        console.log('Available components:');
        available.forEach(comp => console.log(`  - ${comp}`));
        if (available.length === 10) {
          console.log('  ... and more');
        }
        console.log();
      }
    } catch (e) {
      // Ignore listing errors
    }
    
    return null;
  }
  
  const demoFile = findDemoInDirectory(componentPath);
  
  if (!demoFile) {
    console.error(`❌ No demo file found in ${componentName}`);
    console.log(`💡 Create a demo file like: ${componentName}-demo.html\n`);
    return null;
  }
  
  console.log(`✅ Found component: ${componentName}`);
  console.log(`✅ Found demo: ${demoFile}\n`);
  
  return {
    name: componentName,
    path: componentPath,
    demoFile: demoFile,
    demoPath: path.join(componentPath, demoFile)
  };
}

function startViteWithDemo(component) {
  console.log('🚀 Starting Vite dev server...');
  console.log(`📦 Component: ${component.name}`);
  console.log(`📄 Demo file: ${component.demoFile}`);
  console.log(`📂 Full path: ${component.demoPath}\n`);
  
  // Calculate relative path from project root to demo file
  const projectRoot = __dirname;
  const relativeDemoPath = path.relative(projectRoot, component.demoPath).replace(/\\/g, '/');
  
  // Start Vite with the demo file
  const viteArgs = ['vite', '--open', `/${relativeDemoPath}`];
  
  console.log(`Running: npx ${viteArgs.join(' ')}\n`);
  console.log('─'.repeat(60));
  console.log('Vite will start in a moment...');
  console.log('Press Ctrl+C to stop the server');
  console.log('─'.repeat(60));
  console.log();
  
  // Use spawn for better control of the child process
  const child = spawn('npx', viteArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process exit
  child.on('error', (error) => {
    console.error('❌ Error starting Vite:', error.message);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n❌ Vite exited with code ${code}`);
    }
    process.exit(code || 0);
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping Vite server...');
    child.kill('SIGINT');
  });
}

// Main execution
function main() {
  console.log('🔍 WB Component Demo Starter\n');
  
  const args = process.argv.slice(2);
  let component = null;
  
  if (args.length > 0) {
    // Component name was provided as argument
    const componentName = args[0];
    console.log(`Looking for component: ${componentName}\n`);
    component = findComponentByName(componentName);
  } else {
    // Try to detect current component from INIT_CWD
    component = detectCurrentComponent();
  }
  
  if (!component) {
    console.log('❌ Could not determine which component to start\n');
    console.log('Usage:');
    console.log('  From component folder:');
    console.log('    cd components/wb-button');
    console.log('    npm run demo');
    console.log('');
    console.log('  Or specify component name:');
    console.log('    npm run demo -- wb-button');
    console.log('    npm run demo -- button  (wb- prefix optional)');
    console.log('');
    process.exit(1);
  }
  
  startViteWithDemo(component);
}

// Run if called directly - FIX: normalize paths for comparison
const scriptPath = fileURLToPath(import.meta.url);
const argPath = path.resolve(process.argv[1]);

if (scriptPath === argPath) {
  main();
}

export { detectCurrentComponent, findComponentByName, findDemoInDirectory };
