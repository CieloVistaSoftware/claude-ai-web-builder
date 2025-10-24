// @ts-nocheck
/**
 * Environment Variables Compatibility Layer
 *
 * DEPRECATED: This file is no longer used for API key management.
 * All Claude API communications now use WebSockets directly.
 * This file exists only for backwards compatibility.
 */
(function () {
    // Initialize empty env object for compatibility
    window._env = {};
    // Simple no-op functions for backwards compatibility
    window.envLoader = {
        loadEnvironmentVariables: () => console.log('Environment variables now managed via WebSockets'),
        setTemporaryApiKey: () => console.log('API keys now managed via WebSockets'),
        clearApiKey: () => console.log('API keys now managed via WebSockets')
    };
    // Minimal property accessor for backward compatibility
    Object.defineProperty(window, 'env', {
        get: function () {
            console.warn('⚠️ env object is deprecated. API keys now managed via WebSockets');
            return this._env;
        },
        set: function (newValue) {
            this._env = newValue;
        }
    });
})();
