// Component Factory - Data-Driven Component Generator
// Creates components from JSON definitions

(function() {
    'use strict';
    
    // console.log('🏭 Component Factory: Initializing...');
    
    // Component Factory namespace
    window.ComponentFactory = {
        // Registry of component definitions
        registry: new Map(),
        
        // Registry of component instances
        instances: new Map(),
        
        // Register a component definition
        register: function(definition) {
            // console.log('ComponentFactory.register called with:', definition);
            if (!definition) {
                throw new Error('register: definition is undefined');
            }
            if (definition.name) {
                // Flat definition (single object)
                this.registry.set(definition.name, definition);
                // console.log(`🏭 Registered component: ${definition.name}`);
            } else if (definition.component && definition.component.name) {
                // Nested definition (legacy)
                this.registry.set(definition.component.name, definition);
                // console.log(`🏭 Registered component: ${definition.component.name}`);
            } else {
                throw new Error('register: definition missing name property');
            }
            return this;
        },
        
        // Create component from definition
        create: async function(componentName, options = {}) {
            const definition = this.registry.get(componentName);
            if (!definition) {
                console.error(`Component definition not found: ${componentName}`);
                return null;
            }
            
            // Create component instance
            const component = new DataDrivenComponent(definition, options);
            await component.initialize();
            
            // Store instance
            this.instances.set(component.id, component);
            
            return component;
        },
        
        // Load component definition from JSON file
        loadDefinition: async function(path) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    console.warn(`Component definition not found: ${path} (${response.status})`);
                    return null;
                }
                const definition = await response.json();
                this.register(definition);
                return definition;
            } catch (error) {
                console.error(`Failed to load component definition: ${path}`, error);
                return null;
            }
        },
        
        // Generate component HTML
        generateHTML: function(definition, data = {}) {
            const template = definition.template || {};
            const structure = template.structure || [];
            
            return this.buildHTML(structure, data, definition);
        },
        
        // Recursively build HTML from structure
        buildHTML: function(structure, data, definition) {
            return structure.map(element => {
                if (typeof element === 'string') {
                    return this.interpolate(element, data);
                }

                // Support both 'repeat' and 'for' for array rendering
                const { tag, attributes = {}, content, children = [], condition, repeat, for: forKey } = element;

                // Handle conditional rendering
                if (condition && !this.evaluateCondition(condition, data)) {
                    return '';
                }

                // Handle 'repeat' (preferred)
                if (repeat) {
                    const collection = this.getNestedValue(data, repeat.collection);
                    if (collection && Array.isArray(collection)) {
                        return collection.map((item, index) => {
                            const itemData = { ...data, [repeat.item]: item, [`${repeat.item}Index`]: index };
                            return this.createElement(tag, attributes, content, children, itemData, definition);
                        }).join('');
                    }
                }

                // Handle 'for' (legacy, e.g., for: 'actions')
                if (forKey) {
                    const collection = this.getNestedValue(data, forKey);
                    if (collection && Array.isArray(collection)) {
                        return collection.map((item, index) => {
                            // Merge item into data context for this element
                            const itemData = { ...data, ...item, [`${forKey}Index`]: index };
                            return this.createElement(tag, attributes, content, children, itemData, definition);
                        }).join('');
                    }
                }

                return this.createElement(tag, attributes, content, children, data, definition);
            }).join('');
        },
        
        // Create single HTML element
        createElement: function(tag, attributes, content, children, data, definition) {
            // Special case: skip <img> if src is empty or still contains {{image}}
            if (tag === 'img') {
                let src = attributes.src || '';
                // Interpolate src
                if (src.includes('{{')) {
                    src = this.interpolate(src, data);
                }
                if (!src || src.includes('{{image}}')) {
                    return '';
                }
            }
            const attrs = this.buildAttributes(attributes, data, definition);
            const innerContent = content ? this.interpolate(content, data) : '';
            const childrenHTML = children.length ? this.buildHTML(children, data, definition) : '';
            return `<${tag}${attrs}>${innerContent}${childrenHTML}</${tag}>`;
        },
        
        // Build attributes string
        buildAttributes: function(attributes, data, definition) {
            return Object.entries(attributes).map(([key, value]) => {
                if (typeof value === 'object' && value.bind) {
                    // Handle data binding
                    const boundValue = this.resolveBinding(value.bind, data, definition);
                    return boundValue ? ` ${key}="${boundValue}"` : '';
                }
                const interpolated = this.interpolate(value, data);
                return interpolated ? ` ${key}="${interpolated}"` : '';
            }).join('');
        },
        
        // Interpolate data into strings
        interpolate: function(template, data) {
            if (typeof template !== 'string') return template;
            
            return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
                const value = this.getNestedValue(data, path.trim());
                if (value === undefined) return match;
                
                // If value is an object/array, JSON stringify it for attributes
                if (typeof value === 'object' && value !== null) {
                    // Escape quotes for HTML attributes
                    return JSON.stringify(value).replace(/"/g, '&quot;');
                }
                
                return value;
            });
        },
        
        // Get nested value from object path (e.g., "control.component")
        getNestedValue: function(obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : undefined;
            }, obj);
        },
        
        // Evaluate conditions
        evaluateCondition: function(condition, data) {
            const { field, operator, value } = condition;
            const fieldValue = data[field];
            
            switch (operator) {
                case 'equals': return fieldValue === value;
                case 'notEquals': return fieldValue !== value;
                case 'exists': return fieldValue !== undefined;
                case 'notExists': return fieldValue === undefined;
                case 'truthy': return !!fieldValue;
                case 'falsy': return !fieldValue;
                default: return true;
            }
        },
        
        // Resolve data bindings
        resolveBinding: function(binding, data, definition) {
            if (binding.cssVariable && definition.configuration?.cssVariables) {
                return `var(${definition.configuration.cssVariables[binding.cssVariable]})`;
            }
            if (binding.data) {
                return data[binding.data];
            }
            if (binding.config) {
                return definition.configuration?.[binding.config];
            }
            return '';
        },
        
        // Generate CSS from definition
        generateCSS: function(definition, componentId) {
            const styles = definition.styles || {};
            const { base = {}, variants = {}, states = {}, responsive = {} } = styles;
            
            let css = '';
            
            // Base styles
            if (Object.keys(base).length) {
                css += `#${componentId} {\n${this.buildCSSRules(base)}\n}\n`;
            }
            
            // Variant styles
            Object.entries(variants).forEach(([variant, rules]) => {
                css += `#${componentId}.${variant} {\n${this.buildCSSRules(rules)}\n}\n`;
            });
            
            // State styles
            Object.entries(states).forEach(([state, rules]) => {
                css += `#${componentId}[data-state="${state}"] {\n${this.buildCSSRules(rules)}\n}\n`;
            });
            
            // Responsive styles
            Object.entries(responsive).forEach(([breakpoint, rules]) => {
                css += `@media ${breakpoint} {\n#${componentId} {\n${this.buildCSSRules(rules)}\n}\n}\n`;
            });
            
            return css;
        },
        
        // Build CSS rules
        buildCSSRules: function(rules) {
            return Object.entries(rules).map(([property, value]) => {
                const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `  ${cssProperty}: ${value};`;
            }).join('\n');
        }
    };
    
    // Data-Driven Component Class
    class DataDrivenComponent {
        constructor(definition, options = {}) {
            this.definition = definition;
            this.options = options;
            this.id = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.data = { ...definition.defaults?.data, ...options.data };
            this.state = definition.defaults?.state || 'default';
            this.element = null;
            this.eventListeners = new Map();
        }
        
        async initialize() {
            // Load dependencies
            if (this.definition.component && this.definition.component.dependencies) {
                // console.log('Loading dependencies:', this.definition.component.dependencies);
                await this.loadDependencies();
            } else {
                // console.log('No dependencies to load for', this.definition.name || this.definition);
            }
            
            // Create component element
            this.createElement();
            
            // Apply styles
            this.applyStyles();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Dispatch ready event
            this.dispatchEvent('ready');
        }
        
        async loadDependencies() {
            const deps = this.definition.component.dependencies;
            for (const dep of deps) {
                // Check if dependency is already loaded
                if (!ComponentFactory.registry.has(dep)) {
                    let loaded = false;
                    
                    // Try different file name patterns and paths
                    const pathsToTry = [
                        `../${dep}/${dep}.json`,                    // Standard relative
                        `../${dep}/${dep}-data-driven.json`,       // Data-driven relative
                        window.WBComponentUtils?.resolve(`wb.${dep}.config`) || `/components/${dep}/${dep}.json`,          // Symbol or absolute standard
                        window.WBComponentUtils?.resolve(`wb.${dep}.data-config`) || `/components/${dep}/${dep}-data-driven.json` // Symbol or absolute data-driven
                    ];
                    
                    for (const path of pathsToTry) {
                        if (!loaded) {
                            const result = await ComponentFactory.loadDefinition(path);
                            if (result) {
                                loaded = true;
                                console.log(`✅ Loaded dependency: ${dep} from ${path}`);
                                break;
                            }
                        }
                    }
                    
                    if (!loaded) {
                        console.warn(`❌ Failed to load dependency: ${dep}`);
                    }
                }
            }
        }
        
        createElement() {
            const html = ComponentFactory.generateHTML(this.definition, this.data);
            let componentName;
            if (this.definition.component && this.definition.component.name) {
                componentName = this.definition.component.name;
            } else if (this.definition.name) {
                componentName = this.definition.name;
            } else {
                console.error('createElement: No component name found in definition', this.definition);
                throw new Error('createElement: No component name found in definition');
            }
            // console.log('createElement using componentName:', componentName);

            // Check if this is a custom element that should be created directly
            if (customElements.get(componentName)) {
                // Create the custom element directly
                this.element = document.createElement(componentName);

                // Parse the generated HTML to extract content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const content = tempDiv.firstElementChild;

                if (content) {
                    // Copy attributes from generated content to custom element
                    Array.from(content.attributes).forEach(attr => {
                        this.element.setAttribute(attr.name, attr.value);
                    });
                    // Copy inner content to custom element
                    this.element.innerHTML = content.innerHTML;
                } else {
                    // If no wrapper element, use HTML directly
                    this.element.innerHTML = html;
                }
            } else {
                // Standard element creation for non-custom elements
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                this.element = wrapper.firstElementChild;
                
                // If no element was created, create a div wrapper
                if (!this.element) {
                    this.element = document.createElement('div');
                    this.element.innerHTML = html;
                }
            }
            
            this.element.id = this.id;
            
            // Add component class
            if (this.definition.classes?.base) {
                this.element.classList.add(this.definition.classes.base);
            }
            
            // Add variant classes
            if (this.options.variant && this.definition.classes?.variants?.[this.options.variant]) {
                this.element.classList.add(this.definition.classes.variants[this.options.variant]);
            }
        }
        
        applyStyles() {
            const css = ComponentFactory.generateCSS(this.definition, this.id);
            if (css) {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                this.styleElement = style;
            }
        }
        
        setupEventHandlers() {
            const handlers = this.definition.handlers || {};
            
            Object.entries(handlers).forEach(([event, handlerConfig]) => {
                // Handle both single handler object and array of handlers
                const handlerArray = Array.isArray(handlerConfig) ? handlerConfig : [handlerConfig];
                
                handlerArray.forEach((handler, index) => {
                    const { selector, action, data } = handler;
                    
                    if (selector) {
                        const elements = this.element.querySelectorAll(selector);
                        elements.forEach(el => {
                            const listener = (e) => this.handleAction(action, e, data);
                            el.addEventListener(event, listener);
                            this.eventListeners.set(`${event}-${selector}-${index}`, listener);
                        });
                    } else {
                        const listener = (e) => this.handleAction(action, e, data);
                        this.element.addEventListener(event, listener);
                        this.eventListeners.set(`${event}-${index}`, listener);
                    }
                });
            });
        }
        
        handleAction(action, event, actionData = {}) {
            const { type, payload = {} } = action;
            
            switch (type) {
                case 'updateData':
                    this.updateData({ ...actionData, ...payload });
                    break;
                case 'setState':
                    this.setState(payload.state || actionData.state);
                    break;
                case 'dispatch':
                    this.dispatchEvent(payload.event || actionData.event, payload.data);
                    break;
                case 'method':
                    if (this[payload.method]) {
                        this[payload.method](...(payload.args || []));
                    }
                    break;
                case 'custom':
                    if (payload.handler && window[payload.handler]) {
                        window[payload.handler](event, this, actionData);
                    }
                    break;
            }
        }
        
        updateData(newData) {
            this.data = { ...this.data, ...newData };
            this.render();
        }
        
        setState(newState) {
            this.state = newState;
            this.element.setAttribute('data-state', newState);
            this.dispatchEvent('stateChanged', { state: newState });
        }
        
        render() {
            const html = ComponentFactory.generateHTML(this.definition, this.data);
            this.element.innerHTML = html;
            this.setupEventHandlers();
        }
        
        dispatchEvent(eventName, detail = {}) {
            const eventConfig = this.definition.events?.[eventName];
            let componentName;
            if (this.definition.component && this.definition.component.name) {
                componentName = this.definition.component.name;
            } else if (this.definition.name) {
                componentName = this.definition.name;
            } else {
                console.error('dispatchEvent: No component name found in definition', this.definition);
                throw new Error('dispatchEvent: No component name found in definition');
            }
            const fullEventName = eventConfig || `${componentName}${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;

            const event = new CustomEvent(fullEventName, {
                detail: { ...detail, component: this, id: this.id },
                bubbles: true
            });

            this.element.dispatchEvent(event);
        }
        
        destroy() {
            // Remove event listeners
            this.eventListeners.forEach((listener, key) => {
                const parts = key.split('-');
                const event = parts[0];
                
                // Check if we have a selector (format: event-selector-index)
                if (parts.length > 2) {
                    // Reconstruct selector (handle cases where selector contains hyphens)
                    const selector = parts.slice(1, -1).join('-');
                    const elements = this.element.querySelectorAll(selector);
                    elements.forEach(el => el.removeEventListener(event, listener));
                } else {
                    // No selector, just event-index
                    this.element.removeEventListener(event, listener);
                }
            });
            
            // Remove styles
            if (this.styleElement) {
                this.styleElement.remove();
            }
            
            // Remove element
            this.element.remove();
            
            // Remove from instances
            ComponentFactory.instances.delete(this.id);
        }
    }
    
    // Auto-load component definitions
    async function autoLoadDefinitions() {
        try {
            const response = await fetch('./component-registry.json');
            if (!response.ok) {
                // Try alternative path for when called from subdirectories
                const altResponse = await fetch('../component-registry.json');
                if (!altResponse.ok) {
                    throw new Error('Registry not found in either location');
                }
                const registry = await altResponse.json();
                
                for (const component of registry.components) {
                    await ComponentFactory.loadDefinition(component.path);
                }
            } else {
                const registry = await response.json();
                
                for (const component of registry.components) {
                    await ComponentFactory.loadDefinition(component.path);
                }
            }
            
            console.log('🏭 Component Factory: All definitions loaded');
        } catch (error) {
            console.log('🏭 Component Factory: No registry found, manual registration required');
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoLoadDefinitions);
    } else {
        autoLoadDefinitions();
    }
    
})();