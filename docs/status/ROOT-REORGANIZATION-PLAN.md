# Definition: What Does 'Move' Mean?

In this plan, 'move' means to physically relocate a file or folder from its current location to a new specified directory, using file system operations (such as PowerShell `Move-Item`, shell `mv`, or drag-and-drop in a file explorer). The file is no longer present in its original location and is now found only in the target directory. No placeholders or symbolic links are used—this is a real, verifiable change in the file system.

---

## 🛠️ Step-by-Step Actionable Move Plan

### 1. Create Container Directories
Create the following directories in the root:
- .config
- .github
- src/entry
- src/pages
- src/listeners
- scripts/build
- scripts/utils
- scripts/fix
- scripts/powershell
- scripts/batch
- tests/unit
- tests/integration
- tests/fixtures
- tests/results
- data/schema

### 2. Move Configuration Files
Move these files into `.config`:
- playwright.config.cjs
- playwright.config.js
- playwright.real.config.cjs
- jsconfig.json
- config.js
- config.schema.json

### 3. Move Entry Point Files
Move these files into `src/entry`:
- index.js
- index.html
- index.css
- wb.js
- wb.html
- wb.css

### 4. Move Demo/Assistant Pages
Move these files into `src/pages`:
- wb-assistant.html
- wb-assistant-enhanced.html
- wb-rag-assistant.html
- api-test-client.html

### 5. Move Listener Scripts
Move these files into `src/listeners`:
- page-reactive-listener.js

### 6. Move Utility Scripts
Move these files into `scripts/utils`:
- kill-port.js
- control-panel-validator.js
- debug-env.js
- start-demo.js

### 7. Move Build Scripts
Move these files into `scripts/build`:
- create-component.js
- build-symbols.js
- build-components-json.js
- gen-main-imports.js
- generate-demos-manifest.js
- audit-components.js

### 8. Move Fix/Conversion Scripts
Move these files into `scripts/fix`:
- fix-conversion-syntax-errors.js
- fix-import-paths.js
- fix-wb-html-complete.js
- fix-module-loading.ps1

### 9. Move PowerShell Scripts
Move these files into `scripts/powershell`:
- check-claude-status-v3.ps1
- mark-claude-updated-v3.ps1
- initialize-claude-v3.ps1
- Categorize-Docs.ps1
- move-component-discovery.ps1

### 10. Move Batch Scripts
Move these files into `scripts/batch`:
- run-all-wb-tests.bat
- fix-wb-html-auto.bat
- generate-demos-manifest.bat

### 11. Move Test Results
Move `test-results.json` into `tests/results`

### 12. Move Data Files
Move these files into `data/`:
- custom-elements.json
- wb-components.html-data.json
- knowledge-base.json

### 13. Move Schema Files
Move these files into `data/schema`:
- auto-loader.schema.json
- wb.schema.json
- config.schema.json
- manifest.schema.json

### 14. Move HTML Test/Demo Files
Move all test/demo HTML files into `html/`

### 15. Update README.md in Each Container
Add or update README.md in each new container directory to describe its contents and purpose.

---
# Root Directory Reorganization Plan

## 📊 Current State Analysis

### Root Items Count
- **Total items in root:** 72
- **Directories:** 21
- **Files:** 51 (way too many!)
- **Problem:** Extremely cluttered, hard to navigate

### Current File Breakdown

**Configuration Files (7)**
- package.json, package-lock.json, jsconfig.json
- vite.config.js, config.js, config.schema.json
- playwright.config.* (3 files)

**HTML Demo Files (6)**
- wb.html, index.html, wb-assistant.html, wb-assistant-enhanced.html
- wb-rag-assistant.html, api-test-client.html

**CSS/Styling (2)**
- wb.css, index.css

**JavaScript Entry Points (3)**
- index.js, wb.js, start-demo.js

**Build & Script Files (8)**
- Multiple PowerShell scripts (.ps1)
- Batch files (.bat)
- Fix/conversion scripts (.js)

**API & Events (4)**
- claude-events-api.js, events.md
- claude-api-test.md, claude-events-api.md

**Testing Files (5)**
- quick-test.js, final-validation-test.js, test-*.js
- test-results.json, test-simple-control-panel.md

