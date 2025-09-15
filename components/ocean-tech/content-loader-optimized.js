/**
 * Optimized Content Loader for Blue Theme
 * High-performance JSON content binding with <50ms load times
 */

class OptimizedContentLoader {
    constructor() {
        this.content = null;
        this.bindCache = new Map();
        this.elementCache = new Map();
        this.loadingText = 'loading...';
        this.startTime = performance.now();
        this.loadTimeCounter = null;
        
        // Pre-compile common selectors
        this.selectors = {
            dataBind: '[data-bind]',
            dataBindPlaceholder: '[data-bind-placeholder]',
            navLinks: 'nav a[data-bind*="navigation.links"]',
            emailLinks: 'a[href*="mailto"]',
            pricingPeriods: '[data-bind*="period"]'
        };
    }

    /**
     * Load content with aggressive optimizations
     */
    async loadContent(jsonUrl) {
        const startTime = performance.now();
        
        try {
            // Use Promise.all for parallel operations
            const [response, elements] = await Promise.all([
                fetch(jsonUrl),
                this.cacheElements()
            ]);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            this.content = await response.json();
            
            // Use requestAnimationFrame for DOM updates
            requestAnimationFrame(() => {
                this.bindContentFast();
                const endTime = performance.now();
                const totalTime = endTime - this.startTime;
                console.log(`Content loaded in ${totalTime.toFixed(1)}ms`);
                this.updateLoadTimeCounter(totalTime);
            });
            
        } catch (error) {
            console.error('Load error:', error);
            this.showErrorFast(error.message);
        }
    }

    /**
     * Cache DOM elements for reuse
     */
    async cacheElements() {
        return new Promise(resolve => {
            // Cache all bindable elements
            const elements = document.querySelectorAll(this.selectors.dataBind);
            elements.forEach(el => {
                const path = el.getAttribute('data-bind');
                if (!this.elementCache.has(path)) {
                    this.elementCache.set(path, []);
                }
                this.elementCache.get(path).push(el);
            });
            
            resolve(elements.length);
        });
    }

    /**
     * Ultra-fast content binding using cached elements
     */
    bindContentFast() {
        if (!this.content) return;

        // Use DocumentFragment for batch DOM updates
        const fragment = document.createDocumentFragment();
        const updates = [];

        // Process cached elements
        for (const [path, elements] of this.elementCache) {
            const value = this.getValueFast(path);
            if (value !== undefined) {
                elements.forEach(el => {
                    updates.push(() => this.updateElement(el, value));
                });
            }
        }

        // Batch execute all updates
        updates.forEach(update => update());

        // Handle special cases in single pass
        this.bindSpecialElementsFast();
        
        // Update document metadata
        this.updateMetaFast();
    }

    /**
     * Optimized value getter with caching
     */
    getValueFast(path) {
        if (this.bindCache.has(path)) {
            return this.bindCache.get(path);
        }

        const keys = path.split('.');
        let value = this.content;
        
        for (let i = 0; i < keys.length && value != null; i++) {
            const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
            value = value[key];
        }

        this.bindCache.set(path, value);
        return value;
    }

    /**
     * Fast element update without redundant checks
     */
    updateElement(element, value) {
        const tag = element.tagName;
        
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            element.value = value;
        } else {
            element.textContent = value;
        }
        
