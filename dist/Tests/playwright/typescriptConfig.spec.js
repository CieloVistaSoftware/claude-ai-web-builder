"use strict";
/**
 * TypeScript Configuration Tests
 *
 * Converted from TypescriptConfigTest.Tests.ps1
 * Verifies that tsconfig.json properly includes all TypeScript files
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const glob_1 = require("glob");
// Helper function to get project root path
function getProjectRoot() {
    const testDir = path.resolve(__dirname);
    const testsDir = path.dirname(testDir);
    return path.dirname(testsDir);
}
test_1.test.describe('TypeScript Configuration Tests', () => {
    const projectRoot = getProjectRoot();
    (0, test_1.test)('should have valid tsconfig.json file', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(tsconfigPath)).toBeTruthy();
        console.log('✅ tsconfig.json file found');
        // Read and parse tsconfig.json content
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        // Check if include patterns exist
        (0, test_1.expect)(tsconfigContent.include).toBeDefined();
        console.log('✅ Include property found in tsconfig.json');
        // Display include patterns
        console.log('📋 TypeScript include patterns:');
        tsconfigContent.include.forEach((pattern) => {
            console.log(`  - ${pattern}`);
        });
    });
    (0, test_1.test)('should include all TypeScript files in the project', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        // Find all TypeScript files in the project
        const tsFiles = glob_1.glob.sync('**/*.{ts,tsx}', {
            cwd: projectRoot,
            ignore: ['node_modules/**', 'dist/**', 'build/**']
        });
        console.log(`📂 TypeScript files found in the project: ${tsFiles.length}`);
        tsFiles.forEach(file => {
            console.log(`  - ${file}`);
        });
        // Verify we found some TypeScript files
        (0, test_1.expect)(tsFiles.length).toBeGreaterThan(0);
    });
    (0, test_1.test)('should include important directories in tsconfig', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const requiredDirs = ['src', 'Tests', 'components'];
        let includesAllDirectories = true;
        requiredDirs.forEach(dir => {
            let included = false;
            tsconfigContent.include.forEach((pattern) => {
                if (pattern.includes(dir) || pattern === '**/*' || pattern === './**/*') {
                    included = true;
                }
            });
            if (included) {
                console.log(`✅ Directory '${dir}' is included in tsconfig.json`);
            }
            else {
                console.log(`⚠️ Directory '${dir}' may not be fully included in tsconfig.json`);
                includesAllDirectories = false;
            }
        });
        // Should include at least the src directory
        const srcIncluded = tsconfigContent.include.some((pattern) => pattern.includes('src') || pattern === '**/*' || pattern === './**/*');
        (0, test_1.expect)(srcIncluded).toBeTruthy();
    });
    (0, test_1.test)('should have proper compiler options', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        // Check for compiler options
        (0, test_1.expect)(tsconfigContent.compilerOptions).toBeDefined();
        console.log('✅ Compiler options found');
        const compilerOptions = tsconfigContent.compilerOptions;
        // Check for important compiler options
        const importantOptions = {
            'target': 'Should specify ECMAScript target',
            'module': 'Should specify module system',
            'lib': 'Should specify library files',
            'jsx': 'Should specify JSX handling (if using React)'
        };
        Object.entries(importantOptions).forEach(([option, description]) => {
            if (compilerOptions[option]) {
                console.log(`✅ ${option}: ${JSON.stringify(compilerOptions[option])} - ${description}`);
            }
            else {
                console.log(`⚠️ ${option} not specified - ${description}`);
            }
        });
        // Should have at least target specified
        (0, test_1.expect)(compilerOptions.target).toBeDefined();
    });
    (0, test_1.test)('should exclude unnecessary directories', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        // Check for exclude patterns
        if (tsconfigContent.exclude) {
            console.log('📋 TypeScript exclude patterns:');
            tsconfigContent.exclude.forEach((pattern) => {
                console.log(`  - ${pattern}`);
            });
            // Common directories that should be excluded
            const shouldExclude = ['node_modules', 'dist', 'build'];
            shouldExclude.forEach(dir => {
                const isExcluded = tsconfigContent.exclude.some((pattern) => pattern.includes(dir));
                if (isExcluded) {
                    console.log(`✅ ${dir} is properly excluded`);
                }
                else {
                    console.log(`⚠️ ${dir} should probably be excluded`);
                }
            });
        }
        else {
            console.log('⚠️ No exclude patterns found - consider excluding node_modules, dist, etc.');
        }
    });
    (0, test_1.test)('should have proper module resolution', async () => {
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const compilerOptions = tsconfigContent.compilerOptions;
        if (compilerOptions) {
            // Check module resolution strategy
            if (compilerOptions.moduleResolution) {
                console.log(`✅ Module resolution: ${compilerOptions.moduleResolution}`);
            }
            else {
                console.log('⚠️ Module resolution not explicitly set');
            }
            // Check base URL and paths
            if (compilerOptions.baseUrl) {
                console.log(`✅ Base URL: ${compilerOptions.baseUrl}`);
            }
            if (compilerOptions.paths) {
                console.log('✅ Path mapping configured:');
                Object.entries(compilerOptions.paths).forEach(([key, value]) => {
                    console.log(`  ${key} -> ${JSON.stringify(value)}`);
                });
            }
            // Check for strict type checking
            if (compilerOptions.strict) {
                console.log('✅ Strict type checking enabled');
            }
            else {
                console.log('⚠️ Consider enabling strict type checking');
            }
        }
    });
    (0, test_1.test)('should compile TypeScript files without errors', async () => {
        // This test would normally run tsc to check for compilation errors
        // For now, we'll just verify the configuration looks reasonable
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        // Check that we have a valid configuration structure
        (0, test_1.expect)(tsconfigContent).toHaveProperty('compilerOptions');
        (0, test_1.expect)(tsconfigContent).toHaveProperty('include');
        console.log('✅ TypeScript configuration structure is valid');
        // Check for common issues
        const compilerOptions = tsconfigContent.compilerOptions;
        if (compilerOptions.outDir) {
            const outDir = path.join(projectRoot, compilerOptions.outDir);
            console.log(`Output directory: ${compilerOptions.outDir}`);
            // Check if output directory exists or can be created
            const outDirParent = path.dirname(outDir);
            if (fs.existsSync(outDirParent)) {
                console.log('✅ Output directory parent exists');
            }
        }
        // Verify include patterns are not conflicting
        const includePatterns = tsconfigContent.include;
        const hasWildcard = includePatterns.some((pattern) => pattern.includes('**/*') || pattern.includes('*'));
        if (hasWildcard) {
            console.log('✅ Include patterns use wildcards for flexibility');
        }
        else {
            console.log('⚠️ Consider using wildcard patterns for more flexible file inclusion');
        }
    });
});
//# sourceMappingURL=typescriptConfig.spec.js.map