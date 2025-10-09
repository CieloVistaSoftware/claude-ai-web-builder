/**
 * WB Change Text Component
 * Web Component for direct inline text editing using contenteditable
 */
class WBChangeText extends HTMLElement {
    constructor() {
        super();
        this.isEditModeEnabled = false;
        this.editingElements = new Map(); // Track original content
        this.initialized = false;
        
        // Target selectors
        this.targetSelectors = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer', 
                               'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'li', 'td', 'th'];
        
        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
    }
    
    static get observedAttributes() {
        return ['edit-mode', 'target-selectors'];
    }
    
    connectedCallback() {
        if (!this.initialized) {
            this.init();
        }
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.initialized) return;
        
        switch (name) {
            case 'edit-mode':
                this.setEditMode(newValue === 'true' || newValue === '');
                break;
            case 'target-selectors':
                if (newValue) {
                    this.targetSelectors = newValue.split(',').map(s => s.trim());
                }
                break;
        }
    }
    
    async init() {
        try {
            console.log('✏️ WB Change Text: Starting initialization...');
            
            // Load CSS
            this.loadCSS();
            
            // Setup component
            this.setupComponent();
            this.setupEventListeners();
            
            this.initialized = true;
            
            // Dispatch ready event
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('wb-change-text-ready', {
                    bubbles: true,
                    detail: { 
                        component: this,
                        isEditModeEnabled: this.isEditModeEnabled 
                    }
                }));
                console.log('✏️ WB Change Text: Ready!');
            }, 100);
            
        } catch (error) {
            console.error('✏️ WB Change Text: Initialization failed', error);
        }
    }
    
    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-change-text.js', '../components/wb-change-text/') + 'wb-change-text.css';
            window.WBComponentUtils.loadCSS('wb-change-text', cssPath);
        } else {
            // Fallback CSS loading
            if (document.getElementById('wb-change-text-styles')) return;
            
            const link = document.createElement('link');
            link.id = 'wb-change-text-styles';
            link.rel = 'stylesheet';
            link.href = '../components/wb-change-text/wb-change-text.css';
            document.head.appendChild(link);
        }
    }
    
    setupComponent() {
        this.className = 'wb-change-text';
        this.setAttribute('role', 'application');
        this.setAttribute('aria-label', 'Text editing component');
        
        // Hide the component itself - it's just a controller
        this.style.display = 'none';
        
        // Check initial edit mode from attribute
        const editMode = this.getAttribute('edit-mode');
        if (editMode === 'true' || editMode === '') {
            this.setEditMode(true);
        }
    }
    
    setupEventListeners() {
        // Use capturing phase to catch clicks before other handlers
        document.addEventListener('click', this.handleClick, true);
        document.addEventListener('blur', this.handleBlur, true);
        document.addEventListener('keydown', this.handleKeydown, true);
        document.addEventListener('paste', this.handlePaste, true);
        
        // Listen for edit mode events
        document.addEventListener('editModeEnabled', () => this.setEditMode(true));
        document.addEventListener('editModeDisabled', () => this.setEditMode(false));
        document.addEventListener('editModeChanged', (e) => {
            if (e.detail && typeof e.detail.enabled !== 'undefined') {
                this.setEditMode(e.detail.enabled);
            }
        });
        
        // Listen for wb-edit-mode events
        document.addEventListener('wb:editModeOn', () => this.setEditMode(true));
        document.addEventListener('wb:editModeOff', () => this.setEditMode(false));
    }
    
    cleanup() {
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('blur', this.handleBlur, true);
        document.removeEventListener('keydown', this.handleKeydown, true);
        document.removeEventListener('paste', this.handlePaste, true);
    }
    
    // Make element editable
    makeEditable(element) {
        if (!element || element.isContentEditable) return;
        
        // Store original content
        this.editingElements.set(element, element.innerHTML);
        
        // Make editable
        element.contentEditable = 'true';
        element.classList.add('wb-change-text-editable');
        
        // Focus element
        element.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Dispatch edit start event
        this.dispatchCustomEvent('wb:changeTextEdit', {
            element: element,
            content: element.innerHTML
        });
    }
    
    // Make element non-editable
    makeNonEditable(element) {
        if (!element || !element.isContentEditable) return;
        
        element.contentEditable = 'false';
        element.classList.remove('wb-change-text-editable');
        
        // Get original content
        const originalContent = this.editingElements.get(element);
        const newContent = element.innerHTML;
        
        // Clean up stored content
        this.editingElements.delete(element);
        
        // Dispatch save event
        this.dispatchCustomEvent('wb:changeTextSave', {
            element: element,
            oldContent: originalContent,
            newContent: newContent
        });
    }
    
    // Handle clicks
    handleClick(e) {
        if (!this.isEditModeEnabled) return;
        
        const target = e.target;
        
        // Check if target is editable element
        const isTargetEditable = this.targetSelectors.some(selector => 
            target.matches(selector) || target.closest(selector)
        );
        
        if (isTargetEditable && !target.isContentEditable) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the actual element to edit
            let elementToEdit = target;
            for (const selector of this.targetSelectors) {
                if (target.matches(selector)) {
                    elementToEdit = target;
                    break;
                } else if (target.closest(selector)) {
                    elementToEdit = target.closest(selector);
                    break;
                }
            }
            
            this.makeEditable(elementToEdit);
        }
    }
    
    // Handle blur (when clicking outside)
    handleBlur(e) {
        if (e.target.isContentEditable) {
            this.makeNonEditable(e.target);
        }
    }
    
    // Handle keyboard shortcuts
    handleKeydown(e) {
        if (!e.target.isContentEditable) return;
        
        // Save on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.makeNonEditable(e.target);
        }
        
        // Cancel on Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            const originalContent = this.editingElements.get(e.target);
            if (originalContent !== undefined) {
                e.target.innerHTML = originalContent;
            }
            this.makeNonEditable(e.target);
            
            // Dispatch cancel event
            this.dispatchCustomEvent('wb:changeTextCancel', {
                element: e.target
            });
        }
        
        // Save on Ctrl+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.makeNonEditable(e.target);
        }
    }
    
    // Handle paste - strip formatting
    handlePaste(e) {
        if (!e.target.isContentEditable) return;
        
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
        selection.collapseToEnd();
    }
    
    // Set edit mode
    setEditMode(enabled) {
        console.log('✏️ WB Change Text: Setting edit mode to:', enabled);
        this.isEditModeEnabled = enabled;
        
        // Update attribute to reflect state
        if (enabled) {
            this.setAttribute('edit-mode', 'true');
        } else {
            this.removeAttribute('edit-mode');
        }
        
        // Update cursor style for all elements
        if (enabled) {
            document.body.classList.add('wb-change-text-enabled');
            this.addDynamicStyles();
        } else {
            document.body.classList.remove('wb-change-text-enabled');
            // End any active editing
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                this.makeNonEditable(el);
            });
        }
    }
    
    // Add dynamic CSS styles
    addDynamicStyles() {
        if (document.getElementById('wb-change-text-dynamic-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'wb-change-text-dynamic-styles';
        style.textContent = `
            .wb-change-text-enabled ${this.targetSelectors.join(', .wb-change-text-enabled ')} {
                cursor: pointer !important;
                transition: all 0.2s ease;
            }
            
            .wb-change-text-enabled ${this.targetSelectors.join(':hover, .wb-change-text-enabled ')}:hover {
                outline: 2px dashed var(--primary, #6366f1);
                outline-offset: 2px;
            }
            
            [contenteditable="true"] {
                outline: 2px solid var(--primary, #6366f1) !important;
                outline-offset: 2px !important;
                cursor: text !important;
                background: rgba(99, 102, 241, 0.05);
                border-radius: 4px;
                padding: 2px 4px;
                min-height: 1.2em;
                min-width: 20px;
                display: inline-block;
            }
            
            [contenteditable="true"]:focus {
                outline: 3px solid var(--primary, #6366f1) !important;
                background: rgba(99, 102, 241, 0.1);
            }
            
            /* Prevent nested contenteditable */
            [contenteditable="true"] * {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Dispatch custom events
    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: {
                component: 'wb-change-text',
                ...detail
            }
        });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    enable() {
        this.setEditMode(true);
    }
    
    disable() {
        this.setEditMode(false);
    }
    
    isEnabled() {
        return this.isEditModeEnabled;
    }
    
    // Direct editing
    edit(element) {
        if (element) {
            this.setEditMode(true);
            this.makeEditable(element);
        }
    }
    
    // Save any active edits
    saveAll() {
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            this.makeNonEditable(el);
        });
    }
}

// Register the component
customElements.define('wb-change-text', WBChangeText);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-change-text', WBChangeText, ['wb-event-log'], {
        version: '1.0.0',
        type: 'utility',
        role: 'ui-element',
        description: 'Interactive text editing component with edit mode and target selector support',
        api: {
            static: ['create'],
            events: ['text-changed', 'edit-started', 'edit-completed'],
            attributes: ['edit-mode', 'target-selectors'],
            methods: ['startEdit', 'completeEdit', 'setTargets', 'render']
        },
        priority: 5 // Utility component depends on infrastructure
    });
}

// Global API for backward compatibility
window.WBChangeText = {
    create: function(options = {}) {
        const component = document.createElement('wb-change-text');
        if (options.editMode) component.setAttribute('edit-mode', 'true');
        if (options.targetSelectors) component.setAttribute('target-selectors', options.targetSelectors.join(','));
        return component;
    },
    
    enable: function() {
        const component = document.querySelector('wb-change-text') || this.create({ editMode: true });
        if (!component.parentNode) document.body.appendChild(component);
        component.enable();
    },
    
    disable: function() {
        const component = document.querySelector('wb-change-text');
        if (component) component.disable();
    },
    
    setEditMode: function(enabled) {
        if (enabled) this.enable();
        else this.disable();
    },
    
    isEnabled: function() {
        const component = document.querySelector('wb-change-text');
        return component ? component.isEnabled() : false;
    }
};

console.log('✏️ WB Change Text component loaded successfully');