**Utility Files (3)**
- kill-port.js, page-reactive-listener.js, control-panel-validator.js

**Documentation Files (10+)**
- README.md, CONTRIBUTING.md, various .md files
- Status files, setup instructions, debugging lessons

**JSON Data Files (4)**
- custom-elements.json, wb-components.html-data.json
- claude-json-files.json, knowledge-base.json

**Config/Schema Files (5)**
- *.schema.json files, .env.example

**Miscellaneous (5)**
- favicon files, svg files, HTML test files

---

## 🎯 Reorganization Strategy

### Philosophy: **Container Folders**

Group related items into **logical container directories** with clear purposes. Each container folder will hold subcategories of related items.

---

## 📁 Proposed New Structure

```
wb/ (root)
│
├── 📄 package.json (KEEP - essential)
├── 📄 README.md (KEEP - main entry point)
├── 📄 vite.config.js (KEEP - build config)
├── 📄 .env.example (KEEP - env template)
├── 📄 .gitignore (KEEP - git config)
│
├── 📂 .config/ (Configuration Container)
│   ├── playwright.config.cjs
│   ├── playwright.config.js
│   ├── playwright.real.config.cjs
│   ├── jsconfig.json
│   ├── config.js
│   ├── config.schema.json
│   └── README.md (What's in this folder)
│
├── 📂 .github/ (GitHub/Version Control)
│   └── (Keep .git as is, move git-related scripts here)
│
├── 📂 docs/ (Already exists - keep structure)
│   ├── api-specs/
│   ├── architecture/
│   ├── guides/
│   ├── HTML-FILES-GUIDE.md
│   ├── package.md
│   └── README.md
│
├── 📂 src/ (Source Code Container)
│   ├── entry/ (Entry point files)
│   │   ├── index.js
│   │   ├── index.html
│   │   ├── index.css
│   │   ├── wb.js
│   │   ├── wb.html
│   │   └── wb.css
│   ├── pages/ (Demo/Assistant pages)
│   │   ├── wb-assistant.html
│   │   ├── wb-assistant-enhanced.html
│   │   ├── wb-rag-assistant.html
│   │   └── api-test-client.html
│   └── listeners/ (Global event listeners)
│       ├── page-reactive-listener.js
│       └── (other listeners)
│
├── 📂 components/ (Already exists - keep as is)
│   ├── wb-button/
│   ├── wb-control-panel/
│   └── (41 components organized)
│
├── 📂 styles/ (Already exists - keep as is)
│   ├── main.css
│   ├── _variables.css
│   └── (other styles)
│
├── 📂 scripts/ (Already exists - reorganize)
│   ├── build/ (Build scripts)
│   │   ├── create-component.js
│   │   ├── build-symbols.js
│   │   ├── build-components-json.js
│   │   ├── gen-main-imports.js
│   │   ├── generate-demos-manifest.js
│   │   └── audit-components.js
│   ├── utils/ (Utility scripts)
│   │   ├── kill-port.js
│   │   ├── control-panel-validator.js
│   │   ├── debug-env.js
│   │   └── start-demo.js
│   ├── fix/ (Fix/Conversion scripts)
│   │   ├── fix-conversion-syntax-errors.js
│   │   ├── fix-import-paths.js
│   │   ├── fix-wb-html-complete.js
│   │   ├── fix-module-loading.ps1
│   │   └── (other fix scripts)
│   ├── powershell/ (PowerShell scripts)
│   │   ├── check-claude-status-v3.ps1
│   │   ├── mark-claude-updated-v3.ps1
│   │   ├── initialize-claude-v3.ps1
│   │   ├── Categorize-Docs.ps1
│   │   ├── move-component-discovery.ps1
│   │   └── (other .ps1 scripts)
│   ├── batch/ (Batch scripts)
│   │   ├── run-all-wb-tests.bat
│   │   ├── fix-wb-html-auto.bat
│   │   └── generate-demos-manifest.bat
│   └── README.md
│
├── 📂 tests/ (Already exists - reorganize)
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   ├── results/ (test results)
│   │   └── test-results.json
│   └── README.md
│
├── 📂 data/ (Data Files Container)
│   ├── custom-elements.json
│   ├── wb-components.html-data.json
│   ├── knowledge-base.json
│   ├── schema/ (Schemas)
│   │   ├── auto-loader.schema.json
│   │   ├── wb.schema.json
│   │   ├── config.schema.json
│   │   └── manifest.schema.json
│   └── README.md
│
├── 📂 html/ (Already exists - keep as is)
│   ├── test-simple-control-panel.html
│   ├── (test/demo files)
│   └── README.md
│
├── 📂 demos/ (Already exists - keep as is)
│   └── (demo files)
│
├── 📂 tools/ (Already exists - reorganize)
│   ├── validators/
│   ├── converters/
│   ├── extractors/
│   └── README.md
│
├── 📂 utils/ (Already exists - reorganize)
│   ├── wb/ (WB utility functions)
│   ├── helpers/
│   └── README.md
│
├── 📂 server/ (Already exists - keep as is)
│   ├── claude-socket-server.ts
│   ├── claude-socket-server.js
│   └── (other server files)
│
├── 📂 templates/ (Already exists - keep as is)
│   └── (template files)
│
├── 📂 layouts/ (Already exists - keep as is)
│   └── (layout definitions)
│
├── 📂 build/ (Already exists - keep as is)
│   └── (build configuration)
│
├── 📂 images/ (Already exists - keep as is)
│   └── (image assets)
│
├── 📂 meta/ (Metadata & Status Container) ⭐ NEW
│   ├── status/ (Status tracking)
│   │   ├── claude.🟡.md (in progress)
│   │   ├── claude.🔴.md (blocked)
│   │   ├── ✅ claude.md (completed)
│   │   └── BUILD-SYSTEM-COMPLETE.md
│   ├── claude-info/ (Claude context)
│   │   ├── claude-command-info.txt
│   │   ├── claude-json-files.json
│   │   ├── claude-json-files-list.txt
│   │   └── README.md
│   └── README.md
│
├── 📂 archive/ (Already exists - keep as is)
│   └── (archived/old files)
│
├── 📂 .vscode/ (Already exists - keep as is)
│   └── (VS Code settings)
│
├── 📂 .claude/ (Already exists - keep as is)
│   └── (Claude-specific config)
│
├── 📂 node_modules/ (Keep as is - ignored)
│
├── 📂 legacy/ (Legacy/Deprecated Container) ⭐ NEW
│   ├── material-design.colorpicker/ (Legacy)
│   ├── componentslayout/ (Legacy)
│   ├── cg/ (Legacy)
│   ├── Working/ (Legacy)
│   ├── Converting files and notes
│   └── README.md (Explains what's deprecated)
│
├── 📂 experimental/ (Experimental Container) ⭐ NEW
│   ├── mcp-docs-server/ (Experimental)
│   ├── wb-chatbot/ (Experimental)
│   ├── ai-features/ (AI experiments)
│   └── README.md (Explains what's experimental)
│
└── 📂 docs/ (Documentation - already good)
    ├── guides/ (How-to guides)
    ├── api/ (API docs)
    ├── architecture/ (Architecture docs)
    ├── setup/ (Setup guides)
    ├── QUICKSTART.md ⭐ NEW (Start here!)
    └── README.md
```

