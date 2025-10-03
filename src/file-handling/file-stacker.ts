// @ts-nocheck
/**
 * File Stacker Utility
 * 
 * This utility helps organize files by ensuring files with the same prefix 
 * are properly stacked (e.g., file.html, file.css, file.js, file.ts)
 * Files can be stacked in a designated folder or downloaded as a zip bundle
 * 
 * Usage:
 * 1. Create a new FileStacker instance: const stacker = new FileStacker('output-dir');
 * 2. Add files to the stacker: stacker.addFile('myfile.html', htmlContent);
 * 3. Save all files: await stacker.saveAll();
 * 
 * Files will be grouped by their base name (without extension) and saved
 * in the correct order (HTML, CSS, JS, then TS).
 */

// Constants for file extensions and their order
const EXTENSION_ORDER = {
  'html': 1,
  'htm': 2,
  'css': 3,
  'js': 4,
  'ts': 5
};

// File type mapping with extensions and MIME types
const FILE_TYPES = {
  html: {
    extensions: ['html', 'htm'],
    mimeType: 'text/html'
  },
  css: {
    extensions: ['css'],
    mimeType: 'text/css'
  },
  javascript: {
    extensions: ['js'],
    mimeType: 'application/javascript'
  },
  typescript: {
    extensions: ['ts'],
    mimeType: 'application/typescript'
  }
};

// Main file stacker class
class FileStacker {
  constructor(baseDirectory = 'converted') {
    this.baseDirectory = baseDirectory;
    this.fileGroups = {};
  }

  // Add a file to be stacked
  addFile(fileName, content, type) {
    const fileInfo = this.parseFileName(fileName);

    if (!this.fileGroups[fileInfo.baseName]) {
      this.fileGroups[fileInfo.baseName] = [];
    }

    this.fileGroups[fileInfo.baseName].push({
      name: fileName,
      ext: fileInfo.extension,
      content: content,
      type: type || this.getMimeType(fileInfo.extension)
    });

    return this;
  }

  // Parse a filename into base name and extension
  parseFileName(fileName) {
    const nameParts = fileName.split('.');
    const extension = nameParts.pop().toLowerCase();
    const baseName = nameParts.join('.');

    return { baseName, extension };
  }
  // Get MIME type from extension
  getMimeType(extension) {
    // First check in our FILE_TYPES mapping
    const ext = extension.toLowerCase();

    for (const [type, info] of Object.entries(FILE_TYPES)) {
      if (info.extensions.includes(ext)) {
        return info.mimeType;
      }
    }

    // Fallback to the explicit mapping for other file types
    const mimeTypes = {
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'ts': 'application/typescript',
      'json': 'application/json',
      'txt': 'text/plain',
      'md': 'text/markdown'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
  // Save all files in stacked order
  async saveAll() {
    try {
      // Check if we have files to save
      const groupCount = Object.keys(this.fileGroups).length;
      console.log(`Saving ${groupCount} file groups`);

      if (groupCount === 0) {
        throw new Error('No files to save. Please stack files first.');
      }

      // First, try to use the File System Access API if available
      if (window.showDirectoryPicker) {
        console.log("Using File System Access API to save files");
        const savedFiles = await this.saveWithFileSystemAPI();
        console.log(`Successfully saved ${savedFiles.length} files with File System API`);
        return true;
      } else {
        // Fallback to downloading files
        console.log("File System API not available, falling back to download method");
        this.saveWithDownload();
        return true;
      }
    } catch (error) {
      console.error('Error saving stacked files:', error);

      // Fallback to download if File System API failed with permission errors
      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        console.log("Permission error with File System API, falling back to download method");
        try {
          this.saveWithDownload();
          return true;
        } catch (downloadError) {
          console.error("Error in fallback download method:", downloadError);
          throw downloadError;
        }
      }

      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
  // Save files using the File System Access API (modern browsers only)
  async saveWithFileSystemAPI() {
    console.log("Saving files with File System Access API");

    try {
      // Request a directory from the user with clear instructions
      const dirHandle = await window.showDirectoryPicker({
        id: 'converted-site',
        startIn: 'downloads',
        mode: 'readwrite'
      });

      console.log("Directory selected:", dirHandle.name);

      // Create or get the base directory
      let baseDirHandle;
      try {
        // Try to create a subdirectory for the stacked files
        console.log(`Creating subdirectory: ${this.baseDirectory}`);
        baseDirHandle = await dirHandle.getDirectoryHandle(this.baseDirectory, { create: true });
        console.log("Subdirectory created successfully");
      } catch (error) {
        console.warn(`Could not create subdirectory '${this.baseDirectory}', using selected directory instead:`, error);
        baseDirHandle = dirHandle;
      }

      // Keep track of saved files
      const savedFiles: any[] = [];

      // Save each group of files
      for (const baseName of Object.keys(this.fileGroups)) {
        console.log(`Processing file group: ${baseName}`);

        // Sort files by extension priority
        const files = this.sortFilesByExtension(this.fileGroups[baseName]);
        console.log(`Files to save for ${baseName}:`, files.map(f => f.name).join(', '));

        // Save each file
        for (const file of files) {
          try {
            console.log(`Creating file: ${file.name}`);
            const fileHandle = await baseDirHandle.getFileHandle(file.name, { create: true });
            const writable = await fileHandle.createWritable();

            // Write content
            await writable.write(file.content);
            await writable.close();

            savedFiles.push(file.name);
            console.log(`Successfully saved file: ${file.name}`);
          } catch (fileError) {
            console.error(`Error saving file ${file.name}:`, fileError);
            throw new Error(`Failed to save ${file.name}: ${fileError.message}`);
          }
        }
      }

      console.log(`Successfully saved ${savedFiles.length} files to ${baseDirHandle.name}/${this.baseDirectory}`);
      return savedFiles;
    } catch (error) {
      console.error("Error in saveWithFileSystemAPI:", error);
      throw error;
    }
  }
  // Save files by triggering downloads (fallback method)
  saveWithDownload() {
    console.log("Starting file download process");
    let downloadCount = 0;
    const downloadedFiles: any[] = [];

    // For each group of files
    for (const baseName of Object.keys(this.fileGroups)) {
      console.log(`Preparing download for file group: ${baseName}`);

      // Sort files by extension priority
      const files = this.sortFilesByExtension(this.fileGroups[baseName]);

      // Schedule downloads with increasing delays to prevent browser blocking
      files.forEach((file, index): any => {
        setTimeout((): any => {
          try {
            console.log(`Creating download for: ${file.name}`);
            const blob = new Blob([file.content], { type: file.type });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);

            // Format path with directory included (won't actually create folders)
            a.download = `${this.baseDirectory}/${file.name}`;

            // Trigger download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up the URL object
            setTimeout((): any => {
              URL.revokeObjectURL(a.href);
            }, 100);

            downloadedFiles.push(file.name);
            downloadCount++;

            console.log(`File "${file.name}" download triggered (${downloadCount} of ${files.length})`);

            // Show a message when all downloads are complete
            if (downloadCount === files.length) {
              setTimeout((): any => {
                alert(`${downloadCount} files have been downloaded. Check your downloads folder.`);
              }, 500);
            }
          } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error);
          }
        }, index * 500); // Add increasing delay between downloads (500ms per file)
      });
    }

    return downloadedFiles;
  }

