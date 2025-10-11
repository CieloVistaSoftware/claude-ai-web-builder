// Test 1: Static HTML Control Panel Event Test
// This test checks if the static control panel in wb.html dispatches custom events for layout and theme changes

document.addEventListener('DOMContentLoaded', function () {
  let layoutEventFired = false;
  let themeEventFired = false;

  document.addEventListener('wb:layout-changed', () => { layoutEventFired = true; });
  document.addEventListener('wb:theme-changed', () => { themeEventFired = true; });

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
    window.staticPanelTestResult = {
      layoutEventFired,
      themeEventFired
    };
  }, 500);
});

// Test 2: wb-control-panel Web Component Event Test
// This test checks if the wb-control-panel component dispatches custom events for layout and theme changes

document.addEventListener('DOMContentLoaded', function () {
  let layoutEventFired = false;
  let themeEventFired = false;

  document.addEventListener('wb:layout-changed', () => { layoutEventFired = true; });
  document.addEventListener('wb:theme-changed', () => { themeEventFired = true; });

  // Find or create wb-control-panel
  let panel = document.querySelector('wb-control-panel');
  if (!panel) {
    panel = document.createElement('wb-control-panel');
    document.body.appendChild(panel);
  }

  // Wait for panel to initialize
  setTimeout(() => {
    // Simulate user changing layout
    const layoutSelect = panel.shadowRoot ? panel.shadowRoot.querySelector('#layout-select') : panel.querySelector('#layout-select');
    if (layoutSelect) {
      layoutSelect.value = 'left-nav';
      layoutSelect.dispatchEvent(new CustomEvent('wb-select:change', { detail: { value: 'left-nav' }, bubbles: true }));
    }

    // Simulate user changing theme
    const themeSelect = panel.shadowRoot ? panel.shadowRoot.querySelector('#theme-select') : panel.querySelector('#theme-select');
    if (themeSelect) {
      themeSelect.value = 'light';
      themeSelect.dispatchEvent(new CustomEvent('wb-select:change', { detail: { value: 'light' }, bubbles: true }));
    }

    setTimeout(() => {
      window.webComponentPanelTestResult = {
        layoutEventFired,
        themeEventFired
      };
    }, 500);
  }, 1000);
});

// Utility to print results after both tests
setTimeout(() => {
  console.log('Static Panel Test Result:', window.staticPanelTestResult);
  console.log('Web Component Panel Test Result:', window.webComponentPanelTestResult);
}, 2500);
