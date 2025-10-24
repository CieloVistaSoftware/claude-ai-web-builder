export {};
// @ts-nocheck
// Converter Tool JavaScript

// Global variable to store conversion results
let convertedSite = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', (): any => {
  // File input handling
  const fileInput = document.getElementById('html-file');
  const fileNameDisplay = document.getElementById('file-name');
  const convertBtn = document.getElementById('convert-btn');
  const previewBtn = document.getElementById('preview-btn');
  const saveBtn = document.getElementById('save-btn');
  const openBuilderBtn = document.getElementById('open-builder-btn');

  // Scan for files in the toBeConverted folder
  scanToBeConvertedFolder().then(files => {
    if (files.length > 0) {
      console.log(`Found ${files.length} files in toBeConverted folder`);
      populateFileDropdown(files);
    } else {
      console.log('No files found in toBeConverted folder or folder not accessible');
    }
  });

  // Modal elements
  const previewModal = document.getElementById('preview-modal');
  const closePreviewBtn = document.getElementById('close-preview-btn');
  const progressModal = document.getElementById('progress-modal');
  const previewFrame = document.getElementById('preview-frame');

  // Options
  const preserveStyles = document.getElementById('preserve-styles');
  const preserveScripts = document.getElementById('preserve-scripts');
  const autoExtractSections = document.getElementById('auto-extract-sections');
  const autoExtractMedia = document.getElementById('auto-extract-media');

  // Result section
  const resultSection = document.getElementById('result-section');
  // Initialize event listeners
  fileInput.addEventListener('change', handleFileSelect);
  convertBtn.addEventListener('click', handleConvert);
  previewBtn.addEventListener('click', handlePreview);
  saveBtn.addEventListener('click', handleSave);
  openBuilderBtn.addEventListener('click', handleOpenBuilder);
  closePreviewBtn.addEventListener('click', () => previewModal.classList.remove('active'));

  // Add event listener for the view history button
  const viewHistoryBtn = document.getElementById('view-history-btn');
  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', async (): any => {
      const selection = await showConversionHistory();
      if (selection) {
        // If a file was selected, open it in the builder
        localStorage.setItem('openingConvertedSite', JSON.stringify(selection));
        window.location.href = 'wb.html?loadConverted=true';
      }
    });
  }

  // Handle file selection
  function handleFileSelect(e): any {
    const file = e.target.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      // Enable convert button
      convertBtn.disabled = false;
    }
  }
  // Handle convert button click
  async function handleConvert(): any {
    // Check for file from file input
    let file = fileInput.files[0];

    // If no file from input, check for file from dropdown
    if (!file && window.selectedToBeConvertedFile) {
      file = window.selectedToBeConvertedFile;
    }

    const urlInput = document.getElementById('site-url');
    let htmlContent = '';

    if (!file && !urlInput.value) {
      alert('Please select a file or enter a URL');
      return;
    }

    // Show progress modal
    progressModal.classList.add('active');
    const progressStatus = document.getElementById('progress-status');
    const progressBarFill = document.getElementById('progress-bar-fill');

    try {
      // If file is selected
      if (file) {
        progressStatus.textContent = 'Reading file...';
        progressBarFill.style.width = '20%';

        // Read the file
        htmlContent = await readFileAsText(file);
      } else {
        // Handle URL input (would need a proxy server in real implementation)
        progressStatus.textContent = 'Fetching URL...';
        progressBarFill.style.width = '20%';

        // In a real implementation, you would use a server-side proxy
        // For this example, we'll just show an error
        alert('URL fetching requires a server-side component. Please use a file instead.');
        progressModal.classList.remove('active');
        return;
      }

      // Update progress
      progressStatus.textContent = 'Analyzing site structure...';
      progressBarFill.style.width = '40%';

      // Get conversion options
      const options = {
        preserveStyles: preserveStyles.checked,
        preserveScripts: preserveScripts.checked,
        autoExtractSections: autoExtractSections.checked,
        autoExtractMedia: autoExtractMedia.checked
      };

      // Convert the site using the site-converter.js functionality
      progressStatus.textContent = 'Converting site...';
      progressBarFill.style.width = '60%';

      // Call the converter
      convertedSite = await window.siteConverter.convertExternalSite(htmlContent);

      // Extract additional files (css, js)
      progressStatus.textContent = 'Extracting stylesheets and scripts...';
      progressBarFill.style.width = '80%';

      // Extract CSS from style tags and link tags
      const cssContent = extractExternalResources(htmlContent, 'css', options);

      // Extract JS from script tags
      const jsContent = extractExternalResources(htmlContent, 'js', options);

      // Add to convertedSite object
      convertedSite.extractedCSS = cssContent;
      convertedSite.extractedJS = jsContent;

      // Complete
      progressStatus.textContent = 'Conversion complete!';
      progressBarFill.style.width = '100%';

      // Show results
      setTimeout((): any => {
        progressModal.classList.remove('active');
        displayResults(convertedSite);
      }, 1000);

    } catch (error) {
      console.error('Conversion error:', error);
      progressStatus.textContent = 'Error: ' + error.message;
      progressBarFill.style.width = '100%';
      progressBarFill.style.backgroundColor = 'var(--danger)';

      setTimeout((): any => {
        progressModal.classList.remove('active');
      }, 2000);
    }
  }
  // Handle preview button click
  function handlePreview(): any {
    // Check for file from file input
    let file = fileInput.files[0];

    // If no file from input, check for file from dropdown
    if (!file && window.selectedToBeConvertedFile) {
      file = window.selectedToBeConvertedFile;
    }

    if (file) {
      const fileURL = URL.createObjectURL(file);
      previewFrame.src = fileURL;
      previewModal.classList.add('active');
    } else {
      alert('Please select a file first');
    }
  }
  // Handle save button click - Save files to the 'conversion' folder
  async function handleSave(): any {
    if (!convertedSite) {
      alert('Please convert a site first');
      return;
    } try {
      // Check for file from file input
      let file = fileInput.files[0];

      // If no file from input, check for file from dropdown
      if (!file && window.selectedToBeConvertedFile) {
        file = window.selectedToBeConvertedFile;
      }

      const baseFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

      // Create ZIP file
      const zip = new JSZip();
      const convertedFolder = zip.folder("conversion");

      // Add HTML file
      const htmlContent = generateHTMLContent(convertedSite, baseFileName);
      convertedFolder.file(`${baseFileName}.html`, htmlContent);

      // Add CSS file
      const cssContent = generateCSSContent(convertedSite, baseFileName);
      convertedFolder.file(`${baseFileName}.css`, cssContent);

      // Add JS file
      const jsContent = generateJSContent(convertedSite, baseFileName);
      convertedFolder.file(`${baseFileName}.js`, jsContent);

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = `${baseFileName}-converted.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Also save individual files to the 'conversion' folder using the File System Access API
      // This would work in modern browsers with user permission
      try {
        // Save files and get reference to saved location
        const saveResult = await saveFilesToFolder(baseFileName, htmlContent, cssContent, jsContent);

        // Store current conversion for easy access
        localStorage.setItem('lastConversion', JSON.stringify({
          baseFileName: baseFileName,
          fileName: saveResult.fileName
        }));
      } catch (fsError) {
        console.log('File System API not supported or permission denied:', fsError);
        // We already provided the zip download as fallback
      }

    } catch (error) {
      console.error('Error saving files:', error);
      alert('Error saving files: ' + error.message);
    }
  }
  // Handle open in builder button click
  async function handleOpenBuilder(): any {
    // Check if there's a current conversion
    if (!convertedSite) {
      // If no current conversion, show the history dialog
      const selectedConversion = await showConversionHistory();

      if (selectedConversion) {
        // User selected a previous conversion to open
        try {
          // If we have the actual site data from history, use it
          if (selectedConversion.siteData) {
            localStorage.setItem('convertedSite', JSON.stringify(selectedConversion.siteData));
            window.location.href = 'wb.html?loadConverted=true';
            return;
          }

          // Otherwise, we need to fetch the HTML file and convert it again
          // In a real implementation, you would load the HTML/CSS/JS files and convert them
          alert(`Opening ${selectedConversion.baseFileName} from conversion history`);

          // Store the path info to access the files
          localStorage.setItem('openingConvertedSite', JSON.stringify(selectedConversion));

          // Redirect to the website builder
          window.location.href = 'wb.html?loadConverted=true';
        } catch (error) {
          console.error('Error opening converted site:', error);
          alert('Error opening the selected conversion: ' + error.message);
        }
      }
    } else {
      // We have a current conversion
      // Check if it's been saved already
      const lastConversion = JSON.parse(localStorage.getItem('lastConversion') || 'null');

      if (!lastConversion) {
        // If not saved, ask user to save first
        const saveFirst = confirm('Your converted site hasn\'t been saved yet. Save to the conversion folder before opening?');
        if (saveFirst) {
          await handleSave();
        }
      }

      // Store the converted site in localStorage to pass to the builder
      localStorage.setItem('convertedSite', JSON.stringify(convertedSite));

      // Redirect to the website builder
      window.location.href = 'wb.html?loadConverted=true';
    }
  }

  // Utility function to read file as text
  function readFileAsText(file): any {
    return new Promise((resolve, reject): any => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  // Function to display conversion results
  function displayResults(site): any {
    resultSection.style.display = 'block';

    // Update summary info
    document.getElementById('conversion-summary').textContent =
      `Website converted successfully with ${site.sections.length} sections and ${site.media.length} media items.`;

    document.getElementById('detected-layout').textContent = site.layout;
    document.getElementById('detected-theme').textContent = site.theme;
    document.getElementById('sections-count').textContent = site.sections.length;
    document.getElementById('media-count').textContent = site.media.length;

    // Enable save and open buttons
    saveBtn.disabled = false;
    openBuilderBtn.disabled = false;
  }

  // Extract external resources (CSS, JS) from HTML
  function extractExternalResources(htmlContent, type, options): any {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    let content = '';

    if (type === 'css' && options.preserveStyles) {
      // Extract inline styles
      const styles = doc.querySelectorAll('style');
      styles.forEach(style => {
        content += `/* Inline style */\n${style.textContent}\n\n`;
      });

      // Log external stylesheets (would need server-side fetching)
      const links = doc.querySelectorAll('link[rel="stylesheet"]');
      if (links.length > 0) {
        content += '/* External stylesheets detected (URLs listed below) */\n';
        links.forEach(link => {
          content += `/* ${link.href} */\n`;
        });
      }
    }

    if (type === 'js' && options.preserveScripts) {
      // Extract inline scripts
      const scripts = doc.querySelectorAll('script:not([src])');
      scripts.forEach(script => {
        content += `// Inline script\n${script.textContent}\n\n`;
      });

      // Log external scripts (would need server-side fetching)
      const extScripts = doc.querySelectorAll('script[src]');
      if (extScripts.length > 0) {
        content += '// External scripts detected (URLs listed below)\n';
        extScripts.forEach(script => {
          content += `// ${script.src}\n`;
        });
      }
    }

    return content;
  }

  // Generate HTML content for the converted site
  function generateHTMLContent(site, baseFileName): any {
    // Create basic HTML structure
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseFileName}</title>
    <link rel="stylesheet" href="${baseFileName}.css">
