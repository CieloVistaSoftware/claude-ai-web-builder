

// Kill any existing node processes first
try {
    console.log('🔪 Killing existing node processes...');
    execSync('powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'inherit' });
    console.log('✅ Processes killed');
} catch (error) {
    console.log('ℹ️ No processes to kill');
}

// Clean and create dist folder
console.log('🧹 Cleaning dist folder...');
if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
}
fs.mkdirSync('./dist/wb', { recursive: true });
console.log('✅ Dist folder cleaned and created');

// Copy latest HTML file
console.log('📄 Copying latest HTML file...');
const htmlSource = './wb/wb.html';
const htmlDest = './dist/wb/wb.html';
if (fs.existsSync(htmlSource)) {
    let htmlContent = fs.readFileSync(htmlSource, 'utf8');
    // Ensure it references wb.min.js
    htmlContent = htmlContent.replace(/src="wb\.js"/, 'src="wb.min.js"');
    htmlContent = htmlContent.replace(/src="wb-new\.js"/, 'src="wb.min.js"');
    htmlContent = htmlContent.replace(/src="wb-main\.js"/, 'src="wb.min.js"');
    fs.writeFileSync(htmlDest, htmlContent);
    console.log('✅ HTML file copied and updated');
} else {
    console.error('❌ Source HTML file not found:', htmlSource);
}

// Copy latest CSS file
console.log('🎨 Copying latest CSS file...');
const cssSource = './wb/wb.css';
const cssDest = './dist/wb/wb.css';
if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssDest);
    console.log('✅ CSS file copied');
} else {
    console.error('❌ Source CSS file not found:', cssSource);
}

// Build and obfuscate JavaScript
console.log('⚙️ Building and obfuscating JavaScript...');

// Get the working JS file (check multiple sources)
let jsSource = null;
const jsSources = ['./wb/wb-new.js', './wb/wb-main.js', './wb/wb.js'];
for (const source of jsSources) {
    if (fs.existsSync(source)) {
        jsSource = source;
        break;
    }
}

if (!jsSource) {
    console.error('❌ No source JavaScript file found');
    process.exit(1);
}

console.log(`📜 Using JavaScript source: ${jsSource}`);
const jsContent = fs.readFileSync(jsSource, 'utf8');

// Obfuscation function with aggressive minification
function obfuscateJS(code) {
    console.log('🔒 Applying aggressive obfuscation...');
    
    // Remove comments and extra whitespace
    let obfuscated = code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
        .replace(/\/\/.*$/gm, '') // Remove // comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, '}') // Remove semicolons before }
        .replace(/\s*{\s*/g, '{') // Clean up { spacing
        .replace(/\s*}\s*/g, '}') // Clean up } spacing
        .replace(/\s*,\s*/g, ',') // Clean up , spacing
        .replace(/\s*;\s*/g, ';') // Clean up ; spacing
        .replace(/\s*\(\s*/g, '(') // Clean up ( spacing
        .replace(/\s*\)\s*/g, ')') // Clean up ) spacing
        .trim();

    // Variable name obfuscation with hex names
    const varMap = new Map();
    let varCounter = 0;
    
    // Find variable declarations and function names
    const varRegex = /(?:let|const|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = varRegex.exec(obfuscated)) !== null) {
        const varName = match[1];
        if (!varMap.has(varName) && !['console', 'document', 'window', 'alert', 'prompt'].includes(varName)) {
            varMap.set(varName, `_0x${varCounter.toString(16)}`);
            varCounter++;
        }
    }
    
    // Replace variable names
    for (const [original, obfuscated_name] of varMap) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, obfuscated_name);
    }
    
    return obfuscated;
}

const obfuscatedJS = obfuscateJS(jsContent);
const jsDest = './dist/wb/wb.min.js';
fs.writeFileSync(jsDest, obfuscatedJS);
console.log('✅ JavaScript obfuscated and saved as wb.min.js');

console.log('🎉 Build process completed successfully!');
console.log('📁 Dist folder contents:');
try {
    const distFiles = fs.readdirSync('./dist/wb');
    distFiles.forEach(file => console.log(`   📄 ${file}`));
} catch (error) {
    console.log('   (could not list files)');
}