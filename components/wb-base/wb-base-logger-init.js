/**
 * Auto-initialize Claude Logger in demo mode
 * 
 * This module automatically loads the Claude Logger when:
 * - URL contains "demo"
 * - OR page title contains "demo"
 * - OR running on localhost
 * 
 * Only loads once per page. Does NOT load in production.
 * 
 * Separated from WBBaseComponent to keep base class lean.
 */

function initClaudeLogger() {
  // Only run once per page
  if (window._claudeLoggerInitialized) return;
  
  // Detect demo mode
  const isDemoMode = 
    window.location.pathname.toLowerCase().includes('demo')
    || document.title.toLowerCase().includes('demo')
    || window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1';
  
  // Only initialize in demo mode
  if (!isDemoMode) return;
  
  // Mark as initialized
  window._claudeLoggerInitialized = true;
  
  // Load logger when DOM is ready
  const loadLogger = () => {
    const script = document.createElement('script');
    script.type = 'module';
    
    // Add version to force cache refresh
    script.src = '/components/wb-claude-logger/wb-claude-logger/wb-claude-logger.js?v=' + Date.now();
    
    script.onload = () => {
      // Add logger to page if not already present
      if (!document.querySelector('wb-claude-logger')) {
        const logger = document.createElement('wb-claude-logger');
        
        // Enable backend by default (save to claude.md files)
        logger.setAttribute('use-backend', 'true');
        
        // Optional: Read configuration from meta tags
        const position = document.querySelector('meta[name="claude-logger-position"]');
        if (position) {
          logger.setAttribute('position', position.getAttribute('content'));
        }
        
        // Allow meta tag to override backend setting
        const useBackendMeta = document.querySelector('meta[name="claude-logger-use-backend"]');
        if (useBackendMeta) {
          logger.setAttribute('use-backend', useBackendMeta.getAttribute('content'));
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
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initClaudeLogger();
}

export { initClaudeLogger };
