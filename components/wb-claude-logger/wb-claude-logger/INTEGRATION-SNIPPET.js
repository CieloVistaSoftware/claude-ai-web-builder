/**
 * ═══════════════════════════════════════════════════════════════════
 * COPY THIS CODE TO wb-base.js (at the very end, before export)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This auto-loads the Claude Logger in all demo files!
 * No need to manually add it to each demo.
 */

// Auto-load Claude Logger in demo mode
WBBaseComponent._initClaudeLogger = (() => {
    // Only run once per page
    if (window._claudeLoggerInitialized) return;
    
    // Detect demo mode
    const isDemoMode = window.location.pathname.toLowerCase().includes('demo')
                    || document.title.toLowerCase().includes('demo')
                    || window.location.hostname === 'localhost'
                    || window.location.hostname === '127.0.0.1';
    
    if (!isDemoMode) return;
    
    // Mark as initialized
    window._claudeLoggerInitialized = true;
    
    // Load logger when DOM is ready
    const loadLogger = () => {
        const script = document.createElement('script');
        script.type = 'module';
        
        // 🔧 ADJUST THIS PATH based on your directory structure
        script.src = '/components/wb-claude-logger/wb-claude-logger.js';
        
        script.onload = () => {
            // Add logger to page if not already present
            if (!document.querySelector('wb-claude-logger')) {
                const logger = document.createElement('wb-claude-logger');
                
                // Optional: Read configuration from meta tags
                const position = document.querySelector('meta[name="claude-logger-position"]');
                if (position) {
                    logger.setAttribute('position', position.getAttribute('content'));
                }
                
                const useBackend = document.querySelector('meta[name="claude-logger-use-backend"]');
                if (useBackend && useBackend.getAttribute('content') === 'true') {
                    logger.setAttribute('use-backend', 'true');
                }
                
                document.body.appendChild(logger);
            }
        };
        
        script.onerror = () => {
            console.warn('Claude Logger not available at:', script.src);
        };
        
        document.head.appendChild(script);
    };
    
    // Load when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLogger);
    } else {
        loadLogger();
    }
})();

/**
 * ═══════════════════════════════════════════════════════════════════
 * THAT'S IT! Now every demo automatically has the 📝 logger button
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Optional: Customize per demo with meta tags in <head>:
 * 
 * <meta name="claude-logger-position" content="top-left">
 * <meta name="claude-logger-use-backend" content="true">
 * 
 * The logger will only load when:
 * ✅ URL contains "demo"
 * ✅ OR title contains "demo"
 * ✅ OR running on localhost
 * 
 * Production pages are NOT affected! 🎉
 */
