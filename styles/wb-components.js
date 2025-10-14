/**
 * WB Components Bundle Loader
 * Loads commonly used WB components in the correct order
 */

// Component loading queue
const componentQueue = [
    '../components/wb-btn/wb-btn.js'
];

// Load scripts sequentially to handle dependencies
async function loadComponents() {
    for (const src of componentQueue) {
        try {
            await loadScript(src);
            console.log(`✅ Loaded: ${src}`);
        } catch (error) {
            console.error(`❌ Failed to load: ${src}`, error);
        }
    }
    
    // Dispatch event when all components are loaded
    window.dispatchEvent(new CustomEvent('wb-components-ready'));
    console.log('🎉 All WB components loaded');
}

// Dynamic script loader
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Auto-load when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}