// Extracted from component-diagnosis.html
// All diagnostic logic for component diagnosis page

// Wait for WBEventLog to be ready
function waitForEventLog() {
    return new Promise(resolve => {
        if (window.WBEventLog || document.querySelector('wb-event-log')) {
            resolve();
        } else {
            setTimeout(() => waitForEventLog().then(resolve), 50);
        }
    });
}

// Load script helper
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            if (window.WBEventLog) {
                WBEventLog.logSuccess(`Script loaded: ${src}`, { component: 'diagnosis', src });
            }
            resolve();
        };
        script.onerror = () => {
            if (window.WBEventLog) {
                WBEventLog.logError(`Script failed: ${src}`, { component: 'diagnosis', src });
            }
            reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
    });
}

async function diagnoseComponents() {
    await waitForSafeLogger();
    document.dispatchEvent(new CustomEvent('wb:info', { detail: { message: 'Starting component diagnosis...', component: 'diagnosis' } }));
    // Wait for wb-event-log to be ready
    await new Promise(resolve => {
        const check = () => {
            if (customElements.get('wb-event-log')) resolve();
            else setTimeout(check, 100);
        };
        check();
    });
    document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-event-log ready', component: 'diagnosis' } }));
    // Wait for main.js to be ready
    if (!window.WBMainJS?.ready) {
        document.dispatchEvent(new CustomEvent('wb:warning', { detail: { message: 'Waiting for WBMainJS...', component: 'diagnosis' } }));
        await new Promise(resolve => {
            const check = () => {
                if (window.WBMainJS?.ready) resolve();
                else setTimeout(check, 100);
            };
            check();
        });
    }
    document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'WBMainJS ready', component: 'diagnosis' } }));
    // Test 1: WBComponentUtils (already loaded by main.js)
    if (window.WBComponentUtils) {
        document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'WBComponentUtils available', component: 'diagnosis' } }));
    } else {
        document.dispatchEvent(new CustomEvent('wb:warning', { detail: { message: 'WBComponentUtils not available', component: 'diagnosis' } }));
    }
    // Test 2: WBComponentRegistry (already loaded by main.js)
    if (window.WBComponentRegistry) {
        document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'WBComponentRegistry available', component: 'diagnosis' } }));
    } else {
        document.dispatchEvent(new CustomEvent('wb:warning', { detail: { message: 'WBComponentRegistry not available', component: 'diagnosis' } }));
    }
    // Test 3: wb-color-bar
    try {
        await loadScript('components/wb-color-bar/wb-color-bar.js');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (customElements.get('wb-color-bar')) {
            document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-color-bar registered', component: 'diagnosis' } }));
        } else {
            document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-color-bar not registered', component: 'diagnosis' } }));
        }
    } catch (error) {
        document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-color-bar failed', component: 'diagnosis', error: error.message } }));
    }
    // Test 4: wb-color-bars
    try {
        await loadScript('components/wb-color-bars/wb-color-bars.js');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (customElements.get('wb-color-bars')) {
            document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-color-bars registered', component: 'diagnosis' } }));
        } else {
            document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-color-bars not registered', component: 'diagnosis' } }));
        }
    } catch (error) {
        document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-color-bars failed', component: 'diagnosis', error: error.message } }));
    }
    // Test 5: wb-nav
    try {
        await loadScript('components/wb-nav/wb-nav.js');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (customElements.get('wb-nav')) {
            document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-nav registered', component: 'diagnosis' } }));
        } else {
            document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-nav not registered', component: 'diagnosis' } }));
        }
    } catch (error) {
        document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-nav failed', component: 'diagnosis', error: error.message } }));
    }
    // Test 6: wb-control-panel
    try {
        await loadScript('components/wb-control-panel/wb-control-panel.js');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (customElements.get('wb-control-panel')) {
            document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-control-panel registered', component: 'diagnosis' } }));
        } else {
            document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-control-panel not registered', component: 'diagnosis' } }));
        }
    } catch (error) {
        document.dispatchEvent(new CustomEvent('wb:error', { detail: { message: 'wb-control-panel failed', component: 'diagnosis', error: error.message } }));
    }
    document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'Diagnosis complete!', component: 'diagnosis' } }));
}

// Capture global errors
window.addEventListener('error', (event) => {
    document.dispatchEvent(new CustomEvent('wb:error', { 
        detail: { 
            message: `Global error: ${event.message}`,
            component: 'diagnosis',
            filename: event.filename,
            lineno: event.lineno,
            error: event.error?.message
        }
    }));
    event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
    document.dispatchEvent(new CustomEvent('wb:error', { 
        detail: { 
            message: `Unhandled rejection: ${event.reason}`,
            component: 'diagnosis',
            reason: event.reason 
        }
    }));
    event.preventDefault();
});

// Start diagnosis when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        diagnoseComponents().catch(error => {
            document.dispatchEvent(new CustomEvent('wb:error', { 
                detail: { 
                    message: `Diagnosis crashed: ${error.message}`,
                    component: 'diagnosis',
                    error: error.message 
                }
            }));
        });
    });
} else {
    diagnoseComponents().catch(error => {
        document.dispatchEvent(new CustomEvent('wb:error', { 
            detail: { 
                message: `Diagnosis crashed: ${error.message}`,
                component: 'diagnosis',
                error: error.message 
            }
        }));
    });
}
