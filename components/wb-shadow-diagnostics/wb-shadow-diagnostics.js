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
        this._refIssues = [];
        this._refPasses = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.checkBackend().then(() => {
            this.initializeDiagnostics();
        });
    }

    async checkBackend() {
        const statusUrl = '/api/status';
        try {
            const resp = await fetch(statusUrl, { method: 'GET' });
            if (resp.ok) {
                this.backendStatus = 'ok';
            } else {
                this.backendStatus = 'error';
            }
        } catch (err) {
            this.backendStatus = 'error';
        }
        const envCheckElement = document.getElementById('env-check');
        if (envCheckElement && this.backendStatus === 'error') {
            envCheckElement.innerHTML = '<div class="error">❌ Backend API not running or unreachable. Some features may not work.</div>' + envCheckElement.innerHTML;
        }
    }

    initializeDiagnostics() {
        this.setupEventListeners();
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
        const checkRefsBtn = this.shadowRoot?.getElementById('check-refs-btn') || document.getElementById('check-refs-btn');

        if (componentTagSelect) {
            // AUTO-RUN diagnostics on component change
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

        const componentTagSelect = this.shadowRoot?.getElementById('component-tag') || document.getElementById('component-tag');
        const componentJsInput = this.shadowRoot?.getElementById('component-js') || document.getElementById('component-js');
        const cssFileInput = this.shadowRoot?.getElementById('css-file') || document.getElementById('css-file');
        const testHtmlTextarea = this.shadowRoot?.getElementById('test-html') || document.getElementById('test-html');

        if (componentTagSelect) componentTagSelect.value = 'wb-button';
        if (componentJsInput) componentJsInput.value = this.CONFIG.jsFile;
        if (cssFileInput) cssFileInput.value = this.CONFIG.cssFile;
        if (testHtmlTextarea) testHtmlTextarea.value = this.CONFIG.testHTML;
    }

    async onComponentChange(e) {
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

        // Update preview
        this.updatePreview();

        // AUTO-RUN diagnostics when component changes
        await this.runDiagnostics();
        
        // AUTO-COPY issues to clipboard after diagnostics complete
        this.copyIssuesToClipboard(true); // silent mode
    }

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

        const demoPath = `../../components/${componentName}/${componentName}-demo.html`;
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

        const componentExists = this.CONFIG.tagName && this.CONFIG.tagName.includes('-');
        results.push(`<tr>
            <td>Target Component</td>
            <td class="${componentExists ? 'success' : 'error'}">${componentExists ? '✅ Valid' : '❌ Invalid'}</td>
            <td><code>&lt;${this.CONFIG.tagName}&gt;</code></td>
        </tr>`);

        const componentName = this.CONFIG.tagName;
        const expectedJsPath1 = `./${componentName}/${componentName}.js`;
        const expectedJsPath2 = `../../components/${componentName}/${componentName}.js`;
        const jsPathValid = this.CONFIG.jsFile === expectedJsPath1 || this.CONFIG.jsFile === expectedJsPath2;
        results.push(`<tr>
            <td>Component JS File</td>
            <td class="${jsPathValid ? 'success' : 'error'}">${jsPathValid ? '✅ Valid' : '❌ Mismatch'}</td>
            <td><code>${this.CONFIG.jsFile}</code>${jsPathValid ? '' : `<br><span style="color: var(--error-color);">Expected: ${expectedJsPath2}</span>`}</td>
        </tr>`);

        const expectedCssFile = `${componentName}.css`;
        const cssValid = this.CONFIG.cssFile === expectedCssFile;
        results.push(`<tr>
            <td>Component CSS File</td>
            <td class="${cssValid ? 'success' : 'error'}">${cssValid ? '✅ Valid' : '❌ Mismatch'}</td>
            <td><code>${this.CONFIG.cssFile}</code>${cssValid ? '' : `<br><span style="color: var(--error-color);">Expected: ${expectedCssFile}</span>`}</td>
        </tr>`);

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

            const cacheBuster = '?t=' + Date.now();
            await import(this.CONFIG.jsFile + cacheBuster);
            results.push(`<div class="success">✅ ${this.CONFIG.jsFile} imported</div>`);

            const ComponentClass = customElements.get(this.CONFIG.tagName);

            if (ComponentClass) {
                results.push(`<div class="success">✅ &lt;${this.CONFIG.tagName}&gt; registered with customElements</div>`);
                results.push(`<div class="indent"><strong>Class name:</strong> ${ComponentClass.name}</div>`);

                const observedAttrs = ComponentClass.observedAttributes || [];
                results.push(`<div class="indent"><strong>Observed Attributes:</strong> ${observedAttrs.length > 0 ? observedAttrs.join(', ') : 'None'}</div>`);

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

        const pathIssues = [];
        if (relativeHref.startsWith('/')) {
            pathIssues.push('❌ Uses absolute path (/) - should be relative');
        }
        if (!relativeHref.startsWith('./') && !relativeHref.startsWith('../') && !relativeHref.startsWith('/')) {
            pathIssues.push('⚠️ Missing ./ or ../ prefix');
        }

        const expectedFilename = this.CONFIG.cssFile;
        if (!relativeHref.includes(expectedFilename)) {
            pathIssues.push(`⚠️ Filename mismatch - expected "${expectedFilename}"`);
        }

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

        const linkBefore = element.shadowRoot.querySelector('link[rel="stylesheet"]');
        const hasLinkBefore = !!linkBefore;
        results.push(`<tr>
            <td>CSS Link Before Re-render</td>
            <td>${hasLinkBefore ? 'Present' : 'Missing'}</td>
            <td class="${hasLinkBefore ? 'success' : 'error'}">${hasLinkBefore ? '✅' : '❌'}</td>
        </tr>`);

        if (!hasLinkBefore) {
            results.push('</table>');
            const renderPersistenceElement = this.shadowRoot?.getElementById('render-persistence') || document.getElementById('render-persistence');
            if (renderPersistenceElement) renderPersistenceElement.innerHTML = results.join('');
            return;
        }

        const originalVariant = element.getAttribute('variant') || 'primary';
        const newVariant = originalVariant === 'primary' ? 'secondary' : 'primary';

        element.setAttribute('variant', newVariant);
        await new Promise(resolve => setTimeout(resolve, 100));

        const linkAfter = element.shadowRoot.querySelector('link[rel="stylesheet"]');
        const hasLinkAfter = !!linkAfter;

        results.push(`<tr>
            <td>CSS Link After Re-render</td>
            <td>${hasLinkAfter ? 'Present' : 'Missing'}</td>
            <td class="${hasLinkAfter ? 'success' : 'error'}">${hasLinkAfter ? '✅' : '❌'}</td>
        </tr>`);

        if (hasLinkAfter) {
            results.push(`<tr style="background: var(--bg-tertiary);">
                <td colspan="3" class="success" style="font-weight: bold;">
                    ✅ PASS: CSS link persists after re-render.
                </td>
            </tr>`);
        } else {
            results.push(`<tr style="background: var(--bg-secondary);">
                <td colspan="3" class="error" style="font-weight: bold;">
                    ❌ FAIL: CSS link destroyed by render(). Fix your render() method!
                </td>
            </tr>`);
        }

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
                    <td colspan="4" class="error">No renderable elements</td>
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
                    <td colspan="3" class="error">No elements</td>
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

        if (ComponentClass) {
            const useShadow = ComponentClass.useShadow;
            const actualHasShadow = elements.length > 0 && !!elements[0].shadowRoot;
            const matches = (useShadow === true && actualHasShadow) || (useShadow === false && !actualHasShadow);

            if (!matches) {
                if (useShadow === true && !actualHasShadow) {
                    issues.push(`❌ CRITICAL: Expected Shadow DOM but found Light DOM`);
                } else if (useShadow === false && actualHasShadow) {
                    issues.push(`❌ CRITICAL: Expected Light DOM but found Shadow DOM`);
                } else if (useShadow === undefined) {
                    issues.push(`❌ CRITICAL: useShadow not configured`);
                }
            } else {
                passes.push(`✅ Shadow DOM configuration matches`);
            }
        }

        if (elements.length === 0) {
            issues.push(`No &lt;${this.CONFIG.tagName}&gt; elements found`);
        } else {
            passes.push(`Found ${elements.length} &lt;${this.CONFIG.tagName}&gt; element(s)`);

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

                        const computed = getComputedStyle(firstElement);
                        const bg = computed.backgroundColor;
                        const isGrayBg = bg.includes('240, 240, 240');

                        if (isGrayBg) {
                            issues.push(`Element ${index + 1}: Wrong color (gray = CSS not applied)`);
                        }

                        const link = el.shadowRoot.querySelector('link[rel="stylesheet"]');
                        if (!link) {
                            issues.push(`Element ${index + 1}: No CSS link`);
                        } else {
                            passes.push(`Element ${index + 1}: CSS link present`);
                        }
                    }
                }
            });
        }

        if (this._refIssues?.length > 0) {
            this._refIssues.forEach(issue => issues.push(`Reference: ${issue}`));
        }
        if (this._refPasses?.length > 0) {
            this._refPasses.forEach(pass => passes.push(`Reference: ${pass}`));
        }

        if (issues.length === 0) {
            results.push('<div class="summary-box summary-pass">🎉 ALL TESTS PASSED</div>');
        } else {
            results.push('<div class="summary-box summary-fail">🔥 ISSUES DETECTED</div>');
        }

        if (passes.length > 0) {
            results.push('<div class="pass-list">');
            results.push('<h3 style="color: var(--success-color);">✅ Passing:</h3>');
            passes.forEach(pass => results.push(`<div class="success">✅ ${pass}</div>`));
            results.push('</div>');
        }

        if (issues.length > 0) {
            results.push('<div class="issue-list">');
            results.push('<h3 style="color: var(--error-color);">❌ Issues:</h3>');
            issues.forEach(issue => results.push(`<div class="error">❌ ${issue}</div>`));
            results.push('</div>');
        }

        results.push(`<div class="metric">Total: ${passes.length + issues.length} | ✅ ${passes.length} | ❌ ${issues.length}</div>`);

        const finalVerdictElement = this.shadowRoot?.getElementById('final-verdict') || document.getElementById('final-verdict');
        if (finalVerdictElement) finalVerdictElement.innerHTML = results.join('');
    }

    async checkReferences() {
        const results = [];
        const componentName = this.CONFIG.tagName;
        const jsPath = this.CONFIG.jsFile;
        const componentFolder = `../../components/${componentName}/`;
        
        results.push('<h3>🔗 Reference Check: ' + componentName + '</h3>');
        results.push('<table>');
        results.push('<tr><th>File</th><th>Type</th><th>Reference</th><th>Status</th></tr>');

        this._refIssues = [];
        this._refPasses = [];

        const checkFileExists = async (url) => {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;
            } catch {
                return false;
            }
        };

        const resolvePath = (basePath, relativePath) => {
            const base = new URL(basePath, window.location.href);
            return new URL(relativePath, base).href;
        };

        try {
            const cacheBuster = '?t=' + Date.now();
            const jsResponse = await fetch(jsPath + cacheBuster);
            if (jsResponse.ok) {
                const jsContent = await jsResponse.text();
                
                const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
                let match;
                
                while ((match = importRegex.exec(jsContent)) !== null) {
                    const importPath = match[1];
                    if (!importPath.startsWith('.') && !importPath.startsWith('/')) continue;
                    
                    const resolvedUrl = resolvePath(jsPath, importPath);
                    const exists = await checkFileExists(resolvedUrl);
                    
                    if (exists) {
                        this._refPasses.push(`import: ${importPath}`);
                        results.push(`<tr><td>JS</td><td>import</td><td><code>${importPath}</code></td><td class="success">✅</td></tr>`);
                    } else {
                        this._refIssues.push(`import: ${importPath}`);
                        results.push(`<tr><td>JS</td><td>import</td><td><code>${importPath}</code></td><td class="error">❌</td></tr>`);
                    }
                }
            }
        } catch (error) {
            this._refIssues.push(`Cannot read JS: ${error.message}`);
        }

        const cssPath = `${componentFolder}${this.CONFIG.cssFile}`;
        const cssExists = await checkFileExists(cssPath + '?t=' + Date.now());
        if (cssExists) {
            this._refPasses.push(`CSS: ${this.CONFIG.cssFile}`);
            results.push(`<tr><td>CSS</td><td>file</td><td><code>${this.CONFIG.cssFile}</code></td><td class="success">✅</td></tr>`);
        } else {
            this._refIssues.push(`CSS: ${this.CONFIG.cssFile}`);
            results.push(`<tr><td>CSS</td><td>file</td><td><code>${this.CONFIG.cssFile}</code></td><td class="error">❌</td></tr>`);
        }

        results.push('</table>');

        if (this._refIssues.length === 0) {
            results.push('<div class="summary-box summary-pass">✅ ALL REFS OK</div>');
        } else {
            results.push('<div class="summary-box summary-fail">❌ ' + this._refIssues.length + ' BROKEN</div>');
        }

        const refCheckElement = this.shadowRoot?.getElementById('ref-check') || document.getElementById('ref-check');
        if (refCheckElement) refCheckElement.innerHTML = results.join('');
    }

    copyIssuesToClipboard(silent = false) {
        const elements = document.querySelectorAll(this.CONFIG.tagName);
        const ComponentClass = customElements.get(this.CONFIG.tagName);
        let report = [];

        report.push('═'.repeat(60));
        report.push('WB SHADOW DOM DIAGNOSTIC REPORT');
        report.push('═'.repeat(60));
        report.push(`Component: <${this.CONFIG.tagName}>`);
        report.push(`JS: ${this.CONFIG.jsFile}`);
        report.push(`CSS: ${this.CONFIG.cssFile}`);
        report.push(`Date: ${new Date().toLocaleString()}`);
        report.push('');

        const issues = [];
        const passes = [];

        if (ComponentClass) {
            const useShadow = ComponentClass.useShadow;
            const actualHasShadow = elements.length > 0 && !!elements[0].shadowRoot;
            const matches = (useShadow === true && actualHasShadow) || (useShadow === false && !actualHasShadow);

            report.push(`EXPECTED: ${useShadow === true ? 'Shadow DOM' : useShadow === false ? 'Light DOM' : 'undefined'}`);
            report.push(`ACTUAL: ${actualHasShadow ? 'Shadow DOM ✅' : 'No Shadow DOM ❌'}`);
            report.push(matches ? '✅ MATCH' : '❌ MISMATCH');
            report.push('');
        }

        if (elements.length === 0) {
            issues.push(`No <${this.CONFIG.tagName}> elements found`);
        } else {
            passes.push(`Found ${elements.length} element(s)`);

            elements.forEach((el, index) => {
                if (!el.shadowRoot) {
                    issues.push(`Element ${index + 1}: No Shadow DOM`);
                } else {
                    passes.push(`Element ${index + 1}: Shadow DOM OK`);

                    const firstElement = el.shadowRoot.querySelector('*:not(link):not(style)');
                    if (!firstElement) {
                        issues.push(`Element ${index + 1}: No content`);
                    } else {
                        const rect = firstElement.getBoundingClientRect();
                        if (rect.width === 0 || rect.height === 0) {
                            issues.push(`Element ${index + 1}: Invisible`);
                        } else {
                            passes.push(`Element ${index + 1}: ${rect.width.toFixed(0)}×${rect.height.toFixed(0)}px`);
                        }
                    }

                    const link = el.shadowRoot.querySelector('link[rel="stylesheet"]');
                    if (!link) {
                        issues.push(`Element ${index + 1}: No CSS link`);
                    }
                }
            });
        }

        if (this._refIssues?.length > 0) {
            this._refIssues.forEach(issue => issues.push(`Ref: ${issue}`));
        }

        report.push('─'.repeat(60));
        if (issues.length > 0) {
            report.push('ISSUES:');
            issues.forEach(i => report.push('❌ ' + i));
        } else {
            report.push('🎉 NO ISSUES - ALL PASSED!');
        }
        report.push('');
        report.push('PASSED:');
        passes.forEach(p => report.push('✅ ' + p));
        report.push('');
        report.push(`Summary: ${passes.length} passed, ${issues.length} failed`);
        report.push('═'.repeat(60));

        const reportText = report.join('\n');

        navigator.clipboard.writeText(reportText).then(() => {
            if (!silent) {
                alert('✅ Report copied to clipboard!');
            } else {
                console.log('[Diagnostics] Report auto-copied to clipboard');
            }
        }).catch(err => {
            console.error('Copy failed:', err);
            if (!silent) alert('Copy failed');
        });
    }
}

customElements.define('wb-shadow-diagnostics', WBShadowDiagnostics);

export default WBShadowDiagnostics;

// Auto-initialize for standalone page usage
if (typeof document !== 'undefined') {
    let configPanel = document.getElementById('component-tag');
    if (configPanel) {
        const controller = new WBShadowDiagnostics();
        controller.initializeDiagnostics();
    }
}
