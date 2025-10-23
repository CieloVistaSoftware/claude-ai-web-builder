/**
 * index.js - WB Website Builder Component Loader
 * 
 * This file dynamically discovers and loads components.
 * Load this single file instead of managing multiple script tags.
 */

(function() {
    'use strict';
    
    console.log('🚀 WB Website Builder: Starting dynamic component loader...');
    
    // Detect base path relative to current location
    function getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/components/')) {
            // If we're in a component subdirectory, go back to root
            const pathParts = currentPath.split('/');
            const componentsIndex = pathParts.lastIndexOf('components');
            if (componentsIndex > 0) {
                return '../'.repeat(pathParts.length - componentsIndex - 1);
            }
        }
        return './';
    }
    
    const basePath = getBasePath();
    console.log('🗂️ Base path detected:', basePath);
    
    // Configuration
    const config = {
        utilsPath: basePath + 'utils/wb',
        componentsPath: basePath + 'components',
        stylesPath: basePath + 'styles',
        manifestPath: basePath + 'components/manifest.json'
    };
    
    // Load scripts sequentially
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = src;
            script.onload = () => {
                console.log(`✅ Loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`❌ Failed to load: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };
            document.head.appendChild(script);
        });
    }
    
    // Discover components from manifest file
    async function loadManifest() {
        try {
            const response = await fetch(config.manifestPath);
            if (!response.ok) {
                throw new Error(`Manifest not found at ${config.manifestPath}`);
            }
            const manifest = await response.json();
            console.log('📦 Loaded component manifest:', manifest);
            return manifest;
        } catch (error) {
            console.warn('⚠️ No manifest found, using fallback discovery:', error.message);
            return null;
        }
    }
    
    // Fallback: Use default component list if no manifest
    function getFallbackComponents() {
        return {
            infrastructure: [],
            styles: [],
            dependencies: ['wb-base', 'wb-toggle', 'wb-select', 'wb-color-bar', 'wb-color-bars'],
            components: ['wb-event-log', 'wb-control-panel', 'wb-demo', 'wb-layout', 'wb-theme', 'wb-nav']
        };
    }
    
    // Build script list from manifest or fallback
    function buildScriptList(manifest) {
        const scripts = [];
        
        // Infrastructure (utils)
        if (manifest.infrastructure) {
            manifest.infrastructure.forEach(file => {
                scripts.push(`${config.utilsPath}/${file}`);
            });
        }
        
        // Styles
        if (manifest.styles) {
            manifest.styles.forEach(file => {
                scripts.push(`${config.stylesPath}/${file}`);
            });
        }
        
        // Dependencies (load order matters)
        if (manifest.dependencies) {
            manifest.dependencies.forEach(component => {
                scripts.push(`${config.componentsPath}/${component}/${component}.js`);
            });
        }
        
        // Main components
        if (manifest.components) {
            manifest.components.forEach(component => {
                // Handle special cases where JS filename doesn't match folder name
                let jsFile;
                if (component === 'wb-theme') {
                    jsFile = 'wb-theme-manager.js';
                } else {
                    jsFile = `${component}.js`;
                }
                scripts.push(`${config.componentsPath}/${component}/${jsFile}`);
            });
        }
        
        return scripts;
    }
    
    // Load all scripts in order
    async function loadAllScripts() {
        try {
            // Try to load manifest first
            let manifest = await loadManifest();
            
            // Use fallback if manifest not found
            if (!manifest) {
                console.log('📋 Using fallback component list');
                manifest = getFallbackComponents();
            }
            
            // Build script list
            const scripts = buildScriptList(manifest);
            console.log(`📊 Loading ${scripts.length} scripts...`);
            
            // Load each script
            for (const script of scripts) {
                await loadScript(script);
            }
            
            console.log('✅ WB Website Builder: All components loaded successfully');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('wb-ready', {
                detail: { 
                    message: 'All WB components loaded', 
                    timestamp: new Date(),
                    scriptsLoaded: scripts.length,
                    manifest: manifest
                }
            }));
            
            // Mark as ready
            window.WBReady = true;
            window.WBManifest = manifest;
        } catch (error) {
            console.error('❌ WB Website Builder: Failed to load components', error);
            
            // Dispatch error event
            window.dispatchEvent(new CustomEvent('wb-error', {
                detail: { message: 'Component loading failed', error: error.message }
            }));
        }
    }
    
    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllScripts);
    } else {
        loadAllScripts();
    }
    
    // Expose API for dynamic component loading
    window.WBLoader = {
        loadComponent: async function(componentName) {
            const script = `${config.componentsPath}/${componentName}/${componentName}.js`;
            try {
                await loadScript(script);
                console.log(`✅ Dynamically loaded: ${componentName}`);
                return true;
            } catch (error) {
                console.error(`❌ Failed to dynamically load: ${componentName}`, error);
                return false;
            }
        },
        
        loadScript: loadScript,
        
        reloadManifest: async function() {
            const manifest = await loadManifest();
            window.WBManifest = manifest;
            return manifest;
        }
    };
})();
