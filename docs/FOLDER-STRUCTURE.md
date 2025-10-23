# WB Framework - New Folder Structure Reference

## 📊 Before vs After

### BEFORE: Root Chaos 😵
```
51 FILES IN ROOT
├── config files (scattered)
├── HTML demos (scattered)
├── CSS files (scattered)
├── JavaScript files (scattered)
├── Scripts (scattered)
├── Status files (scattered)
├── Schema files (scattered)
└── ... way too many things!
```

### AFTER: Organized Structure 🎉
```
5 FILES IN ROOT + Organized Folders
├── Configs in .config/
├── Source in src/
├── Data in data/
├── Status in meta/
├── Scripts organized in scripts/
└── Everything has a place!
```

---

## 🗂️ Complete New Structure Tree

```
wb/
│
├─ 📄 package.json              ⭐ KEEP AT ROOT
├─ 📄 vite.config.js             ⭐ KEEP AT ROOT
├─ 📄 README.md                  ⭐ KEEP AT ROOT
├─ 📄 .env.example               ⭐ KEEP AT ROOT
├─ 📄 .gitignore                 ⭐ KEEP AT ROOT
│
│
├─📂 .config/                    🆕 NEW CONTAINER
│  ├─ playwright.config.cjs
│  ├─ playwright.config.js
│  ├─ playwright.real.config.cjs
│  ├─ jsconfig.json
│  ├─ config.js
│  ├─ config.schema.json
│  └─ README.md (explains each config)
│
├─📂 src/                        🆕 NEW CONTAINER (App Source Code)
│  ├─ entry/                    (Entry points)
│  │  ├─ index.html
│  │  ├─ index.js
│  │  ├─ index.css
│  │  ├─ wb.html
│  │  ├─ wb.js
│  │  └─ wb.css
│  │
│  ├─ pages/                    (Demo/Assistant Pages)
│  │  ├─ wb-assistant.html
│  │  ├─ wb-assistant-enhanced.html
│  │  ├─ wb-rag-assistant.html
│  │  └─ api-test-client.html
│  │
│  └─ listeners/                (Global Event Listeners)
│     └─ page-reactive-listener.js
│
│
├─📂 components/                ✅ KEEP (Already Perfect!)
│  ├─ wb-button/
│  ├─ wb-control-panel/
│  ├─ wb-color-harmony/
│  ├─ ... (41 components)
│  ├─ index.html               (Component Directory)
│  └─ manifest.json
│
│
├─📂 styles/                    ✅ KEEP (Already Good)
│  ├─ main.css
│  ├─ _variables.css
│  ├─ _utilities.css
│  ├─ wb-theme-listener.js
│  └─ (color system files)
│
│
├─📂 scripts/                   ✅ IMPROVE (Already Exists)
│  ├─ build/                   (Build & Generation Scripts)
│  │  ├─ create-component.js
│  │  ├─ build-symbols.js
│  │  ├─ build-components-json.js
│  │  ├─ gen-main-imports.js
│  │  ├─ generate-demos-manifest.js
│  │  ├─ audit-components.js
│  │  └─ build-knowledge-base.js
│  │
│  ├─ utils/                   (Utility Scripts)
│  │  ├─ kill-port.js
│  │  ├─ control-panel-validator.js
│  │  ├─ debug-env.js
│  │  ├─ start-demo.js
│  │  └─ test-ecosystem.js
│  │
│  ├─ fix/                     (Fix/Conversion Scripts)
│  │  ├─ fix-conversion-syntax-errors.js
│  │  ├─ fix-import-paths.js
│  │  ├─ fix-wb-html-complete.js
│  │  ├─ fix-module-loading.ps1
│  │  └─ update-baseunit-imports.js
│  │
│  ├─ powershell/              (PowerShell Scripts)
│  │  ├─ check-claude-status-v3.ps1
│  │  ├─ mark-claude-updated-v3.ps1
│  │  ├─ initialize-claude-v3.ps1
│  │  ├─ Categorize-Docs.ps1
│  │  ├─ move-component-discovery.ps1
│  │  └─ reorganize-project.ps1
│  │
│  ├─ batch/                   (Batch Scripts - Windows)
│  │  ├─ run-all-wb-tests.bat
│  │  ├─ fix-wb-html-auto.bat
│  │  └─ generate-demos-manifest.bat
│  │
│  └─ README.md (guide to available scripts)
│
│
├─📂 tests/                     ✅ IMPROVE (Already Exists)
│  ├─ unit/                    (Unit tests)
│  ├─ integration/             (Integration tests)
│  ├─ fixtures/                (Test data)
│  ├─ results/                 (Test results)
│  │  └─ test-results.json
│  └─ README.md
│
│
├─📂 data/                      🆕 NEW CONTAINER (Data Files)
│  ├─ custom-elements.json
│  ├─ wb-components.html-data.json
│  ├─ knowledge-base.json
│  ├─ claude-json-files.json
│  │
│  ├─ schema/                  (Schema Definitions)
│  │  ├─ auto-loader.schema.json
│  │  ├─ wb.schema.json
│  │  ├─ config.schema.json
│  │  └─ manifest.schema.json
│  │
│  └─ README.md
│
│
├─📂 meta/                      🆕 NEW CONTAINER (Metadata & Status)
│  ├─ status/                  (Status Tracking)
│  │  ├─ claude.🟢.md         (✅ Completed)
│  │  ├─ claude.🟡.md         (🟡 In Progress)
│  │  ├─ claude.🔴.md         (🔴 Blocked/Issues)
│  │  ├─ BUILD-SYSTEM-COMPLETE.md
│  │  └─ README.md
│  │
│  ├─ claude-info/             (Claude Context)
│  │  ├─ claude-command-info.txt
│  │  ├─ claude-json-files.json
│  │  ├─ claude-json-files-list.txt
│  │  └─ README.md
│  │
│  └─ README.md
│
│
├─📂 docs/                      ✅ KEEP (Already Good)
│  ├─ guides/
│  │  ├─ setup/
│  │  ├─ contributing/
│  │  └─ howto/
│  │
│  ├─ api/
│  │  └─ api-specs/
│  │
│  ├─ architecture/
│  │  ├─ WB Framework - Event-Driven Color System Architecture.md
│  │  └─ (other architecture docs)
│  │
│  ├─ HTML-FILES-GUIDE.md
│  ├─ package.md
│  ├─ ROOT-REORGANIZATION-PLAN.md
│  ├─ QUICKSTART.md            🆕 NEW
│  ├─ FOLDER-STRUCTURE.md      🆕 NEW
│  │
│  ├─ status/
│  ├─ reference/
│  ├─ troubleshooting/
│  ├─ _archived/
│  └─ README.md
│
│
├─📂 html/                      ✅ KEEP (Test Files)
│  ├─ test-simple-control-panel.html
│  ├─ test-component-ecosystem.html
│  ├─ component-diagnosis.html
│  ├─ debug-control-panel.html
│  │
│  ├─ Color Harmony System/
│  ├─ (other test files)
│  │
│  └─ README.md (index of test files)
│
│
├─📂 build/                     ✅ KEEP (Build Config)
│  └─ (Vite build configuration files)
│
├─📂 templates/                 ✅ KEEP
├─📂 layouts/                   ✅ KEEP
├─📂 utils/                     ✅ KEEP (Utility Functions)
├─📂 tools/                     ✅ KEEP (Tool Utilities)
├─📂 demos/                     ✅ KEEP (Demo Files)
├─📂 images/                    ✅ KEEP (Image Assets)
├─📂 server/                    ✅ KEEP (Backend Server)
│
│
├─📂 legacy/                    🆕 NEW CONTAINER (Deprecated Code)
│  ├─ material-design.colorpicker/    (Legacy color picker)
│  ├─ componentslayout/               (Legacy layout system)
│  ├─ cg/                             (Legacy - purpose unclear)
│  ├─ Working/                        (Work in progress folder)
│  │
│  └─ README.md
│     - Why each item is legacy
│     - When deprecated
│     - What replaced it
│
│
├─📂 experimental/              🆕 NEW CONTAINER (Development Features)
│  ├─ mcp-docs-server/                (Model Context Protocol - in development)
│  ├─ wb-chatbot/                     (Chatbot feature - in development)
│  ├─ ai-features/                    (AI experiments - in development)
│  │
│  └─ README.md
│     - What each experiment is
│     - Current status
│     - When might ship
│
│
├─📂 archive/                   ✅ KEEP (Old Code Archive)
├─📂 .vscode/                   ✅ KEEP (VS Code Settings)
├─📂 .claude/                   ✅ KEEP (Claude Config)
├─📂 .git/                      ✅ KEEP (Git History)
│
└─📂 node_modules/              ⚠️  IGNORE (Dependencies)
```

