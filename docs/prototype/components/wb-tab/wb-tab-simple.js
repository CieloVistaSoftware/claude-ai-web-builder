/**
 * Simple WB Tab Component - Fixed Version
 * A clean, working tab component with proper Shadow DOM encapsulation
 */

class WBTabSimple extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activeTab = 0;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setActiveTab(parseInt(this.getAttribute('active-tab') || '0'));
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--neutral-900, #111827);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .tab-container {
                    display: flex;
                    flex-direction: column;
                }
                
                .tab-header {
                    display: flex;
                    background: var(--neutral-800, #1f2937);
                    border-bottom: 1px solid var(--neutral-600, #4b5563);
                }
                
                .tab-button {
                    padding: 12px 24px;
                    background: none;
                    border: none;
                    color: var(--neutral-300, #d1d5db);
                    cursor: pointer;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }
                
                .tab-button:hover {
                    background: var(--neutral-700, #374151);
                    color: var(--neutral-100, #f3f4f6);
                }
                
                .tab-button.active {
                    color: var(--primary-400, #60a5fa);
                    border-bottom-color: var(--primary-400, #60a5fa);
                    background: var(--neutral-700, #374151);
                }
                
                .tab-content {
                    padding: 24px;
                    color: var(--neutral-200, #e5e7eb);
                }
                
                .tab-panel {
                    display: none;
                }
                
                .tab-panel.active {
                    display: block;
                }
            </style>
            
            <div class="tab-container">
                <div class="tab-header">
                    <slot name="tab-buttons"></slot>
                </div>
                <div class="tab-content">
                    <slot name="tab-panels"></slot>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                const index = parseInt(e.target.dataset.index);
                this.setActiveTab(index);
            }
        });
    }
    
    setActiveTab(index) {
        this.activeTab = index;
        
        // Update buttons
        const buttons = this.shadowRoot.querySelectorAll('.tab-button');
        buttons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        // Update panels
        const panels = this.querySelectorAll('[slot="tab-panels"] > *');
        panels.forEach((panel, i) => {
            panel.style.display = i === index ? 'block' : 'none';
        });
    }
}

customElements.define('wb-tab-simple', WBTabSimple);