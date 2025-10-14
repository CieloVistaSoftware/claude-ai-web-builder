# WB Components: Purpose, Usage, and References

## What is `wb-components.js`?

`wb-components.js` is a legacy or utility JavaScript file that was used in the WB Website Builder project to bundle or initialize shared styles, utilities, or component registration logic for the WB (Web Builder) component ecosystem. It was typically referenced in HTML files or manifests to ensure that all required WB component styles and scripts were loaded for the application or demo environment.

## Typical Contents
- May include global style initialization, event dispatchers, or component registry hooks.
- Sometimes used to trigger a `wb-components-ready` event or similar for integration with other tools.
- Not always required if your loader or build system now loads all components and styles individually or via a manifest.

## Where is it found?
- `styles/wb-components.js` (main runtime location)
- `docs/prototype/styles/wb-components.js` (demo/prototype location)
- `tools/wb-components.js` (may be a build artifact or script, not always loaded at runtime)

## Who/What Uses It?
- Referenced in older or prototype HTML files, e.g.:
  - `docs/prototype/simple-ide.html`
  - `docs/prototype/components/wb-event-log/wb-event-log-schema-viewer.html`
  - `components/wb-event-log/wb-event-log-schema-viewer.html`
- Listed in `manifest.json` files under the `styles` array, so the dynamic loader may attempt to load it.
- Mentioned in documentation and markdown files as a bundled or legacy entry point.

## Current Status
- If your project now uses a dynamic loader (like `index.js`) and loads all components and styles explicitly, `wb-components.js` may no longer be needed.
- If you remove all references from HTML and manifest files, it is safe to delete or archive this file.

## How to Remove
1. Remove `<script ...wb-components.js...>` tags from all HTML files.
2. Remove `"wb-components.js"` from the `styles` array in all `manifest.json` files.
3. Delete or archive the file from `styles/`, `docs/prototype/styles/`, and `tools/` if not needed for build tooling.

## Why Wasn't This Caught by the Build?
- Standard JS/TS compilers and bundlers only check for missing imports/exports in code, not for script tags in HTML or manifest entries.
- To catch missing or unused files referenced in HTML, use a linter, custom script, or a build tool that checks HTML/script references.

---

**Summary:**
`wb-components.js` was a shared entry point for WB component styles and logic, referenced in several places for legacy or demo reasons. If your new loader covers all component loading, you can safely remove it and its references.
