export {};
// @ts-nocheck
/**
 * Stack Existing Files Tool
 * 
 * This script stacks all HTML files with their corresponding CSS and JS/TS files
 * into a "stacked" directory. It uses the FileStacker class to organize files.
 */

// Make sure FileStacker is loaded
if (typeof FileStacker !== 'function') {
  console.error('FileStacker class not available. Please make sure file-stacker.js is loaded first.');
}

// Configuration
const STACK_CONFIG = {
  outputDir: 'stacked',  // Directory where stacked files will be placed
  extensions: {
    html: ['.html', '.htm'],
    css: ['.css'],
    script: ['.js', '.ts']
  }
};

// Main stacking controller
class FileStackingTool {
  constructor() {
    this.stacker = new FileStacker(STACK_CONFIG.outputDir);
    this.filesStacked = {
      html: [],
      css: [],
      script: [],
      total: 0
    };
    this.fileMap = new Map(); // Maps base names to files

    // Add callback support for tracking file processing progress
    this.onFileProcessed = null; // Optional callback function
  }

  // Initialize the stacking process
  async initialize() {
    try {
      console.log('Starting file stacking process...');

      // First scan for HTML files
      await this.scanFiles();

      // Then stack them together
      await this.stackFiles();

      return this.filesStacked;
    } catch (error) {
      console.error('Error stacking files:', error);
      throw error;
    }
  }

  // Scan the file system for HTML, CSS, and JS/TS files
  async scanFiles() {
    console.log('Scanning workspace for files...');

    try {
      // In a browser environment, we can't directly access the file system
      // So we need to provide a UI for the user to select files

      // Get file input references
      const htmlFileSelector = document.getElementById('html-file-selector');
      const cssFileSelector = document.getElementById('css-file-selector');
      const scriptFileSelector = document.getElementById('script-file-selector');

      if (!htmlFileSelector || !cssFileSelector || !scriptFileSelector) {
        throw new Error('File selectors not found. Please make sure the UI is properly set up.');
      }

      // Create a promise to wait for file selection
      this.fileSelectionPromise = new Promise((resolve): any => {
        this.resolveFileSelection = resolve;
      });

      // Show the file selection UI
      document.getElementById('file-selection-ui').style.display = 'block';

      // Set up event handlers for file selection
      document.getElementById('stack-files-btn').onclick = () => this.handleFileSelection(
        htmlFileSelector.files,
        cssFileSelector.files,
        scriptFileSelector.files
      );

      // Wait for user to select files
      await this.fileSelectionPromise;

    } catch (error) {
      console.error('Error scanning files:', error);
      throw error;
    }
  }

  // Handle file selection from UI
  handleFileSelection(htmlFiles, cssFiles, scriptFiles) {
    console.log('Files selected:', {
      html: htmlFiles ? htmlFiles.length : 0,
      css: cssFiles ? cssFiles.length : 0,
      script: scriptFiles ? scriptFiles.length : 0
    });

    // Process HTML files
    if (htmlFiles) {
      for (const file of htmlFiles) {
        const baseInfo = this.getBaseFileName(file.name);
        if (!this.fileMap.has(baseInfo.baseName)) {
          this.fileMap.set(baseInfo.baseName, { html: null, css: [], script: [] });
        }
        this.fileMap.get(baseInfo.baseName).html = file;
        this.filesStacked.html.push(file.name);
      }
    }

    // Process CSS files
    if (cssFiles) {
      for (const file of cssFiles) {
        const baseInfo = this.getBaseFileName(file.name);
        if (!this.fileMap.has(baseInfo.baseName)) {
          this.fileMap.set(baseInfo.baseName, { html: null, css: [], script: [] });
        }
        this.fileMap.get(baseInfo.baseName).css.push(file);
        this.filesStacked.css.push(file.name);
      }
    }

    // Process script files
    if (scriptFiles) {
      for (const file of scriptFiles) {
        const baseInfo = this.getBaseFileName(file.name);
        if (!this.fileMap.has(baseInfo.baseName)) {
          this.fileMap.set(baseInfo.baseName, { html: null, css: [], script: [] });
        }
        this.fileMap.get(baseInfo.baseName).script.push(file);
        this.filesStacked.script.push(file.name);
      }
    }

    // Update total count
    this.filesStacked.total = this.filesStacked.html.length +
      this.filesStacked.css.length +
      this.filesStacked.script.length;

    // Hide the file selection UI
    document.getElementById('file-selection-ui').style.display = 'none';

    // Resolve the promise to continue execution
    if (this.resolveFileSelection) {
      this.resolveFileSelection();
    }
  }

