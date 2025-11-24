// link-ref-checker.cjs
// Checks all <link> elements in HTML files for broken or malformed hrefs

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const htmlDir = path.join(__dirname, '..', 'tests');
const pattern = '**/*.html';

function checkLinkRefs(file) {
    const html = fs.readFileSync(file, 'utf8');
    const linkRegex = /<link\s+[^>]*href=["']([^"'>]+)["'][^>]*>/gi;
    let match;
    const results = [];
    while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        // Ignore external links
        if (/^(https?:)?\/\//.test(href)) continue;
        // Resolve relative path
        const absPath = path.resolve(path.dirname(file), href);
        const exists = fs.existsSync(absPath);
        results.push({
            file,
            href,
            absPath,
            exists
        });
    }
    return results;
}

function main() {
    const files = glob.sync(pattern, { cwd: htmlDir, absolute: true });
    let allResults = [];
    files.forEach(file => {
        const res = checkLinkRefs(file);
        if (res.length > 0) {
            allResults = allResults.concat(res);
        }
    });
    if (allResults.length === 0) {
        console.log('No <link> elements found in HTML files.');
        return;
    }
    allResults.forEach(r => {
        if (!r.exists) {
            console.log(`[BROKEN] ${r.file}\n  href: ${r.href}\n  resolved: ${r.absPath}`);
        } else {
            console.log(`[OK] ${r.file}\n  href: ${r.href}`);
        }
    });
}

main();
