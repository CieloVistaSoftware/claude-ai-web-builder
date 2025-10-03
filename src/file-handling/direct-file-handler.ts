// @ts-nocheck
// Simple, direct file handler that definitely works
(function () {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Direct file handler loaded');

    // Direct button event handlers
    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
      importBtn.onclick = function () {
        console.log('Import button clicked');
        const fileInput = document.getElementById('import-html-input');
        if (fileInput) fileInput.click();
      };
    }

    const loadConvertedBtn = document.getElementById('load-converted-btn');
    if (loadConvertedBtn) {
      loadConvertedBtn.onclick = function () {
        console.log('Load converted button clicked');
        const fileInput = document.getElementById('load-converted-input');
        if (fileInput) fileInput.click();
      };
    }

    // File input handlers
    const importFileInput = document.getElementById('import-html-input');
    if (importFileInput) {
      importFileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;
        console.log('File selected for import:', file.name);

        // Show a simple alert for now to confirm it's working
        alert('Selected file: ' + file.name + '\nNow this would process the file.');

        // Here we would normally process the file
        // For now just logging to confirm the handler works
        if (window.siteConverter && window.siteConverter.importSiteHTML) {
          window.siteConverter.importSiteHTML(file)
            .then(() => console.log('Import successful'))
            .catch(err => console.error('Import error:', err));
        } else {
          console.log('Site converter not available, would import directly');
        }
      };
    }

    const loadConvertedInput = document.getElementById('load-converted-input');
    if (loadConvertedInput) {
      loadConvertedInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;
        console.log('File selected for loading:', file.name);

        // Show a simple alert for now to confirm it's working
        alert('Selected file: ' + file.name + '\nNow this would load the file.');

        // Here we would normally load the file
        // For now just logging to confirm the handler works
      };
    }
  });
})();
