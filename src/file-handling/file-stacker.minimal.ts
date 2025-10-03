// @ts-nocheck
/**
 * File Stacker Minimal Implementation
 * 
 * This script creates and downloads .html, .css, and .js files with the same name prefix.
 */

// Function to stack files with the same name prefix
function stackFiles(baseFilename, htmlContent, cssContent, jsContent): any {
  // Create HTML file
  createAndDownloadFile(baseFilename + '.html', htmlContent, 'text/html');

  // Create CSS file
  createAndDownloadFile(baseFilename + '.css', cssContent, 'text/css');

  // Create JS file
  createAndDownloadFile(baseFilename + '.js', jsContent, 'application/javascript');

  // Alert to show it worked
  setTimeout((): any => {
    alert("Files have been created and downloaded in stacked order:\n" +
      "1. " + baseFilename + ".html\n" +
      "2. " + baseFilename + ".css\n" +
      "3. " + baseFilename + ".js");
  }, 500);
}

// Helper function to create and download a file
function createAndDownloadFile(filename, content, type): any {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout((): any => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 100);
}

// Simple function to extract HTML, CSS, and JS from an HTML file
function extractFromHTML(htmlContent): any {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Extract CSS
  let css = '';
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach(style => {
    css += style.textContent + '\n\n';
  });

  // Extract JS
  let js = '';
  const scriptTags = doc.querySelectorAll('script:not([src])');
  scriptTags.forEach(script => {
    js += script.textContent + '\n\n';
  });

  return {
    html: htmlContent,
    css: css || '/* Extracted CSS */',
    js: js || '// Extracted JavaScript'
  };
}

// Function to read a file as text
function readFileAsText(file): any {
  return new Promise((resolve, reject): any => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

// Add a global function to handle file import and stacking
window.handleFileImport = async function (file) {
  try {
    // Read the file
    const content = await readFileAsText(file);

    // Extract components
    const extracted = extractFromHTML(content);

    // Create the base filename (removing extension)
    const baseFilename = file.name.replace(/\.[^/.]+$/, '');

    // Generate the stacked files
    stackFiles(baseFilename, extracted.html, extracted.css, extracted.js);

    return true;
  } catch (error) {
    console.error('Error handling file import:', error);
    alert('Error processing file: ' + error.message);
    return false;
  }
};

// Attach an event handler directly to the import-html-input element
document.addEventListener('DOMContentLoaded', function () {
  const importInput = document.getElementById('import-html-input');
  if (importInput) {
    importInput.addEventListener('change', async function (e) {
      const file = this.files[0];
      if (file) {
        console.log("File selected directly:", file.name);
        await window.handleFileImport(file);
      }
    });
  }

  // Also attach directly to the button
  const importBtn = document.getElementById('import-btn');
  if (importBtn) {
    importBtn.addEventListener('click', function () {
      console.log("Import button clicked directly");
      const input = document.getElementById('import-html-input');
      if (input) input.click();
    });
  }
});