  // Extract base filename and extension
  getBaseFileName(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return { baseName: fileName, extension: '' };
    }

    const baseName = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex + 1).toLowerCase();

    return { baseName, extension };
  }

  // Stack files based on their base names
  async stackFiles() {
    console.log('Stacking files together...');

    try {
      // Create the stacked directory if needed
      try {
        await this.ensureDirectoryExists(STACK_CONFIG.outputDir);
      } catch (err) {
        console.warn('Could not create directory, files will be downloaded directly:', err);
      }

      // Process each base name and its associated files
      for (const [baseName, files] of this.fileMap.entries()) {
        await this.processFileGroup(baseName, files);
      }

      console.log(`Stacking complete. ${this.filesStacked.total} files processed.`);

      // Show results
      this.showResults();

    } catch (error) {
      console.error('Error stacking files:', error);
      throw error;
    }
  }  // Process a group of files with the same base name
  async processFileGroup(baseName, files) {
    console.log(`Processing ${baseName} files:`, files);

    try {
      // Skip if no HTML file (required as the main file)
      if (!files.html) {
        console.log(`Skipping ${baseName} - no HTML file found`);
        return;
      }

      // Read the HTML file
      console.log(`Reading HTML file for ${baseName}:`, files.html);
      const htmlContent = await this.readFileAsText(files.html);
      console.log(`HTML content length: ${htmlContent.length}`);

      // Add HTML file to stacker
      this.stacker.addFile(`${baseName}.html`, htmlContent, 'text/html');

      // Call the progress callback if defined
      if (typeof this.onFileProcessed === 'function') {
        this.onFileProcessed('html', files.html);
      }

      // Process CSS files
      for (const cssFile of files.css) {
        const cssContent = await this.readFileAsText(cssFile);
        this.stacker.addFile(`${baseName}.css`, cssContent, 'text/css');

        // Call the progress callback if defined
        if (typeof this.onFileProcessed === 'function') {
          this.onFileProcessed('css', cssFile);
        }
      }

      // Process script files
      for (const scriptFile of files.script) {
        const scriptContent = await this.readFileAsText(scriptFile);
        const extension = this.getBaseFileName(scriptFile.name).extension;
        const mimeType = extension === 'ts' ? 'application/typescript' : 'application/javascript';
        this.stacker.addFile(`${baseName}.${extension}`, scriptContent, mimeType);

        // Call the progress callback if defined
        if (typeof this.onFileProcessed === 'function') {
          this.onFileProcessed('script', scriptFile);
        }
      }

      // Call the onFileProcessed callback if set
      if (typeof this.onFileProcessed === 'function') {
        this.onFileProcessed(baseName, files);
      }

    } catch (error) {
      console.error(`Error processing ${baseName} files:`, error);
    }
  }
  // Read file content as text
  readFileAsText(file) {
    console.log("Reading file as text:", file.name);

    return new Promise((resolve, reject): any => {
      try {
        // Make sure we have a File object
        if (!(file instanceof File)) {
          reject(new Error(`Invalid file object: ${file}`));
          return;
        }

        const reader = new FileReader();
        reader.onload = e => {
          console.log(`Successfully read ${file.name}, length: ${e.target.result.length}`);
          resolve(e.target.result);
        };
        reader.onerror = e => {
          console.error(`Error reading ${file.name}:`, e.target.error);
          reject(new Error(`Error reading ${file.name}: ${e.target.error}`));
        };
        reader.readAsText(file);
      } catch (err) {
        console.error("Exception in readFileAsText:", err);
        reject(err);
      }
    });
  }

  // Make sure directory exists
  async ensureDirectoryExists(dirPath) {
    // In a browser environment, this would use the File System Access API
    // But for now we'll just check if we can write to this directory

    if (window.showDirectoryPicker) {
      try {
        // Request permission to write to the output directory
        const dirHandle = await window.showDirectoryPicker({
          id: 'stacked-files',
          startIn: 'downloads',
          mode: 'readwrite'
        });

        // Store for later use
        this.outputDirHandle = dirHandle;
        return true;
      } catch (error) {
        console.warn('Could not get directory access:', error);
        throw error;
      }
    } else {
      console.warn('File System Access API not available, will use downloads instead.');
      return false;
    }
  }

  // Show stacking results
  showResults() {
    // Create a results summary to show to the user
    const resultsDiv = document.getElementById('stacking-results');
    if (!resultsDiv) {
      console.log('Results summary:', this.filesStacked);
      return;
    }

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Create summary
    const summary = document.createElement('div');
    summary.innerHTML = `
      <h3>File Stacking Complete</h3>
      <p>Total files processed: ${this.filesStacked.total}</p>
      <ul>
        <li>HTML files: ${this.filesStacked.html.length}</li>
        <li>CSS files: ${this.filesStacked.css.length}</li>
        <li>Script files: ${this.filesStacked.script.length}</li>
      </ul>
    `;
    resultsDiv.appendChild(summary);

    // Add a button to save all stacked files
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Stacked Files';
    saveButton.className = 'btn';
    saveButton.onclick = () => this.saveStackedFiles();
    resultsDiv.appendChild(saveButton);

    // Show the results section
    resultsDiv.style.display = 'block';
  }  // Save all stacked files
  async saveStackedFiles() {
    try {
      console.log("Saving stacked files...");

      // Check if we have files to save
      if (!this.stacker || Object.keys(this.stacker.fileGroups).length === 0) {
        throw new Error("No files have been stacked yet. Please stack files before saving.");
      }

      // First, try to get a directory handle for saving
      let outputDirHandle = null;
      let outputLocation = "";

      try {
        // Let user select an output folder
        outputDirHandle = await window.showDirectoryPicker({
          id: "file-stacker-output",
          mode: "readwrite",
          startIn: "documents"
        });

        outputLocation = outputDirHandle.name;
        console.log(`User selected output directory: ${outputLocation}`);

        // Log the files that will be saved
        console.log("Files to save:", this.stacker.listGroups());

        // Save files to selected directory
        for (const groupName in this.stacker.fileGroups) {
          const fileGroup = this.stacker.fileGroups[groupName];
          for (const file of fileGroup) {
            try {
              // Create a new file handle
              const fileHandle = await outputDirHandle.getFileHandle(file.fileName, { create: true });

              // Convert content to proper format and write to file
              const writable = await fileHandle.createWritable();
              await writable.write(file.content);
              await writable.close();

              console.log(`Saved file: ${file.fileName} to ${outputLocation}`);
            } catch (fileError) {
              console.error(`Error saving file ${file.fileName}:`, fileError);
              throw fileError;
            }
          }
        }

        // Show success message with output directory name
        const successMsg = `Stacked files saved successfully to "${outputLocation}" folder!`;
        console.log(successMsg);

        return {
          success: true,
          outputFolder: outputLocation,
          outputDirHandle: outputDirHandle
        };
      } catch (fsError) {
        if (fsError.name === "AbortError") {
          throw new Error("File save operation cancelled");
        }

        console.warn("Could not use Directory Access API, falling back to default save method:", fsError);

        // Use the FileStacker's saveAll method as fallback (downloads)
        await this.stacker.saveAll();

        return {
          success: true,
          outputFolder: "downloads folder",
          outputDirHandle: null
        };
      }
    } catch (error) {
      console.error('Error saving stacked files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', (): any => {
  // Create a button to start the stacking process
  const createStackingButton = () => {
    // Check if the button already exists
    if (document.getElementById('start-stacking-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'start-stacking-btn';
    btn.textContent = 'Stack Files';
    btn.className = 'btn';
    btn.style.position = 'fixed';
    btn.style.bottom = '60px';
    btn.style.right = '20px';
    btn.style.zIndex = '1000';

    btn.onclick = async(): any => {
      try {
        const tool = new FileStackingTool();
        await tool.initialize();
      } catch (error) {
        console.error('Error initializing stacking tool:', error);
        alert(`Error stacking files: ${error.message}`);
      }
    };

    document.body.appendChild(btn);
  };

  createStackingButton();
});

// Create UI elements for file selection
document.addEventListener('DOMContentLoaded', (): any => {
  // Check if the UI already exists
  if (document.getElementById('file-selection-ui')) return;

  // Create file selection UI
  const fileSelectionUI = document.createElement('div');
  fileSelectionUI.id = 'file-selection-ui';
  fileSelectionUI.style.display = 'none';
  fileSelectionUI.style.position = 'fixed';
  fileSelectionUI.style.top = '50%';
  fileSelectionUI.style.left = '50%';
  fileSelectionUI.style.transform = 'translate(-50%, -50%)';
  fileSelectionUI.style.backgroundColor = 'white';
  fileSelectionUI.style.padding = '20px';
  fileSelectionUI.style.borderRadius = '8px';
  fileSelectionUI.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  fileSelectionUI.style.zIndex = '2000';
  fileSelectionUI.style.width = '400px';
  fileSelectionUI.style.maxWidth = '90%';

  fileSelectionUI.innerHTML = `
    <h3 style="margin-top: 0;">Select Files to Stack</h3>
    <p>Select HTML, CSS, and JS/TS files with matching names to stack together.</p>
    
    <div style="margin-bottom: 15px;">
      <label for="html-file-selector" style="display: block; margin-bottom: 5px;">HTML Files:</label>
      <input type="file" id="html-file-selector" accept=".html,.htm" multiple style="width: 100%;">
    </div>
    
    <div style="margin-bottom: 15px;">
      <label for="css-file-selector" style="display: block; margin-bottom: 5px;">CSS Files:</label>
      <input type="file" id="css-file-selector" accept=".css" multiple style="width: 100%;">
    </div>
    
    <div style="margin-bottom: 15px;">
      <label for="script-file-selector" style="display: block; margin-bottom: 5px;">JavaScript/TypeScript Files:</label>
      <input type="file" id="script-file-selector" accept=".js,.ts" multiple style="width: 100%;">
    </div>
    
    <div style="margin-top: 20px; text-align: right;">
      <button id="cancel-stack-btn" class="btn" style="margin-right: 10px; background-color: #f44336;">Cancel</button>
      <button id="stack-files-btn" class="btn" style="background-color: #4CAF50;">Stack Files</button>
    </div>
  `;

  document.body.appendChild(fileSelectionUI);

  // Create results container
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'stacking-results';
  resultsContainer.style.display = 'none';
  resultsContainer.style.margin = '20px auto';
  resultsContainer.style.maxWidth = '600px';
  resultsContainer.style.padding = '15px';
  resultsContainer.style.backgroundColor = '#f9f9f9';
  resultsContainer.style.borderRadius = '4px';
  resultsContainer.style.border = '1px solid #ddd';

  document.body.appendChild(resultsContainer);

  // Setup cancel button
  document.getElementById('cancel-stack-btn').onclick = () => {
    document.getElementById('file-selection-ui').style.display = 'none';
  };
});
