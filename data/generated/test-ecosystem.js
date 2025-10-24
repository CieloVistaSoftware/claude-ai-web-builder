// WB Component Ecosystem Test Suite
// Tests component loading, dependencies, and integrations

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class ComponentEcosystemTest {
    constructor() {
        this.results = {};
        this.baseDir = path.dirname(fileURLToPath(import.meta.url));
    }

    log(message, type = 'INFO') {
        console.log(`[${new Date().toISOString()}] ${type}: ${message}`);
    }

    // Test 1: File Structure Validation
    testFileStructure() {
        this.log('Testing file structure...');
        const requiredFiles = [
            'components/wb-control-panel/wb-control-panel.js',
            'components/wb-control-panel/wb-control-panel.schema.json',
            'components/wb-control-panel/claude.md',
            'components/wb-color-bar/wb-color-bar.js',
            'components/wb-color-bar/wb-color-bar.schema.json',
            'components/wb-color-bars/wb-color-bars.js',
            'components/wb-color-bars/wb-color-bars.schema.json',
            'components/wb-nav/wb-nav.js',
            'components/wb-nav/wb-nav.schema.json',
            'utils/wb/wb-component-registry.js',
            'utils/wb/wb-component-utils.js'
        ];

        let missingFiles = [];
        let existingFiles = [];

        requiredFiles.forEach(filePath => {
            const fullPath = path.join(this.baseDir, filePath);
            if (fs.existsSync(fullPath)) {
                existingFiles.push(filePath);
            } else {
                missingFiles.push(filePath);
            }
        });

        this.results.fileStructure = {
            status: missingFiles.length === 0 ? 'PASS' : 'FAIL',
            existing: existingFiles.length,
            missing: missingFiles.length,
            missingFiles: missingFiles
        };

        this.log(`File Structure: ${existingFiles.length}/${requiredFiles.length} files found`);
        if (missingFiles.length > 0) {
            this.log(`Missing files: ${missingFiles.join(', ')}`, 'WARN');
        }
    }

    // Test 2: JavaScript Syntax Validation
    testJavaScriptSyntax() {
        this.log('Testing JavaScript syntax...');
        const jsFiles = [
            'components/wb-control-panel/wb-control-panel.js',
            'components/wb-color-bar/wb-color-bar.js',
            'components/wb-color-bars/wb-color-bars.js',
            'components/wb-nav/wb-nav.js',
            'utils/wb/wb-component-registry.js',
            'utils/wb/wb-component-utils.js'
        ];

        let syntaxErrors = [];
        let validFiles = [];

        jsFiles.forEach(filePath => {
            const fullPath = path.join(this.baseDir, filePath);
            if (fs.existsSync(fullPath)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    // Basic syntax check - look for obvious issues
                    if (content.includes('\\n')) {
                        syntaxErrors.push(`${filePath}: Contains literal \\n characters`);
                    } else if (!content.includes('customElements.define')) {
                        // Check if it's a utility file or component
                        if (filePath.includes('components/') && !content.includes('class')) {
                            syntaxErrors.push(`${filePath}: Missing component class definition`);
                        } else {
                            validFiles.push(filePath);
                        }
                    } else {
                        validFiles.push(filePath);
                    }
                } catch (error) {
                    syntaxErrors.push(`${filePath}: ${error.message}`);
                }
            }
        });

        this.results.jsSyntax = {
            status: syntaxErrors.length === 0 ? 'PASS' : 'FAIL',
            valid: validFiles.length,
            errors: syntaxErrors.length,
            syntaxErrors: syntaxErrors
        };

        this.log(`JavaScript Syntax: ${validFiles.length} valid, ${syntaxErrors.length} errors`);
        if (syntaxErrors.length > 0) {
            syntaxErrors.forEach(error => this.log(error, 'ERROR'));
        }
    }

    // Test 3: Schema Validation
    testSchemaFiles() {
        this.log('Testing schema files...');
        const schemaFiles = [
            'components/wb-control-panel/wb-control-panel.schema.json',
            'components/wb-color-bar/wb-color-bar.schema.json',
            'components/wb-color-bars/wb-color-bars.schema.json',
            'components/wb-nav/wb-nav.schema.json'
        ];

        let validSchemas = [];
        let invalidSchemas = [];

        schemaFiles.forEach(schemaPath => {
            const fullPath = path.join(this.baseDir, schemaPath);
            if (fs.existsSync(fullPath)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const schema = JSON.parse(content);
                    
                    // Basic schema validation
                    if (schema.version && schema.tags) {
                        validSchemas.push(schemaPath);
                    } else {
                        invalidSchemas.push(`${schemaPath}: Missing version or tags`);
                    }
                } catch (error) {
                    invalidSchemas.push(`${schemaPath}: ${error.message}`);
                }
            }
        });

        this.results.schemas = {
            status: invalidSchemas.length === 0 ? 'PASS' : 'FAIL',
            valid: validSchemas.length,
            invalid: invalidSchemas.length,
            invalidSchemas: invalidSchemas
        };

        this.log(`Schema Files: ${validSchemas.length} valid, ${invalidSchemas.length} invalid`);
        if (invalidSchemas.length > 0) {
            invalidSchemas.forEach(error => this.log(error, 'ERROR'));
        }
    }

    // Test 4: Component Dependencies Analysis
    testComponentDependencies() {
        this.log('Testing component dependencies...');
        
        const componentFiles = {
            'control-panel': 'components/wb-control-panel/wb-control-panel.js',
            'wb-color-bars': 'components/wb-color-bars/wb-color-bars.js',
            'wb-color-bar': 'components/wb-color-bar/wb-color-bar.js',
            'wb-nav': 'components/wb-nav/wb-nav.js'
        };

        let dependencyAnalysis = {};

        Object.entries(componentFiles).forEach(([componentName, filePath]) => {
            const fullPath = path.join(this.baseDir, filePath);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Look for dependency patterns
                const dependencies = [];
                const registryPatterns = [
                    /loadComponent\(['"`]([^'"`]+)['"`]/g,
                    /loadSingleComponent\(['"`]([^'"`]+)['"`]/g,
                    /getDependencies\(['"`]([^'"`]+)['"`]/g,
                    /wb-[a-z-]+/g
                ];

                registryPatterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        if (match[1] && !dependencies.includes(match[1])) {
                            dependencies.push(match[1]);
                        } else if (match[0].startsWith('wb-') && !dependencies.includes(match[0])) {
                            dependencies.push(match[0]);
                        }
                    }
                });

                dependencyAnalysis[componentName] = dependencies.filter(dep => 
                    dep !== componentName && dep.startsWith('wb-') || dep === 'control-panel'
                );
            }
        });

        this.results.dependencies = {
            status: 'PASS',
            analysis: dependencyAnalysis
        };

        this.log('Component Dependencies Analysis:');
        Object.entries(dependencyAnalysis).forEach(([component, deps]) => {
            this.log(`  ${component}: [${deps.join(', ')}]`);
        });
    }

    // Test 5: Documentation Consistency
    testDocumentationConsistency() {
        this.log('Testing documentation consistency...');
        
        const claudeFiles = [
            'components/wb-control-panel/claude.md',
            'components/wb-color-bar/claude.md',
            'components/wb-color-bars/claude.md'
        ];

        let consistentDocs = [];
        let inconsistentDocs = [];

        claudeFiles.forEach(docPath => {
            const fullPath = path.join(this.baseDir, docPath);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Check for recent updates and completion status
                const hasRecentUpdates = content.includes('October 2025');
                const hasCompletionStatus = content.includes('✅ COMPLETED') || content.includes('COMPLETION REPORT');
                const hasWBComponentRegistry = content.includes('WBComponentRegistry');

                if (hasRecentUpdates && hasCompletionStatus && hasWBComponentRegistry) {
                    consistentDocs.push(docPath);
                } else {
                    const missing = [];
                    if (!hasRecentUpdates) missing.push('recent updates');
                    if (!hasCompletionStatus) missing.push('completion status');
                    if (!hasWBComponentRegistry) missing.push('WBComponentRegistry info');
                    
                    inconsistentDocs.push(`${docPath}: missing ${missing.join(', ')}`);
                }
            }
        });

        this.results.documentation = {
            status: inconsistentDocs.length === 0 ? 'PASS' : 'WARN',
            consistent: consistentDocs.length,
            inconsistent: inconsistentDocs.length,
            issues: inconsistentDocs
        };

        this.log(`Documentation: ${consistentDocs.length} consistent, ${inconsistentDocs.length} issues`);
        if (inconsistentDocs.length > 0) {
            inconsistentDocs.forEach(issue => this.log(issue, 'WARN'));
        }
    }

    // Run all tests
    async runAllTests() {
        this.log('🧪 Starting WB Component Ecosystem Tests');
        console.log('='.repeat(60));

        this.testFileStructure();
        this.testJavaScriptSyntax();
        this.testSchemaFiles();
        this.testComponentDependencies();
        this.testDocumentationConsistency();

        console.log('='.repeat(60));
        this.generateReport();
    }

    // Generate final report
    generateReport() {
        this.log('📊 Test Results Summary');
        console.log('-'.repeat(40));

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;

        Object.entries(this.results).forEach(([testName, result]) => {
            totalTests++;
            const status = result.status;
            
            if (status === 'PASS') {
                passedTests++;
                console.log(`✅ ${testName.toUpperCase()}: ${status}`);
            } else if (status === 'FAIL') {
                failedTests++;
                console.log(`❌ ${testName.toUpperCase()}: ${status}`);
            } else {
                console.log(`⚠️  ${testName.toUpperCase()}: ${status}`);
            }
        });

        console.log('-'.repeat(40));
        console.log(`📊 Final Results: ${passedTests}/${totalTests} passed`);
        
        if (failedTests === 0) {
            console.log('🎉 ALL TESTS PASSED - Component ecosystem is ready!');
        } else {
            console.log(`⚠️  ${failedTests} tests failed - review errors above`);
        }

        console.log('\n🔍 Detailed Results:');
        console.log(JSON.stringify(this.results, null, 2));

        return failedTests === 0;
    }
}

// Run the tests
const testRunner = new ComponentEcosystemTest();
testRunner.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});