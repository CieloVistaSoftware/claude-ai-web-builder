/**
 * WB Component Loader - TypeScript Version
 * Smart, on-demand component loading system with compile-time path validation
 * Reduces initial bundle size and improves performance
 */

import type { ComponentConfig, ComponentRegistry, ComponentPath, CSSPath } from './types.js';

// Static imports for essential components - TypeScript validates these paths
import '@components/wb-theme/wb-theme-manager.js';
import '@components/wb-keyboard-manager/wb-keyboard-manager.js';
import '@components/wb-event-log/wb-event-log.js';

class WBComponentLoader {
    private loadedComponents: Set<string> = new Set();
    private loadingComponents: Map<string, Promise<void>> = new Map();
    private componentRegistry: ComponentRegistry = {};
    private observedElements: Set<Element> = new Set();
    private observer: IntersectionObserver | null = null;

    constructor() {
        this.init();
    }

    private init(): void {
        console.log('🚀 WB Component Loader: Initializing...');
        
        // Register component definitions with type safety
        this.registerComponents();
        
        // Setup intersection observer for lazy loading
        this.setupIntersectionObserver();
        
        // Load essential components immediately
        this.loadEssentialComponents();
        
        // Observe existing elements
        this.observeExistingElements();
        
        console.log('🚀 WB Component Loader: Ready');
    }

    private registerComponents(): void {
        // Component registry with type-safe paths
        // TypeScript will validate these paths exist at compile time
        this.componentRegistry = {
            'wb-theme-manager': {
                script: '@components/wb-theme/wb-theme-manager.js',
                css: '@components/wb-theme/wb-theme-manager.css',
                priority: 'essential',
                dependencies: []
            },
            'wb-keyboard-manager': {
                script: '@components/wb-keyboard-manager/wb-keyboard-manager.js',
                css: '@components/wb-keyboard-manager/wb-keyboard-manager.css',
                priority: 'essential',
                dependencies: []
            },
            'wb-event-log': {
                script: '@components/wb-event-log/wb-event-log.js',
                css: '@components/wb-event-log/wb-event-log.css',
                priority: 'high',
                dependencies: []
            },
            'control-panel': {
                script: '@components/wb-control-panel/control-panel.js',
                css: '@components/wb-control-panel/control-panel.css',
                priority: 'essential',
                dependencies: ['wb-theme-manager']
            },
            'wb-button': {
                script: '@components/wb-button/wb-button.js',
                css: '@components/wb-button/wb-button.css',
                priority: 'lazy',
                dependencies: []
            },
            'wb-toggle': {
                script: '@components/wb-toggle/wb-toggle.js',
                css: '@components/wb-toggle/wb-toggle.css',
                priority: 'lazy',
                dependencies: []
            },
            'wb-slider': {
                script: '@components/wb-slider/wb-slider.js',
                css: '@components/wb-slider/wb-slider.css',
                priority: 'lazy',
                dependencies: []
            },
            'wb-select': {
                script: '@components/wb-select/wb-select.js',
                css: '@components/wb-select/wb-select.css',
                priority: 'lazy',
                dependencies: []
            },
            'wb-color-picker': {
                script: '@components/wb-color-picker/wb-color-picker.js',
                css: '@components/wb-color-picker/wb-color-picker.css',
                priority: 'lazy',
                dependencies: []
            },
            'wb-modal': {
                script: '@components/wb-modal/wb-modal.js',
                css: '@components/wb-modal/wb-modal.css',
                priority: 'lazy',
                dependencies: ['wb-keyboard-manager']
            }
        };
    }