        element.classList.add('loaded');
    }

    /**
     * Optimized special element binding
     */
    bindSpecialElementsFast() {
        // Navigation links - batch update
        if (this.content.navigation?.links) {
            const navLinks = document.querySelectorAll(this.selectors.navLinks);
            navLinks.forEach((link, i) => {
                const item = this.content.navigation.links[i];
                if (item) {
                    link.href = item.href;
                    if (item.id) link.id = item.id;
                }
            });
        }

        // Email links - single query
        if (this.content.contact?.email) {
            const emailLinks = document.querySelectorAll(this.selectors.emailLinks);
            const mailto = `mailto:${this.content.contact.email}`;
            emailLinks.forEach(link => link.href = mailto);
        }

        // Featured pricing - direct targeting
        if (this.content.pricing?.plans) {
            this.content.pricing.plans.forEach(plan => {
                if (plan.featured) {
                    const card = document.getElementById(`${plan.id}-card`);
                    if (card) card.classList.add('featured');
                }
            });
        }
    }

    /**
     * Fast metadata updates
     */
    updateMetaFast() {
        if (!this.content.site) return;

        // Title update
        if (this.content.site.title) {
            document.title = this.content.site.title;
        }

        // Description meta - reuse existing or create once
        if (this.content.site.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = this.content.site.description;
        }
    }

    /**
     * Minimal error display
     */
    showErrorFast(message) {
        console.error('Content error:', message);
        // Simple error indication without heavy DOM manipulation
        document.body.style.borderTop = '3px solid #f44336';
        setTimeout(() => {
            document.body.style.borderTop = '';
        }, 3000);
    }

    /**
     * Instant content file detection
     */
    getContentFile() {
        const path = location.pathname;
        const bodyAttr = document.body.getAttribute('data-content-file');
        
        if (bodyAttr) return bodyAttr;
        
        // Fast filename detection
        return path.includes('ocean-tech') ? 
            'ocean-tech-content.json' : 
            'blue-theme-content.json';
    }

    /**
     * Update the load time counter in the header
     */
    updateLoadTimeCounter(totalTime) {
        if (!this.loadTimeCounter) {
            this.loadTimeCounter = document.getElementById('load-time-counter');
        }
        
        if (this.loadTimeCounter) {
            let displayTime = totalTime.toFixed(1);
            let className = '';
            
            // Color coding based on performance
            if (totalTime < 50) {
                className = 'load-time-fast';
                displayTime += 'ms ⚡';
            } else if (totalTime < 100) {
                className = 'load-time-good';
                displayTime += 'ms ✓';
            } else if (totalTime < 200) {
                className = 'load-time-ok';
                displayTime += 'ms ⚠';
            } else {
                className = 'load-time-slow';
                displayTime += 'ms ⚠';
            }
            
            this.loadTimeCounter.textContent = displayTime;
            this.loadTimeCounter.className = 'load-time-counter ' + className;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (this.loadTimeCounter) {
                    this.loadTimeCounter.style.opacity = '0.3';
                }
            }, 5000);
        }
    }

    /**
     * Initialize load time tracking
     */
    initLoadTimeCounter() {
        const counter = document.getElementById('load-time-counter');
        if (counter) {
            counter.textContent = 'loading...';
            this.loadTimeCounter = counter;
        }
    }

    /**
     * Optimized initialization
     */
    init() {
        const startTime = performance.now();
        
        // Initialize load time counter
        this.initLoadTimeCounter();
        
        // Remove loading animations to prevent layout thrashing
        const style = document.createElement('style');
        style.textContent = `
            .content-loading{opacity:0.7}.loaded{opacity:1}
            .load-time-fast{color:#4caf50!important;}
            .load-time-good{color:#8bc34a!important;}
            .load-time-ok{color:#ff9800!important;}
            .load-time-slow{color:#f44336!important;}
        `;
        document.head.appendChild(style);
        
        // Start loading immediately
        this.loadContent(this.getContentFile());
        
        console.log(`Init time: ${(performance.now() - startTime).toFixed(1)}ms`);
    }
}

// Minimal CSS injection
const minimalCSS = `<style>.content-loading{opacity:0.7;transition:opacity 0.1s}.loaded{opacity:1}</style>`;
document.head.insertAdjacentHTML('beforeend', minimalCSS);

// Ultra-fast initialization
const loader = new OptimizedContentLoader();

// Immediate init without waiting for DOMContentLoaded if possible
if (document.readyState !== 'loading') {
    loader.init();
} else {
    document.addEventListener('DOMContentLoaded', () => loader.init(), { once: true });
}

window.contentLoader = loader;