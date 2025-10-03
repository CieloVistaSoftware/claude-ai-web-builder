export {};
// @ts-nocheck
/**
 * Claude AI Integration
 * Uses websocket connection to backend server that communicates with Claude API
 * The backend server requires CLAUDE_API_KEY environment variable to be set
 * 
 * Architecture:
 * Client (browser) <--> Websocket <--> Backend Server <--> Claude API
 */

class ClaudeAIHelper {
  constructor() {
    // Initialize with null API key - will be retrieved via socket
    this.apiKey = null;
    this.initialState = null;
    this.isInitialized = false;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-opus-20240229'; // Using Claude 3 Opus for best results
    this.maxTokens = 4000;
    this.baseSystemPrompt = "You are an AI assistant helping to modify website content stored in JSON format. When the user asks you to change content, provide specific changes to make to the site-content.json file.";

    // Tracing configuration
    this.tracingEnabled = false; // Disabled by default
    this.traceLogs = []; // Store trace logs for display
    this.traceMaxLogs = 100; // Maximum number of logs to keep in memory

    // Start looking for the API key immediately
    this.findApiKey();
  }

  /**
   * Find API key from all possible sources with socket-first approach
   * Prioritizes socket-based retrieval when socket.io is available
   */
  findApiKey() {
    console.log('Looking for Claude API key...');

    // Always try the socket approach regardless of detected availability
    // The requestApiKeyViaSocket method has its own checks and fallbacks
    this.requestApiKeyViaSocket()
      .then(success => {
        if (success) {
          console.log('Successfully retrieved API key via socket');
        } else {
          console.log('Socket retrieval failed, checking additional sources');
          this.checkAdditionalSources();
        }
      })
      .catch(err => {
        console.warn('Socket API key retrieval failed:', err.message);
        this.checkAdditionalSources();
      });

    // Check immediate sources synchronously
    // Check environment variables (in case they're available)
    if (window.env && window.env.CLAUDE_API_KEY) {
      console.log('Found Claude API key in environment');
      return window.env.CLAUDE_API_KEY;
    }

    // Check global variable
    if (typeof CLAUDE_API_KEY !== 'undefined') {
      console.log('Found Claude API key in global variable');
      return CLAUDE_API_KEY;
    }

    console.log('No API key found in immediate sources, waiting for async sources');
    return null;
  }

  /**
   * Check additional sources for API key as fallback
   * @returns {boolean} Whether a key was found
   */
  checkAdditionalSources() {
    console.log('Checking additional API key sources...');

    // Try direct global variables
    if (window.CLAUDE_API_KEY) {
      console.log('Found Claude API key in window.CLAUDE_API_KEY');
      this.apiKey = window.CLAUDE_API_KEY;
      return true;
    }

    // Check for alternate environment objects
    const envSources = [
      window.env,
      window.ENV,
      window.environment,
      window.config,
      window.CONFIG
    ];

    for (const src of envSources) {
      if (src && typeof src === 'object') {
        // Check various key formats
        const possibleKeys = [
          'CLAUDE_API_KEY',
          'ClaudeApiKey',
          'claudeApiKey',
          'claude_api_key',
          'claude-api-key',
          'claude.apiKey'
        ];

        for (const key of possibleKeys) {
          if (src[key]) {
            console.log(`Found Claude API key in alternate source: ${key}`);
            this.apiKey = src[key];
            return true;
          }
        }
      }
    }

    console.log('No API key found in additional sources');
    return false;
  }

  /**
   * Initialize the Claude AI Helper - simplified without duplicating API key check
   */
  async initialize() {
    try {
      // Just verify the API key (already tried to set it in constructor)
      const hasApiKey = await this.getApiKey();

      // Store the initial content state for reset functionality
      this.saveInitialState();

      console.log(`Claude AI Helper initialized successfully${hasApiKey ? ' with API key' : ' (no API key found)'}`);
      this.isInitialized = true;

      // Set up listeners for UI elements
      this.setupEventListeners();

      return true;
    } catch (error) {
      console.error('Failed to initialize Claude AI Helper:', error);
      return false;
    }
  }

  /**
   * Check if websocket connection to backend Claude API service is available
   * @returns {Promise<boolean>} Whether a connection to Claude API is available
   */
  async getApiKey() {
    // Key already set in memory
    if (this.apiKey) {
      return true;
    }

    // Check websocket connection to backend server
    try {
      console.log('Checking websocket connection to backend Claude API service...');
      const success = await this.requestApiKeyViaSocket();
      if (success && this.apiKey) {
        console.log('Backend websocket connection confirmed with Claude API access');
        return true;
      }
    } catch (error) {
      console.warn('Websocket connection to backend Claude service failed:', error.message);
    }

    // No connection established - show configuration message
    console.warn('Unable to connect to Claude API through backend websocket. Please check server configuration.');
    const claudePanel = document.querySelector('.claude-panel-content');
    if (claudePanel) {
      this.showConfigurationMessage();
    }
    return false;
  }

  /**
   * Save the initial state of the content for reset functionality
   * Memory-only approach - no file fetching
   */
  saveInitialState() {
    if (window.siteContentData) {
      this.initialState = JSON.parse(JSON.stringify(window.siteContentData));
      console.log('Initial content state saved');
      return true;
    } else {
      console.warn('Cannot save initial state: site content data not available');

      // Do not attempt to load from file directly - this would create HTTP request
      // Instead, wait for content to be available through the expected channels
      console.log('Will use content data when it becomes available');

      // Set up listener for content loading events
      window.addEventListener('siteContent:loaded', () => {
        if (window.siteContentData && !this.initialState) {
          this.initialState = JSON.parse(JSON.stringify(window.siteContentData));
          console.log('Initial content state saved after content loaded');
        }
      }, { once: true });

      return false;
    }
  }

  /**
   * Reset content to initial state
   */
  resetContent() {
    if (!this.initialState) {
      console.error('Cannot reset: No initial state available');
      return false;
    }

    // Restore the content data
    window.siteContentData = JSON.parse(JSON.stringify(this.initialState));

    // Re-render the content
    renderSiteContent(window.siteContentData);

    console.log('Content reset to initial state');
    return true;
  }