    private setupIntersectionObserver(): void {
        // Observe elements entering viewport for lazy loading
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    const componentName = element.tagName.toLowerCase();
                    
                    if (this.componentRegistry[componentName]) {
                        this.loadComponent(componentName);
                        this.observer?.unobserve(element);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    private async loadEssentialComponents(): Promise<void> {
        const essentialComponents = Object.entries(this.componentRegistry)
            .filter(([_, config]) => config.priority === 'essential')
            .map(([name]) => name);

        await Promise.all(essentialComponents.map(name => this.loadComponent(name)));
    }

    private observeExistingElements(): void {
        // Observe all custom elements that match our component registry
        Object.keys(this.componentRegistry).forEach(componentName => {
            const elements = document.querySelectorAll(componentName);
            elements.forEach(element => {
                this.observedElements.add(element);
                this.observer?.observe(element);
            });
        });
    }

    public async loadComponent(componentName: string): Promise<void> {
        if (this.loadedComponents.has(componentName)) {
            return;
        }

        if (this.loadingComponents.has(componentName)) {
            return this.loadingComponents.get(componentName)!;
        }

        const config = this.componentRegistry[componentName];
        if (!config) {
            console.warn(`Component ${componentName} not found in registry`);
            return;
        }

        const loadPromise = this.loadComponentFiles(componentName, config);
        this.loadingComponents.set(componentName, loadPromise);

        try {
            await loadPromise;
            this.loadedComponents.add(componentName);
            this.loadingComponents.delete(componentName);
            
            console.log(`✅ Component loaded: ${componentName}`);
            
            // Dispatch component loaded event
            document.dispatchEvent(new CustomEvent('wb:component-loaded', {
                detail: { componentName, source: 'wb-component-loader' }
            }));
            
        } catch (error) {
            this.loadingComponents.delete(componentName);
            console.error(`❌ Failed to load component ${componentName}:`, error);
            
            // Dispatch error event
            document.dispatchEvent(new CustomEvent('wb:error', {
                detail: { 
                    message: `Failed to load component ${componentName}: ${error}`,
                    source: 'wb-component-loader'
                }
            }));
        }
    }

    private async loadComponentFiles(componentName: string, config: ComponentConfig): Promise<void> {
        // Load dependencies first
        if (config.dependencies.length > 0) {
            await Promise.all(config.dependencies.map(dep => this.loadComponent(dep)));
        }

        // Load CSS first (non-blocking)
        this.loadCSS(componentName, this.resolvePath(config.css));

        // Load JavaScript module with dynamic import and type safety
        try {
            await this.loadScript(componentName, this.resolvePath(config.script));
        } catch (error) {
            throw new Error(`Failed to load script for ${componentName}: ${error}`);
        }
    }

    private resolvePath(path: ComponentPath | CSSPath): string {
        // Convert TypeScript path aliases to actual paths
        return path
            .replace('@components/', '../')
            .replace('@utils/', '../../utils/')
            .replace('@styles/', '../../styles/')
            .replace('@layouts/', '../../layouts/');
    }

    private loadCSS(componentName: string, cssPath: string): void {
        if (window.WBComponentUtils) {
            window.WBComponentUtils.loadCSS(componentName, cssPath);
        } else {
            // Fallback CSS loading
            if (!document.querySelector(`link[href="${cssPath}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                link.setAttribute('data-component', componentName);
                document.head.appendChild(link);
            }
        }
    }

    private async loadScript(componentName: string, scriptPath: string): Promise<void> {
        try {
            // Use dynamic import for type safety and better error handling
            await import(scriptPath);
        } catch (error) {
            // Fallback to traditional script loading
            return this.loadScriptFallback(scriptPath);
        }
    }

    private loadScriptFallback(scriptPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${scriptPath}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = scriptPath;
            script.type = 'module'; // Use ES modules
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${scriptPath}`));
            document.head.appendChild(script);
        });
    }

    public getLoadedComponents(): string[] {
        return Array.from(this.loadedComponents);
    }

    public isComponentLoaded(componentName: string): boolean {
        return this.loadedComponents.has(componentName);
    }

    public getComponentConfig(componentName: string): ComponentConfig | undefined {
        return this.componentRegistry[componentName];
    }

    // Clean up method
    public destroy(): void {
        this.observer?.disconnect();
        this.loadedComponents.clear();
        this.loadingComponents.clear();
        this.observedElements.clear();
    }
}

// Create singleton instance
const componentLoader = new WBComponentLoader();

// Export for external use
export default componentLoader;
export { WBComponentLoader };