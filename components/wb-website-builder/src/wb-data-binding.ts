/**
 * Website Builder Data Binding System - TypeScript Version
 * Loads content from wb.json and dynamically populates HTML with type safety
 */

import type { WBEventDetail } from './types.js';

interface DataBindingConfig {
    dataFile: string;
    enableAutoSave: boolean;
    saveInterval: number;
    enableConsoleLogging: boolean;
}

interface WebsiteData {
    metadata: {
        title: string;
        description: string;
        keywords: string[];
    };
    header: {
        title: string;
        subtitle: string;
    };
    hero: {
        title: string;
        description: string;
        ctaButton: string;
    };
    navigation: {
        items: Array<{
            text: string;
            href: string;
        }>;
    };
    sections: {
        features: {
            title: string;
            items: Array<{
                title: string;
                description: string;
                icon: string;
            }>;
        };
        gallery: {
            title: string;
            items: any[];
        };
        about: {
            title: string;
            description: string;
        };
    };
    footer: {
        copyright: string;
        links: Array<{
            text: string;
            href: string;
        }>;
    };
}

interface DataBindingState {
    initialized: boolean;
    data: WebsiteData | null;
    originalData: WebsiteData | null;
    isDirty: boolean;
    autoSaveTimer: number | null;
}

/**
 * Data Binding Service - Manages dynamic content loading and binding
 */
class DataBindingService {
    private config: DataBindingConfig = {
        dataFile: './wb.json',
        enableAutoSave: true,
        saveInterval: 30000, // 30 seconds
        enableConsoleLogging: true
    };

    private state: DataBindingState = {
        initialized: false,
        data: null,
        originalData: null,
        isDirty: false,
        autoSaveTimer: null
    };

