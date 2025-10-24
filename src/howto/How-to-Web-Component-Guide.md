# Web Components Development Guide

**Version**: 2.0.0  
**Last Updated**: 2025-09-13  
**Owner**: Frontend Architecture Team  
**Review Date**: 2025-10-13

## Purpose

This guide provides comprehensive instructions for creating, testing, and deploying web components following Cielo Vista Software standards. Includes templates, examples, and best practices for building production-ready components.

## Quick Reference

### Component Creation Checklist
- [ ] Use the [Component Template](#component-template)
- [ ] Implement proper lifecycle methods
- [ ] Add accessibility features (ARIA, keyboard navigation)
- [ ] Include comprehensive error handling
- [ ] Write unit and integration tests
- [ ] Document API with JSDoc
- [ ] Add performance monitoring
- [ ] Implement security measures

### Essential Methods
```javascript
class MyComponent extends HTMLElement {
    constructor() { /* Setup */ }
    connectedCallback() { /* Mount */ }
    disconnectedCallback() { /* Cleanup */ }
    attributeChangedCallback() { /* React to changes */ }
    static get observedAttributes() { /* Watched attributes */ }
}
```

## Component Architecture

### Base Component Structure

```javascript
/**
 * @fileoverview BaseComponent - Foundation class for all web components
 * @version 2.0.0
 */

export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        
        // Component state
        this.state = new Map();
        this.listeners = new Map();
        this.isInitialized = false;
        
        // Performance monitoring
        this.performanceMarks = new Map();
        
        // Shadow DOM setup (if needed)
        if (this.constructor.useShadowDOM) {
            this.attachShadow({ mode: 'open' });
        }
        
        // Bind methods
        this.boundHandlers = new Map();
        
        // Initialize component
        this.initialize();
    }
    
    /**
     * Initialize component - override in subclasses
     */
    initialize() {
        this.markPerformance('initialize-start');
        
        try {
            this.setupDefaults();
            this.createElements();
            this.bindEvents();
            this.isInitialized = true;
            
            this.markPerformance('initialize-end');
            this.measurePerformance('initialization', 'initialize-start', 'initialize-end');
        } catch (error) {
            this.handleError('initialization', error);
        }
    }
    
    /**
     * Component connected to DOM
     */
    connectedCallback() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.markPerformance('mount-start');
        
        try {
            this.render();
            this.setupAccessibility();
            this.dispatchEvent(new CustomEvent('component:mounted'));
            
            this.markPerformance('mount-end');
            this.measurePerformance('mount', 'mount-start', 'mount-end');
        } catch (error) {
            this.handleError('mount', error);
        }
    }
    
    /**
     * Component disconnected from DOM
     */
    disconnectedCallback() {
        try {
            this.cleanup();
            this.dispatchEvent(new CustomEvent('component:unmounted'));
        } catch (error) {
            this.handleError('cleanup', error);
        }
    }
    
    /**
     * Attribute changed
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        try {
            this.handleAttributeChange(name, oldValue, newValue);
            this.dispatchEvent(new CustomEvent('attribute:changed', {
                detail: { name, oldValue, newValue }
            }));
        } catch (error) {
            this.handleError('attribute-change', error);
        }
    }
    
    /**
     * Define observed attributes - override in subclasses
     */
    static get observedAttributes() {
        return [];
    }
    
    /**
     * Whether to use Shadow DOM - override in subclasses
     */
    static get useShadowDOM() {
        return false;
    }
    
    // Abstract methods - implement in subclasses
    setupDefaults() { /* Override */ }
    createElements() { /* Override */ }
    render() { /* Override */ }
    handleAttributeChange(name, oldValue, newValue) { /* Override */ }
    
    /**
     * State management
     */
    setState(updates) {
        const prevState = new Map(this.state);
        
        Object.entries(updates).forEach(([key, value]) => {
            this.state.set(key, value);
        });
        
        this.onStateChange(prevState, this.state);
    }
    
    getState(key) {
        return key ? this.state.get(key) : Object.fromEntries(this.state);
    }
    
    onStateChange(prevState, newState) {
        this.render();
    }
    
    /**
     * Event management
     */
    bindEvents() {
        // Override in subclasses
    }
    
    addEventListener(type, handler, options = {}) {
        const boundHandler = handler.bind(this);
        this.boundHandlers.set(handler, boundHandler);
        super.addEventListener(type, boundHandler, options);
    }
    
    removeEventListener(type, handler, options = {}) {
        const boundHandler = this.boundHandlers.get(handler);
        if (boundHandler) {
            super.removeEventListener(type, boundHandler, options);
            this.boundHandlers.delete(handler);
        }
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        // Clear timers
        this.listeners.forEach((timer) => {
            if (typeof timer === 'number') {
                clearTimeout(timer);
                clearInterval(timer);
            }
        });
        
        // Remove event listeners
        this.boundHandlers.clear();
        
        // Clear state
        this.state.clear();
    }
    
    /**
     * Performance monitoring
     */
    markPerformance(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(`${this.constructor.name}-${name}`);
        }
    }
    
    measurePerformance(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            try {
                const measureName = `${this.constructor.name}-${name}`;
                performance.measure(
                    measureName,
                    `${this.constructor.name}-${startMark}`,
                    `${this.constructor.name}-${endMark}`
                );
                
                const measure = performance.getEntriesByName(measureName)[0];
                if (measure) {
                    console.debug(`${this.constructor.name} ${name}: ${measure.duration.toFixed(2)}ms`);
                }
            } catch (error) {
                console.warn('Performance measurement failed:', error);
            }
        }
    }
    
    /**
     * Accessibility setup
     */
    setupAccessibility() {
        // Set role if not present
        if (!this.getAttribute('role')) {
            this.setAttribute('role', this.constructor.defaultRole || 'region');
        }
        
        // Ensure focusable if interactive
        if (this.constructor.isInteractive && !this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
    }
    
    static get defaultRole() {
        return 'region';
    }
    
    static get isInteractive() {
        return false;
    }
    
    /**
     * Error handling
     */
    handleError(context, error) {
        console.error(`Error in ${this.constructor.name} (${context}):`, error);
        
        this.dispatchEvent(new CustomEvent('component:error', {
            detail: { context, error, timestamp: new Date() },
            bubbles: true
        }));
        
        // Attempt graceful degradation
        this.setAttribute('data-error', 'true');
    }
}
```

## Component Template

### File Structure for New Component
```
src/components/my-component/
├── my-component.js           # Main component class
├── my-component.css         # Component styles
├── my-component.test.js     # Unit tests
├── my-component.stories.js  # Storybook stories (if used)
├── README.md               # Component documentation
└── examples/               # Usage examples
    ├── basic-usage.html
    ├── advanced-usage.html
    └── integration-example.js
```

### Component Template
```javascript
/**
 * @fileoverview MyComponent - [Brief description of component purpose]
 * @author Your Name
 * @version 1.0.0
 * @since 1.0.0
 */

import { BaseComponent } from '../base/base-component.js';

/**
 * Custom element for [component purpose]
 * 
 * @class MyComponent
 * @extends BaseComponent
 * 
 * @example
 * // Basic usage
 * const component = document.createElement('my-component');
 * component.setAttribute('data', 'example');
 * document.body.appendChild(component);
 * 
 * @example
 * // With configuration
 * <my-component 
 *   data="example"
 *   theme="dark"
 *   max-items="100">
 * </my-component>
 * 
 * @fires MyComponent#my-component:changed
 * @fires MyComponent#my-component:error
 */
export class MyComponent extends BaseComponent {
    constructor() {
        super();
        
        // Component-specific initialization
        this.data = [];
        this.maxItems = 100;
        this.theme = 'light';
    }
    
    /**
     * Define which attributes to observe
     */
    static get observedAttributes() {
        return ['data', 'theme', 'max-items'];
    }
    
    /**
     * Component uses Shadow DOM
     */
    static get useShadowDOM() {
        return true; // Change to false if Shadow DOM not needed
    }
    
    /**
     * Component is interactive
     */
    static get isInteractive() {
        return true;
    }
    
    /**
     * Default ARIA role
     */
    static get defaultRole() {
        return 'application'; // Adjust based on component purpose
    }
    
    /**
     * Setup default values
     */
    setupDefaults() {
        this.setState({
            data: [],
            theme: this.getAttribute('theme') || 'light',
            maxItems: parseInt(this.getAttribute('max-items')) || 100,
            isLoading: false,
            error: null
        });
    }
    
    /**
     * Create DOM elements
     */
    createElements() {
        const root = this.shadowRoot || this;
        
        root.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="my-component" role="main">
                <div class="header">
                    <h2 class="title">My Component</h2>
                    <div class="controls">
                        <button class="btn-refresh" aria-label="Refresh data">
                            Refresh
                        </button>
                    </div>
                </div>
                
                <div class="content">
                    <div class="loading" hidden>
                        <span aria-live="polite">Loading...</span>
                    </div>
                    
                    <div class="error" hidden role="alert">
                        <span class="error-message"></span>
                    </div>
                    
                    <div class="data-container">
                        <!-- Dynamic content goes here -->
                    </div>
                </div>
                
                <div class="footer">
                    <span class="item-count">0 items</span>
                </div>
            </div>
        `;
        
        // Cache frequently used elements
        this.elements = {
            container: root.querySelector('.my-component'),
            title: root.querySelector('.title'),
            refreshBtn: root.querySelector('.btn-refresh'),
            loading: root.querySelector('.loading'),
            error: root.querySelector('.error'),
            errorMessage: root.querySelector('.error-message'),
            dataContainer: root.querySelector('.data-container'),
            itemCount: root.querySelector('.item-count')
        };
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.elements.refreshBtn) return;
        
        this.elements.refreshBtn.addEventListener('click', this.handleRefresh);
        this.addEventListener('keydown', this.handleKeyDown);
    }
    
    /**
     * Render component
     */
    render() {
        if (!this.elements) return;
        
        const state = this.getState();
        
        // Update theme
        this.elements.container.className = `my-component theme-${state.theme}`;
        
        // Update loading state
        this.elements.loading.hidden = !state.isLoading;
        
        // Update error state
        if (state.error) {
            this.elements.error.hidden = false;
            this.elements.errorMessage.textContent = state.error.message;
        } else {
            this.elements.error.hidden = true;
        }
        
        // Render data
        this.renderData();
        
        // Update item count
        this.elements.itemCount.textContent = `${state.data.length} items`;
    }
    
    /**
     * Render data items
     */
    renderData() {
        const data = this.getState('data');
        const container = this.elements.dataContainer;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="empty-state">No data available</p>';
            return;
        }
        
        const html = data.map((item, index) => `
            <div class="data-item" data-index="${index}" role="listitem">
                <span class="item-content">${this.escapeHTML(item.toString())}</span>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="data-list" role="list" aria-label="Data items">
                ${html}
            </div>
        `;
    }
    
    /**
     * Handle attribute changes
     */
    handleAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'data':
                this.loadData(newValue);
                break;
                
            case 'theme':
                this.setState({ theme: newValue || 'light' });
                break;
                
            case 'max-items':
                this.setState({ maxItems: parseInt(newValue) || 100 });
                break;
        }
    }
    
    /**
     * Event handlers
     */
    handleRefresh = async () => {
        try {
            await this.refresh();
        } catch (error) {
            this.handleError('refresh', error);
        }
    }
    
    handleKeyDown = (event) => {
        if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            this.handleRefresh();
        }
    }
    
    /**
     * Public API methods
     */
    
    /**
     * Load data from source
     * @param {string|Array} source - Data source
     * @returns {Promise<void>}
     */
    async loadData(source) {
        this.setState({ isLoading: true, error: null });
        
        try {
            let data = [];
            
            if (typeof source === 'string') {
                // Load from URL or parse JSON
                if (source.startsWith('http')) {
                    const response = await fetch(source);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    data = await response.json();
                } else {
                    data = JSON.parse(source);
                }
            } else if (Array.isArray(source)) {
                data = source;
            }
            
            // Validate and limit data
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            
            const maxItems = this.getState('maxItems');
            if (data.length > maxItems) {
                data = data.slice(0, maxItems);
                console.warn(`Data truncated to ${maxItems} items`);
            }
            
            this.setState({ data, isLoading: false });
            
            this.dispatchEvent(new CustomEvent('my-component:data-loaded', {
                detail: { data, count: data.length }
            }));
            
        } catch (error) {
            this.setState({ isLoading: false, error });
            throw error;
        }
    }
    
    /**
     * Refresh current data
     * @returns {Promise<void>}
     */
    async refresh() {
        const currentSource = this.getAttribute('data');
        if (currentSource) {
            await this.loadData(currentSource);
        }
    }
    
    /**
     * Add item to data
     * @param {*} item - Item to add
     */
    addItem(item) {
        const data = [...this.getState('data'), item];
        const maxItems = this.getState('maxItems');
        
        if (data.length > maxItems) {
            data.shift(); // Remove oldest item
        }
        
        this.setState({ data });
        
        this.dispatchEvent(new CustomEvent('my-component:item-added', {
            detail: { item, count: data.length }
        }));
    }
    
    /**
     * Clear all data
     */
    clear() {
        this.setState({ data: [] });
        
        this.dispatchEvent(new CustomEvent('my-component:cleared'));
    }
    
    /**
     * Get component styles
     * @returns {string} CSS styles
     */
    getStyles() {
        return `
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.4;
                color: var(--my-component-text, #333);
                background: var(--my-component-bg, #fff);
                border: 1px solid var(--my-component-border, #e1e1e1);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .my-component {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: var(--my-component-header-bg, #f8f9fa);
                border-bottom: 1px solid var(--my-component-border, #e1e1e1);
            }
            
            .title {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .btn-refresh {
                padding: 8px 16px;
                background: var(--my-component-primary, #007bff);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .btn-refresh:hover {
                background: var(--my-component-primary-hover, #0056b3);
            }
            
            .btn-refresh:focus {
                outline: 2px solid var(--my-component-focus, #80bdff);
                outline-offset: 2px;
            }
            
            .content {
                flex: 1;
                position: relative;
                overflow: hidden;
            }
            
            .loading, .error {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                padding: 20px;
            }
            
            .error {
                color: var(--my-component-error, #dc3545);
                background: var(--my-component-error-bg, #f8d7da);
                border: 1px solid var(--my-component-error-border, #f5c6cb);
                border-radius: 4px;
            }
            
            .data-container {
                height: 100%;
                overflow-y: auto;
                padding: 16px;
            }
            
            .empty-state {
                text-align: center;
                color: var(--my-component-muted, #6c757d);
                font-style: italic;
                margin: 40px 0;
            }
            
            .data-item {
                padding: 12px;
                border-bottom: 1px solid var(--my-component-border, #e1e1e1);
                transition: background-color 0.2s ease;
            }
            
            .data-item:hover {
                background: var(--my-component-hover, #f8f9fa);
            }
            
            .footer {
                padding: 12px 16px;
                background: var(--my-component-footer-bg, #f8f9fa);
                border-top: 1px solid var(--my-component-border, #e1e1e1);
                font-size: 12px;
                color: var(--my-component-muted, #6c757d);
            }
            
            /* Dark theme */
            .theme-dark {
                --my-component-text: #fff;
                --my-component-bg: #1a1a1a;
                --my-component-border: #333;
                --my-component-header-bg: #2d2d2d;
                --my-component-footer-bg: #2d2d2d;
                --my-component-hover: #333;
                --my-component-muted: #aaa;
            }
            
            /* Responsive design */
            @media (max-width: 640px) {
                .header {
                    flex-direction: column;
                    gap: 12px;
                }
                
                .data-container {
                    padding: 12px;
                }
            }
            
            /* High contrast support */
            @media (prefers-contrast: high) {
                :host {
                    --my-component-border: #000;
                }
                
                .btn-refresh:focus {
                    outline: 3px solid currentColor;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .data-item {
                    transition: none;
                }
            }
        `;
    }
    
    /**
     * Utility method to escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Register the custom element
customElements.define('my-component', MyComponent);

// Export for testing
export default MyComponent;
```

## Testing Template

### Unit Test Template
```javascript
// my-component.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MyComponent } from './my-component.js';

describe('MyComponent', () => {
    let component;
    let container;
    
    beforeEach(() => {
        // Setup DOM container
        container = document.createElement('div');
        document.body.appendChild(container);
        
        // Create component
        component = new MyComponent();
        container.appendChild(component);
        
        // Wait for component to initialize
        return new Promise(resolve => {
            if (component.isInitialized) {
                resolve();
            } else {
                component.addEventListener('component:mounted', resolve, { once: true });
            }
        });
    });
    
    afterEach(() => {
        // Cleanup
        if (container) {
            document.body.removeChild(container);
        }
        vi.clearAllMocks();
    });
    
    describe('Initialization', () => {
        it('should create component with default values', () => {
            expect(component).toBeInstanceOf(MyComponent);
            expect(component.isInitialized).toBe(true);
            expect(component.getState('theme')).toBe('light');
            expect(component.getState('maxItems')).toBe(100);
        });
        
        it('should initialize with attributes', () => {
            const componentWithAttrs = new MyComponent();
            componentWithAttrs.setAttribute('theme', 'dark');
            componentWithAttrs.setAttribute('max-items', '50');
            
            container.appendChild(componentWithAttrs);
            
            expect(componentWithAttrs.getState('theme')).toBe('dark');
            expect(componentWithAttrs.getState('maxItems')).toBe(50);
        });
    });
    
    describe('Data Management', () => {
        it('should load data from array', async () => {
            const testData = ['item1', 'item2', 'item3'];
            
            await component.loadData(testData);
            
            expect(component.getState('data')).toEqual(testData);
            expect(component.getState('isLoading')).toBe(false);
        });
        
        it('should handle data loading errors', async () => {
            const invalidData = 'not an array';
            
            await expect(component.loadData(invalidData))
                .rejects.toThrow('Data must be an array');
            
            expect(component.getState('error')).toBeTruthy();
            expect(component.getState('isLoading')).toBe(false);
        });
        
        it('should limit data to maxItems', async () => {
            component.setState({ maxItems: 2 });
            const testData = ['item1', 'item2', 'item3', 'item4'];
            
            await component.loadData(testData);
            
            expect(component.getState('data')).toHaveLength(2);
            expect(component.getState('data')).toEqual(['item1', 'item2']);
        });
        
        it('should add items correctly', () => {
            const newItem = 'new item';
            
            component.addItem(newItem);
            
            expect(component.getState('data')).toContain(newItem);
        });
        
        it('should clear data', () => {
            component.setState({ data: ['item1', 'item2'] });
            
            component.clear();
            
            expect(component.getState('data')).toHaveLength(0);
        });
    });
    
    describe('Events', () => {
        it('should dispatch data-loaded event', async () => {
            const eventSpy = vi.fn();
            component.addEventListener('my-component:data-loaded', eventSpy);
            
            const testData = ['item1', 'item2'];
            await component.loadData(testData);
            
            expect(eventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { data: testData, count: 2 }
                })
            );
        });
        
        it('should dispatch item-added event', () => {
            const eventSpy = vi.fn();
            component.addEventListener('my-component:item-added', eventSpy);
            
            const newItem = 'test item';
            component.addItem(newItem);
            
            expect(eventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { item: newItem, count: 1 }
                })
            );
        });
        
        it('should dispatch cleared event', () => {
            const eventSpy = vi.fn();
            component.addEventListener('my-component:cleared', eventSpy);
            
            component.clear();
            
            expect(eventSpy).toHaveBeenCalled();
        });
    });
    
    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            const container = component.shadowRoot.querySelector('.my-component');
            expect(container.getAttribute('role')).toBe('main');
            
            const dataList = component.shadowRoot.querySelector('.data-list');
            if (dataList) {
                expect(dataList.getAttribute('role')).toBe('list');
                expect(dataList.getAttribute('aria-label')).toBe('Data items');
            }
        });
        
        it('should handle keyboard navigation', () => {
            const refreshSpy = vi.spyOn(component, 'handleRefresh');
            
            const event = new KeyboardEvent('keydown', {
                key: 'r',
                ctrlKey: true
            });
            
            component.dispatchEvent(event);
            
            expect(refreshSpy).toHaveBeenCalled();
        });
    });
    
    describe('Performance', () => {
        it('should initialize within performance budget', () => {
            const marks = performance.getEntriesByType('mark')
                .filter(mark => mark.name.includes('MyComponent-initialize'));
            
            expect(marks.length).toBeGreaterThan(0);
        });
        
        it('should handle large datasets efficiently', async () => {
            const largeData = Array.from({ length: 1000 }, (_, i) => `item-${i}`);
            
            const startTime = performance.now();
            await component.loadData(largeData);
            const endTime = performance.now();
            
            expect(endTime - startTime).toBeLessThan(100); // 100ms budget
        });
    });
});
```

## Integration Examples

### Chat Application Integration
```javascript
// chat-integration.js
import { TraceElement } from '../trace/trace-element.js';
import { MyComponent } from './my-component.js';

class ChatApplication {
    constructor() {
        this.setupComponents();
        this.setupEventListeners();
    }
    
    setupComponents() {
        // Create trace element for debugging
        this.trace = document.createElement('trace-element');
        this.trace.setAttribute('max-entries', '1000');
        this.trace.setAttribute('trace-level', 'debug');
        
        // Create custom component
        this.dataDisplay = document.createElement('my-component');
        this.dataDisplay.setAttribute('theme', 'dark');
        this.dataDisplay.setAttribute('max-items', '50');
        
        // Add to DOM
        document.body.appendChild(this.trace);
        document.body.appendChild(this.dataDisplay);
    }
    
    setupEventListeners() {
        // Monitor component events
        this.dataDisplay.addEventListener('my-component:data-loaded', (event) => {
            this.trace.addEntry({
                level: 'info',
                direction: 'ui',
                message: 'Data loaded in component',
                data: {
                    count: event.detail.count,
                    timestamp: new Date()
                }
            });
        });
        
        // Monitor errors
        this.dataDisplay.addEventListener('component:error', (event) => {
            this.trace.addEntry({
                level: 'error',
                direction: 'ui',
                message: 'Component error occurred',
                data: {
                    context: event.detail.context,
                    error: event.detail.error.message
                }
            });
        });
    }
    
    async loadChatData() {
        try {
            this.trace.addEntry({
                level: 'info',
                direction: 'outgoing',
                message: 'Fetching chat data'
            });
            
            const response = await fetch('/api/chat/messages');
            const data = await response.json();
            
            this.trace.addEntry({
                level: 'info',
                direction: 'incoming',
                message: 'Chat data received',
                data: { count: data.length }
            });
            
            await this.dataDisplay.loadData(data);
            
        } catch (error) {
            this.trace.addEntry({
                level: 'error',
                direction: 'incoming',
                message: 'Failed to load chat data',
                data: { error: error.message }
            });
        }
    }
}

// Initialize application
const app = new ChatApplication();
app.loadChatData();
```

### Performance Monitoring Setup
```javascript
// performance-monitor.js
export class ComponentPerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.thresholds = {
            initialization: 100, // 100ms
            render: 16,          // 16ms (60fps)
            dataLoad: 200        // 200ms
        };
        
        this.setupObserver();
    }
    
    setupObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.processPerformanceEntry(entry);
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
    
    processPerformanceEntry(entry) {
        const [componentName, operation] = entry.name.split('-');
        
        // Record metric
        if (!this.metrics.has(componentName)) {
            this.metrics.set(componentName, new Map());
        }
        
        const componentMetrics = this.metrics.get(componentName);
        if (!componentMetrics.has(operation)) {
            componentMetrics.set(operation, []);
        }
        
        componentMetrics.get(operation).push({
            duration: entry.duration,
            timestamp: entry.startTime
        });
        
        // Check threshold
        const threshold = this.thresholds[operation];
        if (threshold && entry.duration > threshold) {
            console.warn(
                `Performance threshold exceeded: ${componentName} ${operation}`,
                `${entry.duration.toFixed(2)}ms > ${threshold}ms`
            );
            
            // Dispatch warning event
            window.dispatchEvent(new CustomEvent('performance:threshold-exceeded', {
                detail: {
                    component: componentName,
                    operation,
                    duration: entry.duration,
                    threshold
                }
            }));
        }
    }
    
    getMetrics(componentName, operation) {
        const componentMetrics = this.metrics.get(componentName);
        if (!componentMetrics) return [];
        
        return operation ? 
            componentMetrics.get(operation) || [] :
            Object.fromEntries(componentMetrics);
    }
    
    getAverageMetric(componentName, operation) {
        const metrics = this.getMetrics(componentName, operation);
        if (!metrics.length) return 0;
        
        const sum = metrics.reduce((acc, metric) => acc + metric.duration, 0);
        return sum / metrics.length;
    }
}

// Global monitor instance
export const performanceMonitor = new ComponentPerformanceMonitor();
```

## Deployment Checklist

### Pre-deployment Checklist
```markdown
## Component Deployment Checklist

### Code Quality
- [ ] All unit tests pass (>95% coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Linting passes with no errors
- [ ] Code formatted with Prettier
- [ ] JSDoc documentation complete

### Performance
- [ ] Component initializes within 100ms
- [ ] Render operations complete within 16ms
- [ ] Memory usage stays below budgets
- [ ] Virtual scrolling implemented for large datasets
- [ ] Performance monitoring enabled

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader tested
- [ ] Keyboard navigation works
- [ ] High contrast mode supported
- [ ] Focus indicators visible
- [ ] ARIA attributes properly set

### Security
- [ ] Input sanitization implemented
- [ ] XSS protection in place
- [ ] CSP compatible
- [ ] No sensitive data in logs
- [ ] Error handling doesn't leak information

### Browser Support
- [ ] Chrome 90+ tested
- [ ] Firefox 88+ tested
- [ ] Safari 14+ tested
- [ ] Edge 90+ tested
- [ ] Mobile browsers tested

### Documentation
- [ ] Component API documented
- [ ] Usage examples provided
- [ ] Integration guide written
- [ ] Migration guide (if needed)
- [ ] Troubleshooting section complete
```

## Related Documents

- [Trace Element Specification](./trace-element-spec.md)
- [JavaScript Standards](../code-quality/javascript-standards.md)
- [Testing Requirements](../code-quality/testing-requirements.md)
- [Performance Standards](../performance/performance-standards.md)
- [Accessibility Requirements](../accessibility/accessibility-requirements.md)

## Changelog

- **v2.0.0** (2025-09-13): Complete rewrite with BaseComponent class, comprehensive template
- **v1.1.0** (2025-08-01): Added performance monitoring and accessibility features
- **v1.0.0** (2025-07-01): Initial web components guide
