# Root Reorganization - Quick Start Implementation

## 🎯 Start Here

This guide will help you reorganize the root directory safely, step-by-step.

---

## ⚠️ Before You Start

1. **Commit your code to Git**
   ```bash
   git add .
   git commit -m "Pre-reorganization backup"
   ```

2. **Create a backup branch**
   ```bash
   git branch backup/pre-reorganization
   ```

3. **Read the full plan** - `docs/ROOT-REORGANIZATION-PLAN.md`

---

## 🔄 Migration Phases

### Phase 1: Create New Folders (5 minutes)

**Risk Level:** ✅ ZERO - Just creating empty folders

```bash
# Open command line in root directory

# Create container folders
mkdir .config
mkdir src
mkdir src/entry
mkdir src/pages
mkdir src/listeners
mkdir data
mkdir data/schema
mkdir meta
mkdir meta/status
mkdir meta/claude-info
mkdir legacy
mkdir experimental
mkdir scripts/build
mkdir scripts/utils
mkdir scripts/fix
mkdir scripts/powershell
mkdir scripts/batch
mkdir tests/results
mkdir tests/unit
mkdir tests/integration
mkdir tests/fixtures
```

---

### Phase 2a: Move Non-Critical Files (10 minutes)

**Risk Level:** ✅ LOW - Files that aren't imported by anything

#### Move Configuration Files to `.config/`

```bash
# Copy files (don't delete original yet - we'll test first)
cp playwright.config.cjs .config/
cp playwright.config.js .config/
cp playwright.real.config.cjs .config/
cp jsconfig.json .config/
cp config.js .config/
cp config.schema.json .config/

# Create README in .config/
# (See template below)
```

**After verification, delete originals:**
```bash
rm playwright.config.cjs
rm playwright.config.js
rm playwright.real.config.cjs
rm jsconfig.json
rm config.js
rm config.schema.json
```

---

### Phase 2b: Move Data Files to `data/`

```bash
# Copy JSON data files
cp custom-elements.json data/
cp wb-components.html-data.json data/
cp knowledge-base.json data/
cp claude-json-files.json data/

# Copy schema files
cp auto-loader.schema.json data/schema/
cp wb.schema.json data/schema/
cp config.schema.json data/schema/
cp manifest.schema.json data/schema/

# After verification, delete originals
rm custom-elements.json
rm wb-components.html-data.json
rm knowledge-base.json
rm claude-json-files.json
rm auto-loader.schema.json
rm wb.schema.json
# (Keep config.schema.json at root for now - might be needed)
rm manifest.schema.json
```

---

### Phase 2c: Move Status Files to `meta/status/`

```bash
# Copy status tracking files
cp "claude.🟢.md" meta/status/
cp "claude.🟡.md" meta/status/
cp "claude.🔴.md" meta/status/
cp "BUILD-SYSTEM-COMPLETE.md" meta/status/

# Copy Claude info files
cp claude-command-info.txt meta/claude-info/
cp claude-json-files-list.txt meta/claude-info/

# After verification, delete originals
rm "claude.🟢.md"
rm "claude.🟡.md"
rm "claude.🔴.md"
rm "BUILD-SYSTEM-COMPLETE.md"
rm claude-command-info.txt
rm claude-json-files-list.txt
```

---

### Phase 2d: Move Legacy/Experimental Folders

```bash
# Move legacy folders
move material-design.colorpicker legacy/
move componentslayout legacy/
move cg legacy/
move Working legacy/

# Move experimental folders
move mcp-docs-server experimental/
move wb-chatbot experimental/
```

---

### Phase 3a: Move Entry Point Files to `src/entry/`

**Risk Level:** ⚠️ MEDIUM - Need to update imports

```bash
# Copy entry files
cp index.html src/entry/
cp index.js src/entry/
cp index.css src/entry/
cp wb.html src/entry/
cp wb.js src/entry/
cp wb.css src/entry/
```

