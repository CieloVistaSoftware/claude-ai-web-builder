/**
 * WBBaseComponent Integration for Claude Logger
 * 
 * Add this code to your WBBaseComponent class to automatically
 * include the Claude Logger in all demo files.
 * 
 * Benefits:
 * - Automatic inclusion - no manual adding to demos
 * - Only loads in demo mode - not in production
 * - One-time setup - works for all components
 * - No modifications needed to individual demos
 */

// ============================================
// OPTION 1: Add to WBBaseComponent Constructor
// ============================================

class WBBaseComponent extends HTMLElement {
    constructor() {
        super();
        
        // Existing constructor code...
        
        // Add Claude Logger in demo mode
        this._initClaudeLogger();
    }
    
    /**
     * Initialize Claude Logger for demo mode
     * @private
     */
    _initClaudeLogger() {
        // Only run once per page
        if (window._claudeLoggerInitialized) return;
        
        // Only in demo mode
        if (!this._isDemoMode()) return;
        
        // Mark as initialized
        window._claudeLoggerInitialized = true;
        
        // Load the logger component
        this._loadClaudeLogger();
    }
    
    /**
     * Detect if running in demo mode
     * @private
     * @returns {boolean}
     */
    _isDemoMode() {
        // Method 1: Check URL for "demo"
        if (window.location.pathname.toLowerCase().includes('demo')) {
            return true;
        }
        
        // Method 2: Check page title
        if (document.title.toLowerCase().includes('demo')) {
            return true;
        }
        
        // Method 3: Check for demo attribute
        if (document.documentElement.hasAttribute('data-demo-mode')) {
            return true;
        }
        
        // Method 4: Check for localhost/development
        const isLocalhost = window.location.hostname === 'localhost' 
                         || window.location.hostname === '127.0.0.1'
                         || window.location.hostname === '';
        
        return isLocalhost;
    }
    
    /**
     * Load Claude Logger component dynamically
     * @private
     */
    _loadClaudeLogger() {
        // Calculate path to logger (adjust based on your structure)
        const loggerPath = this._getClaudeLoggerPath();
        
        // Load the script
        const script = document.createElement('script');
        script.type = 'module';
        script.src = loggerPath;
        
        script.onload = () => {
            // Add the component to the page
            if (!document.querySelector('wb-claude-logger')) {
                const logger = document.createElement('wb-claude-logger');
                
                // Get position from meta tag or use default
                const position = this._getLoggerPosition();
                if (position) {
                    logger.setAttribute('position', position);
                }
                
                // Get backend settings from meta tags
                const backendUrl = this._getLoggerBackendUrl();
                const useBackend = this._getLoggerUseBackend();
                
                if (backendUrl) {
                    logger.setAttribute('backend-url', backendUrl);
                }
                
                if (useBackend) {
                    logger.setAttribute('use-backend', 'true');
                }
                
                document.body.appendChild(logger);
            }
        };
        
        script.onerror = () => {
            console.warn('Claude Logger not found at:', loggerPath);
        };
        
        document.head.appendChild(script);
    }
    
    /**
     * Get path to Claude Logger
     * @private
     * @returns {string}
     */
    _getClaudeLoggerPath() {
        // Check for meta tag with custom path
        const metaPath = document.querySelector('meta[name="claude-logger-path"]');
        if (metaPath) {
            return metaPath.getAttribute('content');
        }
        
        // Default: assume logger is in components/wb-claude-logger/
        // Adjust based on your directory structure
        
        // Get current component path from script tag
        const currentScript = document.currentScript;
        if (currentScript) {
            const scriptPath = currentScript.src;
            // Navigate to components/wb-claude-logger/
            const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/components/'));
            return `${basePath}/components/wb-claude-logger/wb-claude-logger.js`;
        }
        
        // Fallback: relative path (works if all demos are at same depth)
        return '../../wb-claude-logger/wb-claude-logger.js';
    }
    
    /**
     * Get logger position from meta tag
     * @private
     * @returns {string|null}
     */
    _getLoggerPosition() {
        const meta = document.querySelector('meta[name="claude-logger-position"]');
        return meta ? meta.getAttribute('content') : null;
    }
    
