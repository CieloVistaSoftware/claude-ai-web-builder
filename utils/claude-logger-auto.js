/**
 * Auto-Loader for Claude Logger
 * Include this script in any demo/test HTML to automatically enable logging
 * 
 * Usage in HTML:
 * <script src="../../utils/claude-logger-auto.js"></script>
 * 
 * The script will:
 * 1. Auto-detect the component from the file path
 * 2. Initialize ClaudeLogger
 * 3. Make quick functions globally available
 * 4. Add visual indicator that logging is active
 */

(async function() {
    // Dynamically import the ClaudeLogger module
    const { default: ClaudeLogger } = await import('./claude-logger.js');
    
    // Initialize
    await ClaudeLogger.init();
    
    // Auto-detect component from URL path
    const path = window.location.pathname;
    const componentMatch = path.match(/\/components\/(wb-[^\/]+)/);
    if (componentMatch) {
        ClaudeLogger.currentComponent = componentMatch[1];
        console.log(`📝 Claude Logger active for: ${componentMatch[1]}`);
    }
    
    // Make logger globally available
    window.ClaudeLogger = ClaudeLogger;
    
    // Add visual indicator
    addLoggingIndicator();
    
    // Show welcome message
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   📝 CLAUDE LOGGER ACTIVE                  ║
╚═══════════════════════════════════════════════════════════╝

Quick Commands:
  logIssue(desc, expected, actual)  - Log a bug/issue
  logFix(issue, solution)           - Log a fix
  logTest(name, result, details)    - Log test result
  logNote(title, message)           - Log a note

Examples:
  logIssue('Button broken', 'Should click', 'Does nothing')
  logFix('Event handler', 'Added listener')
  logTest('Click test', 'passed', 'Works now')

Component: ${ClaudeLogger.currentComponent || 'unknown'}
Logs will be saved to: components/${ClaudeLogger.currentComponent || 'unknown'}/claude.md

Happy testing! 🎉
`);
    
})();

/**
 * Add a subtle visual indicator that logging is active
 */
function addLoggingIndicator() {
    // Create indicator element
    const indicator = document.createElement('div');
    indicator.id = 'claude-logger-indicator';
    indicator.innerHTML = '📝';
    indicator.title = 'Claude Logger Active - Click to view session logs';
    
    // Style it
    Object.assign(indicator.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        background: 'rgba(99, 102, 241, 0.9)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: '9999',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        userSelect: 'none'
    });
    
    // Hover effect
    indicator.addEventListener('mouseenter', () => {
        indicator.style.transform = 'scale(1.1)';
        indicator.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.5)';
    });
    
    indicator.addEventListener('mouseleave', () => {
        indicator.style.transform = 'scale(1)';
        indicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    });
    
    // Click to show session logs
    indicator.addEventListener('click', () => {
        showSessionLogsModal();
    });
    
    // Add to page
    document.body.appendChild(indicator);
    
    // Pulse animation on new log
    window.addEventListener('wb:log', () => {
        indicator.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 500);
    });
    
    // Add pulse animation style
    if (!document.getElementById('claude-logger-styles')) {
        const style = document.createElement('style');
        style.id = 'claude-logger-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show modal with session logs
 */
function showSessionLogsModal() {
    const logs = window.ClaudeLogger.sessionLogs;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: #1e1e1e;
        color: #fff;
        padding: 2rem;
        border-radius: 8px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    `;
    
    const title = document.createElement('h2');
    title.textContent = `📝 Session Logs (${logs.length})`;
    title.style.marginTop = '0';
    content.appendChild(title);
    
    if (logs.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No logs in current session. Start testing and use logIssue(), logFix(), logTest(), or logNote()!';
        empty.style.color = '#888';
        content.appendChild(empty);
    } else {
        logs.forEach(log => {
            const entry = document.createElement('div');
            entry.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                background: #2a2a2a;
                border-left: 4px solid #6366f1;
                border-radius: 4px;
            `;
            
            entry.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 0.5rem;">
                    ${log.emoji} ${log.title}
                </div>
                <div style="font-size: 0.85rem; color: #888; margin-bottom: 0.5rem;">
                    ${log.timestamp} • ${log.type}
                </div>
                <div style="white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">
                    ${log.message}
                </div>
            `;
            
            content.appendChild(entry);
        });
    }
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;';
    
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📥 Export Logs';
    exportBtn.style.cssText = 'padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;';
    exportBtn.onclick = () => {
        window.ClaudeLogger.exportSessionLogs();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;';
    closeBtn.onclick = () => modal.remove();
    
    buttonContainer.appendChild(exportBtn);
    buttonContainer.appendChild(closeBtn);
    content.appendChild(buttonContainer);
    
    modal.appendChild(content);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modal);
}

export default {};
