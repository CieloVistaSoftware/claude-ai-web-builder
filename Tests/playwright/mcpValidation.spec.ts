import { test, expect } from '@playwright/test';

test.describe('MCP Integration - Input Validation', () => {
  const baseURL = 'http://localhost:8000';

  test('should validate correct MCP input format', async ({ request }) => {
    const validInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'portfolio',
        framework: 'vanilla',
        features: ['responsive-design', 'dark-mode']
      },
      content: {
        title: 'Test Portfolio',
        description: 'A test portfolio for validation'
      },
      output: {
        format: 'files'
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: validInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(true);
    expect(data.errors).toHaveLength(0);
  });

  test('should reject input missing required website type', async ({ request }) => {
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        framework: 'vanilla'
        // Missing type
      },
      content: {
        title: 'Test Site'
      },
      output: {
        format: 'files'
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('website.type is required');
  });

  test('should reject input missing required content title', async ({ request }) => {
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'portfolio'
      },
      content: {
        // Missing title
        description: 'A test site'
      },
      output: {
        format: 'files'
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('content.title is required');
  });

  test('should reject input missing required output format', async ({ request }) => {
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'business'
      },
      content: {
        title: 'Test Business Site'
      },
      output: {
        // Missing format
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('output.format is required');
  });

  test('should reject invalid website type', async ({ request }) => {
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'invalid-type'
      },
      content: {
        title: 'Test Site'
      },
      output: {
        format: 'files'
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('website.type must be one of: portfolio, business, blog, landing, custom');
  });

  test('should reject invalid output format', async ({ request }) => {
    const invalidInput = {
      toolName: 'claude-ai-website-builder',
      website: {
        type: 'portfolio'
      },
      content: {
        title: 'Test Portfolio'
      },
      output: {
        format: 'invalid-format'
      }
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: invalidInput
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('output.format must be one of: files, zip');
  });

  test('should validate all supported website types', async ({ request }) => {
    const websiteTypes = ['portfolio', 'business', 'blog', 'landing', 'custom'];
    
    for (const type of websiteTypes) {
      const input = {
        toolName: 'claude-ai-website-builder',
        website: { type },
        content: { title: `Test ${type} Site` },
        output: { format: 'files' }
      };

      const response = await request.post(`${baseURL}/mcp/validate`, {
        data: input
      });

      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.valid).toBe(true);
    }
  });

  test('should validate optional fields when present', async ({ request }) => {
    const inputWithOptionals = {
      toolName: 'claude-ai-website-builder',
      projectId: 'test-project-123',
      website: {
        type: 'portfolio',
        framework: 'vanilla',
        styling: 'custom-css',
        features: ['responsive-design', 'dark-mode', 'theme-customization']
      },
      content: {
        title: 'Advanced Portfolio',
        description: 'A comprehensive portfolio with advanced features',
        metadata: {
          author: 'Test User',
          keywords: ['portfolio', 'web development', 'design']
        }
      },
      output: {
        format: 'files',
        destination: '/output',
        compression: true
      },
      customization: {
        primaryColor: '#007acc',
        secondaryColor: '#f8f9fa',
        accentColor: '#17a2b8'
      },
      integrations: ['analytics', 'cms']
    };

    const response = await request.post(`${baseURL}/mcp/validate`, {
      data: inputWithOptionals
    });

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.valid).toBe(true);
    expect(data.errors).toHaveLength(0);
  });
});
