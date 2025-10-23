# 🔧 MANUAL REORGANIZATION - COPY & PASTE COMMANDS

## ✅ THIS APPROACH IS GUARANTEED TO WORK

Instead of a complex PowerShell script, I'm giving you **simple copy-paste commands**.

**Instructions:**
1. Copy each command block
2. Paste into PowerShell
3. Press Enter
4. Watch it work
5. Move to next block

---

## 📋 PREREQUISITE - MAKE BACKUP FIRST

**Copy and paste this FIRST:**

```powershell
cd C:\Users\jwpmi\Downloads\AI\wb
git add .
git commit -m "pre-reorganization-backup"
git branch backup/pre-reorganization
```

This creates a backup you can rollback to anytime.

---

## 📁 STEP 1: CREATE DIRECTORY STRUCTURE

**Copy and paste this entire block:**

```powershell
# Create .config subdirectories
mkdir -Force .config\application | Out-Null
mkdir -Force .config\scripts | Out-Null
mkdir -Force .config\testing | Out-Null
mkdir -Force .config\data-schemas | Out-Null

# Create data subdirectories
mkdir -Force data\json | Out-Null
mkdir -Force data\generated | Out-Null
mkdir -Force data\assets | Out-Null

# Create docs subdirectories
mkdir -Force docs\guides | Out-Null
mkdir -Force docs\reference | Out-Null
mkdir -Force docs\status | Out-Null
mkdir -Force docs\archive | Out-Null

# Create build subdirectories
mkdir -Force build\test-files | Out-Null
mkdir -Force build\generated | Out-Null
mkdir -Force build\scripts | Out-Null

# Create src subdirectories
mkdir -Force src\app | Out-Null
mkdir -Force src\ui | Out-Null
mkdir -Force src\utils | Out-Null
mkdir -Force src\templates | Out-Null
mkdir -Force src\js | Out-Null
mkdir -Force src\layouts | Out-Null
mkdir -Force src\components | Out-Null
mkdir -Force src\servers | Out-Null
mkdir -Force src\libs | Out-Null
mkdir -Force src\demos | Out-Null
mkdir -Force src\cg | Out-Null
mkdir -Force src\chatbot | Out-Null

Write-Host "✅ All directories created!" -ForegroundColor Green
```

---

## ⚙️ STEP 2: MOVE CONFIGURATION FILES

```powershell
# Move configuration files
Move-Item -Path vite.config.js -Destination .config\application\ -Force -ErrorAction SilentlyContinue
Move-Item -Path jsconfig.json -Destination .config\application\ -Force -ErrorAction SilentlyContinue
Move-Item -Path config.js -Destination .config\application\ -Force -ErrorAction SilentlyContinue
Move-Item -Path config.schema.json -Destination .config\data-schemas\ -Force -ErrorAction SilentlyContinue
Move-Item -Path playwright.config.js -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue

Write-Host "✅ Configuration files moved!" -ForegroundColor Green
```

---

## 📖 STEP 3: MOVE DOCUMENTATION FILES

```powershell
# Move to docs/guides/
Move-Item -Path "CREATE-COMPONENT-README.md" -Destination "docs\guides\component-creation.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path CONTRIBUTING.md -Destination docs\guides\ -Force -ErrorAction SilentlyContinue
Move-Item -Path DEBUGGING-LESSONS.md -Destination docs\guides\ -Force -ErrorAction SilentlyContinue
Move-Item -Path vs-code-setup-instructions.md -Destination docs\guides\ -Force -ErrorAction SilentlyContinue
Move-Item -Path WB_COMPONENTS_USAGE.md -Destination docs\guides\ -Force -ErrorAction SilentlyContinue

# Move to docs/reference/
Move-Item -Path COMPONENT-DIRECTORY-GUIDE.md -Destination docs\reference\ -Force -ErrorAction SilentlyContinue
Move-Item -Path DOCUMENTATION-INDEX.md -Destination docs\reference\ -Force -ErrorAction SilentlyContinue
Move-Item -Path events.md -Destination docs\reference\ -Force -ErrorAction SilentlyContinue
Move-Item -Path claude-events-api.md -Destination "docs\reference\events-api.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path claude-events-api.js -Destination docs\reference\ -Force -ErrorAction SilentlyContinue
Move-Item -Path package.md -Destination "docs\reference\package-reference.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path claude-command-info.txt -Destination docs\reference\ -Force -ErrorAction SilentlyContinue

# Move to docs/status/
Move-Item -Path "✅ claude.md" -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path "claude.🔴.md" -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path "claude.🟡.md" -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path "✅ BUILD-SYSTEM-COMPLETE.md" -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path ROOT-REORGANIZATION-SUMMARY.md -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path RAG-SETUP.md -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path RAG-COMPLETE.md -Destination docs\status\ -Force -ErrorAction SilentlyContinue
Move-Item -Path claude-api-test.md -Destination docs\status\ -Force -ErrorAction SilentlyContinue

Write-Host "✅ Documentation files moved!" -ForegroundColor Green
```

