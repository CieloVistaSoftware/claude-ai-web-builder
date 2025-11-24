/**
 * Claude Logger Utility
 * Logs component interactions, events, and issues to claude.md files
 * 
 * Usage:
 * ClaudeLogger.log('Issue found', 'Button not responding in dark mode', 'error');
 * ClaudeLogger.logInteraction('Clicked primary button', { variant: 'primary' });
 * ClaudeLogger.logTest('Color picker test', 'passed', 'All colors render correctly');
 */

class ClaudeLogger {
    constructor() {
        this.config = null;
        this.currentComponent = null;
        this.sessionLogs = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            const response = await fetch('/src/config/components.config.json');
            if (response.ok) {
                const config = await response.json();
                this.config = config.claudeLogging || { enabled: false };
            } else {
                this.config = { enabled: false };
            }
            
            // Detect current component from URL or path
            this.detectCurrentComponent();
            
            this.initialized = true;
            console.log('📝 Claude Logger initialized:', this.config);
        } catch (error) {
            console.warn('⚠️ Failed to initialize Claude Logger:', error);
            this.config = { enabled: false };
        }
    }

    detectCurrentComponent() {
        // Try to detect component from current page path
        const path = window.location.pathname;
        
        // Match patterns like /components/wb-button/demo.html
        const componentMatch = path.match(/\/components\/(wb-[^\/]+)\//);
        if (componentMatch) {
            this.currentComponent = componentMatch[1];
            console.log('📦 Detected component:', this.currentComponent);
            return;
        }

        // Check if there's a component element on the page
        const componentElement = document.querySelector('[data-component-name]');
        if (componentElement) {
            this.currentComponent = componentElement.getAttribute('data-component-name');
            console.log('📦 Detected component from element:', this.currentComponent);
            return;
        }

        // Try to find any wb- custom element
        const wbElements = document.querySelectorAll('[class*="wb-"], [id*="wb-"]');
        if (wbElements.length > 0) {
            const firstElement = wbElements[0];
            const className = firstElement.className || '';
            const match = className.match(/wb-[\w-]+/);
            if (match) {
                this.currentComponent = match[0];
                console.log('📦 Detected component from class:', this.currentComponent);
            }
        }
    }

    async isEnabled() {
        if (!this.initialized) await this.init();
        return this.config && this.config.enabled === true;
    }

    /**
     * Main logging method - writes to claude.md file
     * @param {string} title - Log entry title
     * @param {string} message - Detailed message
     * @param {string} type - Log type: 'issue', 'note', 'test', 'fix', 'error', 'info'
     * @param {object} metadata - Additional metadata
     */
    async log(title, message, type = 'note', metadata = {}) {
        if (!(await this.isEnabled())) return;

        const entry = this.formatLogEntry(title, message, type, metadata);
        this.sessionLogs.push(entry);

        // Send to server to write to claude.md
        await this.writeToClaudeMd(entry);

        // Also log to console for visibility
        console.log(`📝 [Claude Log - ${type}]`, title, message);
    }

    /**
     * Log a user interaction (button click, input change, etc.)
     */
    async logInteraction(action, details = {}) {
        if (!this.config.logUserInteractions) return;
        
        await this.log(
            `User Interaction: ${action}`,
            JSON.stringify(details, null, 2),
            'info',
            { category: 'interaction', ...details }
        );
    }

    /**
     * Log a component event
     */
    async logEvent(eventName, eventData = {}) {
        if (!this.config.logComponentEvents) return;
        
        await this.log(
            `Event: ${eventName}`,
            JSON.stringify(eventData, null, 2),
            'info',
            { category: 'event', eventName, ...eventData }
        );
    }

    /**
     * Log an error or issue
     */
    async logError(error, context = {}) {
        if (!this.config.logErrors) return;
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : '';
        
        await this.log(
            `Error: ${errorMessage}`,
            `**Stack Trace:**\n\`\`\`\n${stack}\n\`\`\`\n\n**Context:** ${JSON.stringify(context, null, 2)}`,
            'error',
            { category: 'error', errorMessage, ...context }
        );
    }

    /**
     * Log a test result
     */
    async logTest(testName, result, details = '') {
        const status = result === 'passed' ? '✅' : result === 'failed' ? '❌' : '⚠️';
        
        await this.log(
            `Test: ${testName}`,
            `**Result:** ${status} ${result}\n\n${details}`,
            result === 'passed' ? 'info' : 'issue',
            { category: 'test', testName, result, details }
        );
    }

    /**
     * Log a fix or solution
     */
    async logFix(issue, solution) {
        await this.log(
            `Fix Applied: ${issue}`,
            `**Solution:** ${solution}`,
            'fix',
            { category: 'fix', issue, solution }
        );
    }

    /**
     * Quick issue logging - for when something isn't working
     */
    async logIssue(description, expectedBehavior, actualBehavior) {
        await this.log(
            `Issue: ${description}`,
            `**Expected:** ${expectedBehavior}\n\n**Actual:** ${actualBehavior}`,
            'issue',
            { category: 'issue', description, expectedBehavior, actualBehavior }
        );
    }

    formatLogEntry(title, message, type, metadata) {
        const timestamp = this.config.timestampFormat === 'ISO' 
            ? new Date().toISOString() 
            : new Date().toLocaleString();

        const typeEmoji = {
            'issue': '🔴',
            'error': '❌',
            'fix': '✅',
            'test': '🧪',
            'note': '📝',
            'info': 'ℹ️'
        };

        return {
            timestamp,
            title,
            message,
            type,
            emoji: typeEmoji[type] || '📝',
            component: this.currentComponent || 'unknown',
            metadata,
            url: window.location.href
        };
    }

    async writeToClaudeMd(entry) {
        try {
            // Send to server endpoint that will append to claude.md
            const response = await fetch('/api/claude-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    component: entry.component,
                    entry: entry
                })
            });

            if (!response.ok) {
                console.warn('⚠️ Failed to write to claude.md:', response.statusText);
            }
        } catch (error) {
            console.warn('⚠️ Could not write to claude.md (server not available):', error.message);
            // Fallback: store in localStorage for manual retrieval
            this.storeInLocalStorage(entry);
        }
    }

    storeInLocalStorage(entry) {
        const storageKey = `claude-logs-${entry.component}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existing.push(entry);
        
        // Keep only last 50 entries per component
        if (existing.length > 50) {
            existing.shift();
        }
        
        localStorage.setItem(storageKey, JSON.stringify(existing));
        console.log('💾 Log stored in localStorage (server unavailable)');
    }

    /**
     * Export session logs to download (fallback when server unavailable)
     */
    exportSessionLogs() {
        const component = this.currentComponent || 'unknown';
        const markdown = this.formatLogsAsMarkdown(this.sessionLogs);
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${component}-session-log-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📥 Session logs exported');
    }

    formatLogsAsMarkdown(logs) {
        let markdown = `# Session Log - ${this.currentComponent || 'Component'}\n\n`;
        markdown += `**Session Date:** ${new Date().toLocaleString()}\n\n`;
        markdown += `---\n\n`;

        logs.forEach(log => {
            markdown += `## ${log.emoji} ${log.title}\n\n`;
            markdown += `**Timestamp:** ${log.timestamp}\n\n`;
            markdown += `**Type:** ${log.type}\n\n`;
            markdown += `${log.message}\n\n`;
            
            if (Object.keys(log.metadata).length > 0) {
                markdown += `**Metadata:**\n\`\`\`json\n${JSON.stringify(log.metadata, null, 2)}\n\`\`\`\n\n`;
            }
            
            markdown += `---\n\n`;
        });

        return markdown;
    }

    /**
     * Retrieve logs from localStorage
     */
    getStoredLogs(component = null) {
        const comp = component || this.currentComponent;
        if (!comp) return [];
        
        const storageKey = `claude-logs-${comp}`;
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

    /**
     * Clear stored logs
     */
    clearStoredLogs(component = null) {
        const comp = component || this.currentComponent;
        if (!comp) return;
        
        const storageKey = `claude-logs-${comp}`;
        localStorage.removeItem(storageKey);
        console.log('🗑️ Cleared stored logs for', comp);
    }
}

// Create global singleton
window.ClaudeLogger = new ClaudeLogger();

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ClaudeLogger.init());
} else {
    window.ClaudeLogger.init();
}

// Expose convenient shortcuts
window.logIssue = (desc, expected, actual) => window.ClaudeLogger.logIssue(desc, expected, actual);
window.logFix = (issue, solution) => window.ClaudeLogger.logFix(issue, solution);
window.logTest = (name, result, details) => window.ClaudeLogger.logTest(name, result, details);
window.logNote = (title, message) => window.ClaudeLogger.log(title, message, 'note');

console.log('📝 Claude Logger loaded. Use: logIssue(), logFix(), logTest(), logNote()');

export default ClaudeLogger;
