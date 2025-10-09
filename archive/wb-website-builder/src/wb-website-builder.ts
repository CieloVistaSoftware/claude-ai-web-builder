/**
 * WB Website Builder Component - TypeScript Version
 * A comprehensive website builder component that integrates all WB functionality
 */

import type { WBWebsiteBuilder as IWBWebsiteBuilder, WBWebsiteBuilderConfig } from './types.js';

// Static imports - TypeScript will validate these paths at compile time
// Import commented out for now - will be loaded dynamically
// import '../../utils/wb/wb-component-utils.js';
import './wb-data-binding.js';
// Layout manager import commented out for now - will be added when component exists
// import '../../layouts/layout-manager.js';

class WBWebsiteBuilder extends HTMLElement implements IWBWebsiteBuilder {
    public isInitialized: boolean = false;
    public components: Map<string, any> = new Map();

    constructor() {
        super();
    }

    connectedCallback(): void {
        if (!this.isInitialized) {
            this.init();
        }
    }

    async init(): Promise<void> {
        try {
            // Load required CSS
            await this.loadCSS();
            
            // Initialize the website builder HTML structure
            this.innerHTML = this.getTemplate();
            
            // Load core utilities and components (now handled by static imports)
            await this.loadCoreComponents();
            
            // Initialize website builder functionality
            await this.initializeWebsiteBuilder();
            
            this.isInitialized = true;
            this.dispatchEvent(new CustomEvent('wb-website-builder-ready'));
            
        } catch (error) {
            console.error('Failed to initialize WB Website Builder:', error);
            this.dispatchEvent(new CustomEvent('wb:error', {
                detail: { 
                    message: `Failed to initialize WB Website Builder: ${error}`,
                    source: 'wb-website-builder'
                }
            }));
        }
    }

