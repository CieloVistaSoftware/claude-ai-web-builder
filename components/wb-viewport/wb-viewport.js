// WB Viewport Component
// Viewport simulator for testing responsive designs


// WB Viewport Component as a Custom Element
'use strict';

let config = null;
let currentViewport = 'auto';
let controlsVisible = false;

async function loadConfig() {
    try {
        const configPath = (window.WBComponentUtils ? 
            window.WBComponentUtils.getPath('wb-viewport.js', '../components/wb-viewport/') : 
            '../components/wb-viewport/') + 'wb-viewport.schema.json';
        const response = await fetch(configPath);
        config = await response.json();
        console.log('📱 WB Viewport: Configuration loaded', config);
        return config;
    } catch (error) {
        console.warn('📱 WB Viewport: Could not load wb-viewport.schema.json, using defaults', error);
        config = {
            configuration: {
                viewports: {
                    mobile: { width: 400, name: 'Mobile', icon: '📱', color: '#6366f1' },
                    tablet: { width: 768, name: 'Tablet', icon: '📟', color: '#10b981' },
                    desktop: { width: 1200, name: 'Desktop', icon: '🖥️', color: '#6366f1' }
                },
                defaultViewport: 'auto',
                showControls: true
            },
            classes: {
                controls: 'wb-viewport-controls',
                controlsButton: 'wb-viewport-btn',
                status: 'wb-viewport-status',
                states: {
                    active: 'wb-viewport--active',
                    mobile: 'wb-viewport--mobile',
                    tablet: 'wb-viewport--tablet',
                    desktop: 'wb-viewport--desktop'
                }
            },
            events: {
                ready: 'wbViewportReady',
                change: 'wbViewportChange',
                reset: 'wbViewportReset'
            }
        };
        return config;
    }
}

function loadViewportCSS() {
    if (window.WBComponentUtils) {
        const cssPath = window.WBComponentUtils.getPath('wb-viewport.js', '../components/wb-viewport/') + 'wb-viewport.css';
        window.WBComponentUtils.loadCSS('wb-viewport', cssPath);
    } else {
        const existingStyles = document.querySelector('link[href*="wb-viewport.css"]');
        if (document.getElementById('wb-viewport-styles') || existingStyles) {
            console.log('📱 WB Viewport: CSS already loaded, skipping');
            return;
        }
        const link = document.createElement('link');
        link.id = 'wb-viewport-styles';
        link.rel = 'stylesheet';
        link.href = '../components/wb-viewport/wb-viewport.css';
        document.head.appendChild(link);
    }
}

function createControls() {
    if (!config || document.querySelector(`.${config.classes.controls}`)) {
        return;
    }
    const controls = document.createElement('div');
    controls.className = config.classes.controls;
    controls.classList.add('wb-viewport-controls--visible');
    Object.entries(config.configuration.viewports).forEach(([key, viewport]) => {
        const button = document.createElement('button');
        button.className = config.classes.controlsButton;
        button.classList.add(`wb-viewport-btn--${key}`);
        button.innerHTML = `${viewport.icon} ${viewport.name}`;
        button.onclick = () => window.WBViewport.setViewport(key);
        button.dataset.viewport = key;
        controls.appendChild(button);
    });
    const autoButton = document.createElement('button');
    autoButton.className = config.classes.controlsButton;
    autoButton.innerHTML = '🔄 Auto';
    autoButton.onclick = () => window.WBViewport.reset();
    autoButton.dataset.viewport = 'auto';
    controls.appendChild(autoButton);
    const status = document.createElement('div');
    status.className = config.classes.status;
    status.id = 'wb-viewport-status';
    status.textContent = 'Viewport: Auto';
    controls.appendChild(status);
    document.body.insertBefore(controls, document.body.firstChild);
    document.body.classList.add('wb-viewport-active');
    controlsVisible = true;
    updateActiveButton('auto');
}

