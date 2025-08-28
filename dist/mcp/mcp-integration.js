// MCP Server Integration for Claude AI Website Builder
// This module makes the existing website builder MCP-compliant
import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
class MCPClaudeWebsiteBuilder {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: app
        });
        Object.defineProperty(this, "requestCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "successfulRequests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "failedRequests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "averageResponseTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "filesGenerated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "responseTimes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.setupMCPEndpoints();
    }
    setupMCPEndpoints() {
        // Enable JSON parsing for MCP endpoints
        this.app.use(express.json({ limit: '10mb' })); // Add middleware to track all MCP requests
        this.app.use('/mcp', (req, res, next) => {
            console.log(`MCP Middleware triggered for: ${req.method} ${req.path}`);
            const startTime = Date.now();
            this.requestCount++;
            console.log(`Request count incremented to: ${this.requestCount}`);
            // Track response completion
            res.on('finish', () => {
                const responseTime = Date.now() - startTime;
                this.responseTimes.push(responseTime);
                // Calculate average response time
                this.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
                // Keep only last 100 response times to prevent memory bloat
                if (this.responseTimes.length > 100) {
                    this.responseTimes = this.responseTimes.slice(-100);
                }
                // Track success/failure based on status code
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    this.successfulRequests++;
                }
                else {
                    this.failedRequests++;
                }
            });
            next();
        });
        // MCP-compliant endpoints
        this.setupGenerateEndpoint();
        this.setupCapabilitiesEndpoint();
        this.setupHealthEndpoint();
        this.setupValidateEndpoint();
        this.setupMetricsEndpoint();
    }
    setupGenerateEndpoint() {
        // Main MCP generation endpoint
        this.app.post('/mcp/generate', async (req, res) => {
            const startTime = Date.now();
            this.requestCount++;
            try {
                console.log('MCP Generate request received:', JSON.stringify(req.body, null, 2));
                // Validate MCP input
                const validation = this.validateMCPInput(req.body);
                if (!validation.valid) {
                    this.failedRequests++;
                    return res.status(400).json({
                        success: false,
                        error: `Invalid input: ${validation.errors.join(', ')}`,
                        files: [],
                        structure: { type: 'website', entryPoint: 'index.html' },
                        metadata: { framework: 'unknown', totalFiles: 0, totalSize: 0, deploymentReady: false }
                    });
                }
                // Generate website using existing components
                const result = await this.generateWebsiteFromComponents(req.body);
                const responseTime = Date.now() - startTime;
                this.responseTimes.push(responseTime);
                this.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
                if (this.responseTimes.length > 100) {
                    this.responseTimes = this.responseTimes.slice(-100);
                }
                this.successfulRequests++;
                res.json(result);
            }
            catch (error) {
                console.error('MCP Generation error:', error);
                this.failedRequests++;
                res.status(500).json({
                    success: false,
                    error: error.message,
                    files: [],
                    structure: { type: 'website', entryPoint: 'index.html' },
                    metadata: { framework: 'unknown', totalFiles: 0, totalSize: 0, deploymentReady: false }
                });
            }
        });
    }
    setupCapabilitiesEndpoint() {
        this.app.get('/mcp/capabilities', async (req, res) => {
            const startTime = Date.now();
            this.requestCount++;
            try {
                const components = await this.getAvailableComponents();
                const themes = await this.getAvailableThemes();
                const result = {
                    name: 'claude-ai-website-builder',
                    version: '1.0.0',
                    description: 'Claude AI Website Builder with advanced theming and component system',
                    author: 'Claude AI Team',
                    apiVersion: '1.0',
                    capabilities: {
                        websiteTypes: ['portfolio', 'business', 'blog', 'landing', 'custom'],
                        frameworks: ['vanilla', 'html-css-js'],
                        features: [
                            'responsive-design',
                            'dark-mode',
                            'theme-customization',
                            'mathematical-spacing',
                            'golden-ratio-layouts',
                            'component-based',
                            'real-time-preview'
                        ],
                        outputFormats: ['files', 'zip'],
                        components: components,
                        themes: themes,
                        styling: ['custom-css', 'mathematical-design', 'golden-ratio', 'hsl-color-system']
                    },
                    integration: {
                        method: 'http',
                        endpoint: '/mcp/generate',
                        healthCheck: '/mcp/health'
                    },
                    requirements: {
                        memory: '256MB',
                        cpu: '1 core',
                        disk: '100MB'
                    }
                };
                const responseTime = Date.now() - startTime;
                this.responseTimes.push(responseTime);
                this.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
                if (this.responseTimes.length > 100) {
                    this.responseTimes = this.responseTimes.slice(-100);
                }
                this.successfulRequests++;
                res.json(result);
            }
            catch (error) {
                this.failedRequests++;
                res.status(500).json({ error: 'Failed to get capabilities', details: error.message });
            }
        });
    }
    setupHealthEndpoint() {
        this.app.get('/mcp/health', (req, res) => {
            const startTime = Date.now();
            this.requestCount++;
            const result = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: '1.0.0',
                services: {
                    server: 'running',
                    components: 'available',
                    themes: 'available'
                }
            };
            const responseTime = Date.now() - startTime;
            this.responseTimes.push(responseTime);
            this.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
            if (this.responseTimes.length > 100) {
                this.responseTimes = this.responseTimes.slice(-100);
            }
            this.successfulRequests++;
            res.json(result);
        });
    }
    setupValidateEndpoint() {
        this.app.post('/mcp/validate', (req, res) => {
            const startTime = Date.now();
            this.requestCount++;
            const validation = this.validateMCPInput(req.body);
            const responseTime = Date.now() - startTime;
            this.responseTimes.push(responseTime);
            this.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
            if (this.responseTimes.length > 100) {
                this.responseTimes = this.responseTimes.slice(-100);
            }
            this.successfulRequests++;
            res.json(validation);
        });
    }
    setupMetricsEndpoint() {
        this.app.get('/mcp/metrics', (req, res) => {
            // Don't count the metrics endpoint itself
            res.json({
                requests: {
                    total: this.requestCount,
                    successful: this.successfulRequests,
                    failed: this.failedRequests,
                    averageResponseTime: this.averageResponseTime
                },
                resources: {
                    memoryUsage: process.memoryUsage(),
                    cpuUsage: process.cpuUsage(),
                    uptime: process.uptime()
                },
                generation: {
                    filesGenerated: this.filesGenerated,
                    popularComponents: ['table-theme', 'theme-generator'],
                    popularThemes: ['dark-mode', 'custom-colors']
                }
            });
        });
    }
    validateMCPInput(input) {
        const errors = [];
        // Required fields validation
        if (!input.website?.type) {
            errors.push('website.type is required');
        }
        if (!input.content?.title) {
            errors.push('content.title is required');
        }
        if (!input.output?.format) {
            errors.push('output.format is required');
        }
        // Validate website type
        const validTypes = ['portfolio', 'business', 'blog', 'landing', 'custom'];
        if (input.website?.type && !validTypes.includes(input.website.type)) {
            errors.push(`website.type must be one of: ${validTypes.join(', ')}`);
        }
        // Validate output format
        const validFormats = ['files', 'zip'];
        if (input.output?.format && !validFormats.includes(input.output.format)) {
            errors.push(`output.format must be one of: ${validFormats.join(', ')}`);
        }
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    async generateWebsiteFromComponents(mcpInput) {
        const files = [];
        // Generate main HTML file using existing components
        const htmlContent = await this.generateHTMLWithComponents(mcpInput);
        files.push({
            path: 'index.html',
            content: htmlContent,
            type: 'text',
            encoding: 'utf8',
            metadata: {
                size: htmlContent.length,
                checksum: this.generateChecksum(htmlContent)
            }
        });
        // Include the core CSS system
        const cssContent = await this.generateCSSWithThemes(mcpInput);
        files.push({
            path: 'css/styles.css',
            content: cssContent,
            type: 'text',
            encoding: 'utf8',
            metadata: {
                size: cssContent.length,
                checksum: this.generateChecksum(cssContent)
            }
        });
        // Include component-specific files
        if (mcpInput.website.features?.includes('table-theme')) {
            const tableHTML = await this.getComponentHTML('table/table-theme.html');
            files.push({
                path: 'components/table-theme.html',
                content: tableHTML,
                type: 'text',
                encoding: 'utf8'
            });
        }
        // Include theme generator if requested
        if (mcpInput.website.features?.includes('theme-generator')) {
            const themeHTML = await this.getThemeHTML('theme-generator.html');
            files.push({
                path: 'components/theme-generator.html',
                content: themeHTML,
                type: 'text',
                encoding: 'utf8'
            });
        }
        // Generate JavaScript for interactivity
        const jsContent = this.generateJavaScript(mcpInput);
        files.push({
            path: 'js/main.js',
            content: jsContent,
            type: 'text',
            encoding: 'utf8'
        });
        this.filesGenerated += files.length;
        return {
            success: true,
            executionTime: 0, // Will be set by caller
            files: files,
            structure: {
                type: 'website',
                entryPoint: 'index.html',
                dependencies: [],
                devDependencies: []
            },
            metadata: {
                framework: 'claude-ai-website-builder',
                totalFiles: files.length,
                totalSize: files.reduce((sum, file) => sum + file.content.length, 0),
                buildInstructions: [
                    'Open index.html in a web browser',
                    'Or serve with any static file server',
                    'Components are self-contained and interactive'
                ],
                deploymentReady: true
            },
            recommendations: [
                {
                    type: 'performance',
                    message: 'Consider enabling compression for production deployment',
                    priority: 'medium',
                    actionable: true
                },
                {
                    type: 'seo',
                    message: 'Add meta description and Open Graph tags for better SEO',
                    priority: 'high',
                    actionable: true
                }
            ]
        };
    }
    async generateHTMLWithComponents(mcpInput) {
        const title = mcpInput.content.title;
        const description = mcpInput.content.description || `Welcome to ${title}`;
        // Load base CSS
        const baseCSS = await this.loadWBCSS();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="generator" content="Claude AI Website Builder v1.0.0">
    
    <!-- Claude AI Website Builder Core Styles -->
    <style>
        ${baseCSS}
        
        /* Component-specific enhancements */
        .claude-website {
            --primary-color: ${mcpInput.customization?.primaryColor || '#007acc'};
            --secondary-color: ${mcpInput.customization?.secondaryColor || '#f8f9fa'};
            --accent-color: ${mcpInput.customization?.accentColor || '#17a2b8'};
        }
        
        .hero-section {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: calc(var(--space-xl) * var(--golden-ratio));
            text-align: center;
            border-radius: var(--border-radius-lg);
            margin-bottom: var(--space-xl);
        }
        
        .component-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-lg);
            margin: var(--space-xl) 0;
        }
        
        .component-card {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            padding: var(--space-lg);
            box-shadow: var(--shadow-sm);
            transition: all 0.3s ease;
        }
        
        .component-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
    </style>
