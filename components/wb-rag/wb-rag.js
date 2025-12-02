import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';
import WBBaseComponent from '../wb-base/wb-base.js';

/**
 * WB RAG Component
 * 
 * A complete Retrieval-Augmented Generation (RAG) system for the WB Framework.
 * Provides an AI assistant that searches documentation and uses Claude API to answer questions.
 * 
 * @element wb-rag
 * @example
 * <wb-rag></wb-rag>
 * 
 * @example
 * <wb-rag api-key="your-key" knowledge-base-url="/knowledge-base.json"></wb-rag>
 * 
 * @fires wb-rag-ready - Fired when knowledge base is loaded
 * @fires wb-rag-search - Fired when search is performed
 * @fires wb-rag-response - Fired when Claude responds
 * @fires wb-rag-error - Fired on error
 */
class WBRag extends WBBaseComponent {
    constructor() {
        super();
        // Light DOM only - no Shadow DOM
        this.knowledgeBase = null;
        this.searchEngine = null;
        this.messages = [];
        this.loading = false;
        this.markedReady = false;
    }

    static get observedAttributes() {
        return ['api-key', 'knowledge-base-url', 'api-endpoint'];
    }

    async connectedCallback() {
    super.connectedCallback();
        await loadComponentCSS(this, 'wb-rag.css');
        // Load marked library first, then render
        await this.loadMarked();
        this.markedReady = true;
        this.render();
        this.loadKnowledgeBase();
        this.logEvents();
    }
    logEvents() {
        const rag = document.getElementById('rag-assistant');

        rag.addEventListener('wb-rag-ready', (e) => {
            console.log('✅ RAG Assistant Ready!', e.detail);
        });

        rag.addEventListener('wb-rag-search', (e) => {
            console.log('🔍 Search:', e.detail.query, 'Results:', Array.isArray(e.detail.results) ? e.detail.results.length : 0);
        });

        rag.addEventListener('wb-rag-response', (e) => {
            console.log('💬 Response received with', Array.isArray(e.detail.sources) ? e.detail.sources.length : 0, 'sources');
        });

        rag.addEventListener('wb-rag-error', (e) => {
            console.error('❌ Error:', e.detail.error);
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'knowledge-base-url') {
                this.loadKnowledgeBase();
            }
        }
    }

    get apiKey() {
        return this.getAttribute('api-key') || '';
    }

    get knowledgeBaseUrl() {
        return this.getAttribute('knowledge-base-url') || '/knowledge-base.json';
    }

    get apiEndpoint() {
        return this.getAttribute('api-endpoint') || '/api/claude';
    }

