// Semantic Elements Popup JavaScript
class SemanticElementsPopup {
    constructor() {
        this.popup = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.popup = document.getElementById('semanticPopup');
        
        if (this.popup) {
            // Close popup when clicking outside content
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    this.hideSemanticPopup();
                }
            });
        }

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hideSemanticPopup();
            }
        });

        // Setup dialog functionality
        this.setupDialogExample();
    }

    showSemanticPopup() {
        if (this.popup) {
            this.popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            // Focus trap for accessibility
            this.trapFocus();
        }
    }

    hideSemanticPopup() {
        if (this.popup) {
            this.popup.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.isOpen = false;
        }
    }

    trapFocus() {
        if (!this.popup) return;

        const focusableElements = this.popup.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus the close button initially
        const closeButton = this.popup.querySelector('.close-popup');
        if (closeButton) {
            closeButton.focus();
        }

        this.popup.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    setupDialogExample() {
        // Setup the dialog example functionality
        const dialog = document.getElementById('exampleDialog');
        if (dialog) {
            // Make sure the dialog is initially closed
            if (dialog.open) {
                dialog.close();
            }
        }
    }

    // Theme integration method
    updateTheme(primaryColor, accentColor = null) {
        if (!primaryColor) return;

        const root = document.documentElement;
        root.style.setProperty('--theme-primary', primaryColor);
        
        if (accentColor) {
            root.style.setProperty('--theme-accent', accentColor);
        }

        // Update progress and meter elements
        const progressElements = document.querySelectorAll('progress, meter');
        progressElements.forEach(element => {
            element.style.accentColor = primaryColor;
        });

        // Update time elements
        const timeElements = document.querySelectorAll('time');
        timeElements.forEach(element => {
            element.style.color = primaryColor;
        });
    }

    // Utility method to generate semantic HTML content dynamically
    generateSemanticContent(theme = {}) {
        const {
            primaryColor = '#3498db',
            accentColor = '#f39c12',
            backgroundColor = '#1a1a2e'
        } = theme;

        return `
            <div class="semantic-section" style="border-color: ${primaryColor};">
                <h3 style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">🎨 Dynamic Content</h3>
                
                <header style="background: ${primaryColor};">
                    <h4>&lt;header&gt;</h4>
                    <p>Dynamically themed header element</p>
                </header>
                
                <nav style="background: ${accentColor};">
                    <h4>&lt;nav&gt;</h4>
                    <p>Navigation with custom accent color</p>
                </nav>
                
                <main style="border-left-color: ${primaryColor};">
                    <h4>&lt;main&gt;</h4>
                    <p>Main content area with themed border</p>
                </main>
            </div>
        `;
    }

    // Method to add dynamic content
    addDynamicContent(theme) {
        const grid = document.querySelector('.semantic-grid');
        if (grid) {
            const dynamicContent = document.createElement('div');
            dynamicContent.innerHTML = this.generateSemanticContent(theme);
            grid.appendChild(dynamicContent.firstElementChild);
        }
    }
}

// Global functions for backward compatibility
function showSemanticPopup() {
    if (window.semanticPopup) {
        window.semanticPopup.showSemanticPopup();
    }
}

function hideSemanticPopup() {
    if (window.semanticPopup) {
        window.semanticPopup.hideSemanticPopup();
    }
}

function openDialog() {
    const dialog = document.getElementById('exampleDialog');
    if (dialog) {
        dialog.showModal();
    }
}

function closeDialog() {
    const dialog = document.getElementById('exampleDialog');
    if (dialog) {
        dialog.close();
    }
}

// Theme integration functions
function updateSemanticTheme(primaryColor, accentColor) {
    if (window.semanticPopup) {
        window.semanticPopup.updateTheme(primaryColor, accentColor);
    }
}

function addDynamicSemanticContent(theme) {
    if (window.semanticPopup) {
        window.semanticPopup.addDynamicContent(theme);
    }
}

// Initialize the popup system
window.semanticPopup = new SemanticElementsPopup();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SemanticElementsPopup,
        showSemanticPopup,
        hideSemanticPopup,
        updateSemanticTheme,
        addDynamicSemanticContent
    };
}

// AMD support
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return {
            SemanticElementsPopup,
            showSemanticPopup,
            hideSemanticPopup,
            updateSemanticTheme,
            addDynamicSemanticContent
        };
    });
}