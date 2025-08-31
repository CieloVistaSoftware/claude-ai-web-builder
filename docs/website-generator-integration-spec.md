# MCP Website Generator Integration Specification

**Document Version**: 1.1  
**Date**: December 28, 2024  
**Status**: Technical Specification  
**Audience**: External Tool Developers

> **📢 Implementation Update**: The core Claude AI Website Builder now uses pure TypeScript instead of React. External generators can still support React, but our main implementation is TypeScript-based.  

## 🎯 Overview

This specification defines the standardized interfaces, protocols, and data formats required for any website generator tool to integrate seamlessly with the MCP (Model Context Protocol) server infrastructure.

## 🏗️ Architecture Requirements

### Core Integration Patterns

Any website generator tool can integrate with the MCP server through one of these patterns:

1. **HTTP API Integration** - Tool exposes REST endpoints
2. **CLI Integration** - Tool provides command-line interface
3. **Library Integration** - Tool provides Node.js module
4. **Microservice Integration** - Tool runs as separate service

## 📋 Interface Specification

### 1. Tool Registration Interface

Every website generator must implement the `Tool` interface:

```typescript
interface Tool {
  name: string;                    // Unique tool identifier
  description: string;             // Human-readable description
  parameters: JSONSchema;          // Input validation schema
  handler: (params: any) => Promise<ToolResult>;
}

interface ToolResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata?: {
    executionTime?: number;
    filesGenerated?: number;
    warnings?: string[];
  };
}
```

### 2. Standard Input Schema

All website generator tools must accept a standardized input format:

```typescript
interface WebsiteGeneratorInput {
  // Required Fields
  toolName: string;                // Name of the specific generator tool
  projectId?: string;              // Optional project identifier
  
  // Website Configuration
  website: {
    type: WebsiteType;
    framework?: FrameworkType;
    styling?: StylingType;
    features?: FeatureType[];
  };
  
  // Content Configuration
  content: {
    title: string;
    description?: string;
    metadata?: Record<string, any>;
  };
  
  // Output Configuration
  output: {
    format: OutputFormat;
    destination?: string;
    compression?: boolean;
  };
  
  // Optional Extensions
  customization?: Record<string, any>;
  integrations?: IntegrationType[];
}

// Standard Enums
type WebsiteType = 
  | 'portfolio' | 'business' | 'blog' | 'ecommerce' 
  | 'landing' | 'app' | 'documentation' | 'custom';

type FrameworkType = 
  | 'vanilla' | 'react' | 'vue' | 'svelte' | 'angular'
  | 'next' | 'nuxt' | 'gatsby' | 'astro' | 'hugo';

type StylingType = 
  | 'css' | 'scss' | 'tailwind' | 'bootstrap' | 'bulma'
  | 'material-ui' | 'styled-components' | 'emotion';

type FeatureType = 
  | 'responsive' | 'dark-mode' | 'seo' | 'analytics' 
  | 'cms' | 'auth' | 'pwa' | 'i18n';

type OutputFormat = 
  | 'files' | 'zip' | 'tar' | 'json' | 'base64';

type IntegrationType = 
  | 'cms' | 'analytics' | 'auth' | 'payment' | 'hosting';
```

### 3. Standard Output Schema

All tools must return results in this standardized format:

```typescript
interface WebsiteGeneratorOutput {
  // Execution Results
  success: boolean;
  executionTime: number;
  
  // Generated Content
  files: GeneratedFile[];
  structure: ProjectStructure;
  
  // Metadata
  metadata: {
    framework: string;
    totalFiles: number;
    totalSize: number;
    buildInstructions?: string[];
    deploymentReady: boolean;
  };
  
  // Next Steps
  recommendations?: Recommendation[];
  warnings?: Warning[];
  errors?: Error[];
}

interface GeneratedFile {
  path: string;
  content: string | Buffer;
  type: 'text' | 'binary';
  encoding: 'utf8' | 'base64';
  metadata?: {
    size: number;
    checksum?: string;
    permissions?: string;
  };
}

interface ProjectStructure {
  type: 'website' | 'webapp' | 'static';
  entryPoint: string;
  buildScript?: string;
  dependencies?: Dependency[];
  devDependencies?: Dependency[];
}

interface Recommendation {
  type: 'performance' | 'seo' | 'accessibility' | 'security';
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}
```

## 🔌 Integration Methods

### Method 1: HTTP API Integration