function updateActiveButton(viewport) {
    const buttons = document.querySelectorAll(`.${config.classes.controlsButton}`);
    buttons.forEach(btn => {
        if (btn.dataset.viewport === viewport) {
            btn.classList.add('wb-viewport-btn--active');
        } else {
            btn.classList.remove('wb-viewport-btn--active');
        }
    });
}

function setViewport(viewport) {
    if (!config) return;
    Object.keys(config.classes.states).forEach(state => {
        if (state !== 'active') {
            document.body.classList.remove(config.classes.states[state]);
        }
    });
    const status = document.getElementById('wb-viewport-status');
    if (viewport === 'auto') {
        currentViewport = 'auto';
        if (status) status.textContent = 'Viewport: Auto (full width)';
    } else if (config.configuration.viewports[viewport]) {
        const vp = config.configuration.viewports[viewport];
        document.body.classList.add(config.classes.states[viewport]);
        currentViewport = viewport;
        if (status) status.textContent = `Viewport: ${vp.icon} ${vp.name} (${vp.width}px)`;
    }
    updateActiveButton(viewport);
    const event = new CustomEvent(config.events.change, {
        detail: {
            viewport: viewport,
            width: viewport === 'auto' ? 'auto' : config.configuration.viewports[viewport]?.width
        }
    });
    document.dispatchEvent(event);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!controlsVisible || !e.altKey) return;
        switch(e.key) {
            case '1':
                e.preventDefault();
                window.WBViewport.setViewport('mobile');
                break;
            case '2':
                e.preventDefault();
                window.WBViewport.setViewport('tablet');
                break;
            case '3':
                e.preventDefault();
                window.WBViewport.setViewport('desktop');
                break;
            case '4':
                e.preventDefault();
                window.WBViewport.setViewport('wide');
                break;
            case '0':
                e.preventDefault();
                window.WBViewport.reset();
                break;
        }
    });
}

window.WBViewport = {
    init: function(options = {}) {
        if (!config) {
            console.warn('WB Viewport: Configuration not loaded yet');
            return;
        }
        if (options.showControls !== undefined) {
            config.configuration.showControls = options.showControls;
        }
        if (config && config.configuration && config.configuration.showControls) {
            createControls();
            setupKeyboardShortcuts();
        }
        if (options.defaultViewport) {
            this.setViewport(options.defaultViewport);
        } else if (config.configuration.defaultViewport && config.configuration.defaultViewport !== 'auto') {
            this.setViewport(config.configuration.defaultViewport);
        }
    },
    setViewport: function(viewport) {
        setViewport(viewport);
    },
    getViewport: function() {
        return currentViewport;
    },
    reset: function() {
        setViewport('auto');
    },
    addCustomViewport: function(name, width, options = {}) {
        if (!config) return false;
        config.configuration.viewports[name] = {
            width: width,
            name: options.name || name,
            icon: options.icon || '📐',
            color: options.color || '#6366f1',
            description: options.description || `Custom ${width}px viewport`
        };
        if (controlsVisible) {
            const controls = document.querySelector(`.${config.classes.controls}`);
            if (controls) controls.remove();
            createControls();
        }
        return true;
    },
    getConfig: function() {
        return config;
    }
};

// Define the custom element
class WBViewportElement extends HTMLElement {
    async connectedCallback() {
        await loadConfig();
        loadViewportCSS();
        setTimeout(() => {
            console.log('📱 WB Viewport: Component initialized successfully');
            const eventName = config?.events?.ready || 'wbViewportReady';
            const event = new CustomEvent(eventName, {
                detail: { component: 'wb-viewport', config: config }
            });
            document.dispatchEvent(event);
            if (config && config.configuration && config.configuration.showControls) {
                window.WBViewport.init();
            }
        }, 100);
    }
}

if (!window.customElements.get('wb-viewport')) {
    window.customElements.define('wb-viewport', WBViewportElement);
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBViewport = window.WBViewport;
window.WB.components.WBViewportElement = WBViewportElement;

// ES6 Module Exports
export { WBViewportElement };
export default WBViewportElement;