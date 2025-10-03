export {};
// @ts-nocheck
// Website Builder Conversion Utility
// This script handles the conversion process from toBeConverted to converted folder

// Create the converted folder if it doesn't exist
function ensureConvertedFolderExists(): any {
  // This would need server-side code in a real implementation
  console.log('Ensuring converted folder exists');
  // In a browser environment, we'd just verify the folder exists
}

// Convert an HTML file by applying CSS compatibility fixes and preparing for wb controller
function convertHtmlFile(htmlContent, fileName): any {
  console.log(`Converting ${fileName}...`);

  // 1. Apply CSS compatibility fixes (replace vendor prefixes)
  let processedHtml = addCssCompatibility(htmlContent);

  // 2. Prepare for wb controller injection (add injection point if needed)
  processedHtml = prepareForController(processedHtml);

  // 3. Return the processed content
  return processedHtml;
}

// Add CSS compatibility properties alongside vendor prefixes
function addCssCompatibility(html): any {
  // Replace webkit-appearance with standard appearance
  html = html.replace(
    /-webkit-appearance:\s*([^;]+);/g,
    '-webkit-appearance: $1; appearance: $1;'
  );

  // Replace webkit-user-select with standard user-select
  html = html.replace(
    /-webkit-user-select:\s*([^;]+);/g,
    '-webkit-user-select: $1; -moz-user-select: $1; -ms-user-select: $1; user-select: $1;'
  );

  return html;
}

// Prepare HTML for controller injection
function prepareForController(html): any {
  // Add a data attribute to mark as wb-compatible
  html = html.replace(
    /<html([^>]*)>/i,
    '<html$1 data-wb-compatible="true">'
  );

  // Add controller injection point at the end of the body
  // Only if it doesn't already have one
  if (!html.includes('wb-controller-injection-point')) {
    html = html.replace(
      /<\/body>/i,
      '<!-- wb-controller-injection-point --><script src="../wb-controller.js"></script></body>'
    );
  }

  return html;
}

// Save converted file
function saveConvertedFile(content, fileName): any {
  // In a real implementation, this would save to the filesystem
  console.log(`Saving converted file: ${fileName} to converted folder`);

  // For browser-based operation, we'd use download or localStorage
  // For demonstration, we'll create a download link
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.replace(/^.*[\\\/]/, ''); // Extract filename from path
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return `converted/${fileName}`;
}

// Main conversion function
function convertFile(file): any {
  return new Promise((resolve, reject): any => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const content = event.target.result;
        const converted = convertHtmlFile(content, file.name);
        const savedPath = saveConvertedFile(converted, file.name);
        resolve(savedPath);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function () {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

// Initialize when loaded
document.addEventListener('DOMContentLoaded', function () {
  ensureConvertedFolderExists();

  // Set up file input listeners if available
  const fileInput = document.getElementById('import-html-input');
  if (fileInput) {
    fileInput.addEventListener('change', async function (event) {
      if (event.target.files.length > 0) {
        try {
          const file = event.target.files[0];
          const convertedPath = await convertFile(file);
          alert(`File converted successfully: ${convertedPath}`);
        } catch (error) {
          console.error('Error during conversion:', error);
          alert(`Conversion failed: ${error.message}`);
        }
      }
    });
  }

  console.log('Website Builder converter ready');
});

// Export functions for use in other scripts
window.wbConverter = {
  convertFile,
  convertHtmlFile,
  saveConvertedFile
};
