#!/usr/bin/env node

/**
 * WB Component Build Tool
 * 
 * Integrates component discovery into the build process.
 * Validates component usage and generates build-time symbol tables.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WBComponentDiscovery from './component-discovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WBBuildTool {
    constructor(options = {}) {
        this.componentsPath = options.componentsPath || './components';
        this.projectPath = options.projectPath || './';
        this.outputPath = options.outputPath || './dist';
        this.strict = options.strict || false;
        this.discovery = new WBComponentDiscovery(this.componentsPath);
    }

    /**
     * Main build process with component validation
     */
    async build() {
        console.log('🔨 Starting WB Component Build...');
        
        try {
            // 1. Discover all components
            const discoveryResults = await this.discovery.discover();
            
            // 2. Validate project usage
            const validationResults = await this.validateProjectUsage(discoveryResults);
            
            // 3. Generate build artifacts
            await this.generateBuildArtifacts(discoveryResults);
            
            // 4. Check for errors
            if (this.strict && validationResults.errors.length > 0) {
                throw new Error(`Build failed: ${validationResults.errors.length} validation errors`);
            }
            
            console.log('✅ Build completed successfully!');
            return { discoveryResults, validationResults };
            
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Validate component usage across the project
     */
    async validateProjectUsage(discoveryResults) {
        console.log('🔍 Validating component usage...');
        
        const results = {
            errors: [],
            warnings: [],
            validUsage: [],
            stats: {
                filesScanned: 0,
                componentsFound: 0,
                issuesFound: 0
            }
        };

        // Scan HTML files
        await this.scanHTMLFiles(results, discoveryResults);
        
        // Scan JavaScript files
        await this.scanJavaScriptFiles(results, discoveryResults);
        
        console.log(`📊 Validation complete: ${results.errors.length} errors, ${results.warnings.length} warnings`);
        return results;
    }

    /**
     * Scan HTML files for web component usage
     */
    async scanHTMLFiles(results, discoveryResults) {
        const htmlFiles = this.findFiles(this.projectPath, '.html');
        
        for (const filePath of htmlFiles) {
            results.stats.filesScanned++;
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Find web component tags
                const webComponentTags = content.match(/<(wb-[^>\s\/]+)/g);
                if (webComponentTags) {
                    for (const tag of webComponentTags) {
                        const componentName = tag.replace('<', '');
                        results.stats.componentsFound++;
                        
                        // Check if component exists
                        const componentExists = discoveryResults.symbolTable.has(componentName);
                        
                        if (!componentExists) {
                            results.errors.push({
                                file: filePath,
                                type: 'unknown-component',
                                message: `Unknown web component: ${componentName}`,
                                line: this.getLineNumber(content, tag)
                            });
                        } else {
                            results.validUsage.push({
                                file: filePath,
                                component: componentName,
                                type: 'web-component'
                            });
                            
                            // Check if component is broken
                            const componentInfo = discoveryResults.componentRegistry.find(c => c.name === componentName);
                            if (componentInfo && componentInfo.status === 'broken') {
                                results.warnings.push({
                                    file: filePath,
                                    type: 'broken-component',
                                    message: `Using broken component: ${componentName}`,
                                    issues: componentInfo.issues
                                });
                            }
                        }
                    }
                }
                
            } catch (error) {
                results.errors.push({
                    file: filePath,
                    type: 'read-error',
                    message: `Error reading file: ${error.message}`
                });
            }
        }
    }

    /**
     * Scan JavaScript files for component usage
     */
    async scanJavaScriptFiles(results, discoveryResults) {
        const jsFiles = this.findFiles(this.projectPath, '.js');
        
        for (const filePath of jsFiles) {
            // Skip our own discovery files
            if (filePath.includes('component-discovery') || filePath.includes('build-symbols')) {
                continue;
            }
            
            results.stats.filesScanned++;
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Check for class usage (e.g., WBButton.create())
                const classUsage = content.match(/WB\w+\.\w+/g);
                if (classUsage) {
                    for (const usage of classUsage) {
                        const className = usage.split('.')[0];
                        results.stats.componentsFound++;
                        
                        const classExists = discoveryResults.symbolTable.has(className);
                        
                        if (!classExists) {
                            results.errors.push({
                                file: filePath,
                                type: 'unknown-class',
                                message: `Unknown class: ${className}`,
                                line: this.getLineNumber(content, usage)
                            });
                        } else {
                            results.validUsage.push({
                                file: filePath,
                                component: className,
                                type: 'class-usage'
                            });
                        }
                    }
                }
                
                // Check for customElements.define usage (ignore commented lines)
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    // Skip commented lines
                    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                        continue;
                    }
                    
                    const customElementMatch = line.match(/customElements\.define\(['"`]([^'"`]+)['"`]/);
                    if (customElementMatch) {
                        const elementName = customElementMatch[1];
                        
                        // Check if this conflicts with existing components
                        if (discoveryResults.symbolTable.has(elementName)) {
                            results.warnings.push({
                                file: filePath,
                                type: 'duplicate-definition',
                                message: `Duplicate custom element definition: ${elementName}`
                            });
                        }
                    }
                }
                
            } catch (error) {
                results.errors.push({
                    file: filePath,
                    type: 'read-error',
                    message: `Error reading file: ${error.message}`
                });
            }
        }
    }

    /**
     * Generate build artifacts
     */
    async generateBuildArtifacts(discoveryResults) {
        console.log('📦 Generating build artifacts...');
        
        // Create output directory
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }

        // Generate symbol table for runtime
        const runtimeSymbols = this.generateRuntimeSymbolTable(discoveryResults);
        fs.writeFileSync(
            path.join(this.outputPath, 'wb-symbols.js'),
            `// Auto-generated WB Component Symbol Table
window.WB_SYMBOLS = ${JSON.stringify(runtimeSymbols, null, 2)};`
        );

        // Generate TypeScript definitions
        const tsDefinitions = this.generateTypeScriptDefinitions(discoveryResults);
        fs.writeFileSync(
            path.join(this.outputPath, 'wb-components.d.ts'),
            tsDefinitions
        );

        // Generate autocomplete data for IDEs
        const autocompleteData = this.discovery.generateAutocompleteData();
        fs.writeFileSync(
            path.join(this.outputPath, 'wb-autocomplete.json'),
            JSON.stringify(autocompleteData, null, 2)
        );

        // Generate component manifest
        const manifest = {
            version: '1.0.0',
            buildTime: new Date().toISOString(),
            components: discoveryResults.componentRegistry.map(comp => ({
                name: comp.name,
                type: comp.webComponent ? 'web-component' : 'legacy',
                customElement: comp.customElement,
                status: comp.status,
                api: comp.api
            })),
            symbols: Array.from(discoveryResults.symbolTable.entries()).map(([key, value]) => ({
                symbol: key,
                ...value
            }))
        };

        fs.writeFileSync(
            path.join(this.outputPath, 'wb-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        console.log(`📄 Generated build artifacts in: ${this.outputPath}`);
    }

    /**
     * Generate runtime symbol table
     */
    generateRuntimeSymbolTable(discoveryResults) {
        const runtime = {
            webComponents: {},
            classes: {},
            functions: {},
            metadata: discoveryResults.metadata
        };

        for (const [symbol, data] of discoveryResults.symbolTable) {
            if (data.type === 'custom-element') {
                runtime.webComponents[symbol] = {
                    component: data.component,
                    available: true
                };
            } else if (data.type === 'class') {
                runtime.classes[symbol] = {
                    component: data.component,
                    available: true
                };
            } else if (data.type === 'function') {
                runtime.functions[symbol] = {
                    component: data.component,
                    available: true
                };
            }
        }

        return runtime;
    }

    /**
     * Generate TypeScript definitions
     */
    generateTypeScriptDefinitions(discoveryResults) {
        let definitions = `// Auto-generated WB Component Type Definitions\n\n`;
        
        // Web component declarations
        definitions += `declare global {\n`;
        definitions += `  namespace JSX {\n`;
        definitions += `    interface IntrinsicElements {\n`;
        
        for (const [symbol, data] of discoveryResults.symbolTable) {
            if (data.type === 'custom-element') {
                definitions += `      '${symbol}': any;\n`;
            }
        }
        
        definitions += `    }\n`;
        definitions += `  }\n`;
        definitions += `}\n\n`;

        // Class declarations
        for (const [symbol, data] of discoveryResults.symbolTable) {
            if (data.type === 'class') {
                definitions += `declare class ${symbol} {\n`;
                definitions += `  static create(elementId: string, config?: any): ${symbol};\n`;
                definitions += `  static init(): void;\n`;
                definitions += `}\n\n`;
            }
        }

        // Function declarations
        definitions += `declare namespace WBComponentUtils {\n`;
        for (const [symbol, data] of discoveryResults.symbolTable) {
            if (data.type === 'function' && data.component === 'wb-component-utils') {
                definitions += `  function ${symbol}(...args: any[]): any;\n`;
            }
        }
        definitions += `}\n\n`;

        definitions += `export {};\n`;

        return definitions;
    }

    /**
     * Find files with specific extension
     */
    findFiles(dir, extension, files = []) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                this.findFiles(fullPath, extension, files);
            } else if (entry.isFile() && entry.name.endsWith(extension)) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    /**
     * Get line number for a string in content
     */
    getLineNumber(content, searchString) {
        const lines = content.substring(0, content.indexOf(searchString)).split('\n');
        return lines.length;
    }

    /**
     * Watch mode for development
     */
    async watch() {
        console.log('👀 Starting watch mode...');
        
        // Initial build
        await this.build();
        
        // Watch for changes (requires chokidar package)
        let chokidar;
        try {
            chokidar = (await import('chokidar')).default;
        } catch (error) {
            console.log('📦 Install chokidar for watch mode: npm install chokidar');
            return;
        }
        
        const watcher = chokidar.watch([
            path.join(this.componentsPath, '**/*.js'),
            path.join(this.componentsPath, '**/*.json'),
            path.join(this.projectPath, '**/*.html'),
            path.join(this.projectPath, '**/*.js')
        ], {
            ignored: /node_modules/,
            persistent: true
        });

        watcher.on('change', async (path) => {
            console.log(`📝 File changed: ${path}`);
            await this.build();
        });

        console.log('👀 Watching for changes... Press Ctrl+C to stop');
    }
}

// CLI interface
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
    const args = process.argv.slice(2);
    const command = args[0] || 'build';
    
    const buildTool = new WBBuildTool({
        componentsPath: './components',
        projectPath: './',
        outputPath: './dist/symbols',
        strict: args.includes('--strict')
    });

    switch (command) {
        case 'build':
            buildTool.build();
            break;
        case 'watch':
            buildTool.watch();
            break;
        case 'validate':
            buildTool.build().then(results => {
                if (results.validationResults.errors.length > 0) {
                    console.log('\n❌ Validation Errors:');
                    results.validationResults.errors.forEach(error => {
                        console.log(`  ${error.file}:${error.line || '?'} - ${error.message}`);
                    });
                }
                if (results.validationResults.warnings.length > 0) {
                    console.log('\n⚠️ Warnings:');
                    results.validationResults.warnings.forEach(warning => {
                        console.log(`  ${warning.file} - ${warning.message}`);
                    });
                }
            });
            break;
        default:
            console.log('Usage: node build-symbols.js [build|watch|validate] [--strict]');
    }
}

export default WBBuildTool;