/**
 * WB Inject Test Web Component
 *
 * Runtime JavaScript injection and testing component.
 * Allows injecting and executing JavaScript code on any DOM element/control.
 *
 * @example
 * <wb-inject-test target="#my-element"></wb-inject-test>
 *
 * @events
 * - wb:inject-test:executed - Fired when test code is executed
 * - wb:inject-test:error - Fired when execution fails
 *
 * @version 1.0.0
 */

(function() {
    'use strict';

    console.log('🧪 WB Inject Test: Starting initialization...');

    class WBInjectTest extends HTMLElement {
        constructor() {
            super();

            this.initialized = false;
            this.targetElement = null;
            this.currentCode = '';
            this.config = null;
            this.testScripts = {};
            this.isSelectingElement = false;
            this.lastHoveredElement = null;
        }

        connectedCallback() {
            if (!this.initialized) {
                this.init();
            }
        }

        async init() {
            console.log('🧪 WB Inject Test: Initializing component...');

            // Load CSS
            this.loadCSS();

            // Load configuration
            await this.loadConfig();

            // Create UI
            this.render();

            // Setup event listeners
            this.setupEventListeners();

            // Auto-select target if provided (wait for DOM to be ready)
            const targetAttr = this.getAttribute('target');
            if (targetAttr) {
                // Wait for other components to load
                setTimeout(() => {
                    const input = this.querySelector('#target-selector');
                    if (input) {
                        input.value = targetAttr;
                        this.selectTarget();
                    }
                }, 1000); // Increased to 1 second
            }

            this.initialized = true;

            // Start with gray status - not loaded yet
            this.showStatusIndicator('idle');

            // Dispatch ready event
            this.dispatchEvent(new CustomEvent('wb:inject-test:ready', {
                bubbles: true,
                composed: true
            }));

            console.log('✅ WB Inject Test: Component initialized');
        }

        async loadConfig() {
            try {
                const configPath = './wb-inject-test.config.json';
                const response = await fetch(configPath);
                if (response.ok) {
                    this.config = await response.json();
                    this.testScripts = this.config.testScripts || {};
                    console.log('🧪 WB Inject Test: Configuration loaded', this.testScripts);
                }
            } catch (error) {
                console.warn('🧪 WB Inject Test: Could not load config, using defaults', error);
            }
        }

        loadCSS() {
            if (window.WBComponentUtils && window.WBComponentUtils.loadCSS) {
                try {
                    const basePath = window.WBComponentUtils.getPath('wb-inject-test.js', '../components/wb-inject-test/');
                    window.WBComponentUtils.loadCSS('wb-inject-test', basePath + 'wb-inject-test.css');
                } catch (error) {
                    console.warn('🧪 WB Inject Test: Could not use WBComponentUtils, using fallback');
                    this.loadCSSFallback();
                }
            } else {
                this.loadCSSFallback();
            }
        }

        loadCSSFallback() {
            const existingLink = document.querySelector('link[href*="wb-inject-test.css"]');
            if (existingLink) return;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './wb-inject-test.css';
            link.onerror = () => {
                link.href = '../wb-inject-test/wb-inject-test.css';
                link.onerror = () => {
                    link.href = '/components/wb-inject-test/wb-inject-test.css';
                };
            };
            document.head.appendChild(link);
        }

        render() {
            this.innerHTML = `
                    <div class="wb-inject-test" id="inject-test-panel">
                        <div class="wb-inject-test-header">
                            <h3>Inject Test</h3>
                            <div class="wb-inject-test-status" id="status-indicator">
                                <span class="status-dot"></span>
                                <span class="status-text">Initializing...</span>
                            </div>
                        </div>

                        <div class="wb-inject-test-body">
                        <!-- Target Selector -->
                        <div class="wb-inject-test-section">
                            <label for="target-selector">Target Element (CSS Selector):</label>
                            <input
                                type="text"
                                id="target-selector"
                                class="wb-inject-test-input"
                                placeholder="#element-id or .class-name"
                                value="${this.getAttribute('target') || '#layout-select'}">
                            <button id="select-target-btn" class="wb-inject-test-btn wb-inject-test-btn-secondary">
                                🎯 Select Target
                            </button>
                        </div>

                        <!-- Test Script Selector -->
                        <div class="wb-inject-test-section" id="test-scripts-section" style="display:none;">
                            <label for="test-script-select">Load Test Script:</label>
                            <select id="test-script-select" class="wb-inject-test-select">
                                <option value="">-- Select a test script --</option>
                            </select>
                            <div style="display: flex; gap: 1rem; margin-top: 3px;">
                                <button id="load-script-btn" class="wb-inject-test-btn wb-inject-test-btn-primary">
                                    📥 Load Script
                                </button>
                                <button id="run-test-btn" class="wb-inject-test-btn wb-inject-test-btn-primary">
                                    ▶️ Run Test
                                </button>
                            </div>
                        </div>

                        <!-- Code Editor -->
                        <div class="wb-inject-test-section">
                            <label for="code-editor">JavaScript Code to Inject:</label>
                            <textarea
                                id="code-editor"
                                class="wb-inject-test-editor"
                                placeholder="// Enter JavaScript code here
// 'element' variable contains the target element
console.log(element);
console.log('Children:', element.children.length);">// Example: Log target element info
console.log('Target element:', element);
console.log('Tag:', element.tagName);
console.log('Classes:', element.className);
console.log('Children:', element.children.length);
if (element._options) {
    console.log('Options:', element._options);
}</textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="wb-inject-test-actions">
                            <button id="clear-btn" class="wb-inject-test-btn wb-inject-test-btn-secondary">
                                🗑️ Clear
                            </button>
                            <button id="clear-script-btn" class="wb-inject-test-btn wb-inject-test-btn-danger">
                                🔴 Clear Script
                            </button>
                            <button id="copy-code-btn" class="wb-inject-test-btn wb-inject-test-btn-secondary">
                                📋 Copy Code
                            </button>
                        </div>

                        <!-- Code Display (shows what was executed) -->
                        <div class="wb-inject-test-section">
                            <label>Last Executed Code:</label>
                            <pre id="executed-code" class="wb-inject-test-code-display">// No code executed yet</pre>
                        </div>

                        <!-- Results Display -->
                        <div class="wb-inject-test-section">
                            <label>Execution Results:</label>
                            <div id="results-display" class="wb-inject-test-results">
                                <div class="wb-inject-test-placeholder">Run a test to see results...</div>
                            </div>
                        </div>
                    </div>
                    </div>
            `;
        }

        setupEventListeners() {
            // Select Target button
            const selectTargetBtn = this.querySelector('#select-target-btn');
            if (!selectTargetBtn) {
                console.error('🧪 WB Inject Test: Select Target button not found');
                return;
            }
            selectTargetBtn.addEventListener('click', () => this.startElementPicker());

            // Run Test button
            const runTestBtn = this.querySelector('#run-test-btn');
            runTestBtn.addEventListener('click', () => this.runTest());

            // Clear button
            const clearBtn = this.querySelector('#clear-btn');
            clearBtn.addEventListener('click', () => this.clear());

            // Clear Script button
            const clearScriptBtn = this.querySelector('#clear-script-btn');
            clearScriptBtn.addEventListener('click', () => this.clearScript());

            // Copy Code button
            const copyCodeBtn = this.querySelector('#copy-code-btn');
            copyCodeBtn.addEventListener('click', () => this.copyCode());

            // Load Script button
            const loadScriptBtn = this.querySelector('#load-script-btn');
            if (loadScriptBtn) {
                loadScriptBtn.addEventListener('click', () => this.loadTestScript());
            }

            // Populate test scripts dropdown
            this.populateTestScripts();

            // Target input hover - highlight the current target element
            const targetInput = this.querySelector('#target-selector');
            if (targetInput) {
                targetInput.addEventListener('mouseenter', () => this.highlightTargetElement());
                targetInput.addEventListener('mouseleave', () => this.unhighlightTargetElement());
            }
        }

        populateTestScripts() {
            if (Object.keys(this.testScripts).length === 0) return;

            const select = this.querySelector('#test-script-select');
            const section = this.querySelector('#test-scripts-section');

            if (select && section) {
                // Add options
                Object.keys(this.testScripts).forEach(key => {
                    const script = this.testScripts[key];
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = script.name;
                    option.title = script.description;
                    select.appendChild(option);
                });

                // Show the section
                section.style.display = 'block';
            }
        }

        loadTestScript() {
            const select = this.querySelector('#test-script-select');
            const scriptKey = select.value;

            if (!scriptKey) return;

            const script = this.testScripts[scriptKey];
            if (script) {
                const editor = this.querySelector('#code-editor');
                editor.value = script.code;

                // Turn indicator GREEN - gun is loaded!
                this.showStatusIndicator('ready');

                this.logEvent('info', `Loaded test script: ${script.name}`);
            }
        }

        showStatusIndicator(status) {
            const indicator = this.querySelector('#status-indicator');
            const dot = indicator.querySelector('.status-dot');
            const text = indicator.querySelector('.status-text');

            if (status === 'ready') {
                dot.style.background = '#10b981'; // Green - gun is loaded
                text.textContent = 'Loaded';
                text.style.color = '#10b981';
            } else if (status === 'error') {
                dot.style.background = '#ef4444'; // Red - cleared/error
                text.textContent = 'Empty';
                text.style.color = '#ef4444';
            } else {
                dot.style.background = '#6b7280'; // Gray - idle/not loaded
                text.textContent = 'Not Loaded';
                text.style.color = '#6b7280';
            }
        }

        startElementPicker() {
            this.isSelectingElement = true;

            // Change cursor for entire document
            document.body.style.cursor = 'crosshair';

            // Add visual indicator to button
            const btn = this.querySelector('#select-target-btn');
            btn.textContent = '⏹️ Cancel Selection';
            btn.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';

            // Create hover handler
            this.elementHoverHandler = (e) => {
                if (!this.isSelectingElement) return;

                // Don't highlight the inject-test panel itself
                if (e.target.closest('.wb-inject-test')) return;

                e.stopPropagation();

                // Remove highlight from last element
                if (this.lastHoveredElement) {
                    this.lastHoveredElement.style.outline = '';
                    this.lastHoveredElement.style.outlineOffset = '';
                }

                // Highlight current element
                e.target.style.outline = '3px solid #6366f1';
                e.target.style.outlineOffset = '2px';
                this.lastHoveredElement = e.target;

                // Update the input field to show what's being hovered
                const input = this.querySelector('#target-selector');

                // Generate CSS selector for the hovered element
                let selector = e.target.tagName.toLowerCase();
                if (e.target.id) {
                    selector = '#' + e.target.id;
                } else if (e.target.className) {
                    const classes = e.target.className.split(' ').filter(c => c.trim());
                    if (classes.length > 0) {
                        selector = selector + '.' + classes[0];
                    }
                }

                input.value = selector;
            };

            // Create click handler
            this.elementClickHandler = (e) => {
                if (!this.isSelectingElement) return;

                // Don't select the inject-test panel itself
                if (e.target.closest('.wb-inject-test')) {
                    // If clicking the cancel button
                    if (e.target.id === 'select-target-btn' || e.target.closest('#select-target-btn')) {
                        this.stopElementPicker();
                        return;
                    }
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                // Set the selected element as target
                this.selectElement(e.target);
                this.stopElementPicker();
            };

            // Attach event listeners to document
            document.addEventListener('mouseover', this.elementHoverHandler, true);
            document.addEventListener('click', this.elementClickHandler, true);

            this.logEvent('info', 'Element picker activated - hover over elements to select');
        }

        stopElementPicker() {
            this.isSelectingElement = false;

            // Restore cursor
            document.body.style.cursor = '';

            // Remove highlight from last element
            if (this.lastHoveredElement) {
                this.lastHoveredElement.style.outline = '';
                this.lastHoveredElement.style.outlineOffset = '';
                this.lastHoveredElement = null;
            }

            // Restore button
            const btn = this.querySelector('#select-target-btn');
            btn.textContent = '🎯 Select Target';
            btn.style.background = '';

            // Remove event listeners
            if (this.elementHoverHandler) {
                document.removeEventListener('mouseover', this.elementHoverHandler, true);
            }
            if (this.elementClickHandler) {
                document.removeEventListener('click', this.elementClickHandler, true);
            }

            this.logEvent('info', 'Element picker deactivated');
        }

        selectElement(element) {
            this.targetElement = element;

            // Generate CSS selector for the element
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector = '#' + element.id;
            } else if (element.className) {
                const classes = element.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    selector = selector + '.' + classes[0];
                }
            }

            // Update input field
            const input = this.querySelector('#target-selector');
            input.value = selector;

            this.logEvent('success', `Target selected: ${selector}`);
        }

        selectTarget() {
            const selector = this.querySelector('#target-selector').value;

            try {
                this.targetElement = document.querySelector(selector);

                if (this.targetElement) {
                    this.logEvent('info', `Target selected: ${selector}`);
                } else {
                    throw new Error('Element not found');
                }
            } catch (error) {
                this.logEvent('error', `Failed to select target: ${error.message}`);
            }
        }

        runTest() {
            if (!this.targetElement) {
                this.displayResults('error', 'No target element selected. Please select a target first.');
                return;
            }

            const code = this.querySelector('#code-editor').value;
            this.currentCode = code;

            // Update executed code display
            const executedCodeDisplay = this.querySelector('#executed-code');
            executedCodeDisplay.textContent = code;

            // Capture console output
            const logs = [];
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;

            console.log = (...args) => {
                logs.push({ type: 'log', args });
                originalLog.apply(console, args);
            };
            console.warn = (...args) => {
                logs.push({ type: 'warn', args });
                originalWarn.apply(console, args);
            };
            console.error = (...args) => {
                logs.push({ type: 'error', args });
                originalError.apply(console, args);
            };

            try {
                // Create function with 'element' variable available
                const testFunction = new Function('element', code);

                // Execute the code
                const result = testFunction(this.targetElement);

                // Restore console
                console.log = originalLog;
                console.warn = originalWarn;
                console.error = originalError;

                // Display results
                this.displayResults('success', result, logs);

                // Dispatch success event
                this.dispatchEvent(new CustomEvent('wb:inject-test:executed', {
                    bubbles: true,
                    composed: true,
                    detail: { code, result, logs }
                }));

                this.logEvent('success', 'Test executed successfully');
            } catch (error) {
                // Restore console
                console.log = originalLog;
                console.warn = originalWarn;
                console.error = originalError;

                this.displayResults('error', error.message, logs);

                // Dispatch error event
                this.dispatchEvent(new CustomEvent('wb:inject-test:error', {
                    bubbles: true,
                    composed: true,
                    detail: { code, error: error.message }
                }));

                this.logEvent('error', `Test execution failed: ${error.message}`);
            }
        }

        displayResults(type, result, logs = []) {
            const resultsDisplay = this.querySelector('#results-display');

            let html = '';

            if (type === 'error') {
                html = `<div class="wb-inject-test-error">❌ Error: ${result}</div>`;
            } else {
                html = `<div class="wb-inject-test-success">✅ Execution completed</div>`;

                if (result !== undefined) {
                    html += `<div class="wb-inject-test-return">
                        <strong>Return Value:</strong>
                        <pre>${JSON.stringify(result, null, 2)}</pre>
                    </div>`;
                }
            }

            // Display captured console logs
            if (logs.length > 0) {
                html += '<div class="wb-inject-test-logs"><strong>Console Output:</strong>';
                logs.forEach(log => {
                    const logClass = `wb-inject-test-log-${log.type}`;
                    const formattedArgs = log.args.map(arg => {
                        if (typeof arg === 'object') {
                            return JSON.stringify(arg, null, 2);
                        }
                        return String(arg);
                    }).join(' ');

                    html += `<div class="${logClass}">${formattedArgs}</div>`;
                });
                html += '</div>';
            }

            resultsDisplay.innerHTML = html;
        }

        clear() {
            this.querySelector('#code-editor').value = '';
            this.querySelector('#executed-code').textContent = '// No code executed yet';
            this.querySelector('#results-display').innerHTML = '<div class="wb-inject-test-placeholder">Run a test to see results...</div>';
            this.currentCode = '';

            this.logEvent('info', 'Cleared code and results');
        }

        clearScript() {
            // Clear everything
            this.querySelector('#code-editor').value = '';
            this.querySelector('#executed-code').textContent = '// No code executed yet';
            this.querySelector('#results-display').innerHTML = '<div class="wb-inject-test-placeholder">Run a test to see results...</div>';
            this.currentCode = '';

            // Turn indicator red
            this.showStatusIndicator('error');

            this.logEvent('warning', 'Script cleared - indicator set to error state');
        }

        copyCode() {
            const code = this.querySelector('#code-editor').value;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    this.logEvent('success', 'Code copied to clipboard');

                    // Visual feedback
                    const btn = this.querySelector('#copy-code-btn');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ Copied!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                });
            }
        }

        highlightTargetElement() {
            if (!this.targetElement) return;

            // Add highlight to the current target element
            this.targetElement.style.outline = '3px solid #10b981'; // Green outline
            this.targetElement.style.outlineOffset = '2px';
        }

        unhighlightTargetElement() {
            if (!this.targetElement) return;

            // Remove highlight from the target element
            this.targetElement.style.outline = '';
            this.targetElement.style.outlineOffset = '';
        }

        logEvent(type, message) {
            const eventType = `wb:${type}`;
            document.dispatchEvent(new CustomEvent(eventType, {
                detail: {
                    message: message,
                    source: 'wb-inject-test',
                    timestamp: new Date().toISOString()
                }
            }));
        }
    }

    // Register the custom element
    if (!customElements.get('wb-inject-test')) {
        customElements.define('wb-inject-test', WBInjectTest);
        console.log('✅ WB Inject Test: Component registered');
    }
})();