**Tool Requirements:**
- Expose HTTP endpoints following REST conventions
- Accept JSON input/output
- Support CORS for web integration
- Implement proper error handling

**Endpoint Structure:**
```
POST /generate          # Main generation endpoint
GET  /capabilities      # Tool capabilities and supported features  
GET  /health           # Health check endpoint
POST /validate         # Input validation endpoint
```

**MCP Server Integration:**
```typescript
// Register HTTP API tool
const httpTool: Tool = {
  name: 'external-website-generator',
  description: 'External HTTP-based website generator',
  parameters: websiteGeneratorSchema,
  handler: async (params) => {
    const response = await fetch('http://external-tool:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await response.json();
  }
};
```

### Method 2: CLI Integration

**Tool Requirements:**
- Accept JSON input via stdin or file
- Output JSON results to stdout
- Use stderr for logging/errors
- Exit with appropriate codes (0=success, >0=error)

**Command Structure:**
```bash
# Standard CLI interface
your-generator --input input.json --output output.json
your-generator --stdin --format json
your-generator generate --type portfolio --framework react
```

**MCP Server Integration:**
```typescript
// Register CLI tool
const cliTool: Tool = {
  name: 'external-cli-generator',
  description: 'External CLI-based website generator',
  parameters: websiteGeneratorSchema,
  handler: async (params) => {
    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
      const process = spawn('your-generator', ['--stdin', '--format', 'json']);
      
      let output = '';
      process.stdout.on('data', (data) => output += data);
      process.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
      
      process.stdin.write(JSON.stringify(params));
      process.stdin.end();
    });
  }
};
```

### Method 3: Node.js Library Integration

**Tool Requirements:**
- Export main function following interface
- Handle async operations properly
- Provide TypeScript definitions
- Include comprehensive error handling

**Library Structure:**
```typescript
// your-generator/index.ts
export interface GeneratorOptions extends WebsiteGeneratorInput {}
export interface GeneratorResult extends WebsiteGeneratorOutput {}

export async function generateWebsite(
  options: GeneratorOptions
): Promise<GeneratorResult> {
  // Your implementation
}

export const metadata = {
  name: 'your-generator',
  version: '1.0.0',
  capabilities: ['portfolio', 'business', 'blog'],
  frameworks: ['react', 'vue', 'vanilla']
};
```

**MCP Server Integration:**
```typescript
// Register library tool
import { generateWebsite } from 'your-generator';

const libraryTool: Tool = {
  name: 'external-lib-generator',
  description: 'External library-based website generator',
  parameters: websiteGeneratorSchema,
  handler: async (params) => {
    return await generateWebsite(params);
  }
};
```

### Method 4: Microservice Integration

**Tool Requirements:**
- Run as independent service
- Implement health checks
- Support service discovery
- Handle graceful shutdown

**Service Interface:**
```yaml
# docker-compose.yml example
services:
  website-generator:
    image: your-generator:latest
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔐 Security Requirements

### Input Validation
```typescript
// All tools must validate inputs
const inputSchema = {
  type: 'object',
  required: ['toolName', 'website', 'content', 'output'],
  properties: {
    website: {
      type: 'object',
      required: ['type'],
      properties: {
        type: { enum: ['portfolio', 'business', 'blog', 'ecommerce'] }
      }
    }
  },
  additionalProperties: false
};
```

### Output Sanitization
- Sanitize all HTML output
- Validate file paths (prevent directory traversal)
- Limit file sizes and counts
- Scan for malicious content

### Authentication & Authorization
```typescript
interface AuthContext {
  userId?: string;
  permissions?: string[];
  rateLimits?: {
    requestsPerHour: number;
    maxFileSize: number;
  };
}
```

## 📊 Performance Requirements

### Response Time Targets
- **Simple generation** (< 5 files): < 2 seconds
- **Medium generation** (5-20 files): < 5 seconds  
- **Complex generation** (> 20 files): < 15 seconds

### Resource Limits
- **Memory usage**: < 512MB per request
- **CPU usage**: < 2 cores per request
- **Disk usage**: < 100MB temporary files
- **Network**: < 10MB input/output

### Monitoring Interface
```typescript
interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  resourceUsage: {
    memory: number;
    cpu: number;
    disk: number;
  };
}

