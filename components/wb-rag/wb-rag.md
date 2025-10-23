# wb-rag

A complete Retrieval-Augmented Generation (RAG) system web component for the WB Framework. Provides an AI assistant that intelligently searches documentation and uses Claude API to provide expert answers.

## Features

- 🔍 **Smart Search** - Intelligent relevance-based search across all documentation
- 🤖 **Claude Integration** - Powered by Claude Sonnet 4 for expert answers
- 📚 **Knowledge Base** - Indexes all WB Framework docs and components
- 💬 **Chat Interface** - Beautiful, modern chat UI with glassmorphism
- 📝 **Markdown Support** - Renders code examples with syntax highlighting
- 🎯 **Source Citations** - Shows which docs were used for each answer
- 🔥 **Custom Events** - Full event system for integration

## Usage

### Basic Usage

```html
<wb-rag></wb-rag>
```

### With wb-demo Component

Use `wb-demo` to showcase the RAG assistant with built-in tabs:

```html
<wb-demo markdown="wb-rag.md">
    <span slot="title">🤖 WB RAG Assistant</span>
    
    <div slot="examples">
        <h2>Live RAG Assistant</h2>
        <p>Try asking questions about the WB Framework:</p>
        
        <div style="height: 600px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
            <wb-rag></wb-rag>
        </div>
        
        <h3>Example Questions</h3>
        <ul>
            <li>"How do I use wb-button?"</li>
            <li>"What color themes are available?"</li>
            <li>"Show me a navigation example"</li>
            <li>"Explain the event architecture"</li>
        </ul>
    </div>
</wb-demo>

<script type="module" src="/components/wb-rag/wb-rag.js"></script>
<script type="module" src="/components/wb-demo/wb-demo.js"></script>
```

### With Configuration

```html
<wb-rag 
    api-key="your-key"
    knowledge-base-url="/knowledge-base.json"
    api-endpoint="/api/claude">
</wb-rag>
```

### Standalone Demo Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WB RAG Assistant</title>
    <style>
        body { margin: 0; padding: 0; }
        wb-rag { display: block; width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <wb-rag></wb-rag>
    <script type="module" src="./wb-rag.js"></script>
</body>
</html>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-key` | String | `''` | Anthropic API key (optional if using server) |
| `knowledge-base-url` | String | `/knowledge-base.json` | URL to knowledge base JSON file |
| `api-endpoint` | String | `/api/claude` | Backend API endpoint for Claude |

## Events

### wb-rag-ready
Fired when knowledge base is loaded and ready.

```javascript
ragComponent.addEventListener('wb-rag-ready', (e) => {
    console.log('Knowledge base loaded:', e.detail.metadata);
});
```

**Detail:**
- `metadata` - Knowledge base metadata (totalDocs, totalComponents, etc.)

### wb-rag-search
Fired when a search is performed.

```javascript
ragComponent.addEventListener('wb-rag-search', (e) => {
    console.log('Search query:', e.detail.query);
    console.log('Results:', e.detail.results);
});
```

**Detail:**
- `query` - User's search query
- `results` - Array of search results with scores

### wb-rag-response
Fired when Claude responds.

```javascript
ragComponent.addEventListener('wb-rag-response', (e) => {
    console.log('Response:', e.detail.response);
    console.log('Sources:', e.detail.sources);
});
```

**Detail:**
- `response` - Claude's response text
- `sources` - Array of source documents used

### wb-rag-error
Fired on errors.

```javascript
ragComponent.addEventListener('wb-rag-error', (e) => {
    console.error('Error:', e.detail.error);
});
```

**Detail:**
- `error` - Error message

## Methods

### sendMessage(message)
Programmatically send a message to the assistant.

```javascript
const rag = document.querySelector('wb-rag');
rag.sendMessage('How do I use wb-button?');
```

### loadKnowledgeBase()
Reload the knowledge base.

```javascript
const rag = document.querySelector('wb-rag');
await rag.loadKnowledgeBase();
```

## Properties

### knowledgeBase
Get the loaded knowledge base object.

```javascript
const rag = document.querySelector('wb-rag');
console.log(rag.knowledgeBase);
```

### messages
Get all chat messages.

```javascript
const rag = document.querySelector('wb-rag');
console.log(rag.messages);
```

### loading
Check if currently processing a request.

```javascript
const rag = document.querySelector('wb-rag');
if (rag.loading) {
    console.log('Processing...');
}
```

## Architecture

The component implements a complete 4-step RAG system:

### Step 1: Knowledge Base
Uses `build-knowledge-base.js` to index all documentation and components.

### Step 2: Smart Search
`RAGSearchEngine` class performs:
- Query tokenization
- Relevance scoring
- Result ranking
- Context building

### Step 3: Claude Integration
Sends context-aware prompts to Claude API via backend proxy.

### Step 4: UI Rendering
Shadow DOM-based chat interface with:
- Message bubbles
- Loading states
- Source citations
- Markdown rendering

## Setup Requirements

### 1. Build Knowledge Base
```bash
npm run build:kb
```

### 2. Start RAG Server
```bash
npm run rag:server
```

### 3. Set API Key
Set system environment variable:
```
CLAUDE_API_KEY=your-key-here
```

Or create `.env` file:
```
ANTHROPIC_API_KEY=your-key-here
```

## Styling

The component uses Shadow DOM and includes all styles internally. The design features:
- Glassmorphic UI elements
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Dark theme optimized

## Example Questions

Try asking:
- "How do I use wb-button?"
- "What color themes are available?"
- "Show me a navigation example"
- "Explain the event architecture"
- "What are the best practices?"

## Integration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App with RAG</title>
</head>
<body>
    <div class="app">
        <header>
            <h1>WB Framework Documentation</h1>
        </header>
        
        <main>
            <wb-rag id="assistant"></wb-rag>
        </main>
    </div>

    <script type="module" src="/components/wb-rag/wb-rag.js"></script>
    <script>
        const rag = document.getElementById('assistant');
        
        // Listen for events
        rag.addEventListener('wb-rag-ready', (e) => {
            console.log('Assistant ready!', e.detail);
        });
        
        rag.addEventListener('wb-rag-response', (e) => {
            // Track analytics, log responses, etc.
            console.log('Got response:', e.detail.response);
        });
    </script>
</body>
</html>
```

## Dependencies

- **Backend**: Express server (`rag-server.js`)
- **AI**: Anthropic Claude API
- **Knowledge Base**: Generated JSON file

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Supports all modern browsers with Custom Elements v1

## License

Part of the WB Framework component library.
