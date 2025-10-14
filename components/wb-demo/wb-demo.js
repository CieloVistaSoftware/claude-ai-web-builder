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
class WBDemo extends HTMLElement {
    constructor() {
        super();
        console.log('🎯 WB Demo: Constructor called');
        this.attachShadow({ mode: 'open' });

        // Event storage for saving
        this.eventHistory = [];

        // Event filters
        this.activeFilters = ['info', 'warning', 'error', 'success', 'debug', 'user'];

        // Inject both external and internal CSS for subcomponents into Shadow DOM
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        // Use simple relative path that works from component subdirectories
        linkElem.setAttribute('href', '../wb-demo/wb-demo.css');
        const styleElem = document.createElement('style');
        styleElem.textContent = `
            wb-example, wb-demo-section, wb-demo-grid, wb-demo-item, wb-demo-output {
                display: block;
                font-family: inherit;
                font-size: inherit;
                color: inherit;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            wb-demo-section h1, wb-demo-section h2, wb-demo-section h3, wb-demo-section h4, wb-demo-section h5, wb-demo-section h6,
            wb-demo-item h1, wb-demo-item h2, wb-demo-item h3, wb-demo-item h4, wb-demo-item h5, wb-demo-item h6 {
                display: block;
                font-family: inherit;
                font-weight: 700;
                margin: 1.5rem 0 1rem 0;
                color: var(--primary-color);
                line-height: 1.2;
            }
            wb-demo-section h2, wb-demo-item h2 {
                font-size: 2rem;
                border-bottom: 2px solid var(--primary-color);
                padding-bottom: 0.5rem;
            }
            wb-demo-section h3, wb-demo-item h3 {
                font-size: 1.25rem;
            }
            wb-demo-section p, wb-demo-item p {
                display: block;
                font-family: inherit;
                font-size: 1rem;
                color: var(--text-secondary);
                margin: 0 0 1rem 0;
            }
            wb-demo-section pre, wb-demo-item pre, wb-demo-section code, wb-demo-item code {
                display: block;
                background: var(--bg-tertiary);
                color: var(--text-primary);
                padding: 1rem;
                border-radius: 6px;
                font-family: var(--font-mono, 'Courier New', monospace);
                font-size: 1rem;
                margin: 1rem 0;
                border: 1px solid var(--border-color);
                overflow-x: auto;
            }
            wb-demo-grid {
                display: grid;
                gap: 2rem;
                margin: 1.5rem 0;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
            wb-demo-item {
                background: var(--bg-primary);
                border-radius: 8px;
                box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
                border: 1px solid var(--border-color);
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            wb-demo-item > h3 {
                margin-top: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--primary-color);
            }
            wb-demo-output {
                margin-top: 1rem;
                padding: 1rem;
                background: var(--bg-tertiary);
                border-radius: 6px;
                font-family: var(--font-mono, 'Courier New', monospace);
                font-size: 1rem;
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                text-align: right;
            }
        `;
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(styleElem);
    this.shadowRoot.innerHTML += `
            <div class="demo-container">
                <h1 class="demo-title">
                    <slot name="title">Component Demo</slot>
                </h1>
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button active" data-tab="0">📖 Documentation</button>
                        <button class="tab-button" data-tab="1">🎯 Examples</button>
                    </div>
                    <div class="tab-content">
                        <div class="tab-panel active" id="docs-panel">
                            <slot name="documentation">
                                <h2>Documentation</h2>
                                <p>Component documentation goes here...</p>
                            </slot>
                        </div>
                        <div class="tab-panel" id="examples-panel">
                            <slot name="examples">
                                <h2>Examples</h2>
                                <p>Component examples go here...</p>
                            </slot>
                            <!-- Built-in event log for examples -->
                            <div class="demo-example">
                                <h3>📝 Event Log</h3>
                                <!-- Event Filters -->
                                <div class="filter-controls" style="margin-bottom: 1rem; padding: 0.75rem; background: #1e293b; border-radius: 6px; border: 1px solid #475569;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <span style="color: #e2e8f0; font-size: 0.875rem; font-weight: 500;">Filters:</span>
                                        <button class="filter-btn active" data-type="info" onclick="this.getRootNode().host.toggleFilter('info')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #3b82f6; background: #3b82f6; color: white; border-radius: 3px; cursor: pointer;">📝 Info</button>
                                        <button class="filter-btn active" data-type="warning" onclick="this.getRootNode().host.toggleFilter('warning')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #f59e0b; background: #f59e0b; color: white; border-radius: 3px; cursor: pointer;">⚠️ Warning</button>
                                        <button class="filter-btn active" data-type="error" onclick="this.getRootNode().host.toggleFilter('error')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #ef4444; background: #ef4444; color: white; border-radius: 3px; cursor: pointer;">❌ Error</button>
                                        <button class="filter-btn active" data-type="success" onclick="this.getRootNode().host.toggleFilter('success')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #10b981; background: #10b981; color: white; border-radius: 3px; cursor: pointer;">✅ Success</button>
                                        <button class="filter-btn active" data-type="debug" onclick="this.getRootNode().host.toggleFilter('debug')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #6b7280; background: #6b7280; color: white; border-radius: 3px; cursor: pointer;">🐛 Debug</button>
                                        <button class="filter-btn active" data-type="user" onclick="this.getRootNode().host.toggleFilter('user')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid #8b5cf6; background: #8b5cf6; color: white; border-radius: 3px; cursor: pointer;">👤 User</button>
                                    </div>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button onclick="this.getRootNode().host.selectAllFilters()" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #374151; border: 1px solid #6b7280; color: #f9fafb; border-radius: 3px; cursor: pointer;">Select All</button>
                                        <button onclick="this.getRootNode().host.clearAllFilters()" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #374151; border: 1px solid #6b7280; color: #f9fafb; border-radius: 3px; cursor: pointer;">Clear All</button>
                                    </div>
                                </div>
                                <div class="controls" style="margin-bottom: 1rem;">
                                    <button class="control-button" onclick="this.getRootNode().host.testEventLogging()" style="background: #374151; border: 1px solid #6b7280; color: #f9fafb;">Test Event Logging</button>
                                    <button class="control-button" onclick="this.getRootNode().host.generateMultipleEvents()" style="background: #374151; border: 1px solid #6b7280; color: #f9fafb;">Generate Multiple Events</button>
                                    <button class="control-button" onclick="this.getRootNode().host.clearEventLog()" style="background: #374151; border: 1px solid #6b7280; color: #f9fafb;">Clear Event Log</button>
                                    <button class="control-button" onclick="this.getRootNode().host.saveEventLog()" style="background: #374151; border: 1px solid #6b7280; color: #f9fafb;">💾 Save Events</button>
                                </div>
                                <div class="event-log" id="event-log">
                                    Demo events will appear here...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('🎯 WB Demo: Constructor completed, shadow DOM created');
    }

    async _renderMarkdownDocIfNeeded() {
        const mdUrl = this.getAttribute('markdown');
        console.log('🎯 WB Demo: Checking markdown attribute:', mdUrl);
        const docsPanel = this.shadowRoot.getElementById('docs-panel');
        if (!docsPanel) return;

        // Check for a documentation slot in the light DOM
        let docSlot = null;
        for (const node of this.children) {
            if (node.getAttribute && node.getAttribute('slot') === 'documentation') {
                docSlot = node;
                break;
            }
        }

        if (docSlot && mdUrl) {
            // Both slot and markdown attribute present: error
            console.error('WB Demo: Don\'t use markdown attribute and slot. Only one documentation source is allowed.');
        }

        if (docSlot) {
            // If slot is present, show its content in the docs panel
            docsPanel.innerHTML = '';
            docsPanel.appendChild(docSlot.cloneNode(true));
            return;
        }

        // If no slot, but markdown is set, render markdown
        if (!mdUrl) return;
        docsPanel.innerHTML = '';
        if (window.WBBaseComponent && typeof window.WBBaseComponent.renderMarkdownDoc === 'function') {
            await window.WBBaseComponent.renderMarkdownDoc(mdUrl, docsPanel);
        } else {
            function loadMarked() {
                if (window.marked) return Promise.resolve(window.marked);
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                    script.onload = () => resolve(window.marked);
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            try {
                const [markedLib, response] = await Promise.all([
                    loadMarked(),
                    fetch(mdUrl)
                ]);
                if (!response.ok) throw new Error('Failed to load markdown: ' + mdUrl);
                const markdown = await response.text();
                const html = markedLib.parse(markdown);
                docsPanel.innerHTML = html;
            } catch (error) {
                docsPanel.innerHTML = '<p>Error loading documentation: ' + error.message + '</p>';
            }
        }
    }
    
    setupTabSwitching() {
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        const tabPanels = this.shadowRoot.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = button.dataset.tab;
                
                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update panel states
                tabPanels.forEach(panel => panel.classList.remove('active'));
                tabPanels[tabIndex].classList.add('active');
                
                // Log tab switch
                this.logEvent(`Switched to ${button.textContent.trim()}`);
            });
        });
    }
    
    logEvent(message, type = 'info') {
        // ENFORCE: One message per line - flatten multi-line messages
        const flattenedMessage = String(message)
            .replace(/[\r\n]+/g, ' ')  // Replace line breaks with spaces
            .replace(/\s+/g, ' ')      // Normalize multiple spaces to single space
            .trim();                   // Remove leading/trailing whitespace
        
        const timestamp = new Date().toLocaleTimeString();
        
        // Add type icon to message
        const typeIcons = {
            'info': '📝',
            'warning': '⚠️',
            'error': '❌',
            'success': '✅',
            'debug': '🐛',
            'user': '👤'
        };
        
        const icon = typeIcons[type] || '📝';
        const logEntry = `${timestamp}: ${icon} ${flattenedMessage}`;
        
        // Store event in history for saving
        const eventData = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            displayTime: timestamp,
            message: flattenedMessage,
            fullMessage: logEntry,
            type: type,
            source: 'wb-demo'
        };
        this.eventHistory.unshift(eventData);
        
        // Keep only last 100 events in history
        if (this.eventHistory.length > 100) {
            this.eventHistory = this.eventHistory.slice(0, 100);
        }
        
        // Only display if this event type is filtered in
        if (this.activeFilters.includes(type)) {
            const eventLog = this.shadowRoot.getElementById('event-log');
            if (eventLog) {
                // Create proper HTML structure with line breaks and spacing
                const eventDiv = `<div style="margin-bottom: 0.5rem; white-space: pre-wrap;">${logEntry}</div>`;
                
                // Add to beginning of log
                if (eventLog.innerHTML.trim() === 'Demo events will appear here...' || 
                    eventLog.innerHTML.trim() === 'Event log cleared...' ||
                    eventLog.innerHTML.includes('No events match current filters')) {
                    eventLog.innerHTML = eventDiv;
                } else {
                    eventLog.innerHTML = eventDiv + eventLog.innerHTML;
                }
                
                // Keep only last 10 entries in display
                const eventDivs = eventLog.querySelectorAll('div');
                if (eventDivs.length > 10) {
                    for (let i = 10; i < eventDivs.length; i++) {
                        eventDivs[i].remove();
                    }
                }
            }
        }
    }
    
    clearEventLog() {
        const eventLog = this.shadowRoot.getElementById('event-log');
        if (eventLog) {
            eventLog.innerHTML = '<div style="color: #94a3b8; font-style: italic;">Event log cleared...</div>';
        }
        // Note: We don't clear eventHistory to preserve data for saving
    }
    
    testEventLogging() {
        this.logEvent('Test event logged successfully', 'info');
    }
    
    generateMultipleEvents() {
        this.logEvent('Event 1: Component initialized', 'success');
        setTimeout(() => this.logEvent('Event 2: User interaction detected', 'user'), 500);
        setTimeout(() => this.logEvent('Event 3: State change completed', 'info'), 1000);
        setTimeout(() => this.logEvent('Event 4: Warning detected', 'warning'), 1500);
        setTimeout(() => this.logEvent('Event 5: Debug information', 'debug'), 2000);
    }
    
    toggleFilter(type) {
        const index = this.activeFilters.indexOf(type);
        if (index > -1) {
            this.activeFilters.splice(index, 1);
        } else {
            this.activeFilters.push(type);
        }
        
        // Update filter button appearance
        const button = this.shadowRoot.querySelector(`[data-type="${type}"]`);
        if (button) {
            if (this.activeFilters.includes(type)) {
                button.classList.add('active');
                button.style.opacity = '1';
            } else {
                button.classList.remove('active');
                button.style.opacity = '0.5';
            }
        }
        
        this.refreshEventDisplay();
    }
    
    selectAllFilters() {
        this.activeFilters = ['info', 'warning', 'error', 'success', 'debug', 'user'];
        this.shadowRoot.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.add('active');
            btn.style.opacity = '1';
        });
        this.refreshEventDisplay();
    }
    
    clearAllFilters() {
        this.activeFilters = [];
        this.shadowRoot.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.opacity = '0.5';
        });
        this.refreshEventDisplay();
    }
    
    refreshEventDisplay() {
        const eventLog = this.shadowRoot.getElementById('event-log');
        if (eventLog) {
            // Clear display
            eventLog.innerHTML = '';
            
            // Color map for event types
            const typeColors = {
                info:    '#3b82f6', // blue
                warning: '#f59e0b', // orange
                error:   '#ef4444', // red
                success: '#10b981', // green
                debug:   '#6b7280', // gray
                user:    '#8b5cf6'  // purple
            };
            
            // Re-add filtered events
            const filteredEvents = this.eventHistory.filter(event => 
                this.activeFilters.includes(event.type)
            );
            
            if (filteredEvents.length === 0) {
                eventLog.innerHTML = '<div style="color: #94a3b8; font-style: italic;">No events match current filters...</div>';
                return;
            }
            
            // Display filtered events (most recent first)
            const displayEvents = filteredEvents.slice(0, 10);
            displayEvents.forEach(event => {
                const borderColor = typeColors[event.type] || '#3b82f6';
                const eventDiv = `<div style="margin-bottom: 0.5rem; white-space: pre-wrap; border-left: 4px solid ${borderColor}; padding-left: 0.75rem;">${event.fullMessage}</div>`;
                eventLog.innerHTML += eventDiv;
            });
        }
    }
    
    saveEventLog() {
        try {
            // Only save filtered events
            const filteredEvents = this.eventHistory.filter(event => 
                this.activeFilters.includes(event.type)
            );
            const exportData = {
                exportInfo: {
                    timestamp: new Date().toISOString(),
                    component: 'wb-demo',
                    totalEvents: filteredEvents.length,
                    version: '1.0.0',
                    filters: [...this.activeFilters]
                },
                events: filteredEvents.map(event => ({
                    id: event.id,
                    timestamp: event.timestamp,
                    displayTime: event.displayTime,
                    message: event.message,
                    type: event.type,
                    source: event.source
                }))
            };
            
            // Create JSON file and download
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `eventslog-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            // Log the save action
            this.logEvent(`Events saved: ${filteredEvents.length} filtered events exported to eventslog.json`);
            
        } catch (error) {
            console.error('Failed to save event log:', error);
            this.logEvent(`Error saving events: ${error.message}`);
        }
    }
    
    connectedCallback() {
        console.log('🎯 WB Demo: connectedCallback called');
        
        // Set up tab switching functionality
        this.setupTabSwitching();
        
        // Render markdown doc again in case slot is added after construction
        this._renderMarkdownDocIfNeeded();
        
        // Auto-wrap examples content with wb-resize for interactive demos
        setTimeout(() => {
            this.wrapExamplesWithResize();
        }, 100);
        
        console.log('🎯 WB Demo: connectedCallback completed');
    }

    wrapExamplesWithResize() {
        // Get the examples slot
        const examplesSlot = this.shadowRoot.querySelector('slot[name="examples"]');
        if (!examplesSlot) return;

        // Get slotted elements
        const slottedElements = examplesSlot.assignedElements();

        // Find any interactive components that should be resizable
        slottedElements.forEach(element => {
            // Check if element is a WB component that should be resizable
            const tagName = element.tagName.toLowerCase();

            // List of components that should auto-resize in examples tab
            const resizableComponents = [
                'wb-inject-test',
                'wb-control-panel',
                'wb-modal',
                'wb-viewport'
            ];

            if (resizableComponents.includes(tagName)) {
                // Check if already wrapped
                if (element.parentElement.tagName.toLowerCase() === 'wb-resize') {
                    return; // Already wrapped
                }

                // Create wb-resize wrapper
                const resizeWrapper = document.createElement('wb-resize');
                resizeWrapper.setAttribute('target', tagName);

                // Wrap the element
                const parent = element.parentElement;
                parent.insertBefore(resizeWrapper, element);
                resizeWrapper.appendChild(element);

                this.logEvent(`Auto-wrapped ${tagName} with wb-resize`, 'debug');
            }
        });
    }
}

// Register the component
if (!customElements.get('wb-demo')) {
    customElements.define('wb-demo', WBDemo);
    console.log('🎯 WB Demo: Component registered successfully');
} else {
    console.log('⚠️ WB Demo: Component already registered');
}