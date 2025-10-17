// Extracted from test-simple-control-panel.html
// See original file for full logic
// This file should be imported as a module in the HTML

const eventDisplay = document.getElementById('event-display');

function addEvent(message, type = 'info') {
    const div = document.createElement('div');
    div.className = `status ${type}`;
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
    eventDisplay.appendChild(div);
    // Keep only last 10 events
    while (eventDisplay.children.length > 10) {
        eventDisplay.removeChild(eventDisplay.firstChild);
    }
}

// Listen for control panel events on document
[
    'wb:theme-changed',
    'wb:layout-changed',
    'wb:color-changed',
    'colorchange',
    'wb:control-panel-ready',
    'controlPanelReady',
    'wb:edit-mode-changed',
    'editModeChanged',
    'wb:footer-mode-changed',
    'controlPanelMinimized',
    'controlPanelHide',
    'controlPanelShow',
    'wb:layout-structure-changed',
    'wb:error',
    'wb:info',
    'wb:success',
    'wb:warning'
].forEach(eventName => {
    document.addEventListener(eventName, (e) => {
        addEvent(`[doc] ${eventName}: ${JSON.stringify(e.detail)}`, 'info');
        console.log(`[doc] ${eventName}:`, e.detail);
    });
});

// Also listen directly on the control panel element for any custom events
function attachPanelListeners(panel) {
    [
        'wb:theme-changed',
        'wb:layout-changed',
        'wb:color-changed',
        'colorchange',
        'wb:control-panel-ready',
        'controlPanelReady',
        'wb:edit-mode-changed',
        'editModeChanged',
        'wb:footer-mode-changed',
        'controlPanelMinimized',
        'controlPanelHide',
        'controlPanelShow',
        'wb:layout-structure-changed',
        'wb:error',
        'wb:info',
        'wb:success',
        'wb:warning'
    ].forEach(eventName => {
        panel.addEventListener(eventName, (e) => {
            addEvent(`[panel] ${eventName}: ${JSON.stringify(e.detail)}`, 'info');
            console.log(`[panel] ${eventName}:`, e.detail);
        });
    });
}

// Wait for wb-control-panel to be defined and attached
function waitForPanelAndAttach() {
    const panel = document.querySelector('wb-control-panel');
    if (panel) {
        attachPanelListeners(panel);
    } else {
        // Use MutationObserver to wait for it
        const observer = new MutationObserver(() => {
            const panelNow = document.querySelector('wb-control-panel');
            if (panelNow) {
                attachPanelListeners(panelNow);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}
waitForPanelAndAttach();

// Error monitoring
window.addEventListener('error', (e) => {
    addEvent(`❌ Error: ${e.message}`, 'error');
});

addEvent('🚀 Simple test page loaded, waiting for control panel...', 'info');