    async loadCSS(): Promise<void> {
        const cssFiles: Array<{ name: string; path: string }> = [
            { name: 'main', path: '../../styles/main.css' },
            { name: 'layouts', path: '../../../styles/layouts.css' },
            { name: 'wb-website-builder', path: './styles/wb-website-builder.css' }
        ];

        if (window.WBComponentUtils) {
            // Use WBComponentUtils with specific paths for each file type
            window.WBComponentUtils.loadCSS('main', '/styles/main.css');
            window.WBComponentUtils.loadCSS('layouts', '/styles/layouts.css');
            window.WBComponentUtils.loadCSS('wb-website-builder', '/components/wb-website-builder/styles/wb-website-builder.css');
        } else {
            // Fallback CSS loading with proper paths
            const fallbackCssFiles: string[] = [
                '/styles/main.css',
                '/styles/layouts.css',
                '/components/wb-website-builder/styles/wb-website-builder.css'
            ];

            for (const file of fallbackCssFiles) {
                if (!document.querySelector(`link[href="${file}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = file;
                    document.head.appendChild(link);
                }
            }
        }
    }

    async loadCoreComponents(): Promise<void> {
        // Core components are now loaded via static imports at the top
        // This method is kept for backward compatibility and future dynamic loading
        console.log('✅ Core components loaded via static imports');
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.type = 'module';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    getTemplate(): string {
        return `
            <div class="wb-website-builder">
                <header class="wb-header" id="wb-header">
                    <nav class="site-nav" id="site-nav">
                        <div class="wb-nav-brand">
                            <h1>Your Amazing Website</h1>
                        </div>
                        <ul class="nav-list" id="nav-list">
                            <li><a href="#hero" class="nav-link">Home</a></li>
                            <li><a href="#features" class="nav-link">Features</a></li>
                            <li><a href="#gallery" class="nav-link">Gallery</a></li>
                            <li><a href="#about" class="nav-link">About</a></li>
                        </ul>
                    </nav>
                </header>

                <main class="main-content wb-main">
                    <section id="hero" class="wb-hero">
                        <div class="wb-hero-content">
                            <h1>Welcome to the Future</h1>
                            <p>Create stunning websites with our powerful template generator. No coding required.</p>
                            <button class="wb-cta-button">Get Started</button>
                        </div>
                    </section>

                    <section id="features" class="wb-features">
                        <div class="wb-container">
                            <h2>Features</h2>
                            <div class="wb-features-grid">
                                <div class="wb-feature-card">
                                    <div class="wb-feature-icon">🎨</div>
                                    <h3>Drag & Drop Editor</h3>
                                    <p>Intuitive visual editor for building websites</p>
                                </div>
                                <div class="wb-feature-card">
                                    <div class="wb-feature-icon">📱</div>
                                    <h3>Responsive Design</h3>
                                    <p>Mobile-first responsive layouts</p>
                                </div>
                                <div class="wb-feature-card">
                                    <div class="wb-feature-icon">🎭</div>
                                    <h3>Theme System</h3>
                                    <p>Multiple built-in themes and customization</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="gallery" class="wb-gallery">
                        <div class="wb-container">
                            <h2>Gallery</h2>
                            <div class="wb-gallery-grid">
                                <!-- Gallery items will be populated dynamically -->
                            </div>
                        </div>
                    </section>

                    <section id="about" class="wb-about">
                        <div class="wb-container">
                            <h2>About Us</h2>
                            <p>We are passionate about creating beautiful, functional websites that help businesses grow.</p>
                        </div>
                    </section>
                </main>

                <footer class="wb-footer">
                    <div class="wb-container">
                        <p>© 2025 Cielo Vista Software. All rights reserved.</p>
                        <nav class="wb-footer-nav">
                            <a href="/privacy">Privacy</a>
                            <a href="/terms">Terms</a>
                            <a href="/contact">Contact</a>
                        </nav>
                    </div>
                </footer>

                <!-- Control Panel Container -->
                <div id="wb-control-panel-container"></div>
            </div>
        `;
    }

    async initializeWebsiteBuilder(): Promise<void> {
        // Initialize control panel
        await this.initializeControlPanel();
        
        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('wb:info', {
            detail: { 
                message: 'Website Builder component initialized',
                source: 'wb-website-builder'
            }
        }));
    }

    async initializeControlPanel(): Promise<void> {
        try {
            // Load control panel script dynamically
            await this.loadScript('/components/wb-control-panel/control-panel.js');
            
            // Load control panel CSS using WBComponentUtils if available
            if (window.WBComponentUtils) {
                const cssPath = '/components/wb-control-panel/control-panel.css';
                window.WBComponentUtils.loadCSS('wb-control-panel', cssPath);
            } else {
                // Fallback CSS loading
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = '/components/wb-control-panel/control-panel.css';
                document.head.appendChild(css);
            }
            
            console.log('✅ Control panel component loaded');
        } catch (error) {
            console.error('❌ Failed to load control panel component:', error);
            this.dispatchEvent(new CustomEvent('wb:error', {
                detail: { 
                    message: `Failed to load control panel: ${error}`,
                    source: 'wb-website-builder'
                }
            }));
        }
    }

    // Utility methods for external API
    public setTheme(theme: 'light' | 'dark'): void {
        this.setAttribute('data-theme', theme);
        this.dispatchEvent(new CustomEvent('wb-theme-changed', {
            detail: { theme, source: 'wb-website-builder' }
        }));
    }

    public setLayout(layout: 'top-nav' | 'side-nav'): void {
        this.setAttribute('data-layout', layout);
        this.dispatchEvent(new CustomEvent('wb-layout-changed', {
            detail: { layout, source: 'wb-website-builder' }
        }));
    }

    public toggleEditMode(): void {
        const isEditMode = this.classList.contains('edit-mode');
        this.classList.toggle('edit-mode', !isEditMode);
        this.dispatchEvent(new CustomEvent('wb-edit-mode-toggled', {
            detail: { editMode: !isEditMode, source: 'wb-website-builder' }
        }));
    }

    public saveContent(): void {
        // Implementation for saving content
        this.dispatchEvent(new CustomEvent('wb-content-saved', {
            detail: { message: 'Content saved', source: 'wb-website-builder' }
        }));
    }

    public loadContent(): void {
        // Implementation for loading content
        this.dispatchEvent(new CustomEvent('wb:info', {
            detail: { message: 'Content loaded', source: 'wb-website-builder' }
        }));
    }

    // Observed attributes for reactive updates
    static get observedAttributes(): string[] {
        return ['data-theme', 'data-layout', 'data-edit-mode', 'data-auto-save'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue !== newValue && this.isInitialized) {
            switch (name) {
                case 'data-theme':
                    this.dispatchEvent(new CustomEvent('wb-theme-changed', {
                        detail: { theme: newValue, source: 'wb-website-builder' }
                    }));
                    break;
                case 'data-layout':
                    this.dispatchEvent(new CustomEvent('wb-layout-changed', {
                        detail: { layout: newValue, source: 'wb-website-builder' }
                    }));
                    break;
                case 'data-edit-mode':
                    this.dispatchEvent(new CustomEvent('wb-edit-mode-toggled', {
                        detail: { editMode: newValue === 'true', source: 'wb-website-builder' }
                    }));
                    break;
            }
        }
    }
}

// Register the component
customElements.define('wb-website-builder', WBWebsiteBuilder);

export default WBWebsiteBuilder;