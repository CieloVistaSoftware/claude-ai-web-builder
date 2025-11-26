import WBBaseComponent from '../wb-base/wb-base.js';

class WBShadowDiagnostics extends WBBaseComponent {
    constructor() {
        super();
        this.CONFIG = {
            tagName: 'wb-button',
            jsFile: '../../components/wb-button/wb-button.js',
            cssFile: 'wb-button.css',
            testHTML: '<wb-button variant="primary">Primary</wb-button>\n<wb-button variant="success">Success</wb-button>\n<wb-button variant="secondary">Secondary</wb-button>'
        };
        this.backendStatus = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.checkBackend().then(() => {
            this.initializeDiagnostics();
        });
    }

    async checkBackend() {
        // Try to ping backend API (customize endpoint as needed)
        const statusUrl = '/api/status';
        try {
            const resp = await fetch(statusUrl, { method: 'GET' });
            if (resp.ok) {
                this.backendStatus = 'ok';
                console.log('[WB Diagnostics] Backend API is running.');
            } else {
                this.backendStatus = 'error';
                console.error('[WB Diagnostics] Backend API returned error:', resp.status);
            }
        } catch (err) {
            this.backendStatus = 'error';
            console.error('[WB Diagnostics] Backend API not reachable:', err);
        }
        // Show UI warning if backend is not running
        const envCheckElement = document.getElementById('env-check');
        if (envCheckElement && this.backendStatus === 'error') {
            envCheckElement.innerHTML = '<div class="error">❌ Backend API not running or unreachable. Some features may not work.</div>' + envCheckElement.innerHTML;
        }
    }

    initializeDiagnostics() {
        // Set up event listeners
        this.setupEventListeners();

        // Load initial preview
        this.updatePreview();
    }

    setupEventListeners() {
        const componentTagSelect = this.shadowRoot?.getElementById('component-tag') || document.getElementById('component-tag');
        const runDiagnosticsBtn = this.shadowRoot?.getElementById('run-diagnostics-btn') || document.getElementById('run-diagnostics-btn');
        const freshCacheBtn = this.shadowRoot?.getElementById('fresh-cache-btn') || document.getElementById('fresh-cache-btn');
        const resetBtn = this.shadowRoot?.getElementById('reset-btn') || document.getElementById('reset-btn');
        const copyIssuesBtn = this.shadowRoot?.getElementById('copy-issues-btn') || document.getElementById('copy-issues-btn');
        const refreshPreviewBtn = this.shadowRoot?.getElementById('refresh-preview-btn') || document.getElementById('refresh-preview-btn');
        const openDemoBtn = this.shadowRoot?.getElementById('open-demo-btn') || document.getElementById('open-demo-btn');

        if (componentTagSelect) {
            componentTagSelect.addEventListener('change', (e) => this.onComponentChange(e));
        }

        if (runDiagnosticsBtn) {
            runDiagnosticsBtn.addEventListener('click', () => this.runDiagnostics());
        }

        if (freshCacheBtn) {
            freshCacheBtn.addEventListener('click', () => this.runWithFreshCache());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetConfig());
        }

        if (copyIssuesBtn) {
            copyIssuesBtn.addEventListener('click', () => this.copyIssuesToClipboard());
        }

        if (refreshPreviewBtn) {
            refreshPreviewBtn.addEventListener('click', () => this.refreshPreview());
        }

        if (openDemoBtn) {
            openDemoBtn.addEventListener('click', () => this.openDemoInNewTab());
        }