---

## 🗂️ Container Folder Descriptions

### `.config/` - Configuration Container
**Purpose:** All application configuration files in one place

**Contains:**
- Playwright configurations
- JavaScript config
- Schema definitions for config
- README explaining what each config does

**Benefit:** Easy to find and manage all app settings

---

### `src/` - Source Code Container
**Purpose:** Application source code (NOT components, those stay in `components/`)

**Subfolders:**
- `entry/` - Main entry points (index.html, wb.html, etc.)
- `pages/` - Demo and assistant pages
- `listeners/` - Global event listeners

**Benefit:** Clear separation between app code and component library

---

### `scripts/` - Scripts Container
**Purpose:** All automation and utility scripts organized by purpose

**Subfolders:**
- `build/` - Build and generation scripts
- `utils/` - Utility scripts
- `fix/` - Fix and conversion scripts
- `powershell/` - PowerShell scripts
- `batch/` - Batch scripts

**Benefit:** All scripts in one place, organized by function

---

### `data/` - Data Files Container
**Purpose:** All JSON data, schemas, and structured data

**Contains:**
- Component metadata files
- Knowledge base files
- Schema definitions
- Auto-generated data files

**Benefit:** Clear data organization, easy to backup/version

---

### `meta/` - Metadata & Status Container ⭐ NEW
**Purpose:** Track project status, progress, and metadata