---

## 📝 File Movement Map

### Configuration Files → `.config/`
```
playwright.config.cjs          → .config/playwright.config.cjs
playwright.config.js           → .config/playwright.config.js
playwright.real.config.cjs     → .config/playwright.real.config.cjs
jsconfig.json                  → .config/jsconfig.json
config.js                      → .config/config.js
config.schema.json             → .config/config.schema.json
```

### Entry Point Files → `src/entry/`
```
index.html                     → src/entry/index.html
index.js                       → src/entry/index.js
index.css                      → src/entry/index.css
wb.html                        → src/entry/wb.html
wb.js                          → src/entry/wb.js
wb.css                         → src/entry/wb.css
```

### Demo/Page Files → `src/pages/`
```
wb-assistant.html              → src/pages/wb-assistant.html
wb-assistant-enhanced.html     → src/pages/wb-assistant-enhanced.html
wb-rag-assistant.html          → src/pages/wb-rag-assistant.html
api-test-client.html           → src/pages/api-test-client.html
```

### Data Files → `data/`
```
custom-elements.json           → data/custom-elements.json
wb-components.html-data.json   → data/wb-components.html-data.json
knowledge-base.json            → data/knowledge-base.json
claude-json-files.json         → data/claude-json-files.json
auto-loader.schema.json        → data/schema/auto-loader.schema.json
wb.schema.json                 → data/schema/wb.schema.json
config.schema.json             → data/schema/config.schema.json
manifest.schema.json           → data/schema/manifest.schema.json
```