</head>
<body data-layout="${site.layout}" data-theme="${site.theme}">
    <div id="site-container" class="site-container">
        ${generateSectionsHTML(site.sections)}
    </div>
    <script src="${baseFileName}.js"></script>
</body>
</html>`;
  }

  // Generate sections HTML
  function generateSectionsHTML(sections): any {
    let html = '';
    sections.forEach(section => {
      html += `
<!-- Section: ${section.title} -->
<section id="${section.id}" class="content-section ${section.type}-section" data-type="${section.type}">
    ${section.content}
</section>`;
    });
    return html;
  }

  // Generate CSS content
  function generateCSSContent(site, baseFileName): any {
    // Start with base styles
    let css = `/* Generated CSS for ${baseFileName} */
/* Theme: ${site.theme} */
/* Layout: ${site.layout} */

:root {
    --primary: #6366f1;
    --background: ${site.theme === 'dark' ? '#121212' : '#ffffff'};
    --text: ${site.theme === 'dark' ? '#ffffff' : '#333333'};
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--background);
    color: var(--text);
}

.site-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.content-section {
    margin-bottom: 40px;
    padding: 20px;
    border-radius: 8px;
    background-color: ${site.theme === 'dark' ? '#1e1e1e' : '#f9f9f9'};
}

/* Add extracted styles */
${site.styles || ''}

