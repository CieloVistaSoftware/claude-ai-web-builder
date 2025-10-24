#!/usr/bin/env node

/**
 * Build script for TypeScript compilation
 * Compiles TypeScript files to JavaScript with proper module resolution
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building WB Website Builder TypeScript files...');

try {
    // Get the parent directory (wb-website-builder root)
    const projectRoot = path.join(__dirname, '..');
    
    // Ensure dist directory exists
    const distDir = path.join(projectRoot, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Compile TypeScript files
    console.log('📝 Compiling TypeScript files...');
    execSync('npx tsc', { 
        stdio: 'inherit',
        cwd: projectRoot 
    });

    // Post-process the compiled files to fix import paths
    console.log('🔧 Post-processing compiled files...');
    
    const filesToProcess = [
        'dist/wb-website-builder.js',
        'dist/wb-component-loader.js', 
        'dist/wb-data-binding.js'
    ];

    filesToProcess.forEach(file => {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace TypeScript path aliases with actual paths
            content = content
                .replace(/from ['"]@utils\//g, 'from "../../utils/')
                .replace(/from ['"]@components\//g, 'from "../')
                .replace(/from ['"]@styles\//g, 'from "../../styles/')
                .replace(/from ['"]@layouts\//g, 'from "../../layouts/')
                .replace(/import ['"]@utils\//g, 'import "../../utils/')
                .replace(/import ['"]@components\//g, 'import "../')
                .replace(/import ['"]@styles\//g, 'import "../../styles/')
                .replace(/import ['"]@layouts\//g, 'import "../../layouts/');
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ Processed: ${file}`);
        }
    });

    console.log('🎉 Build completed successfully!');
    console.log('');
    console.log('📋 Generated files:');
    console.log('  - dist/wb-website-builder.js');
    console.log('  - dist/wb-component-loader.js');
    console.log('  - dist/wb-data-binding.js');
    console.log('  - dist/types.js');
    console.log('');
    console.log('🚀 Ready to use! The demo HTML now loads the compiled TypeScript files.');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}