**Then update imports in these files:**
- Search for `./styles/` → change to `../styles/` (one level up)
- Search for `./components/` → change to `../components/` (one level up)

**After updating imports, test:**
```bash
npm run dev:s
# Open http://localhost:8080/src/entry/index.html
# Verify it works!
```

**If working, delete originals:**
```bash
rm index.html
rm index.js
rm index.css
rm wb.html
rm wb.js
rm wb.css
```

---

### Phase 3b: Move Demo/Page Files to `src/pages/`

```bash
# Copy demo files
cp wb-assistant.html src/pages/
cp wb-assistant-enhanced.html src/pages/
cp wb-rag-assistant.html src/pages/
cp api-test-client.html src/pages/

# Update imports (same as Phase 3a)
# Test them
# Then delete originals
```

---

### Phase 3c: Move Listener Files to `src/listeners/`

```bash
# Copy listener files
cp page-reactive-listener.js src/listeners/

# Update imports if needed
# Test
# Delete original
```

---

### Phase 4: Move Scripts (Most Complex)

**Risk Level:** ⚠️⚠️ HIGH - These are called by `package.json`

#### Step 1: Update `package.json` scripts

Open `package.json` and update all script paths:

```json
{
  "scripts": {
    "new": "node scripts/build/create-component.js",
    "component:new": "node scripts/build/create-component.js",
    "create": "node scripts/build/create-component.js",
    
    "demo": "node scripts/utils/start-demo.js",
    "demo:here": "node scripts/utils/start-demo.js",
    "demo:debug": "node scripts/utils/debug-env.js",
    
    "check-server": "node scripts/utils/kill-port.js",
    "kill-port": "node scripts/utils/kill-port.js",
    
    "dev:simple": "npm run kill-port && http-server -p 8080 -o /src/entry/wb.html",
    
    "remove-puppeteer": "node scripts/fix/remove-puppeteer.js",
    
    "build:html-data": "node scripts/build/build-components-json.js",
    "build:imports": "node scripts/build/gen-main-imports.js",
    
    "build:kb": "node scripts/build/build-knowledge-base.js",
    
    "build:demos": "node scripts/build/generate-demos-manifest.js",
    
    "build:audit": "node scripts/build/audit-components.js",
    
    // ... update all other script paths
  }
}
```

#### Step 2: Move build scripts

```bash
move create-component.js scripts/build/
move build-symbols.js scripts/build/
move build-components-json.js scripts/build/
move gen-main-imports.js scripts/build/
move generate-demos-manifest.js scripts/build/
move audit-components.js scripts/build/
move build-knowledge-base.js scripts/build/
```

#### Step 3: Move utility scripts

```bash
move kill-port.js scripts/utils/
move start-demo.js scripts/utils/
move debug-env.js scripts/utils/
move control-panel-validator.js scripts/utils/
move quick-test.js scripts/utils/
move final-validation-test.js scripts/utils/
move test-ecosystem.js scripts/utils/
move test-cwd.js scripts/utils/
```

#### Step 4: Move fix scripts

```bash
move fix-conversion-syntax-errors.js scripts/fix/
move fix-import-paths.js scripts/fix/
move fix-wb-html-complete.js scripts/fix/
move update-baseunit-imports.js scripts/fix/
move fix-module-loading.ps1 scripts/fix/
move remove-puppeteer.js scripts/fix/
```

#### Step 5: Move PowerShell scripts

```bash
move "Categorize-Docs.ps1" scripts/powershell/
move "check-claude-status-v3.ps1" scripts/powershell/
move "mark-claude-updated-v3.ps1" scripts/powershell/
move "initialize-claude-v3.ps1" scripts/powershell/
move "move-component-discovery.ps1" scripts/powershell/
move "move-html-and-js.ps1" scripts/powershell/
move "reorganize-project.ps1" scripts/powershell/
```

#### Step 6: Move batch scripts

