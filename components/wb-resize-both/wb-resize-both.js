// wb-resize-both.js
// Corner resize handle component for resizing parent containers in both directions

class WBResizeBoth extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State
        this.isResizing = false;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.targetElement = null;
        
        // Configuration
        this.minWidth = 200;
        this.maxWidth = 1200;
        this.minHeight = 100;
        this.maxHeight = 800;
        this.storageKey = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadSavedSize();
        
        console.log('✅ wb-resize-both: Connected');
    }

    disconnectedCallback() {
        this.cleanup();
    }

    static get observedAttributes() {
        return ['target', 'min-width', 'max-width', 'min-height', 'max-height', 'storage-key', 'corner', 'size'];
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
            case 'min-height':
                this.minHeight = parseInt(newValue) || 100;
                break;
            case 'max-height':
                this.maxHeight = parseInt(newValue) || 800;
                break;
            case 'storage-key':
                this.storageKey = newValue;
                this.loadSavedSize();
                break;
            case 'corner':
                this.updateCorner(newValue);
                break;
            case 'size':
                this.updateSize(newValue);
                break;
        }
    }

    render() {
        const size = this.getAttribute('size') || '16px';
        const corner = this.getAttribute('corner') || 'bottom-right'; // bottom-right, bottom-left, top-right, top-left
        
        const positionStyle = this.getCornerPosition(corner);
        const cursorStyle = this.getCorsorForCorner(corner);
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    ${positionStyle}
                    width: ${size};
                    height: ${size};
                    z-index: 1000;
                }

                .resize-handle {
                    width: 100%;
                    height: 100%;
                    cursor: ${cursorStyle};
                    transition: background 0.2s;
                    border-radius: 4px;
                }

                .resize-handle:hover {
                    background: rgba(99, 102, 241, 0.2);
                }

                .resize-handle.resizing {
                    background: rgba(99, 102, 241, 0.3);
                }
            </style>
            
            <div class="resize-handle" part="handle" title="Drag to resize"></div>
        `;
    }

    getCornerPosition(corner) {
        switch(corner) {
            case 'bottom-right':
                return 'bottom: 4px; right: 4px;';
            case 'bottom-left':
                return 'bottom: 4px; left: 4px;';
            case 'top-right':
                return 'top: 4px; right: 4px;';
            case 'top-left':
                return 'top: 4px; left: 4px;';
            default:
                return 'bottom: 4px; right: 4px;';
        }
    }

    getCorsorForCorner(corner) {
        switch(corner) {
            case 'bottom-right':
            case 'top-left':
                return 'nwse-resize';
            case 'bottom-left':
            case 'top-right':
                return 'nesw-resize';
            default:
                return 'nwse-resize';
        }
    }

    updateCorner(corner) {
        this.render();
    }

    updateSize(size) {
        this.style.width = size;
        this.style.height = size;
    }

    findTargetElement() {
        const targetSelector = this.getAttribute('target');
        
        if (!targetSelector) {
            // Default: resize parent element
            this.targetElement = this.parentElement;
            console.log('📐 wb-resize-both: Targeting parent element');
            return;
        }

        // Try to find target by selector
        this.targetElement = document.querySelector(targetSelector);
        
        if (!this.targetElement) {
            console.warn(`⚠️ wb-resize-both: Target element not found: ${targetSelector}`);
            this.targetElement = this.parentElement;
        } else {
            console.log(`📐 wb-resize-both: Targeting element: ${targetSelector}`);
        }
    }

    setupEventListeners() {
        const handle = this.shadowRoot.querySelector('.resize-handle');
        
        if (!handle) {
            console.error('❌ wb-resize-both: Handle not found');
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
            console.error('❌ wb-resize-both: No target element to resize');
            return;
        }

        this.isResizing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = this.targetElement.offsetWidth;
        this.startHeight = this.targetElement.offsetHeight;
        
        const corner = this.getAttribute('corner') || 'bottom-right';
        document.body.style.cursor = this.getCorsorForCorner(corner);
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
                startHeight: this.startHeight,
                startX: this.startX,
                startY: this.startY
            }
        }));

        console.log('🖱️ wb-resize-both: Started dragging at X:', this.startX, 'Y:', this.startY);
    }

    handleMouseMove(e) {
        if (!this.isResizing || !this.targetElement) return;

        const corner = this.getAttribute('corner') || 'bottom-right';
        
        let deltaX, deltaY;
        
        // Calculate deltas based on corner
        switch(corner) {
            case 'bottom-right':
                deltaX = e.clientX - this.startX;
                deltaY = e.clientY - this.startY;
                break;
            case 'bottom-left':
                deltaX = this.startX - e.clientX;
                deltaY = e.clientY - this.startY;
                break;
            case 'top-right':
                deltaX = e.clientX - this.startX;
                deltaY = this.startY - e.clientY;
                break;
            case 'top-left':
                deltaX = this.startX - e.clientX;
                deltaY = this.startY - e.clientY;
                break;
        }
        
        const newWidth = this.startWidth + deltaX;
        const newHeight = this.startHeight + deltaY;

        // Constrain dimensions
        const constrainedWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
        const constrainedHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight));
        
        this.targetElement.style.width = constrainedWidth + 'px';
        this.targetElement.style.height = constrainedHeight + 'px';

        // Dispatch resize event
        this.dispatchEvent(new CustomEvent('wb:resizing', {
            bubbles: true,
            composed: true,
            detail: {
                width: constrainedWidth,
                height: constrainedHeight,
                deltaX: deltaX,
                deltaY: deltaY
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

        // Save size if storage key provided
        if (this.storageKey && this.targetElement) {
            const currentWidth = this.targetElement.offsetWidth;
            const currentHeight = this.targetElement.offsetHeight;
            const size = { width: currentWidth, height: currentHeight };
            localStorage.setItem(this.storageKey, JSON.stringify(size));
            console.log('💾 wb-resize-both: Saved size:', size, 'to', this.storageKey);
        }

        // Dispatch resize end event
        const finalWidth = this.targetElement ? this.targetElement.offsetWidth : 0;
        const finalHeight = this.targetElement ? this.targetElement.offsetHeight : 0;
        
        this.dispatchEvent(new CustomEvent('wb:resize-end', {
            bubbles: true,
            composed: true,
            detail: {
                finalWidth: finalWidth,
                finalHeight: finalHeight
            }
        }));

        console.log('✅ wb-resize-both: Resize complete. Size:', finalWidth + 'x' + finalHeight);
    }

    loadSavedSize() {
        if (!this.storageKey) return;

        const savedSize = localStorage.getItem(this.storageKey);
        if (savedSize && this.targetElement) {
            try {
                const size = JSON.parse(savedSize);
                this.targetElement.style.width = size.width + 'px';
                this.targetElement.style.height = size.height + 'px';
                console.log('📐 wb-resize-both: Loaded saved size:', size);
            } catch (e) {
                console.error('❌ wb-resize-both: Failed to parse saved size');
            }
        }
    }

    // Public API methods
    setMinSize(width, height) {
        this.minWidth = width;
        this.minHeight = height;
        this.setAttribute('min-width', width);
        this.setAttribute('min-height', height);
    }

    setMaxSize(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
        this.setAttribute('max-width', width);
        this.setAttribute('max-height', height);
    }

    setTarget(selector) {
        this.setAttribute('target', selector);
    }

    getTargetSize() {
        if (!this.targetElement) return { width: 0, height: 0 };
        return {
            width: this.targetElement.offsetWidth,
            height: this.targetElement.offsetHeight
        };
    }
}

// Register the component
customElements.define('wb-resize-both', WBResizeBoth);

console.log('✅ wb-resize-both component registered');

export default WBResizeBoth;