    loadMarked() {
        if (window.marked) {
            return Promise.resolve(window.marked);
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => {
                console.log('✅ Marked library loaded');
                resolve(window.marked);
            };
            script.onerror = () => {
                console.error('❌ Failed to load marked library');
                reject(new Error('Failed to load marked library'));
            };
            document.head.appendChild(script);
        });
    }

    async loadKnowledgeBase() {
        try {
            const response = await fetch(this.knowledgeBaseUrl);
            if (!response.ok) {
                throw new Error('Knowledge base not found. Run: npm run build:kb');
            }
            const kb = await response.json();
            this.knowledgeBase = kb;
            this.searchEngine = new RAGSearchEngine(kb);

            this.messages = [{
                role: 'assistant',
                content: `🎉 **WB Framework RAG Assistant Ready!**

I have full access to:
- 📚 ${kb.metadata.totalDocs} Documentation files
- 🧩 ${kb.metadata.totalComponents} Components
- 💻 ${kb.metadata.totalExamples} Code examples

Ask me anything about the WB Framework!`
            }];

            this.render();
            this.dispatchEvent(new CustomEvent('wb-rag-ready', {
                detail: { metadata: kb.metadata },
                bubbles: true,
                composed: true
            }));
        } catch (error) {
            this.messages = [{
                role: 'assistant',
                content: `⚠️ **Knowledge base not found!**

Please run: \`npm run build:kb\`

This will index all your documentation and components.`
            }];
            this.render();
            this.dispatchEvent(new CustomEvent('wb-rag-error', {
                detail: { error: error.message },
                bubbles: true,
                composed: true
            }));
        }
    }

    async sendMessage(userMessage) {
        if (!userMessage.trim() || this.loading || !this.searchEngine) return;

        // Add user message
        this.messages.push({ role: 'user', content: userMessage });
        this.loading = true;
        this.render();

        try {
            // STEP 2: Search for relevant context
            const searchResults = this.searchEngine.search(userMessage, 5);
            const context = this.searchEngine.buildContext(searchResults);

            this.dispatchEvent(new CustomEvent('wb-rag-search', {
                detail: { query: userMessage, results: searchResults },
                bubbles: true,
                composed: true
            }));

            // STEP 3: Send to Claude with context
            const response = await this.callClaudeAPI(userMessage, context);

            // Add assistant response
            this.messages.push({
                role: 'assistant',
                content: response,
                sources: searchResults.map(r => ({
                    type: r.type,
                    name: r.data.name || r.data.title,
                    score: r.score
                }))
            });

            this.dispatchEvent(new CustomEvent('wb-rag-response', {
                detail: { response, sources: searchResults },
                bubbles: true,
                composed: true
            }));

        } catch (error) {
            this.messages.push({
                role: 'assistant',
                content: `❌ Error: ${error.message}\n\nMake sure the RAG server is running.`
            });

            this.dispatchEvent(new CustomEvent('wb-rag-error', {
                detail: { error: error.message },
                bubbles: true,
                composed: true
            }));
        }

        this.loading = false;
        this.render();
    }

    async callClaudeAPI(userMessage, context) {
        const response = await fetch(this.apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userMessage,
                context,
                apiKey: this.apiKey
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Unknown error');
        }

        return data.response;
    }

    markdownToHtml(md) {
        if (!md) return '';

        // Check if marked is available
        if (!window.marked || !this.markedReady) {
            console.warn('Marked library not ready yet, returning plain text');
            return md;
        }

        try {
            // Use marked to parse markdown
            const html = window.marked.parse(md);
            return html;
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return md;
        }
    }

    render() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    gap: 20px;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                }

                .header {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 20px 30px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                }

                .header-icon {
                    width: 32px;
                    height: 32px;
                    color: #a78bfa;
                }

                .header-content {
                    flex: 1;
                }

                .header-title {
                    color: white;
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0 0 5px 0;
                }

                .header-subtitle {
                    color: rgba(255,255,255,0.7);
                    font-size: 14px;
                    margin: 0;
                }

                .header-stats {
                    display: flex;
                    gap: 15px;
                    font-size: 13px;
                    color: rgba(255,255,255,0.7);
                }

                .messages {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 10px;
                }

                .message {
                    display: flex;
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message.user {
                    justify-content: flex-end;
                }

                .message.assistant {
                    justify-content: flex-start;
                }

                .message-bubble {
                    max-width: 85%;
                    padding: 16px 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                }

                .message.user .message-bubble {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .message.assistant .message-bubble {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                }

                .message-content {
                    color: white;
                    line-height: 1.6;
                }

                /* Markdown styling */
                .message-content h1,
                .message-content h2,
                .message-content h3,
                .message-content h4 {
                    color: #a78bfa;
                    margin: 15px 0 10px 0;
                }

                .message-content h1 { font-size: 24px; }
                .message-content h2 { font-size: 20px; }
                .message-content h3 { font-size: 18px; }
                .message-content h4 { font-size: 16px; }

                .message-content p {
                    margin: 10px 0;
                }

                .message-content code {
                    background: rgba(139,92,246,0.2);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #a78bfa;
                    font-family: Consolas, Monaco, 'Courier New', monospace;
                }

                .message-content pre {
                    background: #1e1e2e;
                    padding: 15px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 15px 0;
                    border: 1px solid #3f3f46;
                }

                .message-content pre code {
                    background: transparent;
                    padding: 0;
                    color: #e4e4e7;
                    font-size: 13px;
                    line-height: 1.5;
                    display: block;
                    white-space: pre;
                }

                .message-content ul,
                .message-content ol {
                    margin: 10px 0;
                    padding-left: 25px;
                }

                .message-content li {
                    margin: 5px 0;
                }

                .message-content strong {
                    color: #c4b5fd;
                    font-weight: 600;
                }

                .message-content em {
                    color: #ddd6fe;
                    font-style: italic;
                }

                .message-content a {
                    color: #667eea;
                    text-decoration: underline;
                }

                .message-content a:hover {
                    color: #8b9aff;
                }

                .message-content blockquote {
                    border-left: 4px solid #a78bfa;
                    padding-left: 15px;
                    margin: 10px 0;
                    color: rgba(255,255,255,0.8);
                }

                .message-content table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 15px 0;
                }

                .message-content th,
                .message-content td {
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 8px 12px;
                    text-align: left;
                }

                .message-content th {
                    background: rgba(139,92,246,0.3);
                    color: #ddd6fe;
                    font-weight: 600;
                }

                .message-sources {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    font-size: 12px;
                    color: rgba(255,255,255,0.7);
                }

                .loading-message {
                    display: flex;
                    justify-content: flex-start;
                    animation: fadeIn 0.3s ease-out;
                }

                .loading-bubble {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 16px 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                }

                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .input-container {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 15px;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    gap: 10px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                }

                .input {
                    flex: 1;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: white;
                    font-size: 15px;
                    outline: none;
                }

                .input::placeholder {
                    color: rgba(255,255,255,0.5);
                }

                .send-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    font-size: 15px;
                    transition: transform 0.2s;
                }

                .send-button:hover:not(:disabled) {
                    transform: scale(1.05);
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .send-icon {
                    width: 18px;
                    height: 18px;
                }
            </style>

            <div class="container">
                <div class="header">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                    <div class="header-content">
                        <h1 class="header-title">WB Framework RAG Assistant</h1>
                        <p class="header-subtitle">Powered by Claude + Your Complete Documentation</p>
                    </div>
                    ${this.knowledgeBase ? `
                        <div class="header-stats">
                            <span>📚 ${this.knowledgeBase.metadata.totalDocs} Docs</span>
                            <span>🧩 ${this.knowledgeBase.metadata.totalComponents} Components</span>
                        </div>
                    ` : ''}
                </div>

                <div class="messages">
                    ${this.messages.map(msg => {
                        // Ensure sources is always an array
                        const sources = Array.isArray(msg.sources) ? msg.sources : [];
                        return `
                        <div class="message ${msg.role}">
                            <div class="message-bubble">
                                <div class="message-content">${this.markdownToHtml(msg.content)}</div>
                                ${sources.length > 0 ? `
                                    <div class="message-sources">
                                        <strong style="color:#a78bfa">📚 Sources:</strong> 
                                        ${sources.map(s => s.name).join(', ')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        `;
                    }).join('')}
                    
                    ${this.loading ? `
                        <div class="loading-message">
                            <div class="loading-bubble">
                                <div class="spinner"></div>
                                <span>Searching knowledge base and thinking...</span>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="input-container">
                    <input 
                        type="text" 
                        class="input"
                        placeholder="Ask about WB Framework components, architecture, patterns..."
                        ${this.loading || !this.searchEngine ? 'disabled' : ''}
                    />
                    <button 
                        class="send-button"
                        ${this.loading || !this.searchEngine ? 'disabled' : ''}
                    >
                        ${this.loading ? `
                            <div class="spinner"></div>
                        ` : `
                            <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        `}
                        Send
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const input = this.querySelector('.input');
        const button = this.querySelector('.send-button');

        const handleSend = () => {
            const value = input.value.trim();
            if (value) {
                this.sendMessage(value);
                input.value = '';
            }
        };

        button?.addEventListener('click', handleSend);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });

        // Auto-scroll to bottom
        const messagesContainer = this.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// STEP 2: Smart Search Engine
class RAGSearchEngine {
    constructor(knowledgeBase) {
        this.kb = knowledgeBase;
    }

    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 2);
    }

    calculateScore(item, tokens) {
        let score = 0;
        const text = JSON.stringify(item).toLowerCase();

        tokens.forEach(token => {
            if (item.name?.toLowerCase().includes(token)) score += 10;
            if (item.title?.toLowerCase().includes(token)) score += 8;
            if (item.keywords?.some(k => k.includes(token))) score += 5;

            const regex = new RegExp(token, 'gi');
            const matches = (text.match(regex) || []).length;
            score += matches * 2;
        });

        return score;
    }

    search(query, maxResults = 5) {
        const tokens = this.tokenize(query);
        if (tokens.length === 0) return [];

        const results = [];

        this.kb.components.forEach(comp => {
            const score = this.calculateScore(comp, tokens);
            if (score > 0) {
                results.push({ type: 'component', score, data: comp });
            }
        });

        this.kb.documentation.forEach(doc => {
            const score = this.calculateScore(doc, tokens);
            if (score > 0) {
                results.push({ type: 'documentation', score, data: doc });
            }
        });

        return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
    }

    buildContext(searchResults) {
        let context = "# WB Framework Knowledge Context\n\n";

        searchResults.forEach((result) => {
            if (result.type === 'component') {
                const comp = result.data;
                context += `## Component: ${comp.name}\n`;
                context += `${comp.description}\n\n`;
                if (comp.usage) context += `Usage: \`${comp.usage}\`\n\n`;
                if (comp.methods.length > 0) context += `Methods: ${comp.methods.join(', ')}\n\n`;
                if (comp.events.length > 0) context += `Events: ${comp.events.join(', ')}\n\n`;
                if (comp.codeExamples.length > 0) {
                    context += `Example:\n\`\`\`${comp.codeExamples[0].language}\n${comp.codeExamples[0].code}\n\`\`\`\n\n`;
                }
            } else if (result.type === 'documentation') {
                const doc = result.data;
                context += `## Document: ${doc.title}\n`;
                context += `${doc.summary}\n\n`;
                if (doc.codeBlocks.length > 0) {
                    context += `\`\`\`${doc.codeBlocks[0].language}\n${doc.codeBlocks[0].code}\n\`\`\`\n\n`;
                }
            }
            context += "---\n\n";
        });

        return context;
    }
}

customElements.define('wb-rag', WBRag);

