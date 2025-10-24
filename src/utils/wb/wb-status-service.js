// Website Builder Status Service
// Centralized status messaging and file import utilities

(function() {
    'use strict';
    
    /**
     * Status Service - Manages status messages, file imports, and status bar functionality
     */
    const StatusService = {
        // Configuration
        config: {
            defaultTimeout: 5000, // Auto-clear messages after 5 seconds
            enableAutoTimeout: false, // Disabled by default
            enableConsoleLogging: true,
            validStatusTypes: ['info', 'success', 'warning', 'error']
        },
        
        // Internal state
        state: {
            initialized: false,
            currentMessage: null,
            currentType: 'info',
            timeoutId: null,
            elements: {}
        },
        
        /**
         * Initialize the status service
         */
        init() {
            if (this.state.initialized) return;
            
            try {
                this.cacheElements();
                this.setupEventListeners();
                this.initializeStatusBar();
                this.state.initialized = true;
                
                this.log('Status Service initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Status Service:', error);
            }
        },
        
        /**
         * Cache DOM elements for performance
         */
        cacheElements() {
            this.state.elements = {
                statusMessage: document.getElementById('status-message'),
                statusInfo: document.getElementById('status-info'),
                statusActions: document.getElementById('status-actions'),
                importBtn: document.getElementById('import-btn'),
                importInput: document.getElementById('import-html-input'),
                stackFilesBtn: document.getElementById('stack-files-btn'),
                // Try to find wb-status component as fallback
                wbStatusBar: document.getElementById('main-status-bar')
            };
            
            // No validation - allow service to work without specific elements
            // This makes it compatible with different page layouts
        },
        
        /**
         * Setup event listeners for file handling and other interactions
         */
        setupEventListeners() {
            const { elements } = this.state;
            
            // File import handling
            if (elements.importBtn && elements.importInput) {
                elements.importBtn.addEventListener('click', () => {
                    this.log('Import button clicked');
                    elements.importInput.click();
                });
                
                elements.importInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.handleFileImport(file);
                    }
                });
            }
            
            // Stack files button (placeholder for future functionality)
            if (elements.stackFilesBtn) {
                elements.stackFilesBtn.addEventListener('click', () => {
                    this.updateStatus('Stack Files feature coming soon', 'info');
                });
            }
            
            // Listen for edit mode changes to update status info
            document.addEventListener('editModeChanged', (e) => {
                this.updateEditModeStatus(e.detail.enabled);
            });
        },
        
        /**
         * Initialize status bar with default state
         */
        initializeStatusBar() {
            this.updateStatus('Website Builder loaded - Ready to edit', 'success');
            this.updateEditModeStatus(false);
        },
        
        /**
         * Update status message with type and optional auto-clear
         * @param {string} message - The status message to display
         * @param {string} type - Message type: 'info', 'success', 'warning', 'error'
         * @param {number} timeout - Optional timeout in ms (overrides default)
         */
        updateStatus(message, type = 'info', timeout = null) {
            // Validate inputs
            if (!message || typeof message !== 'string') {
                console.warn('StatusService: Invalid message provided');
                return;
            }
            
            if (!this.config.validStatusTypes.includes(type)) {
                console.warn(`StatusService: Invalid type '${type}', defaulting to 'info'`);
                type = 'info';
            }
            
            const { statusMessage, wbStatusBar } = this.state.elements;
            
            // Try wb-status component first, then fallback to traditional status element
            if (wbStatusBar && wbStatusBar.addEvent) {
                // Use wb-status component
                wbStatusBar.addEvent(message, type);
                this.log(`Status updated via wb-status: ${message} (${type})`);
                return;
            } else if (statusMessage) {
                // Use traditional status element
                // Continue with existing logic below
            } else {
                console.warn('StatusService: No status display element available');
                // Still log the status
                this.log(`Status (no display): ${message} (${type})`);
                return;
            }
            
            try {
                // Clear any existing timeout
                this.clearStatusTimeout();
                
                // Remove all status classes
                this.config.validStatusTypes.forEach(cls => {
                    statusMessage.classList.remove(cls);
                });
                
                // Add the appropriate class and set message
                statusMessage.classList.add(type);
                statusMessage.textContent = message;
                
                // Update internal state
                this.state.currentMessage = message;
                this.state.currentType = type;
                
                // Log if enabled
                if (this.config.enableConsoleLogging) {
                    this.log(`Status: [${type.toUpperCase()}] ${message}`);
                }
                
                // Set auto-clear timeout if enabled
                if (this.config.enableAutoTimeout || timeout) {
                    const timeoutDuration = timeout || this.config.defaultTimeout;
                    this.state.timeoutId = setTimeout(() => {
                        this.clearStatus();
                    }, timeoutDuration);
                }
                
                // Dispatch custom event for other components
                document.dispatchEvent(new CustomEvent('statusUpdated', {
                    detail: { message, type, timestamp: Date.now() }
                }));
                
            } catch (error) {
                console.error('StatusService: Error updating status:', error);
            }
        },
        
        /**
         * Clear the current status message
         */
        clearStatus() {
            const { statusMessage } = this.state.elements;
            if (statusMessage) {
                this.config.validStatusTypes.forEach(cls => {
                    statusMessage.classList.remove(cls);
                });
                statusMessage.textContent = 'Ready';
                statusMessage.classList.add('info');
            }
            
            this.clearStatusTimeout();
            this.state.currentMessage = null;
            this.state.currentType = 'info';
        },
        
        /**
         * Clear any active status timeout
         */
        clearStatusTimeout() {
            if (this.state.timeoutId) {
                clearTimeout(this.state.timeoutId);
                this.state.timeoutId = null;
            }
        },
        
        /**
         * Update edit mode status indicator
         * @param {boolean} isEnabled - Whether edit mode is enabled
         */
        updateEditModeStatus(isEnabled) {
            const { statusInfo } = this.state.elements;
            if (statusInfo) {
                statusInfo.textContent = `Edit mode: ${isEnabled ? 'ON' : 'OFF'}`;
                statusInfo.className = `edit-mode-indicator ${isEnabled ? 'enabled' : 'disabled'}`;
            }
        },
        
        /**
         * Handle file import with improved error handling and validation
         * @param {File} file - The file to import
         */
        async handleFileImport(file) {
            // Validation
            if (!file) {
                this.updateStatus('No file selected for import', 'error');
                return;
            }
            
            if (!file.type.includes('text/html') && !file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
                this.updateStatus('Please select an HTML file (.html or .htm)', 'error');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                this.updateStatus('File too large. Maximum size is 10MB', 'error');
                return;
            }
            
            this.updateStatus(`Importing ${file.name}...`, 'info');
            
            try {
                const content = await this.readFileAsText(file);
                await this.processImportedHTML(content, file.name);
            } catch (error) {
                console.error('Import failed:', error);
                this.updateStatus(`Import failed: ${error.message}`, 'error');
            }
        },
        
        /**
         * Read file as text using Promise-based FileReader
         * @param {File} file - The file to read
         * @returns {Promise<string>} File content as text
         */
        readFileAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.onabort = () => reject(new Error('File reading was aborted'));
                
                reader.readAsText(file);
            });
        },
        
        /**
         * Process and integrate imported HTML content
         * @param {string} htmlContent - The HTML content to process
         * @param {string} filename - Name of the imported file
         */
        async processImportedHTML(htmlContent, filename) {
            try {
                // Create temporary DOM to parse imported HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;
                
                // Look for main content in various container selectors
                const contentSelectors = [
                    '#site-container',
                    '#main-content', 
                    'main',
                    '.main-content',
                    '.container',
                    'body > *'
                ];
                
                let newContent = null;
                for (const selector of contentSelectors) {
                    newContent = tempDiv.querySelector(selector);
                    if (newContent) {
                        this.log(`Found content using selector: ${selector}`);
                        break;
                    }
                }
                
                // Fallback to entire content if no specific container found
                if (!newContent) {
                    newContent = tempDiv;
                    this.log('Using entire imported content as no specific container found');
                }
                
                // Find target container in current document
                const targetContainer = document.getElementById('site-container') || 
                                      document.querySelector('main') || 
                                      document.querySelector('.main-content');
                
                if (!targetContainer) {
                    throw new Error('No suitable target container found in current document');
                }
                
                // Backup current content for potential undo
                this.backupCurrentContent(targetContainer);
                
                // Replace content
                if (newContent.innerHTML.trim()) {
                    targetContainer.innerHTML = newContent.innerHTML;
                    this.updateStatus(`Successfully imported content from ${filename}`, 'success');
                    
                    // Dispatch import complete event
                    document.dispatchEvent(new CustomEvent('contentImported', {
                        detail: { filename, timestamp: Date.now() }
                    }));
                } else {
                    throw new Error('Imported content appears to be empty');
                }
                
            } catch (error) {
                throw new Error(`Processing failed: ${error.message}`);
            }
        },
        
        /**
         * Backup current content for potential undo functionality
         * @param {Element} container - The container to backup
         */
        backupCurrentContent(container) {
            try {
                const backup = {
                    content: container.innerHTML,
                    timestamp: Date.now()
                };
                
                // Store in sessionStorage for this session
                sessionStorage.setItem('wb-content-backup', JSON.stringify(backup));
                this.log('Content backup created');
            } catch (error) {
                console.warn('Failed to create content backup:', error);
            }
        },
        
        /**
         * Configure status service options
         * @param {Object} options - Configuration options
         */
        configure(options) {
            if (options && typeof options === 'object') {
                Object.assign(this.config, options);
                this.log('Status Service configuration updated');
            }
        },
        
        /**
         * Get current status information
         * @returns {Object} Current status state
         */
        getStatus() {
            return {
                message: this.state.currentMessage,
                type: this.state.currentType,
                initialized: this.state.initialized
            };
        },
        
        /**
         * Enable auto-clear timeout for status messages
         * @param {number} timeout - Timeout in milliseconds
         */
        enableAutoTimeout(timeout = 5000) {
            this.config.enableAutoTimeout = true;
            this.config.defaultTimeout = timeout;
        },
        
        /**
         * Disable auto-clear timeout
         */
        disableAutoTimeout() {
            this.config.enableAutoTimeout = false;
            this.clearStatusTimeout();
        },
        
        /**
         * Internal logging with prefix
         * @param {string} message - Message to log
         */
        log(message) {
            if (this.config.enableConsoleLogging) {
                console.log(`[StatusService] ${message}`);
            }
        }
    };
    
    /**
     * Initialize when DOM is ready
     */
    function initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => StatusService.init());
        } else {
            StatusService.init();
        }
    }
    
    // Auto-initialize
    initializeWhenReady();
    
    // Export to global scope for backwards compatibility
    window.updateStatus = StatusService.updateStatus.bind(StatusService);
    window.handleFileImport = StatusService.handleFileImport.bind(StatusService);
    window.StatusService = StatusService;
    
    // Export for module usage
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = StatusService;
    }
    
})();