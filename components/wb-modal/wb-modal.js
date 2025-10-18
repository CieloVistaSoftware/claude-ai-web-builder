// WB Modal Web Component
// Website Builder modal dialog Web Component - Working Implementation
// Extracted from wb_modal_webcomponent.html

console.log('🪟 WB Modal Component: Starting initialization...');

    // WB Modal Web Component Class
    class WBModal extends HTMLElement {
        constructor() {
            super();
            this._isOpen = false;
            this._keydownHandler = null;
            this._backdropClickHandler = null;
        }

        static get observedAttributes() {
            return ['title', 'size', 'variant', 'duration', 'bg-color', 'color', 'open'];
        }

        connectedCallback() {
            this.setAttribute('role', 'dialog');
            this.setAttribute('aria-modal', 'true');
            this.setAttribute('aria-hidden', 'true');
            this.className = 'wb-modal';
            this.render();
        }

        disconnectedCallback() {
            this.cleanupEventListeners();
        }

        attributeChangedCallback(name, oldValue, newValue) {
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

        render() {
            const dialog = document.createElement('div');
            dialog.className = 'wb-modal-dialog';

            const title = this.getAttribute('title');
            if (title) {
                const header = document.createElement('div');
                header.className = 'wb-modal-header';

                const titleElement = document.createElement('h2');
                titleElement.className = 'wb-modal-title';
                titleElement.textContent = title;

                const closeBtn = document.createElement('button');
                closeBtn.className = 'wb-modal-close';
                closeBtn.innerHTML = '×';
                closeBtn.setAttribute('aria-label', 'Close modal');
                closeBtn.addEventListener('click', () => this.hide());

                header.appendChild(titleElement);
                header.appendChild(closeBtn);
                dialog.appendChild(header);
            }

            const body = document.createElement('div');
            body.className = 'wb-modal-body';
            const slot = document.createElement('slot');
            body.appendChild(slot);
            dialog.appendChild(body);

            const footerSlot = document.createElement('slot');
            footerSlot.name = 'footer';
            dialog.appendChild(footerSlot);

            this.appendChild(dialog);

            this.updateSize(this.getAttribute('size'));
            this.updateVariant(this.getAttribute('variant'));
        }

        updateTitle(title) {
            const titleElement = this.querySelector('.wb-modal-title');
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
                    
                    console.log('🪟 Modal Animation:', {
                        container: container.className,
                        startTop: startTop,
                        finalPosition: 'bottom-right corner'
                    });
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
            }, 50);
        }

        hide() {
            if (!this._isOpen) return;
            this._isOpen = false;

            this.classList.remove('wb-modal--open');
            this.setAttribute('aria-hidden', 'true');

            const backdrop = document.querySelector('.wb-modal-backdrop');
            if (backdrop) {
                backdrop.classList.remove('wb-modal--open');
            }

            this.cleanupEventListeners();

            setTimeout(() => {
                this.remove();
                if (backdrop) backdrop.remove();
            }, 500);
        }
    }

    // Register Web Component
    if (!customElements.get('wb-modal')) {
        customElements.define('wb-modal', WBModal);
        console.log('🔲 WB Modal Web Component: Custom element registered');
        
        // Register with WBComponentRegistry if available
        if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
            window.WBComponentRegistry.register('wb-modal', WBModal, ['wb-event-log', 'wb-keyboard-manager'], {
                version: '1.0.0',
                type: 'overlay',
                role: 'ui-element',
                description: 'Modal dialog component with backdrop, keyboard navigation, and accessibility support',
                api: {
                    static: ['create', 'alert', 'confirm'],
                    events: ['open', 'close', 'backdrop-click', 'escape-pressed'],
                    attributes: ['title', 'size', 'closable', 'backdrop-closable', 'keyboard-closable'],
                    methods: ['show', 'hide', 'setTitle', 'setContent', 'setSize']
                },
                priority: 5 // Overlay component depends on infrastructure and keyboard handling
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

        // Show a modal
        show: function(modal, triggerElement = null) {
            if (modal && typeof modal.show === 'function') {
                modal.show(triggerElement);
                return Promise.resolve();
            }
            return Promise.reject(new Error('Invalid modal or modal.show method not found'));
        },

        // Hide a modal
        hide: function(modal) {
            if (modal && typeof modal.hide === 'function') {
                modal.hide();
                return Promise.resolve();
            }
            return Promise.reject(new Error('Invalid modal or modal.hide method not found'));
        },

        // Alert modal
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

        // Confirm modal
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

        // Prompt modal
        prompt: function(message, defaultValue = '', title = 'Input', triggerElement = null) {
            return new Promise((resolve) => {
                const inputId = 'prompt-input-' + Date.now();
                const modal = this.create({
                    title: title,
                    content: `
                        <p>${message}</p>
                        <input type="text" id="${inputId}" class="wb-input-field" value="${defaultValue}" style="width: 100%; margin-top: 1rem;">
                    `,
                    buttons: [{
                        text: 'Cancel',
                        variant: 'secondary',
                        onclick: () => {
                            this.hide(modal);
                            resolve(null);
                        }
                    }, {
                        text: 'OK',
                        variant: 'primary',
                        onclick: () => {
                            const input = modal.querySelector(`#${inputId}`);
                            const value = input ? input.value : '';
                            this.hide(modal);
                            resolve(value);
                        }
                    }]
                });
                this.show(modal, triggerElement);
                
                // Focus the input after modal opens
                setTimeout(() => {
                    const input = modal.querySelector(`#${inputId}`);
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }, 100);
            });
        },

        // Close all modals
        closeAll: function() {
            return new Promise((resolve) => {
                const modals = document.querySelectorAll('wb-modal');
                const backdrops = document.querySelectorAll('.wb-modal-backdrop');
                
                // Hide all modals
                modals.forEach(modal => {
                    if (typeof modal.hide === 'function') {
                        modal.hide();
                    }
                });
                
                // Remove any remaining backdrops
                backdrops.forEach(backdrop => {
                    backdrop.remove();
                });
                
                // Wait for animations to complete
                setTimeout(() => {
                    resolve();
                }, 600);
            });
        }
    };

    // Auto-initialize when DOM is ready
    function initialize() {
        console.log('🪟 WB Modal: Component initialized successfully');
        
        // Dispatch ready event
        const event = new CustomEvent('wbModalReady', {
            detail: { component: 'wb-modal' }
        });
        document.dispatchEvent(event);
    }

    // Use WBComponentUtils if available, otherwise fallback
    if (window.WBComponentUtils && window.WBComponentUtils.onReady) {
        window.WBComponentUtils.onReady(initialize);
    } else {
        // Fallback DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBModal = window.WBModal;

console.log('✅ wb-modal loaded successfully');