</head>
<body class="claude-website">
    <header class="hero-section">
        <h1>${title}</h1>
        <p class="lead">${description}</p>
        <div class="theme-controls">
            <button onclick="toggleTheme()" class="btn btn-secondary">Toggle Theme</button>
            <button onclick="openColorPicker()" class="btn btn-accent">Customize Colors</button>
        </div>
    </header>

    <main class="container">
        ${this.generateContentByType(mcpInput.website.type, mcpInput)}
        
        ${mcpInput.website.features?.includes('table-theme') ? this.generateTableSection() : ''}
        ${mcpInput.website.features?.includes('theme-generator') ? this.generateThemeSection() : ''}
    </main>

    <footer class="text-center" style="margin-top: var(--space-xl); padding: var(--space-lg); border-top: 1px solid var(--border-color);">
        <p>&copy; 2025 ${title}. Built with Claude AI Website Builder.</p>
        <p class="text-sm text-secondary">Powered by mathematical design principles and golden ratio layouts.</p>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>`;
    }
    generateContentByType(type, mcpInput) {
        const title = mcpInput.content.title;
        switch (type) {
            case 'portfolio':
                return `
        <section class="component-showcase">
            <div class="component-card">
                <h3>Project Showcase</h3>
                <p>Display your work with advanced table theming and mathematical layouts.</p>
                <div class="table-container">
                    <table class="claude-table">
                        <thead>
                            <tr><th>Project</th><th>Technology</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Portfolio Site</td><td>Claude AI Builder</td><td>Complete</td></tr>
                            <tr><td>Theme System</td><td>Mathematical CSS</td><td>Active</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="component-card">
                <h3>Skills & Expertise</h3>
                <p>Interactive components with real-time theme updates.</p>
            </div>
        </section>`;
            case 'business':
                return `
        <section class="component-showcase">
            <div class="component-card">
                <h3>Our Services</h3>
                <p>Professional solutions with Claude AI integration.</p>
            </div>
            <div class="component-card">
                <h3>Why Choose Us</h3>
                <ul>
                    <li>AI-powered website generation</li>
                    <li>Mathematical design principles</li>
                    <li>Real-time theme customization</li>
                    <li>Component-based architecture</li>
                </ul>
            </div>
            <div class="component-card">
                <h3>Contact Information</h3>
                <p>Get in touch to discuss your project needs.</p>
            </div>
        </section>`;
            case 'blog':
                return `
        <section class="component-showcase">
            <article class="component-card">
                <h3>Welcome to ${title}</h3>
                <p class="text-sm text-secondary">Published today</p>
                <p>This blog was generated using Claude AI Website Builder with advanced theming capabilities.</p>
            </article>
            <article class="component-card">
                <h3>About Mathematical Design</h3>
                <p class="text-sm text-secondary">Design principles</p>
                <p>Learn how golden ratio proportions create visually appealing layouts.</p>
            </article>
        </section>`;
            case 'landing':
                return `
        <section class="component-showcase">
            <div class="component-card text-center">
                <h3>Key Features</h3>
                <div class="feature-grid">
                    <div class="feature-item">
                        <h4>🎨 Advanced Theming</h4>
                        <p>Mathematical color relationships</p>
                    </div>
                    <div class="feature-item">
                        <h4>📐 Golden Ratio Layouts</h4>
                        <p>Proportional design system</p>
                    </div>
                    <div class="feature-item">
                        <h4>🔄 Real-time Updates</h4>
                        <p>Instant visual feedback</p>
                    </div>
                </div>
            </div>
        </section>`;
            default:
                return `
        <section class="component-showcase">
            <div class="component-card">
                <h3>Welcome to ${title}</h3>
                <p>This website was generated using Claude AI Website Builder.</p>
                <p>Features include advanced theming, mathematical layouts, and component-based architecture.</p>
            </div>
        </section>`;
        }
    }
    generateTableSection() {
        return `
    <section class="component-showcase">
        <div class="component-card">
            <h3>Advanced Table Theming</h3>
            <p>Interactive tables with mathematical color inheritance.</p>
            <div class="table-theme-demo">
                <table class="claude-table enhanced-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Status</th>
                            <th>Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Color Inheritance</td>
                            <td class="status-active">Active</td>
                            <td>98%</td>
                        </tr>
                        <tr>
                            <td>Golden Ratio Spacing</td>
                            <td class="status-active">Active</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Theme Responsiveness</td>
                            <td class="status-active">Active</td>
                            <td>95%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>`;
    }
    generateThemeSection() {
        return `
    <section class="component-showcase">
        <div class="component-card">
            <h3>Theme Generator</h3>
            <p>Real-time color customization with mathematical relationships.</p>
            <div class="theme-controls-demo">
                <div class="color-picker-demo">
                    <label>Primary Color: <input type="color" id="primaryColor" value="#007acc"></label>
                    <label>Secondary Color: <input type="color" id="secondaryColor" value="#f8f9fa"></label>
                    <label>Accent Color: <input type="color" id="accentColor" value="#17a2b8"></label>
                </div>
            </div>
        </div>
    </section>`;
    }
    async generateCSSWithThemes(mcpInput) {
        const baseCSS = await this.loadWBCSS();
        return `${baseCSS}

