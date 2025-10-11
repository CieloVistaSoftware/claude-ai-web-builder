/**
 * WB Button Web Component
 * 
 * A standardized button component with dynamic configuration, variants, and theming support.
 * Supports toggle functionality, status indicators, icons, and images.
 * 
 * @example
 * <wb-button variant="primary" size="medium">Click Me</wb-button>
 * <wb-button variant="toggle" active="true">Toggle Button</wb-button>
 * 
 * @events
 * - wb-button:click - Fired when button is clicked
 * - wb-button:toggle - Fired when toggle button state changes
 * - wb-button:ready - Fired when component is fully initialized
 * 
 * @version 2.0.0
 * @author Website Builder Team
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

console.log('🔘 WB Button Web Component: Starting initialization...');

// Configuration fallback - used if JSON loading fails
const fallbackConfig = {
        component: {
            name: 'wb-button',
            version: '2.0.0',
            description: 'Website Builder standardized button component'
        },
        classes: {
            base: 'wb-btn',
            variants: {
                primary: 'wb-btn--primary',
                secondary: 'wb-btn--secondary',
                success: 'wb-btn--success',
                toggle: 'wb-btn--toggle',
                iconOnly: 'wb-btn--icon-only',
                imageOnly: 'wb-btn--image-only'
            },
            sizes: {
                small: 'wb-btn--small',
                medium: '',
                large: 'wb-btn--large'
            },
            states: {
                active: 'active',
                disabled: 'disabled',
                loading: 'wb-btn--loading'
            },
            elements: {
                icon: 'wb-btn__icon',
                image: 'wb-btn__image',
                status: 'wb-btn__status',
                checkmark: 'wb-btn__checkmark'
            },
            layouts: {
                grid: 'wb-btn-grid',
                gridSingle: 'wb-btn-grid--single',
                gridThree: 'wb-btn-grid--three',
                gridFour: 'wb-btn-grid--four',
                group: 'wb-btn-group'
            }
        },
        defaults: {
            variant: 'primary',
            size: 'medium',
            disabled: false,
            active: false
        },
        attributes: {
            variant: 'variant',
            size: 'size',
            disabled: 'disabled',
            active: 'active',
            image: 'image',
            imagePosition: 'image-position',
            imageAlt: 'image-alt',
            status: 'status',
            backgroundImage: 'background-image'
        },
        events: {
            ready: 'wb-button:ready',
            click: 'wb-button:click',
            toggle: 'wb-button:toggle'
        }
    };

class WBButton extends WBBaseComponent {
        constructor() {
            super();
            
            // Component state
            this.config = fallbackConfig;
            this.initialized = false;
            this.utils = null;
            this._isActive = false;
            this._value = null;
            
            // Bind methods
            this.handleClick = this.handleClick.bind(this);
            this.handleToggle = this.handleToggle.bind(this);
        }

        async connectedCallback() {
            try {
                await this.initialize();
            } catch (error) {
                console.error('🔘 WB Button initialization failed:', error);
                this.initializeFallback();
            }
        }

        disconnectedCallback() {
            this.cleanup();
        }

        // Observed attributes for reactivity
        static get observedAttributes() {
            return ['variant', 'size', 'disabled', 'active', 
                   'image', 'image-position', 'image-alt', 'status', 'background-image'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.initialized) return;
            
            switch (name) {
                case 'variant':
                    this.setVariant(newValue);
                    break;
                case 'size':
                    this.setSize(newValue);
                    break;
                case 'disabled':
                    this.setDisabled(newValue !== null);
                    break;
                case 'active':
                    this.setActive(newValue !== null);
                    break;
                case 'image':
                    this.updateImage();
                    break;
                case 'status':
                    this.setStatus(newValue);
                    break;
                case 'background-image':
                    this.updateBackgroundImage();
                    break;
            }
        }

        async initialize() {
            console.log(`🚨 CLAUDE EDITED VERSION - initialize() called for "${this.textContent.trim()}"`);
            
            // Load utilities
            await this.loadUtils();
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            await this.loadCSS();
            
            // Initialize component
            this.initializeComponent();
            
            // Mark as initialized
            this.initialized = true;
            
            // Re-apply image attributes after full initialization
            this.updateImage();
            this.updateBackgroundImage();
            
            // Update adjacent button sizes
            console.log(`🔘 About to call updateAdjacentButtonSizes for "${this.textContent.trim()}"`);
            if (typeof this.updateAdjacentButtonSizes === 'function') {
                this.updateAdjacentButtonSizes();
            } else {
                console.error('🔘 updateAdjacentButtonSizes method not found!');
            }
            
            // Additional delayed call to ensure it works
            setTimeout(() => {
                console.log(`🔘 Delayed call to updateAdjacentButtonSizes for "${this.textContent.trim()}"`);
                if (typeof this.updateAdjacentButtonSizes === 'function') {
                    this.updateAdjacentButtonSizes();
                } else {
                    console.error('🔘 updateAdjacentButtonSizes method not found in delayed call!');
                }
            }, 100);
            
            // Dispatch ready event
            this.dispatchReady();
        }

        async loadUtils() {
            if (!window.WBComponentUtils) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = '../wb-component-utils.js';
                    script.onload = () => {
                        this.utils = window.WBComponentUtils;
                        resolve();
                    };
                    script.onerror = () => reject(new Error('Failed to load WBComponentUtils'));
                    document.head.appendChild(script);
                });
            } else {
                this.utils = window.WBComponentUtils;
            }
        }

        async loadConfig() {
            if (this.utils) {
                try {
                    const configPath = WBComponentUtils.getPath('wb-button.js', '../components/wb-button/') + 'wb-button.json';
                    this.config = await this.utils.loadConfig(configPath, fallbackConfig, 'WB Button');
                } catch (error) {
                    console.warn('🔘 WB Button: Using fallback config:', error.message);
                    this.config = fallbackConfig;
                }
            }
        }

        async loadCSS() {
            if (this.utils) {
                const cssPath = WBComponentUtils.getPath('wb-button.js', '../components/wb-button/') + 'wb-button.css';
                await this.utils.loadCSS('wb-button', cssPath);
            }
        }

        initializeComponent() {
            // Set base classes
            this.classList.add(this.config.classes.base);
            
            // Apply initial attributes
            this.applyAttributes();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Process existing content
            this.processContent();
        }

        initializeFallback() {
            console.warn('🔘 WB Button: Initializing with basic functionality');
            this.classList.add('wb-btn');
            this.setupEventListeners();
        }

        applyAttributes() {
            // Apply variant
            const variant = this.getAttribute('variant') || this.config.defaults.variant;
            this.setVariant(variant);
            
            // Apply size
            const size = this.getAttribute('size') || this.config.defaults.size;
            this.setSize(size);
            
            // Apply disabled state
            if (this.hasAttribute('disabled')) {
                this.setDisabled(true);
            }
            
            // Apply active state
            if (this.hasAttribute('active')) {
                this.setActive(true);
            }
            
            // Apply other attributes (skip image here, will be done after full init)
            // this.updateImage();
            this.updateBackgroundImage();
            
            const status = this.getAttribute('status');
            if (status) {
                this.setStatus(status);
            }
        }

        processContent() {
            // If button has content, preserve it but add necessary wrapper elements
            const originalContent = this.innerHTML;
            
            // For toggle buttons, add checkmark
            if (this.getAttribute('variant') === 'toggle') {
                this.addToggleElements();
            }
            
            // Add status indicator if specified
            const status = this.getAttribute('status');
            if (status) {
                this.addStatusIndicator(status);
            }
            
            // Auto-scale text to fit
            this.autoScaleText();
        }
        
        autoScaleText() {
            // Get only text nodes, excluding icon and image elements
            const textNodes = Array.from(this.childNodes).filter(node => {
                if (node.nodeType === Node.TEXT_NODE) return true;
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const classList = node.classList;
                    return !classList.contains('wb-btn__image') && 
                           !classList.contains('wb-btn__status') &&
                           !classList.contains('wb-btn__checkmark');
                }
                return false;
            });
            
            const textContent = textNodes.map(node => node.textContent).join('').trim();
            
            // If no text content, skip scaling
            if (!textContent) return;
            
            // Create a temporary span to measure text width
            const tempSpan = document.createElement('span');
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.style.fontWeight = '600'; // Match button font weight
            tempSpan.textContent = textContent;
            
            document.body.appendChild(tempSpan);
            
            // Maximum width available for text (minus padding)
            let maxWidth = parseFloat(getComputedStyle(this).width) - 16; // 1rem = 16px padding
            
            // No icon width adjustment needed anymore
            
            // Try different font sizes to find the best fit
            const baseFontSize = parseFloat(getComputedStyle(this).getPropertyValue('--wb-btn-font-size') || '0.75rem');
            let fontSize = baseFontSize;
            
            tempSpan.style.fontSize = fontSize + 'rem';
            
            // Scale down if text is too wide
            while (tempSpan.offsetWidth > maxWidth && fontSize > 0.5) {
                fontSize -= 0.05;
                tempSpan.style.fontSize = fontSize + 'rem';
            }
            
            document.body.removeChild(tempSpan);
            
            // Apply the calculated font size
            if (fontSize < baseFontSize) {
                this.style.fontSize = fontSize + 'rem';
            } else {
                this.style.fontSize = ''; // Reset to default
            }
        }

        setupEventListeners() {
            this.addEventListener('click', this.handleClick);
            
            // For toggle buttons
            if (this.getAttribute('variant') === 'toggle') {
                this.addEventListener('click', this.handleToggle);
            }
            
            // Watch for text content changes
            this.setupTextObserver();
            
            // Setup adjacent button sizing
            this.setupAdjacentButtonSizing();
        }
        
        setupTextObserver() {
            const observer = new MutationObserver(() => {
                this.autoScaleText();
                this.updateAdjacentButtonSizes();
            });
            
            observer.observe(this, {
                childList: true,
                characterData: true,
                subtree: true
            });
            
            this._textObserver = observer;
        }
        
        setupAdjacentButtonSizing() {
            // Watch for DOM changes that might affect adjacent buttons
            if (!this._adjacentObserver) {
                const parentObserver = new MutationObserver(() => {
                    this.updateAdjacentButtonSizes();
                });
                
                // Observe parent for child list changes
                if (this.parentElement) {
                    parentObserver.observe(this.parentElement, {
                        childList: true,
                        subtree: false
                    });
                    
                    this._adjacentObserver = parentObserver;
                }
            }
            
            // Initial check for adjacent buttons with delay to ensure all buttons are initialized
            setTimeout(() => this.updateAdjacentButtonSizes(), 250);
            // Second check to catch any late initializations
            setTimeout(() => this.updateAdjacentButtonSizes(), 500);
        }
        
        getAdjacentButtons() {
            const buttons = [];
            
            // Simple approach: get all wb-button siblings in the same parent
            if (this.parentElement) {
                const allButtons = Array.from(this.parentElement.children).filter(child => 
                    child.tagName === 'WB-BUTTON'
                );
                
                console.log(`🔘 getAdjacentButtons for "${this.textContent.trim()}" (parent: ${this.parentElement.tagName}): found ${allButtons.length} wb-button siblings`);
                allButtons.forEach((btn, idx) => {
                    console.log(`  ${idx}: "${btn.textContent.trim()}" (initialized: ${btn.initialized})`);
                });
                
                // Only return if there are multiple buttons
                if (allButtons.length > 1) {
                    return allButtons;
                }
            }
            
            return [];
        }
        
        updateAdjacentButtonSizes() {
            // Prevent recursive updates
            if (this._updatingAdjacent) return;
            this._updatingAdjacent = true;
            
            const adjacentButtons = this.getAdjacentButtons();
            console.log(`🔘 updateAdjacentButtonSizes for "${this.textContent.trim()}": processing ${adjacentButtons.length} buttons`);
            
            if (adjacentButtons.length > 0) {
                // Use a more accurate method to measure text width
                let maxWidth = 5; // Default 5rem minimum
                
                // Create a temporary span for accurate measurement
                const tempSpan = document.createElement('span');
                tempSpan.style.position = 'absolute';
                tempSpan.style.visibility = 'hidden';
                tempSpan.style.whiteSpace = 'nowrap';
                tempSpan.style.fontFamily = getComputedStyle(this).fontFamily;
                tempSpan.style.fontSize = getComputedStyle(this).fontSize;
                tempSpan.style.fontWeight = '600'; // Match button font weight
                document.body.appendChild(tempSpan);
                
                adjacentButtons.forEach(btn => {
                    const textNodes = Array.from(btn.childNodes).filter(node => {
                        if (node.nodeType === Node.TEXT_NODE) return true;
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const classList = node.classList;
                            return !classList.contains('wb-btn__image') && 
                                   !classList.contains('wb-btn__status') &&
                                   !classList.contains('wb-btn__checkmark');
                        }
                        return false;
                    });
                    
                    const textContent = textNodes.map(node => node.textContent).join('').trim();
                    if (textContent) {
                        tempSpan.textContent = textContent;
                        // Convert pixel width to rem (16px = 1rem) and add 1rem for padding
                        const requiredWidth = (tempSpan.offsetWidth / 16) + 1;
                        maxWidth = Math.max(maxWidth, requiredWidth);
                    }
                });
                
                document.body.removeChild(tempSpan);
                
                console.log(`🔘 Applying width ${maxWidth}rem to ${adjacentButtons.length} buttons`);
                
                // Apply the same width to all adjacent buttons
                adjacentButtons.forEach(btn => {
                    btn.style.width = `${maxWidth}rem`;
                    btn.style.minWidth = `${maxWidth}rem`;
                    btn.style.maxWidth = `${maxWidth}rem`;
                    console.log(`🔘 Applied to "${btn.textContent.trim()}"`);
                    
                    // Trigger text scaling update for each button
                    if (btn !== this && btn.autoScaleText) {
                        btn.autoScaleText();
                    }
                });
                
                // Notify other buttons to update as well
                adjacentButtons.forEach(btn => {
                    if (btn !== this && btn.updateAdjacentButtonSizes && !btn._updatingAdjacent) {
                        btn.updateAdjacentButtonSizes();
                    }
                });
            } else {
                // Reset to default if no adjacent buttons
                this.style.width = '';
                this.style.minWidth = '';
                this.style.maxWidth = '';
            }
            
            // Clear the update flag
            this._updatingAdjacent = false;
        }

        handleClick(event) {
            if (this.hasAttribute('disabled')) {
                event.preventDefault();
                return;
            }
            
            // Dispatch custom click event
            this.dispatchEvent(new CustomEvent(this.config.events.click, {
                detail: { 
                    button: this, 
                    variant: this.getAttribute('variant'),
                    value: this._value 
                },
                bubbles: true
            }));
        }

        handleToggle(event) {
            if (this.hasAttribute('disabled')) return;
            
            // Toggle active state
            const newActive = !this._isActive;
            this.setActive(newActive);
            
            // Dispatch toggle event
            this.dispatchEvent(new CustomEvent(this.config.events.toggle, {
                detail: { 
                    button: this, 
                    active: newActive,
                    value: this._value 
                },
                bubbles: true
            }));
        }

        // Public API methods
        setVariant(variant) {
            // Remove existing variant classes
            Object.values(this.config.classes.variants).forEach(cls => {
                if (cls) this.classList.remove(cls);
            });
            
            // Add new variant class
            const variantClass = this.config.classes.variants[variant];
            if (variantClass) {
                this.classList.add(variantClass);
            }
            
            // Update attribute
            this.setAttribute('variant', variant);
        }

        setSize(size) {
            // Remove existing size classes
            Object.values(this.config.classes.sizes).forEach(cls => {
                if (cls) this.classList.remove(cls);
            });
            
            // Add new size class
            const sizeClass = this.config.classes.sizes[size];
            if (sizeClass) {
                this.classList.add(sizeClass);
            }
            
            // Update attribute
            this.setAttribute('size', size);
        }

        setDisabled(disabled) {
            if (disabled) {
                this.setAttribute('disabled', '');
                this.classList.add(this.config.classes.states.disabled);
            } else {
                this.removeAttribute('disabled');
                this.classList.remove(this.config.classes.states.disabled);
            }
        }

        setActive(active) {
            this._isActive = active;
            
            if (active) {
                this.setAttribute('active', '');
                this.classList.add(this.config.classes.states.active);
            } else {
                this.removeAttribute('active');
                this.classList.remove(this.config.classes.states.active);
            }
        }

        setStatus(status) {
            // Remove existing status classes
            const statusElement = this.querySelector(`.${this.config.classes.elements.status}`);
            if (statusElement) {
                statusElement.className = this.config.classes.elements.status;
                statusElement.classList.add(`${this.config.classes.elements.status}--${status}`);
            } else {
                this.addStatusIndicator(status);
            }
            
            this.setAttribute('data-status', status);
        }

        setValue(value) {
            this._value = value;
            this.setAttribute('value', value);
        }

        getValue() {
            return this._value;
        }

        getActive() {
            return this._isActive;
        }

        // Helper methods

        updateImage() {
            const image = this.getAttribute('image');
            const imagePosition = this.getAttribute('image-position') || 'left';
            const imageAlt = this.getAttribute('image-alt') || '';
            
            // Ensure config is initialized
            if (!this.config) return;
            
            // Remove existing images
            this.querySelectorAll(`.${this.config.classes.elements.image}`).forEach(el => el.remove());
            
            if (image) {
                const imageElement = this.utils ?
                    this.utils.createElement('img', {
                        className: `${this.config.classes.elements.image} ${this.config.classes.elements.image}--${imagePosition}`,
                        src: image,
                        alt: imageAlt
                    }) :
                    this.createImageElement(image, imagePosition, imageAlt);
                
                if (imagePosition === 'left') {
                    this.insertBefore(imageElement, this.firstChild);
                } else {
                    this.appendChild(imageElement);
                }
            }
        }

        updateBackgroundImage() {
            const backgroundImage = this.getAttribute('background-image');
            
            if (backgroundImage) {
                this.classList.add('wb-btn--bg-image');
                this.setAttribute('data-bg-image', backgroundImage);
                this.style.setProperty('--wb-btn-bg-image', `url(${backgroundImage})`);
            } else {
                this.classList.remove('wb-btn--bg-image');
                this.removeAttribute('data-bg-image');
                this.style.removeProperty('--wb-btn-bg-image');
            }
        }

        addToggleElements() {
            // Add checkmark for toggle buttons
            const checkmark = this.utils ?
                this.utils.createElement('span', {
                    className: this.config.classes.elements.checkmark,
                    textContent: '✓'
                }) :
                this.createCheckmarkElement();
            
            this.appendChild(checkmark);
        }

        addStatusIndicator(status) {
            const statusElement = this.utils ?
                this.utils.createElement('span', {
                    className: `${this.config.classes.elements.status} ${this.config.classes.elements.status}--${status}`
                }) :
                this.createStatusElement(status);
            
            this.appendChild(statusElement);
        }

        // Fallback element creation methods

        createImageElement(src, position, alt) {
            const img = document.createElement('img');
            img.className = `wb-btn__image wb-btn__image--${position}`;
            img.src = src;
            img.alt = alt;
            return img;
        }

        createCheckmarkElement() {
            const span = document.createElement('span');
            span.className = 'wb-btn__checkmark';
            span.textContent = '✓';
            return span;
        }

        createStatusElement(status) {
            const span = document.createElement('span');
            span.className = `wb-btn__status wb-btn__status--${status}`;
            return span;
        }


        cleanup() {
            this.removeEventListener('click', this.handleClick);
            this.removeEventListener('click', this.handleToggle);
            
            // Clean up text observer
            if (this._textObserver) {
                this._textObserver.disconnect();
                this._textObserver = null;
            }
            
            // Clean up adjacent button observer
            if (this._adjacentObserver) {
                this._adjacentObserver.disconnect();
                this._adjacentObserver = null;
            }
        }

        dispatchReady() {
            if (this.utils) {
                this.utils.EventDispatcher.dispatchReady('wb-button', this.config);
            } else {
                this.dispatchEvent(new CustomEvent(this.config.events.ready, {
                    detail: { component: 'wb-button', config: this.config },
                    bubbles: true
                }));
            }
            
            console.log('🔘 WB Button Web Component: Initialized successfully');
        }
    }

    // Static utility methods for creating button grids and groups
    WBButton.createGrid = function(columns = 2) {
        const grid = document.createElement('div');
        const config = fallbackConfig;
        
        if (columns === 1) {
            grid.className = config.classes.layouts.gridSingle;
        } else if (columns === 3) {
            grid.className = config.classes.layouts.gridThree;
        } else if (columns === 4) {
            grid.className = config.classes.layouts.gridFour;
        } else {
            grid.className = config.classes.layouts.grid;
        }
        return grid;
    };

    WBButton.createGroup = function() {
        const group = document.createElement('div');
        group.className = fallbackConfig.classes.layouts.group;
        return group;
    };

// Register the custom element
if (customElements && !customElements.get('wb-button')) {
    customElements.define('wb-button', WBButton);
    console.log('🔘 WB Button Web Component: Custom element registered');
} else if (customElements.get('wb-button')) {
    console.log('🔘 WB Button Web Component: Already registered');
} else {
    console.error('🔘 WB Button Web Component: Custom Elements not supported');
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-button', WBButton, ['wb-event-log'], {
        version: '1.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Versatile button component with multiple styles, sizes, and interaction states',
        api: {
            static: ['createGroup'],
            events: ['click', 'focus', 'blur', 'hover'],
            attributes: ['label', 'variant', 'size', 'disabled', 'loading', 'icon', 'icon-position'],
            methods: ['render', 'setLabel', 'setVariant', 'setSize', 'disable', 'enable']
        },
        priority: 4 // UI component depends on infrastructure
    });
}