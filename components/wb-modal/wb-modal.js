// WB Modal Web Component
// Website Builder modal dialog Web Component - Working Implementation

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBModal extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        this._isOpen = false;
        this._keydownHandler = null;
        this._backdropClickHandler = null;
    }

    static get observedAttributes() {
        return ['title', 'size', 'variant', 'duration', 'bg-color', 'color', 'open'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBModal connecting', { title: this.getAttribute('title') });
        
        await loadComponentCSS(this, 'wb-modal.css');
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-modal', 'true');
        this.setAttribute('aria-hidden', 'true');
        this.className = 'wb-modal';
        this.render();
        
        this.fireEvent('wb-modal:ready', { component: 'wb-modal' });
        this.logInfo('WBModal ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanupEventListeners();
        this.logDebug('WBModal disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'title':
                this.updateTitle(newValue);
                break;
            case 'size':
                this.updateSize(newValue);
                break;
            case 'variant':
                this.updateVariant(newValue);
                break;
            case 'duration':
                this.style.setProperty('--wb-modal-duration', `${newValue}ms`);
                break;
            case 'bg-color':
                if (newValue) this.style.setProperty('--wb-modal-bg-color', newValue);
                break;
            case 'color':
                if (newValue) this.style.setProperty('--wb-modal-color', newValue);
                break;
        }
    }
    
    // Property getters/setters
    get title() {
        return this.getAttr('title', '');
    }
    
    set title(value) {
        this.setAttr('title', value);
    }
    
    get size() {
        return this.getAttr('size', 'medium');
    }
    
    set size(value) {
        this.setAttr('size', value);
    }
    
    get variant() {
        return this.getAttr('variant', 'default');
    }
    
    set variant(value) {
        this.setAttr('variant', value);
    }

    render() {
        if (!this.shadowRoot) return;
        
        const title = this.getAttribute('title');
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-modal.css', import.meta.url).href}">
            <div class="wb-modal-dialog">
                ${title ? `
                    <div class="wb-modal-header">
                        <h2 class="wb-modal-title">${title}</h2>
                        <button class="wb-modal-close" aria-label="Close modal">×</button>
                    </div>
                ` : ''}
                <div class="wb-modal-body">
                    <slot></slot>
                </div>
                <slot name="footer"></slot>
            </div>
        `;
        
        // Add close button listener
        const closeBtn = this.shadowRoot.querySelector('.wb-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        this.updateSize(this.getAttribute('size'));
        this.updateVariant(this.getAttribute('variant'));
    }

    updateTitle(title) {
        const titleElement = this.shadowRoot?.querySelector('.wb-modal-title');
        if (titleElement) titleElement.textContent = title || '';
    }

    updateSize(size) {
        this.classList.remove('wb-modal--small', 'wb-modal--large');
        if (size === 'small') this.classList.add('wb-modal--small');
        if (size === 'large') this.classList.add('wb-modal--large');
    }

    updateVariant(variant) {
        this.classList.remove('wb-modal--success', 'wb-modal--warning', 'wb-modal--danger');
        if (variant === 'success') this.classList.add('wb-modal--success');
        if (variant === 'warning') this.classList.add('wb-modal--warning');
        if (variant === 'danger') this.classList.add('wb-modal--danger');
    }

    cleanupEventListeners() {
        if (this._keydownHandler) {
            document.removeEventListener('keydown', this._keydownHandler);
            this._keydownHandler = null;
        }
        if (this._backdropClickHandler) {
            const backdrop = document.querySelector('.wb-modal-backdrop');
            if (backdrop) {
                backdrop.removeEventListener('click', this._backdropClickHandler);
            }
            this._backdropClickHandler = null;
        }
    }

    show(triggerElement = null) {
        if (this._isOpen) return;
        this._isOpen = true;
        
        this.logInfo('WBModal showing', { title: this.title });

        // Set modal dimensions
        const modalWidth = Math.min(window.innerWidth * 0.5, 500);
        const modalHeight = 400;
        this.style.setProperty('--wb-modal-width', modalWidth + 'px');
        this.style.setProperty('--wb-modal-height', modalHeight + 'px');

        // Calculate start position
        if (triggerElement) {
            const container = triggerElement.closest('.demo-section') || 
                             triggerElement.closest('.hero-demo') || 
                             triggerElement.parentElement;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const startTop = containerRect.top + scrollTop;
                this.style.setProperty('--wb-modal-start-top', startTop + 'px');
            }
        }

        // Create backdrop
        let backdrop = document.querySelector('.wb-modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'wb-modal-backdrop';
            document.body.appendChild(backdrop);
        }

        document.body.appendChild(this);

        // Setup event listeners
        this._keydownHandler = (e) => {
            if (e.key === 'Escape') this.hide();
        };
        this._backdropClickHandler = (e) => {
            if (e.target === backdrop) this.hide();
        };

        document.addEventListener('keydown', this._keydownHandler);
        backdrop.addEventListener('click', this._backdropClickHandler);

        // Force reflow
        this.offsetHeight;

        // Show modal with animation
        setTimeout(() => {
            backdrop.classList.add('wb-modal--open');
            this.classList.add('wb-modal--open');
            this.setAttribute('aria-hidden', 'false');
            
            this.fireEvent('wb-modal:open', { title: this.title });
        }, 50);
    }

    hide() {
        if (!this._isOpen) return;
        this._isOpen = false;
        
        this.logInfo('WBModal hiding', { title: this.title });

        this.classList.remove('wb-modal--open');
        this.setAttribute('aria-hidden', 'true');

        const backdrop = document.querySelector('.wb-modal-backdrop');
        if (backdrop) {
            backdrop.classList.remove('wb-modal--open');
        }

        this.cleanupEventListeners();
        
        this.fireEvent('wb-modal:close', { title: this.title });

        setTimeout(() => {
            this.remove();
            if (backdrop) backdrop.remove();
        }, 500);
    }
}

// Register Web Component
if (!customElements.get('wb-modal')) {
    customElements.define('wb-modal', WBModal);
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-modal', WBModal, ['wb-event-log', 'wb-keyboard-manager'], {
            version: '1.0.0',
            type: 'overlay',
            role: 'ui-element',
            description: 'Modal dialog component with backdrop, keyboard navigation, and accessibility support',
            api: {
                static: ['create', 'alert', 'confirm'],
                events: ['wb-modal:ready', 'wb-modal:open', 'wb-modal:close'],
                attributes: ['title', 'size', 'variant', 'duration', 'bg-color', 'color'],
                methods: ['show', 'hide', 'render']
            },
            priority: 5
        });
    }
}

// Modal utility functions for easy usage
window.WBModal = {
    // Create a modal element
    create: function(options = {}) {
        const modal = document.createElement('wb-modal');
        
        // Set attributes
        if (options.title) modal.setAttribute('title', options.title);
        if (options.size) modal.setAttribute('size', options.size);
        if (options.variant) modal.setAttribute('variant', options.variant);
        if (options.duration) modal.setAttribute('duration', options.duration);
        if (options.bgColor) modal.setAttribute('bg-color', options.bgColor);
        if (options.color) modal.setAttribute('color', options.color);

        // Add content
        if (options.content) {
            if (typeof options.content === 'string') {
                modal.innerHTML = options.content;
            } else {
                modal.appendChild(options.content);
            }
        }

        // Create footer if buttons provided
        if (options.buttons && options.buttons.length > 0) {
            const footer = document.createElement('div');
            footer.slot = 'footer';
            footer.className = 'wb-modal-footer';
            
            options.buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = 'wb-btn';
                button.textContent = buttonConfig.text;
                
                if (buttonConfig.variant) {
                    button.classList.add(`wb-btn--${buttonConfig.variant}`);
                }
                
                if (buttonConfig.onclick) {
                    button.addEventListener('click', buttonConfig.onclick);
                }
                
                footer.appendChild(button);
            });
            
            modal.appendChild(footer);
        }

        return modal;
    },

    show: function(modal, triggerElement = null) {
        if (modal && typeof modal.show === 'function') {
            modal.show(triggerElement);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Invalid modal'));
    },

    hide: function(modal) {
        if (modal && typeof modal.hide === 'function') {
            modal.hide();
            return Promise.resolve();
        }
        return Promise.reject(new Error('Invalid modal'));
    },

    alert: function(message, title = 'Alert', triggerElement = null) {
        const modal = this.create({
            title: title,
            content: `<p>${message}</p>`,
            buttons: [{
                text: 'OK',
                variant: 'primary',
                onclick: () => this.hide(modal)
            }]
        });
        this.show(modal, triggerElement);
        return modal;
    },

    confirm: function(message, title = 'Confirm', triggerElement = null) {
        return new Promise((resolve) => {
            const modal = this.create({
                title: title,
                content: `<p>${message}</p>`,
                buttons: [{
                    text: 'Cancel',
                    variant: 'secondary',
                    onclick: () => {
                        this.hide(modal);
                        resolve(false);
                    }
                }, {
                    text: 'Confirm',
                    variant: 'primary',
                    onclick: () => {
                        this.hide(modal);
                        resolve(true);
                    }
                }]
            });
            this.show(modal, triggerElement);
        });
    },

    closeAll: function() {
        return new Promise((resolve) => {
            const modals = document.querySelectorAll('wb-modal');
            const backdrops = document.querySelectorAll('.wb-modal-backdrop');
            
            modals.forEach(modal => {
                if (typeof modal.hide === 'function') {
                    modal.hide();
                }
            });
            
            backdrops.forEach(backdrop => backdrop.remove());
            
            setTimeout(() => resolve(), 600);
        });
    }
};

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBModal = window.WBModal;

// ES6 Module Exports
export { WBModal };
export default WBModal;
