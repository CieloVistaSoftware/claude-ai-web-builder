# WB Component Navigator - Documentation

**Purpose:**
The WB Component Navigator extension brings advanced IDE features to VS Code for web components. It enables:
- Go to Definition for custom elements (e.g., `<wb-button>`)
- Find All References to components across your project
- Hover Info and Auto-Complete for web components
- Indexing and navigation of all WB components in your workspace

Its goal is to make working with custom web components in VS Code as productive and intelligent as working with native code, improving navigation, understanding, and development speed.

This README consolidates all key information and guidance from the original documentation files for the WB Component Navigator extension.

## When and How to Use This Folder

The `wb-component-navigator` folder is for developing, building, installing, and troubleshooting the WB Component Navigator VS Code extension.

**Use this folder when:**
- You want to develop or modify the extension’s source code.
- You need to build or compile the extension (`npm install`, `npm run build`, or use the provided batch scripts).
- You want to install the extension into VS Code (`INSTALL-EXTENSION.bat` or manual install scripts).
- You need to run diagnostics, check status, or troubleshoot issues (`CHECK-STATUS.bat` and other scripts).
- You need documentation or setup instructions (see the `docs` subfolder).

**How to use it:**
1. Open the folder in VS Code for extension development.
2. Run setup scripts or npm commands to install dependencies and build.
3. Use install scripts to add the extension to your VS Code environment.
4. Reference the documentation in `docs/` for guidance and troubleshooting.

**Summary:**
Use `wb-component-navigator` whenever you need to work on, install, or maintain the WB Component Navigator extension.

## Overview
WB Component Navigator is a VS Code extension that provides IDE-like intelligence for web components. It enables features such as Go to Definition, Find All References, Hover Info, and Auto-Complete for custom elements in your workspace.

## Architecture & System Flow
- See `ARCHITECTURE.md` for a full system diagram and data flow.
- The extension connects the VS Code UI, a Node.js language server, and your workspace files using the Language Server Protocol (LSP).
- Components are indexed from the `components/` directory, with metadata extracted from their JS, CSS, and demo files.

## Quickstart
1. Install dependencies and compile the extension using `SETUP.bat`.
2. Install the extension in VS Code using `INSTALL-EXTENSION.bat` or manual install scripts.
3. Launch VS Code with the extension loaded using `LAUNCH-WB.bat` or `LAUNCH-WB-INSIDERS.bat`.
4. Open your project folder and look for the "WB COMPONENTS" sidebar.

## Troubleshooting
- If the sidebar does not show, see `SIDEBAR-NOT-SHOWING.md`.
- For F5/debugging issues, see `F5-TROUBLESHOOTING.md`.
- Use `CHECK-STATUS.bat` to diagnose installation and build problems.

## File Inventory & Commands
- All key files and their purposes are listed in `FILE-INVENTORY.md`.
- For code fixes and automation, see `FIX-CODE-COMMAND.md`.
- For the simplest install and usage, see `EASIEST-WAY.md` and `SUPER-SIMPLE-INSTALL.md`.

## Manual & Automated Install
- Use `MANUAL-INSTALL.bat` or `MANUAL-INSTALL-INSIDERS.bat` to copy the extension to your VS Code extensions folder.
- Use `INSTALL-EXTENSION.bat` for automated packaging and installation.

## Additional Help
- For basic usage, see `SIMPLE-INSTRUCTIONS.md`.
- For project details, see `PROJECT-OVERVIEW.md` and `DELIVERY-SUMMARY.md`.
- For sidebar location and tips, see `WHERE-IS-SIDEBAR.md`.

## Note
If any documentation is missing, refer to the architecture file and project source code for guidance. All scripts for setup, install, and diagnostics are in the `scripts/` folder.

---
This README replaces all individual markdown docs for easier reference and maintenance.