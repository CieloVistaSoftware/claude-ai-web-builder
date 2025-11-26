/**
 * WB Component Migration Checker
 * 
 * Scans all wb-* components and reports their compliance with standards:
 * 1. Extends WBBaseComponent
 * 2. Has observedAttributes defined
 * 3. Has property getters/setters
 * 
 * Usage:
 *   node check-component-compliance.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function checkComponent(componentName, filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const checks = {
            extendsWBBase: content.includes('extends WBBaseComponent'),
            hasObservedAttrs: content.includes('static get observedAttributes'),
            hasSuper: content.includes('super.connectedCallback'),
            usesLogging: content.includes('this.logInfo') || content.includes('this.logError'),
            usesFireEvent: content.includes('this.fireEvent'),
            hasGetters: /get \w+\(\)/g.test(content),
            hasSetters: /set \w+\(/g.test(content)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        const percentage = Math.round((score / total) * 100);
        
        return {
            name: componentName,
            ...checks,
            score,
            total,
            percentage
        };
    } catch (error) {
        return null;
    }
}

function getComponentName(dirName) {
    // Extract component name from directory
    return dirName;
}

function main() {
    console.log(`${colors.bold}${colors.cyan}WB Component Compliance Checker${colors.reset}\n`);
    console.log(`Scanning: ${COMPONENTS_DIR}\n`);
    
    const results = [];
    const dirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('wb-'))
        .map(dirent => dirent.name);
    
    dirs.forEach(dir => {
        const componentName = getComponentName(dir);
        const jsFile = path.join(COMPONENTS_DIR, dir, `${dir}.js`);
        
        if (fs.existsSync(jsFile)) {
            const result = checkComponent(componentName, jsFile);
            if (result) {
                results.push(result);
            }
        }
    });
    
    // Sort by percentage (lowest first - needs most work)
    results.sort((a, b) => a.percentage - b.percentage);
    
    console.log(`${colors.bold}Components Needing Attention:${colors.reset}\n`);
    
    // Print components that need work
    const needsWork = results.filter(r => r.percentage < 100);
    needsWork.forEach(result => {
        const statusColor = result.percentage >= 70 ? colors.yellow : colors.red;
        const statusSymbol = result.percentage >= 70 ? '⚠️' : '❌';
        
        console.log(`${statusSymbol}  ${colors.bold}${result.name}${colors.reset} (${statusColor}${result.percentage}%${colors.reset})`);
        console.log(`   ${result.extendsWBBase ? '✅' : '❌'} Extends WBBaseComponent`);
        console.log(`   ${result.hasObservedAttrs ? '✅' : '❌'} Has observedAttributes`);
        console.log(`   ${result.hasSuper ? '✅' : '❌'} Calls super.connectedCallback()`);
        console.log(`   ${result.usesLogging ? '✅' : '❌'} Uses logging (logInfo/logError)`);
        console.log(`   ${result.usesFireEvent ? '✅' : '❌'} Uses fireEvent()`);
        console.log(`   ${result.hasGetters ? '✅' : '❌'} Has property getters`);
        console.log(`   ${result.hasSetters ? '✅' : '❌'} Has property setters`);
        console.log('');
    });
    
    console.log(`${colors.bold}${colors.green}Compliant Components:${colors.reset}\n`);
    
    const compliant = results.filter(r => r.percentage === 100);
    compliant.forEach(result => {
        console.log(`✅  ${colors.bold}${result.name}${colors.reset} (${colors.green}100%${colors.reset})`);
    });
    
    console.log(`\n${colors.bold}Summary:${colors.reset}`);
    console.log(`Total Components: ${results.length}`);
    console.log(`${colors.green}Compliant: ${compliant.length}${colors.reset}`);
    console.log(`${colors.yellow}Needs Work: ${needsWork.filter(r => r.percentage >= 70).length}${colors.reset}`);
    console.log(`${colors.red}Critical: ${needsWork.filter(r => r.percentage < 70).length}${colors.reset}`);
    
    const avgCompliance = Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / results.length
    );
    console.log(`\nAverage Compliance: ${avgCompliance}%`);
    
    // Generate migration priority list
    console.log(`\n${colors.bold}Migration Priority (start here):${colors.reset}`);
    needsWork.slice(0, 10).forEach((result, index) => {
        console.log(`${index + 1}. ${result.name} (${result.percentage}%)`);
    });
}

main();