// Required endpoint
GET /metrics -> PerformanceMetrics
```

## 🧪 Testing Requirements

### Unit Testing
- Test all public interfaces
- Mock external dependencies
- Achieve > 90% code coverage

### Integration Testing
```typescript
// Standard test structure
describe('Website Generator Integration', () => {
  test('generates portfolio website', async () => {
    const input: WebsiteGeneratorInput = {
      toolName: 'test-generator',
      website: { type: 'portfolio' },
      content: { title: 'Test Portfolio' },
      output: { format: 'files' }
    };
    
    const result = await tool.handler(input);
    
    expect(result.success).toBe(true);
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.files).toContainFile('index.html');
  });
});
```

### Compatibility Testing
- Test with all MCP server versions
- Verify JSON schema compliance
- Check error handling scenarios

## 📈 Quality Standards

### Code Quality
- Follow language-specific style guides
- Use static analysis tools
- Implement comprehensive logging
- Include detailed documentation

### Documentation Requirements
```markdown
# Required Documentation
- README.md with setup instructions
- API documentation with examples
- Integration guide for MCP server
- Troubleshooting guide
- CHANGELOG.md with version history
```

### Error Handling Standards
```typescript
// Standard error format
interface ToolError {
  code: string;
  message: string;
  details?: any;
  recoverable: boolean;
  suggestions?: string[];
}

// Error codes must follow pattern: TOOL_ERROR_TYPE
// Examples: GEN_INVALID_INPUT, GEN_TEMPLATE_NOT_FOUND
```

## 🔄 Versioning & Compatibility

### Semantic Versioning
- **MAJOR**: Breaking changes to interface
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Compatibility Matrix
```json
{
  "mcpServer": ">=1.0.0",
  "nodeJs": ">=18.0.0",
  "supportedVersions": {
    "1.x": "Full support",
    "0.x": "Legacy support until 2026"
  }
}
```

### Migration Guide
```typescript
// Version detection
interface ToolCapabilities {
  version: string;
  apiVersion: string;
  supportedFeatures: string[];
  deprecatedFeatures: string[];
  migrationNotes?: string[];
}

// Required endpoint
GET /capabilities -> ToolCapabilities
```

## 🚀 Deployment Specifications

### Container Requirements
```dockerfile
# Standard Dockerfile structure
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```

### Environment Configuration
```typescript
interface EnvironmentConfig {
  PORT?: number;
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  MAX_CONCURRENT_REQUESTS?: number;
  TEMP_DIR?: string;
  CACHE_ENABLED?: boolean;
  MCP_SERVER_URL?: string;
}
```

## 📝 Registration Process

### Tool Registration
```typescript
// Registration payload
interface ToolRegistration {
  metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    homepage?: string;
    repository?: string;
  };
  capabilities: {
    websiteTypes: WebsiteType[];
    frameworks: FrameworkType[];
    features: FeatureType[];
    outputFormats: OutputFormat[];
  };
  integration: {
    method: 'http' | 'cli' | 'library' | 'microservice';
    endpoint?: string;
    command?: string;
    module?: string;
    healthCheck?: string;
  };
  requirements: {
    memory: string;
    cpu: string;
    disk: string;
    dependencies?: string[];
  };
}

// Registration endpoint
POST /api/tools/register
```

### Discovery Protocol
```typescript
// Auto-discovery interface
interface DiscoveryService {
  discoverTools(): Promise<ToolRegistration[]>;
  validateTool(registration: ToolRegistration): Promise<boolean>;
  registerTool(registration: ToolRegistration): Promise<string>;
  unregisterTool(toolId: string): Promise<boolean>;
}
```

## 🔍 Monitoring & Observability

### Logging Standards
```typescript
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  toolName: string;
  requestId: string;
  message: string;
  metadata?: any;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack: string;
  };
}
```

### Metrics Collection
```typescript
// Required metrics
interface ToolMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  resources: {
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  generation: {
    filesGenerated: number;
    averageFileSize: number;
    popularTemplates: string[];
  };
}
```

## 🎯 Example Implementation

### Complete Tool Example
```typescript
// example-generator.ts
import { Tool, WebsiteGeneratorInput, WebsiteGeneratorOutput } from './types';

export class ExampleWebsiteGenerator implements Tool {
  name = 'example-generator';
  description = 'Example website generator for MCP integration';
  
