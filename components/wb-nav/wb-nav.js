// WB Nav Web Component
// A fully-featured navigation menu component with responsive layouts

if (typeof WBNav === 'undefined') {
class WBNav extends HTMLElement {
    constructor() {
        super();
        this.config = null;
        this.items = [];
        this.activeItem = null;
        this.isExpanded = false;
        this._initialized = false;
    }

    async connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        // Load configuration
        await this.loadConfig();
        
        // Load CSS if needed
        this.loadCSS();
        
        // Initialize navigation
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('wbNavReady', { 
            bubbles: true,
            detail: { component: this, config: this.config }
        }));
        
        // Dispatch wb: event for wb-event-log
        document.dispatchEvent(new CustomEvent('wb:info', {
            detail: {
                message: 'WB Nav: Component initialized and ready',
                source: 'wb-nav',
                component: 'navigation'
            }
        }));
    }

    getDefaultConfig() {
        return {
            classes: {
                base: 'wb-nav',
                container: 'wb-nav-container',
                list: 'wb-nav-list',
                item: 'wb-nav-item',
                link: 'wb-nav-link',
                brand: 'wb-nav-brand',
                toggle: 'wb-nav-toggle',
                toggleIcon: 'wb-nav-toggle-icon',
                states: {
                    active: 'active',
                    disabled: 'disabled',
                    expanded: 'expanded'
                },
                layouts: {
                    horizontal: 'wb-nav--horizontal',
                    vertical: 'wb-nav--vertical',
                    top: 'wb-nav--top',
                    left: 'wb-nav--left',
                    right: 'wb-nav--right'
                },
                variants: {
                    default: 'wb-nav--default',
                    minimal: 'wb-nav--minimal',
                    pills: 'wb-nav--pills'
                }
            },
            responsive: {
                breakpoint: 768,
                collapseOnMobile: true
            },
            defaults: {
                layout: 'horizontal',
                position: 'top',
                theme: 'default'
            }
        };
    }

    async loadConfig() {
        try {
            // Use component utils to get correct path
            let configPath = './wb-nav.schema.json';
            if (window.WBComponentUtils && typeof window.WBComponentUtils.getPath === 'function') {
                try {
                    const basePath = window.WBComponentUtils.getPath('wb-nav.js', '../components/wb-nav/');
                    configPath = basePath + 'wb-nav.schema.json';
                } catch (e) {
                    console.warn('🧭 WB Nav: Could not use WBComponentUtils for schema path, using relative path');
                }
            }
            
            const response = await fetch(configPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            this.config = await response.json();
            console.log('🧭 WB Nav: Configuration loaded', this.config);
        } catch (error) {
            console.warn('🧭 WB Nav: Could not load wb-nav.schema.json, using defaults', error);
            this.config = this.getDefaultConfig();
        }
    }

    loadCSS() {
        if (window.WBComponentUtils && typeof window.WBComponentUtils.getPath === 'function') {
            try {
                const cssPath = window.WBComponentUtils.getPath('wb-nav.js', '../components/wb-nav/') + 'wb-nav.css';
                window.WBComponentUtils.loadCSS('wb-nav', cssPath);
                return;
            } catch (e) {
                console.warn('WB Nav: Could not use WBComponentUtils, using fallback');
            }
        }
        
        // Fallback for when WBComponentUtils is not available
        const existingStyles = document.querySelector('link[href*="wb-nav.css"]');
        if (document.getElementById('wb-nav-styles') || existingStyles) {
            return;
        }
        
        const link = document.createElement('link');
        link.id = 'wb-nav-styles';
        link.rel = 'stylesheet';
        link.href = '../components/wb-nav/wb-nav.css';
        document.head.appendChild(link);
    }

    render() {
        // Ensure config is loaded before rendering
        if (!this.config || !this.config.classes) {
            console.warn('🧭 WB Nav: Config not loaded yet, using defaults for render');
            this.config = this.getDefaultConfig();
        }
        
        // Clear existing content
        this.innerHTML = '';
        
        // Apply base class (with safety check)
        const baseClass = this.config?.classes?.base;
        if (baseClass) {
            this.classList.add(baseClass);
        }
        this.setAttribute('role', 'navigation');
        this.setAttribute('aria-label', this.getAttribute('aria-label') || 'Main navigation');
        
        // Apply layout classes
        const layout = this.getAttribute('layout') || this.config?.defaults?.layout || 'horizontal';
        if (layout && this.config?.classes?.layouts?.[layout]) {
            this.classList.add(this.config.classes.layouts[layout]);
        }
        
        // Apply variant classes
        const variant = this.getAttribute('variant') || this.config?.defaults?.variant;
        if (variant && variant !== 'default' && this.config?.classes?.variants?.[variant]) {
            this.classList.add(this.config.classes.variants[variant]);
        }
        
        // Apply position classes
        const position = this.getAttribute('position');
        if (position && this.config?.classes?.layouts?.[position]) {
            this.classList.add(this.config.classes.layouts[position]);
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = this.config?.classes?.container || 'wb-nav-container';
        
        // Create brand if provided
        const brandText = this.getAttribute('brand-text');
        const brandHref = this.getAttribute('brand-href');
        if (brandText) {
            const brand = document.createElement('a');
            brand.className = this.config?.classes?.brand || 'wb-nav-brand';
            brand.href = brandHref || '#';
            brand.textContent = brandText;
            container.appendChild(brand);
        }
        
        // Create navigation list
        const navList = document.createElement('ul');
        navList.className = this.config?.classes?.list || 'wb-nav-list';
        
        // Get items from attribute or use default
        const itemsData = this.getAttribute('items');
        if (itemsData) {
            try {
                this.items = JSON.parse(itemsData);
            } catch (e) {
                console.error('Invalid items JSON:', e);
            }
        }
        
        // Create navigation items
        this.items.forEach((item, index) => {
            const navItem = this.createNavItem(item, index);
            navList.appendChild(navItem);
        });
        
        container.appendChild(navList);
        
        // Create mobile toggle if responsive
        const responsive = this.getAttribute('responsive') !== 'false';
        if (responsive) {
            const toggle = this.createMobileToggle();
            container.appendChild(toggle);
        }
        
        this.appendChild(container);
    }

    createNavItem(item, index) {
        const navItem = document.createElement('li');
        navItem.className = this.config?.classes?.item || 'wb-nav-item';
        navItem.setAttribute('data-nav-index', index);
        
        if (item.id) {
            navItem.setAttribute('data-nav-id', item.id);
        }
        
        const navLink = document.createElement('a');
        navLink.className = this.config?.classes?.link || 'wb-nav-link';
        navLink.href = item.href || '#';
        navLink.textContent = item.text;
        
        if (item.title) {
            navLink.title = item.title;
        }
        
        if (item.target) {
            navLink.target = item.target;
        }
        
        // Set active state
        if (item.active) {
            navItem.classList.add(this.config.classes.states.active);
            navLink.setAttribute('aria-current', 'page');
            this.activeItem = navItem;
        }
        
        // Set disabled state
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
        icon.setAttribute('aria-hidden', 'true');
        
        toggle.appendChild(icon);
        
        // Toggle click handler
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        return toggle;
    }

    setupEventListeners() {
        // Navigation item clicks
        this.addEventListener('click', (e) => {
            if (e.target.matches(`.${this.config.classes.link}`)) {
                const navItem = e.target.closest(`.${this.config.classes.item}`);
                const isDisabled = navItem.classList.contains(this.config.classes.states.disabled);
                
                if (!isDisabled) {
                    this.setActiveItem(navItem);
                    
                    // Dispatch item click event
                    const event = new CustomEvent('wbNavItemClick', {
                        bubbles: true,
                        detail: {
                            item: navItem,
                            link: e.target,
                            index: navItem.getAttribute('data-nav-index'),
                            id: navItem.getAttribute('data-nav-id'),
                            nav: this,
                            event: e
                        }
                    });
                    document.dispatchEvent(event);
                    
                    // Dispatch wb: event for wb-event-log
                    document.dispatchEvent(new CustomEvent('wb:info', {
                        detail: {
                            message: `Nav clicked: "${e.target.textContent}" (${e.target.href || 'no href'})`,
                            source: 'wb-nav',
                            component: 'navigation',
                            action: 'click',
                            target: e.target.textContent
                        }
                    }));
                    
                    // Close mobile menu after click
                    if (this.isExpanded) {
                        this.collapse();
                    }
                }
            }
        });
        
        // Keyboard navigation
        this.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isExpanded && !this.contains(e.target)) {
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
                const nextIndex = (currentIndex + 1) % links.length;
                links[nextIndex].focus();
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + links.length) % links.length;
                links[prevIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                links[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                links[links.length - 1].focus();
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
        // Remove active state from current item
        if (this.activeItem) {
            this.activeItem.classList.remove(this.config.classes.states.active);
            const currentLink = this.activeItem.querySelector(`.${this.config.classes.link}`);
            if (currentLink) {
                currentLink.removeAttribute('aria-current');
            }
        }
        
        // Set new active item
        if (navItem) {
            navItem.classList.add(this.config.classes.states.active);
            const newLink = navItem.querySelector(`.${this.config.classes.link}`);
            if (newLink) {
                newLink.setAttribute('aria-current', 'page');
            }
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
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    collapse() {
        this.classList.remove(this.config.classes.states.expanded);
        this.isExpanded = false;
        
        const toggle = this.querySelector(`.${this.config.classes.toggle}`);
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Public API methods
    setLayout(layoutName) {
        if (!this.config) {
            console.warn('🧭 WB Nav: Config not loaded in setLayout');
            this.config = this.getDefaultConfig();
        }
        
        const layoutConfig = this.config.classes?.layouts?.[layoutName];
        if (!layoutConfig) return;
        
        // Remove existing layout classes (with safety check)
        const layoutClasses = this.config?.classes?.layouts;
        if (layoutClasses) {
            Object.values(layoutClasses).forEach(className => {
                this.classList.remove(className);
            });
        }
        
        // Apply new layout classes
        if (layoutConfig.layout && this.config?.classes?.layouts?.[layoutConfig.layout]) {
            this.classList.add(this.config.classes.layouts[layoutConfig.layout]);
        }
        
        if (layoutConfig.position && this.config.classes.layouts[layoutConfig.position]) {
            this.classList.add(this.config.classes.layouts[layoutConfig.position]);
        }
        
        this.setAttribute('layout', layoutName);
    }

    setItems(items) {
        this.items = items;
        this.render();
    }

    addItem(item) {
        this.items.push(item);
        const navList = this.querySelector(`.${this.config.classes.list}`);
        if (navList) {
            const index = this.items.length - 1;
            const navItem = this.createNavItem(item, index);
            navList.appendChild(navItem);
        }
    }

    removeItem(itemId) {
        const navItem = this.querySelector(`[data-nav-id="${itemId}"]`);
        if (navItem) {
            if (navItem === this.activeItem) {
                this.activeItem = null;
            }
            navItem.remove();
            this.items = this.items.filter(item => item.id !== itemId);
        }
    }

    // Observed attributes
    static get observedAttributes() {
        return ['layout', 'variant', 'position', 'items'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'layout':
                this.setLayout(newValue);
                break;
            case 'variant':
            case 'position':
                this.render();
                break;
            case 'items':
                try {
                    this.items = JSON.parse(newValue);
                    this.render();
                } catch (e) {
                    console.error('Invalid items JSON:', e);
                }
                break;
        }
    }
}
// Register the custom element
if (!customElements.get('wb-nav')) {
  customElements.define('wb-nav', WBNav);
}
// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-nav', WBNav, ['wb-event-log'], {
        version: '1.0.0',
        type: 'navigation',
        role: 'structural',
        description: 'Navigation component with support for horizontal, vertical, and dropdown layouts',
        api: {
            events: ['nav-item-clicked', 'nav-layout-changed'],
            attributes: ['items', 'layout', 'style-preset', 'mobile-breakpoint'],
            methods: ['render', 'setItems', 'setLayout', 'handleItemClick']
        },
        priority: 3 // Navigation component depends on logging
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBNav = WBNav;

// Expose globally (backward compatibility)
window.WBNav = WBNav;

} // <-- End of typeof WBNav === 'undefined' guard

console.log('✅ wb-nav loaded successfully');