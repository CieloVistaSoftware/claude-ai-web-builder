"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('MCP Integration - Website Generation', () => {
    const baseURL = 'http://localhost:8000';
    (0, test_1.test)('should generate portfolio website with existing components', async ({ request }) => {
        const portfolioInput = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'portfolio',
                framework: 'vanilla',
                features: ['responsive-design', 'table-theme', 'theme-generator']
            },
            content: {
                title: 'John Doe Portfolio',
                description: 'Professional portfolio showcasing my work and skills'
            },
            output: {
                format: 'files'
            },
            customization: {
                primaryColor: '#007acc',
                secondaryColor: '#f8f9fa',
                accentColor: '#17a2b8'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: portfolioInput
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        // Verify successful generation
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.executionTime).toBeGreaterThan(0);
        // Verify files were generated
        (0, test_1.expect)(data.files).toHaveLength(4); // HTML, CSS, JS, components
        (0, test_1.expect)(data.files.some(f => f.path === 'index.html')).toBe(true);
        (0, test_1.expect)(data.files.some(f => f.path === 'css/styles.css')).toBe(true);
        (0, test_1.expect)(data.files.some(f => f.path === 'js/main.js')).toBe(true);
        // Verify HTML content includes portfolio-specific elements
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('John Doe Portfolio');
        (0, test_1.expect)(htmlFile.content).toContain('portfolio-grid');
        (0, test_1.expect)(htmlFile.content).toContain('claude-table');
        // Verify project structure
        (0, test_1.expect)(data.structure.type).toBe('website');
        (0, test_1.expect)(data.structure.entryPoint).toBe('index.html');
        // Verify metadata
        (0, test_1.expect)(data.metadata.framework).toBe('claude-ai-website-builder');
        (0, test_1.expect)(data.metadata.totalFiles).toBe(4);
        (0, test_1.expect)(data.metadata.deploymentReady).toBe(true);
    });
    (0, test_1.test)('should generate business website with customization', async ({ request }) => {
        const businessInput = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'business',
                framework: 'vanilla',
                features: ['responsive-design', 'dark-mode']
            },
            content: {
                title: 'Acme Corporation',
                description: 'Leading solutions for modern businesses'
            },
            output: {
                format: 'files'
            },
            customization: {
                primaryColor: '#2c3e50',
                secondaryColor: '#ecf0f1',
                accentColor: '#e74c3c'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: businessInput
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Verify business-specific content
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('Acme Corporation');
        (0, test_1.expect)(htmlFile.content).toContain('Our Services');
        (0, test_1.expect)(htmlFile.content).toContain('services-grid');
        // Verify custom colors are applied
        (0, test_1.expect)(htmlFile.content).toContain('#2c3e50'); // Primary color
        (0, test_1.expect)(htmlFile.content).toContain('#e74c3c'); // Accent color
    });
    (0, test_1.test)('should generate blog website with mathematical spacing', async ({ request }) => {
        const blogInput = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'blog',
                framework: 'vanilla',
                features: ['responsive-design', 'mathematical-spacing']
            },
            content: {
                title: 'Tech Insights Blog',
                description: 'Latest insights on technology and development'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: blogInput
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Verify blog-specific content
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('Tech Insights Blog');
        (0, test_1.expect)(htmlFile.content).toContain('Latest Posts');
        (0, test_1.expect)(htmlFile.content).toContain('blog-post');
        // Verify CSS includes golden ratio variables
        const cssFile = data.files.find(f => f.path === 'css/styles.css');
        (0, test_1.expect)(cssFile.content).toContain('--golden-ratio: 1.618');
        (0, test_1.expect)(cssFile.content).toContain('--space-lg: calc(1rem * var(--golden-ratio))');
    });
    (0, test_1.test)('should generate landing page with theme generator integration', async ({ request }) => {
        const landingInput = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'landing',
                framework: 'vanilla',
                features: ['responsive-design', 'theme-generator', 'real-time-preview']
            },
            content: {
                title: 'Revolutionary Product Launch',
                description: 'Introducing the next generation of innovation'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: landingInput
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Verify landing page content
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('Revolutionary Product Launch');
        (0, test_1.expect)(htmlFile.content).toContain('Key Features');
        (0, test_1.expect)(htmlFile.content).toContain('color-picker-demo');
        // Should include theme generator component
        (0, test_1.expect)(data.files.some(f => f.path.includes('theme-generator'))).toBe(true);
    });
    (0, test_1.test)('should include existing components when requested', async ({ request }) => {
        const componentInput = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'custom',
                framework: 'vanilla',
                features: ['table-theme', 'theme-generator']
            },
            content: {
                title: 'Component Showcase',
                description: 'Showcasing Claude AI Website Builder components'
            },
            output: {
                format: 'files'
            }
        };
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: componentInput
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        // Should include table theme component
        (0, test_1.expect)(data.files.some(f => f.path.includes('table-theme'))).toBe(true);
        // Should include theme generator component
        (0, test_1.expect)(data.files.some(f => f.path.includes('theme-generator'))).toBe(true);
        // HTML should reference these components
        const htmlFile = data.files.find(f => f.path === 'index.html');
        (0, test_1.expect)(htmlFile.content).toContain('claude-table');
        (0, test_1.expect)(htmlFile.content).toContain('theme-controls-demo');
    });
    (0, test_1.test)('should provide SEO and performance recommendations', async ({ request }) => {
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'business',
                framework: 'vanilla'
            },
            content: {
                title: 'Business Site',
                description: 'A business website'
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
        // Should include recommendations
        (0, test_1.expect)(data.recommendations).toBeDefined();
        (0, test_1.expect)(data.recommendations.length).toBeGreaterThan(0);
        // Should have SEO recommendation
        const seoRec = data.recommendations.find(r => r.type === 'seo');
        (0, test_1.expect)(seoRec).toBeDefined();
        (0, test_1.expect)(seoRec.message).toContain('meta description');
        (0, test_1.expect)(seoRec.priority).toBe('high');
        (0, test_1.expect)(seoRec.actionable).toBe(true);
    });
    (0, test_1.test)('should handle generation errors gracefully', async ({ request }) => {
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
        const response = await request.post(`${baseURL}/mcp/generate`, {
            data: invalidInput
        });
        (0, test_1.expect)(response.status()).toBe(400);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(false);
        (0, test_1.expect)(data.error).toContain('Invalid input');
        (0, test_1.expect)(data.executionTime).toBeGreaterThan(0);
        (0, test_1.expect)(data.files).toHaveLength(0);
    });
    (0, test_1.test)('should generate JavaScript with theme system functionality', async ({ request }) => {
        const input = {
            toolName: 'claude-ai-website-builder',
            website: {
                type: 'portfolio',
                framework: 'vanilla',
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
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        const jsFile = data.files.find(f => f.path === 'js/main.js');
        // Verify JavaScript includes theme system
        (0, test_1.expect)(jsFile.content).toContain('ClaudeThemeSystem');
        (0, test_1.expect)(jsFile.content).toContain('toggleTheme');
        (0, test_1.expect)(jsFile.content).toContain('updateColor');
        (0, test_1.expect)(jsFile.content).toContain('applyGoldenRatioSpacing');
        // Verify golden ratio calculations
        (0, test_1.expect)(jsFile.content).toContain('1.618');
        (0, test_1.expect)(jsFile.content).toContain('goldenRatio');
    });
});
//# sourceMappingURL=mcpGeneration.spec.js.map