**Subfolders:**
- `status/` - Status tracking files (🟢 done, 🟡 in progress, 🔴 blocked)
- `claude-info/` - Claude assistant context files

**Benefit:** Separates tracking files from actual code

---

### `legacy/` - Legacy Container ⭐ NEW
**Purpose:** Keep old/deprecated code organized and out of the way

**Contains:**
- `material-design.colorpicker/` (legacy color picker)
- `componentslayout/` (legacy layout)
- `cg/` (unknown purpose - legacy)
- `Working/` (work in progress folder)

**README explains:**
- Why each folder is legacy
- When it was deprecated
- What replaced it

**Benefit:** Keep codebase clean while preserving history

---

### `experimental/` - Experimental Container ⭐ NEW
**Purpose:** Features still in development

**Contains:**
- `mcp-docs-server/` (Model Context Protocol)
- `wb-chatbot/` (Chatbot feature)
- `ai-features/` (New AI experiments)

**README explains:**
- What each experiment does
- Current status
- When it might be merged to main

**Benefit:** Separate experimental features from stable code

---

## 📋 Migration Checklist

### Phase 1: Plan & Review (No Changes)
- [ ] Review this plan with the team
- [ ] Identify any files that don't fit the structure
- [ ] Update import paths (dry-run)

### Phase 2: Create New Folders (Safe)
- [ ] Create `.config/` folder
- [ ] Create `src/` folder with subfolders
- [ ] Create `data/` folder
- [ ] Create `meta/` folder
- [ ] Create `legacy/` folder
- [ ] Create `experimental/` folder
- [ ] Update existing `scripts/`, `tests/`, `tools/`, `utils/` folders

### Phase 3: Move Files (Careful)
- [ ] Move configuration files to `.config/`
- [ ] Move HTML/CSS/JS entry points to `src/entry/`
- [ ] Move demo pages to `src/pages/`
- [ ] Move listeners to `src/listeners/`
- [ ] Move JSON data to `data/`
- [ ] Move status files to `meta/status/`
- [ ] Move scripts to `scripts/` subfolders
- [ ] Move legacy folders to `legacy/`
- [ ] Move experimental folders to `experimental/`

### Phase 4: Update References
- [ ] Update `package.json` scripts (if paths changed)
- [ ] Update build configuration
- [ ] Update documentation links
- [ ] Update README with new structure
- [ ] Test everything still works

### Phase 5: Document & Cleanup
- [ ] Create README.md in each new container folder
- [ ] Update root README
- [ ] Remove/archive old documentation
- [ ] Test all npm scripts
- [ ] Test all demo files
- [ ] Test all builds

---

## 🚀 Root After Reorganization

```
wb/ (root - MUCH CLEANER!)
├── package.json
├── vite.config.js
├── README.md
├── .env.example
├── .gitignore
│
├── .config/
├── .vscode/
├── .claude/
│
├── .github/ (optional)
├── src/ ⭐ NEW
├── data/ ⭐ NEW
├── meta/ ⭐ NEW
├── legacy/ ⭐ NEW
├── experimental/ ⭐ NEW
│
├── components/ (already good)
├── scripts/ (improved)
├── styles/ (already good)
├── docs/ (already good)
├── html/ (already good)
├── tests/ (improved)
├── build/ (already good)
│
├── utils/
├── tools/
├── templates/
├── layouts/
├── demos/
├── images/
│
├── server/
├── archive/
└── node_modules/
```

**Before:** 51 files cluttering the root
**After:** Only 5 files at root level + organized folders

---

## 📊 Benefits Summary

| Benefit | Impact |
|---------|--------|
| **Clarity** | New contributors understand structure instantly |
| **Maintainability** | Easier to find and update related files |
| **Scalability** | Easy to add new features without chaos |
| **Legacy Management** | Old code doesn't clutter active development |
| **Status Tracking** | Easy to see what's done/in-progress/blocked |
| **Documentation** | Each folder self-documents its purpose |