### Status/Metadata → `meta/`
```
claude.🟢.md                   → meta/status/claude.🟢.md
claude.🟡.md                   → meta/status/claude.🟡.md
claude.🔴.md                   → meta/status/claude.🔴.md
BUILD-SYSTEM-COMPLETE.md       → meta/status/BUILD-SYSTEM-COMPLETE.md
claude-command-info.txt        → meta/claude-info/claude-command-info.txt
claude-json-files-list.txt     → meta/claude-info/claude-json-files-list.txt
```

### Build Scripts → `scripts/build/`
```
create-component.js            → scripts/build/create-component.js
build-symbols.js               → scripts/build/build-symbols.js
build-components-json.js       → scripts/build/build-components-json.js
gen-main-imports.js            → scripts/build/gen-main-imports.js
generate-demos-manifest.js     → scripts/build/generate-demos-manifest.js
audit-components.js            → scripts/build/audit-components.js
build-knowledge-base.js        → scripts/build/build-knowledge-base.js
```

### Utility Scripts → `scripts/utils/`
```
quick-test.js                  → scripts/utils/quick-test.js
kill-port.js                   → scripts/utils/kill-port.js
control-panel-validator.js     → scripts/utils/control-panel-validator.js
debug-env.js                   → scripts/utils/debug-env.js
start-demo.js                  → scripts/utils/start-demo.js
test-ecosystem.js              → scripts/utils/test-ecosystem.js
final-validation-test.js       → scripts/utils/final-validation-test.js
```