        const checkRefsBtn = this.shadowRoot?.getElementById('check-refs-btn') || document.getElementById('check-refs-btn');
        if (checkRefsBtn) {
            checkRefsBtn.addEventListener('click', () => this.checkReferences());
        }
    }

    resetConfig() {
        this.CONFIG = {
            tagName: 'wb-button',
            jsFile: '../../components/wb-button/wb-button.js',
            cssFile: 'wb-button.css',
            testHTML: '<wb-button variant="primary">Primary</wb-button>\n<wb-button variant="success">Success</wb-button>\n<wb-button variant="secondary">Secondary</wb-button>'
        };

        // Update form fields
        const componentTagSelect = this.shadowRoot?.getElementById('component-tag') || document.getElementById('component-tag');
        const componentJsInput = this.shadowRoot?.getElementById('component-js') || document.getElementById('component-js');
        const cssFileInput = this.shadowRoot?.getElementById('css-file') || document.getElementById('css-file');
        const testHtmlTextarea = this.shadowRoot?.getElementById('test-html') || document.getElementById('test-html');

        if (componentTagSelect) componentTagSelect.value = 'wb-button';
        if (componentJsInput) componentJsInput.value = this.CONFIG.jsFile;
        if (cssFileInput) cssFileInput.value = this.CONFIG.cssFile;
        if (testHtmlTextarea) testHtmlTextarea.value = this.CONFIG.testHTML;
    }

    onComponentChange(e) {
        const componentName = e.target.value;

        // Update CONFIG object
        this.CONFIG.tagName = componentName;
        this.CONFIG.jsFile = `../../components/${componentName}/${componentName}.js`;
        this.CONFIG.cssFile = `${componentName}.css`;

        // Generate comprehensive test instances
        const testInstances = this.generateTestInstances(componentName);

        // Update form fields
        const componentJsInput = this.shadowRoot?.getElementById('component-js') || document.getElementById('component-js');
        const cssFileInput = this.shadowRoot?.getElementById('css-file') || document.getElementById('css-file');
        const testHtmlTextarea = this.shadowRoot?.getElementById('test-html') || document.getElementById('test-html');

        if (componentJsInput) componentJsInput.value = this.CONFIG.jsFile;
        if (cssFileInput) cssFileInput.value = this.CONFIG.cssFile;
        if (testHtmlTextarea) testHtmlTextarea.value = testInstances;

        // Update preview immediately when component changes
        this.updatePreview();
    }

    // Build a selection of common test instances for a component
    generateTestInstances(componentName) {
        const instances = [
            `<${componentName}></${componentName}>`,
            `<${componentName} variant="primary">Primary</${componentName}>`,
            `<${componentName} variant="secondary">Secondary</${componentName}>`,
            `<${componentName} variant="success">Success</${componentName}>`,
            `<${componentName} variant="danger">Danger</${componentName}>`,
            `<${componentName} variant="warning">Warning</${componentName}>`,
            `<${componentName} size="small">Small</${componentName}>`,
            `<${componentName} size="large">Large</${componentName}>`,
            `<${componentName} disabled>Disabled</${componentName}>`
        ];

        return instances.join('\n');
    }

    runWithFreshCache() {
        // Reload page with new cache buster
        const url = new URL(window.location.href);
        url.searchParams.set('v', Date.now());
        window.location.href = url.toString();
    }

    refreshPreview() {
        this.updatePreview();
    }

    openDemoInNewTab() {
        const componentName = this.CONFIG.tagName;
        const demoPath = `../../components/${componentName}/${componentName}-demo.html`;
        window.open(demoPath, '_blank');
    }

    updatePreview() {
        const componentName = this.CONFIG.tagName;
        const iframe = this.shadowRoot?.getElementById('componentPreview') || document.getElementById('componentPreview');
        const pathDisplay = this.shadowRoot?.getElementById('preview-path') || document.getElementById('preview-path');

        // Construct the demo.html path based on component selection
        // Pattern: ../../components/wb-button/wb-button-demo.html, etc.
        const demoPath = `../../components/${componentName}/${componentName}-demo.html`;

        // Add cache buster to prevent caching issues
        const cacheBuster = '?v=' + Date.now();
        if (iframe) iframe.src = demoPath + cacheBuster;

        if (pathDisplay) pathDisplay.textContent = demoPath;
    }

    async runDiagnostics() {
        // Get config from form
        const componentTagSelect = this.shadowRoot?.getElementById('component-tag') || document.getElementById('component-tag');
        const componentJsInput = this.shadowRoot?.getElementById('component-js') || document.getElementById('component-js');
        const cssFileInput = this.shadowRoot?.getElementById('css-file') || document.getElementById('css-file');
        const testHtmlTextarea = this.shadowRoot?.getElementById('test-html') || document.getElementById('test-html');

        if (componentTagSelect) this.CONFIG.tagName = componentTagSelect.value.trim();
        if (componentJsInput) this.CONFIG.jsFile = componentJsInput.value.trim();
        if (cssFileInput) this.CONFIG.cssFile = cssFileInput.value.trim();
        if (testHtmlTextarea) this.CONFIG.testHTML = testHtmlTextarea.value.trim();

        // Show results container
        const resultsContainer = this.shadowRoot?.getElementById('results-container') || document.getElementById('results-container');
        if (resultsContainer) resultsContainer.style.display = 'block';

        // Run synchronous checks
        this.checkEnvironment();
        this.checkCSSVariables();

        // Import component
        await this.importComponent();

        // Inject test instances
        this.injectTestInstances();

        // Update preview iframe
        this.updatePreview();

        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Run all diagnostics
        this.analyzeShadowStructure();
        await this.checkCSSLoading();
        await this.testRenderPersistence();
        this.inspectElements();
        this.checkStyles();
        this.checkDimensions();
        this.checkAttributes();
        this.dumpHTML();
        await this.checkReferences();
        this.generateVerdict();
    }

    checkEnvironment() {
        const results = [];

        results.push('<table>');
        results.push('<tr><th>Check</th><th>Status</th><th>Details</th></tr>');

        const hasCustomElements = typeof customElements !== 'undefined';
        results.push(`<tr>
            <td>Custom Elements API</td>
            <td class="${hasCustomElements ? 'success' : 'error'}">${hasCustomElements ? '✅ Available' : '❌ Missing'}</td>
            <td>${hasCustomElements ? 'Web Components supported' : 'Browser does not support Web Components'}</td>
        </tr>`);

        const hasShadowDOM = typeof Element.prototype.attachShadow !== 'undefined';
        results.push(`<tr>
            <td>Shadow DOM API</td>
            <td class="${hasShadowDOM ? 'success' : 'error'}">${hasShadowDOM ? '✅ Available' : '❌ Missing'}</td>
            <td>${hasShadowDOM ? 'Shadow DOM v1 supported' : 'Browser does not support Shadow DOM'}</td>
        </tr>`);

        const hasModules = 'noModule' in HTMLScriptElement.prototype;
        results.push(`<tr>
            <td>ES Modules</td>
            <td class="${hasModules ? 'success' : 'error'}">${hasModules ? '✅ Supported' : '❌ Not Supported'}</td>
            <td>${hasModules ? 'Can import JS modules' : 'ES6 imports not available'}</td>
        </tr>`);

        // Validate component tag exists
        const componentExists = this.CONFIG.tagName && this.CONFIG.tagName.includes('-');
        results.push(`<tr>
            <td>Target Component</td>
            <td class="${componentExists ? 'success' : 'error'}">${componentExists ? '✅ Valid' : '❌ Invalid'}</td>
            <td><code>&lt;${this.CONFIG.tagName}&gt;</code></td>
        </tr>`);

        // Extract component name from tag (e.g., "wb-button")
        const componentName = this.CONFIG.tagName;

        // Validate JS file path matches component name
        // Accept both relative formats: ./component/component.js OR ../../components/component/component.js
        const expectedJsPath1 = `./${componentName}/${componentName}.js`;
        const expectedJsPath2 = `../../components/${componentName}/${componentName}.js`;
        const jsPathValid = this.CONFIG.jsFile === expectedJsPath1 || this.CONFIG.jsFile === expectedJsPath2;
        results.push(`<tr>
            <td>Component JS File</td>
            <td class="${jsPathValid ? 'success' : 'error'}">${jsPathValid ? '✅ Valid' : '❌ Mismatch'}</td>
            <td><code>${this.CONFIG.jsFile}</code>${jsPathValid ? '' : `<br><span style="color: var(--error-color);">Expected: ${expectedJsPath1} or ${expectedJsPath2}</span>`}</td>
        </tr>`);

        // Validate CSS file matches component name
        const expectedCssFile = `${componentName}.css`;
        const cssValid = this.CONFIG.cssFile === expectedCssFile;
        results.push(`<tr>
            <td>Component CSS File</td>
            <td class="${cssValid ? 'success' : 'error'}">${cssValid ? '✅ Valid' : '❌ Mismatch'}</td>
            <td><code>${this.CONFIG.cssFile}</code>${cssValid ? '' : `<br><span style="color: var(--error-color);">Expected: ${expectedCssFile}</span>`}</td>
        </tr>`);

        // Overall validation check
        const allValid = componentExists && jsPathValid && cssValid;
        if (!allValid) {
            results.push(`<tr style="background: var(--bg-secondary);">
                <td colspan="3" style="color: var(--error-color); font-weight: bold; text-align: center;">
                    ⚠️ CONFIGURATION ERROR: Component name, JS path, and CSS file must all match!
                </td>
            </tr>`);
        }

        results.push('</table>');

        const envCheckElement = this.shadowRoot?.getElementById('env-check') || document.getElementById('env-check');
        if (envCheckElement) envCheckElement.innerHTML = results.join('');
    }

    checkCSSVariables() {
        const results = [];
        const vars = [
            '--primary', '--primary-dark',
            '--success-color', '--success-dark',
            '--error-color', '--error-dark',
            '--bg-primary', '--bg-secondary', '--bg-tertiary',
            '--text-primary', '--text-secondary',
            '--border-color'
        ];

        results.push('<table>');
        results.push('<tr><th>Variable</th><th>Value</th><th>Preview</th></tr>');

        vars.forEach(varName => {
            const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            const exists = value !== '';

            results.push(`<tr>
                <td><code>${varName}</code></td>
                <td class="${exists ? 'success' : 'warning'}">${exists ? value : '⚠️ Not defined'}</td>
                <td>${exists && !value.startsWith('hsl') ? `<span class="color-swatch" style="background: ${value};"></span>` : '-'}</td>
            </tr>`);
        });

        results.push('</table>');

        const cssVarsElement = this.shadowRoot?.getElementById('css-vars') || document.getElementById('css-vars');
        if (cssVarsElement) cssVarsElement.innerHTML = results.join('');
    }

    async importComponent() {
        const results = [];

        try {
            results.push('<div class="info">⏳ Importing wb-base.js...</div>');
            const componentRegElement = this.shadowRoot?.getElementById('component-reg') || document.getElementById('component-reg');
            if (componentRegElement) componentRegElement.innerHTML = results.join('');

            await import('../../components/wb-base/wb-base.js');
            results.push('<div class="success">✅ wb-base.js imported</div>');

            results.push(`<div class="info">⏳ Importing ${this.CONFIG.jsFile}...</div>`);
            if (componentRegElement) componentRegElement.innerHTML = results.join('');

            // Add cache buster to force reload
            const cacheBuster = '?t=' + Date.now();
            await import(this.CONFIG.jsFile + cacheBuster);
            results.push(`<div class="success">✅ ${this.CONFIG.jsFile} imported</div>`);

            // Check registration
            const ComponentClass = customElements.get(this.CONFIG.tagName);

            if (ComponentClass) {
                results.push(`<div class="success">✅ &lt;${this.CONFIG.tagName}&gt; registered with customElements</div>`);
                results.push(`<div class="indent"><strong>Class name:</strong> ${ComponentClass.name}</div>`);

                const observedAttrs = ComponentClass.observedAttributes || [];
                results.push(`<div class="indent"><strong>Observed Attributes:</strong> ${observedAttrs.length > 0 ? observedAttrs.join(', ') : 'None'}</div>`);

                // Store useShadow for later verification (after elements are created)
                window._componentUseShadow = ComponentClass.useShadow;
            } else {
                results.push(`<div class="error">❌ &lt;${this.CONFIG.tagName}&gt; NOT registered</div>`);
            }

        } catch (error) {
            results.push(`<div class="error">❌ Import failed: ${error.message}</div>`);
            results.push(`<pre>${error.stack}</pre>`);
        }

        const componentRegElement = this.shadowRoot?.getElementById('component-reg') || document.getElementById('component-reg');
        if (componentRegElement) componentRegElement.innerHTML = results.join('');
    }

    injectTestInstances() {
        const testArea = this.shadowRoot?.getElementById('test-area') || document.getElementById('test-area');
        if (testArea) testArea.innerHTML = this.CONFIG.testHTML;
    }

    analyzeShadowStructure() {
        const results = [];
        const elements = document.querySelectorAll(this.CONFIG.tagName);

        if (elements.length === 0) {
            results.push(`<div class="error">❌ No &lt;${this.CONFIG.tagName}&gt; elements found in test area</div>`);
            const shadowStructureElement = this.shadowRoot?.getElementById('shadow-structure') || document.getElementById('shadow-structure');
            if (shadowStructureElement) shadowStructureElement.innerHTML = results.join('');
            return;
        }

        results.push(`<div class="info">Found ${elements.length} &lt;${this.CONFIG.tagName}&gt; element(s)</div>`);

        // EXPECTED vs ACTUAL Shadow DOM Check
        const useShadow = window._componentUseShadow;
        const actualHasShadow = elements.length > 0 && !!elements[0].shadowRoot;

        results.push(`<div style="margin: 15px 0; padding: 15px; background: var(--bg-color); border-radius: 4px;">`);

        if (useShadow === true) {
            results.push(`<div class="success"><strong>EXPECTED:</strong> Shadow DOM ENABLED <code>(useShadow = true)</code></div>`);
        } else if (useShadow === false) {
            results.push(`<div class="warning"><strong>EXPECTED:</strong> Light DOM <code>(useShadow = false)</code></div>`);
        } else {
            results.push(`<div class="error"><strong>EXPECTED:</strong> Not configured <code>(useShadow = undefined)</code></div>`);
        }

        if (actualHasShadow) {
            results.push(`<div class="success"><strong>ACTUAL:</strong> Shadow DOM present ✅</div>`);
        } else {
            results.push(`<div class="error"><strong>ACTUAL:</strong> No Shadow DOM found ❌</div>`);
        }

        const matches = (useShadow === true && actualHasShadow) || (useShadow === false && !actualHasShadow);
        if (matches) {
            results.push(`<div class="success" style="margin-top: 10px; font-weight: bold;">✅ MATCH - Component working as configured</div>`);
        } else {
            results.push(`<div class="error" style="margin-top: 10px; font-weight: bold;">❌ MISMATCH - Configuration doesn't match actual rendering!</div>`);
        }

        results.push(`</div>`);

        results.push('<table>');
        results.push('<tr><th>Element</th><th>Shadow Root</th><th>Mode</th><th>Children</th><th>HTML Size</th></tr>');

        elements.forEach((el, index) => {
            const hasShadow = !!el.shadowRoot;

            results.push(`<tr>
                <td>Element ${index + 1}</td>
                <td class="${hasShadow ? 'success' : 'error'}">${hasShadow ? '✅ Present' : '❌ Missing'}</td>
                <td>${hasShadow ? el.shadowRoot.mode : '-'}</td>
                <td>${hasShadow ? el.shadowRoot.childNodes.length : '-'}</td>
                <td>${hasShadow ? el.shadowRoot.innerHTML.length + ' chars' : '-'}</td>
            </tr>`);
        });

        results.push('</table>');

        const shadowStructureElement = this.shadowRoot?.getElementById('shadow-structure') || document.getElementById('shadow-structure');
        if (shadowStructureElement) shadowStructureElement.innerHTML = results.join('');
    }

    async checkCSSLoading() {
        const results = [];
        const element = document.querySelector(this.CONFIG.tagName);

        if (!element?.shadowRoot) {
            results.push('<div class="error">❌ Cannot check - no Shadow DOM</div>');
            const cssLoadingElement = this.shadowRoot?.getElementById('css-loading') || document.getElementById('css-loading');
            if (cssLoadingElement) cssLoadingElement.innerHTML = results.join('');
            return;
        }

        const link = element.shadowRoot.querySelector('link[rel="stylesheet"]');

        if (!link) {
            results.push('<div class="error">❌ No CSS link found in Shadow DOM</div>');
            const cssLoadingElement = this.shadowRoot?.getElementById('css-loading') || document.getElementById('css-loading');
            if (cssLoadingElement) cssLoadingElement.innerHTML = results.join('');
            return;
        }

        results.push('<table>');
        results.push('<tr><th>Property</th><th>Value</th><th>Status</th></tr>');

        const relativeHref = link.getAttribute('href');
        results.push(`<tr>
            <td>href (relative)</td>
            <td><code>${relativeHref}</code></td>
            <td class="info">ℹ️</td>
        </tr>`);

        // PATH VALIDATION CHECKS
        const pathIssues = [];

        // Check 1: Absolute path (starts with /)
        if (relativeHref.startsWith('/')) {
            pathIssues.push('❌ Uses absolute path (/) - should be relative (./ or ../)');
        }

        // Check 2: Missing ./ or ../
        if (!relativeHref.startsWith('./') && !relativeHref.startsWith('../') && !relativeHref.startsWith('/')) {
            pathIssues.push('⚠️ Missing ./ or ../ prefix for relative path');
        }

        // Check 3: Expected filename
        const expectedFilename = this.CONFIG.cssFile;
        if (!relativeHref.includes(expectedFilename)) {
            pathIssues.push(`⚠️ Filename mismatch - expected "${expectedFilename}"`);
        }

        // Check 4: Correct relative path for same directory
        const correctPath = `./${expectedFilename}`;
        if (relativeHref !== correctPath && relativeHref !== `../${this.CONFIG.tagName}/${expectedFilename}`) {
            pathIssues.push(`ℹ️ Recommended path: "${correctPath}"`);
        }

        // Display path validation results
        if (pathIssues.length > 0) {
            results.push(`<tr>
                <td>Path Validation</td>
                <td colspan="2" class="warning">${pathIssues.join('<br>')}</td>
            </tr>`);
        } else {
            results.push(`<tr>
                <td>Path Validation</td>
                <td colspan="2" class="success">✅ Path format correct</td>
            </tr>`);
        }

        const fullURL = new URL(link.href, window.location.href).href;
        results.push(`<tr>
            <td>href (full URL)</td>
            <td><code>${fullURL}</code></td>
            <td class="info">ℹ️</td>
        </tr>`);

        try {
            const response = await fetch(link.href);
            const status = response.status;

            results.push(`<tr>
                <td>HTTP Status</td>
                <td>${status}</td>
                <td class="${status === 200 ? 'success' : 'error'}">${status === 200 ? '✅' : '❌'}</td>
            </tr>`);

            if (response.ok) {
                const cssText = await response.text();
                results.push(`<tr>
                    <td>File Size</td>
                    <td>${cssText.length} bytes (${(cssText.length / 1024).toFixed(2)} KB)</td>
                    <td class="success">✅</td>
                </tr>`);

                const usesVars = cssText.includes('var(--');
                results.push(`<tr>
                    <td>Uses CSS Variables</td>
                    <td>${usesVars ? 'Yes' : 'No'}</td>
                    <td class="${usesVars ? 'success' : 'warning'}">${usesVars ? '✅' : '⚠️'}</td>
                </tr>`);
            }
        } catch (error) {
            results.push(`<tr>
                <td colspan="3" class="error">❌ Failed to fetch CSS: ${error.message}</td>
            </tr>`);
            results.push(`<tr>
                <td colspan="3" class="warning">⚠️ This usually means the CSS path is incorrect or file doesn't exist</td>
            </tr>`);
        }

        results.push('</table>');

        const cssLoadingElement = this.shadowRoot?.getElementById('css-loading') || document.getElementById('css-loading');
        if (cssLoadingElement) cssLoadingElement.innerHTML = results.join('');
    }

    async testRenderPersistence() {
        const results = [];
        const element = document.querySelector(this.CONFIG.tagName);

        if (!element?.shadowRoot) {
            results.push('<div class="error">❌ Cannot test - no Shadow DOM</div>');
            const renderPersistenceElement = this.shadowRoot?.getElementById('render-persistence') || document.getElementById('render-persistence');
            if (renderPersistenceElement) renderPersistenceElement.innerHTML = results.join('');
            return;
        }

        results.push('<table>');
        results.push('<tr><th>Test</th><th>Result</th><th>Status</th></tr>');

        // Test 1: Check if CSS link exists BEFORE triggering render
        const linkBefore = element.shadowRoot.querySelector('link[rel="stylesheet"]');
        const hasLinkBefore = !!linkBefore;
        results.push(`<tr>
            <td>CSS Link Before Re-render</td>
            <td>${hasLinkBefore ? 'Present' : 'Missing'}</td>
            <td class="${hasLinkBefore ? 'success' : 'error'}">${hasLinkBefore ? '✅' : '❌'}</td>
        </tr>`);

        if (!hasLinkBefore) {
            results.push(`<tr>
                <td colspan="3" class="warning">⚠️ Cannot test persistence - no CSS link found initially</td>
            </tr>`);
            results.push('</table>');
            const renderPersistenceElement = this.shadowRoot?.getElementById('render-persistence') || document.getElementById('render-persistence');
            if (renderPersistenceElement) renderPersistenceElement.innerHTML = results.join('');
            return;
        }

        // Test 2: Force a re-render by changing an attribute
        const originalVariant = element.getAttribute('variant') || 'primary';
        const newVariant = originalVariant === 'primary' ? 'secondary' : 'primary';

        results.push(`<tr>
            <td>Triggering Re-render</td>
            <td>Changed variant: ${originalVariant} → ${newVariant}</td>
            <td class="info">ℹ️</td>
        </tr>`);

        element.setAttribute('variant', newVariant);

        // Wait for render to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Test 3: Check if CSS link STILL exists AFTER render
        const linkAfter = element.shadowRoot.querySelector('link[rel="stylesheet"]');
        const hasLinkAfter = !!linkAfter;
        const linkPersisted = hasLinkAfter;

        results.push(`<tr>
            <td>CSS Link After Re-render</td>
            <td>${hasLinkAfter ? 'Present' : 'Missing'}</td>
            <td class="${hasLinkAfter ? 'success' : 'error'}">${hasLinkAfter ? '✅' : '❌'}</td>
        </tr>`);

        // Test 4: Final verdict
        if (linkPersisted) {
            results.push(`<tr style="background: var(--bg-tertiary);">
                <td colspan="3" class="success" style="font-weight: bold;">
                    ✅ PASS: CSS link persists after re-render. Component properly preserves styles.
                </td>
            </tr>`);
        } else {
            results.push(`<tr style="background: var(--bg-secondary);">
                <td colspan="3" class="error" style="font-weight: bold;">
                    ❌ FAIL: CSS link destroyed by render(). Component's render() method is using innerHTML without preserving <link> tags!
                    <br><br>
                    👉 FIX: Update render() to save and re-append CSS links:
                    <pre style="margin: 10px 0; padding: 10px; background: var(--neutral-900); color: var(--success-color); font-size: 10px;">const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link'));
this.shadowRoot.innerHTML = html;
existingLinks.forEach(link => this.shadowRoot.appendChild(link));</pre>
                </td>
            </tr>`);
        }

        // Restore original variant
        element.setAttribute('variant', originalVariant);

        results.push('</table>');
        const renderPersistenceElement = this.shadowRoot?.getElementById('render-persistence') || document.getElementById('render-persistence');
        if (renderPersistenceElement) renderPersistenceElement.innerHTML = results.join('');
    }

    inspectElements() {
        const results = [];
        const elements = document.querySelectorAll(this.CONFIG.tagName);

        results.push('<table>');
        results.push('<tr><th>Element</th><th>Shadow Elements</th><th>Element Types</th></tr>');

        elements.forEach((el, index) => {
            if (!el.shadowRoot) {
                results.push(`<tr>
                    <td>Element ${index + 1}</td>
                    <td colspan="2" class="error">No Shadow DOM</td>
                </tr>`);
                return;
            }

            const allElements = el.shadowRoot.querySelectorAll('*');
            const elementTypes = {};

            allElements.forEach(elem => {
                const tag = elem.tagName.toLowerCase();
                elementTypes[tag] = (elementTypes[tag] || 0) + 1;
            });

            const typesList = Object.entries(elementTypes)
                .map(([tag, count]) => `${tag} (${count})`)
                .join(', ');

            results.push(`<tr>
                <td>Element ${index + 1}</td>
                <td>${allElements.length} elements</td>
                <td><code>${typesList || 'None'}</code></td>
            </tr>`);
        });

        results.push('</table>');

        const elementInspectElement = this.shadowRoot?.getElementById('element-inspect') || document.getElementById('element-inspect');
        if (elementInspectElement) elementInspectElement.innerHTML = results.join('');
    }

    checkStyles() {
        const results = [];
        const elements = document.querySelectorAll(this.CONFIG.tagName);

        results.push('<table>');
        results.push('<tr><th>Element</th><th>First Shadow Element</th><th>Background</th><th>Color</th><th>Display</th></tr>');

        elements.forEach((el, index) => {
            const firstElement = el.shadowRoot?.querySelector('*:not(link):not(style)');

            if (!firstElement) {
                results.push(`<tr>
                    <td>Element ${index + 1}</td>
                    <td colspan="4" class="error">No renderable elements in Shadow DOM</td>
                </tr>`);
                return;
            }

            const computed = getComputedStyle(firstElement);
            const bg = computed.backgroundColor;
            const color = computed.color;
            const display = computed.display;

            const hasColor = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';

            results.push(`<tr>
                <td>Element ${index + 1}</td>
                <td><code>&lt;${firstElement.tagName.toLowerCase()}&gt;</code></td>
                <td class="${hasColor ? 'success' : 'warning'}"><code>${bg}</code></td>
                <td><code>${color}</code></td>
                <td><code>${display}</code></td>
            </tr>`);
        });

        results.push('</table>');

        const stylesCheckElement = this.shadowRoot?.getElementById('styles-check') || document.getElementById('styles-check');
        if (stylesCheckElement) stylesCheckElement.innerHTML = results.join('');
    }

    checkDimensions() {
        const results = [];
        const elements = document.querySelectorAll(this.CONFIG.tagName);

        results.push('<table>');
        results.push('<tr><th>Element</th><th>Width</th><th>Height</th><th>Visible</th></tr>');

        elements.forEach((el, index) => {
            const firstElement = el.shadowRoot?.querySelector('*:not(link):not(style)');

            if (!firstElement) {
                results.push(`<tr>
                    <td>Element ${index + 1}</td>
                    <td colspan="3" class="error">No elements to measure</td>
                </tr>`);
                return;
            }

            const rect = firstElement.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;

            results.push(`<tr>
                <td>Element ${index + 1}</td>
                <td>${rect.width.toFixed(1)}px</td>
                <td>${rect.height.toFixed(1)}px</td>
                <td class="${isVisible ? 'success' : 'error'}">${isVisible ? '✅ Visible' : '❌ Hidden'}</td>
            </tr>`);
        });

        results.push('</table>');

        const dimensionsElement = this.shadowRoot?.getElementById('dimensions') || document.getElementById('dimensions');
        if (dimensionsElement) dimensionsElement.innerHTML = results.join('');
    }

    checkAttributes() {
        const results = [];
        const element = document.querySelector(this.CONFIG.tagName);

        if (!element) {
            results.push('<div class="error">❌ No elements to test</div>');
            const attributesElement = this.shadowRoot?.getElementById('attributes') || document.getElementById('attributes');
            if (attributesElement) attributesElement.innerHTML = results.join('');
            return;
        }

        results.push('<table>');
        results.push('<tr><th>Attribute</th><th>Value</th></tr>');

        Array.from(element.attributes).forEach(attr => {
            results.push(`<tr>
                <td><code>${attr.name}</code></td>
                <td><code>${attr.value}</code></td>
            </tr>`);
        });

        if (element.attributes.length === 0) {
            results.push('<tr><td colspan="2" class="warning">⚠️ No attributes set</td></tr>');
        }

        results.push('</table>');

        const attributesElement = this.shadowRoot?.getElementById('attributes') || document.getElementById('attributes');
        if (attributesElement) attributesElement.innerHTML = results.join('');
    }

    dumpHTML() {
        const results = [];
        const elements = document.querySelectorAll(this.CONFIG.tagName);

        elements.forEach((el, index) => {
            if (el.shadowRoot) {
                results.push(`<h3>Element ${index + 1}:</h3>`);
                results.push(`<pre>${el.shadowRoot.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`);
            }
        });

        if (results.length === 0) {
            results.push('<div class="error">❌ No Shadow DOM to display</div>');
        }

        const htmlDumpElement = this.shadowRoot?.getElementById('html-dump') || document.getElementById('html-dump');
        if (htmlDumpElement) htmlDumpElement.innerHTML = results.join('');
    }

    generateVerdict() {
        const results = [];
        const issues = [];
        const passes = [];

        const elements = document.querySelectorAll(this.CONFIG.tagName);
        const ComponentClass = customElements.get(this.CONFIG.tagName);

        // CHECK 1: Shadow DOM Configuration Match
        if (ComponentClass) {
            const useShadow = ComponentClass.useShadow;
            const actualHasShadow = elements.length > 0 && !!elements[0].shadowRoot;
            const matches = (useShadow === true && actualHasShadow) || (useShadow === false && !actualHasShadow);

            if (!matches) {
                if (useShadow === true && !actualHasShadow) {
                    issues.push(`❌ CRITICAL: Expected Shadow DOM but found Light DOM (useShadow = true but shadowRoot missing)`);
                } else if (useShadow === false && actualHasShadow) {
                    issues.push(`❌ CRITICAL: Expected Light DOM but found Shadow DOM (useShadow = false but shadowRoot present)`);
                } else if (useShadow === undefined) {
                    issues.push(`❌ CRITICAL: useShadow not configured in component class`);
                }
            } else {
                passes.push(`✅ Shadow DOM configuration matches actual rendering`);
            }
        }

        // CHECK 2: Element Existence
        if (elements.length === 0) {
            issues.push(`No &lt;${this.CONFIG.tagName}&gt; elements found`);
        } else {
            passes.push(`Found ${elements.length} &lt;${this.CONFIG.tagName}&gt; element(s)`);

            // CHECK 3-N: Per-Element Checks
            elements.forEach((el, index) => {
                if (!el.shadowRoot) {
                    issues.push(`Element ${index + 1}: No Shadow DOM`);
                } else {
                    passes.push(`Element ${index + 1}: Shadow DOM created`);

                    const firstElement = el.shadowRoot.querySelector('*:not(link):not(style)');
                    if (!firstElement) {
                        issues.push(`Element ${index + 1}: No renderable content`);
                    } else {
                        const rect = firstElement.getBoundingClientRect();
                        if (rect.width === 0 || rect.height === 0) {
                            issues.push(`Element ${index + 1}: Zero dimensions (invisible)`);
                        } else {
                            passes.push(`Element ${index + 1}: Visible (${rect.width.toFixed(1)}×${rect.height.toFixed(1)}px)`);
                        }

                        // CHECK: Color/CSS application
                        const computed = getComputedStyle(firstElement);
                        const bg = computed.backgroundColor;
                        const color = computed.color;

                        // Detect if colors are wrong (all gray or default)
                        const isGrayBg = bg.includes('240, 240, 240') || bg.includes('rgb(240, 240, 240)');
                        const isTransparent = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';
                        const isDefaultRed = color.includes('rgb(255, 0, 0)') || color.includes('rgba(255, 0, 0');

                        if (isGrayBg) {
                            issues.push(`Element ${index + 1}: Wrong background - all gray (CSS not applied)`);
                        } else if (isTransparent && !isDefaultRed) {
                            // Transparent bg is OK if text isn't red
                            passes.push(`Element ${index + 1}: Background color applied`);
                        } else if (!isTransparent) {
                            passes.push(`Element ${index + 1}: Background color applied (${bg})`);
                        }

                        // Red text = CSS failure
                        if (isDefaultRed) {
                            issues.push(`Element ${index + 1}: Text is RED - CSS failed to load`);
                        }

                        // CHECK: CSS link presence
                        const link = el.shadowRoot.querySelector('link[rel="stylesheet"]');
                        if (!link) {
                            issues.push(`Element ${index + 1}: No CSS link in Shadow DOM`);
                        } else {
                            passes.push(`Element ${index + 1}: CSS link present`);
                        }
                    }
                }
            });
        }

        // Include reference check results if available
        if (this._refIssues && this._refIssues.length > 0) {
            this._refIssues.forEach(issue => {
                issues.push(`Reference: ${issue}`);
            });
        }
        if (this._refPasses && this._refPasses.length > 0) {
            this._refPasses.forEach(pass => {
                passes.push(`Reference: ${pass}`);
            });
        }

        // Generate verdict
        if (issues.length === 0) {
            results.push('<div class="summary-box summary-pass">🎉 ALL TESTS PASSED</div>');
        } else {
            results.push('<div class="summary-box summary-fail">🔥 ISSUES DETECTED</div>');
        }

        // Show passes
        if (passes.length > 0) {
            results.push('<div class="pass-list">');
            results.push('<h3 style="color: var(--success-color); margin-top: 0;">✅ Passing Checks:</h3>');
            passes.forEach(pass => {
                results.push(`<div class="success">✅ ${pass}</div>`);
            });
            results.push('</div>');
        }

        // Show issues
        if (issues.length > 0) {
            results.push('<div class="issue-list">');
            results.push('<h3 style="color: var(--error-color); margin-top: 0;">❌ Issues Found:</h3>');
            issues.forEach(issue => {
                results.push(`<div class="error">❌ ${issue}</div>`);
            });
            results.push('</div>');
        }

        // Summary stats - SHOW ALL TESTS
        results.push('<h3 style="margin-top: 30px;">📊 Summary Statistics:</h3>');
        results.push(`<div class="metric">Component: <strong>&lt;${this.CONFIG.tagName}&gt;</strong></div>`);

        const totalChecks = passes.length + issues.length;

        results.push(`<div class="metric">Total Checks: ${totalChecks}</div>`);
        results.push(`<div class="metric success">Passed: ${passes.length}</div>`);
        results.push(`<div class="metric error">Failed: ${issues.length}</div>`);
        if (totalChecks > 0) {
            results.push(`<div class="metric info">Success Rate: ${((passes.length / totalChecks) * 100).toFixed(1)}%</div>`);
        }

        const finalVerdictElement = this.shadowRoot?.getElementById('final-verdict') || document.getElementById('final-verdict');
        if (finalVerdictElement) finalVerdictElement.innerHTML = results.join('');
    }

    async checkReferences() {
        const results = [];
        const componentName = this.CONFIG.tagName;
        const jsPath = this.CONFIG.jsFile;
        const componentFolder = `../../components/${componentName}/`;
        
        results.push('<h3>🔗 Reference Check for: ' + componentName + '</h3>');
        results.push('<table>');
        results.push('<tr><th>File</th><th>Type</th><th>Reference</th><th>Status</th></tr>');

        const issues = [];
        const passes = [];

        // Helper to check if a file exists via fetch
        const checkFileExists = async (url) => {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;
            } catch {
                return false;
            }
        };

        // Helper to resolve relative path
        const resolvePath = (basePath, relativePath) => {
            const base = new URL(basePath, window.location.href);
            return new URL(relativePath, base).href;
        };

        // 1. Check JS file imports
        try {
            const cacheBuster = '?t=' + Date.now();
            const jsResponse = await fetch(jsPath + cacheBuster);
            if (jsResponse.ok) {
                const jsContent = await jsResponse.text();
                
                // Find all import statements
                const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
                let match;
                
                while ((match = importRegex.exec(jsContent)) !== null) {
                    const importPath = match[1];
                    
                    // Skip external imports (npm packages)
                    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
                        continue;
                    }
                    
                    const resolvedUrl = resolvePath(jsPath, importPath);
                    const exists = await checkFileExists(resolvedUrl);
                    
                    if (exists) {
                        passes.push(`JS import: ${importPath}`);
                        results.push(`<tr>
                            <td><code>${componentName}.js</code></td>
                            <td>import</td>
                            <td><code>${importPath}</code></td>
                            <td class="success">✅ OK</td>
                        </tr>`);
                    } else {
                        issues.push(`JS import: ${importPath}`);
                        results.push(`<tr>
                            <td><code>${componentName}.js</code></td>
                            <td>import</td>
                            <td><code>${importPath}</code></td>
                            <td class="error">❌ BROKEN</td>
                        </tr>`);
                    }
                }
                
                // Find dynamic imports
                const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
                while ((match = dynamicImportRegex.exec(jsContent)) !== null) {
                    const importPath = match[1];
                    
                    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
                        continue;
                    }
                    
                    const resolvedUrl = resolvePath(jsPath, importPath);
                    const exists = await checkFileExists(resolvedUrl);
                    
                    if (exists) {
                        passes.push(`Dynamic import: ${importPath}`);
                        results.push(`<tr>
                            <td><code>${componentName}.js</code></td>
                            <td>dynamic import</td>
                            <td><code>${importPath}</code></td>
                            <td class="success">✅ OK</td>
                        </tr>`);
                    } else {
                        issues.push(`Dynamic import: ${importPath}`);
                        results.push(`<tr>
                            <td><code>${componentName}.js</code></td>
                            <td>dynamic import</td>
                            <td><code>${importPath}</code></td>
                            <td class="error">❌ BROKEN</td>
                        </tr>`);
                    }
                }
            } else {
                issues.push(`Cannot read JS file: ${jsPath}`);
                results.push(`<tr>
                    <td colspan="4" class="error">❌ Cannot read JS file: ${jsPath}</td>
                </tr>`);
            }
        } catch (error) {
            issues.push(`Error reading JS: ${error.message}`);
            results.push(`<tr>
                <td colspan="4" class="error">❌ Error reading JS: ${error.message}</td>
            </tr>`);
        }

        // 2. Check Demo HTML file references
        const demoPath = `${componentFolder}${componentName}-demo.html`;
        try {
            const cacheBuster = '?t=' + Date.now();
            const htmlResponse = await fetch(demoPath + cacheBuster);
            if (htmlResponse.ok) {
                const htmlContent = await htmlResponse.text();
                
                // Find all <link href="...">
                const linkRegex = /<link\s+[^>]*href=['"]([^'"]+)['"][^>]*>/gi;
                let match;
                
                while ((match = linkRegex.exec(htmlContent)) !== null) {
                    const href = match[1];
                    
                    // Skip external links
                    if (/^(https?:)?\/\//.test(href) || href.startsWith('data:')) {
                        continue;
                    }
                    
                    const resolvedUrl = resolvePath(demoPath, href);
                    const exists = await checkFileExists(resolvedUrl);
                    
                    if (exists) {
                        passes.push(`<link href>: ${href}`);
                        results.push(`<tr>
                            <td><code>${componentName}-demo.html</code></td>
                            <td>&lt;link&gt;</td>
                            <td><code>${href}</code></td>
                            <td class="success">✅ OK</td>
                        </tr>`);
                    } else {
                        issues.push(`<link href>: ${href}`);
                        results.push(`<tr>
                            <td><code>${componentName}-demo.html</code></td>
                            <td>&lt;link&gt;</td>
                            <td><code>${href}</code></td>
                            <td class="error">❌ BROKEN</td>
                        </tr>`);
                    }
                }
                
                // Find all <script src="...">
                const scriptRegex = /<script\s+[^>]*src=['"]([^'"]+)['"][^>]*>/gi;
                while ((match = scriptRegex.exec(htmlContent)) !== null) {
                    const src = match[1];
                    
                    // Skip external scripts
                    if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) {
                        continue;
                    }
                    
                    const resolvedUrl = resolvePath(demoPath, src);
                    const exists = await checkFileExists(resolvedUrl);
                    
                    if (exists) {
                        passes.push(`<script src>: ${src}`);
                        results.push(`<tr>
                            <td><code>${componentName}-demo.html</code></td>
                            <td>&lt;script&gt;</td>
                            <td><code>${src}</code></td>
                            <td class="success">✅ OK</td>
                        </tr>`);
                    } else {
                        issues.push(`<script src>: ${src}`);
                        results.push(`<tr>
                            <td><code>${componentName}-demo.html</code></td>
                            <td>&lt;script&gt;</td>
                            <td><code>${src}</code></td>
                            <td class="error">❌ BROKEN</td>
                        </tr>`);
                    }
                }
                
                // CHECK FOR INLINE STYLES (should be in external .css files)
                const inlineStyleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
                const inlineStyles = htmlContent.match(inlineStyleRegex) || [];
                if (inlineStyles.length > 0) {
                    issues.push(`Inline <style> tags: ${inlineStyles.length} found (move to external .css)`);
                    results.push(`<tr>
                        <td><code>${componentName}-demo.html</code></td>
                        <td>inline &lt;style&gt;</td>
                        <td>${inlineStyles.length} inline style block(s)</td>
                        <td class="error">❌ DISALLOWED</td>
                    </tr>`);
                } else {
                    passes.push(`No inline <style> tags`);
                    results.push(`<tr>
                        <td><code>${componentName}-demo.html</code></td>
                        <td>inline &lt;style&gt;</td>
                        <td>None found</td>
                        <td class="success">✅ OK</td>
                    </tr>`);
                }
                
                // CHECK FOR INLINE SCRIPTS (scripts without src attribute)
                // Match <script> tags that DON'T have src attribute and contain code
                const allScriptTags = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
                let inlineScriptCount = 0;
                allScriptTags.forEach(tag => {
                    // Skip if it has src attribute
                    if (/src=['"]/.test(tag)) return;
                    // Skip empty scripts
                    const content = tag.replace(/<script[^>]*>/, '').replace(/<\/script>/i, '').trim();
                    if (content.length > 0) {
                        inlineScriptCount++;
                    }
                });
                
                if (inlineScriptCount > 0) {
                    issues.push(`Inline <script> blocks: ${inlineScriptCount} found (move to external .js)`);
                    results.push(`<tr>
                        <td><code>${componentName}-demo.html</code></td>
                        <td>inline &lt;script&gt;</td>
                        <td>${inlineScriptCount} inline script block(s)</td>
                        <td class="error">❌ DISALLOWED</td>
                    </tr>`);
                } else {
                    passes.push(`No inline <script> blocks`);
                    results.push(`<tr>
                        <td><code>${componentName}-demo.html</code></td>
                        <td>inline &lt;script&gt;</td>
                        <td>None found</td>
                        <td class="success">✅ OK</td>
                    </tr>`);
                }
            } else {
                results.push(`<tr>
                    <td colspan="4" class="warning">⚠️ No demo HTML file found: ${demoPath}</td>
                </tr>`);
            }
        } catch (error) {
            results.push(`<tr>
                <td colspan="4" class="warning">⚠️ Could not check demo HTML: ${error.message}</td>
            </tr>`);
        }

        // 3. Check CSS file exists
        const cssPath = `${componentFolder}${this.CONFIG.cssFile}`;
        const cssExists = await checkFileExists(cssPath + '?t=' + Date.now());
        if (cssExists) {
            passes.push(`CSS file: ${this.CONFIG.cssFile}`);
            results.push(`<tr>
                <td><code>${componentName}/</code></td>
                <td>CSS file</td>
                <td><code>${this.CONFIG.cssFile}</code></td>
                <td class="success">✅ OK</td>
            </tr>`);
        } else {
            issues.push(`CSS file: ${this.CONFIG.cssFile}`);
            results.push(`<tr>
                <td><code>${componentName}/</code></td>
                <td>CSS file</td>
                <td><code>${this.CONFIG.cssFile}</code></td>
                <td class="error">❌ MISSING</td>
            </tr>`);
        }

        results.push('</table>');

        // Summary
        results.push('<div style="margin-top: 20px;">');
        if (issues.length === 0) {
            results.push('<div class="summary-box summary-pass">✅ ALL REFERENCES VALID</div>');
        } else {
            results.push('<div class="summary-box summary-fail">❌ ' + issues.length + ' BROKEN REFERENCE(S)</div>');
            results.push('<div class="issue-list" style="margin-top: 10px;">');
            issues.forEach(issue => {
                results.push(`<div class="error">❌ ${issue}</div>`);
            });
            results.push('</div>');
        }
        results.push(`<div class="metric" style="margin-top: 10px;">Total: ${passes.length + issues.length} | ✅ OK: ${passes.length} | ❌ Broken: ${issues.length}</div>`);
        results.push('</div>');

        // Store issues for verdict
        this._refIssues = issues;
        this._refPasses = passes;

        const refCheckElement = this.shadowRoot?.getElementById('ref-check') || document.getElementById('ref-check');
        if (refCheckElement) refCheckElement.innerHTML = results.join('');

        // Show results container if hidden
        const resultsContainer = this.shadowRoot?.getElementById('results-container') || document.getElementById('results-container');
        if (resultsContainer) resultsContainer.style.display = 'block';
    }

    copyIssuesToClipboard() {
        const elements = document.querySelectorAll(this.CONFIG.tagName);
        const ComponentClass = customElements.get(this.CONFIG.tagName);
        let report = [];

        report.push('═'.repeat(80));
        report.push('WB COMPONENT SHADOW DOM DIAGNOSTIC REPORT');
        report.push('═'.repeat(80));
        report.push('');
        report.push(`Component: <${this.CONFIG.tagName}>`);
        report.push(`JS File: ${this.CONFIG.jsFile}`);
        report.push(`CSS File: ${this.CONFIG.cssFile}`);

        // Add useShadow configuration with EXPECTED vs ACTUAL
        if (ComponentClass) {
            const useShadow = ComponentClass.useShadow;
            const actualHasShadow = elements.length > 0 && !!elements[0].shadowRoot;

            // EXPECTED
            if (useShadow === true) {
                report.push(`EXPECTED: Shadow DOM ENABLED (useShadow = true)`);
            } else if (useShadow === false) {
                report.push(`EXPECTED: Light DOM (useShadow = false)`);
            } else {
                report.push(`EXPECTED: Not configured (useShadow = undefined)`);
            }

            // ACTUAL
            if (actualHasShadow) {
                report.push(`ACTUAL: Shadow DOM present ✅`);
            } else {
                report.push(`ACTUAL: No Shadow DOM found ❌`);
            }

            // MATCH/MISMATCH
            const matches = (useShadow === true && actualHasShadow) || (useShadow === false && !actualHasShadow);
            if (matches) {
                report.push(`✅ MATCH - Component working as configured`);
            } else {
                report.push(`❌ MISMATCH - Configuration doesn't match actual rendering!`);
            }
            report.push('');
        }

        report.push(`Date: ${new Date().toLocaleString()}`);
        report.push('');
        report.push('─'.repeat(80));
        report.push('ISSUES DETECTED');
        report.push('─'.repeat(80));
        report.push('');

        const issues = [];
        const passes = [];

        if (elements.length === 0) {
            issues.push(`❌ No <${this.CONFIG.tagName}> elements found`);
        } else {
            passes.push(`✅ Found ${elements.length} <${this.CONFIG.tagName}> element(s)`);

            elements.forEach((el, index) => {
                if (!el.shadowRoot) {
                    issues.push(`❌ Element ${index + 1}: No Shadow DOM`);
                } else {
                    passes.push(`✅ Element ${index + 1}: Shadow DOM created`);

                    const firstElement = el.shadowRoot.querySelector('*:not(link):not(style)');
                    if (!firstElement) {
                        issues.push(`❌ Element ${index + 1}: No renderable content`);
                    } else {
                        const rect = firstElement.getBoundingClientRect();
                        if (rect.width === 0 || rect.height === 0) {
                            issues.push(`❌ Element ${index + 1}: Zero dimensions (invisible)`);
                        } else {
                            passes.push(`✅ Element ${index + 1}: Visible (${rect.width.toFixed(1)}×${rect.height.toFixed(1)}px)`);
                        }

                        const computed = getComputedStyle(firstElement);
                        const bg = computed.backgroundColor;

                        // Check if color is correct (not gray)
                        const isGray = bg.includes('240, 240, 240') || bg.includes('rgb(240, 240, 240)');

                        if (isGray) {
                            issues.push(`❌ Element ${index + 1}: Wrong color - all gray (CSS not applied correctly)`);
                        } else if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                            issues.push(`❌ Element ${index + 1}: No background color (CSS not applied)`);
                        } else {
                            passes.push(`✅ Element ${index + 1}: Has correct background color (${bg})`);
                        }
                    }

                    const link = el.shadowRoot.querySelector('link[rel="stylesheet"]');
                    if (!link) {
                        issues.push(`❌ Element ${index + 1}: No CSS link in Shadow DOM`);
                    } else {
                        passes.push(`✅ Element ${index + 1}: CSS link present (${link.getAttribute('href')})`);
                    }
                }
            });
        }

        if (issues.length > 0) {
            issues.forEach(issue => report.push(issue));
        } else {
            report.push('🎉 NO ISSUES DETECTED - ALL TESTS PASSED!');
        }

        // Add reference check results
        if (this._refIssues && this._refIssues.length > 0) {
            report.push('');
            report.push('\nREFERENCE ISSUES:');
            this._refIssues.forEach(issue => report.push(`❌ Reference: ${issue}`));
        }

        report.push('');
        report.push('─'.repeat(80));
        report.push('PASSING CHECKS');
        report.push('─'.repeat(80));
        report.push('');
        passes.forEach(pass => report.push(pass));

        // Add reference passes
        if (this._refPasses && this._refPasses.length > 0) {
            report.push('');
            report.push('REFERENCE CHECKS (OK):');
            this._refPasses.forEach(pass => report.push(`✅ Reference: ${pass}`));
        }

        report.push('');
        report.push('─'.repeat(80));
        report.push('SUMMARY');
        report.push('─'.repeat(80));
        report.push('');

        const totalChecks = passes.length + issues.length;

        report.push(`Total Checks: ${totalChecks}`);
        report.push(`Passed: ${passes.length}`);
        report.push(`Failed: ${issues.length}`);
        if (totalChecks > 0) {
            report.push(`Success Rate: ${((passes.length / totalChecks) * 100).toFixed(1)}%`);
        }
        report.push('');
        report.push('═'.repeat(80));

        const reportText = report.join('\n');

        navigator.clipboard.writeText(reportText).then(() => {
            alert('✅ Issues report copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Copy failed. Report:\n\n' + reportText);
        });
    }
}

