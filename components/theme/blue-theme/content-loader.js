/**
 * Content Loader for Blue Theme
 * Binds JSON content to HTML elements using data-bind attributes
 */

class ContentLoader {
    constructor() {
        this.content = null;
        this.loadingText = 'loading...';
        this.startTime = performance.now();
        this.loadTimeCounter = null;
    }

    /**
     * Load content from JSON file and bind to page
     * @param {string} jsonUrl - URL to the JSON content file
     */
    async loadContent(jsonUrl) {
        try {
            console.log(`Loading content from: ${jsonUrl}`);
            const response = await fetch(jsonUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
            }
            
            this.content = await response.json();
            console.log('Content loaded successfully:', this.content);
            
            this.bindContent();
            this.updateTitle();
            this.updateMetaTags();
            
            // Update load time counter
            const endTime = performance.now();
            const totalTime = endTime - this.startTime;
            this.updateLoadTimeCounter(totalTime);
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Failed to load content. Please try refreshing the page.');
        }
    }

    /**
     * Bind content to all elements with data-bind attributes
     */
    bindContent() {
        if (!this.content) {
            console.warn('No content available to bind');
            return;
        }

        // Find all elements with data-bind attributes
        const boundElements = document.querySelectorAll('[data-bind]');
        console.log(`Found ${boundElements.length} elements to bind`);

        boundElements.forEach(element => {
            const bindPath = element.getAttribute('data-bind');
            const value = this.getNestedValue(this.content, bindPath);
            
            if (value !== undefined && value !== null) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.type === 'text' || element.type === 'email' || element.tagName === 'TEXTAREA') {
                        element.value = value;
                    }
                } else {
                    element.innerHTML = value;
                }
                
                // Add CSS class to indicate content is loaded
                element.classList.add('content-loaded');
                element.classList.remove('content-loading');
            } else {
                console.warn(`No value found for binding path: ${bindPath}`);
                element.classList.add('content-error');
            }
        });

        // Handle placeholder bindings
        const placeholderElements = document.querySelectorAll('[data-bind-placeholder]');
        placeholderElements.forEach(element => {
            const bindPath = element.getAttribute('data-bind-placeholder');
            const value = this.getNestedValue(this.content, bindPath);
            
            if (value !== undefined && value !== null) {
                element.setAttribute('placeholder', value);
            }
        });

        // Handle href bindings for navigation
        this.bindNavigation();
        
        // Handle special cases
        this.bindSpecialElements();
    }

    /**
     * Bind navigation links with proper hrefs
     */
    bindNavigation() {
        if (this.content.navigation && this.content.navigation.links) {
            const navLinks = document.querySelectorAll('nav a[data-bind*="navigation.links"]');
            
            navLinks.forEach((link, index) => {
                const navItem = this.content.navigation.links[index];
                if (navItem) {
                    link.href = navItem.href;
                    if (navItem.id) {
                        link.id = navItem.id;
                    }
                }
            });
        }
    }

    /**
     * Handle special element bindings that need custom logic
     */
    bindSpecialElements() {
        // Handle pricing period spans
        const pricingPeriods = document.querySelectorAll('[data-bind*="period"]');
        pricingPeriods.forEach(element => {
            const bindPath = element.getAttribute('data-bind');
            const value = this.getNestedValue(this.content, bindPath);
            if (value) {
                element.textContent = value;
            }
        });

        // Handle contact email links
        if (this.content.contact && this.content.contact.email) {
            const emailLinks = document.querySelectorAll('a[href*="mailto"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${this.content.contact.email}`;
            });
        }

        // Handle featured pricing cards
        if (this.content.pricing && this.content.pricing.plans) {
            this.content.pricing.plans.forEach((plan, index) => {
                if (plan.featured) {
                    const cardElement = document.getElementById(`${plan.id}-card`);
                    if (cardElement) {
                        cardElement.classList.add('featured');
                    }
                }
            });
        }
    }

    /**
     * Update page title
     */
    updateTitle() {
        if (this.content.site && this.content.site.title) {
            document.title = this.content.site.title;
        }
    }

    /**
     * Update meta tags
     */
    updateMetaTags() {
        if (this.content.site) {
            // Update description meta tag
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
    }

    /**
     * Get nested value from object using dot notation path
     * @param {Object} obj - The object to search
     * @param {string} path - Dot notation path (e.g., 'hero.title')
     * @returns {*} The value at the path or undefined
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            // Handle array indices like 'cards.0.title'
            if (!isNaN(key)) {
                key = parseInt(key);
            }
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'content-error-notification';
        errorDiv.innerHTML = `
            <div style="background: #f44336; color: white; padding: 1rem; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
                <strong>Content Loading Error:</strong> ${message}
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 1rem; background: none; border: 1px solid white; color: white; padding: 0.25rem 0.5rem; cursor: pointer;">×</button>
            </div>
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingElements = document.querySelectorAll('[data-bind]');
        loadingElements.forEach(element => {
            element.classList.add('content-loading');
            if (element.textContent.trim() === '') {
                element.textContent = this.loadingText;
            }
        });
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
            let className = 'load-time-counter';
            
            // Color coding based on performance
            if (totalTime < 50) {
                displayTime += 'ms ⚡';
            } else if (totalTime < 100) {
                displayTime += 'ms ✓';
            } else if (totalTime < 200) {
                displayTime += 'ms ⚠';
            } else {
                displayTime += 'ms ⚠';
            }
            
            this.loadTimeCounter.textContent = displayTime;
            this.loadTimeCounter.className = className;
            
            console.log(`Content loaded in ${totalTime.toFixed(1)}ms`);
        }
    }

    /**
     * Auto-detect content file based on page
     */
    autoDetectContentFile() {
        const filename = window.location.pathname.split('/').pop();
        
        if (filename.includes('ocean-tech')) {
            return 'ocean-tech-content.json';
        } else if (filename.includes('blue_theme_website')) {
            return 'blue-theme-content.json';
        }
        
        // Default fallback
        return 'ocean-tech-content.json';
    }

    /**
     * Initialize content loader with auto-detection
     */
    init() {
        console.log('ContentLoader initializing...');
        this.showLoading();
        
        // Auto-detect content file or use data attribute
        const contentFile = document.body.getAttribute('data-content-file') || this.autoDetectContentFile();
        
        console.log(`Using content file: ${contentFile}`);
        this.loadContent(contentFile);
    }
}

// Add CSS for loading states
const loadingStyles = `
    <style>
        .content-loading {
            opacity: 0.6;
            animation: pulse 2s infinite;
        }
        
        .content-loaded {
            opacity: 1;
            animation: fadeIn 0.5s ease-in;
        }
        
        .content-error {
            background-color: #ffebee !important;
            color: #c62828 !important;
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .content-error-notification {
            animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    </style>
`;

// Inject loading styles
document.head.insertAdjacentHTML('beforeend', loadingStyles);

// Global instance
window.contentLoader = new ContentLoader();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentLoader.init();
    });
} else {
    window.contentLoader.init();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
}