  parameters = {
    type: 'object',
    required: ['website', 'content'],
    properties: {
      website: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { enum: ['portfolio', 'business'] },
          framework: { enum: ['react', 'vanilla'] }
        }
      },
      content: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 }
        }
      }
    }
  };

  async handler(params: WebsiteGeneratorInput): Promise<WebsiteGeneratorOutput> {
    const startTime = Date.now();
    
    try {
      // Validate input
      this.validateInput(params);
      
      // Generate files
      const files = await this.generateFiles(params);
      
      // Build project structure
      const structure = this.buildStructure(params, files);
      
      return {
        success: true,
        executionTime: Date.now() - startTime,
        files,
        structure,
        metadata: {
          framework: params.website.framework || 'vanilla',
          totalFiles: files.length,
          totalSize: files.reduce((sum, f) => sum + f.content.length, 0),
          deploymentReady: true
        }
      };
    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        files: [],
        structure: { type: 'website', entryPoint: 'index.html' },
        metadata: { framework: 'unknown', totalFiles: 0, totalSize: 0, deploymentReady: false },
        errors: [{
          code: 'GEN_FAILED',
          message: error.message,
          recoverable: false
        }]
      };
    }
  }

  private validateInput(params: WebsiteGeneratorInput): void {
    if (!params.website?.type) {
      throw new Error('Website type is required');
    }
    if (!params.content?.title) {
      throw new Error('Website title is required');
    }
  }

  private async generateFiles(params: WebsiteGeneratorInput): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    // Generate HTML
    files.push({
      path: 'index.html',
      content: this.generateHTML(params),
      type: 'text',
      encoding: 'utf8'
    });
    
    // Generate CSS
    files.push({
      path: 'styles/main.css',
      content: this.generateCSS(params),
      type: 'text',
      encoding: 'utf8'
    });
    
    return files;
  }

  private generateHTML(params: WebsiteGeneratorInput): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.content.title}</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <h1>${params.content.title}</h1>
    <p>${params.content.description || 'Welcome to your new website!'}</p>
</body>
</html>`;
  }

  private generateCSS(params: WebsiteGeneratorInput): string {
    return `/* Generated CSS for ${params.content.title} */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    color: #333;
    border-bottom: 2px solid #007acc;
    padding-bottom: 0.5rem;
}`;
  }

  private buildStructure(params: WebsiteGeneratorInput, files: GeneratedFile[]): ProjectStructure {
    return {
      type: 'website',
      entryPoint: 'index.html',
      dependencies: [],
      devDependencies: []
    };
  }
}
```

## 📋 Checklist for Tool Developers

### Pre-Development
- [ ] Read and understand this specification
- [ ] Choose integration method (HTTP/CLI/Library/Microservice)
- [ ] Set up development environment
- [ ] Plan supported website types and frameworks

### Development Phase
- [ ] Implement core Tool interface
- [ ] Follow input/output schema specifications
- [ ] Add comprehensive input validation
- [ ] Implement error handling with standard error codes
- [ ] Add logging and monitoring capabilities
- [ ] Write unit and integration tests
- [ ] Create documentation

### Testing Phase
- [ ] Test with MCP server integration
- [ ] Verify JSON schema compliance
- [ ] Performance testing (response times, resource usage)
- [ ] Security testing (input sanitization, output validation)
- [ ] Cross-platform compatibility testing

### Deployment Phase
- [ ] Create deployment configuration
- [ ] Set up monitoring and alerting
- [ ] Register tool with MCP server
- [ ] Document deployment process
- [ ] Create troubleshooting guide

### Maintenance
- [ ] Monitor performance metrics
- [ ] Handle user feedback and bug reports
- [ ] Keep dependencies updated
- [ ] Maintain compatibility with MCP server updates
- [ ] Regular security audits

## 🔗 Resources

### MCP Server Integration
- **Tool Registration**: `POST /api/tools/register`
- **Health Check**: `GET /api/tools/{toolName}/health`
- **Metrics**: `GET /api/tools/{toolName}/metrics`
- **Documentation**: `GET /api/tools/{toolName}/docs`

### Development Tools
- **Schema Validator**: Available at `/schemas/website-generator.json`
- **Test Suite**: Integration test templates provided
- **CLI Tools**: MCP development CLI for testing
- **Docker Images**: Base images for containerized tools

### Support & Community
- **Documentation**: Full API documentation available
- **Examples**: Reference implementations provided
- **Issues**: Bug tracking and feature requests
- **Discussions**: Community forum for questions

---

**This specification ensures that any website generator tool can integrate seamlessly with the MCP server while maintaining consistency, performance, and reliability standards.**

*Version 1.0 - Complete specification ready for implementation*
