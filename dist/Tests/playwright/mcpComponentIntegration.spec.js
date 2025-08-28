"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('MCP Integration - Component System', () => {
    const baseURL = 'http://localhost:8000';
    (0, test_1.test)('should integrate with existing table theme component', async ({ request, page }) => {
        // First, verify the table theme component exists
        await page.goto(`${baseURL}/components/table/table-theme.html`);
        // Check that the table theme component loads
        await (0, test_1.expect)(page.locator('table')).toBeVisible();
        await (0, test_1.expect)(page.locator('.theme-controls')).toBeVisible();
        // Test MCP generation with table theme
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'portfolio',
                features: ['table-theme']
            },
            content: {
                title: 'Portfolio with Tables'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: input
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Verify table theme is included
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('claude-table');
        // Verify CSS includes table styling
        const cssFile = data.files.find(f => f.path === 'css/styles.css');
        (0, test_1.expect)(cssFile.content).toContain('.claude-table');
        (0, test_1.expect)(cssFile.content).toContain('border-collapse: collapse');
    });
    (0, test_1.test)('should integrate with existing theme generator component', async ({ request, page }) => {
        // Verify theme generator component exists
        await page.goto(`${baseURL}/themes/theme-generator.html`);
        // Check that theme generator loads
        await (0, test_1.expect)(page.locator('.theme-generator')).toBeVisible();
        // Test MCP generation with theme generator
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'business',
                features: ['theme-generator']
            },
            content: {
                title: 'Business with Theme Control'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: input
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Verify theme generator is included
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('theme-controls-demo');
        (0, test_1.expect)(htmlFile.content).toContain('color-picker-demo');
    });
    (0, test_1.test)('should use existing CSS system (wb/wb.css)', async ({ request, page }) => {
        // Verify wb/wb.css exists and is accessible
        const cssResponse = await request.get(`${baseURL}/wb/wb.css`);
        (0, test_1.expect)(cssResponse.status()).toBe(200);
        const cssContent = await cssResponse.text();
        (0, test_1.expect)(cssContent).toContain('--golden-ratio');
        // Test MCP generation uses existing CSS
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'portfolio',
                features: ['mathematical-spacing']
            },
            content: {
                title: 'Portfolio with Mathematical Spacing'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: input
        });
        const data = await response.json();
        const generatedCSS = data.files.find(f => f.path === 'css/styles.css');
        // Should include golden ratio variables from wb/wb.css
        (0, test_1.expect)(generatedCSS.content).toContain('--golden-ratio: 1.618');
        (0, test_1.expect)(generatedCSS.content).toContain('--space-lg: calc(1rem * var(--golden-ratio))');
    });
    (0, test_1.test)('should list available components via API', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/components`);
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.components).toContain('table');
        (0, test_1.expect)(data.components).toContain('theme');
        (0, test_1.expect)(data.components).toContain('registry');
    });
    (0, test_1.test)('should list available themes via API', async ({ request }) => {
        const response = await request.get(`${baseURL}/api/themes`);
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.themes).toContain('theme-generator');
        (0, test_1.expect)(data.themes).toContain('hsl-color-picker');
        (0, test_1.expect)(data.themes).toContain('hue-color-slider');
    });
    (0, test_1.test)('should generate website with real component integration', async ({ request, page }) => {
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'custom',
                features: ['table-theme', 'theme-generator', 'mathematical-spacing']
            },
            content: {
                title: 'Component Integration Demo',
                description: 'Showcasing all existing components'
            },
            output: {
                format: 'files'
            },
            customization: {
                primaryColor: '#2c3e50',
                secondaryColor: '#ecf0f1',
                accentColor: '#3498db'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: input
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Create a temporary HTML file to test the generated website
        const htmlContent = data.files.find(f => f.path === 'index.html').content;
        const cssContent = data.files.find(f => f.path === 'css/styles.css').content;
        const jsContent = data.files.find(f => f.path === 'js/main.js').content;
        // Verify all components are included
        (0, test_1.expect)(htmlContent).toContain('Component Integration Demo');
        (0, test_1.expect)(htmlContent).toContain('claude-table');
        (0, test_1.expect)(htmlContent).toContain('color-picker-demo');
        (0, test_1.expect)(htmlContent).toContain('theme-controls');
        // Verify styling includes mathematical spacing
        (0, test_1.expect)(cssContent).toContain('--golden-ratio');
        (0, test_1.expect)(cssContent).toContain('--mcp-primary: #2c3e50');
        (0, test_1.expect)(cssContent).toContain('--mcp-accent: #3498db');
        // Verify JavaScript includes theme system
        (0, test_1.expect)(jsContent).toContain('ClaudeThemeSystem');
        (0, test_1.expect)(jsContent).toContain('primaryColor: #2c3e50');
        (0, test_1.expect)(jsContent).toContain('accentColor: #3498db');
    });
    (0, test_1.test)('should maintain component functionality in generated website', async ({ request, page }) => {
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'portfolio',
                features: ['theme-customization', 'real-time-preview']
            },
            content: {
                title: 'Interactive Portfolio'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: input
        });
        const data = await response.json();
        const jsContent = data.files.find(f => f.path === 'js/main.js').content;
        // Verify interactive functions are included
        (0, test_1.expect)(jsContent).toContain('function toggleTheme()');
        (0, test_1.expect)(jsContent).toContain('function openColorPicker()');
        (0, test_1.expect)(jsContent).toContain('addEventListener(\'change\'');
        (0, test_1.expect)(jsContent).toContain('updateColor');
        // Verify DOM ready initialization
        (0, test_1.expect)(jsContent).toContain('DOMContentLoaded');
        (0, test_1.expect)(jsContent).toContain('Claude AI Website Builder initialized');
    });
    (0, test_1.test)('should integrate with existing server endpoints', async ({ request }) => {
        // Verify existing endpoints still work alongside MCP
        const componentResponse = await request.get(`${baseURL}/api/components`);
        (0, test_1.expect)(componentResponse.status()).toBe(200);
        const themeResponse = await request.get(`${baseURL}/api/themes`);
        (0, test_1.expect)(themeResponse.status()).toBe(200);
        // Verify new MCP endpoints work
        const healthResponse = await request.get(`${baseURL}/mcp/health`);
        (0, test_1.expect)(healthResponse.status()).toBe(200);
        const capabilitiesResponse = await request.get(`${baseURL}/mcp/capabilities`);
        (0, test_1.expect)(capabilitiesResponse.status()).toBe(200);
        // Verify all endpoints return success
        const componentData = await componentResponse.json();
        const themeData = await themeResponse.json();
        const healthData = await healthResponse.json();
        const capabilitiesData = await capabilitiesResponse.json();
        (0, test_1.expect)(componentData.success).toBe(true);
        (0, test_1.expect)(themeData.success).toBe(true);
        (0, test_1.expect)(healthData.status).toBe('healthy');
        (0, test_1.expect)(capabilitiesData.name).toBe('claude-ai-website-builder');
    });
});
//# sourceMappingURL=mcpComponentIntegration.spec.js.map