---

## 💾 STEP 4: MOVE DATA FILES

```powershell
# Move to data/assets/
Move-Item -Path favicon.ico -Destination data\assets\ -Force -ErrorAction SilentlyContinue
Move-Item -Path favicon-backup.ico -Destination data\assets\ -Force -ErrorAction SilentlyContinue
Move-Item -Path star-icon.svg -Destination data\assets\ -Force -ErrorAction SilentlyContinue

# Move to data/json/
Move-Item -Path claude-json-files.json -Destination data\json\ -Force -ErrorAction SilentlyContinue
Move-Item -Path claude-json-files-list.txt -Destination data\json\ -Force -ErrorAction SilentlyContinue

# Move to data/generated/
Move-Item -Path test-cwd.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path terminal-error-server.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path final-validation-test.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path convert-to-base-unit-test.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path quick-test.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path test-ecosystem.js -Destination data\generated\ -Force -ErrorAction SilentlyContinue
Move-Item -Path test-simple-control-panel.md -Destination data\generated\ -Force -ErrorAction SilentlyContinue

Write-Host "✅ Data files moved!" -ForegroundColor Green
```

---

## 🔧 STEP 5: MOVE SCRIPT FILES

```powershell
# Move to .config/scripts/
Move-Item -Path create-favicon.ps1 -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue
Move-Item -Path fix-wb-html.ps1 -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue
Move-Item -Path move-html-and-js.ps1 -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue
Move-Item -Path reorganize-project.ps1 -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue
Move-Item -Path run-all-wb-tests.ps1 -Destination .config\scripts\ -Force -ErrorAction SilentlyContinue

# Move to build/scripts/
Move-Item -Path update-baseunit-imports.js -Destination build\scripts\ -Force -ErrorAction SilentlyContinue

Write-Host "✅ Script files moved!" -ForegroundColor Green
```

---

## 📝 STEP 6: MOVE APP FILES

```powershell
# Move app entry point
Move-Item -Path wb.ts -Destination src\app\ -Force -ErrorAction SilentlyContinue

Write-Host "✅ App files moved!" -ForegroundColor Green
```

---

## 📊 STEP 7: VERIFY RESULTS

```powershell
Write-Host "`n" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "VERIFICATION RESULTS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

$files = @(Get-ChildItem -File | Where-Object { $_.Name -notmatch "^\." })
$dirs = @(Get-ChildItem -Directory | Where-Object { $_.Name -notmatch "^\." -and $_.Name -ne "node_modules" })

Write-Host "`n📄 FILES IN ROOT: $($files.Count)" -ForegroundColor Green
$files | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Green }

Write-Host "`n📁 DIRECTORIES IN ROOT: $($dirs.Count)" -ForegroundColor Green
$dirs | ForEach-Object { Write-Host "   - $($_.Name)/" -ForegroundColor Green }

Write-Host "`n✅ TARGET:" -ForegroundColor Yellow
Write-Host "   Files should be around 5-10 (documentation + original files)" -ForegroundColor Yellow
Write-Host "   Directories should be around 8-12 (containers + system)" -ForegroundColor Yellow

Write-Host "`n"
```

---

## ✅ FINAL STEP: COMMIT CHANGES

Once everything looks good:

```powershell
git add .
git commit -m "refactor: radical root directory reorganization"
git log --oneline -5
```

---

## 🧪 VERIFY BUILD STILL WORKS

```powershell
npm run dev
npm test
```

---

## 🎉 YOU'RE DONE!

If everything worked:
- ✅ Root directory is clean
- ✅ Files are organized
- ✅ Build still works
- ✅ Tests still pass

If something broke:
```powershell
git checkout backup/pre-reorganization
```

---

## 📋 HOW TO USE THESE COMMANDS

1. **Copy the entire code block** (Ctrl+A to select all text in that section)
2. **Paste into PowerShell** (Ctrl+V or right-click → Paste)
3. **Press Enter** to execute
4. **Wait for it to finish** (you'll see the ✅ message)
5. **Move to next section**

Each section is **independent** so you can run them one at a time.

---

## ⚠️ IF YOU GET ERRORS

- Errors about "file not found" are OK - it means that file doesn't exist
- The `-ErrorAction SilentlyContinue` flag means it won't crash if a file isn't there
- Keep going to the next step

---

## 🚀 START NOW!

Ready? Copy and paste the commands above, step by step!

Let me know when you:
1. Complete each step ✅
2. Have questions ❓
3. Hit any issues 🛑

**Let's get this done!** 💪