  // Sort files by extension priority (html, css, js, ts, etc.)
  sortFilesByExtension(files) {
    return files.sort((a, b): any => {
      const priorityA = EXTENSION_ORDER[a.ext.toLowerCase()] || 999;
      const priorityB = EXTENSION_ORDER[b.ext.toLowerCase()] || 999;
      return priorityA - priorityB;
    });
  }
  // List all file groups
  listGroups() {
    const groups: any = {};

    for (const baseName of Object.keys(this.fileGroups)) {
      groups[baseName] = this.sortFilesByExtension(this.fileGroups[baseName])
        .map(file => file.name);
    }

    return groups;
  }

  // Get all files as a flat array
  getFiles() {
    let allFiles: any[] = [];

    for (const baseName of Object.keys(this.fileGroups)) {
      const files = this.sortFilesByExtension(this.fileGroups[baseName]);
      allFiles = allFiles.concat(files);
    }

    return allFiles;
  }

  // Clear all file groups
  clear() {
    this.fileGroups = {};
    return this;
  }
}

// Export FileStacker to the global scope
if (typeof window !== 'undefined') {
  window.FileStacker = FileStacker;
  console.log('FileStacker registered as global variable');
}

// Also make it available as a module export if needed
if (typeof module !== 'undefined' && module.exports) {
  export default FileStacker;
}

// Update the converter.js to use FileStacker
document.addEventListener('DOMContentLoaded', (): any => {
  // Add FileStacker to the converter.js saveFilesToFolder function if it exists
  if (typeof saveFilesToFolder === 'function') {
    const originalSave = saveFilesToFolder;

    // Override with version that uses FileStacker
    window.saveFilesToFolder = async function (baseFileName, htmlContent, cssContent, jsContent) {
      // Create a new FileStacker instance
      const stacker = new FileStacker('converted');

      // Add the files
      stacker.addFile(`${baseFileName}.html`, htmlContent, 'text/html');
      stacker.addFile(`${baseFileName}.css`, cssContent, 'text/css');
      stacker.addFile(`${baseFileName}.js`, jsContent, 'application/javascript');

      // Save all files in stacked order
      const result = await stacker.saveAll();

      if (result) {
        alert('Files saved successfully in stacked order!');
      } else {
        // Fall back to the original implementation
        return originalSave(baseFileName, htmlContent, cssContent, jsContent);
      }
    };
  }
});
