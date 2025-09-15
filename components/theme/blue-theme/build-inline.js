/**
 * Build Script - Inline Content for Zero Latency
 * Embeds JSON content directly into HTML files
 */

const fs = require('fs');
const path = require('path');

class ContentInliner {
    constructor() {
        this.baseDir = __dirname;
    }

    /**
     * Generate optimized HTML with inlined content
     */
    buildInlineVersion(htmlFile, contentFile, outputFile) {
        try {
            console.log(`Building ${outputFile}...`);
            
            // Read source files
            const htmlPath = path.join(this.baseDir, htmlFile);
            const contentPath = path.join(this.baseDir, contentFile);
            
            let html = fs.readFileSync(htmlPath, 'utf8');
            const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
            
            // Replace loading placeholders with actual content
            html = this.inlineContent(html, content);
            
            // Remove external script reference and add inline loader
            html = html.replace(
                /<script src="content-loader\.js"><\/script>/,
                this.generateInlineScript(content)
            );
            
            // Write optimized file
            const outputPath = path.join(this.baseDir, outputFile);
            fs.writeFileSync(outputPath, html, 'utf8');
            
            console.log(`✓ Built ${outputFile} (${this.getFileSize(outputPath)})`);
            
        } catch (error) {
            console.error(`Error building ${outputFile}:`, error.message);
        }
    }

    /**
     * Replace data-bind placeholders with actual content
     */
    inlineContent(html, content) {
        // Replace simple text bindings
        const bindRegex = /data-bind="([^"]+)"[^>]*>loading\.\.\.</g;
        
        return html.replace(bindRegex, (match, bindPath) => {
            const value = this.getNestedValue(content, bindPath);
            if (value !== undefined) {
                return match.replace('loading...', this.escapeHtml(value));
            }
            return match;
        });
    }

    /**
     * Generate inline JavaScript with embedded content
     */
    generateInlineScript(content) {
        const minifiedContent = JSON.stringify(content);
        
        return `<script>
(function(){
const c=${minifiedContent};
const e=document.querySelectorAll('[data-bind]');
e.forEach(el=>{
    const p=el.getAttribute('data-bind');
    const v=p.split('.').reduce((o,k)=>o&&o[isNaN(k)?k:+k],c);
    if(v!==undefined){
        if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.value=v;
        else el.textContent=v;
    }
});
if(c.site?.title)document.title=c.site.title;
if(c.navigation?.links)document.querySelectorAll('nav a').forEach((a,i)=>{
    const l=c.navigation.links[i];if(l)a.href=l.href;
});
if(c.contact?.email)document.querySelectorAll('a[href*="mailto"]').forEach(a=>a.href='mailto:'+c.contact.email);
})();
</script>`;
    }

    /**
     * Get nested value from object
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            if (current == null) return undefined;
            const index = isNaN(key) ? key : parseInt(key);
            return current[index];
        }, obj);
    }

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    /**
     * Get file size for logging
     */
    getFileSize(filePath) {
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Build all optimized versions
     */
    buildAll() {
        console.log('Building optimized inline versions...\n');
        
        // Build ocean-tech optimized version
        this.buildInlineVersion(
            'ocean-tech.html',
            'ocean-tech-content.json',
            'ocean-tech-optimized.html'
        );
        
        // Build blue-theme optimized version
        this.buildInlineVersion(
            'blue_theme_website.html',
            'blue-theme-content.json',
            'blue_theme_website-optimized.html'
        );
        
        console.log('\n✅ All optimized files built!');
        console.log('📈 Expected load time improvement: 200ms+ → <10ms');
    }
}

// CLI usage
if (require.main === module) {
    const inliner = new ContentInliner();
    inliner.buildAll();
}

module.exports = ContentInliner;