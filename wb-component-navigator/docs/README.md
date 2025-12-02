# WB Component Navigator - Documentation

This README provides a summary and index for all documentation files now located in the `docs` folder. For detailed setup, troubleshooting, and usage instructions, refer to the following markdown files:

- `ARCHITECTURE.md` — System overview and architecture
- `FILE-INVENTORY.md` — Complete file and folder inventory
- `F5-TROUBLESHOOTING.md` — Debugging and troubleshooting F5 issues
- `EASIEST-WAY.md` — Simplest install and usage steps
- `DELIVERY-SUMMARY.md` — Release and delivery notes
- `FIX-CODE-COMMAND.md` — Code fix and automation commands
- `BEFORE-AFTER.md`, `INDEX.md` — Additional setup and reference docs

All documentation is now consolidated in the `docs` folder for easy access.

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