```bash
move "run-all-wb-tests.bat" scripts/batch/
move "run-all-wb-tests.ps1" scripts/batch/
move "fix-wb-html-auto.bat" scripts/batch/
move "generate-demos-manifest.bat" scripts/batch/
```

#### Step 7: Test all scripts

```bash
npm run new              # Test build script
npm run kill-port       # Test util script
npm run dev:s           # Test everything together
```

---

### Phase 5: Update Documentation

#### Create `.config/README.md`
```markdown
# Configuration Files

## Files in this directory

- **playwright.config.cjs/js** - Playwright test configuration (CommonJS and ES modules)
- **jsconfig.json** - JavaScript configuration for IDE support
- **config.js** - Application configuration
- **config.schema.json** - Schema for config validation

## How to update

Edit the relevant config file and restart your dev server.
```

#### Create `data/README.md`
```markdown
# Data Files

JSON data files and schemas used by the application.

## Subdirectories

- **schema/** - JSON schema definitions for validation

## Files

- **custom-elements.json** - Web components manifest
- **wb-components.html-data.json** - Component metadata
- **knowledge-base.json** - RAG knowledge base
```

#### Create `meta/README.md`
```markdown
# Metadata & Status Tracking

## Subdirectories

- **status/** - Project status tracking (✅ done, 🟡 in progress, 🔴 blocked)
- **claude-info/** - Claude assistant context

## Status Files

- `claude.🟢.md` - Completed work
- `claude.🟡.md` - In-progress work
- `claude.🔴.md` - Blocked/issues
```

#### Create `scripts/README.md`
```markdown
# Scripts Directory

All build, utility, and automation scripts organized by purpose.

## Subdirectories

- **build/** - Component generation and build scripts
- **utils/** - Utility and testing scripts
- **fix/** - Fix and conversion scripts
- **powershell/** - PowerShell automation scripts
- **batch/** - Windows batch scripts

## Running scripts

All scripts are executed via npm from package.json:

npm run <script-name>

See package.json for available commands.
```

---

## ✅ Verification Checklist

After each phase, verify:

- [ ] `npm run dev:s` works
- [ ] `npm run new` creates new components
- [ ] `npm run test` passes
- [ ] All demo files load
- [ ] All HTML files have correct imports
- [ ] No broken links in documentation
- [ ] All scripts execute without errors

---

## 🚨 If Something Breaks

### Option 1: Roll Back Individual File
```bash
git checkout filename
```

### Option 2: Restore from Backup Branch
```bash
git checkout backup/pre-reorganization
git checkout -b reorganization-retry
```

### Option 3: Start Over
```bash
git reset --hard backup/pre-reorganization
```

---

## 📝 Time Estimate

| Phase | Time | Risk |
|-------|------|------|
| Phase 1: Create folders | 5 min | ✅ None |
| Phase 2: Move non-critical | 15 min | ✅ Low |
| Phase 3: Move entry/pages | 20 min | ⚠️ Medium |
| Phase 4: Move scripts | 30 min | ⚠️⚠️ High |
| Phase 5: Documentation | 10 min | ✅ None |
| **TOTAL** | **~80 min** | **Medium** |

---

## 🎯 Success = These Should Work

After reorganization:

```bash
# Entry points work
npm run dev:s

# Create new component
npm run new

# Run tests
npm run test

# Build system
npm run build

# View component directory
# Open: http://localhost:8080/components/index.html

# View documentation
# Open: docs/ folder
```

---

## 📞 Getting Help

If you get stuck:

1. Check `docs/ROOT-REORGANIZATION-PLAN.md` for details
2. Check `docs/FOLDER-STRUCTURE.md` for file locations
3. Review the error message carefully
4. Use Git to see what changed: `git status`
5. Roll back the specific file if needed

---

**Last Updated:** October 2025  
**Difficulty:** Medium  
**Estimated Time:** 80 minutes  
**Reversibility:** Easy (Git backup available)
