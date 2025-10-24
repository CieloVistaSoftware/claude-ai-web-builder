// Extracted from test-control-panel-events.html
// See original file for full logic
// This file should be imported as a module in the HTML

// Test 1: Static HTML Control Panel
let staticLayoutEvent = false;
let staticThemeEvent = false;
document.addEventListener('wb:layout-changed', () => { staticLayoutEvent = true; });
document.addEventListener('wb:theme-changed', () => { staticThemeEvent = true; });
// Simulate user changing layout
const layoutSelect = document.getElementById('layout-select');
if (layoutSelect) {
  layoutSelect.value = 'left-nav';
  layoutSelect.dispatchEvent(new Event('change', { bubbles: true }));
}
// Simulate user changing theme
const themeSelect = document.getElementById('theme-select');
if (themeSelect) {
  themeSelect.value = 'light';
  themeSelect.dispatchEvent(new Event('change', { bubbles: true }));
}
setTimeout(() => {
  const staticResult = staticLayoutEvent && staticThemeEvent;
  const resultsDiv = document.getElementById('results');
  const div = document.createElement('div');
  div.className = 'result ' + (staticResult ? 'pass' : 'fail');
  div.textContent = 'Static Panel: ' + (staticResult ? 'PASS (events fired)' : 'FAIL (no custom events)');
  resultsDiv.appendChild(div);
}, 500);

// Test 2: wb-control-panel Web Component
let webLayoutEvent = false;
let webThemeEvent = false;
document.addEventListener('wb:layout-changed', () => { webLayoutEvent = true; });
document.addEventListener('wb:theme-changed', () => { webThemeEvent = true; });
setTimeout(() => {
  const panel = document.getElementById('web-panel');
  // Simulate user changing layout
  const layoutSelect = panel.querySelector('#layout-select');
  if (layoutSelect) {
    layoutSelect.value = 'left-nav';
    layoutSelect.dispatchEvent(new CustomEvent('wb-select:change', { detail: { value: 'left-nav' }, bubbles: true }));
  }
  // Simulate user changing theme
  const themeSelect = panel.querySelector('#theme-select');
  if (themeSelect) {
    themeSelect.value = 'light';
    themeSelect.dispatchEvent(new CustomEvent('wb-select:change', { detail: { value: 'light' }, bubbles: true }));
  }
  setTimeout(() => {
    const webResult = webLayoutEvent && webThemeEvent;
    const resultsDiv = document.getElementById('results');
    const div = document.createElement('div');
    div.className = 'result ' + (webResult ? 'pass' : 'fail');
    div.textContent = 'Web Component Panel: ' + (webResult ? 'PASS (events fired)' : 'FAIL (no custom events)');
    resultsDiv.appendChild(div);
  }, 800);
}, 1000);
