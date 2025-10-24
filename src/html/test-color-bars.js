// Extracted from test-color-bars.html
// See original file for full logic
// This file should be imported as a module in the HTML

const loadingStatus = document.getElementById('loading-status');
const colorBarStatus = document.getElementById('color-bar-status');
const colorBarsStatus = document.getElementById('color-bars-status');
const consoleOutput = document.getElementById('console-output');

function addStatus(element, message, type = 'info') {
    const div = document.createElement('div');
    div.className = `status ${type}`;
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
    element.appendChild(div);
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Capture console messages
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
    addStatus(consoleOutput, args.join(' '), 'success');
    originalLog.apply(console, args);
};

console.error = function(...args) {
    addStatus(consoleOutput, args.join(' '), 'error');
    originalError.apply(console, args);
};

console.warn = function(...args) {
    addStatus(consoleOutput, args.join(' '), 'warning');
    originalWarn.apply(console, args);
};

// Check component loading
function checkComponentStatus() {
    // Check wb-color-bar
    if (customElements.get('wb-color-bar')) {
        addStatus(loadingStatus, '✅ wb-color-bar custom element is registered', 'success');
    } else {
        addStatus(loadingStatus, '❌ wb-color-bar custom element is NOT registered', 'error');
    }
    // Check wb-color-bars
    if (customElements.get('wb-color-bars')) {
        addStatus(loadingStatus, '✅ wb-color-bars custom element is registered', 'success');
    } else {
        addStatus(loadingStatus, '❌ wb-color-bars custom element is NOT registered', 'error');
    }
    // Check component instances
    const colorBarElement = document.querySelector('wb-color-bar');
    if (colorBarElement) {
        addStatus(colorBarStatus, `✅ wb-color-bar element exists (${colorBarElement.offsetHeight}px tall)`, 'success');
    } else {
        addStatus(colorBarStatus, '❌ wb-color-bar element not found', 'error');
    }
    const colorBarsElement = document.querySelector('wb-color-bars');
    if (colorBarsElement) {
        addStatus(colorBarsStatus, `✅ wb-color-bars element exists (${colorBarsElement.offsetHeight}px tall)`, 'success');
        // Check shadow DOM content
        if (colorBarsElement.shadowRoot) {
            const shadowContent = colorBarsElement.shadowRoot.innerHTML;
            if (shadowContent.includes('wb-color-bar')) {
                addStatus(colorBarsStatus, '✅ wb-color-bars contains wb-color-bar elements in shadow DOM', 'success');
            } else {
                addStatus(colorBarsStatus, '❌ wb-color-bars shadow DOM does not contain wb-color-bar elements', 'error');
                addStatus(colorBarsStatus, `Shadow DOM content: ${shadowContent.substring(0, 200)}...`, 'warning');
            }
        }
    } else {
        addStatus(colorBarsStatus, '❌ wb-color-bars element not found', 'error');
    }
}

// Listen for custom element registration
customElements.whenDefined('wb-color-bar').then(() => {
    addStatus(loadingStatus, '🎉 wb-color-bar custom element defined!', 'success');
    setTimeout(checkComponentStatus, 100);
}).catch(err => {
    addStatus(loadingStatus, `❌ wb-color-bar definition failed: ${err}`, 'error');
});

customElements.whenDefined('wb-color-bars').then(() => {
    addStatus(loadingStatus, '🎉 wb-color-bars custom element defined!', 'success');
    setTimeout(checkComponentStatus, 100);
}).catch(err => {
    addStatus(loadingStatus, `❌ wb-color-bars definition failed: ${err}`, 'error');
});

// Initial check after components have had time to load
setTimeout(checkComponentStatus, 3000);

// Capture all errors
window.addEventListener('error', (e) => {
    addStatus(consoleOutput, `💥 JavaScript Error: ${e.message} at ${e.filename}:${e.lineno}`, 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    addStatus(consoleOutput, `💥 Promise Rejection: ${e.reason}`, 'error');
});
