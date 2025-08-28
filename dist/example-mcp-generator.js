"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Example MCP Website Generator Implementation
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class MCPWebsiteGenerator {
    constructor() {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, express_1.default)()
        });
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    setupRoutes() {
        // Main generation endpoint
        this.app.post('/generate', async (req, res) => {
            try {
                const result = await this.generateWebsite(req.body);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    executionTime: 0,
                    files: [],
                    structure: { type: 'website', entryPoint: 'index.html' },
                    metadata: { framework: 'unknown', totalFiles: 0, totalSize: 0, deploymentReady: false }
                });
            }
        });
        // Capabilities endpoint
        this.app.get('/capabilities', (req, res) => {
            res.json({
                name: 'example-mcp-generator',
                version: '1.0.0',
                description: 'Example MCP-compliant website generator',
                supportedTypes: ['portfolio', 'business', 'blog'],
                supportedFrameworks: ['vanilla', 'react'],
                features: ['responsive', 'dark-mode', 'seo']
            });
        });
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });
        // Validation endpoint
        this.app.post('/validate', (req, res) => {
            const isValid = this.validateInput(req.body);
            res.json({ valid: isValid });
        });
    }
    async generateWebsite(input) {
        const startTime = Date.now();
        // Validate input
        if (!this.validateInput(input)) {
            throw new Error('Invalid input parameters');
        }
        // Generate files based on website type
        const files = await this.createFiles(input);
        // Build project structure
        const structure = this.buildStructure(input);
        return {
            success: true,
            executionTime: Date.now() - startTime,
            files,
            structure,
            metadata: {
                framework: input.website.framework || 'vanilla',
                totalFiles: files.length,
                totalSize: files.reduce((sum, file) => sum + file.content.length, 0),
                deploymentReady: true
            }
        };
    }
    validateInput(input) {
        return !!(input.website?.type &&
            input.content?.title &&
            input.output?.format);
    }
    async createFiles(input) {
        const files = [];
        // Generate HTML file
        files.push({
            path: 'index.html',
            content: this.generateHTML(input),
            type: 'text',
            encoding: 'utf8'
        });
        // Generate CSS file
        files.push({
            path: 'styles/main.css',
            content: this.generateCSS(input),
            type: 'text',
            encoding: 'utf8'
        });
        // Generate JavaScript file if React framework
        if (input.website.framework === 'react') {
            files.push({
                path: 'src/App.js',
                content: this.generateReactComponent(input),
                type: 'text',
                encoding: 'utf8'
            });
            files.push({
                path: 'package.json',
                content: this.generatePackageJson(input),
                type: 'text',
                encoding: 'utf8'
            });
        }
        return files;
    }
    generateHTML(input) {
        const title = input.content.title;
        const description = input.content.description || 'Welcome to your new website';
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <h1>${title}</h1>
    </header>
    <main>
        <section class="hero">
            <h2>Welcome</h2>
            <p>${description}</p>
        </section>
        ${this.generateContentByType(input.website.type)}
    </main>
    <footer>
        <p>&copy; 2025 ${title}. All rights reserved.</p>
    </footer>
</body>
</html>`;
    }
    generateContentByType(type) {
        switch (type) {
            case 'portfolio':
                return `
        <section class="portfolio">
            <h2>My Work</h2>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <h3>Project 1</h3>
                    <p>Description of your first project</p>
                </div>
                <div class="portfolio-item">
                    <h3>Project 2</h3>
                    <p>Description of your second project</p>
                </div>
            </div>
        </section>`;
            case 'business':
                return `
        <section class="services">
            <h2>Our Services</h2>
            <div class="services-grid">
                <div class="service-item">
                    <h3>Service 1</h3>
                    <p>Description of your service</p>
                </div>
                <div class="service-item">
                    <h3>Service 2</h3>
                    <p>Description of another service</p>
                </div>
            </div>
        </section>`;
            case 'blog':
                return `
        <section class="blog">
            <h2>Latest Posts</h2>
            <article class="blog-post">
                <h3>Welcome Post</h3>
                <p>Your first blog post content goes here.</p>
            </article>
        </section>`;
            default:
                return '<section><p>Content will be added here.</p></section>';
        }
    }
    generateCSS(input) {
        return `/* Generated styles for ${input.content.title} */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

header {
    background: #007acc;
    color: white;
    padding: 2rem 0;
    text-align: center;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    margin-bottom: 3rem;
}

.portfolio-grid, .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.portfolio-item, .service-item {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
}

@media (max-width: 768px) {
    main {
        padding: 1rem;
    }
    
    .portfolio-grid, .services-grid {
        grid-template-columns: 1fr;
    }
}`;
    }
    generateReactComponent(input) {
        return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${input.content.title}</h1>
      </header>
      <main>
        <section className="hero">
          <h2>Welcome</h2>
          <p>${input.content.description || 'Welcome to your new React website'}</p>
        </section>
      </main>
    </div>
  );
}

export default App;`;
    }
    generatePackageJson(input) {
        return JSON.stringify({
            name: input.content.title.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            description: input.content.description,
            dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0'
            },
            devDependencies: {
                '@vitejs/plugin-react': '^4.0.0',
                vite: '^4.4.0'
            },
            scripts: {
                dev: 'vite',
                build: 'vite build',
                preview: 'vite preview'
            }
        }, null, 2);
    }
    buildStructure(input) {
        return {
            type: 'website',
            entryPoint: input.website.framework === 'react' ? 'src/App.js' : 'index.html',
            buildScript: input.website.framework === 'react' ? 'npm run build' : undefined,
            dependencies: input.website.framework === 'react' ? [
                { name: 'react', version: '^18.2.0' },
                { name: 'react-dom', version: '^18.2.0' }
            ] : []
        };
    }
    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`MCP Website Generator running on port ${port}`);
        });
    }
}
// Start the server
const generator = new MCPWebsiteGenerator();
generator.start();
exports.default = MCPWebsiteGenerator;
//# sourceMappingURL=example-mcp-generator.js.map