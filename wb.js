// WB Component Registry - MUST load first before all components
import './utils/wb/wb-component-utils.js';
import './utils/wb/wb-component-registry.js';

import '../components/wb-control-panel/wb-control-panel.js';
import '../components/wb-layout/wb-layout.js';
import '../components/wb-nav/wb-nav.js';
// External JS for wb.html (compliance with no inline JS/styles)
// All inline JS has been moved here or was absent. This file is now the module import for wb.html.
// Last updated: 2025-10-15
// Merged from build/wb.js
// @ts-nocheck
// No global init() function present. Removed call to avoid ReferenceError.
// Helper functions
// Escape special characters in a string for use in a regular expression
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// State management
let isEditMode = false;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isMinimized = false;
// Website options (replaces URL parameters)
let websiteOptions = {
    type: 'business',
    title: 'Your Amazing Website',
    subtitle: 'Build something beautiful today',
    theme: 'dark',
    layout: 'top-nav',
    isSPA: false // Single Page Application mode
};
// Color Bar State
let colorBarState = {
    hue: 0,
    saturation: 70,
    lightness: 50,
    harmonyAngle: 60, // Color harmony angle between primary and secondary colors
    currentColorRgb: { r: 255, g: 0, b: 0 },
    currentColorHex: '#ff0000',
    customColors: {
        primary: '#6366f1',
        secondary: '#64748b',
        accent: '#10b981'
    }
};

// Set up event listeners IMMEDIATELY (don't wait for DOM)
// Event listeners can be attached before DOM is ready
console.log('🎨 wb.js: Setting up theme and layout event handlers...');

// Listen for theme changes from wb-control-panel
document.addEventListener('wb:theme-changed', (e) => {
    const theme = e.detail.theme;
    console.log('🎨 Theme event received:', theme);
    console.log('🎨 Applying theme to page:', theme);
    
    // Update data-theme attribute on html element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also update body for backward compatibility
    document.body.setAttribute('data-theme', theme);
    
    // Save to state
    websiteOptions.theme = theme;
    
    console.log('✅ Theme applied - html:', document.documentElement.getAttribute('data-theme'));
    console.log('✅ Theme applied - body:', document.body.getAttribute('data-theme'));
});

// Listen for layout changes from wb-control-panel
document.addEventListener('wb:layout-changed', (e) => {
    const layout = e.detail.layout;
    console.log('🏗️ Layout event received:', layout);
    console.log('🏗️ Applying layout to page:', layout);
    
    // Update data-layout attribute
    document.body.setAttribute('data-layout', layout);
    
    // Save to state
    websiteOptions.layout = layout;
    
    console.log('✅ Layout applied - body:', document.body.getAttribute('data-layout'));
});

console.log('✅ Event handlers attached - ready for wb:theme-changed and wb:layout-changed');