/* Additional extracted CSS */
${site.extractedCSS || ''}
`;
    return css;
  }

  // Generate JS content
  function generateJSContent(site, baseFileName): any {
    return `// Generated JavaScript for ${baseFileName}
// Theme: ${site.theme}
// Layout: ${site.layout}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Converted website loaded');
    
    // Initialize any interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
        });
    });
    
    // Add more initialization code here
});

// Additional extracted JavaScript
${site.extractedJS || ''}
`;
  }

  // Save files to a folder using the File System Access API (modern browsers only)
  async function saveFilesToFolder(baseFileName, htmlContent, cssContent, jsContent): any {
    try {
      // Request a directory from the user
      const dirHandle = await window.showDirectoryPicker({
        id: 'converted-site',
        startIn: 'downloads',
        mode: 'readwrite'
      });

      // Create or get the 'converted' subfolder (now called "conversion")
      let convertedDirHandle;
      try {
        convertedDirHandle = await dirHandle.getDirectoryHandle('conversion', { create: true });
      } catch (error) {
        console.error('Error creating conversion directory:', error);
        convertedDirHandle = dirHandle; // fallback to selected directory
      }

      // Add timestamp to filename for unique organization and sorting
      const timestamp = new Date().getTime();
      const fileName = `${baseFileName}_${timestamp}`;

      // Function to write a file
      async function writeFile(name, contents): any {
        const fileHandle = await convertedDirHandle.getFileHandle(name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(contents);
        await writable.close();
        return fileHandle;
      }

      // Save the files in stacked order (html, css, js)
      const htmlFileHandle = await writeFile(`${fileName}.html`, htmlContent);
      await writeFile(`${fileName}.css`, cssContent);
      await writeFile(`${fileName}.js`, jsContent);

      // Store info about this conversion in localStorage for later access
      // Get existing conversion list or create a new one
      let conversionList = JSON.parse(localStorage.getItem('conversionHistory') || '[]');

      // Add this conversion to the top of the list (newest first)
      conversionList.unshift({
        baseFileName: baseFileName,
        fileName: fileName,
        timestamp: timestamp,
        date: new Date().toLocaleString(),
        path: convertedDirHandle.name + '/' + fileName + '.html'
      });

      // Limit the history to 50 entries to prevent localStorage bloat
      if (conversionList.length > 50) {
        conversionList = conversionList.slice(0, 50);
      }

      // Save updated list
      localStorage.setItem('conversionHistory', JSON.stringify(conversionList));

      alert('Files saved successfully to the conversion folder!');

      return {
        dirHandle: convertedDirHandle,
        fileName: fileName
      };

    } catch (error) {
      console.error('Error using File System API:', error);
      throw error; // Rethrow for the caller to handle
    }
  }

  // For browsers that don't support the File System Access API
  function fallbackSaveFiles(baseFileName, htmlContent, cssContent, jsContent): any {
    // Create download links for each file
    createAndDownloadFile(`${baseFileName}.html`, htmlContent, 'text/html');
    createAndDownloadFile(`${baseFileName}.css`, cssContent, 'text/css');
    createAndDownloadFile(`${baseFileName}.js`, jsContent, 'application/javascript');
  }

  // Show dialog to select from previously converted files
  function showConversionHistory(): any {
    // Get conversion history
    const conversionList = JSON.parse(localStorage.getItem('conversionHistory') || '[]');

    if (conversionList.length === 0) {
      alert('No conversion history found. Please convert a site first.');
      return null;
    }

    // Create modal for file selection
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'history-modal';

    // Create modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Select Converted Site</h2>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <p>Select a previously converted site to open in the builder:</p>
          <div class="file-list">
            ${conversionList.map((item, index) => `
              <div class="file-item" data-index="${index}">
                <div class="file-name">${item.baseFileName}</div>
                <div class="file-date">${item.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button id="open-selected" class="button primary">Open Selected</button>
          <button id="cancel-selection" class="button">Cancel</button>
        </div>
      </div>
    `;

    // Add modal to the document
    document.body.appendChild(modal);

    // Add styles for the modal
    const style = document.createElement('style');
    style.textContent = `
      .file-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #ddd;
        margin: 10px 0;
      }
      .file-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
      }
      .file-item:hover {
        background-color: #f5f5f5;
      }
      .file-item.selected {
        background-color: #e0f0ff;
      }
      .file-name {
        font-weight: bold;
      }
      .file-date {
        color: #666;
        font-size: 0.9em;
      }
    `;
    document.head.appendChild(style);

    return new Promise((resolve, reject): any => {
      // Event listeners
      const closeBtn = modal.querySelector('.close-modal');
      const cancelBtn = modal.querySelector('#cancel-selection');
      const openBtn = modal.querySelector('#open-selected');
      const fileItems = modal.querySelectorAll('.file-item');

      let selectedIndex = null;

      // Select first item by default
      if (fileItems.length > 0) {
        fileItems[0].classList.add('selected');
        selectedIndex = 0;
      }

      // File item click
      fileItems.forEach(item => {
        item.addEventListener('click', (): any => {
          // Remove selected class from all items
          fileItems.forEach(i => i.classList.remove('selected'));
          // Add selected class to clicked item
          item.classList.add('selected');
          selectedIndex = parseInt(item.dataset.index);
        });
      });

      // Close/cancel button
      const closeModal = () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        resolve(null);
      };

      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);

      // Open button
      openBtn.addEventListener('click', (): any => {
        if (selectedIndex !== null) {
          const selected = conversionList[selectedIndex];
          document.body.removeChild(modal);
          document.head.removeChild(style);
          resolve(selected);
        } else {
          alert('Please select a file to open.');
        }
      });
    });
  }

  // Function to scan the toBeConverted folder and get files
  async function scanToBeConvertedFolder(): any {
    try {
      // Use the File System Access API to scan the folder
      const toBeConvertedFiles: any[] = [];

      try {
        // Try to get permission to access the toBeConverted folder
        const dirHandle = await window.showDirectoryPicker({
          id: 'to-be-converted',
          startIn: 'documents',
          mode: 'read'
        });

        // Check if this is the toBeConverted folder, or look for it as a subfolder
        let toBeConvertedHandle = null;

        // First check if the selected folder is named 'toBeConverted'
        if (dirHandle.name === 'toBeConverted') {
          toBeConvertedHandle = dirHandle;
        } else {
          // Otherwise, try to find a 'toBeConverted' subfolder
          try {
            toBeConvertedHandle = await dirHandle.getDirectoryHandle('toBeConverted', { create: false });
          } catch (error) {
            // No toBeConverted subfolder exists
            console.log('No toBeConverted subfolder in selected directory');
          }
        }

        // If we found the toBeConverted folder, scan its files
        if (toBeConvertedHandle) {
          console.log('Scanning toBeConverted folder...');

          // Iterate through entries in the folder
          for await (const [name, entry] of toBeConvertedHandle.entries()) {
            if (entry.kind === 'file' && (name.endsWith('.html') || name.endsWith('.htm'))) {
              // Get file data
              const file = await entry.getFile();
              toBeConvertedFiles.push({
                name: file.name,
                lastModified: file.lastModified,
                file: file
              });
            }
          }

          // Sort files by last modified date (newest first)
          toBeConvertedFiles.sort((a, b) => b.lastModified - a.lastModified);

          // Store folder handle for later use
          localStorage.setItem('toBeConvertedFolderHandle', JSON.stringify({
            name: toBeConvertedHandle.name,
            path: await toBeConvertedHandle.requestPermission({ mode: 'read' })
          }));
        }
      } catch (error) {
        console.log('User cancelled folder selection or permission denied:', error);
      }

      return toBeConvertedFiles;
    } catch (error) {
      console.error('Error scanning toBeConverted folder:', error);
      return [];
    }
  }

  // Function to populate the file selection dropdown
  function populateFileDropdown(files): any {
    // Create or get the dropdown element
    let fileDropdown = document.getElementById('file-dropdown');

    if (!fileDropdown) {
      // Create the dropdown if it doesn't exist
      const fileInputContainer = document.querySelector('.file-input');

      if (fileInputContainer) {
        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'file-dropdown-container';

        // Create label
        const label = document.createElement('label');
        label.setAttribute('for', 'file-dropdown');
        label.textContent = 'Or select from toBeConverted:';

        // Create select element
        fileDropdown = document.createElement('select');
        fileDropdown.id = 'file-dropdown';
        fileDropdown.className = 'file-dropdown';

        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select a file --';
        fileDropdown.appendChild(emptyOption);

        // Add dropdown to container
        dropdownContainer.appendChild(label);
        dropdownContainer.appendChild(fileDropdown);

        // Add container after file input
        fileInputContainer.insertAdjacentElement('afterend', dropdownContainer);
      }
    }

    // If we have a dropdown now, populate it
    if (fileDropdown) {
      // Clear existing options (except the first empty one)
      while (fileDropdown.options.length > 1) {
        fileDropdown.remove(1);
      }

      // Add files to dropdown
      files.forEach(fileInfo => {
        const option = document.createElement('option');
        option.value = fileInfo.name;
        option.textContent = fileInfo.name;
        option.dataset.fileIndex = files.indexOf(fileInfo);
        fileDropdown.appendChild(option);
      });

      // Store files in a global variable for later access
      window.toBeConvertedFiles = files;

      // Add change event to select a file
      fileDropdown.addEventListener('change', function () {
        const selectedIndex = this.selectedOptions[0].dataset.fileIndex;
        if (selectedIndex) {
          const selectedFile = window.toBeConvertedFiles[selectedIndex];
          if (selectedFile && selectedFile.file) {
            // Update the file name display
            const fileNameDisplay = document.getElementById('file-name');
            if (fileNameDisplay) {
              fileNameDisplay.textContent = selectedFile.name;
            }

            // Enable convert button
            const convertBtn = document.getElementById('convert-btn');
            if (convertBtn) {
              convertBtn.disabled = false;
            }

            // Store the selected file to use when converting
            window.selectedToBeConvertedFile = selectedFile.file;
          }
        }
      });

      // Select the first file by default if available
      if (files.length > 0) {
        fileDropdown.selectedIndex = 1; // First file (after the empty option)
        fileDropdown.dispatchEvent(new Event('change'));
      }
    }
  }
});

// Function to organize files by prefix in file explorer view
// This is mostly illustrative as the actual file explorer view is controlled by the OS
function organizeFilesByPrefix(files): any {
  // Group files by their base name (without extension)
  const fileGroups: any = {};

  files.forEach(file => {
    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');

    if (!fileGroups[baseName]) {
      fileGroups[baseName] = [];
    }

    fileGroups[baseName].push({
      name: file.name,
      ext: ext,
      file: file
    });
  });

  // Sort each group by extension priority (html, css, js/ts)
  const extensionPriority = {
    'html': 1,
    'htm': 2,
    'css': 3,
    'js': 4,
    'ts': 5
  };

  Object.keys(fileGroups).forEach(baseName => {
    fileGroups[baseName].sort((a, b): any => {
      const priorityA = extensionPriority[a.ext] || 999;
      const priorityB = extensionPriority[b.ext] || 999;
      return priorityA - priorityB;
    });
  });

  return fileGroups;
}

// Update the wb.html to load the converted site if requested
window.addEventListener('DOMContentLoaded', (): any => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('loadConverted') === 'true') {
    // First check if we have a direct converted site in localStorage
    const convertedSite = localStorage.getItem('convertedSite');
    if (convertedSite) {
      try {
        const site = JSON.parse(convertedSite);
        window.siteConverter.applySiteToBuilder(site)
          .then((): any => {
            console.log('Converted site loaded in builder');
          })
          .catch(error => {
            console.error('Error loading converted site:', error);
          });
      } catch (error) {
        console.error('Error parsing converted site data:', error);
      }
    } else {
      // Otherwise check if we're opening from conversion history
      const openingInfo = localStorage.getItem('openingConvertedSite');
      if (openingInfo) {
        try {
          const info = JSON.parse(openingInfo);
          console.log('Opening converted site from history:', info);

          // Here you would actually load the file from the file system
          // For now we'll show a message about what should happen
          alert(`In a complete implementation, this would load the file from: ${info.path}`);

          // In practice, this would require additional permissions and APIs
          // to directly load the files from the saved location

          // For now, we'll just show the message

          // Clear the openingConvertedSite info
          localStorage.removeItem('openingConvertedSite');
        } catch (error) {
          console.error('Error opening site from history:', error);
        }
      }
    }
  }
});
