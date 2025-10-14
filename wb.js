// Merged from build/wb.js
// @ts-nocheck
// Call the init function when the document is ready
window.addEventListener('load', function () {
    init();
});
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
