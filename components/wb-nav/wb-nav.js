/**
 * WB Nav Web Component
 * 
 * A fully-featured navigation menu component with responsive layouts.
 * 
 * @example
 * <wb-nav layout="horizontal" brand-text="My App" items='[{"text":"Home","href":"/"}]'></wb-nav>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBNav extends WBBaseComponent {
    static useShadow = false; // Nav typically needs light DOM for styling
    
    constructor() {
        super();
        this.items = [];
        this.activeItem = null;
        this.isExpanded = false;
        this._initialized = false;
        
        this.config = {
            classes: {
                base: 'wb-nav',
                container: 'wb-nav-container',
                list: 'wb-nav-list',
                item: 'wb-nav-item',
                link: 'wb-nav-link',
                brand: 'wb-nav-brand',
                toggle: 'wb-nav-toggle',
                toggleIcon: 'wb-nav-toggle-icon',
                states: { active: 'active', disabled: 'disabled', expanded: 'expanded' },
                layouts: {
                    horizontal: 'wb-nav--horizontal',
                    vertical: 'wb-nav--vertical',
                    top: 'wb-nav--top',
                    left: 'wb-nav--left',
                    right: 'wb-nav--right'
                },
                variants: { default: 'wb-nav--default', minimal: 'wb-nav--minimal', pills: 'wb-nav--pills' }
            },
            defaults: { layout: 'horizontal', position: 'top', theme: 'default' }
        };
    }

    static get observedAttributes() {
        return ['layout', 'variant', 'position', 'items', 'brand-text'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        if (this._initialized) return;
        this._initialized = true;
        
        this.logInfo('WBNav connecting', { layout: this.layout });
        
        await loadComponentCSS(this, 'wb-nav.css');
        this.render();
        this.setupEventListeners();
        
        this.fireEvent('wb-nav:ready', { component: 'wb-nav' });
        this.logInfo('WBNav ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.logDebug('WBNav disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'items':
                try {
                    this.items = JSON.parse(newValue);
                    this.render();
                } catch (e) {
                    this.logError('Invalid items JSON', { error: e.message });
                }
                break;
            default:
                this.render();
                break;
        }
    }

    // Property getters/setters
    get layout() {
        return this.getAttr('layout', 'horizontal');
    }
    
    set layout(value) {
        this.setAttr('layout', value);
    }
    
    get variant() {
        return this.getAttr('variant', 'default');
    }
    
    set variant(value) {
        this.setAttr('variant', value);
    }
    
    get position() {
        return this.getAttr('position', 'top');
    }
    
    set position(value) {
        this.setAttr('position', value);
    }

    render() {
        this.innerHTML = '';
        this.classList.add(this.config.classes.base);
        this.setAttribute('role', 'navigation');
        
        // Apply layout class
        if (this.config.classes.layouts[this.layout]) {
            this.classList.add(this.config.classes.layouts[this.layout]);
        }
        
        // Apply variant class
        if (this.variant !== 'default' && this.config.classes.variants[this.variant]) {
            this.classList.add(this.config.classes.variants[this.variant]);
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = this.config.classes.container;
        
        // Create brand if provided
        const brandText = this.getAttribute('brand-text');
        const brandHref = this.getAttribute('brand-href');
        if (brandText) {
            const brand = document.createElement('a');
            brand.className = this.config.classes.brand;
            brand.href = brandHref || '#';
            brand.textContent = brandText;
            container.appendChild(brand);
        }
        
        // Parse items from attribute or children
        const itemsData = this.getAttribute('items');
        if (itemsData) {
            try {
                this.items = JSON.parse(itemsData);
            } catch (e) {
                this.logError('Invalid items JSON', { error: e.message });
            }
        }
        
        // Create navigation list
        const navList = document.createElement('ul');
        navList.className = this.config.classes.list;
        
        this.items.forEach((item, index) => {
            const navItem = this.createNavItem(item, index);
            navList.appendChild(navItem);
        });
        
        container.appendChild(navList);
        
        // Create mobile toggle
        const responsive = this.getAttribute('responsive') !== 'false';
        if (responsive) {
            const toggle = this.createMobileToggle();
            container.appendChild(toggle);
        }
        
        this.appendChild(container);
    }

    createNavItem(item, index) {
        const navItem = document.createElement('li');
        navItem.className = this.config.classes.item;
        navItem.setAttribute('data-nav-index', index);
        
        if (item.id) {
            navItem.setAttribute('data-nav-id', item.id);
        }
        
        const navLink = document.createElement('a');
        navLink.className = this.config.classes.link;
        navLink.href = item.href || '#';
        navLink.textContent = item.text || item.label || '';
        
        if (item.title) navLink.title = item.title;
        if (item.target) navLink.target = item.target;
        
        if (item.active) {
            navItem.classList.add(this.config.classes.states.active);
            navLink.setAttribute('aria-current', 'page');
            this.activeItem = navItem;
        }
        
        if (item.disabled) {
            navItem.classList.add(this.config.classes.states.disabled);
            navLink.setAttribute('aria-disabled', 'true');
        }
        
        navItem.appendChild(navLink);
        return navItem;
    }

    createMobileToggle() {
        const toggle = document.createElement('button');
        toggle.className = this.config.classes.toggle;
        toggle.setAttribute('type', 'button');
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');
        
        const icon = document.createElement('span');
        icon.className = this.config.classes.toggleIcon;
        toggle.appendChild(icon);
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        return toggle;
    }

    setupEventListeners() {
        this.addEventListener('click', (e) => {
            const target = e.target;
            if (target instanceof Element && target.matches(`.${this.config.classes.link}`)) {
                const navItem = target.closest(`.${this.config.classes.item}`);
                const isDisabled = navItem?.classList.contains(this.config.classes.states.disabled);
                
                if (!isDisabled && navItem) {
                    this.setActiveItem(navItem);
                    
                    this.fireEvent('wb-nav:item-click', {
                        item: navItem,
                        link: target,
                        index: navItem.getAttribute('data-nav-index'),
                        id: navItem.getAttribute('data-nav-id'),
                        text: target.textContent
                    });
                    
                    this.logDebug('WBNav item clicked', { text: target.textContent });
                    
                    if (this.isExpanded) {
                        this.collapse();
                    }
                }
            }
        });
        
        this.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        document.addEventListener('click', (e) => {
            if (this.isExpanded && e.target instanceof Node && !this.contains(e.target)) {
                this.collapse();
            }
        });
    }

    handleKeyboardNavigation(e) {
        const links = this.querySelectorAll(`.${this.config.classes.link}:not([aria-disabled="true"])`);
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                links[(currentIndex + 1) % links.length]?.focus();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                links[(currentIndex - 1 + links.length) % links.length]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                links[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                links[links.length - 1]?.focus();
                break;
            case 'Escape':
                if (this.isExpanded) {
                    e.preventDefault();
                    this.collapse();
                }
                break;
        }
    }

    setActiveItem(navItem) {
        if (this.activeItem) {
            this.activeItem.classList.remove(this.config.classes.states.active);
            const currentLink = this.activeItem.querySelector(`.${this.config.classes.link}`);
            currentLink?.removeAttribute('aria-current');
        }
        
        if (navItem) {
            navItem.classList.add(this.config.classes.states.active);
            const newLink = navItem.querySelector(`.${this.config.classes.link}`);
            newLink?.setAttribute('aria-current', 'page');
            this.activeItem = navItem;
        }
    }

    toggle() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    expand() {
        this.classList.add(this.config.classes.states.expanded);
        this.isExpanded = true;
        const toggle = this.querySelector(`.${this.config.classes.toggle}`);
        toggle?.setAttribute('aria-expanded', 'true');
        
        this.fireEvent('wb-nav:expand', {});
        this.logDebug('WBNav expanded');
    }

    collapse() {
        this.classList.remove(this.config.classes.states.expanded);
        this.isExpanded = false;
        const toggle = this.querySelector(`.${this.config.classes.toggle}`);
        toggle?.setAttribute('aria-expanded', 'false');
        
        this.fireEvent('wb-nav:collapse', {});
        this.logDebug('WBNav collapsed');
    }

    // Public API
    setItems(items) {
        this.items = items;
        this.render();
    }

    addItem(item) {
        this.items.push(item);
        const navList = this.querySelector(`.${this.config.classes.list}`);
        if (navList) {
            const navItem = this.createNavItem(item, this.items.length - 1);
            navList.appendChild(navItem);
        }
    }

    removeItem(itemId) {
        const navItem = this.querySelector(`[data-nav-id="${itemId}"]`);
        if (navItem) {
            if (navItem === this.activeItem) this.activeItem = null;
            navItem.remove();
            this.items = this.items.filter(item => item.id !== itemId);
        }
    }
}

if (!customElements.get('wb-nav')) {
    customElements.define('wb-nav', WBNav);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-nav', WBNav, [], {
        version: '2.0.0',
        type: 'navigation',
        role: 'structural',
        description: 'Navigation component with horizontal, vertical, and dropdown layouts',
        api: {
            events: ['wb-nav:ready', 'wb-nav:item-click', 'wb-nav:expand', 'wb-nav:collapse'],
            attributes: ['layout', 'variant', 'position', 'items', 'brand-text', 'brand-href', 'responsive'],
            methods: ['setItems', 'addItem', 'removeItem', 'toggle', 'expand', 'collapse', 'render']
        },
        priority: 3
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBNav = WBNav;
window.WBNav = WBNav;

export { WBNav };
export default WBNav;