### Fix Scripts → `scripts/fix/`
```
fix-conversion-syntax-errors.js → scripts/fix/fix-conversion-syntax-errors.js
fix-import-paths.js            → scripts/fix/fix-import-paths.js
fix-wb-html-complete.js        → scripts/fix/fix-wb-html-complete.js
fix-module-loading.ps1         → scripts/fix/fix-module-loading.ps1
update-baseunit-imports.js     → scripts/fix/update-baseunit-imports.js
```

### PowerShell Scripts → `scripts/powershell/`
```
check-claude-status-v3.ps1     → scripts/powershell/check-claude-status-v3.ps1
mark-claude-updated-v3.ps1     → scripts/powershell/mark-claude-updated-v3.ps1
initialize-claude-v3.ps1       → scripts/powershell/initialize-claude-v3.ps1
Categorize-Docs.ps1            → scripts/powershell/Categorize-Docs.ps1
move-component-discovery.ps1   → scripts/powershell/move-component-discovery.ps1
move-html-and-js.ps1           → scripts/powershell/move-html-and-js.ps1
reorganize-project.ps1         → scripts/powershell/reorganize-project.ps1
```

### Batch Scripts → `scripts/batch/`
```
run-all-wb-tests.bat           → scripts/batch/run-all-wb-tests.bat
run-all-wb-tests.ps1           → scripts/batch/run-all-wb-tests.ps1
fix-wb-html-auto.bat           → scripts/batch/fix-wb-html-auto.bat
generate-demos-manifest.bat    → scripts/batch/generate-demos-manifest.bat
```

### Legacy Folders → `legacy/`
```
material-design.colorpicker/   → legacy/material-design.colorpicker/
componentslayout/              → legacy/componentslayout/
cg/                            → legacy/cg/
Working/                       → legacy/Working/
```

### Experimental Folders → `experimental/`
```
mcp-docs-server/               → experimental/mcp-docs-server/
wb-chatbot/                    → experimental/wb-chatbot/
```

---

## 🎯 Quick Navigation Guide

**Need to...**
| Task | Go To |
|------|-------|
| Start fresh? | `docs/QUICKSTART.md` |
| Understand structure? | `docs/FOLDER-STRUCTURE.md` (this file) |
| Find a component? | `components/index.html` |
| Configure app? | `.config/` |
| Run a script? | `scripts/` |
| See project status? | `meta/status/` |
| Check data files? | `data/` |
| Access old code? | `legacy/` |
| Try new features? | `experimental/` |
| Read documentation? | `docs/` |

---

## ✨ Benefits of This Structure

| Benefit | Impact |
|---------|--------|
| **Only 5 files in root** | Down from 51! Much cleaner |
| **Clear folder purposes** | Each folder has ONE job |
| **Easy onboarding** | New developers understand instantly |
| **Better organization** | Related files grouped together |
| **Scalability** | Can add thousands of files without chaos |
| **Status transparency** | Easy to see what's done/blocked/experimental |
| **Separation of concerns** | Config, code, data, and status separated |

---

## 📍 File Counts After Reorganization

| Container | File Count Before | File Count After | Reduction |
|-----------|-------------------|-----------------|-----------|
| Root | 51 | 5 | -90% ✅ |
| `.config/` | N/A | 6 | NEW |
| `src/` | N/A | 10 | NEW |
| `scripts/` | 0 (scattered) | 20+ | Organized |
| `data/` | N/A | 8+ | NEW |
| `meta/` | N/A | 5+ | NEW |
| **TOTAL IMPACT** | 51 files chaos | Organized structure | **Much Better** |

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** Implementation-Ready
