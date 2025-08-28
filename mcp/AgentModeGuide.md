# Claude AI Website Builder: Agent Mode Guide

<div align="center">
  <img src="../ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>

## Overview

Agent Mode is a powerful feature of the Claude AI Website Builder that enables completely automated website generation based on natural language descriptions. Unlike the standard manual builder interface, Agent Mode leverages Claude's AI capabilities to handle the entire website creation process without requiring user intervention for individual design decisions.

## What Is Agent Mode?

Agent Mode is an AI-driven approach to website building where Claude acts as an intelligent agent that:

1. **Interprets your requirements** from natural language descriptions
2. **Makes design decisions** automatically based on best practices
3. **Selects appropriate components** for your specific use case
4. **Generates a complete, ready-to-use website** with minimal input

## Agent Mode vs. Manual Building

| Feature | Agent Mode | Manual Building |
|---------|------------|----------------|
| **Creation Method** | Natural language description | Visual drag-and-drop |
| **Speed** | Minutes | Hours |
| **Technical Knowledge** | None required | Basic understanding needed |
| **Design Decisions** | AI-driven | User-driven |
| **Customization Level** | High-level direction | Precise control |
| **Best For** | Quick deployments, prototypes | Custom, highly specific designs |

## How Agent Mode Works

### Technical Implementation

Agent Mode leverages the MCP (Model Context Protocol) integration to generate websites programmatically:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│   User Request  │─────▶│  Claude Agent   │─────▶│  MCP Endpoints  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Final Website  │◀─────│ Component       │◀─────│ Website         │
│                 │      │ Assembly        │      │ Generation      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. The user provides a natural language description of their website requirements
2. Claude's AI agent processes and interprets these requirements
3. The agent uses the MCP API endpoints to:
   - Select appropriate website type and template
   - Configure theme and layout properties
   - Create necessary pages and components
   - Generate appropriate content
4. The system assembles a complete website based on these specifications
5. The user can review, make adjustments, and export the final website

## Using Agent Mode

### Starting Agent Mode

1. Open the Claude AI Website Builder
2. Select "Build with Agent Mode" option
3. You'll be prompted for a website description

### Writing Effective Descriptions

Provide clear, detailed descriptions for best results. Include:

- **Website purpose**: What is the website for?
- **Target audience**: Who will visit the website?
- **Desired style**: Modern, traditional, minimalist, etc.
- **Content priorities**: What's most important to feature?
- **Special features**: Forms, galleries, etc.

#### Example Good Description:

```
Create a modern portfolio website for a photographer who specializes in wildlife photography.
The website should have a dark theme to make the photos stand out, with a gallery section
organized by animal categories. Include a contact form, an about page with the photographer's
bio, and a blog section for sharing photography tips. The style should be clean and minimal
to keep the focus on the images.
```

### Reviewing and Refining

After generation, you can:

1. Preview the complete website
2. Make adjustments through the chat interface
3. Request specific changes to components, colors, or layout
4. Regenerate specific sections if needed

## MCP Technical Integration

Agent Mode relies on the MCP endpoints defined in your Claude AI Website Builder:

```javascript
// Agent mode API calls
async function generateWebsiteWithAgent(description) {
  // Process description to extract key requirements
  const requirements = await processDescription(description);
  
  // Call MCP generate endpoint
  const response = await fetch('http://localhost:8000/mcp/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toolName: 'claude-ai-website-builder',
      website: {
        type: requirements.type,
        features: requirements.features
      },
      content: {
        title: requirements.title,
        description: requirements.description
      },
      output: {
        format: 'files'
      }
    })
  });
  
  return await response.json();
}
```

## Best Practices

### When to Use Agent Mode

Agent Mode is ideal for:
- Quick website prototyping
- Users without design experience
- Creating standard websites quickly
- Testing different website concepts

### When to Use Manual Building

Manual building is better for:
- Highly specific design requirements
- Complex interactive functionality
- Extensive customization needs
- Iterative design processes

## Example Agent Mode Scenarios

### Business Website

**User Description:**
```
Create a professional website for a law firm specializing in corporate law. 
The firm has 5 partners and offers services in mergers and acquisitions, 
corporate governance, and regulatory compliance. We want a sophisticated 
design with navy blue and gold accents, easy navigation, and clear calls 
to action for potential clients to schedule consultations.
```

### E-commerce Site

**User Description:**
```
Build an online store for handmade ceramic pottery. The products are 
high-end artistic pieces, each unique. The store needs product categories, 
individual product pages with multiple images per item, a shopping cart, 
and a streamlined checkout process. The aesthetic should be earthy and 
organic with plenty of whitespace to showcase the pottery.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Website doesn't match description | Provide more specific details in your description |
| Missing key functionality | Explicitly mention required features in your description |
| Design looks generic | Include specific style preferences and reference examples |
| Content not appropriate | Specify industry, tone, and content requirements |

## Future Enhancements

- **Style transfer**: Upload images of websites you like for style inspiration
- **Iterative refinement**: Multi-step conversation to refine website elements
- **Component-specific requests**: Target specific sections for regeneration
- **User feedback learning**: System improves based on user acceptance/rejection

---

*This document describes Agent Mode implementation in the Claude AI Website Builder. For design-related documentation and general MCP information, see [MCPAndClaude.md](./MCPAndClaude.md).*
