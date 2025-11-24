#!/usr/bin/env node
/**
 * BATCH AUDIT RUNNER - WB Framework Component Auditor
 * Scans all 36+ components for ES Module issues
 * Updates currentstatus.json with findings
 * Generates batch-audit-log.json report
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    statusJsonPath: './currentstatus.json',
    componentsPath: '../components',
    logFile: './batch-audit-log.json'
};

class ComponentAuditor {
    async auditComponent(componentName, filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                return {
                    component: componentName,
                    file: path.basename(filePath),
                    status: '⏭️ SKIP',
                    issues: 'No demo file found',
                    needsFix: false
                };
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const hasImports = /import\s+/.test(content);
            const hasModuleType = /type\s*=\s*["']?module["']?/.test(content);

            let status, issues, needsFix = false;
            
            if (hasImports && !hasModuleType) {
                status = '⚠️ NEEDS FIX';
                issues = 'Missing type="module" on script tags with imports';
                needsFix = true;
            } else if (hasModuleType) {
                status = '✅ CLEAN';
                issues = 'Already has type="module"';
            } else {
                status = '✅ OK';
                issues = 'No ES Module issues detected';
            }

            return {
                component: componentName,
                file: path.basename(filePath),
                status: status,
                issues: issues,
                needsFix: needsFix
            };
        } catch (error) {
            return {
                component: componentName,
                file: path.basename(filePath),
                status: '❌ ERROR',
                issues: `Failed to read file: ${error.message}`,
                needsFix: false
            };
        }
    }

    async auditAllComponents() {
        console.log('\n🚀 BATCH AUDIT STARTING\n');
        const startTime = Date.now();
        const results = [];

        try {
            if (!fs.existsSync(CONFIG.componentsPath)) {
                console.error('❌ Components folder not found');
                return results;
            }

            const components = fs.readdirSync(CONFIG.componentsPath)
                .filter(f => fs.statSync(path.join(CONFIG.componentsPath, f)).isDirectory())
                .filter(f => f.startsWith('wb-'));

            console.log(`📋 Auditing ${components.length} components...\n`);

            for (let i = 0; i < components.length; i++) {
                const comp = components[i];
                const demoFile = path.join(CONFIG.componentsPath, comp, `${comp}-demo.html`);
                
                const pct = Math.round((i / components.length) * 100);
                process.stdout.write(`\r  [${pct}%] ${i + 1}/${components.length} - ${comp}`);

                const result = await this.auditComponent(comp, demoFile);
                results.push(result);
            }

            console.log('\n\n✅ Audit complete!\n');
        } catch (error) {
            console.error('❌ Audit failed:', error.message);
        }

        return results;
    }
}

async function main() {
    const auditor = new ComponentAuditor();
    const results = await auditor.auditAllComponents();

    // Generate report
    const clean = results.filter(r => r.status.includes('✅') && !r.status.includes('CLEAN')).length;
    const cleanProper = results.filter(r => r.status === '✅ CLEAN').length;
    const needsFix = results.filter(r => r.needsFix).length;
    const errors = results.filter(r => r.status.includes('❌')).length;
    const skipped = results.filter(r => r.status.includes('⏭️')).length;

    console.log('📊 SUMMARY');
    console.log(`   Total: ${results.length}`);
    console.log(`   ✅ Clean: ${cleanProper}`);
    console.log(`   ✅ OK: ${clean}`);
    console.log(`   ⚠️  Needs Fix: ${needsFix}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   ⏭️  Skipped: ${skipped}\n`);

    // Update JSON
    if (fs.existsSync(CONFIG.statusJsonPath)) {
        try {
            const status = JSON.parse(fs.readFileSync(CONFIG.statusJsonPath, 'utf8'));
            status.allTasks[0].auditLog = results;
            status.allTasks[0].percentComplete = 40;
            status.metrics.criticalIssuesBlocking = needsFix;
            status.lastUpdated = new Date().toISOString();
            fs.writeFileSync(CONFIG.statusJsonPath, JSON.stringify(status, null, 2));
            console.log('✅ Updated: currentstatus.json');
        } catch (err) {
            console.error('❌ Failed to update JSON:', err.message);
        }
    }

    // Save log
    const logData = {
        batchId: `batch-${Date.now()}`,
        executedAt: new Date().toISOString(),
        summary: {
            total: results.length,
            clean: cleanProper,
            ok: clean,
            needsFix: needsFix,
            errors: errors,
            skipped: skipped
        },
        results: results
    };

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(logData, null, 2));
    console.log('✅ Saved: batch-audit-log.json\n');
}

main().catch(console.error);