  /**
   * Send a message to Claude AI
   * @param {string} userMessage - The message to send to Claude
   * @param {object} contentContext - Current content context to provide to Claude
   * @returns {Promise<object>} - Claude's response
   */
  async sendMessage(userMessage, contentContext = null) {
    if (!this.apiKey) {
      this.traceLog('SYSTEM', 'Cannot send message: Claude API key not set');

      // Return a helpful response instead of null
      return {
        content: [{
          text: "Claude AI is not configured. Please set up your API key to use AI assistance features."
        }],
        error: "API_KEY_NOT_SET"
      };
    }

    try {
      // Prepare the context about the current content structure
      let contentContextStr = '';
      if (contentContext || window.siteContentData) {
        const contextData = contentContext || window.siteContentData;
        contentContextStr = `\n\nCurrent site content structure:\n${JSON.stringify(contextData, null, 2)}`;
      }

      // Build the system prompt with specific instructions for content editing
      const systemPrompt = `${this.baseSystemPrompt}
Your primary task is to help modify website content stored in the site-content.json file.
When suggesting changes:
1. Be specific about which fields to update
2. Format your suggestions in valid JSON format that can be directly applied
3. Always maintain the existing structure
4. Don't suggest changes to fields that aren't mentioned by the user

You can see the current content structure in the context provided.
When the user asks for content changes, respond with clear instructions on what to modify.
${contentContextStr}`;

      // Create request payload
      const requestPayload = {
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: [
          { role: "user", content: userMessage }
        ]
      };

      // Log outbound request (with shortened system prompt for clarity)
      this.traceLog('OUTBOUND', {
        url: this.baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '****API_KEY_MASKED****',
          'anthropic-version': '2023-06-01'
        },
        body: {
          ...requestPayload,
          system: systemPrompt.substring(0, 100) + '... [truncated]'
        }
      });

      // Make the actual request
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.traceLog('INBOUND', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        this.traceLog('SYSTEM', `Claude API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();

      // Log inbound response
      this.traceLog('INBOUND', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      return data;
    } catch (error) {
      this.traceLog('SYSTEM', `Error sending message to Claude: ${error.message}`);
      return null;
    }
  }

  /**
   * Apply content changes suggested by Claude
   * @param {string} changesJson - JSON string containing the changes to apply
   * @returns {boolean} - Whether changes were successfully applied
   */
  applyContentChanges(changesJson) {
    try {
      const changes = JSON.parse(changesJson);

      // Apply the changes to the site content
      Object.assign(window.siteContentData, changes);

      // Re-render the content
      renderSiteContent(window.siteContentData);

      console.log('Content changes applied successfully');
      return true;
    } catch (error) {
      console.error('Error applying content changes:', error);
      return false;
    }
  }

  /**
   * Setup UI elements for Claude AI integration
   */
  setupUI() {
    // Create Claude AI panel if it doesn't exist
    if (!document.getElementById('claude-ai-panel')) {
      // Create the panel container
      const panel = document.createElement('div');
      panel.id = 'claude-ai-panel';
      panel.className = 'claude-ai-panel';

      // Detect if dark mode is active and adjust panel styling accordingly
      const isDarkMode = document.body.classList.contains('dark-mode') ||
        document.documentElement.getAttribute('data-mode') === 'dark';

      panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        background: ${isDarkMode ? '#2a2a2a' : '#f8f8f8'};
        color: ${isDarkMode ? '#e0e0e0' : '#333'};
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,${isDarkMode ? '0.4' : '0.15'});
        z-index: 1000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        border: 1px solid ${isDarkMode ? '#444' : '#ddd'};
      `;

      // Create header with minimize/maximize toggle
      const header = document.createElement('div');
      header.className = 'claude-panel-header';
      header.style.cssText = `
        padding: 12px 15px;
        background: #7026e3;
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      `;

      header.innerHTML = `
        <span style="display: flex; align-items: center;">
          <span style="font-size: 18px; margin-right: 8px;">✨</span>
          <span>Claude AI Assistant</span>
        </span>
        <div>
          <button id="claude-trace-btn" title="Show Communication Trace" style="background: none; border: none; color: white; cursor: pointer; margin-right: 10px;">
            <span style="font-size: 18px;">📊</span>
          </button>
          <button id="claude-reset-btn" title="Reset Content" style="background: none; border: none; color: white; cursor: pointer; margin-right: 10px;">
            <span style="font-size: 18px;">↺</span>
          </button>
          <button id="claude-toggle-btn" title="Minimize/Maximize" style="background: none; border: none; color: white; cursor: pointer;">
            <span style="font-size: 18px;">_</span>
          </button>
        </div>
      `;

      // Create content area
      const content = document.createElement('div');
      content.className = 'claude-panel-content';
      content.style.cssText = `
        padding: 15px;
        max-height: 350px;
        overflow-y: auto;
        flex-grow: 1;
        scrollbar-width: thin;
        scrollbar-color: ${isDarkMode ? '#555 #333' : '#ccc #f0f0f0'};
      `;
      content.innerHTML = `
        <div style="margin-bottom: 15px;">
          <p><strong>Welcome to Claude AI Assistant!</strong></p>
          <p>I can help modify your website content. For example, try asking:</p>
          <ul style="margin-left: 20px; margin-top: 8px;">
            <li>Update the hero title to "Build Amazing Websites Today"</li>
            <li>Change the contact email in the Contact section</li>
            <li>Add a new feature card about AI integration</li>
          </ul>
        </div>
      `;

      // Create input area
      const inputArea = document.createElement('div');
      inputArea.className = 'claude-panel-input';
      inputArea.style.cssText = `
        padding: 12px 15px;
        border-top: 1px solid ${isDarkMode ? '#444' : '#ddd'};
        display: flex;
        background: ${isDarkMode ? '#333' : '#fff'};
      `;

      inputArea.innerHTML = `
        <input type="text" id="claude-input" placeholder="Ask Claude to modify content..." 
          style="flex-grow: 1; padding: 10px; border: 1px solid ${isDarkMode ? '#555' : '#ddd'}; 
          border-radius: 6px; background: ${isDarkMode ? '#222' : '#fff'}; 
          color: ${isDarkMode ? '#e0e0e0' : '#333'};">
        <button id="claude-send-btn" 
          style="margin-left: 10px; background: #7026e3; color: white; border: none; 
          border-radius: 6px; padding: 0 15px; cursor: pointer; font-weight: 500;">Send</button>
      `;

      // Assemble the panel
      panel.appendChild(header);
      panel.appendChild(content);
      panel.appendChild(inputArea);

      // Add to the document
      document.body.appendChild(panel);

      // Add collapse/expand functionality
      const toggleBtn = document.getElementById('claude-toggle-btn');
      let isPanelCollapsed = false;

      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e): any => {
          e.stopPropagation(); // Prevent header click event

          if (isPanelCollapsed) {
            // Expand
            content.style.display = 'block';
            inputArea.style.display = 'flex';
            toggleBtn.innerHTML = '<span style="font-size: 18px;">_</span>';
            isPanelCollapsed = false;
          } else {
            // Collapse
            content.style.display = 'none';
            inputArea.style.display = 'none';
            toggleBtn.innerHTML = '<span style="font-size: 18px;">+</span>';
            isPanelCollapsed = true;
          }
        });
      }

      // Header click to toggle panel
      header.addEventListener('click', (): any => {
        if (isPanelCollapsed) {
          // Expand
          content.style.display = 'block';
          inputArea.style.display = 'flex';
          if (toggleBtn) toggleBtn.innerHTML = '<span style="font-size: 18px;">_</span>';
          isPanelCollapsed = false;
        } else {
          // Collapse
          content.style.display = 'none';
          inputArea.style.display = 'none';
          if (toggleBtn) toggleBtn.innerHTML = '<span style="font-size: 18px;">+</span>';
          isPanelCollapsed = true;
        }
      });