    /**
     * Get backend URL from meta tag
     * @private
     * @returns {string|null}
     */
    _getLoggerBackendUrl() {
        const meta = document.querySelector('meta[name="claude-logger-backend-url"]');
        return meta ? meta.getAttribute('content') : null;
    }
    
    /**
     * Get backend usage flag from meta tag
     * @private
     * @returns {boolean}
     */
    _getLoggerUseBackend() {
        const meta = document.querySelector('meta[name="claude-logger-use-backend"]');
        return meta ? meta.getAttribute('content') === 'true' : false;
    }
}


// ============================================
// OPTION 2: Add to connectedCallback
// ============================================

class WBBaseComponent extends HTMLElement {
    connectedCallback() {
        // Initialize Claude Logger once per page
        if (!window._claudeLoggerInitialized && this._isDemoMode()) {
            window._claudeLoggerInitialized = true;
            this._loadClaudeLogger();
        }
        
        // Rest of your connectedCallback code...
    }
    
    // ... same helper methods as Option 1
}


// ============================================
// OPTION 3: Static Initialization (Recommended)
// ============================================

class WBBaseComponent extends HTMLElement {
    constructor() {
        super();
        
        // Existing constructor code...
    }
    
    connectedCallback() {
        // Existing connectedCallback code...
    }
}

// Initialize Claude Logger once when this module loads
WBBaseComponent._initClaudeLogger = (() => {
    // Only run once
    if (window._claudeLoggerInitialized) return;
    
    // Check if in demo mode
    const isDemoMode = window.location.pathname.toLowerCase().includes('demo')
                    || document.title.toLowerCase().includes('demo')
                    || window.location.hostname === 'localhost'
                    || window.location.hostname === '127.0.0.1';
    
    if (!isDemoMode) return;
    
    window._claudeLoggerInitialized = true;
    
    // Load logger when DOM is ready
    const loadLogger = () => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '../../wb-claude-logger/wb-claude-logger.js';
        
        script.onload = () => {
            if (!document.querySelector('wb-claude-logger')) {
                const logger = document.createElement('wb-claude-logger');
                document.body.appendChild(logger);
            }
        };
        
        document.head.appendChild(script);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLogger);
    } else {
        loadLogger();
    }
})();


// ============================================
// USAGE IN DEMO FILES
// ============================================

/*
BEFORE (with manual logger):
────────────────────────────────────────────
<!DOCTYPE html>
<html lang="en">
<head>
    <title>wb-button Demo</title>
</head>
<body>
    <h1>Button Demo</h1>
    <wb-button>Click Me</wb-button>
    
    <script type="module" src="./wb-button.js"></script>
    
    <!-- Manual logger inclusion -->
    <script type="module" src="../../wb-claude-logger/wb-claude-logger.js"></script>
    <wb-claude-logger></wb-claude-logger>
</body>
</html>


AFTER (with WBBaseComponent integration):
────────────────────────────────────────────
<!DOCTYPE html>
<html lang="en">
<head>
    <title>wb-button Demo</title>
</head>
<body>
    <h1>Button Demo</h1>
    <wb-button>Click Me</wb-button>
    
    <script type="module" src="./wb-button.js"></script>
    
    <!-- That's it! Logger auto-loads -->
</body>
</html>


OPTIONAL: Configure logger with meta tags
────────────────────────────────────────────
<!DOCTYPE html>
<html lang="en">
<head>
    <title>wb-button Demo</title>
    
    <!-- Optional: Customize logger -->
    <meta name="claude-logger-position" content="top-left">
    <meta name="claude-logger-backend-url" content="http://localhost:3000/api/log">
    <meta name="claude-logger-use-backend" content="true">
</head>
<body>
    <h1>Button Demo</h1>
    <wb-button>Click Me</wb-button>
    
    <script type="module" src="./wb-button.js"></script>
</body>
</html>
*/


// ============================================
// PRODUCTION MODE: Disable Logger
// ============================================

/*
Method 1: Remove "demo" from filename
────────────────────────────────────────
demo.html → index.html  (logger won't load)

Method 2: Add data attribute
────────────────────────────────────────
<html data-production-mode>  (check in _isDemoMode)

Method 3: Environment variable
────────────────────────────────────────
if (process.env.NODE_ENV === 'production') return;

Method 4: Build step
────────────────────────────────────────
Build process removes logger code in production
*/

export default WBBaseComponent;
