/**
 * WB Components Bundle Loader (ARCHIVED)
 *
 * This file was originally used to load commonly used WB components sequentially
 * by appending classic <script> tags to the document head. This approach ensured
 * that dependencies were loaded in the correct order before ES modules were widely supported.
 *
 * ## Why Archived?
 * - The project has migrated to ES modules and a manifest-based dynamic loader (index.js).
 * - All components are now loaded as modules, and dependency order is handled by the browser.
 * - This loader is no longer needed and can cause confusion or duplicate loading.
 *
 * ## Discovery Notes (2025-10-14)
 * - Found in styles/ and prototype/styles/ as wb-components.js.
 * - Referenced in some legacy HTML and manifest files.
 * - No longer referenced or required in the modern build.
 * - Safe to archive or delete after migration to modules.
 *
 * If you need to restore sequential loading for legacy reasons, update this file to use
 * <script type="module"> and ensure all component scripts are ES modules.
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