      // Add draggable functionality
      let isDragging = false;
      let offsetX, offsetY;

      header.addEventListener('mousedown', (e): any => {
        if (e.target.tagName !== 'BUTTON' && e.target.parentElement.tagName !== 'BUTTON') {
          isDragging = true;
          offsetX = e.clientX - panel.getBoundingClientRect().left;
          offsetY = e.clientY - panel.getBoundingClientRect().top;
        }
      });

      document.addEventListener('mousemove', (e): any => {
        if (isDragging) {
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          // Keep panel within viewport
          const maxX = window.innerWidth - panel.offsetWidth;
          const maxY = window.innerHeight - panel.offsetHeight;

          panel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
          panel.style.right = 'auto';
          panel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
          panel.style.bottom = 'auto';
        }
      });

      document.addEventListener('mouseup', (): any => {
        isDragging = false;
      });

      console.log('Claude AI panel created');
    }
  }

  /**
   * Set up event listeners for Claude AI panel
   */
  setupEventListeners() {
    // First ensure the UI is created
    this.setupUI();

    // Setup trace button
    const traceBtn = document.getElementById('claude-trace-btn');
    if (traceBtn) {
      traceBtn.addEventListener('click', (): any => {
        this.showTracePanel();
      });
    }

    // Setup reset button
    const resetBtn = document.getElementById('claude-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (): any => {
        if (confirm('Reset all content to initial state? This cannot be undone.')) {
          this.resetContent();
        }
      });
    }

    // Setup send button
    const sendBtn = document.getElementById('claude-send-btn');
    const inputField = document.getElementById('claude-input');

    if (sendBtn && inputField) {
      // Send on button click
      sendBtn.addEventListener('click', (): any => {
        this.handleUserMessage(inputField.value);
        inputField.value = '';
      });

      // Send on Enter key
      inputField.addEventListener('keypress', (e): any => {
        if (e.key === 'Enter') {
          this.handleUserMessage(inputField.value);
          inputField.value = '';
        }
      });
    }
  }

  /**
   * Handle user message to Claude
   * @param {string} message - User's message
   */
  async handleUserMessage(message) {
    if (!message.trim()) return;

    // Check if API key is configured
    if (!this.apiKey) {
      this.showConfigurationMessage();
      return;
    }

    // Show the message in the panel
    const contentArea = document.querySelector('.claude-panel-content');
    if (contentArea) {
      contentArea.innerHTML += `
        <div style="margin-bottom: 10px;">
          <strong>You:</strong> ${message}
        </div>
      `;
      contentArea.scrollTop = contentArea.scrollHeight;
    }

    // Show thinking indicator
    contentArea.innerHTML += `
      <div id="claude-thinking" style="margin-bottom: 10px;">
        <strong>Claude:</strong> <em>Thinking...</em>
      </div>
    `;
    contentArea.scrollTop = contentArea.scrollHeight;

    // Send to Claude API
    const response = await this.sendMessage(message);

    // Remove thinking indicator
    const thinkingElement = document.getElementById('claude-thinking');
    if (thinkingElement) {
      thinkingElement.remove();
    }

    // Process and display response
    if (response && response.content && response.content.length > 0) {
      const claudeResponse = response.content[0].text;

      // Display the response
      contentArea.innerHTML += `
        <div style="margin-bottom: 10px;">
          <strong>Claude:</strong> ${claudeResponse}
        </div>
      `;
      contentArea.scrollTop = contentArea.scrollHeight;

      // Look for JSON content that could be applied
      this.extractAndApplyChanges(claudeResponse);
    } else if (response && response.error === "API_KEY_NOT_SET") {
      // Handle API key not set - should not happen here since we check above
      this.showApiKeyConfigurationUI();
    } else {
      // Handle other errors
      contentArea.innerHTML += `
        <div style="margin-bottom: 10px; color: #e74c3c;">
          <strong>Claude:</strong> Sorry, I encountered an error processing your request.
        </div>
      `;
      contentArea.scrollTop = contentArea.scrollHeight;
    }
  }

  /**
   * Extract JSON content from Claude's response and apply changes
   * @param {string} response - Claude's response text
   */
  extractAndApplyChanges(response) {
    // Look for JSON content between code fences or JSON block
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
      response.match(/\{[\s\S]*?\}/);

    if (jsonMatch) {
      try {
        // Try to parse and apply the JSON
        const jsonContent = jsonMatch[0].includes('```') ? jsonMatch[1].trim() : jsonMatch[0].trim();
        const changes = JSON.parse(jsonContent);

        // Get theme colors for UI components
        const isDarkMode = document.body.classList.contains('dark-mode') ||
          document.documentElement.getAttribute('data-mode') === 'dark';

        // Format changes for display
        const changesDisplay = this.formatChangesForDisplay(changes);

        // Show confirmation dialog with the changes
        const contentArea = document.querySelector('.claude-panel-content');
        contentArea.innerHTML += `
          <div class="claude-confirm-changes" style="
            margin: 15px 0; 
            padding: 15px; 
            background: ${isDarkMode ? '#333' : '#e8f4fc'}; 
            border-radius: 6px;
            border-left: 4px solid #7026e3;
          ">
            <p><strong>Proposed Changes:</strong></p>
            <div class="claude-changes-preview" style="
              margin: 10px 0;
              padding: 10px;
              max-height: 150px;
              overflow-y: auto;
              font-family: monospace;
              font-size: 13px;
              background: ${isDarkMode ? '#222' : '#fff'};
              border-radius: 4px;
              white-space: pre-wrap;
              color: ${isDarkMode ? '#e0e0e0' : '#333'};
            ">${changesDisplay}</div>
            <p>Would you like to apply these changes?</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <button id="claude-apply-btn" style="
                background: #7026e3; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                padding: 8px 15px; 
                cursor: pointer;
                font-weight: 500;
              ">Apply Changes</button>
              <button id="claude-cancel-btn" style="
                background: ${isDarkMode ? '#444' : '#ddd'}; 
                color: ${isDarkMode ? '#e0e0e0' : '#333'}; 
                border: none; 
                border-radius: 6px; 
                padding: 8px 15px; 
                cursor: pointer;
              ">Cancel</button>
            </div>
          </div>
        `;
        contentArea.scrollTop = contentArea.scrollHeight;

        // Set up event listeners for confirmation buttons
        document.getElementById('claude-apply-btn').addEventListener('click', (): any => {
          // Apply the changes recursively
          this.applyNestedChanges(window.siteContentData, changes);

          // Re-render the content
          renderSiteContent(window.siteContentData);

          // Show success message
          contentArea.innerHTML += `
            <div style="
              margin: 10px 0; 
              padding: 10px; 
              background: ${isDarkMode ? '#143e2f' : '#e6f7ef'}; 
              color: ${isDarkMode ? '#2ecc71' : '#27ae60'}; 
              border-radius: 4px;
              border-left: 3px solid #2ecc71;
            ">
              <strong>✓ Changes applied successfully!</strong>
            </div>
          `;
          contentArea.scrollTop = contentArea.scrollHeight;

          // Remove the confirmation
          const confirmEl = contentArea.querySelector('.claude-confirm-changes');
          if (confirmEl) confirmEl.remove();
        });

        document.getElementById('claude-cancel-btn').addEventListener('click', (): any => {
          // Remove the confirmation
          const confirmEl = contentArea.querySelector('.claude-confirm-changes');
          if (confirmEl) confirmEl.remove();

          // Show cancelled message
          contentArea.innerHTML += `
            <div style="
              margin: 10px 0; 
              padding: 10px; 
              background: ${isDarkMode ? '#2c3e50' : '#f5f5f5'}; 
              color: ${isDarkMode ? '#bdc3c7' : '#7f8c8d'};
              border-radius: 4px;
              border-left: 3px solid #7f8c8d;
            ">
              <strong>Changes cancelled.</strong>
            </div>
          `;
          contentArea.scrollTop = contentArea.scrollHeight;
        });
      } catch (error) {
        console.error('Error extracting JSON from Claude response:', error);

        // Show error message in the panel
        const contentArea = document.querySelector('.claude-panel-content');
        if (contentArea) {
          contentArea.innerHTML += `
            <div style="
              margin: 10px 0; 
              padding: 10px; 
              background: #ffecec; 
              color: #e74c3c; 
              border-radius: 4px;
              border-left: 3px solid #e74c3c;
            ">
              <strong>Error processing JSON:</strong> ${error.message}
            </div>
          `;
          contentArea.scrollTop = contentArea.scrollHeight;
        }
      }
    }
  }

  /**
   * Format changes object for display in the UI
   * @param {object} changes - The changes to format
   * @returns {string} - Formatted changes as a string
   */
  formatChangesForDisplay(changes) {
    return JSON.stringify(changes, null, 2)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("([^"]*)"):(\s*[{\[])/g, '<span style="color:#7026e3">$1</span>:$3')
      .replace(/("([^"]*)"):(\s*"([^"]*)"),?/g, '<span style="color:#7026e3">$1</span>: <span style="color:#27ae60">"$4"</span>,')
      .replace(/("([^"]*)"):(\s*[0-9]+),?/g, '<span style="color:#7026e3">$1</span>: <span style="color:#e67e22">$3</span>,');
  }

  /**
   * Apply nested changes to an object recursively
   * @param {object} target - The target object to modify
   * @param {object} changes - The changes to apply
   * @returns {object} - The modified target
   */
  applyNestedChanges(target, changes) {
    if (!target || !changes || typeof changes !== 'object') return target;

    Object.entries(changes).forEach(([key, value]): any => {
      // If this key exists in target
      if (key in target) {
        if (
          value !== null &&
          typeof value === 'object' &&
          target[key] !== null &&
          typeof target[key] === 'object'
        ) {
          // Recursively update nested objects/arrays
          this.applyNestedChanges(target[key], value);
        } else {
          // Direct value assignment
          target[key] = value;
        }
      } else {
        // Add new key
        target[key] = value;
      }
    });

    return target;
  }

  /**
   * Show configuration message with instructions on how to set up the API key
   * Clarifies the websocket communication flow
   */
  showConfigurationMessage() {
    const claudePanel = document.querySelector('.claude-panel-content');
    if (!claudePanel) return;

    // Accurate websocket flow instructions
    claudePanel.innerHTML = `
      <div style="background: #FEF9E7; border-left: 4px solid #F39C12; padding: 15px; margin: 0; border-radius: 4px; color: #333;">
        <h3 style="margin-top: 0;">⚠️ Claude API Connection Required</h3>
        <p style="margin: 10px 0;">The backend server needs Claude API access to respond to your requests.</p>
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Get API key from <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a></li>
          <li>Add <code>CLAUDE_API_KEY</code> to the backend server environment</li>
          <li>Restart server to enable the websocket connection</li>
        </ol>
        <p style="margin: 10px 0; font-weight: bold; color: #D35400;">
          <svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 5px;"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm.5 13h-1v-1h1v1zm0-2.5h-1v-6h1v6z"/></svg>
          How it works: Your requests go through the websocket to the backend server, which uses the API key to communicate with Claude
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="claude-retry-btn" style="background: #3498DB; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
            Check Connection
          </button>
          <button id="claude-show-trace-btn" style="background: #9B59B6; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
            Show Communication Trace
          </button>
          <button id="claude-close-btn" style="background: #95A5A6; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
            Close
          </button>
        </div>
      </div>
    `;

    // Event handler for check connection button
    document.getElementById('claude-retry-btn').addEventListener('click', (): any => {
      claudePanel.innerHTML = '<p>Checking websocket connection to backend server...</p>';

      // Enable tracing for connection check
      const wasTracingEnabled = this.tracingEnabled;
      if (!wasTracingEnabled) {
        this.setTracingEnabled(true);
      }

      // Check if websocket is connected and backend has access to Claude API
      this.requestApiKeyViaSocket().then(success => {
        // Restore tracing state if it was disabled
        if (!wasTracingEnabled) {
          this.setTracingEnabled(false);
        }

        if (success) {
          claudePanel.innerHTML = `
            <div style="background: #E8F8F5; border-left: 4px solid #2ECC71; padding: 15px; margin: 0; border-radius: 4px; color: #333;">
              <h3 style="margin-top: 0;">✅ Connection Successful</h3>
              <p>The websocket connection is established and the backend server has confirmed access to the Claude API.</p>
              <p>You can now ask questions and request content changes.</p>
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="claude-show-trace-btn" style="background: #9B59B6; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                  View Connection Trace
                </button>
                <button id="claude-close-success-btn" style="background: #95A5A6; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                  Close
                </button>
              </div>
            </div>
          `;

          // Add event listener for trace button
          document.getElementById('claude-show-trace-btn').addEventListener('click', (): any => {
            this.showTracePanel();
          });

          // Add event listener for close button
          document.getElementById('claude-close-success-btn').addEventListener('click', (): any => {
            const panel = document.getElementById('claude-ai-panel');
            if (panel) panel.style.display = 'none';
          });
        } else {
          // If failed, show detailed error message
          claudePanel.innerHTML = `
            <div style="background: #FADBD8; border-left: 4px solid #E74C3C; padding: 15px; margin: 0; border-radius: 4px; color: #333;">
              <h3 style="margin-top: 0;">❌ Connection Failed</h3>
              <p>The system cannot establish a working connection to Claude API via the websocket.</p>
              <p>Possible reasons:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Backend server is not running</li>
                <li>API key is not configured on the server</li>
                <li>API key is invalid or has expired</li>
                <li>Websocket connection is blocked or interrupted</li>
              </ul>
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="claude-config-btn" style="background: #3498DB; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                  Show Setup Instructions
                </button>
                <button id="claude-show-trace-btn" style="background: #9B59B6; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                  View Error Trace
                </button>
              </div>
            </div>
          `;

          // Add event listener for config button
          document.getElementById('claude-config-btn').addEventListener('click', (): any => {
            this.showConfigurationMessage();
          });

          // Add event listener for trace button
          document.getElementById('claude-show-trace-btn').addEventListener('click', (): any => {
            this.showTracePanel();
          });
        }
      });
    });

    // Event handler for trace button
    document.getElementById('claude-show-trace-btn').addEventListener('click', (): any => {
      this.showTracePanel();
    });

    // Event handler for close button
    document.getElementById('claude-close-btn').addEventListener('click', (): any => {
      const panel = document.getElementById('claude-ai-panel');
      if (panel) panel.style.display = 'none';
    });
  }

  /**
   * Show temporary API key input for development
   */
  showApiKeyInput() {
    const contentArea = document.querySelector('.claude-panel-content');
    if (!contentArea) return;

    // Simple content with clear instructions
    contentArea.innerHTML = `
      <div style="margin-bottom: 15px;">
        <p>Claude API Key not found. Set CLAUDE_API_KEY environment variable.</p>
        <p style="color: #e74c3c;">⚠️ Keys are only stored in memory, never persisted.</p>
        <input type="password" id="claude-api-key-input" placeholder="Enter API Key (session-only)..." 
          style="width: 100%; padding: 8px; margin-top: 8px; border: 1px solid #ddd; border-radius: 4px;">
        <button id="claude-save-key-btn" 
          style="width: 100%; margin-top: 8px; background: #7026e3; color: white; border: none; border-radius: 4px; padding: 8px;">
          Use Key For This Session
        </button>
      </div>
    `;

    // Set up event listener for save button
    document.getElementById('claude-save-key-btn').addEventListener('click', (): any => {
      const apiKeyInput = document.getElementById('claude-api-key-input');
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        // Store key in memory only
        this.apiKey = apiKey;
        window.env = window.env || {};
        window.env.CLAUDE_API_KEY = apiKey;

        // Clear input immediately
        apiKeyInput.value = '';
        contentArea.innerHTML = '<p>API Key is now in use for this session only.</p>';
      }
    });
  }

  /**
   * Check websocket connection to backend server and verify Claude API access
   * The backend server handles the actual Claude API communication using its environment variables
   * @returns {Promise<boolean>} - Whether the backend connection with Claude API access is available
   */
  requestApiKeyViaSocket() {
    return new Promise((resolve): any => {
      try {
        // Only attempt socket.io if explicitly enabled via environment variable
        if (!window.env || !window.env.ENABLE_SOCKET_IO) {
          this.traceLog('SYSTEM', 'Socket.io disabled or not configured - skipping socket connection');
          resolve(false);
          return;
        }

        // Check for socket.io availability with detailed logging
        if (typeof io === 'undefined' && typeof window.io === 'undefined' && !window.socket) {
          this.traceLog('SYSTEM', 'Socket.io not detected, attempting dynamic loading...');

          // Try to dynamically load socket.io
          this.loadSocketIO()
            .then(loaded => {
              if (loaded) {
                this.traceLog('SYSTEM', 'Socket.io loaded successfully, attempting connection...');
                // After loading, try to connect
                this.establishSocketConnection()
                  .then(result => resolve(result))
                  .catch(() => resolve(false));
              } else {
                this.traceLog('SYSTEM', 'Failed to load Socket.io dynamically');
                resolve(false);
              }
            })
            .catch((): any => {
              this.traceLog('SYSTEM', 'Error during Socket.io loading attempt');
              resolve(false);
            });
        } else {
          // Socket.io is available, proceed with connection
          this.traceLog('SYSTEM', 'Socket.io detected, establishing connection...');
          this.establishSocketConnection()
            .then(result => resolve(result))
            .catch(() => resolve(false));
        }
      } catch (error) {
        this.traceLog('SYSTEM', `Unexpected error in socket API key request: ${error.message}`);
        resolve(false); // Always resolve, never reject
      }
    });
  }

  /**
   * Look for Socket.io in the document - prioritize local server path
   * DO NOT use external CDNs when using local server
   * @returns {Promise<boolean>} - Whether Socket.io was successfully found
   */
  loadSocketIO() {
    return new Promise((resolve): any => {
      // First check if socket.io is already available
      if (typeof io !== 'undefined' || typeof window.io !== 'undefined') {
        console.log('Socket.io already loaded');
        return resolve(true);
      }

      // Look for script tag that might already exist
      const existingScript = document.querySelector('script[src*="socket.io"]');
      if (existingScript) {
        console.log('Socket.io script tag found in document');

        // Wait for it to load
        existingScript.addEventListener('load', (): any => {
          console.log('Existing Socket.io script loaded');
          resolve(true);
        });

        existingScript.addEventListener('error', (): any => {
          console.warn('Existing Socket.io script failed to load');
          resolve(false);
        });

        // Set a timeout in case the event listeners don't fire
        setTimeout((): any => {
          if (typeof io === 'undefined' && typeof window.io === 'undefined') {
            console.warn('Timed out waiting for existing Socket.io script');
            resolve(false);
          } else {
            resolve(true);
          }
        }, 3000);

        return;
      }

      // No existing script - try ONLY local server path to avoid external HTTP requests
      try {
        // ONLY use local server path - no external CDN requests
        // This prevents unwanted HTTP requests to external sources
        const localSocketPath = '/socket.io/socket.io.js'; // Standard Socket.io server path

        console.log(`Attempting to load Socket.io from local server: ${localSocketPath}`);
        const script = document.createElement('script');
        script.src = localSocketPath;
        script.async = true;

        script.onload = () => {
          console.log('Socket.io loaded from local server path');
          resolve(true);
        };

        script.onerror = () => {
          console.warn('Failed to load Socket.io from local server path');
          console.info('Make sure the server is running and socket.io is properly set up');
          resolve(false);
        };

        document.head.appendChild(script);

      } catch (err) {
        console.error('Error attempting to load Socket.io:', err);
        resolve(false);
      }
    });
  }

  /**
   * Establish socket connection and request API key
   * @returns {Promise<boolean>}
   */
  establishSocketConnection() {
    return new Promise((resolve): any => {
      try {
        this.traceLog('SYSTEM', 'Establishing socket connection...');

        // Get socket instance with comprehensive fallbacks
        let socket = this.getSocketInstance();

        if (!socket) {
          this.traceLog('SYSTEM', 'Failed to get valid socket instance');
          return resolve(false);
        }

        // Set timeout for the request
        const timeout = setTimeout((): any => {
          this.cleanupSocketListeners(socket);
          this.traceLog('SYSTEM', 'Socket request for API key timed out after 5 seconds');
          resolve(false);
        }, 5000);

        // Success handler
        const handleSuccess = (data) => {
          clearTimeout(timeout);
          this.cleanupSocketListeners(socket);

          // Log the inbound message (but mask actual key value for security)
          this.traceLog('INBOUND', {
            event: 'env:claude_api_key',
            data: data && data.value ? { value: '****API_KEY_MASKED****' } : data
          });

          if (data && data.value) {
            this.traceLog('SYSTEM', 'Websocket connection successful - backend server has confirmed Claude API access');
            this.apiKey = data.value; // Store the token that confirms API access
            resolve(true);
          } else {
            this.traceLog('SYSTEM', 'Websocket connection established but backend server reports no Claude API access');
            resolve(false);
          }
        };

        // Listen for response with error handling
        try {
          socket.once('env:claude_api_key', handleSuccess);

          // Add error handler
          socket.once('error', (error): any => {
            clearTimeout(timeout);
            this.cleanupSocketListeners(socket);
            this.traceLog('SYSTEM', `Socket connection error: ${error.message || 'Unknown error'}`);
            resolve(false);
          });

          // Add connect_error handler
          socket.once('connect_error', (error): any => {
            clearTimeout(timeout);
            this.cleanupSocketListeners(socket);
            this.traceLog('SYSTEM', `Socket connection error: ${error.message || 'Unknown error'}`);
            resolve(false);
          });

          // Request the API key
          this.traceLog('OUTBOUND', {
            event: 'get:env',
            data: { key: 'CLAUDE_API_KEY' }
          });
          socket.emit('get:env', { key: 'CLAUDE_API_KEY' });

        } catch (socketError) {
          clearTimeout(timeout);
          this.traceLog('SYSTEM', `Error in socket event handling: ${socketError.message || 'Unknown error'}`);
          resolve(false);
        }
      } catch (error) {
        this.traceLog('SYSTEM', `Error establishing socket connection: ${error.message || 'Unknown error'}`);
        resolve(false);
      }
    });
  }

  /**
   * Get a socket instance using all available methods
   * @returns {Object|null} Socket instance or null if not available
   */
  getSocketInstance() {
    try {
      // Method 1: Use existing socket
      if (window.socket && typeof window.socket.emit === 'function') {
        console.log('Using existing window.socket instance');
        return window.socket;
      }

      // Method 2: Use window.io
      if (window.io && typeof window.io === 'function') {
        console.log('Creating socket with window.io()');
        const socket = window.io();
        if (socket && typeof socket.emit === 'function') {
          return socket;
        }
      }

      // Method 3: Use global io
      if (typeof io === 'function') {
        console.log('Creating socket with global io()');
        const socket = io();
        if (socket && typeof socket.emit === 'function') {
          return socket;
        }
      }

      // Method 4: Look for io in other common locations
      const possibleIoSources = [
        window.socketio,
        window.socketIO,
        window.SocketIO,
        window.io
      ];

      for (const source of possibleIoSources) {
        if (source && typeof source === 'function') {
          try {
            console.log('Creating socket with alternative io source');
            const socket = source();
            if (socket && typeof socket.emit === 'function') {
              return socket;
            }
          } catch (e) {
            console.warn('Failed to create socket with alternative source:', e);
          }
        }
      }

      console.warn('No valid socket.io instance could be created');
      return null;
    } catch (error) {
      console.error('Error getting socket instance:', error);
      return null;
    }
  }

  /**
   * Clean up socket event listeners to prevent memory leaks
   * @param {Object} socket - Socket instance
   */
  cleanupSocketListeners(socket) {
    if (socket) {
      try {
        socket.off('env:claude_api_key');
        socket.off('error');
        socket.off('connect_error');
      } catch (error) {
        console.warn('Error cleaning up socket listeners:', error);
      }
    }
  }

  /**
   * Show API key configuration UI - reuse the existing method for consistency
   */
  showApiKeyConfigurationUI() {
    // Simply reuse the existing method instead of duplicating code
    this.showConfigurationMessage();
  }

  /**
   * Enable or disable tracing of all Claude communications
   * @param {boolean} enabled - Whether to enable tracing
   */
  setTracingEnabled(enabled) {
    this.tracingEnabled = enabled;
    if (enabled) {
      this.traceLog('SYSTEM', 'Tracing enabled for Claude communications');
    } else {
      this.traceLog('SYSTEM', 'Tracing disabled for Claude communications');
    }

    // Update UI if the tracing panel exists
    const tracingToggle = document.getElementById('claude-tracing-toggle');
    if (tracingToggle) {
      tracingToggle.textContent = enabled ? 'Disable Tracing' : 'Enable Tracing';
    }

    // Display status in console
    console.log(`Claude communications tracing: ${enabled ? 'ENABLED' : 'DISABLED'}`);

    return enabled;
  }

  /**
   * Log a traced message with direction indicator
   * @param {string} direction - Direction of communication: 'OUTBOUND', 'INBOUND', or 'SYSTEM'
   * @param {any} message - Message content to log
   */
  traceLog(direction, message) {
    // Only log if tracing is enabled, except for system messages about tracing itself
    if (!this.tracingEnabled && direction !== 'SYSTEM') return;

    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Format direction with arrow
    let formattedDirection;
    let consoleStyle;

    switch (direction) {
      case 'OUTBOUND':
        formattedDirection = '→ OUTBOUND';
        consoleStyle = 'color: #2980b9; font-weight: bold';
        break;
      case 'INBOUND':
        formattedDirection = '← INBOUND';
        consoleStyle = 'color: #27ae60; font-weight: bold';
        break;
      case 'SYSTEM':
        formattedDirection = '⚙ SYSTEM';
        consoleStyle = 'color: #f39c12; font-weight: bold';
        break;
      default:
        formattedDirection = '• INFO';
        consoleStyle = 'color: #7f8c8d';
    }

    // Format message for logs
    const logEntry = {
      timestamp,
      direction: formattedDirection,
      rawDirection: direction,
      message: typeof message === 'object' ? JSON.parse(JSON.stringify(message)) : message,
      id: Date.now() + Math.random().toString(36).substr(2, 5)
    };

    // Add to trace logs, maintain max size
    this.traceLogs.push(logEntry);
    if (this.traceLogs.length > this.traceMaxLogs) {
      this.traceLogs.shift();
    }

    // Log to console with direction-specific styling
    console.groupCollapsed(`%c${formattedDirection}%c [${timestamp}]`, consoleStyle, 'color: gray');
    console.log(message);
    console.groupEnd();

    // Update UI if trace panel exists
    this.updateTracePanel();

    return logEntry;
  }

  /**
   * Update the trace panel in the UI if it exists
   */
  updateTracePanel() {
    const tracePanel = document.getElementById('claude-trace-panel');
    if (!tracePanel) return;

    const traceContent = document.getElementById('claude-trace-content');
    if (!traceContent) return;

    // Detect if dark mode is active
    const isDarkMode = document.body.classList.contains('dark-mode') ||
      document.documentElement.getAttribute('data-mode') === 'dark';

    // Clear existing content
    traceContent.innerHTML = '';

    // Add trace count and status information
    const traceHeader = document.createElement('div');
    traceHeader.style.cssText = `
      padding: 8px 10px;
      background: ${isDarkMode ? '#333' : '#f5f5f5'};
      border-radius: 6px;
      margin-bottom: 15px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const logsCount = this.traceLogs.length;
    const outboundCount = this.traceLogs.filter(log => log.rawDirection === 'OUTBOUND').length;
    const inboundCount = this.traceLogs.filter(log => log.rawDirection === 'INBOUND').length;

    traceHeader.innerHTML = `
      <div style="font-weight: 500;">
        <span>Total logs: ${logsCount}</span>
        <span style="margin-left: 10px; color: #3498db;">→ ${outboundCount}</span>
        <span style="margin-left: 10px; color: #2ecc71;">← ${inboundCount}</span>
      </div>
      <div>
        <span style="padding: 3px 6px; border-radius: 4px; background: ${this.tracingEnabled ? '#2ecc71' : '#e74c3c'}; color: white; font-size: 12px;">
          ${this.tracingEnabled ? 'TRACING ACTIVE' : 'TRACING DISABLED'}
        </span>
      </div>
    `;

    traceContent.appendChild(traceHeader);

    // Display logs (newest first)
    // Show the last 100 logs instead of just 20
    const recentLogs = this.traceLogs.slice(-100).reverse();

    if (recentLogs.length === 0) {
      traceContent.innerHTML += '<div style="text-align: center; padding: 40px; color: #7f8c8d; font-style: italic;">No trace logs available</div>';
      return;
    }

    // Group logs by date
    let currentDate = '';

    recentLogs.forEach(log => {
      const logDate = new Date(log.timestamp).toLocaleDateString();

      // Add date separator if date changed
      if (logDate !== currentDate) {
        currentDate = logDate;
        const dateSeparator = document.createElement('div');
        dateSeparator.style.cssText = `
          text-align: center;
          padding: 5px 0;
          margin: 15px 0 10px 0;
          font-weight: 600;
          color: ${isDarkMode ? '#aaa' : '#666'};
          border-bottom: 1px solid ${isDarkMode ? '#444' : '#ddd'};
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        dateSeparator.textContent = logDate;
        traceContent.appendChild(dateSeparator);
      }

      const logItem = document.createElement('div');
      logItem.className = 'claude-trace-item';
      logItem.style.cssText = `
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 6px;
        background: ${isDarkMode ? '#333' : '#f9f9f9'};
        border-left: 4px solid ${log.rawDirection === 'OUTBOUND' ? '#3498db' :
          log.rawDirection === 'INBOUND' ? '#2ecc71' :
            log.rawDirection === 'SYSTEM' ? '#f39c12' : '#95a5a6'
        };
        transition: all 0.2s ease;
      `;

      // Add hover effect
      logItem.addEventListener('mouseenter', (): any => {
        logItem.style.boxShadow = `0 2px 8px rgba(0,0,0,${isDarkMode ? '0.4' : '0.1'})`;
      });

      logItem.addEventListener('mouseleave', (): any => {
        logItem.style.boxShadow = 'none';
      });

      // Format timestamp
      const time = new Date(log.timestamp).toLocaleTimeString();

      // Format message for display
      let messageDisplay;
      if (typeof log.message === 'object') {
        try {
          const jsonString = JSON.stringify(log.message, null, 2);
          // Hide potentially sensitive values like API keys
          const redactedJson = jsonString.replace(/"(key|api_key|apiKey|token|secret)":\s*"([^"]{4})([^"]+)"/g, '"$1": "$2********"');

          messageDisplay = `<pre style="margin: 8px 0; padding: 8px; border-radius: 4px; background: ${isDarkMode ? '#222' : '#f5f5f5'}; max-height: 300px; overflow-y: auto;">${redactedJson}</pre>`;
        } catch (e) {
          messageDisplay = `<pre style="margin: 8px 0; padding: 8px; border-radius: 4px; background: ${isDarkMode ? '#222' : '#f5f5f5'};">[Complex Object]</pre>`;
        }
      } else {
        // Redact sensitive information in plain text
        const redactedMessage = String(log.message)
          .replace(/(key|api_key|apiKey|token|secret)[=:]?\s*([a-zA-Z0-9_-]{4})([a-zA-Z0-9_-]+)/g, '$1=$2********');

        messageDisplay = `<div style="margin: 8px 0; white-space: pre-wrap;">${redactedMessage}</div>`;
      }

      // Build HTML with improved formatting
      logItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: flex; align-items: center;">
            <span style="font-weight: 600; color: ${log.rawDirection === 'OUTBOUND' ? '#3498db' :
          log.rawDirection === 'INBOUND' ? '#2ecc71' :
            log.rawDirection === 'SYSTEM' ? '#f39c12' : '#95a5a6'
        }; margin-right: 8px; font-size: 15px;">${log.direction}</span>
            <span style="color: ${isDarkMode ? '#999' : '#666'}; font-size: 0.85em;">[${log.type}]</span>
          </div>
          <span style="color: ${isDarkMode ? '#999' : '#888'}; font-size: 0.85em;">${time}</span>
        </div>
        ${messageDisplay}
      `;

      traceContent.appendChild(logItem);
    });
  }

  /**
   * Create or show the trace panel in the UI
   */
  showTracePanel() {
    // If already exists, just show it
    let tracePanel = document.getElementById('claude-trace-panel');
    if (tracePanel) {
      tracePanel.style.display = 'block';
      this.updateTracePanel();
      return;
    }

    // Create the panel
    tracePanel = document.createElement('div');
    tracePanel.id = 'claude-trace-panel';

    // Detect if dark mode is active
    const isDarkMode = document.body.classList.contains('dark-mode') ||
      document.documentElement.getAttribute('data-mode') === 'dark';

    tracePanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 600px;
      height: 500px;
      background: ${isDarkMode ? '#2a2a2a' : '#f8f8f8'};
      color: ${isDarkMode ? '#e0e0e0' : '#333'};
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,${isDarkMode ? '0.5' : '0.2'});
      z-index: 2000;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid ${isDarkMode ? '#444' : '#ddd'};
      font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 13px;
      transition: all 0.3s ease;
    `;

    // Create header with controls
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 12px 15px;
      background: linear-gradient(135deg, #7026e3, #8e44ad);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 15px;
      cursor: move;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    `;

    header.innerHTML = `
      <span style="display: flex; align-items: center;">
        <span style="font-size: 18px; margin-right: 10px;">📊</span>
        <span>Claude Communication Trace</span>
      </span>
      <div style="display: flex; align-items: center;">
        <button id="claude-tracing-toggle" style="background: ${this.tracingEnabled ? '#9b59b6' : '#7026e3'}; border: none; color: white; padding: 6px 10px; margin-right: 10px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; transition: all 0.2s ease;">
          <span style="margin-right: 5px;">${this.tracingEnabled ? '⏸' : '▶️'}</span>
          ${this.tracingEnabled ? 'Disable' : 'Enable'} Tracing
        </button>
        <button id="claude-trace-export" style="background: #3498db; border: none; color: white; padding: 6px 10px; margin-right: 10px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; transition: all 0.2s ease;">
          <span style="margin-right: 5px;">📥</span>
          Export
        </button>
        <button id="claude-trace-clear" style="background: #e74c3c; border: none; color: white; padding: 6px 10px; margin-right: 10px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; transition: all 0.2s ease;">
          <span style="margin-right: 5px;">🗑️</span>
          Clear
        </button>
        <button id="claude-trace-close" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 16px; transition: all 0.2s ease;">
          ✕
        </button>
      </div>
    `;

    // Create content area
    const content = document.createElement('div');
    content.id = 'claude-trace-content';
    content.style.cssText = `
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
      background: ${isDarkMode ? '#222' : '#fff'};
      font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 13px;
      line-height: 1.5;
      scroll-behavior: smooth;
    `;

    // Assemble panel
    tracePanel.appendChild(header);
    tracePanel.appendChild(content);
    document.body.appendChild(tracePanel);

    // Add event listeners
    document.getElementById('claude-tracing-toggle').addEventListener('click', (): any => {
      this.setTracingEnabled(!this.tracingEnabled);
      document.getElementById('claude-tracing-toggle').innerHTML = `
        <span style="margin-right: 5px;">${this.tracingEnabled ? '⏸' : '▶️'}</span>
        ${this.tracingEnabled ? 'Disable' : 'Enable'} Tracing
      `;
      document.getElementById('claude-tracing-toggle').style.background = this.tracingEnabled ? '#9b59b6' : '#7026e3';
    });

    document.getElementById('claude-trace-clear').addEventListener('click', (): any => {
      this.traceLogs = [];
      this.traceLog('SYSTEM', 'Trace logs cleared');
      this.updateTracePanel();
    });

    document.getElementById('claude-trace-export').addEventListener('click', (): any => {
      const logText = this.traceLogs.map(log =>
        `[${log.timestamp}] [${log.type}] ${log.direction ? log.direction + ' ' : ''}${log.message}`
      ).join('\n');

      const blob = new Blob([logText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claude-trace-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.traceLog('SYSTEM', 'Trace logs exported');
    });

    document.getElementById('claude-trace-close').addEventListener('click', (): any => {
      tracePanel.style.display = 'none';
    });

    // Make draggable
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e): any => {
      if (e.target.tagName !== 'BUTTON') {
        isDragging = true;
        offsetX = e.clientX - tracePanel.getBoundingClientRect().left;
        offsetY = e.clientY - tracePanel.getBoundingClientRect().top;
      }
    });

    document.addEventListener('mousemove', (e): any => {
      if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        // Keep panel within viewport
        const maxX = window.innerWidth - tracePanel.offsetWidth;
        const maxY = window.innerHeight - tracePanel.offsetHeight;

        tracePanel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        tracePanel.style.right = 'auto';
        tracePanel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        tracePanel.style.bottom = 'auto';
      }
    });

    document.addEventListener('mouseup', (): any => {
      isDragging = false;
    });

    // Display initial traces
    this.updateTracePanel();

    // Log creation
    this.traceLog('SYSTEM', 'Trace panel created');
  }
}

// Initialize Claude AI when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Create Claude AI Helper
  window.claudeAI = new ClaudeAIHelper();

  // If site content is already loaded, initialize immediately
  if (window.siteContentData) {
    window.claudeAI.initialize();
  } else {
    // Wait for site content to load
    window.addEventListener('siteContent:loaded', function () {
      window.claudeAI.initialize();
    });

    // Fallback initialization after a delay
    setTimeout((): any => {
      if (!window.claudeAI.isInitialized) {
        console.log('Fallback initialization of Claude AI Helper');
        window.claudeAI.initialize();
      }
    }, 2000);
  }

  // Add Claude activation button to status bar
  const statusBar = document.getElementById('status-bar');
  if (statusBar) {
    const activateButton = document.createElement('button');
    activateButton.id = 'activate-claude-btn';
    activateButton.textContent = 'AI Assistant';
    activateButton.className = 'status-action-btn';
    activateButton.style.cssText = `
      background: #7026e3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
    `;

    // Add an AI icon
    activateButton.innerHTML = '<span style="margin-right: 5px;">✨</span> AI Assistant';

    activateButton.addEventListener('click', (): any => {
      // Toggle Claude AI panel visibility
      const panel = document.getElementById('claude-ai-panel');
      if (panel) {
        if (panel.style.display === 'none') {
          panel.style.display = 'flex';
        } else {
          panel.style.display = 'none';
        }
      } else {
        // Initialize if not already done
        if (!window.claudeAI.isInitialized) {
          window.claudeAI.initialize();
        } else {
          window.claudeAI.setupUI();
        }
      }
    });

    statusBar.appendChild(activateButton);
  }

  console.log('Claude AI module loaded');
});

// Add the CSS for Claude AI panel
const style = document.createElement('style');
style.textContent = `
  .claude-ai-panel {
    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif);
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .claude-ai-panel.minimized {
    height: auto;
    width: auto;
  }
  
  .claude-panel-header {
    user-select: none;
    cursor: grab;
  }
  
  .claude-panel-header:active {
    cursor: grabbing;
  }
  
  .claude-panel-content {
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
  }
  
  .claude-panel-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .claude-panel-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .claude-panel-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  .claude-panel-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  .dark-mode .claude-panel-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .dark-mode .claude-panel-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dark-mode .claude-panel-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  #claude-input,
  #claude-api-key-input {
    transition: all 0.2s ease;
    font-size: 14px;
  }
  
  #claude-input:focus,
  #claude-api-key-input:focus {
    outline: 2px solid #7026e3;
    border-color: transparent !important;
    box-shadow: 0 0 0 2px rgba(112, 38, 227, 0.2);
  }
  
  #claude-send-btn,
  #claude-apply-btn,
  #activate-claude-btn,
  #reset-content-btn {
    transition: all 0.2s ease;
  }
  
  #claude-send-btn:hover,
  #claude-apply-btn:hover,
  #activate-claude-btn:hover {
    background: #5a1cb8 !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  #reset-content-btn:hover {
    background: #c0392b !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  #claude-cancel-btn:hover {
    filter: brightness(0.9);
  }
  
  #claude-reset-btn {
    transition: transform 0.5s ease;
  }
  
  #claude-reset-btn:hover {
    transform: rotate(180deg);
  }
  
  .claude-changes-preview {
    font-family: 'Courier New', monospace;
    position: relative;
  }
  
  .claude-confirm-changes {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .claude-ai-panel {
      width: calc(100% - 40px) !important;
      left: 20px !important;
      right: 20px !important;
      bottom: 20px !important;
      top: auto !important;
    }
  }
`;
document.head.appendChild(style);
