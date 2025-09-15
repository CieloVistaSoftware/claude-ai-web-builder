/**
 * Inline Content Loader - Zero Network Delay
 * Embeds content directly in HTML for instant loading
 */

class InlineContentLoader {
    constructor(inlineContent) {
        this.content = inlineContent;
        this.bindMap = new Map();
        this.setupBindMap();
    }

    /**
     * Pre-build element-to-content mapping for O(1) lookups
     */
    setupBindMap() {
        const elements = document.querySelectorAll('[data-bind]');
        elements.forEach(el => {
            const path = el.getAttribute('data-bind');
            const value = this.getValue(path);
            if (value !== undefined) {
                this.bindMap.set(el, value);
            }
        });
    }

    /**
     * Get nested value optimized for small JSON objects
     */
    getValue(path) {
        const keys = path.split('.');
        let current = this.content;
        
        for (const key of keys) {
            if (current == null) return undefined;
            current = current[isNaN(key) ? key : parseInt(key)];
        }
        
        return current;
    }

    /**
     * Instant binding using pre-computed map
     */
    bindInstant() {
        // Batch DOM updates
        for (const [element, value] of this.bindMap) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }

        // Handle special elements
        this.bindSpecials();
        
        // Update metadata
        if (this.content.site?.title) document.title = this.content.site.title;
    }

    /**
     * Handle special bindings
     */
    bindSpecials() {
        // Navigation hrefs
        if (this.content.navigation?.links) {
            document.querySelectorAll('nav a').forEach((link, i) => {
                const item = this.content.navigation.links[i];
                if (item) link.href = item.href;
            });
        }

        // Email links
        if (this.content.contact?.email) {
            document.querySelectorAll('a[href*="mailto"]').forEach(link => {
                link.href = `mailto:${this.content.contact.email}`;
            });
        }
    }

    /**
     * Initialize immediately
     */
    init() {
        this.bindInstant();
    }
}

// Content will be injected here by build process
let INLINE_CONTENT = null;

// Initialize instantly if content is available
if (INLINE_CONTENT) {
    const loader = new InlineContentLoader(INLINE_CONTENT);
    loader.init();
} else {
    // Fallback to optimized loader
    console.warn('Inline content not found, using fallback loader');
    document.head.insertAdjacentHTML('beforeend', '<script src="content-loader-optimized.js"></script>');
}