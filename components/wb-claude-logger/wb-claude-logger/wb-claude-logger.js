/**
 * WB Claude Logger Component
 * Reusable logger for quick issue tracking in demo files
 * 
 * Features:
 * - Quick description logging
 * - Optional expected/actual fields
 * - Saves to localStorage or backend
 * - Floating button in demos
 * - Markdown generation
 * - Auto-displays claude.md after saving
 * 
 * Usage:
 *   <wb-claude-logger></wb-claude-logger>
 * 
 * @version 2.0.0-fixed
 * @updated 2025-11-22 02:53:00
 */

class WBClaudeLogger extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State
        this.isOpen = false;
        this.showOptional = false;
        this.isSubmitting = false;
        
        // Configuration will be set in connectedCallback
        this.config = {
            backendUrl: 'http://localhost:3001/api/claude-log',
            useBackend: true, // Default to true
            position: 'bottom-right'
        };
    }
    
    connectedCallback() {
        // Read attributes now that element is connected
        this.config.backendUrl = this.getAttribute('backend-url') || this.config.backendUrl;
        this.config.useBackend = this.hasAttribute('use-backend') 
            ? this.getAttribute('use-backend') === 'true'
            : true; // Default to true if not specified
        this.config.position = this.getAttribute('position') || this.config.position;
        
        console.log('🔧 Claude Logger initialized with config:', this.config);
        console.log('🟢 Backend enabled, will attempt to save to server');
        
        this.render();
        this.attachEventListeners();
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            ${this.getStyles()}
            ${this.getTemplate()}
        `;
    }
    
    getStyles() {
        return `
            <style>
                :host {
                    --primary: #667eea;
                    --primary-dark: #764ba2;
                    --success: #28a745;
                    --error: #dc3545;
                    --text: #333;
                    --text-light: #666;
                    --border: #e0e0e0;
                    --bg: white;
                    --bg-light: #f8f9fa;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                /* Floating Button */
                .logger-toggle {
                    position: fixed;
                    ${this.getPositionStyles()}
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 9998;
                    transition: all 0.3s ease;
                }
                
                .logger-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                }
                
                .logger-toggle.active {
                    background: var(--error);
                }
                
                /* Modal Overlay */
                .modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                
                .modal-overlay.open {
                    display: flex;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Modal Content */
                .modal {
                    background: var(--bg);
                    border-radius: 12px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h2 {
                    font-size: 1.5rem;
                    color: var(--text);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: var(--bg-light);
                    color: var(--text);
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                /* Form Styles */
                .form-group {
                    margin-bottom: 1.25rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text);
                    font-weight: 600;
                    font-size: 0.95rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .optional {
                    color: #999;
                    font-weight: 400;
                    font-size: 0.85rem;
                }
                
                .form-group textarea,
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid var(--border);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    transition: border-color 0.3s;
                    resize: vertical;
                }
                
                .form-group textarea:focus,
                .form-group input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                
                .form-group textarea {
                    min-height: 100px;
                }
                
                .char-count {
                    text-align: right;
                    font-size: 0.8rem;
                    color: #999;
                    margin-top: 0.25rem;
                }
                
                .toggle-btn {
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 0.5rem 0;
                    font-weight: 600;
                    transition: color 0.3s;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .toggle-btn:hover {
                    color: var(--primary-dark);
                }
                
                .optional-fields {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: var(--bg-light);
                    border-radius: 8px;
                    display: none;
                }
                
                .optional-fields.show {
                    display: block;
                }
                
                /* Alert */
                .alert {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    display: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .alert.show {
                    display: block;
                }
                
                .alert-success {
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                }
                
                .alert-error {
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                }
                
                /* Buttons */
                .button-group {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1.5rem;
                    border-top: 1px solid var(--border);
                }
                
                .btn {
                    flex: 1;
                    padding: 0.875rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                }
                
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .btn-secondary {
                    background: var(--bg-light);
                    color: var(--text);
                }
                
                .btn-secondary:hover:not(:disabled) {
                    background: #e0e0e0;
                }
                
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                /* Status Badge */
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .status-badge.online {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-badge.offline {
                    background: #fff3cd;
                    color: #856404;
                }
                
                /* Viewer Styles */
                .viewer-content {
                    max-width: 900px;
                    max-height: 90vh;
                }
                
                .viewer-body {
                    padding: 2rem;
                    max-height: calc(90vh - 100px);
                    overflow-y: auto;
                    background: var(--bg);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                }
                
                .viewer-body .loading {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-muted);
                }
                
                .viewer-body h1 {
                    color: var(--primary);
                    border-bottom: 2px solid var(--primary);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .viewer-body h2 {
                    color: var(--primary-dark);
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 0.5rem;
                }
                
                .viewer-body pre {
                    background: var(--bg-light);
                    padding: 1rem;
                    border-radius: 6px;
                    overflow-x: auto;
                    border: 1px solid var(--border);
                }
                
                .viewer-body code {
                    background: var(--bg-light);
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }
                
                .viewer-body strong {
                    color: var(--primary-dark);
                    font-weight: 600;
                }
                
                .viewer-body hr {
                    border: none;
                    border-top: 1px solid var(--border);
                    margin: 2rem 0;
                }
            </style>
        `;
    }
    
    getPositionStyles() {
        const positions = {
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;'
        };
        return positions[this.config.position] || positions['bottom-right'];
    }
    
    getTemplate() {
        return `
            <button class="logger-toggle" id="toggle-btn" title="Log Issue">
                📝
            </button>
            
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2>Log Issue</h2>
                        <button class="close-btn" id="close-btn">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div id="alert-container"></div>
                        
                        <form id="log-form">
                            <div class="form-group">
                                <label for="description">
                                    What happened? *
                                </label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    required 
                                    placeholder="Describe the issue..."
                                    maxlength="2000"
                                ></textarea>
                                <div class="char-count">
                                    <span id="char-count">0</span> / 2000
                                </div>
                            </div>
                            
                            <button type="button" class="toggle-btn" id="toggle-optional">
                                + Add Expected/Actual (Optional)
                            </button>
                            
                            <div class="optional-fields" id="optional-fields">
                                <div class="form-group">
                                    <label for="expected">
                                        Expected <span class="optional">(optional)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="expected" 
                                        name="expected" 
                                        placeholder="What should have happened?"
                                    >
                                </div>
                                
                                <div class="form-group">
                                    <label for="actual">
                                        Actual <span class="optional">(optional)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="actual" 
                                        name="actual" 
                                        placeholder="What actually happened?"
                                    >
                                </div>
                                
                                <div class="form-group">
                                    <label for="file-path">
                                        File Path <span class="optional">(optional)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="file-path" 
                                        name="filePath" 
                                        placeholder="e.g., components/wb-button/wb-button.js"
                                    >
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="button-group">
                        <button type="button" class="btn btn-secondary" id="cancel-btn">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" id="submit-btn">
                            💾 Log Issue
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Markdown Viewer Modal -->
            <div id="viewer-overlay" class="modal-overlay">
                <div class="modal-content viewer-content">
                    <div class="modal-header">
                        <h2>📄 claude.md Contents</h2>
                        <button class="close-btn" id="viewer-close-btn">&times;</button>
                    </div>
                    <div class="viewer-body" id="viewer-body">
                        <div class="loading">Loading...</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const shadow = this.shadowRoot;
        
        // Toggle button
        shadow.getElementById('toggle-btn').addEventListener('click', () => this.openModal());
        
        // Close buttons
        shadow.getElementById('close-btn').addEventListener('click', () => this.closeModal());
        shadow.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
        
        // Modal overlay click
        shadow.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') this.closeModal();
        });
        
        // Character counter
        shadow.getElementById('description').addEventListener('input', (e) => {
            shadow.getElementById('char-count').textContent = e.target.value.length;
        });
        
        // Enter key to submit (Ctrl+Enter for new line in textarea)
        shadow.getElementById('description').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                e.preventDefault();
                this.submitForm();
            }
        });
        
        // Enter key on input fields
        ['expected', 'actual', 'file-path'].forEach(id => {
            const input = shadow.getElementById(id);
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.submitForm();
                    }
                });
            }
        });
        
        // Toggle optional fields
        shadow.getElementById('toggle-optional').addEventListener('click', () => {
            this.showOptional = !this.showOptional;
            const optionalFields = shadow.getElementById('optional-fields');
            const toggleBtn = shadow.getElementById('toggle-optional');
            
            if (this.showOptional) {
                optionalFields.classList.add('show');
                toggleBtn.textContent = '- Hide Optional Fields';
            } else {
                optionalFields.classList.remove('show');
                toggleBtn.textContent = '+ Add Expected/Actual (Optional)';
            }
        });
        
        // Submit form
        shadow.getElementById('submit-btn').addEventListener('click', () => this.submitForm());
        
        // Viewer close button
        shadow.getElementById('viewer-close-btn').addEventListener('click', () => this.closeViewer());
        shadow.getElementById('viewer-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'viewer-overlay') this.closeViewer();
        });
    }
    
    openModal() {
        this.isOpen = true;
        this.shadowRoot.getElementById('modal-overlay').classList.add('open');
        this.shadowRoot.getElementById('toggle-btn').classList.add('active');
        this.shadowRoot.getElementById('description').focus();
    }
    
    closeModal() {
        this.isOpen = false;
        this.shadowRoot.getElementById('modal-overlay').classList.remove('open');
        this.shadowRoot.getElementById('toggle-btn').classList.remove('active');
        this.resetForm();
    }
    
    resetForm() {
        const form = this.shadowRoot.getElementById('log-form');
        form.reset();
        this.shadowRoot.getElementById('char-count').textContent = '0';
        this.shadowRoot.getElementById('optional-fields').classList.remove('show');
        this.shadowRoot.getElementById('toggle-optional').textContent = '+ Add Expected/Actual (Optional)';
        this.showOptional = false;
    }
    
    async submitForm() {
        // Prevent duplicate submissions
        if (this.isSubmitting) {
            console.warn('⚠️ Submission already in progress, ignoring duplicate');
            return;
        }
        
        this.isSubmitting = true;
        console.log('🚀 submitForm called at', new Date().toISOString());
        
        const form = this.shadowRoot.getElementById('log-form');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            this.isSubmitting = false;
            return;
        }
        
        const formData = new FormData(form);
        const component = this.getComponentName();
        const filePath = this.getFilePath();
        
        const logData = {
            description: formData.get('description'),
            expected: formData.get('expected') || null,
            actual: formData.get('actual') || null,
            filePath: filePath,
            timestamp: new Date().toISOString(),
            component: component,
            url: window.location.href
        };
        
        console.log('📝 Logging issue:', { component, filePath, description: logData.description });
        console.log('🔧 Config state:', {
            useBackend: this.config.useBackend,
            backendUrl: this.config.backendUrl,
            attribute: this.getAttribute('use-backend'),
            typeof: typeof this.config.useBackend
        });
        
        try {
            if (this.config.useBackend) {
                console.log('📤 Backend enabled - sending to server...');
                const result = await this.saveToBackend(logData);
                console.log('✅ Backend save successful:', result);
                this.showAlert('success', `✅ Saved to components/${result.component}/claude.md`);
                
                // Show viewer with updated content after a short delay
                setTimeout(() => {
                    this.closeModal();
                    this.isSubmitting = false;
                    this.showClaudeMdViewer(component);
                }, 1500);
            } else {
                console.log('💾 Backend disabled - using localStorage');
                this.saveToLocalStorage(logData);
                this.showAlert('success', '✅ Saved to localStorage (server offline)');
                
                setTimeout(() => {
                    this.closeModal();
                    this.isSubmitting = false;
                }, 2000);
            }
            
            // Dispatch event for parent page
            this.dispatchEvent(new CustomEvent('issue-logged', {
                detail: logData,
                bubbles: true,
                composed: true
            }));
            
        } catch (error) {
            console.error('❌ Logging error:', error);
            this.showAlert('error', `❌ Error: ${error.message}`);
            this.isSubmitting = false;
        }
    }
    
    getComponentName() {
        // Try to detect component name from URL path
        const urlPath = window.location.pathname;
        
        // Match pattern: /components/wb-xxx/ or /wb-xxx/
        const componentMatch = urlPath.match(/\/components\/(wb-[^\/]+)|^\/(wb-[^\/]+)/);
        if (componentMatch) {
            return componentMatch[1] || componentMatch[2];
        }
        
        // Fallback: try page title
        const pageTitle = document.title;
        if (pageTitle.includes('wb-')) {
            const titleMatch = pageTitle.match(/wb-[\w-]+/);
            if (titleMatch) return titleMatch[0];
        }
        
        console.warn('⚠️ Could not detect component name from URL or title');
        return 'unknown';
    }
    
    getFilePath() {
        // Get the current file path relative to the component
        const urlPath = window.location.pathname;
        const fileName = urlPath.split('/').pop();
        return fileName || 'unknown.html';
    }
    
    async showClaudeMdViewer(component) {
        const viewerOverlay = this.shadowRoot.getElementById('viewer-overlay');
        const viewerBody = this.shadowRoot.getElementById('viewer-body');
        const viewerHeader = this.shadowRoot.querySelector('.viewer-content .modal-header h2');
        
        // Show loading state
        viewerOverlay.classList.add('open');
        viewerBody.innerHTML = '<div class="loading">Loading claude.md...</div>';
        
        try {
            // Check if error marker exists
            let hasErrors = false;
            try {
                const errorCheck = await fetch(`/components/${component}/.HAS-ERRORS`);
                hasErrors = errorCheck.ok;
            } catch {
                // No error marker file
            }
            
            // Update header with error indicator
            if (hasErrors) {
                viewerHeader.innerHTML = '🔴 claude.md Contents (HAS ERRORS)';
                viewerHeader.style.color = '#dc3545';
            } else {
                viewerHeader.innerHTML = '📄 claude.md Contents';
                viewerHeader.style.color = '';
            }
            
            // Fetch the claude.md file - try different naming conventions
            let response = await fetch(`/components/${component}/🔴 claude.md`);
            
            if (!response.ok) {
                response = await fetch(`/components/${component}/✅ claude.md`);
            }
            
            if (!response.ok) {
                response = await fetch(`/components/${component}/claude.md`);
            }
            
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.statusText}`);
            }
            
            const markdown = await response.text();
            
            // Convert markdown to HTML (simple conversion)
            const html = this.markdownToHtml(markdown);
            viewerBody.innerHTML = html;
            
        } catch (error) {
            console.error('❌ Failed to load claude.md:', error);
            viewerBody.innerHTML = `
                <div class="alert alert-error show">
                    <strong>Error:</strong> Could not load claude.md file.<br>
                    ${error.message}
                </div>
            `;
        }
    }
    
    closeViewer() {
        this.shadowRoot.getElementById('viewer-overlay').classList.remove('open');
    }
    
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and Italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([\\s\\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }
    
    generateMarkdown(logData) {
        const date = new Date(logData.timestamp).toLocaleString();
        
        let markdown = `## 📝 ${date}\n\n`;
        markdown += `**Component:** ${logData.component}\n\n`;
        markdown += `### Description\n\n${logData.description}\n\n`;
        
        if (logData.expected) {
            markdown += `**Expected:** ${logData.expected}  \n`;
        }
        
        if (logData.actual) {
            markdown += `**Actual:** ${logData.actual}  \n`;
        }
        
        if (logData.filePath) {
            markdown += `**File:** \`${logData.filePath}\`  \n`;
        }
        
        markdown += `\n---\n\n`;
        
        return markdown;
    }
    
    async saveToBackend(logData) {
        // Extract component and create entry object for server
        const { component, ...entry } = logData;
        
        const response = await fetch(this.config.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                component,
                entry: {
                    type: 'issue',
                    title: entry.description,
                    ...entry
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    saveToLocalStorage(logData) {
        const logs = JSON.parse(localStorage.getItem('wb-claude-logs') || '[]');
        logs.unshift(logData);
        localStorage.setItem('wb-claude-logs', JSON.stringify(logs));
        
        // Save markdown
        const markdown = this.generateMarkdown(logData);
        const allMarkdown = localStorage.getItem('wb-claude-logs-markdown') || '# Claude Issues Log\n\n';
        localStorage.setItem('wb-claude-logs-markdown', allMarkdown + markdown);
    }
    
    // Backend status is checked during actual save attempt, not preemptively
    
    showAlert(type, message) {
        const alertContainer = this.shadowRoot.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} show`;
        alert.textContent = message;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
    
    cleanup() {
        // Clean up event listeners if needed
    }
}

// Register the component
customElements.define('wb-claude-logger', WBClaudeLogger);

export default WBClaudeLogger;
