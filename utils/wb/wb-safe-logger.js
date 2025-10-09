/**
 * WB Safe Logger - Reactive Logging with Console Fallback
 * 
 * Purpose: Provide safe logging that works whether WBEventLog is loaded or not
 * 
 * Design Philosophy:
 * - Reactive when possible (uses WBEventLog if available)
 * - Graceful degradation (falls back to console when WBEventLog not loaded)
 * - Zero dependencies (can be loaded before any other component)
 * - Simple API matching WBEventLog interface
 * 
 * Usage:
 *   WBSafeLogger.info('Message', { component: 'wb-color-bar', line: 123 });
 *   WBSafeLogger.error('Error occurred', { component: 'wb-nav', error: e });
 *   WBSafeLogger.success('Component loaded', { component: 'wb-toggle' });
 * 
 * Created: October 8, 2025
 * Reason: Components were crashing with "WBEventLog is not defined" errors
 */

(function() {
    'use strict';

    /**
     * Safe Logger - Works with or without WBEventLog
     */
    window.WBSafeLogger = {
        /**
         * Core logging method
         * @param {string} message - Log message
         * @param {object} context - Context object (component, line, method, etc.)
         * @param {string} level - Log level: info, success, warning, error, debug, user
         */
        log(message, context = {}, level = 'info') {
            // Add timestamp if not present
            if (!context.timestamp) {
                context.timestamp = new Date().toISOString();
            }

            // Try reactive logging first (WBEventLog)
            if (window.WBEventLog && typeof window.WBEventLog.logInfo === 'function') {
                const methodMap = {
                    'info': 'logInfo',
                    'success': 'logSuccess',
                    'warning': 'logWarning',
                    'error': 'logError',
                    'debug': 'logDebug',
                    'user': 'logUser'
                };
                
                const method = methodMap[level] || 'logInfo';
                
                try {
                    window.WBEventLog[method](message, context);
                    return; // Success - reactive logging worked
                } catch (e) {
                    // Fall through to console fallback if WBEventLog method fails
                }
            }
            
            // Fallback to console logging
            this._consoleLog(message, context, level);
        },

        /**
         * Console fallback logging
         * @private
         */
        _consoleLog(message, context, level) {
            const timestamp = context.timestamp ? 
                new Date(context.timestamp).toISOString().substring(11, 23) : 
                new Date().toISOString().substring(11, 23);
            
            const prefix = context.component ? `[${context.component}]` : '';
            const lineInfo = context.line ? `:${context.line}` : '';
            const methodInfo = context.method ? `.${context.method}()` : '';
            
            const fullPrefix = `${timestamp} ${prefix}${methodInfo}${lineInfo}`;
            
            // Choose console method based on level
            const consoleMethod = 
                level === 'error' ? 'error' :
                level === 'warning' ? 'warn' :
                level === 'debug' ? 'debug' :
                'log';
            
            // Format output
            if (context.error) {
                console[consoleMethod](fullPrefix, message, context, context.error);
            } else if (Object.keys(context).length > 2) { // More than just timestamp and component
                console[consoleMethod](fullPrefix, message, context);
            } else {
                console[consoleMethod](fullPrefix, message);
            }
        },

        /**
         * Convenience methods matching WBEventLog API
         */
        info(message, context = {}) {
            this.log(message, context, 'info');
        },

        success(message, context = {}) {
            this.log(message, context, 'success');
        },

        warning(message, context = {}) {
            this.log(message, context, 'warning');
        },

        error(message, context = {}) {
            this.log(message, context, 'error');
        },

        debug(message, context = {}) {
            this.log(message, context, 'debug');
        },

        user(message, context = {}) {
            this.log(message, context, 'user');
        },

        /**
         * Check if reactive logging (WBEventLog) is available
         * @returns {boolean}
         */
        isReactive() {
            return !!(window.WBEventLog && typeof window.WBEventLog.logInfo === 'function');
        },

        /**
         * Get current logging mode
         * @returns {string} 'reactive' or 'console'
         */
        getMode() {
            return this.isReactive() ? 'reactive' : 'console';
        }
    };

    // Log that safe logger is ready
    WBSafeLogger.debug('WBSafeLogger initialized', { 
        component: 'wb-safe-logger',
        mode: WBSafeLogger.getMode(),
        reactive: WBSafeLogger.isReactive()
    });

})();
