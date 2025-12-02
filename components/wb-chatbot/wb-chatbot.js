// @ts-nocheck
/**
 * WB Chatbot Web Component v3.0
 * 
 * Documentation-aware chatbot with:
 * - Smart search (partial matches, topics)
 * - Context memory
 * - Inline content viewing (JS, CSS, Docs rendered in chat)
 * - All clickable links load content in chatbot
 * 
 * @version 3.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

console.log('💬 WB Chatbot v3.0: Starting...');

const fallbackConfig = {
    component: { name: 'wb-chatbot', version: '3.0.0' },
    classes: {
        base: 'wb-chatbot',
        header: 'wb-chatbot__header',
        messages: 'wb-chatbot__messages',
        message: 'wb-chatbot__message',
        messageUser: 'wb-chatbot__message--user',
        messageBot: 'wb-chatbot__message--bot',
        input: 'wb-chatbot__input',
        inputField: 'wb-chatbot__input-field',
        sendBtn: 'wb-chatbot__send-btn'
    },
    defaults: { 
        title: 'WB Assistant',
        placeholder: 'Search components or ask a question...'
    },
    events: { 
        ready: 'wb-chatbot:ready', 
        message: 'wb-chatbot:message' 
    }
};

// All components with metadata for better search
const componentData = {
    'wb-button': { 
        keywords: ['button', 'btn', 'click', 'action', 'submit'],
        category: 'UI',
        description: 'Interactive button with variants, sizes, and states'
    },
    'wb-card': { 
        keywords: ['card', 'container', 'box', 'panel'],
        category: 'UI',
        description: 'Content container with header, body, and footer slots'
    },
    'wb-input': { 
        keywords: ['input', 'text', 'field', 'form', 'textbox'],
        category: 'UI',
        description: 'Text input field with validation and styling'
    },
    'wb-select': { 
        keywords: ['select', 'dropdown', 'choice', 'picker', 'option'],
        category: 'UI',
        description: 'Dropdown selection component'
    },
    'wb-slider': { 
        keywords: ['slider', 'range', 'value', 'drag'],
        category: 'UI',
        description: 'Range slider for numeric value selection'
    },
    'wb-toggle': { 
        keywords: ['toggle', 'switch', 'on', 'off', 'boolean'],
        category: 'UI',
        description: 'On/off toggle switch'
    },
    'wb-search': { 
        keywords: ['search', 'find', 'filter', 'query'],
        category: 'UI',
        description: 'Search input with suggestions'
    },
    'wb-modal': { 
        keywords: ['modal', 'dialog', 'popup', 'overlay', 'window'],
        category: 'Overlay',
        description: 'Modal dialog overlay'
    },
    'wb-tab': { 
        keywords: ['tab', 'tabs', 'panel', 'switch'],
        category: 'Layout',
        description: 'Tabbed content panels'
    },
    'wb-table': { 
        keywords: ['table', 'data', 'grid', 'rows', 'columns'],
        category: 'Data',
        description: 'Data table with sorting and filtering'
    },
    'wb-nav': { 
        keywords: ['nav', 'navigation', 'menu', 'links', 'header'],
        category: 'Layout',
        description: 'Navigation bar component'
    },
    'wb-footer': { 
        keywords: ['footer', 'bottom', 'copyright'],
        category: 'Layout',
        description: 'Page footer component'
    },
    'wb-grid': { 
        keywords: ['grid', 'layout', 'columns', 'responsive'],
        category: 'Layout',
        description: 'CSS Grid layout wrapper'
    },
    'wb-layout': { 
        keywords: ['layout', 'page', 'structure', 'template'],
        category: 'Layout',
        description: 'Page layout templates'
    },
    'wb-viewport': { 
        keywords: ['viewport', 'responsive', 'breakpoint', 'screen'],
        category: 'Layout',
        description: 'Viewport-aware responsive container'
    },
    'wb-color-bar': { 
        keywords: ['color', 'bar', 'palette', 'swatch', 'hue'],
        category: 'Color',
        description: 'Single color display bar'
    },
    'wb-color-bars': { 
        keywords: ['color', 'bars', 'palette', 'harmony', 'scheme'],
        category: 'Color',
        description: 'Multiple color bars for palettes'
    },
    'wb-color-harmony': { 
        keywords: ['color', 'harmony', 'complementary', 'triadic', 'analogous', 'hcs', 'wave'],
        category: 'Color',
        description: 'Color harmony generator using wave theory'
    },
    'wb-color-picker': { 
        keywords: ['color', 'picker', 'select', 'choose', 'hex', 'rgb'],
        category: 'Color',
        description: 'Interactive color picker'
    },
    'wb-control-panel': { 
        keywords: ['control', 'panel', 'settings', 'config', 'color', 'hcs'],
        category: 'Color',
        description: 'HCS control panel for color system settings'
    },
    'wb-demo': { 
        keywords: ['demo', 'example', 'showcase', 'documentation'],
        category: 'Dev',
        description: 'Component demo wrapper with docs tabs'
    },
    'wb-event-log': { 
        keywords: ['event', 'log', 'debug', 'console', 'trace'],
        category: 'Dev',
        description: 'Event logging and debugging tool'
    },
    'wb-status': { 
        keywords: ['status', 'state', 'indicator', 'badge'],
        category: 'Dev',
        description: 'Status indicator component'
    },
    'wb-chatbot': { 
        keywords: ['chat', 'bot', 'assistant', 'help', 'ai'],
        category: 'Dev',
        description: 'This documentation chatbot'
    },
    'wb-base': { 
        keywords: ['base', 'component', 'core', 'extend'],
        category: 'Core',
        description: 'Base class for all WB components'
    },
    'wb-theme': { 
        keywords: ['theme', 'dark', 'light', 'style', 'css'],
        category: 'Core',
        description: 'Theme management component'
    }
};

// Topic aliases for better search
const topicAliases = {
    'colors': ['wb-color-bar', 'wb-color-bars', 'wb-color-harmony', 'wb-color-picker', 'wb-control-panel'],
    'color': ['wb-color-bar', 'wb-color-bars', 'wb-color-harmony', 'wb-color-picker', 'wb-control-panel'],
    'hcs': ['wb-color-harmony', 'wb-control-panel', 'wb-color-bars'],
    'forms': ['wb-input', 'wb-select', 'wb-toggle', 'wb-button'],
    'form': ['wb-input', 'wb-select', 'wb-toggle', 'wb-button'],
    'inputs': ['wb-input', 'wb-select', 'wb-slider', 'wb-toggle'],
    'layout': ['wb-grid', 'wb-layout', 'wb-viewport', 'wb-nav', 'wb-footer'],
    'navigation': ['wb-nav', 'wb-tab', 'wb-footer']
};

const componentList = Object.keys(componentData);
const docsCache = new Map();

class WBChatbot extends WBBaseComponent {
    constructor() {
        super();
        this.config = fallbackConfig;
        this.messages = [];
        this._title = this.config.defaults.title;
        this._initialized = false;
        this._context = {
            currentComponent: null,
            lastQuery: null,
            history: []
        };
    }

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        super.connectedCallback();
        this._render();
        this._addWelcomeMessage();
        this.dispatchEvent(new CustomEvent(this.config.events.ready, { bubbles: true, detail: { component: this } }));
    }

    _render() {
        if (!this.shadowRoot) return;
        const cssUrl = new URL('./wb-chatbot.css', import.meta.url).href;
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${cssUrl}">
            <div class="${this.config.classes.base}">
                <div class="${this.config.classes.header}">
                    <span class="header-icon">💬</span>
                    <span class="header-title">${this._title}</span>
                </div>
                <div class="${this.config.classes.messages}" id="messages"></div>
                <div class="${this.config.classes.input}">
                    <input type="text" class="${this.config.classes.inputField}" placeholder="${this.config.defaults.placeholder}" id="input-field" />
                    <button class="${this.config.classes.sendBtn}" id="send-btn">Send</button>
                </div>
            </div>
        `;
        
        this._attachEventListeners();
    }

    _attachEventListeners() {
        const inputField = this.shadowRoot.getElementById('input-field');
        const sendBtn = this.shadowRoot.getElementById('send-btn');
        
        sendBtn?.addEventListener('click', () => this._handleSend());
        inputField?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this._handleSend(); });
        
        // Handle link clicks
        this.shadowRoot.addEventListener('click', async (e) => {
            const link = e.target.closest('a');
            if (link?.href) {
                e.preventDefault();
                const url = new URL(link.href);
                const path = url.pathname;
                
                // Extract component name from path
                const pathParts = path.split('/');
                const compIndex = pathParts.findIndex(p => p.startsWith('wb-'));
                if (compIndex !== -1) {
                    this._context.currentComponent = pathParts[compIndex];
                }
                
                // .md files - load and display as formatted docs
                if (path.endsWith('.md')) {
                    await this._loadAndDisplayMarkdown(path);
                }
                // Demo and other HTML - navigate
                else {
                    window.location.href = link.href;
                }
            }
        });
    }

    async _loadAndDisplayFile(path, language) {
        this._showLoading(true);
        
        try {
            const resp = await fetch(path);
            if (!resp.ok) throw new Error(`Failed to load ${path}`);
            
            let content = await resp.text();
            const fileName = path.split('/').pop();
            const componentName = path.split('/')[2] || 'unknown';
            
            // Truncate if too long
            const maxLines = 150;
            const lines = content.split('\n');
            let truncated = false;
            if (lines.length > maxLines) {
                content = lines.slice(0, maxLines).join('\n');
                truncated = true;
            }
            
            let response = `**📄 ${fileName}**\n\n`;
            response += `📁 \`${path}\`\n\n`;
            response += `\`\`\`${language}\n${content}\n\`\`\``;
            
            if (truncated) {
                response += `\n\n⚠️ _Showing first ${maxLines} lines. [Open full file](${path})_`;
            }
            
            response += `\n\n---\n**🔗 Related:** `;
            response += `[Demo](/components/${componentName}/${componentName}-demo.html) • `;
            response += `[Docs](/components/${componentName}/${componentName}.md)`;
            
            this._showLoading(false);
            this.messages.push({ role: 'bot', content: response });
            this._renderMessages();
            
            // Set context
            this._context.currentComponent = componentName;
            
        } catch (error) {
            this._showLoading(false);
            this.messages.push({ role: 'bot', content: `❌ Error loading file: ${error.message}` });
            this._renderMessages();
        }
    }

    async _loadAndDisplayMarkdown(path) {
        this._showLoading(true);
        
        try {
            const resp = await fetch(path);
            if (!resp.ok) throw new Error(`Failed to load ${path}`);
            
            const markdown = await resp.text();
            const fileName = path.split('/').pop();
            const componentName = path.split('/')[2] || 'unknown';
            
            // Parse markdown to HTML
            let html = this._parseMarkdownToHtml(markdown);
            
            // Truncate if too long
            if (html.length > 8000) {
                html = html.substring(0, 8000) + '...';
            }
            
            let response = `**📖 ${fileName}**\n\n`;
            response += `📁 \`${path}\`\n\n---\n\n`;
            response += html;
            
            response += `\n\n---\n**🔗 Related:** `;
            response += `[Demo](/components/${componentName}/${componentName}-demo.html) • `;
            response += `[JS Source](/components/${componentName}/${componentName}.js) • `;
            response += `[CSS](/components/${componentName}/${componentName}.css)`;
            
            this._showLoading(false);
            this.messages.push({ role: 'bot', content: response, isHtml: true });
            this._renderMessages();
            
            // Set context
            this._context.currentComponent = componentName;
            
        } catch (error) {
            this._showLoading(false);
            this.messages.push({ role: 'bot', content: `❌ Error loading documentation: ${error.message}` });
            this._renderMessages();
        }
    }

    _parseMarkdownToHtml(md) {
        // Convert markdown to HTML
        return md
            // Code blocks first
            .replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
                const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `<pre class="code-block" data-lang="${lang}"><code>${escaped}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/^#### (.+)$/gm, '<h5>$1</h5>')
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            // Bold and italic
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // Tables
            .replace(/^\|(.+)\|$/gm, (m, row) => {
                const cells = row.split('|').map(c => c.trim());
                return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
            })
            // Lists
            .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    _addWelcomeMessage() {
        this.messages.push({
            role: 'bot',
            content: `👋 **Welcome to the WB Framework Assistant!**

**🔍 Search** (click any):
• [button](/components/wb-button/wb-button-demo.html)
• [color](/components/wb-color-harmony/wb-color-harmony-demo.html) - all 5 color components
• [modal](/components/wb-modal/wb-modal-demo.html)
• [slider](/components/wb-slider/wb-slider-demo.html)
• [form](/components/wb-input/wb-input-demo.html) - input, select, toggle

**📖 After finding a component, say:**
• "html" - code examples
• "css" - styles
• "attributes" - options
• "events" - what it fires
• "theory" - how it works

**📚 Learn concepts:**
• [Glossary](/docs/GLOSSARY.md) - Shadow DOM, CSS Variables, Slots, etc.
• [list] - all components`
        });
        this._renderMessages();
    }

    async _handleSend() {
        const inputField = this.shadowRoot.getElementById('input-field');
        if (!inputField) return;
        
        const message = inputField.value.trim();
        if (!message) return;
        
        this.messages.push({ role: 'user', content: message });
        inputField.value = '';
        this._renderMessages();
        
        this._showLoading(true);
        const response = await this._getBotResponse(message);
        this._showLoading(false);
        
        this.messages.push({ role: 'bot', content: response });
        this._renderMessages();
        
        this.dispatchEvent(new CustomEvent(this.config.events.message, { 
            bubbles: true, 
            detail: { message, response } 
        }));
    }

    _showLoading(show) {
        const container = this.shadowRoot.getElementById('messages');
        if (!container) return;
        
        const existing = container.querySelector('.loading-indicator');
        if (existing) existing.remove();
        
        if (show) {
            const loading = document.createElement('div');
            loading.className = 'loading-indicator wb-chatbot__message wb-chatbot__message--bot';
            loading.innerHTML = '⏳ Loading...';
            container.appendChild(loading);
            container.scrollTop = container.scrollHeight;
        }
    }

    async _getBotResponse(message) {
        const lower = message.toLowerCase().trim();
        this._context.lastQuery = lower;
        this._context.history.push(lower);
        if (this._context.history.length > 10) this._context.history.shift();
        
        // 1. Check for context-based follow-up (attributes, events, etc.)
        if (this._context.currentComponent) {
            const followUp = await this._checkFollowUp(lower);
            if (followUp) return followUp;
        }
        
        // 2. Search for components (by name, keyword, or topic)
        const searchResults = this._searchComponents(lower);
        if (searchResults.length > 0) {
            this._context.currentComponent = searchResults[0];
            return await this._getSearchResults(searchResults, lower);
        }
        
        // 3. Check for glossary terms
        if (lower.match(/\b(shadow\s*dom|slot|css\s*variable|custom\s*prop|web\s*component|hcs|harmonic|bem|signal|reactive|import\.meta)\b/i)) {
            return this._getGlossaryResponse(lower);
        }
        
        // 4. Check for general questions
        if (lower.includes('list') || lower.includes('all')) return this._getComponentList();
        if (lower.includes('help')) return this._getHelpMessage();
        if (lower.includes('hello') || lower.includes('hi') || lower === 'hey') {
            return 'Hello! 👋 Type any word to search components. Try: **button**, **color**, **modal**, **form**';
        }
        
        // 4. Default helpful response
        return this._getNotFoundResponse(lower);
    }

    async _checkFollowUp(query) {
        const comp = this._context.currentComponent;
        const basePath = `/components/${comp}`;
        
        // Load docs once for all section requests
        const docs = await this._loadComponentDocs(comp);
        
        // Section requests - extract from well-structured docs
        if (query.match(/\b(source|js|javascript|code)\b/) && !query.includes('css')) {
            return this._extractDocSection(docs, comp, 'javascript');
        }
        if (query.match(/\b(stylesheet|styles)\b/) || query === 'css') {
            return this._extractDocSection(docs, comp, 'css');
        }
        if (query.match(/\b(html|markup|template|example|usage)\b/)) {
            return this._extractDocSection(docs, comp, 'html');
        }
        if (query.match(/\b(attribute|option|config|prop)\b/)) {
            return this._extractDocSection(docs, comp, 'attributes');
        }
        if (query.match(/\b(event|emit|fire|dispatch)\b/)) {
            return this._extractDocSection(docs, comp, 'events');
        }
        if (query.match(/\b(variable|custom\s*prop|theming)\b/)) {
            return this._extractDocSection(docs, comp, 'cssvars');
        }
        if (query.match(/\b(api|method|function)\b/)) {
            return this._extractDocSection(docs, comp, 'api');
        }
        if (query.match(/\b(theory|how|works|concept|explain)\b/)) {
            return this._extractDocSection(docs, comp, 'theory');
        }
        if (query.match(/\b(related|similar|see also)\b/)) {
            return this._extractDocSection(docs, comp, 'related');
        }
        if (query.match(/\b(file|folder|structure)\b/)) {
            return this._getComponentFiles(comp);
        }
        if (query.match(/\b(demo|preview|try|open)\b/)) {
            return `**${comp} - Demo**\n\n🖥️ [Open Interactive Demo](${basePath}/${comp}-demo.html)\n\n_Click to open the demo page._`;
        }
        if (query.match(/\b(full|all|everything|doc|documentation)\b/)) {
            return this._getFullDocumentation(docs, comp);
        }
        
        return null; // Not a follow-up
    }

    _extractDocSection(docs, comp, section) {
        const basePath = `/components/${comp}`;
        
        if (!docs) {
            return `**${comp}** - No documentation found.\n\n🔗 [View Demo](${basePath}/${comp}-demo.html) • [View Files](${basePath}/)`;
        }
        
        const sectionPatterns = {
            'javascript': {
                patterns: [/## (?:JavaScript Source|Source Code|JS Source)[\s\S]*?```(?:javascript|js)\n([\s\S]*?)```/i, /## (?:JavaScript API|API)[\s\S]*?```(?:javascript|js)\n([\s\S]*?)```/i],
                title: 'JavaScript',
                icon: '📜',
                lang: 'javascript'
            },
            'css': {
                patterns: [/## (?:CSS Source|Styles|Stylesheet)[\s\S]*?```css\n([\s\S]*?)```/i],
                title: 'CSS Styles',
                icon: '🎨',
                lang: 'css'
            },
            'html': {
                patterns: [/## (?:HTML Examples|Examples|Usage|Basic Usage)[\s\S]*?((?:```html[\s\S]*?```[\s\S]*?)+)/i],
                title: 'HTML Examples',
                icon: '📝',
                lang: 'html',
                keepBlock: true
            },
            'attributes': {
                patterns: [/## (?:Attributes|Configuration|Options|Props)[\s\S]*?(?=\n## |$)/i],
                title: 'Attributes',
                icon: '⚙️'
            },
            'events': {
                patterns: [/## Events[\s\S]*?(?=\n## |$)/i],
                title: 'Events',
                icon: '⚡'
            },
            'cssvars': {
                patterns: [/## (?:CSS Variables|CSS Custom Properties)[\s\S]*?(?=\n## |$)/i],
                title: 'CSS Variables',
                icon: '🎨'
            },
            'api': {
                patterns: [/## (?:JavaScript API|API|Methods)[\s\S]*?(?=\n## |$)/i],
                title: 'JavaScript API',
                icon: '🔧'
            },
            'theory': {
                patterns: [/## (?:Theory|How It Works|Concepts|Overview)[\s\S]*?(?=\n## |$)/i],
                title: 'How It Works',
                icon: '💡'
            },
            'related': {
                patterns: [/## (?:Related|See Also|Related Components)[\s\S]*?(?=\n## |$)/i],
                title: 'Related Components',
                icon: '🔗'
            }
        };
        
        const config = sectionPatterns[section];
        if (!config) return null;
        
        for (const pattern of config.patterns) {
            const match = docs.match(pattern);
            if (match) {
                let content = match[1] || match[0];
                
                // If it's a code section, wrap properly
                if (config.lang && !config.keepBlock) {
                    content = `\`\`\`${config.lang}\n${content.trim()}\n\`\`\``;
                }
                
                // Truncate if too long
                if (content.length > 3000) {
                    content = content.substring(0, 3000) + '\n... (truncated)';
                }
                
                let response = `**${config.icon} ${comp} - ${config.title}**\n\n`;
                response += content;
                response += `\n\n---\n🔗 [Demo](${basePath}/${comp}-demo.html) • [Full Docs](${basePath}/${comp}.md)`;
                
                return response;
            }
        }
        
        return `**${comp}** - No ${config.title.toLowerCase()} section found in docs.\n\n🔗 [View Full Docs](${basePath}/${comp}.md) • [View Demo](${basePath}/${comp}-demo.html)`;
    }

    async _getFullDocumentation(docs, comp) {
        const basePath = `/components/${comp}`;
        
        if (!docs) {
            return `**${comp}** - No documentation found.\n\n🔗 [View Demo](${basePath}/${comp}-demo.html)`;
        }
        
        // Return the full markdown, but truncated
        let content = docs;
        if (content.length > 6000) {
            content = content.substring(0, 6000) + '\n\n... (truncated - click link for full docs)';
        }
        
        return content + `\n\n---\n🔗 [View Demo](${basePath}/${comp}-demo.html)`;
    }

    _searchComponents(query) {
        const matches = new Set();
        const words = query.split(/\s+/).filter(w => w.length >= 2);
        
        // Check topic aliases first (colors, forms, etc.)
        for (const [topic, comps] of Object.entries(topicAliases)) {
            if (query.includes(topic)) {
                comps.forEach(c => matches.add(c));
            }
        }
        
        // Search by component name and keywords
        for (const [comp, data] of Object.entries(componentData)) {
            const compName = comp.toLowerCase();
            const shortName = compName.replace('wb-', '');
            
            for (const word of words) {
                // Match component name
                if (compName.includes(word) || shortName.includes(word) || word.includes(shortName)) {
                    matches.add(comp);
                }
                // Match keywords
                if (data.keywords.some(k => k.includes(word) || word.includes(k))) {
                    matches.add(comp);
                }
            }
        }
        
        // Sort by relevance (exact matches first)
        const sorted = Array.from(matches).sort((a, b) => {
            const aName = a.replace('wb-', '');
            const bName = b.replace('wb-', '');
            const aExact = words.some(w => aName === w);
            const bExact = words.some(w => bName === w);
            if (aExact && !bExact) return -1;
            if (bExact && !aExact) return 1;
            return 0;
        });
        
        return sorted;
    }

    async _getSearchResults(components, query) {
        const count = components.length;
        let response = count === 1 
            ? `**🔍 Found: ${components[0]}**\n\n`
            : `**🔍 Found ${count} components:**\n\n`;
        
        for (const name of components) {
            const basePath = `/components/${name}`;
            const data = componentData[name];
            
            response += `---\n\n`;
            response += `### 📦 [${name}](${basePath}/${name}-demo.html)\n\n`;
            response += `${data.description}\n\n`;
            
            response += `**🔗 View:**\n`;
            response += `[🖥️ Demo](${basePath}/${name}-demo.html) • `;
            response += `[📜 JS Source](${basePath}/${name}.js) • `;
            response += `[🎨 CSS](${basePath}/${name}.css) • `;
            response += `[📖 Documentation](${basePath}/${name}.md)\n\n`;
            
            // Load and show key features from docs
            const docs = await this._loadComponentDocs(name);
            if (docs) {
                const features = this._extractFeatures(docs);
                if (features) {
                    response += `**✨ Features:** ${features}\n\n`;
                }
            }
        }
        
        response += `---\n\n`;
        if (count === 1) {
            response += `💡 **Drill down:** "source", "css", "docs", "attributes", "events", "examples"`;
        } else {
            response += `💡 **Tip:** Click any link, or say "tell me about ${components[0]}"`;
        }
        
        return response;
    }

    _extractFeatures(docs) {
        const lines = docs.split('\n');
        const features = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/^## Features/i)) {
                for (let j = i + 1; j < Math.min(lines.length, i + 8); j++) {
                    const match = lines[j].match(/^[-*]\s*\*?\*?(.+?)\*?\*?:?\s*[-–]?\s*(.*)/);
                    if (match) {
                        features.push(match[1].replace(/\*/g, '').trim());
                    }
                    if (lines[j].startsWith('## ') && j > i) break;
                }
                break;
            }
        }
        
        return features.slice(0, 4).join(', ');
    }

    async _getDocs(name, section) {
        const basePath = `/components/${name}`;
        
        const docs = await this._loadComponentDocs(name);
        if (!docs) {
            return `**${name}** - No documentation found.\n\n🔗 [View Demo](${basePath}/${name}-demo.html) • [View Source](${basePath}/${name}.js)`;
        }
        
        const patterns = {
            'attributes': /## (?:Attributes|Configuration|Options|Props)[\s\S]*?(?=\n## |$)/i,
            'events': /## Events[\s\S]*?(?=\n## |$)/i,
            'css': /## (?:CSS|Styling|Custom Properties)[\s\S]*?(?=\n## |$)/i,
            'examples': /## (?:Examples|Usage|Basic Usage)[\s\S]*?(?=\n## |$)/i,
            'api': /## (?:API|Methods|JavaScript API)[\s\S]*?(?=\n## |$)/i
        };
        
        const match = docs.match(patterns[section]);
        if (match) {
            let content = match[0].substring(0, 2000);
            return `**${name} - ${section.charAt(0).toUpperCase() + section.slice(1)}**\n\n${content}\n\n---\n🔗 [Demo](${basePath}/${name}-demo.html) • [Full Docs](${basePath}/${name}.md) • [JS Source](${basePath}/${name}.js)`;
        }
        
        return `**${name}** - No ${section} section found in docs.\n\n🔗 [View Full Docs](${basePath}/${name}.md) • [View Demo](${basePath}/${name}-demo.html)`;
    }

    _getComponentFiles(name) {
        const basePath = `/components/${name}`;
        
        let response = `**${name} - Component Files**\n\n`;
        response += `📁 Location: \`${basePath}/\`\n\n`;
        response += `**Click to view:**\n`;
        response += `📜 [${name}.js](${basePath}/${name}.js) - Source Code\n`;
        response += `🎨 [${name}.css](${basePath}/${name}.css) - Stylesheet\n`;
        response += `🖥️ [${name}-demo.html](${basePath}/${name}-demo.html) - Demo Page\n`;
        response += `📖 [${name}.md](${basePath}/${name}.md) - Documentation\n`;
        response += `📋 [${name}.schema.json](${basePath}/${name}.schema.json) - Schema\n`;
        
        return response;
    }

    async _loadComponentDocs(name) {
        if (docsCache.has(name)) return docsCache.get(name);
        
        try {
            const resp = await fetch(`/components/${name}/${name}.md`);
            if (resp.ok) {
                const text = await resp.text();
                docsCache.set(name, text);
                return text;
            }
        } catch (e) {}
        return null;
    }

    _getComponentList() {
        let response = '**📦 All WB Components**\n\n';
        
        const categories = {};
        for (const [comp, data] of Object.entries(componentData)) {
            if (!categories[data.category]) categories[data.category] = [];
            categories[data.category].push(comp);
        }
        
        for (const [cat, comps] of Object.entries(categories)) {
            response += `**${cat}:**\n`;
            for (const c of comps) {
                response += `• [${c}](/components/${c}/${c}-demo.html)\n`;
            }
            response += '\n';
        }
        
        return response;
    }

    _getHelpMessage() {
        return `**🆘 Help**

**Search** (click any):
• [button](/components/wb-button/wb-button-demo.html)
• [color](/components/wb-color-harmony/wb-color-harmony-demo.html)
• [modal](/components/wb-modal/wb-modal-demo.html)
• [slider](/components/wb-slider/wb-slider-demo.html)
• [input](/components/wb-input/wb-input-demo.html)

**After finding a component:**
• "html" - code examples
• "css" - stylesheet
• "attributes" - options
• "events" - what it fires
• "theory" - how it works
• "demo" - open live demo

**Learn concepts:**
• [Glossary](/docs/GLOSSARY.md) - Shadow DOM, Slots, CSS Variables
• [Documentation Standard](/docs/DOCUMENTATION-STANDARD.md)`;
    }

    _getGlossaryResponse(query) {
        let term = '';
        let explanation = '';
        
        if (query.includes('shadow')) {
            term = 'Shadow DOM';
            explanation = 'A browser feature that creates an isolated DOM tree inside a component. Styles inside don\'t leak out.';
        } else if (query.includes('slot')) {
            term = 'Slots';
            explanation = 'Placeholders in a component where you can insert your own content using the slot attribute.';
        } else if (query.includes('variable') || query.includes('custom prop')) {
            term = 'CSS Variables';
            explanation = 'Variables in CSS (like --primary) that can be changed dynamically for theming.';
        } else if (query.includes('web component')) {
            term = 'Web Components';
            explanation = 'Browser-native way to create reusable custom HTML elements like <wb-button>.';
        } else if (query.includes('hcs') || query.includes('harmonic')) {
            term = 'HCS (Harmonic Color System)';
            explanation = 'WB Framework\'s color generation system based on wave theory and musical harmonics.';
        } else if (query.includes('bem')) {
            term = 'BEM';
            explanation = 'CSS naming convention: .block__element--modifier';
        } else if (query.includes('signal') || query.includes('reactive')) {
            term = 'Signals / Reactive';
            explanation = 'A pattern where changing a value automatically updates the UI.';
        } else if (query.includes('import.meta')) {
            term = 'import.meta.url';
            explanation = 'JavaScript way to get the URL of the current module file, used for loading component CSS.';
        }
        
        let response = `**📖 ${term}**\n\n`;
        response += `${explanation}\n\n`;
        response += `🔗 [Read full explanation in Glossary](/docs/GLOSSARY.md)\n\n`;
        response += `**Related components:**\n`;
        
        if (query.includes('shadow') || query.includes('web component') || query.includes('slot')) {
            response += `• [wb-base](/components/wb-base/wb-base.md) - base class for all components\n`;
        }
        if (query.includes('variable') || query.includes('custom prop')) {
            response += `• [wb-theme](/components/wb-theme/wb-theme.md) - theme management\n`;
        }
        if (query.includes('hcs') || query.includes('harmonic') || query.includes('color')) {
            response += `• [wb-color-harmony](/components/wb-color-harmony/wb-color-harmony.md)\n`;
            response += `• [wb-control-panel](/components/wb-control-panel/wb-control-panel.md)\n`;
        }
        
        return response;
    }

    _getNotFoundResponse(query) {
        let response = `🤔 I couldn't find "${query}".\n\n`;
        response += `**Try clicking:**\n`;
        response += `• [button](/components/wb-button/wb-button-demo.html)\n`;
        response += `• [color](/components/wb-color-harmony/wb-color-harmony-demo.html)\n`;
        response += `• [modal](/components/wb-modal/wb-modal-demo.html)\n`;
        response += `• [slider](/components/wb-slider/wb-slider-demo.html)\n`;
        response += `• [list] - all components\n`;
        response += `• [Glossary](/docs/GLOSSARY.md) - concepts & terms\n`;
        
        if (this._context.currentComponent) {
            const comp = this._context.currentComponent;
            response += `\n📍 **Current:** [${comp}](/components/${comp}/${comp}-demo.html)\n`;
            response += `Try: "html", "css", "attributes", "events"`;
        }
        
        return response;
    }

    _renderMessages() {
        const container = this.shadowRoot.getElementById('messages');
        if (!container) return;
        
        container.innerHTML = this.messages.map(m => `
            <div class="${this.config.classes.message} ${m.role === 'user' ? this.config.classes.messageUser : this.config.classes.messageBot}">
                ${m.isHtml ? m.content : this._formatMessage(m.content)}
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    }

    _formatMessage(content) {
        return '<div class="message-content">' + content
            // Code blocks with syntax class
            .replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
                const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `<pre class="code-block" data-lang="${lang || 'text'}"><code>${escaped}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/^### (.+)$/gm, '</div><h4>$1</h4><div class="message-content">')
            .replace(/^## (.+)$/gm, '</div><h3>$1</h3><div class="message-content">')
            // Bold and italic
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Lists
            .replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            // Paragraphs
            .replace(/\n\n/g, '</div><div class="message-content">')
            .replace(/\n/g, '<br>')
            // Wrap lists
            .replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>')
            + '</div>';
    }

    static get observedAttributes() { return ['title']; }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'title' && newVal !== oldVal) {
            this._title = newVal || this.config.defaults.title;
            const titleEl = this.shadowRoot?.querySelector('.header-title');
            if (titleEl) titleEl.textContent = this._title;
        }
    }
}

if (!customElements.get('wb-chatbot')) customElements.define('wb-chatbot', WBChatbot);
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBChatbot = WBChatbot;
window.WBChatbot = WBChatbot;

export { WBChatbot };
export default WBChatbot;

console.log('💬 WB Chatbot v3.0: Ready (inline content viewing)');