---

## 🔄 File Movement Examples

### Example 1: Configuration Files
```
BEFORE:
config.js → root
config.schema.json → root
jsconfig.json → root
playwright.config.cjs → root
playwright.config.js → root

AFTER:
.config/config.js
.config/config.schema.json
.config/jsconfig.json
.config/playwright.config.cjs
.config/playwright.config.js
.config/README.md (explains each config)
```

### Example 2: Entry Points
```
BEFORE:
index.html → root
index.js → root
index.css → root
wb.html → root
wb.js → root
wb.css → root

AFTER:
src/entry/index.html
src/entry/index.js
src/entry/index.css
src/entry/wb.html
src/entry/wb.js
src/entry/wb.css
```

### Example 3: Status Tracking
```
BEFORE:
claude.🟢.md → root
claude.🟡.md → root
claude.🔴.md → root
BUILD-SYSTEM-COMPLETE.md → root

AFTER:
meta/status/claude.🟢.md
meta/status/claude.🟡.md
meta/status/claude.🔴.md
meta/status/BUILD-SYSTEM-COMPLETE.md
meta/status/README.md
```

### Example 4: Scripts Organization
```
BEFORE:
quick-test.js → root
kill-port.js → root
fix-conversion-syntax-errors.js → root
Categorize-Docs.ps1 → root
create-component.js → root

AFTER:
scripts/utils/quick-test.js
scripts/utils/kill-port.js
scripts/fix/fix-conversion-syntax-errors.js
scripts/powershell/Categorize-Docs.ps1
scripts/build/create-component.js
```

---

## 📝 Implementation Notes

### What NOT to Move
❌ `.git/` - Leave Git configuration alone
❌ `node_modules/` - Dependencies management
❌ `.gitignore` - Keep at root for Git
❌ `package.json` - Keep at root (npm requirement)
❌ `.env.example` - Keep at root for setup

### What to Update After Moving
✅ Import paths in files
✅ Script paths in `package.json`
✅ Build configuration references
✅ Documentation links
✅ README structure

### Gradual Migration Option
You don't have to do this all at once! You can:
1. Create new container folders
2. Move non-critical files first
3. Test and verify each move
4. Update documentation incrementally

---

## 🎯 Phase 1 Priority

Start with these (lowest risk):
1. Create `meta/` folder - move status files
2. Create `legacy/` folder - move old component directories
3. Create `experimental/` folder - move experimental features
4. Create `.config/` folder - move config files
5. Create `data/` folder - move JSON data files

This alone would reduce root clutter by 30+ files!

---

## 📚 Documentation After Migration

### New README Structure
```
docs/
├── README.md (Start here - navigation hub)
├── QUICKSTART.md ⭐ (New - get started in 5 mins)
├── FOLDER-STRUCTURE.md ⭐ (New - explains new org)
│
├── guides/
├── api/
├── architecture/
└── ...
```

### Root README Will Include
```markdown
# WB Framework

## 🚀 Quick Start
1. [Read QUICKSTART](docs/QUICKSTART.md)
2. [Explore Components](components/index.html)
3. [Understand Architecture](docs/architecture/...)

## 📁 Project Structure
[See FOLDER-STRUCTURE](docs/FOLDER-STRUCTURE.md)

## 🗂️ Directory Organization
- `src/` - Application source code
- `components/` - 41+ reusable components
- `data/` - Configuration and data files
- `meta/` - Status tracking and metadata
- `legacy/` - Deprecated code
- `experimental/` - Features in development
```

---

## ✅ Success Criteria

- [ ] Root directory has ≤ 10 files (down from 51)
- [ ] Each container folder has a README
- [ ] All npm scripts still work
- [ ] All tests still pass
- [ ] All imports resolve correctly
- [ ] Documentation updated
- [ ] Team understands new structure
- [ ] No critical functionality broken

---

**Estimated Time to Complete:** 2-4 hours (depends on scope)  
**Risk Level:** Low (mostly organizational)  
**Rollback Difficulty:** Easy (just move files back)

---

**Last Updated:** October 2025  
**Status:** Plan Complete - Ready for Implementation
