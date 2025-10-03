// @ts-nocheck
// Command-line utility for manual conversion
// Usage: node convert-file.js path/to/file.html

import * as fs from "fs";
import * as path from "path";
const { JSDOM } = require('jsdom');

const SCRIPT_DIR = __dirname;
const WATCH_DIR = path.join(SCRIPT_DIR, 'toBeConverted');
const OUTPUT_DIR = path.join(SCRIPT_DIR, 'converted');
const CONTROLLER_PATH = '../wb-controller.js'; // Relative path from converted file

// Ensure output directory exists
function ensureDirectoryExists(directory): any {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
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

// Add CSS compatibility properties alongside vendor prefixes
function addCssCompatibility(html): any {
  // Process CSS in style tags
  html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, function (match, attributes, cssContent) {
    const processedCss = processCssContent(cssContent);
    return `<style${attributes}>${processedCss}</style>`;
  });

  return html;
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
    // 2. Add injection point and controller script at the end of body
    const injectionPoint = document.createElement('wb-controller-injection-point');
    injectionPoint.style.display = 'none';
    document.body.appendChild(injectionPoint);

    const script = document.createElement('script');
    script.src = CONTROLLER_PATH;
    document.body.appendChild(script);

    // 3. Get the modified HTML
    let processedHtml = dom.serialize();

    // 4. Save to the converted folder
    const outputPath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(outputPath, processedHtml, 'utf8');

    console.log(`Successfully converted ${fileName} to ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error(`Error converting ${fileName}:`, error);
    return null;
  }
}

// Main function
function main(): any {
  // Get file path from command line args
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Please provide a file path to convert');
    console.log('Usage: node convert-file.js path/to/file.html');
    process.exit(1);
  }

  // Ensure file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);

  // Convert file
  const result = convertHtmlFile(filePath);

  if (result) {
    console.log('Conversion completed successfully!');
  } else {
    console.error('Conversion failed');
    process.exit(1);
  }
}

// Run main function
main();