    /**
     * Initialize the data binding system
     */
    public async init(): Promise<void> {
        if (this.state.initialized) return;

        try {
            await this.loadData();
            this.bindAllContent();
            this.setupEventListeners();
            this.startAutoSave();

            this.state.initialized = true;
            this.log('Data Binding system initialized successfully');

            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('dataBindingReady', {
                detail: { data: this.state.data }
            }));

        } catch (error) {
            console.error('Failed to initialize Data Binding system:', error);
            this.dispatchError(`Failed to initialize Data Binding: ${error}`);
            // Fallback to existing static content
            this.initializeFallbackData();
        }
    }

    /**
     * Load data from JSON file with error handling
     */
    private async loadData(): Promise<void> {
        try {
                    const response = await fetch('/components/wb-website-builder/dist/wb.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: WebsiteData = await response.json();
            this.validateData(data);

            this.state.data = data;
            this.state.originalData = JSON.parse(JSON.stringify(data)); // Deep clone
            this.log('Data loaded successfully from ' + this.config.dataFile);

        } catch (error) {
            throw new Error(`Failed to load data: ${error}`);
        }
    }

    /**
     * Validate loaded data structure
     */
    private validateData(data: any): asserts data is WebsiteData {
        const requiredFields = ['metadata', 'header', 'hero', 'navigation', 'sections', 'footer'];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate specific structures
        if (!Array.isArray(data.navigation.items)) {
            throw new Error('navigation.items must be an array');
        }

        if (!data.sections.features || !Array.isArray(data.sections.features.items)) {
            throw new Error('sections.features.items must be an array');
        }
    }

    /**
     * Initialize fallback data when JSON loading fails
     */
    private initializeFallbackData(): void {
        this.state.data = {
            metadata: {
                title: 'Website Builder',
                description: 'Create professional websites with our builder',
                keywords: ['website', 'builder', 'template']
            },
            header: {
                title: 'Your Amazing Website',
                subtitle: 'Build something beautiful today'
            },
            hero: {
                title: 'Welcome to the Future',
                description: 'Create stunning websites with our powerful template generator.',
                ctaButton: 'Get Started'
            },
            navigation: {
                items: [
                    { text: 'Home', href: '#hero' },
                    { text: 'Features', href: '#features' },
                    { text: 'About', href: '#about' }
                ]
            },
            sections: {
                features: {
                    title: 'Features',
                    items: [
                        {
                            title: 'Easy to Use',
                            description: 'Simple drag and drop interface',
                            icon: '🎨'
                        }
                    ]
                },
                gallery: {
                    title: 'Gallery',
                    items: []
                },
                about: {
                    title: 'About Us',
                    description: 'We create amazing websites.'
                }
            },
            footer: {
                copyright: '© 2025 Website Builder. All rights reserved.',
                links: [
                    { text: 'Privacy', href: '/privacy' },
                    { text: 'Terms', href: '/terms' }
                ]
            }
        };

        this.state.originalData = JSON.parse(JSON.stringify(this.state.data));
        this.log('Fallback data initialized');
    }

    /**
     * Bind all content to DOM elements
     */
    private bindAllContent(): void {
        if (!this.state.data) return;

        const data = this.state.data;

        // Bind metadata
        this.bindText('title', data.metadata.title);
        this.bindAttribute('meta[name="description"]', 'content', data.metadata.description);

        // Bind header
        this.bindText('.wb-nav-brand h1', data.header.title);

        // Bind hero section
        this.bindText('.wb-hero h1', data.hero.title);
        this.bindText('.wb-hero p', data.hero.description);
        this.bindText('.wb-cta-button', data.hero.ctaButton);

        // Bind navigation
        this.bindNavigation(data.navigation.items);

        // Bind features
        this.bindFeatures(data.sections.features);

        // Bind about section
        this.bindText('.wb-about h2', data.sections.about.title);
        this.bindText('.wb-about p', data.sections.about.description);

        // Bind footer
        this.bindText('.wb-footer p', data.footer.copyright);
        this.bindFooterLinks(data.footer.links);

        this.log('All content bound to DOM');
    }

    /**
     * Bind text content to elements
     */
    private bindText(selector: string, content: string): void {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.textContent !== content) {
                element.textContent = content;
            }
        });
    }

    /**
     * Bind attribute values
     */
    private bindAttribute(selector: string, attribute: string, value: string): void {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.setAttribute(attribute, value);
        });
    }

    /**
     * Bind navigation items
     */
    private bindNavigation(items: Array<{ text: string; href: string }>): void {
        const navMenu = document.querySelector('.wb-nav-menu');
        if (!navMenu) return;

        navMenu.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            li.appendChild(a);
            navMenu.appendChild(li);
        });
    }

    /**
     * Bind features section
     */
    private bindFeatures(features: { title: string; items: Array<{ title: string; description: string; icon: string }> }): void {
        this.bindText('.wb-features h2', features.title);

        const featuresGrid = document.querySelector('.wb-features-grid');
        if (!featuresGrid) return;

        featuresGrid.innerHTML = '';
        features.items.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'wb-feature-card';
            card.innerHTML = `
                <div class="wb-feature-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            featuresGrid.appendChild(card);
        });
    }

    /**
     * Bind footer links
     */
    private bindFooterLinks(links: Array<{ text: string; href: string }>): void {
        const footerNav = document.querySelector('.wb-footer-nav');
        if (!footerNav) return;

        footerNav.innerHTML = '';
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            footerNav.appendChild(a);
        });
    }

    /**
     * Setup event listeners for data changes
     */
    private setupEventListeners(): void {
        // Listen for data binding events
        document.addEventListener('updateContent', this.handleContentUpdate.bind(this));
        document.addEventListener('reloadData', this.handleDataReload.bind(this));
    }

    /**
     * Handle content update events
     */
    private handleContentUpdate(event: Event): void {
        const customEvent = event as CustomEvent;
        const { selector, content, type = 'text' } = customEvent.detail;

        if (type === 'text') {
            this.bindText(selector, content);
        }

        this.markDirty();
    }

    /**
     * Handle data reload events
     */
    private async handleDataReload(): Promise<void> {
        try {
            await this.loadData();
            this.bindAllContent();
            this.log('Data reloaded successfully');
        } catch (error) {
            this.dispatchError(`Failed to reload data: ${error}`);
        }
    }

    /**
     * Mark data as dirty (modified)
     */
    private markDirty(): void {
        this.state.isDirty = true;
    }

    /**
     * Start auto-save timer
     */
    private startAutoSave(): void {
        if (!this.config.enableAutoSave) return;

        this.state.autoSaveTimer = window.setInterval(() => {
            if (this.state.isDirty) {
                this.saveData();
            }
        }, this.config.saveInterval);
    }

    /**
     * Save data to storage
     */
    private saveData(): void {
        try {
            if (this.state.data) {
                localStorage.setItem('wb-website-data', JSON.stringify(this.state.data));
                this.state.isDirty = false;
                this.log('Data auto-saved to localStorage');
            }
        } catch (error) {
            this.dispatchError(`Failed to save data: ${error}`);
        }
    }

    /**
     * Get current data
     */
    public getData(): WebsiteData | null {
        return this.state.data;
    }

    /**
     * Update specific data and rebind
     */
    public updateData(path: string, value: any): void {
        if (!this.state.data) return;

        // Simple path-based update (can be enhanced for nested paths)
        const keys = path.split('.');
        let current: any = this.state.data;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        this.bindAllContent();
        this.markDirty();
    }

    /**
     * Utility logging function
     */
    private log(message: string): void {
        if (this.config.enableConsoleLogging) {
            console.log(`📊 Data Binding: ${message}`);
        }
    }

    /**
     * Dispatch error event
     */
    private dispatchError(message: string): void {
        document.dispatchEvent(new CustomEvent('wb:error', {
            detail: { message, source: 'data-binding' } as WBEventDetail
        }));
    }

    /**
     * Cleanup method
     */
    public destroy(): void {
        if (this.state.autoSaveTimer) {
            clearInterval(this.state.autoSaveTimer);
        }
        this.state.initialized = false;
    }
}

// Create singleton instance
const dataBinding = new DataBindingService();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => dataBinding.init());
} else {
    dataBinding.init();
}

// Export for external use
export default dataBinding;
export { DataBindingService, type WebsiteData, type DataBindingConfig };