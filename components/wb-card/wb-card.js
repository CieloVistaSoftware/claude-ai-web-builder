// WB Card Web Component
// Website Builder card component with flexible layouts and variants

class WBCard extends HTMLElement {
    constructor() {
        super();
        this.config = null;
        this.content = null;
        this.options = null;
        this._initialized = false;
    }

    async connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        // Load configuration
        await this.loadConfig();
        
        // Load CSS if needed
        this.loadCSS();
        
        // Initialize card
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('wbCardReady', { 
            bubbles: true,
            detail: { component: this, config: this.config }
        }));
        
        // Dispatch wb: event for wb-event-log
        document.dispatchEvent(new CustomEvent('wb:info', {
            detail: {
                message: 'WB Card: Component initialized and ready',
                source: 'wb-card',
                component: 'card'
            }
        }));
    }

    async loadConfig() {
        try {
            const configPath = (window.WBComponentUtils ? 
                window.WBComponentUtils.getPath('wb-card.js', '../components/wb-card/') : 
                '../components/wb-card/') + 'wb-card.json';
            const response = await fetch(configPath);
            this.config = await response.json();
            console.log('🃏 WB Card: Configuration loaded', this.config);
        } catch (error) {
            console.warn('🃏 WB Card: Could not load wb-card.json, using defaults', error);
            // Fallback configuration
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
                        default: '',
                        elevated: 'wb-card--elevated',
                        outlined: 'wb-card--outlined',
                        filled: 'wb-card--filled',
                        glass: 'wb-card--glass'
                    },
                    sizes: {
                        compact: 'wb-card--compact',
                        standard: 'wb-card--standard',
                        large: 'wb-card--large'
                    },
                    states: {
                        hover: 'wb-card--hover',
                        active: 'wb-card--active',
                        disabled: 'wb-card--disabled',
                        loading: 'wb-card--loading'
                    },
                    layouts: {
                        vertical: 'wb-card--vertical',
                        horizontal: 'wb-card--horizontal',
                        'media-top': 'wb-card--media-top',
                        'media-left': 'wb-card--media-left',
                        'media-right': 'wb-card--media-right'
                    }
                },
                defaults: {
                    variant: 'default',
                    size: 'standard',
                    layout: 'vertical',
                    clickable: false,
                    loading: false,
                    showHeader: true,
                    showFooter: false,
                    showActions: false
                },
                events: {
                    ready: 'wbCardReady',
                    click: 'wbCardClick',
                    mediaLoad: 'wbCardMediaLoad',
                    actionClick: 'wbCardActionClick'
                }
            };
        }
    }

    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-card.js', '../components/wb-card/') + 'wb-card.css';
            window.WBComponentUtils.loadCSS('wb-card', cssPath);
        } else {
            // Fallback for when WBComponentUtils is not available
            const existingStyles = document.querySelector('link[href*="wb-card.css"]');
            if (document.getElementById('wb-card-styles') || existingStyles) {
                return;
            }
            
            const link = document.createElement('link');
            link.id = 'wb-card-styles';
            link.rel = 'stylesheet';
            link.href = '../components/wb-card/wb-card.css';
            document.head.appendChild(link);
        }
    }

    render() {
        // Clear existing content
        this.innerHTML = '';
        
        // Apply base class
        this.classList.add(this.config.classes.base);
        
        // Parse content from attributes or use defaults
        this.parseContentFromAttributes();
        this.parseOptionsFromAttributes();
        
        // Apply variant classes
        const variant = this.options.variant || this.config.defaults.variant;
        if (variant && variant !== 'default' && this.config.classes.variants[variant]) {
            this.classList.add(this.config.classes.variants[variant]);
        }
        
        // Apply size classes
        const size = this.options.size || this.config.defaults.size;
        if (size && this.config.classes.sizes[size]) {
            this.classList.add(this.config.classes.sizes[size]);
        }
        
        // Apply layout classes
        const layout = this.options.layout || this.config.defaults.layout;
        if (layout && this.config.classes.layouts[layout]) {
            this.classList.add(this.config.classes.layouts[layout]);
        }
        
        // Apply state classes
        if (this.options.clickable) {
            this.classList.add('wb-card--clickable');
            this.setAttribute('tabindex', '0');
            this.setAttribute('role', 'button');
        }
        
        if (this.options.loading) {
            this.classList.add(this.config.classes.states.loading);
        }
        
        // Build card structure
        this.buildCardStructure();
    }

    parseContentFromAttributes() {
        this.content = {
            title: this.getAttribute('title') || '',
            subtitle: this.getAttribute('subtitle') || '',
            body: this.getAttribute('body') || this.innerHTML || '',
            media: this.parseMediaFromAttributes(),
            actions: this.parseActionsFromAttributes(),
            footer: this.getAttribute('footer') || ''
        };
    }

    parseMediaFromAttributes() {
        const mediaSrc = this.getAttribute('media-src');
        const mediaAlt = this.getAttribute('media-alt');
        const mediaType = this.getAttribute('media-type') || 'image';
        
        if (mediaSrc) {
            return {
                src: mediaSrc,
                alt: mediaAlt || '',
                type: mediaType
            };
        }
        return null;
    }

    parseActionsFromAttributes() {
        const actionsData = this.getAttribute('actions');
        if (actionsData) {
            try {
                return JSON.parse(actionsData);
            } catch (e) {
                console.error('Invalid actions JSON:', e);
            }
        }
        return [];
    }

    parseOptionsFromAttributes() {
        this.options = {
            variant: this.getAttribute('variant') || this.config.defaults.variant,
            size: this.getAttribute('size') || this.config.defaults.size,
            layout: this.getAttribute('layout') || this.config.defaults.layout,
            clickable: this.hasAttribute('clickable'),
            loading: this.hasAttribute('loading'),
            showHeader: this.getAttribute('show-header') !== 'false',
            showFooter: this.getAttribute('show-footer') === 'true',
            showActions: this.getAttribute('show-actions') === 'true'
        };
    }

    buildCardStructure() {
        // Create media element
        if (this.content.media) {
            this.appendChild(this.createMediaElement());
        }
        
        // Create header
        if (this.options.showHeader && (this.content.title || this.content.subtitle)) {
            this.appendChild(this.createHeaderElement());
        }
        
        // Create body
        if (this.content.body) {
            this.appendChild(this.createBodyElement());
        }
        
        // Create footer
        if (this.options.showFooter && this.content.footer) {
            this.appendChild(this.createFooterElement());
        }
    }

    createMediaElement() {
        const media = document.createElement('div');
        media.className = this.config.classes.media;
        
        if (this.content.media.type === 'image') {
            const img = document.createElement('img');
            img.className = this.config.classes.image;
            img.src = this.content.media.src;
            img.alt = this.content.media.alt;
            
            img.addEventListener('load', () => {
                this.dispatchEvent(new CustomEvent('wbCardMediaLoad', {
                    bubbles: true,
                    detail: { media: this.content.media, element: img }
                }));
            });
            
            media.appendChild(img);
        }
        
        return media;
    }

    createHeaderElement() {
        const header = document.createElement('div');
        header.className = this.config.classes.header;
        
        if (this.content.title) {
            const title = document.createElement('h3');
            title.className = this.config.classes.title;
            title.textContent = this.content.title;
            header.appendChild(title);
        }
        
        if (this.content.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = this.config.classes.subtitle;
            subtitle.textContent = this.content.subtitle;
            header.appendChild(subtitle);
        }
        
        return header;
    }

    createBodyElement() {
        const body = document.createElement('div');
        body.className = this.config.classes.body;
        
        const content = document.createElement('div');
        content.className = this.config.classes.content;
        
        if (typeof this.content.body === 'string') {
            content.innerHTML = this.content.body;
        } else {
            content.appendChild(this.content.body);
        }
        
        body.appendChild(content);
        
        // Add actions if enabled
        if (this.options.showActions && this.content.actions.length > 0) {
            body.appendChild(this.createActionsElement());
        }
        
        return body;
    }

    createActionsElement() {
        const actions = document.createElement('div');
        actions.className = this.config.classes.actions;
        
        this.content.actions.forEach((action, index) => {
            const button = document.createElement('wb-button');
            button.setAttribute('variant', action.variant || 'secondary');
            button.setAttribute('size', action.size || 'medium');
            button.textContent = action.text;
            
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                this.dispatchEvent(new CustomEvent('wbCardActionClick', {
                    bubbles: true,
                    detail: { 
                        action: action, 
                        index: index, 
                        button: button,
                        card: this
                    }
                }));
                
                if (action.onClick && typeof action.onClick === 'function') {
                    action.onClick(e);
                }
            });
            
            actions.appendChild(button);
        });
        
        return actions;
    }

    createFooterElement() {
        const footer = document.createElement('div');
        footer.className = this.config.classes.footer;
        footer.innerHTML = this.content.footer;
        return footer;
    }

    setupEventListeners() {
        // Handle clickable cards
        if (this.options.clickable) {
            this.addEventListener('click', (e) => {
                // Don't trigger if clicking on actions
                if (e.target.closest('.' + this.config.classes.actions)) {
                    return;
                }
                
                this.dispatchEvent(new CustomEvent('wbCardClick', {
                    bubbles: true,
                    detail: { 
                        card: this,
                        content: this.content,
                        options: this.options,
                        event: e
                    }
                }));
                
                // Dispatch wb: event for wb-event-log
                document.dispatchEvent(new CustomEvent('wb:user', {
                    detail: {
                        message: `Card clicked: "${this.content.title || 'Untitled Card'}"`,
                        source: 'wb-card',
                        component: 'card',
                        action: 'click'
                    }
                }));
            });
            
            this.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    }

    // Public API methods
    setContent(content) {
        this.content = { ...this.content, ...content };
        this.render();
    }

    setVariant(variant) {
        if (!this.config.classes.variants[variant]) return;
        
        // Remove existing variant classes
        Object.values(this.config.classes.variants).forEach(className => {
            if (className) this.classList.remove(className);
        });
        
        // Add new variant class
        if (variant !== 'default') {
            this.classList.add(this.config.classes.variants[variant]);
        }
        
        this.options.variant = variant;
    }

    setLayout(layout) {
        if (!this.config.classes.layouts[layout]) return;
        
        // Remove existing layout classes
        Object.values(this.config.classes.layouts).forEach(className => {
            this.classList.remove(className);
        });
        
        // Add new layout class
        this.classList.add(this.config.classes.layouts[layout]);
        this.options.layout = layout;
    }

    setLoading(loading) {
        if (loading) {
            this.classList.add(this.config.classes.states.loading);
        } else {
            this.classList.remove(this.config.classes.states.loading);
        }
        this.options.loading = loading;
    }

    // Observed attributes
    static get observedAttributes() {
        return ['title', 'subtitle', 'body', 'variant', 'size', 'layout', 'media-src', 'loading'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'title':
            case 'subtitle':
            case 'body':
            case 'media-src':
                this.render();
                break;
            case 'variant':
                this.setVariant(newValue);
                break;
            case 'layout':
                this.setLayout(newValue);
                break;
            case 'loading':
                this.setLoading(this.hasAttribute('loading'));
                break;
        }
    }
}

// Register the custom element
customElements.define('wb-card', WBCard);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-card', WBCard, ['wb-event-log'], {
        version: '1.0.0',
        type: 'layout',
        role: 'ui-element',
        description: 'Flexible card component with header, body, footer sections and various styling options',
        api: {
            static: ['create'],
            events: ['card-clicked', 'card-expanded', 'card-collapsed'],
            attributes: ['title', 'subtitle', 'image', 'variant', 'size', 'expandable'],
            methods: ['render', 'setTitle', 'setContent', 'expand', 'collapse']
        },
        priority: 4 // UI component depends on infrastructure
    });
}

console.log('🃏 WB Card: Web component registered');