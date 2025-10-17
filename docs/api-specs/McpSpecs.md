# MCP Documentation Server Specifications

## Overview
We have a ton of docs in the docs files.
They are all .md docs.
I want to set up an mcp server to serve those docs using a md -> html convertor.
There should be an index listing all the docs in order by name.

## User Documentation

### Installation & Setup

1. **Navigate to MCP Server Directory**
   ```bash
   cd mcp-docs-server
   ```

2. **Install Dependencies**
   - **Windows**: Run `install.bat`
   - **Manual**: Run `npm install`

3. **Start the Server**
   ```bash
   npm start
   ```
   The server runs on stdio and communicates via Model Context Protocol.

### Available MCP Tools

#### 1. `list_docs`
Lists all available documentation files with metadata.

**Parameters**: None

**Example Response**:
```
# Website Builder Documentation Index

**Total Files:** 33

• **Architecture Diagram** (ArchitectureDiagram.md) - 19KB
• **Component Issues Proposal** (ComponentIssuesProposal.md) - 8KB
• **How to Create Web Component** (HowToCreateWebcomponent.md) - 53KB
...
```

#### 2. `get_doc`
Retrieves a documentation file converted to styled HTML.

**Parameters**:
- `filename` (required): Name of the documentation file (with or without .md extension)
- `format` (optional): "html", "markdown", or "both" (default: "html")

**Example**:
```json
{
  "filename": "HowToCreateWebcomponent.md",
  "format": "html"
}
```

#### 3. `search_docs`
Searches through documentation content with context.

**Parameters**:
- `query` (required): Search term
- `case_sensitive` (optional): Boolean (default: false)

**Example**:
```json
{
  "query": "web component",
  "case_sensitive": false
}
```

#### 4. `get_docs_index`
Generates a complete HTML index of all documentation files.

**Parameters**:
- `include_content_preview` (optional): Boolean (default: false)

**Example Response**: Full HTML page with searchable index, dark theme styling, and file metadata.

### MCP Resources

Direct access via MCP resource URIs:
- `wb-docs://filename.md` - Access any documentation file as styled HTML

### Features

- **📚 Documentation Serving**: Serves all `.md` files from `../docs/` directory
- **🔄 MD to HTML Conversion**: Custom markdown parser with full feature support
- **🎨 Styled Output**: Professional dark theme with Website Builder branding
- **🔍 Search Functionality**: Full-text search with context highlighting
- **📑 Index Generation**: Auto-generated searchable index
- **🔗 MCP Integration**: Complete Model Context Protocol support

### Technical Details

**Supported Markdown Features**:
- Headers (H1-H6) with color coding
- **Bold** and *italic* text formatting
- `Inline code` and fenced code blocks with syntax highlighting
- Lists (ordered and unordered)
- Tables with striped styling
- Blockquotes with accent borders
- Links with hover effects
- Images with responsive sizing
- Horizontal rules with gradient styling

**CSS Theming**:
- Dark theme optimized for readability
- Professional color scheme (purple/blue gradients)
- Responsive design for mobile/desktop
- Syntax highlighting for code blocks
- Hover effects and smooth transitions

### Testing

Run the test suite to verify functionality:
```bash
npm test
```

Test results include:
- ✅ Markdown parser functionality
- ✅ Documentation file detection (33 files)
- ✅ CSS loading and theme application
- ✅ Server startup verification

### Troubleshooting

**Common Issues**:

1. **"Node.js not found"**
   - Install Node.js from https://nodejs.org/

2. **"Cannot find CSS file"**
   - Ensure `../components/md-to-html/md-to-html.css` exists
   - Server uses fallback styles if CSS is missing

3. **"Documentation directory not found"**
   - Ensure `../docs/` directory exists with `.md` files

**Server Status**: ✅ Fully operational with 33 documentation files served