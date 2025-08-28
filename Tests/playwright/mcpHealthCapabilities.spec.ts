import { test, expect } from '@playwright/test';

test.describe('MCP Integration - Health and Capabilities', () => {
  const baseURL = 'http://localhost:8000';

  test.beforeEach(async ({ page }) => {
    // Ensure server is running before each test
    await page.goto(baseURL);
  });

  test('should return healthy status from /mcp/health endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/mcp/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeGreaterThan(0);
    expect(data.version).toBe('1.0.0');
    expect(data.services).toHaveProperty('server', 'running');
    expect(data.services).toHaveProperty('components', 'available');
    expect(data.services).toHaveProperty('themes', 'available');
  });

  test('should return comprehensive capabilities from /mcp/capabilities endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/mcp/capabilities`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Verify required metadata
    expect(data.name).toBe('claude-ai-website-builder');
    expect(data.version).toBe('1.0.0');
    expect(data.description).toContain('Claude AI Website Builder');
    expect(data.author).toBe('Claude AI Team');
    expect(data.apiVersion).toBe('1.0');
    
    // Verify capabilities structure
    expect(data.capabilities).toHaveProperty('websiteTypes');
    expect(data.capabilities).toHaveProperty('frameworks');
    expect(data.capabilities).toHaveProperty('features');
    expect(data.capabilities).toHaveProperty('outputFormats');
    expect(data.capabilities).toHaveProperty('components');
    expect(data.capabilities).toHaveProperty('themes');
    
    // Verify website types
    expect(data.capabilities.websiteTypes).toContain('portfolio');
    expect(data.capabilities.websiteTypes).toContain('business');
    expect(data.capabilities.websiteTypes).toContain('blog');
    expect(data.capabilities.websiteTypes).toContain('landing');
    expect(data.capabilities.websiteTypes).toContain('custom');
    
    // Verify frameworks
    expect(data.capabilities.frameworks).toContain('vanilla');
    expect(data.capabilities.frameworks).toContain('html-css-js');
    
    // Verify key features
    expect(data.capabilities.features).toContain('responsive-design');
    expect(data.capabilities.features).toContain('dark-mode');
    expect(data.capabilities.features).toContain('theme-customization');
    expect(data.capabilities.features).toContain('golden-ratio-layouts');
    expect(data.capabilities.features).toContain('mathematical-spacing');
    
    // Verify integration details
    expect(data.integration.method).toBe('http');
    expect(data.integration.endpoint).toBe('/mcp/generate');
    expect(data.integration.healthCheck).toBe('/mcp/health');
  });

  test('should return performance metrics from /mcp/metrics endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/mcp/metrics`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Verify metrics structure
    expect(data).toHaveProperty('requests');
    expect(data).toHaveProperty('resources');
    expect(data).toHaveProperty('generation');
    
    // Verify request metrics
    expect(data.requests).toHaveProperty('total');
    expect(data.requests).toHaveProperty('successful');
    expect(data.requests).toHaveProperty('failed');
    expect(data.requests).toHaveProperty('averageResponseTime');
    
    // Verify resource metrics
    expect(data.resources).toHaveProperty('memoryUsage');
    expect(data.resources).toHaveProperty('cpuUsage');
    expect(data.resources).toHaveProperty('uptime');
    
    // Verify generation metrics
    expect(data.generation).toHaveProperty('filesGenerated');
    expect(data.generation).toHaveProperty('popularComponents');
    expect(data.generation).toHaveProperty('popularThemes');
  });
});
