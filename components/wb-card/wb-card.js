// WB Card Web Component v2.0
// Fixed: footer only shows when has content, proper slot handling

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBCard extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        
        this.config = {
            classes: {
                base: 'wb-card',
                header: 'wb-card-header',
                title: 'wb-card-title',
                subtitle: 'wb-card-subtitle',
                body: 'wb-card-body',
                content: 'wb-card-content',
                media: 'wb-card-media',
                image: 'wb-card-image',
                footer: 'wb-card-footer',
                actions: 'wb-card-actions',
                variants: {
                    'default': '',
                    'elevated': 'wb-card--elevated',
                    'outlined': 'wb-card--outlined',
                    'filled': 'wb-card--filled',
                    'glass': 'wb-card--glass',
                    'primary': 'wb-card--primary',
                    'secondary': 'wb-card--secondary',
                    'success': 'wb-card--success',
                    'warning': 'wb-card--warning',
                    'danger': 'wb-card--danger',
                    'info': 'wb-card--info',
                    'primary-filled': 'wb-card--primary-filled',
                    'success-filled': 'wb-card--success-filled',
                    'warning-filled': 'wb-card--warning-filled',
                    'danger-filled': 'wb-card--danger-filled',
                    'info-filled': 'wb-card--info-filled'
                },
                sizes: {
                    'compact': 'wb-card--compact',
                    'standard': 'wb-card--standard',
                    'large': 'wb-card--large'
                },
                states: {
                    'hover': 'wb-card--hover',
                    'active': 'wb-card--active',
                    'disabled': 'wb-card--disabled',
                    'loading': 'wb-card--loading'
                },
                layouts: {
                    'vertical': 'wb-card--vertical',
                    'horizontal': 'wb-card--horizontal',
                    'media-top': 'wb-card--media-top',
                    'media-left': 'wb-card--media-left',
                    'media-right': 'wb-card--media-right'
                }
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();
        await loadComponentCSS(this, 'wb-card.css');
        this.render();
        this.setupSlotObserver();
        this.fireEvent('wb-card:ready', { variant: this.getAttribute('variant') || 'default' });
    }

    setupSlotObserver() {
        // Watch for slotted content changes
        const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
        if (actionsSlot) {
            actionsSlot.addEventListener('slotchange', () => this.updateFooterVisibility());
        }
        this.updateFooterVisibility();
    }

    updateFooterVisibility() {
        const footer = this.shadowRoot.querySelector('.wb-card-footer');
        const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
        const footerContent = this.getAttribute('footer');
        
        if (footer) {
            const hasSlottedContent = actionsSlot && actionsSlot.assignedElements().length > 0;
            const hasFooterAttr = footerContent && footerContent.trim() !== '';
            
            // Show footer with HR divider only when there are actions
            if (hasSlottedContent || hasFooterAttr) {
                footer.removeAttribute('hidden');
            } else {
                footer.setAttribute('hidden', '');
            }
        }
    }

    getClasses() {
        const variant = this.getAttribute('variant') || 'default';
        const size = this.getAttribute('size') || 'standard';
        const layout = this.getAttribute('layout') || 'vertical';
        const isLoading = this.hasAttribute('loading');
        
        let classes = [this.config.classes.base];
        
        if (this.config.classes.variants[variant]) {
            classes.push(this.config.classes.variants[variant]);
        }
        if (this.config.classes.sizes[size]) {
            classes.push(this.config.classes.sizes[size]);
        }
        if (this.config.classes.layouts[layout]) {
            classes.push(this.config.classes.layouts[layout]);
        }
        if (isLoading) {
            classes.push(this.config.classes.states.loading);
        }
        
        return classes.filter(Boolean).join(' ');
    }

    render() {
        if (!this.shadowRoot) return;
        
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const body = this.getAttribute('body') || '';
        const mediaSrc = this.getAttribute('media-src') || '';
        const footerContent = this.getAttribute('footer') || '';
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-card.css', import.meta.url).href}">
            <div class="${this.getClasses()}">
                ${mediaSrc ? `
                    <div class="${this.config.classes.media}">
                        <img class="${this.config.classes.image}" src="${mediaSrc}" alt="">
                    </div>
                ` : ''}
                
                ${(title || subtitle) ? `
                    <div class="${this.config.classes.header}">
                        ${title ? `<h3 class="${this.config.classes.title}">${title}</h3>` : ''}
                        ${subtitle ? `<p class="${this.config.classes.subtitle}">${subtitle}</p>` : ''}
                    </div>
                ` : ''}
                
                <div class="${this.config.classes.body}">
                    <div class="${this.config.classes.content}">
                        ${body}
                        <slot></slot>
                    </div>
                </div>
                
                <div class="${this.config.classes.footer}" hidden>
                    <hr class="wb-card-divider">
                    ${footerContent}
                    <div class="${this.config.classes.actions}">
                        <slot name="actions"></slot>
                    </div>
                </div>
            </div>
        `;
        
        // Re-setup observer after render
        setTimeout(() => this.setupSlotObserver(), 0);
    }

    static get observedAttributes() {
        return ['title', 'subtitle', 'body', 'variant', 'size', 'layout', 'media-src', 'footer', 'loading'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue !== newValue && this.shadowRoot) {
            this.render();
        }
    }
}

if (!customElements.get('wb-card')) {
    customElements.define('wb-card', WBCard);
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBCard = WBCard;

export { WBCard };
export default WBCard;
