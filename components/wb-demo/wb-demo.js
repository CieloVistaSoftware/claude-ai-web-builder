// WB Demo Subcomponents for Encapsulated Demo Structure
class WBExample extends HTMLElement { constructor() { super(); } }
class WBDemoSection extends HTMLElement { constructor() { super(); } }
class WBDemoGrid extends HTMLElement { constructor() { super(); } }
class WBDemoItem extends HTMLElement { constructor() { super(); } }
class WBDemoOutput extends HTMLElement { constructor() { super(); } }
customElements.define('wb-example', WBExample);
customElements.define('wb-demo-section', WBDemoSection);
customElements.define('wb-demo-grid', WBDemoGrid);
customElements.define('wb-demo-item', WBDemoItem);
customElements.define('wb-demo-output', WBDemoOutput);

/**
 * WB Demo Component
 * A reusable component for creating two-tab documentation and examples layouts
 * 
 * Features:
 * - Documentation and Examples tabs
 * - Floating, draggable, collapsible debug event log
 * - 95% width by default
 * - Auto-positions to event Y location
 */
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBDemo extends WBBaseComponent {
    constructor() {
        super();
        this.logInfo('WB Demo: Constructor called');

        this.eventHistory = [];
        this.activeFilters = ['info', 'warning', 'error', 'success', 'debug', 'user'];
        this._debugVisible = false;
        this._debugCollapsed = false;
        this._isDragging = false;
        this._dragOffset = { x: 0, y: 0 };

        // Inject stylesheets
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '../wb-demo/wb-demo.css');
        this.shadowRoot.appendChild(linkElem);
        
        const buttonCSS = document.createElement('link');
        buttonCSS.setAttribute('rel', 'stylesheet');
        buttonCSS.setAttribute('href', '../wb-button/wb-button.css');
        this.shadowRoot.appendChild(buttonCSS);
        
        this.shadowRoot.innerHTML += `
            <div class="demo-container">
                <header class="demo-header">
                    <h1 class="demo-title" id="demo-title"></h1>
                    <button class="debug-toggle-btn" id="debugToggle" title="Toggle Debug Event Log">
                        🐛 Debug
                    </button>
                </header>
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button" data-tab="0">📖 Documentation</button>
                        <button class="tab-button active" data-tab="1">🎯 Examples</button>
                    </div>
                    <div class="tab-content">
                        <div class="tab-panel" id="docs-panel">
                            <slot name="documentation"><div id="doc-content">Loading documentation...</div></slot>
                        </div>
                        <div class="tab-panel active" id="examples-panel">
                            <slot name="examples"><iframe id="demo-frame" src="" style="width:100%;height:400px;border:none;background:#fff;"></iframe></slot>
                        </div>
                    </div>
                </div>
                
                <!-- Floating Debug Panel -->
                <div class="debug-floater" id="debugFloater">
                    <div class="debug-floater-header" id="debugFloaterHeader">
                        <span class="debug-floater-title">🐛 Event Log</span>
                        <div class="debug-floater-controls">
                            <button class="debug-collapse-btn" id="debugCollapse" title="Collapse/Expand">−</button>
                            <button class="debug-close-btn" id="debugClose" title="Close">×</button>
                        </div>
                    </div>
                    <div class="debug-floater-body" id="debugFloaterBody">
                        <div class="debug-floater-toolbar">
                            <button class="debug-clear-btn" id="debugClear">Clear</button>
                            <span class="debug-event-count" id="debugCount">0 events</span>
                        </div>
                        <div class="debug-event-log" id="debugEventLog">
                            <div class="debug-empty">No events yet. Interact with components.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['doc-url', 'markdown', 'demo-url', 'title', 'debug'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'doc-url':
                this.docUrl = newValue;
                break;
            case 'markdown':
                this.markdown = newValue;
                break;
            case 'demo-url':
                this.demoUrl = newValue;
                break;
            case 'title':
                this.title = newValue;
                break;
            case 'debug':
                if (newValue !== null) this._showDebugPanel();
                break;
        }
        
        if (this.shadowRoot && name === 'title') {
            this._updateDemoTitle();
            this._updateDocumentTitle();
        }
        if (this.shadowRoot && name === 'markdown') {
            this.loadDocumentation();
        }
    }

    async connectedCallback() {
        this.logInfo('WB Demo: connectedCallback called');
        await loadComponentCSS(this, 'wb-demo.css');

        this.setupTabSwitching();
        this.setupDebugPanel();
        this.loadDocumentation();
        this.loadDemo();
        this._updateDemoTitle();
        this._updateDocumentTitle();
        this._setupEventCapture();
        
        if (this.hasAttribute('debug')) {
            this._showDebugPanel();
        }

        this.logInfo('WB Demo: connectedCallback completed');
    }

    setupTabSwitching() {
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        const tabPanels = this.shadowRoot.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabPanels.forEach(panel => panel.classList.remove('active'));
                tabPanels[tabIndex].classList.add('active');
            });
        });
    }
    
    setupDebugPanel() {
        const floater = this.shadowRoot.getElementById('debugFloater');
        const header = this.shadowRoot.getElementById('debugFloaterHeader');
        const debugToggle = this.shadowRoot.getElementById('debugToggle');
        const debugClose = this.shadowRoot.getElementById('debugClose');
        const debugCollapse = this.shadowRoot.getElementById('debugCollapse');
        const debugClear = this.shadowRoot.getElementById('debugClear');
        
        // Toggle button
        debugToggle?.addEventListener('click', () => this.toggleDebug());
        
        // Close button
        debugClose?.addEventListener('click', () => this._hideDebugPanel());
        
        // Collapse button
        debugCollapse?.addEventListener('click', () => this._toggleCollapse());
        
        // Clear button
        debugClear?.addEventListener('click', () => this._clearDebugLog());
        
        // Dragging
        header?.addEventListener('mousedown', (e) => this._startDrag(e));
        document.addEventListener('mousemove', (e) => this._onDrag(e));
        document.addEventListener('mouseup', () => this._stopDrag());
        
        // Touch support
        header?.addEventListener('touchstart', (e) => this._startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this._onDrag(e.touches[0]));
        document.addEventListener('touchend', () => this._stopDrag());
    }
    
    _startDrag(e) {
        const floater = this.shadowRoot.getElementById('debugFloater');
        if (!floater) return;
        
        this._isDragging = true;
        floater.classList.add('dragging');
        
        const rect = floater.getBoundingClientRect();
        this._dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    _onDrag(e) {
        if (!this._isDragging) return;
        
        const floater = this.shadowRoot.getElementById('debugFloater');
        if (!floater) return;
        
        const x = e.clientX - this._dragOffset.x;
        const y = e.clientY - this._dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - floater.offsetWidth;
        const maxY = window.innerHeight - floater.offsetHeight;
        
        floater.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        floater.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        floater.style.right = 'auto';
        floater.style.bottom = 'auto';
    }
    
    _stopDrag() {
        this._isDragging = false;
        const floater = this.shadowRoot.getElementById('debugFloater');
        floater?.classList.remove('dragging');
    }
    
    _toggleCollapse() {
        const body = this.shadowRoot.getElementById('debugFloaterBody');
        const btn = this.shadowRoot.getElementById('debugCollapse');
        
        this._debugCollapsed = !this._debugCollapsed;
        
        if (body) {
            body.style.display = this._debugCollapsed ? 'none' : 'block';
        }
        if (btn) {
            btn.textContent = this._debugCollapsed ? '+' : '−';
        }
    }
    
    _showDebugPanel() {
        const floater = this.shadowRoot.getElementById('debugFloater');
        const toggle = this.shadowRoot.getElementById('debugToggle');
        
        if (floater) {
            floater.classList.add('visible');
            this._debugVisible = true;
        }
        if (toggle) {
            toggle.classList.add('active');
        }
    }
    
    _hideDebugPanel() {
        const floater = this.shadowRoot.getElementById('debugFloater');
        const toggle = this.shadowRoot.getElementById('debugToggle');
        
        if (floater) {
            floater.classList.remove('visible');
            this._debugVisible = false;
        }
        if (toggle) {
            toggle.classList.remove('active');
        }
    }
    
    _clearDebugLog() {
        const log = this.shadowRoot.getElementById('debugEventLog');
        const count = this.shadowRoot.getElementById('debugCount');
        
        if (log) {
            log.innerHTML = '<div class="debug-empty">Log cleared.</div>';
        }
        if (count) {
            count.textContent = '0 events';
        }
        this.eventHistory = [];
    }
    
    _setupEventCapture() {
        const eventsToCapture = [
            'colorchange', 'harmonychange', 'swatchselect', 'colorcopied',
            'click', 'change', 'input', 'submit',
            'wb-event', 'statechange', 'valuechange',
            'open', 'close', 'toggle', 'select'
        ];
        
        eventsToCapture.forEach(eventType => {
            this.addEventListener(eventType, (e) => this._logEvent(e));
        });
    }
    
    _logEvent(e) {
        if (!this._debugVisible) return;
        
        const log = this.shadowRoot.getElementById('debugEventLog');
        const floater = this.shadowRoot.getElementById('debugFloater');
        const count = this.shadowRoot.getElementById('debugCount');
        
        if (!log) return;
        
        // Remove empty message
        const emptyMsg = log.querySelector('.debug-empty');
        if (emptyMsg) emptyMsg.remove();
        
        // Move floater near event Y position
        if (floater && e.clientY) {
            const targetY = Math.max(10, e.clientY - 50);
            const maxY = window.innerHeight - floater.offsetHeight - 10;
            floater.style.top = Math.min(targetY, maxY) + 'px';
        }
        
        // Format event data on single line
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const target = e.target?.tagName?.toLowerCase() || 'unknown';
        
        let valueStr = '';
        if (e.detail) {
            if (typeof e.detail === 'object') {
                // Extract key values for single-line display
                const keys = Object.keys(e.detail).slice(0, 3);
                valueStr = keys.map(k => `${k}:${JSON.stringify(e.detail[k]).slice(0, 20)}`).join(' ');
            } else {
                valueStr = String(e.detail).slice(0, 50);
            }
        }
        
        // Create single-line entry
        const entry = document.createElement('div');
        entry.className = 'debug-event-entry';
        entry.innerHTML = `<span class="debug-time">${timestamp}</span> <span class="debug-type">${e.type}</span> <span class="debug-target">&lt;${target}&gt;</span>${valueStr ? ` <span class="debug-value">${valueStr}</span>` : ''}`;
        
        // Add to log (newest first)
        log.insertBefore(entry, log.firstChild);
        
        // Update count
        this.eventHistory.push({ type: e.type, target, detail: e.detail, time: timestamp });
        if (count) {
            count.textContent = `${this.eventHistory.length} events`;
        }
        
        // Limit entries
        while (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    }

    async loadDocumentation() {
        const docContent = this.shadowRoot.getElementById('doc-content');
        let docUrl = this.getAttribute('doc-url');
        
        if (!docUrl) {
            const markdownAttr = this.getAttribute('markdown');
            if (markdownAttr) docUrl = markdownAttr;
        }
        
        if (!docUrl) {
            let folderName = 'wb-demo';
            try {
                if (typeof import.meta !== 'undefined' && import.meta.url) {
                    const parts = import.meta.url.split('/');
                    folderName = parts.length >= 2 ? parts[parts.length - 2] : 'wb-demo';
                }
            } catch (e) {}
            docUrl = `${folderName}.md`;
        }
        
        if (!docContent) return;
        
        try {
            const response = await fetch(docUrl);
            if (!response.ok) throw new Error('Failed to load documentation');
            const markdown = await response.text();
            
            function loadMarked() {
                if (window['marked']) return Promise.resolve(window['marked']);
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                    script.onload = () => resolve(window['marked']);
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            loadMarked().then(markedLib => {
                docContent.innerHTML = markedLib.parse(markdown);
            }).catch(() => {
                docContent.textContent = markdown;
            });
        } catch (e) {
            docContent.innerHTML = `<p>Error: ${e.message}</p>`;
        }
    }

    loadDemo() {
        const demoUrl = this.getAttribute('demo-url');
        const demoFrame = this.shadowRoot.getElementById('demo-frame');
        if (demoUrl && demoFrame) {
            demoFrame.src = demoUrl;
        }
    }

    _updateDemoTitle() {
        const h1 = this.shadowRoot.getElementById('demo-title');
        let titleText = this.getAttribute('title') || '';
        if (h1) h1.textContent = titleText;
    }

    _updateDocumentTitle() {
        let titleText = this.getAttribute('title') || 'Demo';
        if (typeof document !== 'undefined' && document.title !== titleText) {
            document.title = titleText;
        }
    }
    
    // Public API
    showDebug() { this._showDebugPanel(); }
    hideDebug() { this._hideDebugPanel(); }
    toggleDebug() { this._debugVisible ? this._hideDebugPanel() : this._showDebugPanel(); }
    logDebugEvent(type, detail) { this._logEvent({ type, detail, target: { tagName: 'CUSTOM' } }); }
}

if (!customElements.get('wb-demo')) {
    customElements.define('wb-demo', WBDemo);
    console.log('🎯 WB Demo: Component registered');
}

if (!window['WB']) window['WB'] = { components: {}, utils: {} };
window['WB'].components.WBDemo = WBDemo;
window['WBDemo'] = WBDemo;

export { WBDemo };
export default WBDemo;
