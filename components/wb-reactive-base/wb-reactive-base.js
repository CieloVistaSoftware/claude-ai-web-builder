/**
 * WB Reactive Base Component
 * Extends WBBaseComponent with Proxy-based reactive state management
 * 
 * Features:
 * - Automatic UI updates when state changes
 * - Batched updates using requestAnimationFrame
 * - Deep object reactivity
 * - State change callbacks
 * - Performance optimized
 * 
 * Usage:
 *   class MyComponent extends WBReactiveBase {
 *       constructor() {
 *           super();
 *           this.state = { count: 0 }; // Reactive!
 *       }
 *       
 *       render() {
 *           this.innerHTML = `<div>Count: ${this.state.count}</div>`;
 *       }
 *   }
 * 
 * @version 1.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBReactiveBase extends WBBaseComponent {
    constructor() {
        super();
        
        // Internal state storage
        this._reactiveState = {};
        
        // Update batching
        this._updateScheduled = false;
        this._stateChangeQueue = [];
        
        // Performance tracking
        this._renderCount = 0;
        this._lastRenderTime = 0;
        
        // Create reactive state proxy
        this._state = this._createReactiveProxy({});
        
        this.logDebug('WBReactiveBase: Constructor initialized', {
            component: this.tagName?.toLowerCase()
        });
    }
    
    // ===== REACTIVE STATE MANAGEMENT =====
    
    /**
     * Get the reactive state object
     * All changes to this object trigger UI updates
     */
    get state() {
        return this._state;
    }
    
    /**
     * Set the entire state object
     * Creates a new reactive proxy
     */
    set state(newState) {
        if (typeof newState !== 'object' || newState === null) {
            this.logError('State must be an object', { attempted: newState });
            return;
        }
        
        this._state = this._createReactiveProxy(newState);
        this.requestUpdate();
    }
    
    /**
     * Create a reactive proxy for an object
     * Supports nested objects and arrays
     * @private
     */
    _createReactiveProxy(target) {
        const self = this;
        
        // Handle arrays
        if (Array.isArray(target)) {
            return new Proxy(target, {
                set(arr, property, value) {
                    const oldValue = arr[property];
                    arr[property] = value;
                    
                    if (oldValue !== value) {
                        self._onStateChange(property, value, oldValue);
                    }
                    return true;
                }
            });
        }
        
        // Handle objects
        return new Proxy(target, {
            set(obj, property, value) {
                const oldValue = obj[property];
                
                // Make nested objects reactive
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    value = self._createReactiveProxy(value);
                }
                
                obj[property] = value;
                
                // Only trigger update if value actually changed
                if (oldValue !== value) {
                    self._onStateChange(property, value, oldValue);
                }
                
                return true;
            },
            
            get(obj, property) {
                const value = obj[property];
                
                // Return reactive proxy for nested objects
                if (value && typeof value === 'object' && !self._isProxy(value)) {
                    obj[property] = self._createReactiveProxy(value);
                    return obj[property];
                }
                
                return value;
            }
        });
    }
    
    /**
     * Check if object is already a proxy
     * @private
     */
    _isProxy(obj) {
        try {
            return obj === new Proxy(obj, {});
        } catch {
            return false;
        }
    }
    
    // ===== STATE CHANGE HANDLING =====
    
    /**
     * Called when state changes
     * Override in subclass for custom behavior
     * @param {string} property - Property that changed
     * @param {any} newValue - New value
     * @param {any} oldValue - Old value
     */
    _onStateChange(property, newValue, oldValue) {
        // Add to change queue
        this._stateChangeQueue.push({ property, newValue, oldValue });
        
        // Log state change
        this.logDebug(`State changed: ${property}`, {
            component: this.tagName?.toLowerCase(),
            old: oldValue,
            new: newValue
        });
        
        // Dispatch state change event
        this.fireEvent('wb:state-changed', {
            property,
            newValue,
            oldValue,
            state: { ...this._state }
        });
        
        // Request UI update
        this.requestUpdate();
        
        // Call lifecycle hook (override in subclass)
        if (typeof this.onStateChange === 'function') {
            this.onStateChange(property, newValue, oldValue);
        }
    }
    
    // ===== UPDATE BATCHING =====
    
    /**
     * Request a UI update
     * Updates are batched using requestAnimationFrame
     */
    requestUpdate() {
        if (this._updateScheduled) return;
        
        this._updateScheduled = true;
        
        requestAnimationFrame(() => {
            this._updateScheduled = false;
            this._performUpdate();
        });
    }
    
    /**
     * Perform the actual update
     * @private
     */
    _performUpdate() {
        const startTime = performance.now();
        
        try {
            // Call update hook (override in subclass)
            if (typeof this.beforeUpdate === 'function') {
                this.beforeUpdate(this._stateChangeQueue);
            }
            
            // Call render
            if (typeof this.render === 'function') {
                this.render();
                this._renderCount++;
            }
            
            // Call after update hook
            if (typeof this.afterUpdate === 'function') {
                this.afterUpdate(this._stateChangeQueue);
            }
            
            // Clear change queue
            this._stateChangeQueue = [];
            
            // Track performance
            this._lastRenderTime = performance.now() - startTime;
            
            // Dispatch update complete event
            this.fireEvent('wb:updated', {
                renderCount: this._renderCount,
                renderTime: this._lastRenderTime
            });
            
        } catch (error) {
            this.reportError(error, {
                action: 'performUpdate',
                component: this.tagName?.toLowerCase()
            });
        }
    }
    
    // ===== LIFECYCLE HOOKS =====
    
    /**
     * Called before update
     * Override in subclass
     * @param {Array} changes - Array of state changes
     */
    beforeUpdate(changes) {
        // Override in subclass
    }
    
    /**
     * Render the component
     * Override in subclass - REQUIRED
     */
    render() {
        // Override in subclass
        this.logError('render() method not implemented', {
            component: this.tagName?.toLowerCase()
        });
    }
    
    /**
     * Called after update
     * Override in subclass
     * @param {Array} changes - Array of state changes
     */
    afterUpdate(changes) {
        // Override in subclass
    }
    
    /**
     * Called when any state property changes
     * Override in subclass for global state change handling
     * @param {string} property - Property that changed
     * @param {any} newValue - New value
     * @param {any} oldValue - Old value
     */
    onStateChange(property, newValue, oldValue) {
        // Override in subclass
    }
    
    // ===== UTILITY METHODS =====
    
    /**
     * Update multiple state properties at once
     * More efficient than updating individually
     * @param {Object} updates - Object with properties to update
     */
    setState(updates) {
        if (typeof updates !== 'object' || updates === null) {
            this.logError('setState requires an object', { attempted: updates });
            return;
        }
        
        Object.entries(updates).forEach(([key, value]) => {
            this._state[key] = value;
        });
    }
    
    /**
     * Get current state as plain object (non-reactive)
     * Useful for debugging or serialization
     */
    getState() {
        return JSON.parse(JSON.stringify(this._state));
    }
    
    /**
     * Reset state to initial values
     * @param {Object} initialState - Initial state object
     */
    resetState(initialState = {}) {
        this._state = this._createReactiveProxy(initialState);
        this.requestUpdate();
    }
    
    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            renderCount: this._renderCount,
            lastRenderTime: this._lastRenderTime,
            averageRenderTime: this._renderCount > 0 
                ? this._lastRenderTime / this._renderCount 
                : 0
        };
    }
    
    // ===== DEBUGGING =====
    
    /**
     * Log current state to console
     */
    logState() {
        console.group(`🔄 State: ${this.tagName?.toLowerCase()}`);
        console.log('Current State:', this.getState());
        console.log('Metrics:', this.getMetrics());
        console.groupEnd();
    }
    
    /**
     * Watch a specific state property
     * @param {string} property - Property to watch
     * @param {Function} callback - Called when property changes
     */
    watch(property, callback) {
        if (typeof callback !== 'function') {
            this.logError('watch() requires a callback function');
            return;
        }
        
        // Listen for state changes
        this.addEventListener('wb:state-changed', (e) => {
            if (e.detail.property === property) {
                callback(e.detail.newValue, e.detail.oldValue);
            }
        });
    }
}

// ===== REGISTRATION =====

// Make available globally
if (typeof window !== 'undefined') {
    window.WBReactiveBase = WBReactiveBase;
    
    // Compositional namespace
    if (!window.WB) window.WB = { components: {}, utils: {} };
    window.WB.components.WBReactiveBase = WBReactiveBase;
}

// ES6 Module Export
export { WBReactiveBase };
export default WBReactiveBase;

console.log('✅ WB Reactive Base Component loaded');
