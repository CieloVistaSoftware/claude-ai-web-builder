#!/usr/bin/env node

/**
 * WB Component Discovery System
 * 
 * A compiler-like tool that scans the components directory and creates
 * a comprehensive symbol table of all available WB components.
 * 
 * Addresses the core issue: "components not fully known" by providing
 * proper symbol discovery and compilation-like functionality.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WBComponentDiscovery {
    constructor(componentsPath = './components') {
        this.componentsPath = path.resolve(componentsPath);
        this.symbolTable = new Map();
        this.componentRegistry = [];
        this.issues = [];
        this.metadata = {
            scanTime: new Date(),
            totalComponents: 0,
            webComponents: 0,
            legacyComponents: 0,
            brokenComponents: 0,
            duplicateSymbols: []
        };
    }

    /**
     * Main discovery method - scans all components and builds symbol table
     */
    async discover() {
        console.log('🔍 Starting WB Component Discovery...');
        console.log(`📁 Scanning: ${this.componentsPath}`);
        
        if (!fs.existsSync(this.componentsPath)) {
            throw new Error(`Components directory not found: ${this.componentsPath}`);
        }

        // Scan all component directories
        const componentDirs = this.getComponentDirectories();
        console.log(`📊 Found ${componentDirs.length} component directories`);

        for (const dir of componentDirs) {
            await this.analyzeComponent(dir);
        }

        // Build final symbol table
        this.buildSymbolTable();
        
        // Generate reports
        this.generateReports();
        
        console.log('✅ Component discovery complete!');
        return this.getDiscoveryResults();
    }

    /**
     * Get all component directories
     */
    getComponentDirectories() {
        const dirs = [];
        const entries = fs.readdirSync(this.componentsPath, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('wb-')) {
                dirs.push(entry.name);
            } else if (entry.isDirectory() && ['control-panel', 'change-text', 'image-insert', 'color-bar'].includes(entry.name)) {
                dirs.push(entry.name);
            }
        }
        
        // Also check for individual component files
        const individualFiles = entries.filter(entry => 
            entry.isFile() && 
            entry.name.startsWith('wb-') && 
            entry.name.endsWith('.js')
        );
        
        for (const file of individualFiles) {
            const componentName = file.name.replace(/\.js$/, '');
            if (!dirs.includes(componentName)) {
                dirs.push(componentName);
            }
        }

        return dirs.sort();
    }

    /**
     * Analyze a single component
     */
    async analyzeComponent(componentName) {
        console.log(`🔍 Analyzing: ${componentName}`);
        
        const componentPath = path.join(this.componentsPath, componentName);
        const component = {
            name: componentName,
            path: componentPath,
            files: {},
            symbols: [],
            webComponent: false,
            legacy: false,
            status: 'unknown',
            issues: [],
            api: {
                methods: [],
                events: [],
                attributes: []
            },
            dependencies: [],
            customElement: null
        };

        // Check if it's a directory or individual file
        const isDirectory = fs.existsSync(componentPath) && fs.statSync(componentPath).isDirectory();
        
        if (isDirectory) {
            await this.analyzeComponentDirectory(component);
        } else {
            await this.analyzeComponentFile(component);
        }

        this.componentRegistry.push(component);
        this.metadata.totalComponents++;
        
        if (component.webComponent) this.metadata.webComponents++;
        if (component.legacy) this.metadata.legacyComponents++;
        if (component.status === 'broken') this.metadata.brokenComponents++;
    }

    /**
     * Analyze component directory structure
     */
    async analyzeComponentDirectory(component) {
        const files = fs.readdirSync(component.path);
        
        // Map file types
        for (const file of files) {
            const filePath = path.join(component.path, file);
            const ext = path.extname(file);
            const base = path.basename(file, ext);
            
            switch (ext) {
                case '.js':
                    if (file.includes('webcomponent')) {
                        component.files.webComponent = filePath;
                        component.webComponent = true;
                    } else {
                        component.files.legacy = filePath;
                        component.legacy = true;
                    }
                    break;
                case '.css':
                    component.files.css = filePath;
                    break;
                case '.json':
                    component.files.config = filePath;
                    break;
                case '.md':
                    if (file.includes('issues')) {
                        component.files.issues = filePath;
                    } else {
                        component.files.docs = filePath;
                    }
                    break;
                case '.html':
                    component.files.demo = filePath;
                    break;
            }
        }

        // Analyze JavaScript files
        if (component.files.webComponent) {
            await this.analyzeJavaScript(component, component.files.webComponent, 'webcomponent');
        }
        if (component.files.legacy) {
            await this.analyzeJavaScript(component, component.files.legacy, 'legacy');
        }

        // Analyze config if available
        if (component.files.config) {
            await this.analyzeConfig(component);
        }

        // Check for issues
        if (component.files.issues) {
            await this.analyzeIssues(component);
        }
    }

    /**
     * Analyze individual component file
     */
    async analyzeComponentFile(component) {
        const filePath = path.join(this.componentsPath, `${component.name}.js`);
        
        if (fs.existsSync(filePath)) {
            component.files.legacy = filePath;
            component.legacy = true;
            await this.analyzeJavaScript(component, filePath, 'legacy');
        }
    }

    /**
     * Analyze JavaScript file for symbols and patterns
     */
    async analyzeJavaScript(component, filePath, type) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract symbols
            this.extractSymbols(component, content, type);
            
            // Check for web component patterns
            if (content.includes('customElements.define')) {
                component.webComponent = true;
                const customElementMatch = content.match(/customElements\.define\(['"`]([^'"`]+)['"`]/);
                if (customElementMatch) {
                    component.customElement = customElementMatch[1];
                }
            }

            // Extract API methods
            const methodMatches = content.match(/(\w+)\s*\([^)]*\)\s*{/g);
            if (methodMatches) {
                component.api.methods = methodMatches
                    .map(m => m.replace(/\s*\([^)]*\)\s*{/, ''))
                    .filter(m => !['constructor', 'connectedCallback', 'disconnectedCallback'].includes(m));
            }

            // Extract event dispatching
            const eventMatches = content.match(/dispatchEvent\([^)]*['"`]([^'"`]+)['"`]/g);
            if (eventMatches) {
                component.api.events = eventMatches.map(m => {
                    const match = m.match(/['"`]([^'"`]+)['"`]/);
                    return match ? match[1] : null;
                }).filter(Boolean);
            }

            // Extract dependencies
            const importMatches = content.match(/import.*from\s+['"`]([^'"`]+)['"`]/g);
            if (importMatches) {
                component.dependencies = importMatches.map(m => {
                    const match = m.match(/['"`]([^'"`]+)['"`]/);
                    return match ? match[1] : null;
                }).filter(Boolean);
            }

            // Check for common WB utilities
            if (content.includes('WBComponentUtils')) {
                component.dependencies.push('wb-component-utils');
            }

        } catch (error) {
            component.issues.push(`Error reading ${filePath}: ${error.message}`);
            component.status = 'broken';
        }
    }

    /**
     * Extract symbols from JavaScript content
     */
    extractSymbols(component, content, type) {
        const symbols = [];
        
        // Class definitions
        const classMatches = content.match(/class\s+(\w+)/g);
        if (classMatches) {
            symbols.push(...classMatches.map(m => ({
                name: m.replace('class ', ''),
                type: 'class',
                source: type
            })));
        }

        // Function definitions
        const functionMatches = content.match(/function\s+(\w+)/g);
        if (functionMatches) {
            symbols.push(...functionMatches.map(m => ({
                name: m.replace('function ', ''),
                type: 'function',
                source: type
            })));
        }

        // Variable assignments that look like exports
        const exportMatches = content.match(/(?:const|let|var)\s+(\w+)\s*=/g);
        if (exportMatches) {
            symbols.push(...exportMatches.map(m => ({
                name: m.replace(/(?:const|let|var)\s+/, '').replace(/\s*=$/, ''),
                type: 'variable',
                source: type
            })));
        }

        // Window/global assignments (like window.WBComponentUtils = ...)
        const windowAssignments = content.match(/window\.(\w+)\s*=/g);
        if (windowAssignments) {
            symbols.push(...windowAssignments.map(m => ({
                name: m.replace(/window\./, '').replace(/\s*=$/, ''),
                type: 'class',
                source: type
            })));
        }

        // Custom element definitions
        if (content.includes('customElements.define')) {
            const customElementMatch = content.match(/customElements\.define\(['"`]([^'"`]+)['"`]/);
            if (customElementMatch) {
                symbols.push({
                    name: customElementMatch[1],
                    type: 'custom-element',
                    source: type
                });
            }
        }

        component.symbols = symbols;
    }

    /**
     * Analyze component configuration
     */
    async analyzeConfig(component) {
        try {
            const configContent = fs.readFileSync(component.files.config, 'utf8');
            const config = JSON.parse(configContent);
            
            component.config = config;
            
            // Extract attributes from config
            if (config.attributes) {
                component.api.attributes = Object.keys(config.attributes);
            }
            
            // Update status based on config
            if (config.status) {
                component.status = config.status;
            }
            
        } catch (error) {
            component.issues.push(`Error parsing config: ${error.message}`);
        }
    }

    /**
     * Analyze component issues
     */
    async analyzeIssues(component) {
        try {
            const issuesContent = fs.readFileSync(component.files.issues, 'utf8');
            component.knownIssues = issuesContent;
            component.status = 'broken';
        } catch (error) {
            component.issues.push(`Error reading issues file: ${error.message}`);
        }
    }

    /**
     * Build comprehensive symbol table
     */
    buildSymbolTable() {
        console.log('🔧 Building symbol table...');
        
        for (const component of this.componentRegistry) {
            for (const symbol of component.symbols) {
                const key = symbol.name;
                
                if (this.symbolTable.has(key)) {
                    // Check for duplicates
                    const existing = this.symbolTable.get(key);
                    if (existing.component !== component.name) {
                        this.metadata.duplicateSymbols.push({
                            symbol: key,
                            components: [existing.component, component.name]
                        });
                    }
                } else {
                    this.symbolTable.set(key, {
                        name: symbol.name,
                        type: symbol.type,
                        component: component.name,
                        source: symbol.source,
                        webComponent: component.webComponent,
                        customElement: component.customElement
                    });
                }
            }
        }
        
        console.log(`📊 Symbol table built: ${this.symbolTable.size} symbols`);
    }

    /**
     * Generate discovery reports
     */
    generateReports() {
        // Generate symbol table JSON
        const symbolTableData = Array.from(this.symbolTable.entries()).map(([key, value]) => ({
            symbol: key,
            ...value
        }));

        // Generate component registry JSON
        const registryData = this.componentRegistry.map(comp => ({
            name: comp.name,
            type: comp.webComponent ? 'web-component' : 'legacy',
            customElement: comp.customElement,
            status: comp.status,
            files: Object.keys(comp.files),
            symbols: comp.symbols.length,
            methods: comp.api.methods.length,
            events: comp.api.events.length,
            attributes: comp.api.attributes.length,
            dependencies: comp.dependencies,
            issues: comp.issues
        }));

        // Write reports
        const reportsDir = path.join(process.cwd(), 'component-discovery-reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        fs.writeFileSync(
            path.join(reportsDir, 'symbol-table.json'),
            JSON.stringify(symbolTableData, null, 2)
        );

        fs.writeFileSync(
            path.join(reportsDir, 'component-registry.json'),
            JSON.stringify(registryData, null, 2)
        );

        fs.writeFileSync(
            path.join(reportsDir, 'discovery-metadata.json'),
            JSON.stringify(this.metadata, null, 2)
        );

        console.log(`📄 Reports generated in: ${reportsDir}`);
    }

    /**
     * Get complete discovery results
     */
    getDiscoveryResults() {
        return {
            symbolTable: this.symbolTable,
            componentRegistry: this.componentRegistry,
            metadata: this.metadata,
            issues: this.issues
        };
    }

    /**
     * Generate IDE-friendly autocomplete data
     */
    generateAutocompleteData() {
        const autocomplete = {
            webComponents: [],
            classes: [],
            functions: [],
            utilities: []
        };

        for (const [symbol, data] of this.symbolTable) {
            if (data.type === 'custom-element') {
                autocomplete.webComponents.push({
                    tag: symbol,
                    component: data.component,
                    description: `Web component: ${data.component}`
                });
            } else if (data.type === 'class') {
                autocomplete.classes.push({
                    name: symbol,
                    component: data.component,
                    description: `Class from ${data.component}`
                });
            } else if (data.type === 'function') {
                autocomplete.functions.push({
                    name: symbol,
                    component: data.component,
                    description: `Function from ${data.component}`
                });
            }
        }

        return autocomplete;
    }

    /**
     * Validate component usage in project
     */
    async validateUsage(projectPath) {
        console.log('🔍 Validating component usage...');
        
        const usageReport = {
            validUsage: [],
            invalidUsage: [],
            missingComponents: [],
            unusedComponents: []
        };

        // This would scan project files for component usage
        // and validate against the symbol table
        
        return usageReport;
    }
}

// CLI interface
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
    const discovery = new WBComponentDiscovery('./components');
    
    discovery.discover()
        .then(results => {
            console.log('\n📊 Discovery Summary:');
            console.log(`Total components: ${results.metadata.totalComponents}`);
            console.log(`Web components: ${results.metadata.webComponents}`);
            console.log(`Legacy components: ${results.metadata.legacyComponents}`);
            console.log(`Broken components: ${results.metadata.brokenComponents}`);
            console.log(`Total symbols: ${results.symbolTable.size}`);
            
            if (results.metadata.duplicateSymbols.length > 0) {
                console.log('\n⚠️  Duplicate symbols found:');
                results.metadata.duplicateSymbols.forEach(dup => {
                    console.log(`  ${dup.symbol}: ${dup.components.join(', ')}`);
                });
            }
        })
        .catch(error => {
            console.error('❌ Discovery failed:', error.message);
            process.exit(1);
        });
}

export default WBComponentDiscovery;