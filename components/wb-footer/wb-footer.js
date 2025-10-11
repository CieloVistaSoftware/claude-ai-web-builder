// WB Footer Component - Pure Web Component
// Website Builder footer component with responsive layouts and positioning modes
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBFooter extends WBBaseComponent {
    constructor() {
        super();
        this.config = null;
        this._initialized = false;
        this.currentPosition = 'same-page';
        
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Footer: Web Component constructed', { 
                component: 'wb-footer', 
                method: 'constructor', 
                line: 11 
            });
        } else {
            console.log('🦶 WB Footer: Web Component constructed');
        }
    }
    
    static get observedAttributes() {
        return ['layout', 'positioning', 'show-logo', 'show-social', 'show-newsletter'];
    }
    
    async connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Footer: Connected to DOM', { 
                component: 'wb-footer', 
                method: 'connectedCallback', 
                line: 22 
            });
        } else {
            console.log('🦶 WB Footer: Connected to DOM');
        }
        
        try {
            await this.loadConfig();
            this.loadCSS();
            this.render();
            this.setupEventListeners();
            
            this.dispatchEvent(new CustomEvent('wbFooterReady', {
                bubbles: true,
                detail: { component: this, config: this.config }
            }));
            
            if (window.WBEventLog) {
                WBEventLog.logSuccess('WB Footer: Web Component initialized successfully', { 
                    component: 'wb-footer', 
                    method: 'connectedCallback', 
                    line: 35 
                });
            } else {
                console.log('🦶 WB Footer: Web Component initialized successfully');
            }
        } catch (error) {
            if (window.WBEventLog) {
                WBEventLog.logError('WB Footer: Initialization failed', { 
                    component: 'wb-footer', 
                    method: 'connectedCallback', 
                    line: 37, 
                    error: error.message, 
                    stack: error.stack 
                });
            } else {
                console.error('🦶 WB Footer: Initialization failed', error);
            }
        }
    }
    
    disconnectedCallback() {
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Footer: Disconnected from DOM', { 
                component: 'wb-footer', 
                method: 'disconnectedCallback', 
                line: 42 
            });
        } else {
            console.log('🦶 WB Footer: Disconnected from DOM');
        }
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'layout':
                this.setLayout(newValue);
                break;
            case 'positioning':
                this.setPosition(newValue);
                break;
            case 'show-logo':
            case 'show-social':
            case 'show-newsletter':
                this.render();
                break;
        }
    }
    
    async loadConfig() {
        try {
            const configPath = (window.WBComponentUtils ? 
                window.WBComponentUtils.getPath('wb-footer.js', '../components/wb-footer/') : 
                '../components/wb-footer/') + 'wb-footer.json';
            const response = await fetch(configPath);
            this.config = await response.json();
            if (window.WBEventLog) {
                WBEventLog.logSuccess('WB Footer: Configuration loaded', { 
                    component: 'wb-footer', 
                    method: 'loadConfig', 
                    line: 70, 
                    config: this.config 
                });
            } else {
                console.log('🦶 WB Footer: Configuration loaded', this.config);
            }
        } catch (error) {
            if (window.WBEventLog) {
                WBEventLog.logWarning('WB Footer: Could not load wb-footer.json, using defaults', { 
                    component: 'wb-footer', 
                    method: 'loadConfig', 
                    line: 72, 
                    error: error.message 
                });
            } else {
                console.warn('🦶 WB Footer: Could not load wb-footer.json, using defaults', error);
            }
            this.config = this.getDefaultConfig();
        }
    }
    
    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-footer.js', '../components/wb-footer/') + 'wb-footer.css';
            window.WBComponentUtils.loadCSS('wb-footer', cssPath);
        } else {
            const existingStyles = document.querySelector('link[href*="wb-footer.css"]');
            if (document.getElementById('wb-footer-styles') || existingStyles) {
                return;
            }
            
            const link = document.createElement('link');
            link.id = 'wb-footer-styles';
            link.rel = 'stylesheet';
            link.href = '../components/wb-footer/wb-footer.css';
            document.head.appendChild(link);
        }
    }
    
    getDefaultConfig() {
        return {
            classes: {
                base: 'wb-footer',
                container: 'wb-footer-container',
                top: 'wb-footer-top',
                bottom: 'wb-footer-bottom',
                section: 'wb-footer-section',
                navGroup: 'wb-footer-nav-group',
                navTitle: 'wb-footer-nav-title',
                navList: 'wb-footer-nav-list',
                navItem: 'wb-footer-nav-item',
                navLink: 'wb-footer-nav-link',
                logo: 'wb-footer-logo',
                socialList: 'wb-footer-social-list',
                socialLink: 'wb-footer-social-link',
                copyright: 'wb-footer-copyright',
                legal: 'wb-footer-legal',
                layouts: { 
                    simple: 'wb-footer--simple', 
                    standard: 'wb-footer--standard', 
                    complex: 'wb-footer--complex',
                    sticky: 'wb-footer--sticky'
                },
                positioning: {
                    'same-page': 'wb-footer--same-page',
                    'bottom': 'wb-footer--bottom',
                    'expanded': 'wb-footer--expanded'
                }
            },
            defaults: { 
                layout: 'standard', 
                theme: 'auto',
                positioning: 'same-page',
                reactsToFooterPosition: true,
                showLogo: true,
                showSocial: true,
                showNewsletter: false
            },
            events: { 
                ready: 'wbFooterReady', 
                positionChange: 'wbFooterPositionChange' 
            },
            content: {
                company: {
                    name: 'Website Builder',
                    description: 'Build professional websites with ease'
                },
                navigation: [
                    {
                        title: 'Products',
                        links: [
                            { text: 'Components', href: window.WBComponentUtils?.resolve('site.components') || '/components' },
                            { text: 'Templates', href: window.WBComponentUtils?.resolve('site.templates') || '/templates' }
                        ]
                    },
                    {
                        title: 'Support',
                        links: [
                            { text: 'Documentation', href: window.WBComponentUtils?.resolve('site.docs') || '/docs' },
                            { text: 'Contact', href: window.WBComponentUtils?.resolve('site.contact') || '/contact' }
                        ]
                    }
                ],
                social: [
                    { platform: 'GitHub', url: 'https://github.com/websitebuilder', label: 'Follow us on GitHub' },
                    { platform: 'Twitter', url: 'https://twitter.com/websitebuilder', label: 'Follow us on Twitter' }
                ],
                newsletter: {
                    title: 'Stay Updated',
                    description: 'Get the latest updates delivered to your inbox.',
                    placeholder: 'Enter your email',
                    buttonText: 'Subscribe'
                },
                legal: [
                    { text: 'Privacy Policy', href: window.WBComponentUtils?.resolve('site.privacy') || '/privacy' },
                    { text: 'Terms of Service', href: window.WBComponentUtils?.resolve('site.terms') || '/terms' }
                ],
                copyright: '© 2024 Website Builder. All rights reserved.'
            }
        };
    }
    
    render() {
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Footer: Rendering footer', { 
                component: 'wb-footer', 
                method: 'render', 
                line: 179 
            });
        } else {
            console.log('🦶 WB Footer: Rendering footer');
        }
        
        this.className = this.config.classes.base;
        this.setAttribute('role', 'contentinfo');
        this.setAttribute('aria-label', 'Site footer');
        
        // Apply layout class
        const layout = this.getAttribute('layout') || this.config.defaults.layout;
        if (layout && this.config.classes.layouts[layout]) {
            this.classList.add(this.config.classes.layouts[layout]);
        }
        
        // Apply positioning class
        const positioning = this.getAttribute('positioning') || this.config.defaults.positioning;
        if (positioning && this.config.classes.positioning[positioning]) {
            this.classList.add(this.config.classes.positioning[positioning]);
            this.currentPosition = positioning;
        }
        
        // Clear existing content
        this.innerHTML = '';
        
        // Create container
        const container = document.createElement('div');
        container.className = this.config.classes.container;
        
        // Build footer content based on layout
        this.buildFooterContent(container, layout);
        
        this.appendChild(container);
    }
    
    buildFooterContent(container, layout) {
        switch (layout) {
            case 'simple':
                this.buildSimpleLayout(container);
                break;
            case 'standard':
                this.buildStandardLayout(container);
                break;
            case 'complex':
                this.buildComplexLayout(container);
                break;
            case 'sticky':
                this.buildStickyLayout(container);
                break;
            default:
                this.buildStandardLayout(container);
        }
    }
    
    buildSimpleLayout(container) {
        const copyright = this.createCopyrightSection();
        container.appendChild(copyright);
    }
    
    buildStandardLayout(container) {
        const top = document.createElement('div');
        top.className = this.config.classes.top;
        
        if (this.config.content.navigation) {
            this.config.content.navigation.forEach(group => {
                const navGroup = this.createNavGroup(group);
                top.appendChild(navGroup);
            });
        }
        
        const bottom = document.createElement('div');
        bottom.className = this.config.classes.bottom;
        
        const copyright = this.createCopyrightSection();
        bottom.appendChild(copyright);
        
        container.appendChild(top);
        container.appendChild(bottom);
    }
    
    buildComplexLayout(container) {
        const top = document.createElement('div');
        top.className = this.config.classes.top;
        
        if (this.config.content.company) {
            const companySection = this.createCompanySection();
            top.appendChild(companySection);
        }
        
        if (this.config.content.navigation) {
            this.config.content.navigation.forEach(group => {
                const navGroup = this.createNavGroup(group);
                top.appendChild(navGroup);
            });
        }
        
        if (this.config.content.social && this.shouldShow('social')) {
            const socialSection = this.createSocialSection();
            top.appendChild(socialSection);
        }
        
        if (this.config.content.newsletter && this.shouldShow('newsletter')) {
            const newsletterSection = this.createNewsletterSection();
            top.appendChild(newsletterSection);
        }
        
        const bottom = document.createElement('div');
        bottom.className = this.config.classes.bottom;
        
        const copyright = this.createCopyrightSection();
        const legal = this.createLegalSection();
        
        bottom.appendChild(copyright);
        bottom.appendChild(legal);
        
        container.appendChild(top);
        container.appendChild(bottom);
    }
    
    buildStickyLayout(container) {
        const essentialLinks = this.createEssentialLinksSection();
        const copyright = this.createCopyrightSection();
        
        container.appendChild(essentialLinks);
        container.appendChild(copyright);
    }
    
    shouldShow(feature) {
        const attr = this.getAttribute(`show-${feature}`);
        if (attr !== null) {
            return attr !== 'false';
        }
        return this.config.defaults[`show${feature.charAt(0).toUpperCase() + feature.slice(1)}`];
    }
    
    createCompanySection() {
        const section = document.createElement('div');
        section.className = this.config.classes.section + ' wb-footer-company';
        
        if (this.config.content.company.logo && this.shouldShow('logo')) {
            const logo = document.createElement('img');
            logo.src = this.config.content.company.logo.src;
            logo.alt = this.config.content.company.logo.alt;
            logo.className = this.config.classes.logo;
            section.appendChild(logo);
        }
        
        if (this.config.content.company.name) {
            const name = document.createElement('h3');
            name.textContent = this.config.content.company.name;
            section.appendChild(name);
        }
        
        if (this.config.content.company.description) {
            const desc = document.createElement('p');
            desc.textContent = this.config.content.company.description;
            section.appendChild(desc);
        }
        
        return section;
    }
    
    createNavGroup(group) {
        const navGroup = document.createElement('div');
        navGroup.className = this.config.classes.navGroup;
        
        const title = document.createElement('h4');
        title.className = this.config.classes.navTitle;
        title.textContent = group.title;
        navGroup.appendChild(title);
        
        const list = document.createElement('ul');
        list.className = this.config.classes.navList;
        
        group.links.forEach(link => {
            const item = document.createElement('li');
            item.className = this.config.classes.navItem;
            
            const anchor = document.createElement('a');
            anchor.className = this.config.classes.navLink;
            anchor.href = link.href;
            anchor.textContent = link.text;
            
            if (link.description) {
                anchor.title = link.description;
            }
            
            item.appendChild(anchor);
            list.appendChild(item);
        });
        
        navGroup.appendChild(list);
        return navGroup;
    }
    
    createSocialSection() {
        const section = document.createElement('div');
        section.className = this.config.classes.section + ' wb-footer-social-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Follow Us';
        section.appendChild(title);
        
        const socialList = document.createElement('ul');
        socialList.className = this.config.classes.socialList;
        
        this.config.content.social.forEach(social => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = social.url;
            link.className = this.config.classes.socialLink;
            link.setAttribute('aria-label', social.label);
            link.textContent = social.platform;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            item.appendChild(link);
            socialList.appendChild(item);
        });
        
        section.appendChild(socialList);
        return section;
    }
    
    createNewsletterSection() {
        const section = document.createElement('div');
        section.className = this.config.classes.section + ' wb-footer-newsletter';
        
        const title = document.createElement('h4');
        title.textContent = this.config.content.newsletter.title;
        section.appendChild(title);
        
        const desc = document.createElement('p');
        desc.textContent = this.config.content.newsletter.description;
        section.appendChild(desc);
        
        const form = document.createElement('form');
        form.className = 'wb-footer-newsletter-form';
        
        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = this.config.content.newsletter.placeholder;
        input.required = true;
        
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = this.config.content.newsletter.buttonText;
        
        form.appendChild(input);
        form.appendChild(button);
        section.appendChild(form);
        
        return section;
    }
    
    createCopyrightSection() {
        const copyright = document.createElement('div');
        copyright.className = this.config.classes.copyright;
        copyright.textContent = this.config.content.copyright || '© 2024 Website Builder';
        return copyright;
    }
    
    createLegalSection() {
        if (!this.config.content.legal || this.config.content.legal.length === 0) {
            return document.createElement('div');
        }
        
        const legal = document.createElement('div');
        legal.className = this.config.classes.legal;
        
        const list = document.createElement('ul');
        
        this.config.content.legal.forEach(link => {
            const item = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = link.href;
            anchor.textContent = link.text;
            item.appendChild(anchor);
            list.appendChild(item);
        });
        
        legal.appendChild(list);
        return legal;
    }
    
    createEssentialLinksSection() {
        const section = document.createElement('div');
        section.className = this.config.classes.section + ' wb-footer-essential';
        
        const list = document.createElement('ul');
        list.className = this.config.classes.navList;
        
        const essentialLinks = [
            { text: 'Home', href: '/' },
            { text: 'Contact', href: window.WBComponentUtils?.resolve('site.contact') || '/contact' },
            { text: 'Privacy', href: window.WBComponentUtils?.resolve('site.privacy') || '/privacy' }
        ];
        
        essentialLinks.forEach(link => {
            const item = document.createElement('li');
            item.className = this.config.classes.navItem;
            
            const anchor = document.createElement('a');
            anchor.className = this.config.classes.navLink;
            anchor.href = link.href;
            anchor.textContent = link.text;
            
            item.appendChild(anchor);
            list.appendChild(item);
        });
        
        section.appendChild(list);
        return section;
    }
    
    setupEventListeners() {
        // Listen for footer position changes from control panel
        document.addEventListener('footerPositionChanged', (e) => {
            this.handleFooterPositionChange(e.detail);
        });
        
        // Monitor body data-footer attribute changes
        this.observeBodyAttributes();
        
        // Handle newsletter form submission
        this.addEventListener('submit', (e) => {
            const newsletterForm = e.target.closest('.wb-footer-newsletter-form');
            if (newsletterForm) {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            }
        });
        
        // Handle link clicks for analytics
        this.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.handleLinkClick(e);
            }
        });
    }
    
    observeBodyAttributes() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-footer') {
                    const newPosition = document.body.getAttribute('data-footer') || 'same-page';
                    this.handleFooterPositionChange({ position: newPosition });
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-footer']
        });
    }
    
    handleFooterPositionChange(detail) {
        const newPosition = detail.position || detail;
        
        if (newPosition === this.currentPosition) return;
        
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Footer: Position changing', { 
                component: 'wb-footer', 
                method: 'handleFooterPositionChange', 
                line: 538, 
                oldPosition: this.currentPosition, 
                newPosition: newPosition 
            });
        } else {
            console.log('🦶 WB Footer: Position changing from', this.currentPosition, 'to', newPosition);
        }
        
        // Remove old positioning class
        Object.values(this.config.classes.positioning).forEach(className => {
            this.classList.remove(className);
        });
        
        // Add new positioning class
        if (this.config.classes.positioning[newPosition]) {
            this.classList.add(this.config.classes.positioning[newPosition]);
        }
        
        this.currentPosition = newPosition;
        
        // Dispatch position change event
        const event = new CustomEvent(this.config.events.positionChange, {
            detail: { 
                footer: this, 
                oldPosition: this.currentPosition,
                newPosition: newPosition 
            }
        });
        this.dispatchEvent(event);
    }
    
    handleNewsletterSubmit(event) {
        const form = event.target.closest('.wb-footer-newsletter-form');
        const email = form.querySelector('input[type="email"]').value;
        
        if (window.WBEventLog) {
            WBEventLog.logUser('WB Footer: Newsletter subscription', { 
                component: 'wb-footer', 
                method: 'handleNewsletterSubmit', 
                line: 567, 
                email: email 
            });
        } else {
            console.log('🦶 WB Footer: Newsletter subscription:', email);
        }
        
        this.dispatchEvent(new CustomEvent('wbFooterNewsletterSubmit', {
            bubbles: true,
            detail: { email: email, form: form }
        }));
        
        // Show success message
        const button = form.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Subscribed!';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            form.reset();
        }, 2000);
    }
    
    handleLinkClick(event) {
        const link = event.target;
        const href = link.getAttribute('href');
        const text = link.textContent;
        
        this.dispatchEvent(new CustomEvent('wbFooterLinkClick', {
            bubbles: true,
            detail: { 
                href: href, 
                text: text, 
                link: link,
                type: this.getLinkType(link)
            }
        }));
    }
    
    getLinkType(link) {
        if (link.closest('.wb-footer-social-section')) return 'social';
        if (link.closest('.wb-footer-legal')) return 'legal';
        if (link.closest('.wb-footer-navigation')) return 'navigation';
        if (link.closest('.wb-footer-company')) return 'company';
        return 'other';
    }
    
    // Public API methods
    setLayout(layoutName) {
        if (!layoutName || !this.config.classes.layouts[layoutName]) return;
        
        // Remove existing layout classes
        Object.values(this.config.classes.layouts).forEach(className => {
            this.classList.remove(className);
        });
        
        // Add new layout class
        this.classList.add(this.config.classes.layouts[layoutName]);
        
        // Re-render with new layout
        this.render();
    }
    
    setPosition(position) {
        this.handleFooterPositionChange({ position });
    }
    
    updateContent(newContent) {
        this.config.content = { ...this.config.content, ...newContent };
        this.render();
    }
}

// Register the Web Component
customElements.define('wb-footer', WBFooter);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-footer', WBFooter, ['wb-event-log'], {
        version: '1.0.0',
        type: 'layout',
        role: 'structural',
        description: 'Footer component with support for links, social media, and multiple layout configurations',
        api: {
            static: ['create'],
            events: ['footer-link-clicked'],
            attributes: ['layout', 'theme', 'social-links', 'copyright'],
            methods: ['render', 'setSocialLinks', 'setCopyright', 'addLink']
        },
        priority: 3 // Structural component depends on infrastructure
    });
}

if (window.WBEventLog) {
    WBEventLog.logSuccess('WB Footer: Pure Web Component registered', { 
        component: 'wb-footer', 
        method: 'componentRegistration', 
        line: 657 
    });
} else {
    console.log('🦶 WB Footer: Pure Web Component registered');
}