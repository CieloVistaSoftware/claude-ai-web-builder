// Extracted from final-ecosystem-test.html
// See original file for full class and logic
// This file should be imported as a module in the HTML

class FinalEcosystemTest {
    // ...existing code from <script type="module">...
}

// Initialize and run the final test
const finalTest = new FinalEcosystemTest();
setTimeout(() => {
    finalTest.runAllTests();
}, 1000);
window.finalTest = finalTest;
window.debugInfo = () => {
    // ...existing debugInfo code...
};
