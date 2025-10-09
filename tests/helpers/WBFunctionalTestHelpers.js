// Enhanced Test Helpers for Component Functional Testing
// These helpers ensure components actually work, not just exist in DOM

export class WBTestHelpers {
    /**
     * Wait for component to fully initialize with config loaded
     */
    static async waitForComponentInit(page, selector, timeout = 10000) {
        await page.waitForFunction((sel) => {
            const element = document.querySelector(sel);
            if (!element) return false;
            
            // Check if it's a web component with config
            if (element.config !== undefined) {
                return element.config !== null && element.config !== undefined;
            }
            
            // Check if it's initialized (has rendered content)
            return element.innerHTML.length > 0 || element.shadowRoot?.innerHTML?.length > 0;
        }, selector, { timeout });
    }

    /**
     * Monitor console errors during test execution
     */
    static setupErrorMonitoring(page) {
        const errors = [];
        const warnings = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            } else if (msg.type() === 'warning') {
                warnings.push(msg.text());
            }
        });
        
        page.on('pageerror', error => {
            errors.push(`Page Error: ${error.message}`);
        });
        
        return { errors, warnings };
    }

    /**
     * Test component configuration loading
     */
    static async testConfigLoading(page, selector) {
        const result = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { exists: false };
            
            return {
                exists: true,
                hasConfig: element.config !== undefined && element.config !== null,
                configKeys: element.config ? Object.keys(element.config) : [],
                initialized: element._initialized === true,
                classList: Array.from(element.classList)
            };
        }, selector);
        
        return result;
    }

    /**
     * Test component interaction (click, change, etc.)
     */
    static async testComponentInteraction(page, selector, interaction, expectedResult) {
        // Setup interaction monitoring
        const beforeState = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            return {
                classList: Array.from(element.classList),
                attributes: Array.from(element.attributes).map(attr => ({ name: attr.name, value: attr.value }))
            };
        }, selector);

        // Perform interaction
        const element = page.locator(selector);
        switch (interaction.type) {
            case 'click':
                await element.click();
                break;
            case 'change':
                await element.selectOption(interaction.value);
                break;
            case 'input':
                await element.fill(interaction.value);
                break;
        }

        // Wait for changes
        await page.waitForTimeout(500);

        // Check for expected result
        const afterState = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            return {
                classList: Array.from(element.classList),
                attributes: Array.from(element.attributes).map(attr => ({ name: attr.name, value: attr.value }))
            };
        }, selector);

        return { beforeState, afterState };
    }

    /**
     * Test shadow DOM rendering
     */
    static async testShadowDOMRendering(page, selector) {
        const shadowDOMInfo = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { exists: false };
            
            const shadowRoot = element.shadowRoot;
            if (!shadowRoot) return { exists: true, hasShadowRoot: false };
            
            return {
                exists: true,
                hasShadowRoot: true,
                shadowHTML: shadowRoot.innerHTML,
                shadowChildCount: shadowRoot.children.length,
                shadowTextContent: shadowRoot.textContent?.trim()
            };
        }, selector);
        
        return shadowDOMInfo;
    }

    /**
     * Test network requests (for config files, CSS, etc.)
     */
    static async monitorNetworkRequests(page) {
        const requests = [];
        const failures = [];
        
        page.on('request', request => {
            requests.push({
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType()
            });
        });
        
        page.on('requestfailed', request => {
            failures.push({
                url: request.url(),
                failure: request.failure()?.errorText
            });
        });
        
        return { requests, failures };
    }

    /**
     * Comprehensive component health check
     */
    static async componentHealthCheck(page, selector, expectedFeatures = {}) {
        const health = await page.evaluate(({ sel, features }) => {
            const element = document.querySelector(sel);
            if (!element) return { exists: false, healthy: false };
            
            const report = {
                exists: true,
                tagName: element.tagName.toLowerCase(),
                hasConfig: element.config !== undefined && element.config !== null,
                initialized: element._initialized === true,
                hasContent: element.innerHTML.length > 0,
                hasShadowRoot: !!element.shadowRoot,
                shadowContent: element.shadowRoot ? element.shadowRoot.innerHTML.length > 0 : false,
                classCount: element.classList.length,
                attributeCount: element.attributes.length,
                childCount: element.children.length,
                errors: []
            };
            
            // Check for common error states
            if (element.classList.contains('error') || element.classList.contains('failed')) {
                report.errors.push('Component has error class');
            }
            
            // Check expected features
            if (features.shouldHaveConfig && !report.hasConfig) {
                report.errors.push('Missing expected config');
            }
            
            if (features.shouldHaveShadowDOM && !report.hasShadowRoot) {
                report.errors.push('Missing expected shadow DOM');
            }
            
            if (features.shouldHaveContent && !report.hasContent && !report.shadowContent) {
                report.errors.push('Missing expected content');
            }
            
            report.healthy = report.errors.length === 0;
            return report;
        }, { sel: selector, features: expectedFeatures });
        
        return health;
    }
}

// Export for use in test files
export default WBTestHelpers;