// wb-control-panel.js
// Control Panel v4.1 - Fixed CSS path, touch support, gear icon
import { WBBaseComponent } from '../wb-base/wb-base.js';

// SVG Icons
const ICONS = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`,
    gear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>`,
    preview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>`,
    save: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>`,
    page: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
    </svg>`
};

class WBControlPanel extends WBBaseComponent {
    static backendAvailable = null;
    static backendCheckPromise = null;
    static backendCheckComplete = false;

    constructor() {
        super();
        this.state = {
            mode: 'dark',
            theme: 'indigo',
            themeCategory: 'named',
            harmonyMode: 'complementary',
            layout: 'top-nav',
            footerPosition: 'sticky',
            editMode: false,
            collapsed: false,
            scope: 'site',
            primaryHue: 240,
            primarySat: 70,
            primaryLight: 50,
            backgroundHue: 220,
            backgroundSat: 20,
            backgroundLight: 15,
            posX: null,
            posY: null,
            width: null,
            height: null
        };
        
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.resizeStartX = 0;
        this.resizeStartY = 0;
        this.resizeStartW = 0;
        this.resizeStartH = 0;
    }

    static get observedAttributes() {
        return ['mode', 'theme', 'harmony-mode', 'layout', 'edit-mode', 'collapsed'];
    }

    getStoragePrefix() {
        if (this.state.scope === 'page') {
            const pageKey = window.location.pathname.replace(/[^a-z0-9]/gi, '_');
            return `wb-page-${pageKey}`;
        }
        return 'wb';
    }

    static async checkBackendHealth() {
        if (WBControlPanel.backendCheckComplete) return WBControlPanel.backendAvailable;
        if (WBControlPanel.backendCheckPromise) return WBControlPanel.backendCheckPromise;

        WBControlPanel.backendCheckPromise = (async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const response = await fetch('/api/health', { method: 'GET', signal: controller.signal });
                clearTimeout(timeoutId);
                WBControlPanel.backendAvailable = response.ok;
            } catch (e) {
                WBControlPanel.backendAvailable = false;
            }
            WBControlPanel.backendCheckComplete = true;
            return WBControlPanel.backendAvailable;
        })();
        return WBControlPanel.backendCheckPromise;
    }

    async connectedCallback() {
        // Check preview mode
        if (window.location.search.includes('wb-preview=true')) {
            this.style.display = 'none';
            return;
        }
        
        super.connectedCallback();
        await WBControlPanel.checkBackendHealth();
        this.loadState();
        this.render();
        this.attachEventListeners();
        this.setupDragAndResize();
        this.applyState();
        this.applyColorsToDocument();
        this.restorePositionAndSize();
        
        // Debug log
        console.log('[WB Control Panel] Initialized', { collapsed: this.state.collapsed, mode: this.state.mode });
    }

    // Get CSS path relative to component
    getCSSPath() {
        // Get the path of this script
        const scripts = document.querySelectorAll('script[src*="wb-control-panel"]');
        if (scripts.length > 0) {
            const scriptSrc = scripts[0].src;
            return scriptSrc.replace('wb-control-panel.js', 'wb-control-panel-shadow.css');
        }
        // Fallback: try to determine from import.meta if available
        try {
            const url = new URL('./wb-control-panel-shadow.css', import.meta.url);
            return url.href;
        } catch (e) {
            // Last resort: relative path
            return './wb-control-panel-shadow.css';
        }
    }

    applyColorsToDocument() {
        const root = document.documentElement;
        const { primaryHue, primarySat, primaryLight, backgroundHue, backgroundSat, backgroundLight } = this.state;

        root.style.setProperty('--hue-primary', primaryHue);
        root.style.setProperty('--saturation-primary', primarySat);
        root.style.setProperty('--lightness-primary', primaryLight);
        root.style.setProperty('--primary', `hsl(${primaryHue}, ${primarySat}%, ${primaryLight}%)`);
        root.style.setProperty('--primary-dark', `hsl(${primaryHue}, ${primarySat}%, ${Math.max(0, primaryLight - 15)}%)`);
        root.style.setProperty('--primary-light', `hsl(${primaryHue}, ${Math.max(0, primarySat - 20)}%, ${Math.min(100, primaryLight + 25)}%)`);
        
        const rgb = this.hslToRgb(primaryHue, primarySat, primaryLight);
        root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

        const secHue = (primaryHue + 180) % 360;
        root.style.setProperty('--secondary', `hsl(${secHue}, ${Math.max(0, primarySat - 10)}%, ${primaryLight}%)`);
        root.style.setProperty('--secondary-color', `hsl(${secHue}, ${Math.max(0, primarySat - 10)}%, ${primaryLight}%)`);

        const accHue = (primaryHue - 30 + 360) % 360;
        root.style.setProperty('--accent', `hsl(${accHue}, ${Math.max(0, primarySat - 10)}%, ${primaryLight}%)`);

        root.style.setProperty('--bg-color', `hsl(${backgroundHue}, ${backgroundSat}%, ${backgroundLight}%)`);
        root.style.setProperty('--bg-primary', `hsl(${backgroundHue}, ${Math.max(0, backgroundSat - 2)}%, ${Math.min(100, backgroundLight + 7)}%)`);
        root.style.setProperty('--bg-secondary', `hsl(${backgroundHue}, ${Math.max(0, backgroundSat - 4)}%, ${Math.min(100, backgroundLight + 15)}%)`);
        root.style.setProperty('--bg-tertiary', `hsl(${backgroundHue}, ${Math.max(0, backgroundSat - 6)}%, ${Math.min(100, backgroundLight + 22)}%)`);

        const isDark = this.state.mode === 'dark';
        root.style.setProperty('--text-primary', isDark ? `hsl(${primaryHue}, 5%, 98%)` : `hsl(${primaryHue}, 10%, 15%)`);
        root.style.setProperty('--text-secondary', isDark ? `hsl(${primaryHue}, 15%, 85%)` : `hsl(${primaryHue}, 8%, 35%)`);
        root.style.setProperty('--text-muted', isDark ? `hsl(${primaryHue}, 25%, 65%)` : `hsl(${primaryHue}, 6%, 50%)`);
        root.style.setProperty('--border-color', isDark ? `hsl(${primaryHue}, 6%, 35%)` : `hsl(${primaryHue}, 10%, 80%)`);

        this.applyToBodyElements();
    }

    applyToBodyElements() {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${this.state.mode}-mode`);
        document.querySelectorAll('[data-theme]').forEach(el => el.setAttribute('data-theme', this.state.mode));
        document.querySelectorAll('[data-mode]').forEach(el => el.setAttribute('data-mode', this.state.mode));
        
        document.dispatchEvent(new CustomEvent('wb:theme-applied', {
            bubbles: true,
            detail: { ...this.state }
        }));
    }

    hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
    }

    loadState() {
        this.state.scope = localStorage.getItem('wb-scope') || 'site';
        const prefix = this.getStoragePrefix();
        
        this.state.mode = localStorage.getItem(`${prefix}-mode`) || 'dark';
        this.state.theme = localStorage.getItem(`${prefix}-theme`) || 'indigo';
        this.state.themeCategory = localStorage.getItem(`${prefix}-theme-category`) || 'named';
        this.state.layout = localStorage.getItem(`${prefix}-layout`) || 'top-nav';
        this.state.collapsed = localStorage.getItem('wb-collapsed') === 'true';
        this.state.primaryHue = parseInt(localStorage.getItem(`${prefix}-hue-primary`) || '240');
        this.state.primarySat = parseInt(localStorage.getItem(`${prefix}-sat-primary`) || '70');
        this.state.primaryLight = parseInt(localStorage.getItem(`${prefix}-light-primary`) || '50');
        this.state.backgroundHue = parseInt(localStorage.getItem(`${prefix}-hue-background`) || '220');
        this.state.backgroundSat = parseInt(localStorage.getItem(`${prefix}-sat-background`) || '20');
        this.state.backgroundLight = parseInt(localStorage.getItem(`${prefix}-light-background`) || '15');
        this.state.posX = localStorage.getItem('wb-pos-x') ? parseInt(localStorage.getItem('wb-pos-x')) : null;
        this.state.posY = localStorage.getItem('wb-pos-y') ? parseInt(localStorage.getItem('wb-pos-y')) : null;
        this.state.width = localStorage.getItem('wb-width') ? parseInt(localStorage.getItem('wb-width')) : null;
        this.state.height = localStorage.getItem('wb-height') ? parseInt(localStorage.getItem('wb-height')) : null;
    }

    saveState() {
        const prefix = this.getStoragePrefix();
        localStorage.setItem('wb-scope', this.state.scope);
        localStorage.setItem(`${prefix}-mode`, this.state.mode);
        localStorage.setItem(`${prefix}-theme`, this.state.theme);
        localStorage.setItem(`${prefix}-theme-category`, this.state.themeCategory);
        localStorage.setItem(`${prefix}-layout`, this.state.layout);
        localStorage.setItem('wb-collapsed', String(this.state.collapsed));
        localStorage.setItem(`${prefix}-hue-primary`, String(this.state.primaryHue));
        localStorage.setItem(`${prefix}-sat-primary`, String(this.state.primarySat));
        localStorage.setItem(`${prefix}-light-primary`, String(this.state.primaryLight));
        localStorage.setItem(`${prefix}-hue-background`, String(this.state.backgroundHue));
        localStorage.setItem(`${prefix}-sat-background`, String(this.state.backgroundSat));
        localStorage.setItem(`${prefix}-light-background`, String(this.state.backgroundLight));
    }

    savePositionAndSize() {
        if (this.state.posX !== null) localStorage.setItem('wb-pos-x', String(this.state.posX));
        if (this.state.posY !== null) localStorage.setItem('wb-pos-y', String(this.state.posY));
        if (this.state.width !== null) localStorage.setItem('wb-width', String(this.state.width));
        if (this.state.height !== null) localStorage.setItem('wb-height', String(this.state.height));
    }

    restorePositionAndSize() {
        const panel = this.shadowRoot.getElementById('panel');
        if (!panel) return;
        if (this.state.posX !== null && this.state.posY !== null) {
            panel.style.right = 'auto';
            panel.style.left = `${this.state.posX}px`;
            panel.style.top = `${this.state.posY}px`;
        }
        if (this.state.width) panel.style.width = `${this.state.width}px`;
        if (this.state.height) panel.style.maxHeight = `${this.state.height}px`;
    }

    openPreview() {
        const url = new URL(window.location.href);
        url.searchParams.set('wb-preview', 'true');
        window.open(url.toString(), '_blank');
    }

    saveStyles() {
        this.saveState();
        this.showNotification('✓ Styles saved!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `wb-notification wb-notification--${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('wb-notification--exit');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    toggleCollapse() {
        this.state.collapsed = !this.state.collapsed;
        this.updateCollapseUI();
        this.saveState();
        console.log('[WB Control Panel] Collapsed:', this.state.collapsed);
    }

    updateCollapseUI() {
        const panel = this.shadowRoot.getElementById('panel');
        const openBtn = this.shadowRoot.getElementById('open-button');
        
        if (!panel || !openBtn) return;
        
        if (this.state.collapsed) {
            panel.classList.add('collapsed');
            openBtn.classList.remove('hidden');
        } else {
            panel.classList.remove('collapsed');
            openBtn.classList.add('hidden');
        }
    }

    getNamedThemes() {
        return {
            'indigo': { name: 'Indigo (Default)', hue: 240, sat: 70, light: 50, bgHue: 220, bgSat: 20, bgLight: 15 },
            'cyberpunk': { name: 'Cyberpunk', hue: 320, sat: 85, light: 55, bgHue: 280, bgSat: 25, bgLight: 10 },
            'neon-city': { name: 'Neon City', hue: 180, sat: 90, light: 50, bgHue: 200, bgSat: 30, bgLight: 8 },
            'ocean': { name: 'Ocean', hue: 200, sat: 80, light: 50, bgHue: 210, bgSat: 25, bgLight: 12 },
            'forest': { name: 'Forest', hue: 140, sat: 70, light: 45, bgHue: 150, bgSat: 20, bgLight: 12 },
            'sunset': { name: 'Sunset', hue: 25, sat: 85, light: 55, bgHue: 15, bgSat: 20, bgLight: 12 },
            'aurora': { name: 'Aurora', hue: 160, sat: 70, light: 50, bgHue: 200, bgSat: 25, bgLight: 10 },
            'purple': { name: 'Purple', hue: 280, sat: 75, light: 50, bgHue: 270, bgSat: 20, bgLight: 12 },
            'emerald': { name: 'Emerald', hue: 150, sat: 70, light: 45, bgHue: 160, bgSat: 18, bgLight: 10 },
            'ruby': { name: 'Ruby', hue: 350, sat: 80, light: 50, bgHue: 0, bgSat: 15, bgLight: 12 },
            'sapphire': { name: 'Sapphire', hue: 220, sat: 85, light: 50, bgHue: 225, bgSat: 22, bgLight: 12 },
            'amber': { name: 'Amber', hue: 45, sat: 80, light: 55, bgHue: 35, bgSat: 18, bgLight: 12 },
            'mint': { name: 'Mint', hue: 160, sat: 60, light: 60, bgHue: 165, bgSat: 15, bgLight: 14 },
            'coral': { name: 'Coral', hue: 10, sat: 75, light: 60, bgHue: 15, bgSat: 15, bgLight: 14 },
            'charcoal': { name: '🌑 Charcoal', hue: 0, sat: 0, light: 45, bgHue: 0, bgSat: 0, bgLight: 10 },
            'slate': { name: '🪨 Slate', hue: 215, sat: 15, light: 50, bgHue: 215, bgSat: 10, bgLight: 15 },
            'graphite': { name: '✏️ Graphite', hue: 220, sat: 8, light: 40, bgHue: 220, bgSat: 5, bgLight: 12 },
            'silver': { name: '🥈 Silver', hue: 210, sat: 10, light: 65, bgHue: 210, bgSat: 5, bgLight: 18 },
            'steel': { name: '🔩 Steel', hue: 200, sat: 12, light: 55, bgHue: 200, bgSat: 8, bgLight: 14 }
        };
    }

    render() {
        // Use import.meta.url for correct relative path
        const cssPath = this.getCSSPath();
        
        // Inline critical styles to ensure open button is always visible
        const inlineStyles = `
            <style>
                :host { display: block; position: fixed; top: 8px; right: 8px; z-index: 10000; font-family: system-ui, sans-serif; }
                .hidden { display: none !important; }
                .open-button {
                    position: fixed; top: 8px; right: 8px; width: 48px; height: 48px;
                    border-radius: 50%; border: 2px solid rgba(99, 102, 241, 0.5);
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    z-index: 10001; transition: all 0.3s ease;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
                    color: white; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
                }
                .open-button[data-mode="light"] {
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .open-button:hover { transform: scale(1.1) rotate(15deg); }
                .open-button:active { transform: scale(0.95); }
                .open-button svg { width: 24px; height: 24px; }
                .panel.collapsed { opacity: 0; transform: scale(0.8); pointer-events: none; visibility: hidden; }
            </style>
        `;
        
        const template = document.createElement('template');
        template.innerHTML = `
            ${inlineStyles}
            <link rel="stylesheet" href="${cssPath}">
            
            <!-- Gear button to reopen (visible when collapsed) -->
            <button id="open-button" class="open-button ${this.state.collapsed ? '' : 'hidden'}" 
                    data-mode="${this.state.mode}" aria-label="Open Control Panel" title="Open Settings">
                ${ICONS.gear}
            </button>
            
            <!-- Main Panel -->
            <div id="panel" class="panel ${this.state.collapsed ? 'collapsed' : ''}" data-mode="${this.state.mode}">
                <div class="panel-header" id="drag-handle">
                    <h3>🎨 Control Panel</h3>
                    <div class="header-buttons">
                        <button class="icon-btn" id="mode-toggle" aria-label="Toggle mode" title="Toggle dark/light">
                            <span id="mode-icon">${this.state.mode === 'dark' ? ICONS.moon : ICONS.sun}</span>
                        </button>
                        <button class="icon-btn close-btn" id="close-button" aria-label="Close" title="Close panel">
                            ${ICONS.close}
                        </button>
                    </div>
                </div>
                
                <div class="panel-body">
                    <div class="scope-toggle">
                        <button class="scope-btn ${this.state.scope === 'site' ? 'active' : ''}" id="scope-site" title="Apply to entire site">
                            ${ICONS.globe} Site
                        </button>
                        <button class="scope-btn ${this.state.scope === 'page' ? 'active' : ''}" id="scope-page" title="Apply to this page only">
                            ${ICONS.page} Page
                        </button>
                    </div>
                    
                    <div class="control-group">
                        <label>Theme</label>
                        <select id="theme-dropdown"></select>
                    </div>

                    <div class="section-title">Primary Color</div>
                    <div class="control-group">
                        <label>Hue <span class="hue-swatch" id="hue-swatch"></span><span class="value" id="hue-display">240°</span></label>
                        <input type="range" id="hue-slider" min="0" max="360" value="240">
                        <label>Saturation <span class="value" id="sat-display">70%</span></label>
                        <input type="range" id="sat-slider" min="0" max="100" value="70">
                        <label>Lightness <span class="value" id="light-display">50%</span></label>
                        <input type="range" id="light-slider" min="0" max="100" value="50">
                    </div>

                    <div class="section-title">Background</div>
                    <div class="control-group">
                        <label>Hue <span class="hue-swatch" id="bg-hue-swatch"></span><span class="value" id="bg-hue-display">220°</span></label>
                        <input type="range" id="bg-hue-slider" min="0" max="360" value="220">
                        <label>Saturation <span class="value" id="bg-sat-display">20%</span></label>
                        <input type="range" id="bg-sat-slider" min="0" max="100" value="20">
                        <label>Lightness <span class="value" id="bg-light-display">15%</span></label>
                        <input type="range" id="bg-light-slider" min="0" max="100" value="15">
                    </div>

                    <div class="section-title">Layout</div>
                    <div class="control-group">
                        <label>Page Layout</label>
                        <select id="layout-select">
                            <option value="top-nav">Top Navigation</option>
                            <option value="left-nav">Left Sidebar</option>
                            <option value="right-nav">Right Sidebar</option>
                            <option value="ad-layout">Ad Layout</option>
                        </select>
                    </div>

                    <div class="action-buttons">
                        <button class="action-btn preview-btn" id="preview-btn" title="Preview without panel">
                            ${ICONS.preview} Preview
                        </button>
                        <button class="action-btn save-btn" id="save-btn" title="Save current styles">
                            ${ICONS.save} Save
                        </button>
                    </div>
                </div>
                
                <div class="resize-handle" id="resize-handle"></div>
            </div>
        `;
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setupDragAndResize() {
        const panel = this.shadowRoot.getElementById('panel');
        const dragHandle = this.shadowRoot.getElementById('drag-handle');
        const resizeHandle = this.shadowRoot.getElementById('resize-handle');
        
        // Helper to get coordinates from mouse or touch event
        const getCoords = (e) => {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };
        
        // DRAG - Mouse events
        dragHandle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            this.startDrag(e.clientX, e.clientY, panel);
            e.preventDefault();
        });
        
        // DRAG - Touch events
        dragHandle.addEventListener('touchstart', (e) => {
            if (e.target.closest('button')) return;
            const coords = getCoords(e);
            this.startDrag(coords.x, coords.y, panel);
        }, { passive: true });
        
        // RESIZE - Mouse events
        resizeHandle.addEventListener('mousedown', (e) => {
            this.startResize(e.clientX, e.clientY, panel);
            e.preventDefault();
        });
        
        // RESIZE - Touch events
        resizeHandle.addEventListener('touchstart', (e) => {
            const coords = getCoords(e);
            this.startResize(coords.x, coords.y, panel);
        }, { passive: true });
        
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.handleMove(e.clientX, e.clientY, panel);
        });
        
        // Touch move
        document.addEventListener('touchmove', (e) => {
            const coords = getCoords(e);
            this.handleMove(coords.x, coords.y, panel);
        }, { passive: true });
        
        // Mouse up
        document.addEventListener('mouseup', () => this.endDragResize(panel));
        
        // Touch end
        document.addEventListener('touchend', () => this.endDragResize(panel));
    }
    
    startDrag(x, y, panel) {
        this.isDragging = true;
        const rect = panel.getBoundingClientRect();
        this.dragOffsetX = x - rect.left;
        this.dragOffsetY = y - rect.top;
        panel.classList.add('dragging');
    }
    
    startResize(x, y, panel) {
        this.isResizing = true;
        this.resizeStartX = x;
        this.resizeStartY = y;
        this.resizeStartW = panel.offsetWidth;
        this.resizeStartH = panel.offsetHeight;
        panel.classList.add('resizing');
    }
    
    handleMove(x, y, panel) {
        if (this.isDragging) {
            const newX = x - this.dragOffsetX;
            const newY = y - this.dragOffsetY;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            this.state.posX = Math.max(0, Math.min(newX, maxX));
            this.state.posY = Math.max(0, Math.min(newY, maxY));
            panel.style.right = 'auto';
            panel.style.left = `${this.state.posX}px`;
            panel.style.top = `${this.state.posY}px`;
        }
        if (this.isResizing) {
            const newW = Math.max(220, Math.min(500, this.resizeStartW + (x - this.resizeStartX)));
            const newH = Math.max(300, Math.min(window.innerHeight - 20, this.resizeStartH + (y - this.resizeStartY)));
            this.state.width = newW;
            this.state.height = newH;
            panel.style.width = `${newW}px`;
            panel.style.maxHeight = `${newH}px`;
        }
    }
    
    endDragResize(panel) {
        if (this.isDragging || this.isResizing) {
            this.isDragging = false;
            this.isResizing = false;
            panel.classList.remove('dragging', 'resizing');
            this.savePositionAndSize();
        }
    }

    attachEventListeners() {
        const $ = id => this.shadowRoot.getElementById(id);
        
        // Use both click and touchend for mobile compatibility
        const addClickHandler = (id, handler) => {
            const el = $(id);
            if (!el) return;
            el.addEventListener('click', handler);
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handler(e);
            });
        };
        
        addClickHandler('close-button', () => this.toggleCollapse());
        addClickHandler('open-button', () => this.toggleCollapse());
        addClickHandler('preview-btn', () => this.openPreview());
        addClickHandler('save-btn', () => this.saveStyles());
        
        addClickHandler('scope-site', () => {
            this.state.scope = 'site';
            this.updateScopeUI();
            this.loadState();
            this.applyState();
        });
        
        addClickHandler('scope-page', () => {
            this.state.scope = 'page';
            this.updateScopeUI();
            this.loadState();
            this.applyState();
        });
        
        addClickHandler('mode-toggle', () => {
            this.state.mode = this.state.mode === 'dark' ? 'light' : 'dark';
            this.updateModeUI();
            this.applyColorsToDocument();
            this.saveState();
        });
        
        // Theme dropdown
        $('theme-dropdown').addEventListener('change', (e) => {
            this.state.theme = e.target.value;
            const themeData = this.getNamedThemes()[this.state.theme];
            if (themeData) {
                this.state.primaryHue = themeData.hue;
                this.state.primarySat = themeData.sat;
                this.state.primaryLight = themeData.light;
                this.state.backgroundHue = themeData.bgHue;
                this.state.backgroundSat = themeData.bgSat;
                this.state.backgroundLight = themeData.bgLight;
                this.updateSliders();
                this.applyColorsToDocument();
            }
            this.saveState();
        });
        
        // Sliders - use input event (works for both mouse and touch)
        const sliderHandler = (id, prop, display, suffix, updateFn) => {
            const slider = $(id);
            if (!slider) return;
            slider.addEventListener('input', (e) => {
                this.state[prop] = parseInt(e.target.value);
                $(display).textContent = `${e.target.value}${suffix}`;
                if (updateFn) updateFn();
                this.applyColorsToDocument();
                this.saveState();
            });
        };
        
        sliderHandler('hue-slider', 'primaryHue', 'hue-display', '°', () => this.updateHueSwatch());
        sliderHandler('sat-slider', 'primarySat', 'sat-display', '%');
        sliderHandler('light-slider', 'primaryLight', 'light-display', '%');
        sliderHandler('bg-hue-slider', 'backgroundHue', 'bg-hue-display', '°', () => this.updateBgHueSwatch());
        sliderHandler('bg-sat-slider', 'backgroundSat', 'bg-sat-display', '%');
        sliderHandler('bg-light-slider', 'backgroundLight', 'bg-light-display', '%');
        
        // Layout
        $('layout-select').addEventListener('change', (e) => {
            this.state.layout = e.target.value;
            this.fireEvent('layout-changed', { layout: this.state.layout });
            this.saveState();
        });
    }

    updateModeUI() {
        const modeIcon = this.shadowRoot.getElementById('mode-icon');
        const panel = this.shadowRoot.getElementById('panel');
        const openBtn = this.shadowRoot.getElementById('open-button');
        
        if (modeIcon) modeIcon.innerHTML = this.state.mode === 'dark' ? ICONS.moon : ICONS.sun;
        if (panel) panel.setAttribute('data-mode', this.state.mode);
        if (openBtn) openBtn.setAttribute('data-mode', this.state.mode);
        
        this.setAttribute('data-mode', this.state.mode);
        document.documentElement.setAttribute('data-mode', this.state.mode);
        document.body.setAttribute('data-mode', this.state.mode);
    }

    updateScopeUI() {
        const siteBtn = this.shadowRoot.getElementById('scope-site');
        const pageBtn = this.shadowRoot.getElementById('scope-page');
        if (siteBtn) siteBtn.classList.toggle('active', this.state.scope === 'site');
        if (pageBtn) pageBtn.classList.toggle('active', this.state.scope === 'page');
        localStorage.setItem('wb-scope', this.state.scope);
    }

    updateThemeDropdown() {
        const dropdown = this.shadowRoot.getElementById('theme-dropdown');
        if (!dropdown) return;
        dropdown.innerHTML = '';
        Object.entries(this.getNamedThemes()).forEach(([id, data]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = data.name;
            if (id === this.state.theme) opt.selected = true;
            dropdown.appendChild(opt);
        });
    }

    updateSliders() {
        const $ = id => this.shadowRoot.getElementById(id);
        if (!$('hue-slider')) return;
        
        $('hue-slider').value = this.state.primaryHue;
        $('sat-slider').value = this.state.primarySat;
        $('light-slider').value = this.state.primaryLight;
        $('hue-display').textContent = `${this.state.primaryHue}°`;
        $('sat-display').textContent = `${this.state.primarySat}%`;
        $('light-display').textContent = `${this.state.primaryLight}%`;
        $('bg-hue-slider').value = this.state.backgroundHue;
        $('bg-sat-slider').value = this.state.backgroundSat;
        $('bg-light-slider').value = this.state.backgroundLight;
        $('bg-hue-display').textContent = `${this.state.backgroundHue}°`;
        $('bg-sat-display').textContent = `${this.state.backgroundSat}%`;
        $('bg-light-display').textContent = `${this.state.backgroundLight}%`;
        this.updateHueSwatch();
        this.updateBgHueSwatch();
    }

    updateHueSwatch() {
        const s = this.shadowRoot.getElementById('hue-swatch');
        if (s) s.style.backgroundColor = `hsl(${this.state.primaryHue}, 100%, 50%)`;
    }

    updateBgHueSwatch() {
        const s = this.shadowRoot.getElementById('bg-hue-swatch');
        if (s) s.style.backgroundColor = `hsl(${this.state.backgroundHue}, 100%, 50%)`;
    }

    applyState() {
        const $ = id => this.shadowRoot.getElementById(id);
        this.updateModeUI();
        this.updateCollapseUI();
        this.updateScopeUI();
        this.updateThemeDropdown();
        this.updateSliders();
        if ($('layout-select')) $('layout-select').value = this.state.layout;
        this.applyColorsToDocument();
    }
}

customElements.define('wb-control-panel', WBControlPanel);
if (!window['WB']) window['WB'] = { components: {}, utils: {} };
window['WB'].components.WBControlPanel = WBControlPanel;
export { WBControlPanel };
export default WBControlPanel;
