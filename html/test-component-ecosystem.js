// Extracted from test-component-ecosystem.html
// See original file for full class and logic
// This file should be imported as a module in the HTML

class ComponentEcosystemTest {
    // ...existing code from <script type="module">...
}

// Initialize and run tests
const testSuite = new ComponentEcosystemTest();
setTimeout(() => {
    testSuite.runTests();
}, 1000);
window.testSuite = testSuite;
