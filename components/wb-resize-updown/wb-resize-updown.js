import WBBaseComponent from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

// wb-resize-updown.js
// Vertical resize handle component for resizing parent containers up/down

class WBResizeUpDown extends WBBaseComponent {
    constructor() {
        super();
    }

    async connectedCallback() {
    super.connectedCallback();
        await loadComponentCSS(this, 'wb-resize-updown.css');
        this.init();
    }

    init() {
        ;
        
        // State
        this.isResizing = false;
        this.startY = 0;
        this.startHeight = 0;
        this.targetElement = null;
        
        // Configuration
        this.minHeight = 100;
        this.maxHeight = 600;
        this.storageKey = null;
    }

    connectedCallback() {
    super.connectedCallback();
        // Find target BEFORE rendering to prevent scroll issues
        this.findTargetElement();
        
        this.render();
        this.setupEventListeners();
        
        // Delay loading saved height to prevent scroll jump
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.loadSavedHeight();
            });
        });
        
        console.log('✅ wb-resize-updown: Connected');
    }

    disconnectedCallback() {
    super.connectedCallback();
        this.cleanup();
    }

    static get observedAttributes() {
        return ['target', 'min-height', 'max-height', 'storage-key', 'handle-height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'target':
                this.findTargetElement();
                break;
            case 'min-height':
                this.minHeight = parseInt(newValue) || 100;
                break;
            case 'max-height':
                this.maxHeight = parseInt(newValue) || 600;
                break;
            case 'storage-key':
                this.storageKey = newValue;
                this.loadSavedHeight();
                break;
            case 'handle-height':
                this.updateHandleHeight(newValue);
                break;
        }
    }

    render() {
        const handleHeight = this.getAttribute('handle-height') || '40px';
        
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: ${handleHeight};
                    z-index: 1000;
                }

                .resize-handle {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100%;
                    cursor: ns-resize;
                    transition: background 0.2s;
                }

                .resize-handle:hover {
                    background: rgba(99, 102, 241, 0.1);
                }

                .resize-handle.resizing {
                    background: rgba(99, 102, 241, 0.2);
                }
            </style>
            
            <div class="resize-handle" part="handle" title="Drag up/down to resize"></div>
        `;
    }

    updateHandleHeight(height) {
        const handle = this.querySelector('.resize-handle');
        if (handle) {
            this.style.height = height;
        }
    }

    findTargetElement() {
        const targetSelector = this.getAttribute('target');
        
        if (!targetSelector) {
            // Default: resize parent element
            this.targetElement = this.parentElement;
            console.log('📐 wb-resize-updown: Targeting parent element');
            return;
        }

        // Try to find target by selector
        this.targetElement = document.querySelector(targetSelector);
        
        if (!this.targetElement) {
            console.warn(`⚠️ wb-resize-updown: Target element not found: ${targetSelector}`);
            this.targetElement = this.parentElement;
        } else {
            console.log(`📐 wb-resize-updown: Targeting element: ${targetSelector}`);
        }
    }

    setupEventListeners() {
        const handle = this.querySelector('.resize-handle');
        
        if (!handle) {
            console.error('❌ wb-resize-updown: Handle not found');
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
            console.error('❌ wb-resize-updown: No target element to resize');
            return;
        }

        this.isResizing = true;
        this.startY = e.clientY;
        this.startHeight = this.targetElement.offsetHeight;
        
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        
        const handle = this.querySelector('.resize-handle');
        handle.classList.add('resizing');
        
        e.preventDefault();
        
        // Dispatch resize start event
        this.dispatchEvent(new CustomEvent('wb:resize-start', {
            bubbles: true,
            composed: true,
            detail: {
                startHeight: this.startHeight,
                startY: this.startY
            }
        }));

        console.log('🖱️ wb-resize-updown: Started dragging at Y:', this.startY, 'Height:', this.startHeight);
    }

    handleMouseMove(e) {
        if (!this.isResizing || !this.targetElement) return;

        // Drag UP (toward top) = increase height
        // Since element is at bottom, dragging up makes it taller
        const deltaY = this.startY - e.clientY;
        const newHeight = this.startHeight + deltaY;

        // Constrain height
        const constrainedHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight));
        
        this.targetElement.style.height = constrainedHeight + 'px';

        // Shrink previous sibling if it exists
        const prevSibling = this.targetElement.previousElementSibling;
        if (prevSibling && prevSibling.style.flex) {
            // If the previous element uses flexbox, it will automatically shrink
            // No action needed
        }

        // Dispatch resize event
        this.dispatchEvent(new CustomEvent('wb:resizing', {
            bubbles: true,
            composed: true,
            detail: {
                height: constrainedHeight,
                deltaY: deltaY
            }
        }));
    }

    handleMouseUp(e) {
        if (!this.isResizing) return;

        this.isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        const handle = this.querySelector('.resize-handle');
        handle.classList.remove('resizing');

        // Save height if storage key provided
        if (this.storageKey && this.targetElement) {
            const currentHeight = this.targetElement.offsetHeight;
            localStorage.setItem(this.storageKey, currentHeight);
            console.log('💾 wb-resize-updown: Saved height:', currentHeight + 'px', 'to', this.storageKey);
        }

        // Dispatch resize end event
        const finalHeight = this.targetElement ? this.targetElement.offsetHeight : 0;
        this.dispatchEvent(new CustomEvent('wb:resize-end', {
            bubbles: true,
            composed: true,
            detail: {
                finalHeight: finalHeight
            }
        }));

        console.log('✅ wb-resize-updown: Resize complete. Final height:', finalHeight + 'px');
    }

    loadSavedHeight() {
        if (!this.storageKey) return;

        const savedHeight = localStorage.getItem(this.storageKey);
        if (savedHeight && this.targetElement) {
            // Store current scroll positions BEFORE changing height
            const windowScrollY = window.scrollY;
            const docScrollTop = document.documentElement.scrollTop;
            
            // Change the height
            this.targetElement.style.height = savedHeight + 'px';
            
            // IMMEDIATELY restore scroll positions to prevent browser from scrolling
            window.scrollTo(0, windowScrollY);
            document.documentElement.scrollTop = docScrollTop;
            
            // Force to top if we're on initial load
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                
                // Also force the content div to top
                const content = this.targetElement.querySelector('#event-log-content');
                if (content) {
                    content.scrollTop = 0;
                }
            });
            
            console.log('📐 wb-resize-updown: Loaded saved height:', savedHeight + 'px');
        }
    }

    // Public API methods
    setMinHeight(height) {
        this.minHeight = height;
        this.setAttribute('min-height', height);
    }

    setMaxHeight(height) {
        this.maxHeight = height;
        this.setAttribute('max-height', height);
    }

    setTarget(selector) {
        this.setAttribute('target', selector);
    }

    getTargetHeight() {
        return this.targetElement ? this.targetElement.offsetHeight : 0;
    }
}

// Register the component
customElements.define('wb-resize-updown', WBResizeUpDown);

console.log('✅ wb-resize-updown component registered');

export default WBResizeUpDown;

