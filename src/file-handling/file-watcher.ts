// @ts-nocheck
// File Watcher for Website Builder
// This script watches the toBeConverted folder and automatically 
// converts HTML files to the converted folder

import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import * as jsdom from "jsdom";
const { JSDOM } = jsdom;

// Constants
const WATCH_DIR = path.join(__dirname, 'toBeConverted');
const OUTPUT_DIR = path.join(__dirname, 'converted');
const CONTROLLER_PATH = '../wb-controller.js'; // Relative path from converted file to wb-controller.js

// Ensure output directory exists
function ensureDirectoryExists(directory): any {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Add CSS compatibility properties alongside vendor prefixes
function addCssCompatibility(html): any {
  // Process CSS in style tags and inline styles

  // Process style tags
  html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, function (match, attributes, cssContent) {
    const processedCss = processCssContent(cssContent);
    return `<style${attributes}>${processedCss}</style>`;
  });

  // Process inline styles (more complex, but possible with JSDOM)

  return html;
}

// Process CSS content to ensure compatibility
function processCssContent(css): any {
  // Replace webkit-appearance with standard appearance
  css = css.replace(
    /-webkit-appearance:\s*([^;]+);/g,
    '-webkit-appearance: $1; appearance: $1;'
  );

  // Replace webkit-user-select with standard user-select
  css = css.replace(
    /-webkit-user-select:\s*([^;]+);/g,
    '-webkit-user-select: $1; -moz-user-select: $1; -ms-user-select: $1; user-select: $1;'
  );

  // Add more CSS compatibility fixes as needed

  // Fix for transform prefixes
  css = css.replace(
    /-webkit-transform:\s*([^;]+);/g,
    '-webkit-transform: $1; -ms-transform: $1; transform: $1;'
  );

  // Fix for transition prefixes
  css = css.replace(
    /-webkit-transition:\s*([^;]+);/g,
    '-webkit-transition: $1; transition: $1;'
  );

  return css;
}

// Convert an HTML file
function convertHtmlFile(filePath): any {
  const fileName = path.basename(filePath);

  // Skip non-HTML files
  if (!fileName.toLowerCase().endsWith('.html')) {
    console.log(`Skipping non-HTML file: ${fileName}`);
    return;
  }

  console.log(`Converting ${fileName}...`);

  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // First apply CSS compatibility fixes to the raw HTML
    const htmlWithCssFixes = addCssCompatibility(fileContent);

    // Then parse the HTML with JSDOM for structural changes
    const dom = new JSDOM(htmlWithCssFixes);
    const { window } = dom;
    const { document } = window;

    // 1. Mark as wb-compatible
    document.documentElement.setAttribute('data-wb-compatible', 'true');

    // 2. Process inline styles for elements with style attributes
    const elementsWithStyle = document.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      if (el.style) {
        // We can't directly modify CSS properties with JSDOM,
        // but we could add data-attributes as markers if needed
      }
    });
    // 3. Add injection point and controller script at the end of body
    const injectionPoint = document.createElement('wb-controller-injection-point');
    injectionPoint.style.display = 'none';
    document.body.appendChild(injectionPoint);

    const script = document.createElement('script');
    script.src = CONTROLLER_PATH;
    document.body.appendChild(script);

    // 4. Get the modified HTML
    let processedHtml = dom.serialize();

    // 5. Save to the converted folder
    const outputPath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(outputPath, processedHtml, 'utf8');

    console.log(`Successfully converted ${fileName} to ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error(`Error converting ${fileName}:`, error);
    return null;
  }
}

// Initialize watcher
function initializeWatcher(): any {
  // Ensure directories exist
  ensureDirectoryExists(OUTPUT_DIR);

  console.log(`Watching ${WATCH_DIR} for HTML files to convert...`);

  // Set up chokidar watcher
  const watcher = chokidar.watch(`${WATCH_DIR}/**/*.html`, {
    persistent: true,
    ignoreInitial: false
  });

  // Add event listeners
  watcher
    .on('add', (filePath): any => {
      console.log(`File added: ${filePath}`);
      convertHtmlFile(filePath);
    })
    .on('change', (filePath): any => {
      console.log(`File changed: ${filePath}`);
      convertHtmlFile(filePath);
    })
    .on('unlink', (filePath): any => {
      const outputPath = path.join(OUTPUT_DIR, path.basename(filePath));
      console.log(`File deleted: ${filePath}`);

      // Optionally remove the file from converted folder
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`Removed converted file: ${outputPath}`);
      }
    })
    .on('error', (error) => console.error(`Watcher error: ${error}`));
}

// Start the file watcher
initializeWatcher();
