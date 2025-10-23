import React, { useState, useRef, useEffect } from 'react';
import { Send, Book, Code, Lightbulb, FileText, Loader } from 'lucide-react';

// Knowledge base - embedded documentation chunks
const knowledgeBase = [
  {
    id: 'overview',
    category: 'overview',
    title: 'WB Framework Overview',
    content: `WB is a comprehensive web development framework featuring 41+ custom web components, wave-based color harmony, and reactive architecture. All components are prefixed with 'wb-' (wb-nav, wb-color-harmony, wb-control-panel, etc.). The framework uses ES6 modules only, WebSockets for backend communication, and follows CSS-first architecture.`,
    keywords: ['overview', 'introduction', 'what is', 'framework', 'components', 'web components']
  },
  {
    id: 'architecture',
    category: 'architecture',
    title: 'Architecture Standards',
    content: `WB follows strict architectural patterns: All components extend WBBaseComponent (not HTMLElement), ES6 modules only (no CommonJS), CSS-first with external stylesheets (no inline styles), reactive event-driven patterns, Shadow DOM where needed for encapsulation, and component-specific documentation in claude.md files.`,
    keywords: ['architecture', 'standards', 'patterns', 'base component', 'inheritance', 'reactive']
  },
  {
    id: 'color-system',
    category: 'color',
    title: 'Wave-Based Color Harmony System',
    content: `The Harmonic Color System (HCS) provides mathematically harmonious colors using wave theory. Traditional modes include Complementary, Analogous, Triadic, Split-Complementary, and Monochromatic. Wave-based modes include Phase Modulation (PM), Frequency Modulation (FM), Amplitude Modulation (AM), Beat Patterns, and Doppler Shift. The system generates 15 color variations: Primary, Secondary, Accent, Highlight plus 11 angle variations.`,
    keywords: ['color', 'harmony', 'wave', 'hcs', 'complementary', 'analogous', 'triadic', 'modulation']
  },
  {
    id: 'component-structure',
    category: 'components',
    title: 'Component Structure',
    content: `Each WB component includes: JavaScript file (.js), CSS file with external styles, demo.html for interactive examples, claude.md for development notes and issues, and schema.json for configuration. Components must extend WBBaseComponent to get logging, events, and theme handling automatically.`,
    keywords: ['component', 'structure', 'files', 'css', 'demo', 'schema']
  },
  {
    id: 'wb-base',
    category: 'components',
    title: 'WBBaseComponent',
    content: `WBBaseComponent is the foundation class for all WB components. It provides automatic logging, custom event handling with 'wb:' prefix, theme change detection, lifecycle management, and error boundaries. All new components must extend WBBaseComponent instead of HTMLElement to maintain consistency and get base functionality.`,
    keywords: ['wb-base', 'base component', 'extend', 'inheritance', 'foundation']
  },
  {
    id: 'wb-nav',
    category: 'components',
    title: 'wb-nav Component',
    content: `wb-nav is a flexible navigation component supporting vertical and horizontal layouts. Usage: <wb-nav layout="vertical" items='[{"text": "Home", "id": "home"}]'></wb-nav>. Emits custom 'wb:nav-click' events and supports dynamic item updates.`,
    keywords: ['wb-nav', 'navigation', 'menu', 'vertical', 'horizontal']
  },
  {
    id: 'wb-color-harmony',
    category: 'components',
    title: 'wb-color-harmony Component',
    content: `wb-color-harmony generates harmonious color palettes using wave theory. Usage: <wb-color-harmony mode="complementary" base-hue="240"></wb-color-harmony>. Supports modes: complementary, analogous, triadic, split-complementary, monochromatic, pm, fm, am. Emits 'wb:colors-generated' event with palette data.`,
    keywords: ['wb-color-harmony', 'colors', 'palette', 'harmony', 'wave']
  },
  {
    id: 'wb-control-panel',
    category: 'components',
    title: 'wb-control-panel Component',
    content: `wb-control-panel provides a comprehensive interface for the Harmonic Color System. It includes theme switching (dark/light), color mode selection, hue adjustment, and real-time preview. Usage: <wb-control-panel></wb-control-panel>. Automatically syncs with CSS variables for live theme updates.`,
    keywords: ['wb-control-panel', 'control', 'panel', 'theme', 'settings']
  },
  {
    id: 'wb-button',
    category: 'components',
    title: 'wb-button Component',
    content: `wb-button is a styled button component with variant support. Usage: <wb-button variant="primary" size="medium">Click Me</wb-button>. Supports variants: primary, secondary, accent, danger. Sizes: small, medium, large. Emits standard click events.`,
    keywords: ['wb-button', 'button', 'click', 'primary', 'secondary']
  },
  {
    id: 'wb-input',
    category: 'components',
    title: 'wb-input Component',
    content: `wb-input is an enhanced input field with validation and theming. Usage: <wb-input type="text" placeholder="Enter text" required></wb-input>. Supports types: text, number, email, password. Emits 'wb:input-change' and 'wb:input-blur' events. Includes built-in validation states.`,
    keywords: ['wb-input', 'input', 'form', 'text', 'validation']
  },
  {
    id: 'wb-modal',
    category: 'components',
    title: 'wb-modal Component',
    content: `wb-modal creates accessible modal dialogs. Usage: <wb-modal id="myModal"><h2>Title</h2><p>Content</p></wb-modal>. Control via JavaScript: document.getElementById('myModal').show() and .hide(). Includes backdrop, escape key handling, and focus trap.`,
    keywords: ['wb-modal', 'modal', 'dialog', 'popup', 'overlay']
  },
  {
    id: 'creating-component',
    category: 'howto',
    title: 'Creating a New Component',
    content: `To create a new WB component: 1) Create folder in /components/wb-name/, 2) Create wb-name.js extending WBBaseComponent, 3) Create wb-name.css for styles, 4) Create demo.html with examples, 5) Create claude.md for documentation, 6) Create schema.json for configuration, 7) Register in component manifest, 8) Add Playwright tests. Always extend WBBaseComponent, never HTMLElement.`,
    keywords: ['create', 'new', 'component', 'how to', 'tutorial', 'guide']
  },
  {
    id: 'events',
    category: 'patterns',
    title: 'Event System',
    content: `WB uses custom events with 'wb:' prefix for all component communication. Example: this.dispatchEvent(new CustomEvent('wb:button-click', {detail: {value}, bubbles: true})); Listen with: element.addEventListener('wb:button-click', handler); Events bubble by default for easier delegation.`,
    keywords: ['events', 'custom events', 'dispatch', 'listen', 'bubbles']
  },
  {
    id: 'styling',
    category: 'patterns',
    title: 'Styling Approach',
    content: `WB uses CSS-first architecture with external stylesheets. Never use inline styles. Components link to external CSS files. Use CSS variables from main.css for theming. HCS provides 15 color variations via CSS variables like --hcs-primary, --hcs-secondary, --hcs-accent. Supports dark and light themes via data-theme attribute on body.`,
    keywords: ['css', 'styling', 'styles', 'themes', 'variables', 'dark mode', 'light mode']
  },
  {
    id: 'testing',
    category: 'testing',
    title: 'Testing Standards',
    content: `WB uses Playwright for end-to-end testing. Tests are in /tests/ folder organized by component. Run tests with: npm test. Write tests for: component rendering, event firing, attribute changes, theme switching, user interactions. All tests must pass before deployment. Use data-testid attributes for reliable selectors.`,
    keywords: ['testing', 'playwright', 'tests', 'e2e', 'quality']
  },
  {
    id: 'project-structure',
    category: 'overview',
    title: 'Project Structure',
    content: `Key directories: /components/ contains all 41 WB components, /docs/ contains comprehensive documentation, /styles/ has global CSS and themes, /html/ includes demo pages and articles, /tests/ contains Playwright test suites, /build/ has build scripts and tools. Main files: index.html (entry point), wb.js (main app), package.json (dependencies).`,
    keywords: ['structure', 'folders', 'directories', 'organization', 'files']
  },
  {
    id: 'getting-started',
    category: 'howto',
    title: 'Getting Started',
    content: `Quick start: 1) Clone repository, 2) Run 'npm install' to install dependencies, 3) Run 'npm run dev' to start development server, 4) Open browser to localhost:8080, 5) Explore demo pages in /html/ folder. Read docs/README.md for navigation guide. Check docs/status/currentstatus.md for project status.`,
    keywords: ['getting started', 'quick start', 'install', 'setup', 'begin']
  },
  {
    id: 'code-sample-basic',
    category: 'examples',
    title: 'Basic Component Usage Example',
    content: `Example HTML page using WB components:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body data-theme="dark">
    <wb-nav layout="vertical" items='[
        {"text": "Home", "id": "home"},
        {"text": "About", "id": "about"}
    ]'></wb-nav>
    
    <wb-color-harmony mode="complementary" base-hue="240"></wb-color-harmony>
    
    <script src="/components/wb-nav/wb-nav.js"></script>
    <script src="/components/wb-color-harmony/wb-color-harmony.js"></script>
</body>
</html>`,
    keywords: ['example', 'sample', 'code', 'usage', 'demo', 'html']
  },
  {
    id: 'code-sample-component',
    category: 'examples',
    title: 'Creating a Component Example',
    content: `Example of creating a simple WB component:

**File: wb-counter.js**
\`\`\`javascript
class WBCounter extends HTMLElement {
    constructor() {
        super();
        this.count = 0;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = '<div class="wb-counter"><button data-action="decrement">-</button><span class="count">' + this.count + '</span><button data-action="increment">+</button></div>';
    }

    attachEventListeners() {
        this.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'increment') this.count++;
                if (action === 'decrement') this.count--;
                this.render();
                this.dispatchEvent(new CustomEvent('wb:count-change', {
                    detail: { count: this.count },
                    bubbles: true
                }));
            });
        });
    }
}

customElements.define('wb-counter', WBCounter);
\`\`\`

**Usage in HTML:**
\`\`\`html
<wb-counter></wb-counter>
<script src="wb-counter.js"></script>
\`\`\``,
    keywords: ['component', 'example', 'create', 'code', 'javascript', 'class']
  },
  {
    id: 'code-sample-events',
    category: 'examples',
    title: 'Event Handling Example',
    content: `Example of using WB component events:
// HTML
<wb-button id="myBtn">Click Me</wb-button>
<wb-modal id="myModal">
    <h2>Hello!</h2>
    <p>Button was clicked</p>
</wb-modal>

// JavaScript
const button = document.getElementById('myBtn');
const modal = document.getElementById('myModal');

button.addEventListener('click', () => {
    modal.show();
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('wb:button-clicked', {
        detail: { timestamp: Date.now() },
        bubbles: true
    }));
});

// Listen for any wb: events
document.addEventListener('wb:button-clicked', (e) => {
    console.log('Button clicked at:', e.detail.timestamp);
});`,
    keywords: ['events', 'example', 'code', 'listen', 'dispatch', 'custom']
  },
  {
    id: 'code-sample-color',
    category: 'examples',
    title: 'Color Harmony JavaScript Example',
    content: `Example of using the color harmony system programmatically:
// Initialize color harmony
const harmony = document.querySelector('wb-color-harmony');

// Set properties
harmony.setAttribute('mode', 'complementary');
harmony.setAttribute('base-hue', '240');

// Listen for color generation
harmony.addEventListener('wb:colors-generated', (e) => {
    const colors = e.detail.colors;
    console.log('Primary:', colors.primary);
    console.log('Secondary:', colors.secondary);
    console.log('Accent:', colors.accent);
    
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--custom-primary', colors.primary);
});

// Programmatically change mode
function switchToTriadic() {
    harmony.setAttribute('mode', 'triadic');
    // Component will auto-regenerate colors
}`,
    keywords: ['color', 'harmony', 'javascript', 'example', 'code', 'api']
  }
];

const WBFrameworkAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your WB Framework AI Assistant. I can help you with:\n\n📚 **Documentation** - Learn about components and architecture\n💻 **Code Examples** - Get working code samples\n🎨 **Color System** - Wave-based harmony system\n⚡ **How-to Guides** - Create components, handle events\n\nWhat would you like to know about the WB Framework?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert markdown to HTML
  const markdownToHtml = (markdown) => {
    let html = markdown;
    
    // Code blocks with language
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre style="background:#1e1e2e;padding:15px;borderRadius:8px;overflow-x:auto;margin:10px 0;border:1px solid #3f3f46"><code style="color:#e4e4e7;fontSize:14px;fontFamily:monospace">${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 6px;borderRadius:4px;fontSize:14px;color:#a78bfa">$1</code>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#a78bfa">$1</strong>');
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;fontSize:18px;marginTop:15px;marginBottom:8px">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="color:#a78bfa;fontSize:20px;marginTop:15px;marginBottom:8px">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="color:#a78bfa;fontSize:24px;marginTop:15px;marginBottom:8px">$1</h1>');
    
    // Bullet lists
    html = html.replace(/^\- (.+)$/gm, '<li style="marginLeft:20px;marginBottom:5px">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul style="marginTop:8px;marginBottom:8px">$1</ul>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" style="color:#667eea;textDecoration:underline" target="_blank">$1</a>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');
    
    return html;
  };

  // Simple keyword-based search through knowledge base
  const searchKnowledge = (query) => {
    const lowerQuery = query.toLowerCase();
    const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);
    
    const scored = knowledgeBase.map(doc => {
      let score = 0;
      
      // Check keywords
      doc.keywords.forEach(keyword => {
        if (tokens.some(token => keyword.includes(token) || token.includes(keyword))) {
          score += 5;
        }
      });
      
      // Check title
      if (tokens.some(token => doc.title.toLowerCase().includes(token))) {
        score += 3;
      }
      
      // Check content
      tokens.forEach(token => {
        const regex = new RegExp(token, 'gi');
        const matches = (doc.content.match(regex) || []).length;
        score += matches;
      });
      
      return { ...doc, score };
    });
    
    return scored
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const generateResponse = async (userQuery) => {
    // Search knowledge base
    const relevantDocs = searchKnowledge(userQuery);
    
    if (relevantDocs.length === 0) {
      return "I couldn't find specific information about that in the WB Framework documentation. Could you rephrase your question or ask about:\n\n- Component structure and usage\n- Color harmony system\n- How to create components\n- Event handling\n- Testing standards\n- Getting started";
    }

    // Build context from relevant docs
    const context = relevantDocs.map(doc => doc.content).join('\n\n');
    
    // Use Claude API to generate response
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `You are an expert on the WB Framework, a web component framework. Answer the following question using ONLY the provided documentation context. If code examples are relevant, include them. Be specific and practical.

CONTEXT FROM WB DOCUMENTATION:
${context}

USER QUESTION: ${userQuery}

Provide a clear, helpful answer based solely on the context above. If the question asks for code, provide working WB Framework code examples. Format your response in markdown.`
            }
          ]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback: return the most relevant doc
      const topDoc = relevantDocs[0];
      return `**${topDoc.title}**\n\n${topDoc.content}\n\n${
        relevantDocs.length > 1 
          ? `\n\n**Related Topics:**\n${relevantDocs.slice(1).map(d => `- ${d.title}`).join('\n')}`
          : ''
      }`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    { icon: <Book size={16} />, text: "How do I create a new component?", category: "howto" },
    { icon: <Code size={16} />, text: "Show me a button component example", category: "examples" },
    { icon: <Lightbulb size={16} />, text: "What is the color harmony system?", category: "color" },
    { icon: <FileText size={16} />, text: "How do events work in WB?", category: "patterns" }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 30, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Code size={28} />
          WB Framework AI Assistant
        </h1>
        <p style={{ 
          margin: '5px 0 0 0', 
          color: '#a1a1aa',
          fontSize: '14px'
        }}>
          41+ Components • Wave-Based Colors • Reactive Architecture
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '15px 20px',
              borderRadius: msg.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #a78bfa 100%)'
                : 'rgba(30, 30, 46, 0.95)',
              color: msg.role === 'user' ? 'white' : '#e4e4e7',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              whiteSpace: 'pre-wrap',
              fontSize: '15px',
              lineHeight: '1.6'
            }}>
              <div dangerouslySetInnerHTML={{ 
                __html: markdownToHtml(msg.content)
              }} />
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '15px 20px',
              borderRadius: '20px 20px 20px 5px',
              background: 'rgba(30, 30, 46, 0.95)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Loader size={16} className="animate-spin" />
              <span style={{ color: '#a1a1aa' }}>Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions (only show at start) */}
      {messages.length === 1 && (
        <div style={{
          padding: '0 20px 20px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(q.text);
                setTimeout(handleSend, 100);
              }}
              style={{
                background: 'rgba(30, 30, 46, 0.95)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#a78bfa',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 139, 250, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              {q.icon}
              {q.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '20px',
        background: 'rgba(30, 30, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about WB components, color system, or how to get started..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '15px 20px',
              fontSize: '15px',
              border: '2px solid #3f3f46',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s',
              background: '#27272a',
              color: '#e4e4e7'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '15px 25px',
              background: loading || !input.trim() 
                ? '#3f3f46' 
                : 'linear-gradient(135deg, #667eea 0%, #a78bfa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: loading || !input.trim() 
                ? 'none' 
                : '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = loading || !input.trim() 
                ? 'none' 
                : '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WBFrameworkAssistant;