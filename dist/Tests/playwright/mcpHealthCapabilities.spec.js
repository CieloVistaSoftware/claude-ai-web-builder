"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('MCP Integration - Health and Capabilities', () => {
    const baseURL = 'http://localhost:8000';
    test_1.test.beforeEach(async ({ page }) => {
        // Ensure server is running before each test
        await page.goto(baseURL);
    });
    (0, test_1.test)('should return healthy status from /mcp/health endpoint', async ({ request }) => {
        const response = await request.get(`${baseURL}/mcp/health`);
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.status).toBe('healthy');
        (0, test_1.expect)(data.timestamp).toBeDefined();
        (0, test_1.expect)(data.uptime).toBeGreaterThan(0);
        (0, test_1.expect)(data.version).toBe('1.0.0');
        (0, test_1.expect)(data.services).toHaveProperty('server', 'running');
        (0, test_1.expect)(data.services).toHaveProperty('components', 'available');
        (0, test_1.expect)(data.services).toHaveProperty('themes', 'available');
    });
    (0, test_1.test)('should return comprehensive capabilities from /mcp/capabilities endpoint', async ({ request }) => {
        const response = await request.get(`${baseURL}/mcp/capabilities`);
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        // Verify required metadata
        (0, test_1.expect)(data.name).toBe('claude-ai-website-builder');
        (0, test_1.expect)(data.version).toBe('1.0.0');
        (0, test_1.expect)(data.description).toContain('Claude AI Website Builder');
        (0, test_1.expect)(data.author).toBe('Claude AI Team');
        (0, test_1.expect)(data.apiVersion).toBe('1.0');
        // Verify capabilities structure
        (0, test_1.expect)(data.capabilities).toHaveProperty('websiteTypes');
        (0, test_1.expect)(data.capabilities).toHaveProperty('frameworks');
        (0, test_1.expect)(data.capabilities).toHaveProperty('features');
        (0, test_1.expect)(data.capabilities).toHaveProperty('outputFormats');
        (0, test_1.expect)(data.capabilities).toHaveProperty('components');
        (0, test_1.expect)(data.capabilities).toHaveProperty('themes');
        // Verify website types
        (0, test_1.expect)(data.capabilities.websiteTypes).toContain('portfolio');
        (0, test_1.expect)(data.capabilities.websiteTypes).toContain('business');
        (0, test_1.expect)(data.capabilities.websiteTypes).toContain('blog');
        (0, test_1.expect)(data.capabilities.websiteTypes).toContain('landing');
        (0, test_1.expect)(data.capabilities.websiteTypes).toContain('custom');
        // Verify frameworks
        (0, test_1.expect)(data.capabilities.frameworks).toContain('vanilla');
        (0, test_1.expect)(data.capabilities.frameworks).toContain('html-css-js');
        // Verify key features
        (0, test_1.expect)(data.capabilities.features).toContain('responsive-design');
        (0, test_1.expect)(data.capabilities.features).toContain('dark-mode');
        (0, test_1.expect)(data.capabilities.features).toContain('theme-customization');
        (0, test_1.expect)(data.capabilities.features).toContain('golden-ratio-layouts');
        (0, test_1.expect)(data.capabilities.features).toContain('mathematical-spacing');
        // Verify integration details
        (0, test_1.expect)(data.integration.method).toBe('http');
        (0, test_1.expect)(data.integration.endpoint).toBe('/mcp/generate');
        (0, test_1.expect)(data.integration.healthCheck).toBe('/mcp/health');
    });
    (0, test_1.test)('should return performance metrics from /mcp/metrics endpoint', async ({ request }) => {
        const response = await request.get(`${baseURL}/mcp/metrics`);
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        // Verify metrics structure
        (0, test_1.expect)(data).toHaveProperty('requests');
        (0, test_1.expect)(data).toHaveProperty('resources');
        (0, test_1.expect)(data).toHaveProperty('generation');
        // Verify request metrics
        (0, test_1.expect)(data.requests).toHaveProperty('total');
        (0, test_1.expect)(data.requests).toHaveProperty('successful');
        (0, test_1.expect)(data.requests).toHaveProperty('failed');
        (0, test_1.expect)(data.requests).toHaveProperty('averageResponseTime');
        // Verify resource metrics
        (0, test_1.expect)(data.resources).toHaveProperty('memoryUsage');
        (0, test_1.expect)(data.resources).toHaveProperty('cpuUsage');
        (0, test_1.expect)(data.resources).toHaveProperty('uptime');
        // Verify generation metrics
        (0, test_1.expect)(data.generation).toHaveProperty('filesGenerated');
        (0, test_1.expect)(data.generation).toHaveProperty('popularComponents');
        (0, test_1.expect)(data.generation).toHaveProperty('popularThemes');
    });
});
//# sourceMappingURL=mcpHealthCapabilities.spec.js.map