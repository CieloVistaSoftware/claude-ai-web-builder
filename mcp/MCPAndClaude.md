# Website Documentation Structure & Setup

## 1. Folder Structure for Your Documentation

```
website-docs/
├── content/
│   ├── homepage-updates.md
│   ├── blog-management.md
│   └── product-pages.md
├── design/
│   ├── css-modifications.md
│   ├── layout-changes.md
│   └── theme-updates.md
├── technical/
│   ├── database-changes.md
│   ├── api-integration.md
│   └── server-configuration.md
├── seo/
│   ├── meta-tags.md
│   ├── sitemap-updates.md
│   └── analytics-setup.md
└── procedures/
    ├── deployment-process.md
    ├── backup-procedures.md
    └── rollback-process.md
```

## 2. Document Template with Frontmatter

Each markdown file should start with frontmatter like this:

```markdown
---
title: "Homepage Content Updates"
category: "content"
tags: ["homepage", "hero-section", "content-management"]
priority: "high"
last_updated: "2024-07-13"
---

# Homepage Content Updates

## Overview
This document describes how to update content on the homepage.

## Prerequisites
- Access to CMS
- Backup of current content
- Staging environment access

## Procedure
1. **Backup Current Content**
   - Navigate to CMS dashboard
   - Export current homepage content
   - Save backup file with timestamp

2. **Make Changes in Staging**
   - Switch to staging environment
   - Update content sections
   - Preview changes

3. **Test and Validate**
   - Check all links work
   - Verify responsive design
   - Test loading speed

4. **Deploy to Production**
   - Use deployment pipeline
   - Monitor for errors
   - Verify changes live

## Rollback Procedure
If issues occur:
1. Access backup file
2. Restore previous content
3. Clear cache
4. Verify restoration

## Related Components
- Header navigation
- Footer links
- Contact forms
```

## 3. Configuration Files

### package.json
```json
{
  "name": "website-docs-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "build/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### Claude Desktop Config
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "website-docs": {
      "command": "node",
      "args": ["path/to/your/build/index.js"],
      "env": {
        "DOCS_PATH": "/path/to/your/website-docs"
      }
    }
  }
}
```

## 4. Example Documentation Files

### content/homepage-updates.md
```markdown
---
title: "Homepage Hero Section Updates"
category: "content"
tags: ["homepage", "hero", "banner", "main-content"]
---

# Homepage Hero Section Updates

## Quick Reference
- **File Location**: `/templates/homepage.html`
- **CMS Section**: Homepage > Hero Banner
- **Backup Location**: `/backups/homepage/`

## Step-by-Step Process

### 1. Access the CMS
- Login to admin panel: `yoursite.com/admin`
- Navigate to "Pages" > "Homepage"
- Click "Edit Hero Section"

### 2. Update Content
- **Headline**: Update main heading text
- **Subheading**: Modify supporting text
- **CTA Button**: Change button text and link
- **Background Image**: Upload new image (recommended: 1920x1080px)

### 3. Preview Changes
- Click "Preview" button
- Test on desktop and mobile
- Check all links work correctly

### 4. Publish
- Click "Save Draft" first
- Review one more time
- Click "Publish" to go live

## Common Issues
- **Image not displaying**: Check file format (JPG, PNG, WebP)
- **Text too long**: Keep headlines under 60 characters
- **Button not working**: Verify URL format includes http://
```

### design/css-modifications.md
```markdown
---
title: "CSS Style Modifications"
category: "design"
tags: ["css", "styling", "theme", "layout"]
---

# CSS Style Modifications

## Overview
Process for making CSS changes to website styling.

## File Locations
- **Main CSS**: `/assets/css/main.css`
- **Theme CSS**: `/assets/css/theme.css`
- **Custom CSS**: `/assets/css/custom.css`

## Procedure

### 1. Identify Target Elements
- Use browser dev tools (F12)
- Find CSS selectors for elements
- Note current styles and values

### 2. Make Changes
- Edit appropriate CSS file
- Add comments explaining changes
- Use specific selectors to avoid conflicts

### 3. Test Changes
- Clear browser cache
- Test on multiple browsers
- Check responsive breakpoints

## Best Practices
- Always comment your changes
- Use specific selectors
- Test thoroughly before deploying
- Keep backups of original files

## Example Change
```css
/* Homepage hero section background - Updated 2024-07-13 */
.hero-section {
    background-color: #2c3e50; /* Changed from #34495e */
    padding: 80px 0; /* Increased from 60px */
}
```
```

## 5. Usage Examples

Once your MCP server is running, Claude can help you like this:

**User**: "I need to update the homepage hero section text"

**Claude Response**: "I'll help you update the homepage hero section. Let me search for the relevant documentation."

*Claude uses the MCP tools to:*
1. Search for "homepage hero" documentation
2. Get the change procedure for content updates
3. Provide step-by-step instructions from your docs

**User**: "How do I change the website's main navigation menu?"

**Claude Response**: "Let me find the documentation for navigation changes."

*Claude searches your docs and provides:*
- Relevant documentation files
- Step-by-step procedures
- Related components that might be affected
- Backup and rollback procedures

## 6. Building and Running

```bash
# Install dependencies
npm install

# Build the TypeScript
npm run build

# Start the MCP server
npm start
```

## 7. Advanced Features You Can Add

### Dynamic Documentation Updates
- Watch for file changes and auto-reload
- Version control integration
- Change tracking and approval workflows

### Enhanced Search
- Full-text search with scoring
- Category and tag filtering
- Fuzzy matching for typos

### Integration with Your Website
- Direct API calls to your CMS
- Real-time status checking
- Automated deployment triggers

This setup gives you a powerful, dynamic documentation system that Claude can use to help with any website changes!