/* MCP Generated Theme Enhancements */
:root {
    --mcp-primary: ${mcpInput.customization?.primaryColor || '#007acc'};
    --mcp-secondary: ${mcpInput.customization?.secondaryColor || '#f8f9fa'};
    --mcp-accent: ${mcpInput.customization?.accentColor || '#17a2b8'};
}

/* Enhanced component styling */
.claude-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--space-md) 0;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.claude-table th,
.claude-table td {
    padding: calc(var(--space-sm) * var(--golden-ratio));
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.claude-table th {
    background-color: var(--mcp-primary);
    color: white;
    font-weight: 600;
}

.claude-table tbody tr:hover {
    background-color: var(--mcp-secondary);
}

.status-active {
    color: var(--success-color);
    font-weight: 600;
}

.btn {
    padding: calc(var(--space-sm) * var(--golden-ratio)) var(--space-md);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-secondary {
    background-color: var(--mcp-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-accent {
    background-color: var(--mcp-accent);
    color: white;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* Responsive enhancements */
@media (max-width: 768px) {
    .component-showcase {
        grid-template-columns: 1fr;
    }
    
    .hero-section {
        padding: var(--space-lg);
    }
}`;
    }
    generateJavaScript(mcpInput) {
        return `// Claude AI Website Builder - Generated JavaScript
// Mathematical theme system with real-time updates

class ClaudeThemeSystem {
    private currentTheme: string;
    private colors: Record<string, string>;

    constructor() {
        this.currentTheme = 'light';
        this.colors = {
            primary: '${mcpInput.customization?.primaryColor || '#007acc'}',
            secondary: '${mcpInput.customization?.secondaryColor || '#f8f9fa'}',
            accent: '${mcpInput.customization?.accentColor || '#17a2b8'}'
        };
        this.init();
    }

    init(): void {
        this.bindEvents();
        this.applyGoldenRatioSpacing();
    }

    bindEvents(): void {
        // Color picker events
        const colorInputs = document.querySelectorAll('input[type="color"]') as NodeListOf<HTMLInputElement>;
        colorInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                this.updateColor(target.id, target.value);
            });
        });
    }

    updateColor(colorType: string, value: string): void {
        const colorVar = '--mcp-' + colorType.replace('Color', '');
        document.documentElement.style.setProperty(colorVar, value);
        this.colors[colorType.replace('Color', '')] = value;
    }

    applyGoldenRatioSpacing(): void {
        const goldenRatio = 1.618;
        const elements = document.querySelectorAll('.component-card') as NodeListOf<HTMLElement>;
        
        elements.forEach((el, index) => {
            const delay = (index * 100) / goldenRatio;
            el.style.animationDelay = delay + 'ms';
            el.classList.add('fade-in');
        });
    }

    toggleTheme(): void {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        
        if (this.currentTheme === 'dark') {
            document.documentElement.style.setProperty('--background-color', '#1a1a1a');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--surface-color', '#2a2a2a');
        } else {
            document.documentElement.style.setProperty('--background-color', '#ffffff');
            document.documentElement.style.setProperty('--text-primary', '#333333');
            document.documentElement.style.setProperty('--surface-color', '#f8f9fa');
        }
    }
}

// Global functions
const themeSystem = new ClaudeThemeSystem();

function toggleTheme(): void {
    themeSystem.toggleTheme();
}

function openColorPicker(): void {
    const colorPicker = document.querySelector('.color-picker-demo') as HTMLElement;
    if (colorPicker) {
        colorPicker.style.display = colorPicker.style.display === 'none' ? 'block' : 'none';
    }
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = \`
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
\`;
document.head.appendChild(style);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Claude AI Website Builder initialized');
    console.log('Theme system active with mathematical spacing');
});`;
    }
    async loadWBCSS() {
        try {
            const cssPath = path.join(process.cwd(), 'wb', 'wb.css');
            return await fs.readFile(cssPath, 'utf8');
        }
        catch (error) {
            console.log('wb/wb.css not found, using fallback CSS');
            return this.getFallbackCSS();
        }
    }
    getFallbackCSS() {
        return `/* Claude AI Website Builder - Core CSS System */
:root {
    --golden-ratio: 1.618;
    --inverse-golden-ratio: 0.618;
    
    /* Spacing system based on golden ratio */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: calc(1rem * var(--golden-ratio));
    --space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio));
    
    /* Colors */
    --primary-color: #007acc;
    --secondary-color: #f8f9fa;
    --accent-color: #17a2b8;
    --background-color: #ffffff;
    --surface-color: #f8f9fa;
    --text-primary: #333333;
    --text-secondary: #666666;
    --border-color: #e5e7eb;
    --success-color: #28a745;
    
    /* Border radius */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: var(--golden-ratio);
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
    color: var(--text-primary);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
}

.text-center { text-align: center; }
.text-sm { font-size: 0.875rem; }
.text-secondary { color: var(--text-secondary); }
.lead { font-size: 1.25rem; font-weight: 300; }`;
    }
    async getAvailableComponents() {
        try {
            const componentsDir = path.join(process.cwd(), 'components');
            const components = await fs.readdir(componentsDir, { withFileTypes: true });
            return components
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
        }
        catch (error) {
            return ['table', 'theme', 'registry'];
        }
    }
    async getAvailableThemes() {
        try {
            const themesDir = path.join(process.cwd(), 'themes');
            const themes = await fs.readdir(themesDir);
            return themes
                .filter(file => file.endsWith('.html'))
                .map(file => file.replace('.html', ''));
        }
        catch (error) {
            return ['theme-generator', 'hsl-color-picker', 'hue-color-slider'];
        }
    }
    async getComponentHTML(componentPath) {
        try {
            const fullPath = path.join(process.cwd(), 'components', componentPath);
            return await fs.readFile(fullPath, 'utf8');
        }
        catch (error) {
            return `<!-- Component ${componentPath} not found -->`;
        }
    }
    async getThemeHTML(themePath) {
        try {
            const fullPath = path.join(process.cwd(), 'themes', themePath);
            return await fs.readFile(fullPath, 'utf8');
        }
        catch (error) {
            return `<!-- Theme ${themePath} not found -->`;
        }
    }
    generateChecksum(content) {
        return crypto.createHash('md5').update(content).digest('hex');
    }
}
export default MCPClaudeWebsiteBuilder;
//# sourceMappingURL=mcp-integration.js.map