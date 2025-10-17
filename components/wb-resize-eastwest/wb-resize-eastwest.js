// wb-resize-eastwest.js
// Horizontal resize handle component for resizing parent containers left/right

class WBResizeEastWest extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State
        this.isResizing = false;
        this.startX = 0;
        this.startWidth = 0;
        this.targetElement = null;
        
        // Configuration
        this.minWidth = 200;
        this.maxWidth = 1200;
        this.storageKey = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadSavedWidth();
        
        console.log('✅ wb-resize-eastwest: Connected');
    }

    disconnectedCallback() {
        this.cleanup();
    }

    static get observedAttributes() {
        return ['target', 'min-width', 'max-width', 'storage-key', 'handle-width', 'side'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'target':
                this.findTargetElement();
                break;
            case 'min-width':
                this.minWidth = parseInt(newValue) || 200;
                break;
            case 'max-width':
                this.maxWidth = parseInt(newValue) || 1200;
                break;
            case 'storage-key':
                this.storageKey = newValue;
                this.loadSavedWidth();
                break;
            case 'handle-width':
                this.updateHandleWidth(newValue);
                break;
            case 'side':
                this.updateSide(newValue);
                break;
        }
    }

    render() {
        const handleWidth = this.getAttribute('handle-width') || '8px';
        const side = this.getAttribute('side') || 'right'; // 'left' or 'right'
        
        const positionStyle = side === 'left' ? 'left: 0;' : 'right: 0;';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    ${positionStyle}
                    top: 0;
                    bottom: 0;
                    width: ${handleWidth};
                    z-index: 1000;
                }

                .resize-handle {
                    width: 100%;
                    height: 100%;
                    cursor: ew-resize;
                    transition: background 0.2s;
                }

                .resize-handle:hover {
                    background: rgba(99, 102, 241, 0.1);
                }

                .resize-handle.resizing {
                    background: rgba(99, 102, 241, 0.2);
                }
            </style>
            
            <div class="resize-handle" part="handle" title="Drag left/right to resize"></div>
        `;
    }

    updateHandleWidth(width) {
        this.style.width = width;
    }

    updateSide(side) {
        if (side === 'left') {
            this.style.left = '0';
            this.style.right = 'auto';
        } else {
            this.style.right = '0';
            this.style.left = 'auto';
        }
    }

    findTargetElement() {
        const targetSelector = this.getAttribute('target');
        
        if (!targetSelector) {
            // Default: resize parent element
            this.targetElement = this.parentElement;
            console.log('📐 wb-resize-eastwest: Targeting parent element');
            return;
        }

        // Try to find target by selector
        this.targetElement = document.querySelector(targetSelector);
        
        if (!this.targetElement) {
            console.warn(`⚠️ wb-resize-eastwest: Target element not found: ${targetSelector}`);
            this.targetElement = this.parentElement;
        } else {
            console.log(`📐 wb-resize-eastwest: Targeting element: ${targetSelector}`);
        }
    }

    setupEventListeners() {
        const handle = this.shadowRoot.querySelector('.resize-handle');
        
        if (!handle) {
            console.error('❌ wb-resize-eastwest: Handle not found');
            return;
        }

        handle.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    cleanup() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown(e) {
        if (!this.targetElement) {
            this.findTargetElement();
        }

        if (!this.targetElement) {
            console.error('❌ wb-resize-eastwest: No target element to resize');
            return;
        }

        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.targetElement.offsetWidth;
        
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        
        const handle = this.shadowRoot.querySelector('.resize-handle');
        handle.classList.add('resizing');
        
        e.preventDefault();
        
        // Dispatch resize start event
        this.dispatchEvent(new CustomEvent('wb:resize-start', {
            bubbles: true,
            composed: true,
            detail: {
                startWidth: this.startWidth,
                startX: this.startX
            }
        }));

        console.log('🖱️ wb-resize-eastwest: Started dragging at X:', this.startX, 'Width:', this.startWidth);
    }

    handleMouseMove(e) {
        if (!this.isResizing || !this.targetElement) return;

        const side = this.getAttribute('side') || 'right';
        
        // Calculate delta based on side
        const deltaX = side === 'right' 
            ? e.clientX - this.startX  // Right side: drag right = wider
            : this.startX - e.clientX; // Left side: drag left = wider
            
        const newWidth = this.startWidth + deltaX;

        // Constrain width
        const constrainedWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
        
        this.targetElement.style.width = constrainedWidth + 'px';

        // Dispatch resize event
        this.dispatchEvent(new CustomEvent('wb:resizing', {
            bubbles: true,
            composed: true,
            detail: {
                width: constrainedWidth,
                deltaX: deltaX
            }
        }));
    }

    handleMouseUp(e) {
        if (!this.isResizing) return;

        this.isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        const handle = this.shadowRoot.querySelector('.resize-handle');
        handle.classList.remove('resizing');

        // Save width if storage key provided
        if (this.storageKey && this.targetElement) {
            const currentWidth = this.targetElement.offsetWidth;
            localStorage.setItem(this.storageKey, currentWidth);
            console.log('💾 wb-resize-eastwest: Saved width:', currentWidth + 'px', 'to', this.storageKey);
        }

        // Dispatch resize end event
        const finalWidth = this.targetElement ? this.targetElement.offsetWidth : 0;
        this.dispatchEvent(new CustomEvent('wb:resize-end', {
            bubbles: true,
            composed: true,
            detail: {
                finalWidth: finalWidth
            }
        }));

        console.log('✅ wb-resize-eastwest: Resize complete. Final width:', finalWidth + 'px');
    }

    loadSavedWidth() {
        if (!this.storageKey) return;

        const savedWidth = localStorage.getItem(this.storageKey);
        if (savedWidth && this.targetElement) {
            this.targetElement.style.width = savedWidth + 'px';
            console.log('📐 wb-resize-eastwest: Loaded saved width:', savedWidth + 'px');
        }
    }

    // Public API methods
    setMinWidth(width) {
        this.minWidth = width;
        this.setAttribute('min-width', width);
    }

    setMaxWidth(width) {
        this.maxWidth = width;
        this.setAttribute('max-width', width);
    }

    setTarget(selector) {
        this.setAttribute('target', selector);
    }

    getTargetWidth() {
        return this.targetElement ? this.targetElement.offsetWidth : 0;
    }
}

// Register the component
customElements.define('wb-resize-eastwest', WBResizeEastWest);

console.log('✅ wb-resize-eastwest component registered');

export default WBResizeEastWest;
