// WB Resize Component
// Provides drag and resize functionality for any container element

// Use WBBaseComponent from window if available, otherwise extend HTMLElement
const BaseClass = window.WBBaseComponent || HTMLElement;

class WBResizePanel extends BaseClass {
    constructor() {
        super();
        
        console.log('🔧 WB Resize: Starting initialization...');

        this.isDragging = false;
        this.isResizing = false;
        this.startX = 0;
        this.startY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.initialWidth = 0;
        this.initialHeight = 0;
        this.targetElement = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.findTarget();
    }

    disconnectedCallback() {
        // Clean up global event listeners
        document.removeEventListener('mousemove', this.boundOnMouseMove);
        document.removeEventListener('mouseup', this.boundOnMouseUp);
    }

    render() {
        this.innerHTML = `
            <div class="wb-resize-controls">
                <button
                    class="wb-resize-drag-handle"
                    id="drag-handle"
                    title="Drag to move"
                    aria-label="Drag to move element">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
                        <path d="M10 6V14M6 10H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>

                <button
                    class="wb-resize-resize-handle"
                    id="resize-handle"
                    title="Drag to resize width and height"
                    aria-label="Resize element">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 6L18 10L14 14M6 14L2 10L6 6M10 2L10 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
    }

    findTarget() {
        // Find the parent element that should be made draggable/resizable
        const targetSelector = this.getAttribute('target');

        if (targetSelector) {
            this.targetElement = document.querySelector(targetSelector);
        } else {
            // Default to parent element
            this.targetElement = this.parentElement;
        }

        if (!this.targetElement) {
            console.error('🔧 WB Resize: No target element found');
            console.warn('Make sure element has id or target attribute is set');
            return;
        }

        // Ensure target has position set
        if (this.targetElement instanceof HTMLElement) {
            if (!this.targetElement.style.position || this.targetElement.style.position === 'static') {
                this.targetElement.style.position = 'fixed';
            }
        }

        console.log('🔧 WB Resize: Target element found:', this.targetElement);
    }

    setupEventListeners() {
        const dragHandle = this.querySelector('#drag-handle');
        const resizeHandle = this.querySelector('#resize-handle');

        // Drag functionality
        if (dragHandle) dragHandle.addEventListener('mousedown', (e) => this.startDrag(e));

        // Resize functionality
        if (resizeHandle) resizeHandle.addEventListener('mousedown', (e) => this.startResize(e));

        // Bind methods to preserve 'this' context
        this.boundOnMouseMove = (e) => this.onMouseMove(e);
        this.boundOnMouseUp = () => this.onMouseUp();

        // Global mouse move and up
        document.addEventListener('mousemove', this.boundOnMouseMove);
        document.addEventListener('mouseup', this.boundOnMouseUp);

        // Hover effects
        if (dragHandle) {
            dragHandle.addEventListener('mouseenter', () => {
                dragHandle.style.transform = 'scale(1.1)';
                dragHandle.style.opacity = '1';
            });
            dragHandle.addEventListener('mouseleave', () => {
                if (!this.isDragging) {
                    dragHandle.style.transform = 'scale(1)';
                    dragHandle.style.opacity = '0.85';
                }
            });
        }
        if (resizeHandle) {
            resizeHandle.addEventListener('mouseenter', () => {
                resizeHandle.style.transform = 'scale(1.1)';
                resizeHandle.style.opacity = '1';
            });
            resizeHandle.addEventListener('mouseleave', () => {
                if (!this.isResizing) {
                    resizeHandle.style.transform = 'scale(1)';
                    resizeHandle.style.opacity = '0.85';
                }
            });
        }
    }

    startDrag(e) {
        if (!this.targetElement) return;

        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        const rect = this.targetElement.getBoundingClientRect();
        this.initialX = rect.left;
        this.initialY = rect.top;

        const dragHandle = this.querySelector('#drag-handle');
        if (dragHandle) {
            dragHandle.style.transform = 'scale(0.95)';
            dragHandle.style.cursor = 'grabbing';
        }

        // Disable transitions during drag
        if (this.targetElement instanceof HTMLElement) {
            this.targetElement.style.transition = 'none';
        }

        e.preventDefault();
        e.stopPropagation();

        console.log('🔧 WB Resize: Drag started');
    }

    startResize(e) {
        if (!this.targetElement) return;

        this.isResizing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        const rect = this.targetElement.getBoundingClientRect();
        this.initialWidth = rect.width;
        this.initialHeight = rect.height;

        const resizeHandle = this.querySelector('#resize-handle');
        if (resizeHandle) resizeHandle.style.transform = 'scale(0.95)';

        // Disable transitions during resize
        if (this.targetElement instanceof HTMLElement) {
            this.targetElement.style.transition = 'none';
        }

        e.preventDefault();
        e.stopPropagation();

        console.log('🔧 WB Resize: Resize started');
    }

    onMouseMove(e) {
        if (this.isDragging && this.targetElement instanceof HTMLElement) {
            const deltaX = e.clientX - this.startX;
            const deltaY = e.clientY - this.startY;
            this.targetElement.style.left = (this.initialX + deltaX) + 'px';
            this.targetElement.style.top = (this.initialY + deltaY) + 'px';
        } else if (this.isResizing && this.targetElement instanceof HTMLElement) {
            const deltaX = e.clientX - this.startX;
            const deltaY = e.clientY - this.startY;
            // Calculate new dimensions
            const newWidth = Math.max(200, this.initialWidth + deltaX);
            const newHeight = Math.max(100, this.initialHeight + deltaY);
            this.targetElement.style.width = newWidth + 'px';
            this.targetElement.style.height = newHeight + 'px';
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;

            const dragHandle = this.querySelector('#drag-handle');
            if (dragHandle) {
                dragHandle.style.transform = 'scale(1)';
                dragHandle.style.cursor = 'grab';
            }

            // Re-enable transitions
            if (this.targetElement instanceof HTMLElement) {
                this.targetElement.style.transition = '';
            }

            // Save position
            const rect = this.targetElement.getBoundingClientRect();
            localStorage.setItem(`wb-resize-${this.targetElement.id || 'element'}-x`, String(rect.left));
            localStorage.setItem(`wb-resize-${this.targetElement.id || 'element'}-y`, String(rect.top));

            console.log('🔧 WB Resize: Drag completed');

            // Dispatch event
            this.dispatchEvent(new CustomEvent('wb:resize:moved', {
                bubbles: true,
                detail: { x: rect.left, y: rect.top }
            }));
        }

        if (this.isResizing) {
            this.isResizing = false;

            const resizeHandle = this.querySelector('#resize-handle');
            if (resizeHandle) resizeHandle.style.transform = 'scale(1)';

            // Re-enable transitions
            if (this.targetElement instanceof HTMLElement) {
                this.targetElement.style.transition = '';
            }

            // Save dimensions
            const rect = this.targetElement.getBoundingClientRect();
            localStorage.setItem(`wb-resize-${this.targetElement.id || 'element'}-width`, String(rect.width));
            localStorage.setItem(`wb-resize-${this.targetElement.id || 'element'}-height`, String(rect.height));

            console.log('🔧 WB Resize: Resize completed');

            // Dispatch event
            this.dispatchEvent(new CustomEvent('wb:resize:resized', {
                bubbles: true,
                detail: { width: rect.width, height: rect.height }
            }));
        }
    }

    // Public API
    restoreState() {
        if (!this.targetElement) return;

        const elementId = this.targetElement.id || 'element';
        const savedX = localStorage.getItem(`wb-resize-${elementId}-x`);
        const savedY = localStorage.getItem(`wb-resize-${elementId}-y`);
        const savedWidth = localStorage.getItem(`wb-resize-${elementId}-width`);
        const savedHeight = localStorage.getItem(`wb-resize-${elementId}-height`);

        if (!this.targetElement || !(this.targetElement instanceof HTMLElement)) return;
        
        if (savedX) this.targetElement.style.left = savedX + 'px';
        if (savedY) this.targetElement.style.top = savedY + 'px';
        if (savedWidth) this.targetElement.style.width = savedWidth + 'px';
        if (savedHeight) this.targetElement.style.height = savedHeight + 'px';
    }
}

// Register the custom element
if (!customElements.get('wb-resize')) {
    customElements.define('wb-resize', WBResizePanel);
    console.log('✅ WB Resize: Component registered');
}
