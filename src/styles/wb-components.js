/**
 * WB Components Bundle Loader
 * Loads commonly used WB components in the correct order
 */

// Component loading queue - EMPTY for now since components load via index.js
// This file kept for backward compatibility but does nothing
const componentQueue = [];

// Dispatch event immediately since no components to load
window.dispatchEvent(new CustomEvent('wb-components-ready'));
console.log('🎉 All WB components loaded');