customElements.define('wb-shadow-diagnostics', WBShadowDiagnostics);

export default WBShadowDiagnostics;

// If the diagnostic page markup is present (not using the custom element),
// create a controller instance so the module binds to the existing DOM and runs.
// Auto-initialize diagnostics controller for legacy markup or slot/projected content
if (typeof document !== 'undefined') {
    // Try to find the config panel inside wb-demo slot
    let root = document;
    let configPanel = root.getElementById('component-tag');
    if (!configPanel) {
        // Try to find inside any wb-demo slot
        const wbDemo = document.querySelector('wb-demo');
        if (wbDemo) {
            // Find slot content (examples)
            const slotContent = wbDemo.querySelector('[slot="examples"]') || wbDemo.querySelector('div[slot="examples"]');
            if (slotContent) {
                configPanel = slotContent.querySelector('#component-tag');
                root = slotContent;
            }
        }
    }
    if (configPanel) {
        // Patch: pass root to controller so it wires events to slot content
        const __WBShadowDiagnosticsPageController = new WBShadowDiagnostics();
        __WBShadowDiagnosticsPageController._root = root;
        if (typeof __WBShadowDiagnosticsPageController.initializeDiagnostics === 'function') {
            __WBShadowDiagnosticsPageController.initializeDiagnostics();
        }
    }
}