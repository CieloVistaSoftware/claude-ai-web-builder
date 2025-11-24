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
 * Follows WB Component Rules: CSS-First Architecture with external stylesheet
 */
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBDemo extends WBBaseComponent {
    constructor() {
        super();
        this.logInfo('WB Demo: Constructor called');
        // Shadow root already created by WBBaseComponent - don't create again

        // Event storage for saving
        this.eventHistory = [];

        // Event filters
        this.activeFilters = ['info', 'warning', 'error', 'success', 'debug', 'user'];

        // Inject both external and internal CSS for subcomponents into Shadow DOM
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        // Use simple relative path that works from component subdirectories
        linkElem.setAttribute('href', '../wb-demo/wb-demo.css');
        // Only use external stylesheet for styling
        this.shadowRoot.appendChild(linkElem);
        
        // CRITICAL: Load wb-button CSS into Shadow DOM so slotted buttons are styled
        const buttonCSS = document.createElement('link');
        buttonCSS.setAttribute('rel', 'stylesheet');
        buttonCSS.setAttribute('href', '../wb-button/wb-button.css');
        this.shadowRoot.appendChild(buttonCSS);
        // Use a placeholder for the title, to be filled in after construction
        this.shadowRoot.innerHTML += `
            <div class="demo-container">
                <h1 class="demo-title" id="demo-title"></h1>
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
            </div>
        `;
    }

    
    static get observedAttributes() {
        return ['doc-url', 'markdown', 'demo-url', 'title'];
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
        }
        
        // Update title and reload content if needed
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

        // Set up tab switching functionality
        this.setupTabSwitching();

        // Load documentation and demo content
        this.loadDocumentation();
        this.loadDemo();

        // Update title elements
        this._updateDemoTitle();
        this._updateDocumentTitle();

        this.logInfo('WB Demo: connectedCallback completed');
    }

    setupTabSwitching() {
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        const tabPanels = this.shadowRoot.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = /** @type {HTMLButtonElement} */ (button).dataset.tab;
                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Update panel states
                tabPanels.forEach(panel => panel.classList.remove('active'));
                tabPanels[tabIndex].classList.add('active');
            });
        });
    }

    async loadDocumentation() {
        const docContent = this.shadowRoot.getElementById('doc-content');
        let docUrl = this.getAttribute('doc-url');
        // If no doc-url, try markdown attribute
        if (!docUrl) {
            const markdownAttr = this.getAttribute('markdown');
            if (markdownAttr) {
                docUrl = markdownAttr;
            }
        }
        // If still no docUrl, auto-detect .md file matching folder name
        if (!docUrl) {
            // Try to infer folder name from current script src or location
            let folderName = 'wb-demo';
            try {
                // Use import.meta.url if available (ESM), fallback to script src
                if (typeof import.meta !== 'undefined' && import.meta.url) {
                    const parts = import.meta.url.split('/');
                    folderName = parts.length >= 2 ? parts[parts.length - 2] : 'wb-demo';
                } else if (document.currentScript && (/** @type {HTMLScriptElement} */(document.currentScript)).src) {
                    const parts = (/** @type {HTMLScriptElement} */(document.currentScript)).src.split('/');
                    folderName = parts[parts.length - 2];
                }
            } catch (e) {}
            docUrl = `${folderName}.md`;
        }
        if (!docContent) return;
        try {
            const response = await fetch(docUrl);
            if (!response.ok) throw new Error('Failed to load documentation');
            const markdown = await response.text();
            // Ensure marked.js is loaded
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
            docContent.innerHTML = `<p>Error loading documentation: ${e.message}</p>`;
        }
    }

    loadDemo() {
        const demoUrl = this.getAttribute('demo-url');
        const demoFrame = this.shadowRoot.getElementById('demo-frame');
        if (demoUrl && demoFrame) {
            /** @type {HTMLIFrameElement} */ (demoFrame).src = demoUrl;
        }
    }

    _updateDemoTitle() {
        const h1 = this.shadowRoot.getElementById('demo-title');
        let titleText = this.getAttribute('title') || 'Component Demo';
        h1.textContent = titleText;
    }

    _updateDocumentTitle() {
        let titleText = this.getAttribute('title') || 'Component Demo';
        if (typeof document !== 'undefined' && document.title !== titleText) {
            document.title = titleText;
        }
    }
}

// Register the component
if (!customElements.get('wb-demo')) {
    customElements.define('wb-demo', WBDemo);
    console.log('🎯 WB Demo: Component registered successfully');
} else {
    console.log('⚠️ WB Demo: Component already registered');
}

// Compositional Namespace
if (!window['WB']) window['WB'] = { components: {}, utils: {} };
window['WB'].components.WBDemo = WBDemo;

// Expose globally (backward compatibility)
window['WBDemo'] = WBDemo;

// ES6 Module Exports
export { WBDemo };
export default WBDemo;
