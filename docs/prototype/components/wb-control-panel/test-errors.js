/**
 * Error Testing Script for wb-control-panel
 * Use this to test the error logging functionality
 */

// Test 1: Simple JavaScript Error
window.testSimpleError = function() {
    console.log('🧪 Testing simple JavaScript error...');
    // This will trigger an uncaught error
    nonExistentFunction();
};

// Test 2: Promise Rejection Error
window.testPromiseError = function() {
    console.log('🧪 Testing unhandled promise rejection...');
    // This will trigger an unhandled promise rejection
    new Promise((resolve, reject) => {
        reject(new Error('Test promise rejection error'));
    });
};

// Test 3: Resource Loading Error
window.testResourceError = function() {
    console.log('🧪 Testing resource loading error...');
    // This will trigger a resource loading error
    const img = document.createElement('img');
    img.src = 'non-existent-image.jpg';
    document.body.appendChild(img);
};

// Test 4: Network Error
window.testNetworkError = function() {
    console.log('🧪 Testing network error...');
    // This will trigger a network error
    fetch('/non-existent-endpoint')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        })
        .catch(error => {
            // This catch will prevent unhandled rejection, so let's make it unhandled
            setTimeout(() => {
                throw error;
            }, 0);
        });
};

// Test 5: Component Loading Error
window.testComponentError = function() {
    console.log('🧪 Testing component loading error...');
    // This will trigger a component loading error
    import('/non-existent-component.js')
        .catch(error => {
            // Make it an unhandled rejection
            return Promise.reject(error);
        });
};

// Run all error tests
window.runAllErrorTests = function() {
    console.log('🧪 Running all error tests...');
    
    setTimeout(() => testSimpleError(), 500);
    setTimeout(() => testPromiseError(), 1000);
    setTimeout(() => testResourceError(), 1500);
    setTimeout(() => testNetworkError(), 2000);
    setTimeout(() => testComponentError(), 2500);
    
    console.log('✅ All error tests scheduled. Check the error log panel for results.');
};

// Add debug functions to console
console.log('🔧 Error testing functions loaded:');
console.log('- testSimpleError()');
console.log('- testPromiseError()');  
console.log('- testResourceError()');
console.log('- testNetworkError()');
console.log('- testComponentError()');
console.log('- runAllErrorTests()');