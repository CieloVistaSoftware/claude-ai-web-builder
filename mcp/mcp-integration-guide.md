# Connecting Claude AI Website Builder to MCP Server

<div align="center">
  <img src="../images/ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>

## Overview

Your Claude AI Website Builder is now MCP (Model Context Protocol) compliant and can be integrated with any MCP server. This document explains how to connect and use your website builder through an MCP server.

## What You Have

✅ **MCP-Compliant Interface**: Your existing website builder now exposes standard MCP endpoints  
✅ **Existing Components**: Table themes, theme generators, and mathematical spacing system  
✅ **Real-time Testing**: Comprehensive Playwright test suite for MCP integration  
✅ **Production Ready**: Error handling, validation, and performance monitoring  

## MCP Endpoints Available

Your website builder exposes these MCP-standard endpoints:

- `POST /mcp/generate` - Generate websites using your existing components
- `GET /mcp/capabilities` - List supported website types, features, and components
- `GET /mcp/health` - Health check and status
- `POST /mcp/validate` - Validate input before generation
- `GET /mcp/metrics` - Performance and usage metrics

## How to Connect to an External MCP Server

### 1. Register Your Tool with MCP Server

Use the provided `mcp-registration.json` file to register your website builder:

```json
{
  "name": "claude-ai-website-builder",
  "version": "1.0.0",
  "integration": {
    "method": "http",
    "endpoint": "http://localhost:8000/mcp/generate",
    "healthCheck": "http://localhost:8000/mcp/health"
  },
  "capabilities": {
    "websiteTypes": ["portfolio", "business", "blog", "landing", "custom"],
    "features": ["responsive-design", "table-theme", "theme-generator", "mathematical-spacing"]
  }
}
```

### 2. MCP Server Registration Process

**For HTTP-based MCP servers:**
```bash
# Register your tool
curl -X POST http://mcp-server:3000/api/tools/register \
  -H "Content-Type: application/json" \
  -d @mcp-registration.json
```

**For file-based MCP servers:**
```bash
# Copy registration to MCP server's tools directory
cp mcp-registration.json /path/to/mcp-server/tools/
```

### 3. Example MCP Server Integration Code

```typescript
// In your MCP server
import { Tool } from './types';

const claudeWebsiteBuilder: Tool = {
  name: 'claude-ai-website-builder',
  description: 'Generate websites with mathematical theming and component system',
  parameters: {
    type: 'object',
    required: ['website', 'content', 'output'],
    properties: {
      website: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { enum: ['portfolio', 'business', 'blog', 'landing', 'custom'] },
          features: { 
            type: 'array',
            items: { enum: ['table-theme', 'theme-generator', 'mathematical-spacing'] }
          }
        }
      },
      content: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' }
        }
      },
      output: {
        type: 'object',
        required: ['format'],
        properties: {
          format: { enum: ['files', 'zip'] }
        }
      }
    }
  },
  handler: async (params) => {
    const response = await fetch('http://localhost:8000/mcp/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await response.json();
  }
};
```

## Testing Your MCP Integration

### Start Your Website Builder
```bash
npm start
# Server runs on http://localhost:8000
```

### Run MCP Integration Tests
```bash
# Test all MCP functionality
npm run test:mcp

# Test specific areas
npm run test:mcpHealth      # Health and capabilities
npm run test:mcpValidation  # Input validation
npm run test:mcpGeneration  # Website generation
npm run test:mcpComponents  # Component integration
npm run test:mcpDemo        # Complete workflow demo
```

### Manual Testing via API

**Check health:**
```bash
curl http://localhost:8000/mcp/health
```

**Get capabilities:**
```bash
curl http://localhost:8000/mcp/capabilities
```

**Generate a website:**
```bash
curl -X POST http://localhost:8000/mcp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "claude-ai-website-builder",
    "website": {
      "type": "portfolio",
      "features": ["table-theme", "theme-generator"]
    },
    "content": {
      "title": "My Portfolio",
      "description": "Professional portfolio website"
    },
    "output": {
      "format": "files"
    }
  }'
```

## Features Available Through MCP

### Website Types
- **Portfolio**: Showcases work with table components
- **Business**: Professional business sites with service sections
- **Blog**: Content-focused sites with article layouts
- **Landing**: Marketing pages with call-to-action sections
- **Custom**: Flexible websites with any combination of features

### Component Integration
- **Table Theme Component**: Interactive tables with mathematical color inheritance
- **Theme Generator**: Real-time color customization with HSL controls
- **Mathematical Spacing**: Golden ratio-based layouts and proportions
- **Responsive Design**: Mobile-first responsive layouts

### Customization Options
```json
{
  "customization": {
    "primaryColor": "#007acc",
    "secondaryColor": "#f8f9fa", 
    "accentColor": "#17a2b8"
  }
}
```

## Generated Output Structure

When you generate a website through MCP, you get:

```
Generated Files:
├── index.html              # Main HTML with your components
├── css/styles.css          # CSS with mathematical spacing
├── js/main.js             # Interactive theme system
└── components/            # Requested components
    ├── table-theme.html   # If table-theme requested
    └── theme-generator.html # If theme-generator requested
```

### Output Metadata
```json
{
  "success": true,
  "files": [...],
  "structure": {
    "type": "website",
    "entryPoint": "index.html"
  },
  "metadata": {
    "framework": "claude-ai-website-builder",
    "totalFiles": 4,
    "deploymentReady": true
  },
  "recommendations": [
    {
      "type": "seo",
      "message": "Add meta description and Open Graph tags",
      "priority": "high"
    }
  ]
}
```

## Production Deployment

### Environment Variables
```bash
PORT=8000                    # Server port
NODE_ENV=production         # Production mode
MCP_SERVER_URL=http://...   # MCP server URL (optional)
LOG_LEVEL=info              # Logging level
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

### Health Monitoring
The MCP integration includes comprehensive monitoring:
- Health checks at `/mcp/health`
- Performance metrics at `/mcp/metrics`
- Error handling with detailed responses
- Request/response logging

## Next Steps

1. **Register with MCP Server**: Use your `mcp-registration.json` file
2. **Run Integration Tests**: Verify everything works with `npm run test:mcp`
3. **Configure Production**: Set environment variables and deploy
4. **Monitor Performance**: Use metrics endpoint for monitoring
5. **Extend Features**: Add more components or website types as needed

Your Claude AI Website Builder is now ready to be used by any MCP server that needs website generation capabilities!
