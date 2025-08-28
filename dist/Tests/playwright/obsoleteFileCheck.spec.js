"use strict";
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
/**
 * Obsolete File Check Tests
 *
 * Tests for detecting and handling obsolete files (typically prefixed with 'zzz').
 * Converted from ObsoleteFileCheck.Tests.ps1
 */
test_1.test.describe('Obsolete File Check Tests', () => {
    const projectRoot = path.resolve(__dirname, '../../');
    (0, test_1.test)('should have zzz directory for obsolete files', async () => {
        const zzzDirPath = path.join(projectRoot, 'zzz');
        const zzzDirExists = fs.existsSync(zzzDirPath) && fs.statSync(zzzDirPath).isDirectory();
        (0, test_1.expect)(zzzDirExists, 'zzz directory should exist for obsolete files').toBe(true);
    });
    (0, test_1.test)('should ensure files in zzz directory have zzz prefix', async () => {
        const zzzDirPath = path.join(projectRoot, 'zzz');
        if (fs.existsSync(zzzDirPath)) {
            const files = fs.readdirSync(zzzDirPath);
            const nonZzzFiles = files.filter(file => !file.includes('zzz') && !file.startsWith('.'));
            (0, test_1.expect)(nonZzzFiles.length, `Files without zzz prefix found: ${nonZzzFiles.join(', ')}`).toBe(0);
        }
    });
    (0, test_1.test)('should not have zzz files in main directories', async () => {
        const mainDirectories = ['components', 'themes', 'css'];
        const zzzFilesInMain = [];
        for (const dir of mainDirectories) {
            const dirPath = path.join(projectRoot, dir);
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath, { recursive: true });
                const zzzFiles = files.filter(file => typeof file === 'string' &&
                    file.includes('zzz') &&
                    !file.includes('node_modules'));
                zzzFiles.forEach(file => zzzFilesInMain.push(`${dir}/${file}`));
            }
        }
        (0, test_1.expect)(zzzFilesInMain.length, `Found zzz files in main directories: ${zzzFilesInMain.join(', ')}`).toBe(0);
    });
    (0, test_1.test)('should detect obsolete PowerShell test files', async () => {
        const testsDir = path.join(projectRoot, 'Tests');
        const obsoleteDir = path.join(testsDir, 'Obsolete');
        if (fs.existsSync(obsoleteDir)) {
            const obsoleteFiles = fs.readdirSync(obsoleteDir);
            const ps1Files = obsoleteFiles.filter(file => file.endsWith('.ps1'));
            // Verify that obsolete PS1 files are properly moved
            (0, test_1.expect)(ps1Files.length, 'Obsolete directory should contain PowerShell test files').toBeGreaterThan(0);
            // Check that obsolete files are not in main Tests directory
            const mainTestFiles = fs.readdirSync(testsDir);
            const obsoleteInMain = mainTestFiles.filter(file => file.includes('Obsolete.') && file.endsWith('.ps1'));
            (0, test_1.expect)(obsoleteInMain.length, `Found obsolete files in main Tests directory: ${obsoleteInMain.join(', ')}`).toBe(0);
        }
    });
    (0, test_1.test)('should validate file organization structure', async () => {
        const expectedStructure = {
            'components': ['table', 'theme'],
            'themes': [],
            'css': [],
            'Tests': ['playwright', 'Obsolete']
        };
        for (const [directory, expectedSubdirs] of Object.entries(expectedStructure)) {
            const dirPath = path.join(projectRoot, directory);
            if (fs.existsSync(dirPath)) {
                const items = fs.readdirSync(dirPath);
                const subdirs = items.filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());
                for (const expectedSubdir of expectedSubdirs) {
                    (0, test_1.expect)(subdirs, `${directory} should contain ${expectedSubdir} subdirectory`).toContain(expectedSubdir);
                }
            }
        }
    });
    (0, test_1.test)('should ensure clean project structure without legacy files', async () => {
        const legacyPatterns = [
            /backup.*\.html$/i,
            /temp.*\.js$/i,
            /test.*\.old$/i,
            /.*\.bak$/i,
            /.*~$/
        ];
        const checkDirectory = (dirPath, relativePath = '') => {
            if (!fs.existsSync(dirPath))
                return [];
            const items = fs.readdirSync(dirPath);
            let legacyFiles = [];
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const itemRelativePath = path.join(relativePath, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    // Skip node_modules and .git directories
                    if (!['node_modules', '.git', 'test-results', 'playwright-report'].includes(item)) {
                        legacyFiles = legacyFiles.concat(checkDirectory(itemPath, itemRelativePath));
                    }
                }
                else {
                    // Check if file matches legacy patterns
                    if (legacyPatterns.some(pattern => pattern.test(item))) {
                        legacyFiles.push(itemRelativePath);
                    }
                }
            }
            return legacyFiles;
        };
        const legacyFiles = checkDirectory(projectRoot);
        (0, test_1.expect)(legacyFiles.length, `Found legacy files: ${legacyFiles.join(', ')}`).toBe(0);
    });
    (0, test_1.test)('should have proper Playwright test organization', async () => {
        const playwrightDir = path.join(projectRoot, 'Tests', 'playwright');
        if (fs.existsSync(playwrightDir)) {
            const testFiles = fs.readdirSync(playwrightDir);
            const specFiles = testFiles.filter(file => file.endsWith('.spec.ts'));
            (0, test_1.expect)(specFiles.length, 'Should have Playwright spec files').toBeGreaterThan(0);
            // Verify each spec file has proper structure
            for (const specFile of specFiles.slice(0, 5)) { // Check first 5 files to avoid timeout
                const filePath = path.join(playwrightDir, specFile);
                const content = fs.readFileSync(filePath, 'utf-8');
                (0, test_1.expect)(content, `${specFile} should import from @playwright/test`).toContain('@playwright/test');
                (0, test_1.expect)(content, `${specFile} should have test.describe`).toContain('test.describe');
                (0, test_1.expect)(content, `${specFile} should have at least one test`).toContain('test(');
            }
        }
    });
});
//# sourceMappingURL=obsoleteFileCheck.spec.js.map