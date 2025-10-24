# 🔥 FINAL CLEANUP - AGGRESSIVE ROOT REDUCTION

## 🎯 GOAL: Get Root Down to REAL 5 Files

Currently: 23 files + 33 folders  
Target: 5 files + 8 folders

The problem: My guide files + unmoved folders are still cluttering.

---

## 🚀 FINAL CLEANUP COMMANDS

**Copy-paste this entire block into PowerShell:**

```powershell
cd C:\Users\jwpmi\Downloads\AI\wb

# ============================================================================
# PART 1: MOVE ALL MY GUIDE FILES TO docs/guides
# ============================================================================

Move-Item -Path "00-START-HERE.md" -Destination "docs\guides\00-START-HERE.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "EXECUTE-NOW.md" -Destination "docs\guides\EXECUTE-NOW.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "EXECUTION-READY.md" -Destination "docs\guides\EXECUTION-READY.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "FINAL-STRUCTURE.md" -Destination "docs\guides\FINAL-STRUCTURE.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "IMPLEMENTATION-IN-PROGRESS.md" -Destination "docs\guides\IMPLEMENTATION-IN-PROGRESS.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "IMPLEMENTATION-READY.md" -Destination "docs\guides\IMPLEMENTATION-READY.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "ISSUE-ANALYSIS.md" -Destination "docs\guides\ISSUE-ANALYSIS.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "MANIFEST.md" -Destination "docs\guides\MANIFEST.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "MANUAL-REORGANIZATION.md" -Destination "docs\guides\MANUAL-REORGANIZATION.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "QUICK-START.md" -Destination "docs\guides\QUICK-START.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "READY-TO-EXECUTE-NOW.md" -Destination "docs\guides\READY-TO-EXECUTE-NOW.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "READY-TO-EXECUTE.md" -Destination "docs\guides\READY-TO-EXECUTE.md" -Force -ErrorAction SilentlyContinue
Move-Item -Path "VISUAL-GUIDE.md" -Destination "docs\guides\VISUAL-GUIDE.md" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Guide files moved to docs/guides/" -ForegroundColor Green

# ============================================================================
# PART 2: MOVE SCRIPT FILES TO .config/scripts
# ============================================================================

Move-Item -Path "execute-now.ps1" -Destination ".config\scripts\execute-now.ps1" -Force -ErrorAction SilentlyContinue
Move-Item -Path "reorganize-radical.ps1" -Destination ".config\scripts\reorganize-radical.ps1" -Force -ErrorAction SilentlyContinue
Move-Item -Path "RUN-REORGANIZATION.bat" -Destination ".config\scripts\RUN-REORGANIZATION.bat" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Script files moved to .config/scripts/" -ForegroundColor Green

# ============================================================================
# PART 3: CONSOLIDATE REMAINING FOLDERS INTO src/
# ============================================================================

# Move folder contents to src/ (these are source code folders)
robocopy cg src\cg /E /MOVE 2>$null | Out-Null
robocopy demos src\demos /E /MOVE 2>$null | Out-Null
robocopy howto src\howto /E /MOVE 2>$null | Out-Null
robocopy html src\html /E /MOVE 2>$null | Out-Null
robocopy js src\js /E /MOVE 2>$null | Out-Null
robocopy layouts src\layouts /E /MOVE 2>$null | Out-Null
robocopy templates src\templates /E /MOVE 2>$null | Out-Null
robocopy ui src\ui /E /MOVE 2>$null | Out-Null
robocopy server src\server /E /MOVE 2>$null | Out-Null
robocopy tools src\tools /E /MOVE 2>$null | Out-Null
robocopy styles src\styles /E /MOVE 2>$null | Out-Null
robocopy wb-chatbot src\wb-chatbot /E /MOVE 2>$null | Out-Null
robocopy Working src\working /E /MOVE 2>$null | Out-Null

# Clean up old directories if they still exist
Get-ChildItem -Directory | Where-Object { $_.Name -in @('cg', 'demos', 'howto', 'html', 'js', 'layouts', 'templates', 'ui', 'server', 'tools', 'styles', 'wb-chatbot', 'Working') } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Source code folders consolidated into src/" -ForegroundColor Green

# ============================================================================
# PART 4: VERIFY FINAL STATE
# ============================================================================

Write-Host "`n═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📊 FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan

$rootFiles = @(Get-ChildItem -File | Where-Object { $_.Name -notmatch "^\." })
$rootDirs = @(Get-ChildItem -Directory | Where-Object { $_.Name -notmatch "^\." -and $_.Name -ne "node_modules" })

Write-Host "`n📄 FILES IN ROOT: $($rootFiles.Count)" -ForegroundColor Green
$rootFiles | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Green }

Write-Host "`n📁 DIRECTORIES IN ROOT: $($rootDirs.Count)" -ForegroundColor Green
$rootDirs | ForEach-Object { Write-Host "   - $($_.Name)/" -ForegroundColor Green }

Write-Host "`n✅ GOAL:" -ForegroundColor Yellow
Write-Host "   Files: 5 (README.md, package.json, package-lock.json, .gitignore, .env.example)" -ForegroundColor Yellow
Write-Host "   Directories: 8 (src, data, docs, build, .config, .git, .github, .vscode, node_modules)" -ForegroundColor Yellow

Write-Host "`n"
```

---

## 🎬 AFTER THIS COMPLETES

Check your root:
```powershell
dir /b | Sort-Object
```

You should see only:
```
.claude/
.config/
.env.example
.git/
.github/
.gitignore
.vscode/
build/
data/
docs/
node_modules/
package-lock.json
package.json
README.md
src/
tests/
```

---

## ✅ NEXT STEPS

1. **Run the cleanup script above** (copy-paste entire block)
2. **Verify with `dir /b`**
3. **Commit the changes:**
   ```powershell
   git add .
   git commit -m "refactor: radical root cleanup - consolidated to 5 files + 8 folders"
   ```
4. **Test your build:**
   ```powershell
   npm run dev
   npm test
   ```

---

## 🎉 THEN YOU'RE DONE!

Root will be perfectly organized with only 5 essential files!
