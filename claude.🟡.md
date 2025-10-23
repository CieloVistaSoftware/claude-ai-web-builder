# Claude.md File Status System

**Format**: `claude.<STATUS>.md`  
**Version**: 3.0  
**Updated**: October 19, 2025

---

## 📋 STATUS CODES

| Code | Filename | Meaning | Action |
|------|----------|---------|--------|
| **NEW** | `claude.NEW.md` | New file, never aggregated | 🔴 **AI MUST READ** |
| **UPD** | `claude.UPD.md` | Has updates, needs re-read | 🟡 **AI MUST READ** |
| **OK** | `claude.OK.md` | Current, already aggregated | ✅ **SKIP** |
| **ARC** | `claude.ARC.md` | Archived, deprecated | ⚫ **SKIP** |

---

## 🎯 HOW IT WORKS

### The System
Every claude.md file uses a status code in its filename to indicate whether it needs to be read and aggregated into `/docs/status/currentstatus.md`.

### The Workflow
1. **Developer edits** a claude file
2. **Developer renames** `claude.OK.md` → `claude.UPD.md`
3. **Developer checks** (optional): `npm run check-status`
4. **Developer tells AI**: "Aggregate changed claude.md files"
5. **AI reads** only NEW and UPD files (fast!)
6. **AI updates** `/docs/status/currentstatus.md`
7. **AI renames** processed files back to `claude.OK.md`

---

## ⚡ COMMANDS

### Check Status (Super Fast!)
```bash
npm run check-status
```

Scans all claude files in <250ms - **NO file reading required!**

**Output**:
```
📊 Claude.md Status Check:
🔴 NEW: 2 files
🟡 UPDATED: 3 files
✅ CURRENT: 91 files
⚫ ARCHIVED: 0 files

⚡ Scan completed in 234 milliseconds!
```

---

### Mark File as Updated
**Option 1 - Manual (Easiest!)**:
Just rename in file explorer:
```
claude.OK.md → claude.UPD.md
```

**Option 2 - PowerShell Script**:
```bash
npm run mark-updated -- -Path "components/wb-input/claude.OK.md"
```

**Option 3 - Tell AI**:
```
"Mark wb-input claude.md as updated"
```

---

### Initialize All Files (First Time)
```bash
npm run init-markers
```

Renames all `claude.md` → `claude.OK.md`

---

## 📖 EXAMPLE WORKFLOW

### Scenario: Edit wb-input Component

#### Step 1: Edit the File
```
Edit: components/wb-input/claude.OK.md
(Make your changes to the file)
```

#### Step 2: Mark as Updated
```
Rename: claude.OK.md → claude.UPD.md
```

#### Step 3: Check Status (Optional)
```bash
npm run check-status
```

Output shows:
```
🟡 UPDATED: 1 file
  components/wb-input/claude.UPD.md
```

#### Step 4: Tell AI to Aggregate
```
"Aggregate changed claude.md files"
```

#### Step 5: AI Processes
AI will:
- Find `claude.UPD.md` files (instant!)
- Read only that 1 file (fast!)
- Extract tasks, issues, priorities
- Update `/docs/status/currentstatus.md`
- Rename back to `claude.OK.md`

#### Result
✅ currentstatus.md updated with wb-input changes  
✅ File renamed back to `claude.OK.md`  
✅ Ready for next edit

---

## 🎯 WHY THIS DESIGN?

### Filename Pattern: `claude.<STATUS>.md`

**Advantages**:
1. ✅ **Groups all claude files** - Alphabetically sorted together
2. ✅ **"claude" stays first** - Easy to find in file lists
3. ✅ **Status is clear** - `.OK.` or `.UPD.` obvious at a glance
4. ✅ **Follows standards** - Like `.test.js`, `.spec.js` naming conventions
5. ✅ **Super fast** - Directory scan only, no file reading!
6. ✅ **Simple** - Just rename the file

### File Sorting Example

With `claude.<STATUS>.md` format, files group nicely:
```
components/wb-input/
  ├── claude.OK.md          ← All claude files together!
  ├── wb-input.css
  ├── wb-input.js
  └── wb-input.md
```

---

## 📊 PROJECT FILES

### Master Status Files
- `/docs/status/currentstatus.md` - **PRIMARY WORK ORGANIZER**
- `/docs/status/fixes.md` - All code changes log

### Documentation
- `/docs/howto/ClaudeMdFilenamePrefixSystem-v3.md` - Complete system guide
- `/docs/setup/START-HERE-FIRST-TIME-SETUP.md` - First-time setup

### Scripts
- `/scripts/check-claude-status-v3.ps1` - Status check script
- `/scripts/mark-claude-updated-v3.ps1` - Mark file script
- `/scripts/initialize-claude-v3.ps1` - Initialize all files

---

## 🚀 FIRST TIME SETUP

### Step 1: Initialize
```bash
npm run init-markers
```

This renames all `claude.md` → `claude.OK.md` (one-time operation)

### Step 2: Verify
```bash
npm run check-status
```

Should show all files as `✅ CURRENT`

### Step 3: Done!
System is active. Start using it by renaming files when you edit them.

---

## 💡 TIPS

### Daily Use
- Run `npm run check-status` each morning
- Rename files to `.UPD.` after editing
- Tell AI to aggregate when ready

### Best Practices
- ✅ Always mark files as UPD after editing
- ✅ Check status before major work
- ✅ Let AI aggregate frequently
- ✅ Keep currentstatus.md as single source of truth

### When to Use Each Status
- **NEW** - Brand new component/file created
- **UPD** - You edited an existing file
- **OK** - File is current (AI sets this)
- **ARC** - Old/deprecated, skip forever

---

## 📞 NEED HELP?

### Documentation
- Complete guide: `/docs/howto/ClaudeMdFilenamePrefixSystem-v3.md`
- Quick start: `/docs/setup/START-HERE-FIRST-TIME-SETUP.md`
- Project rules: `/docs/reference/UnifiedInstructions.md`

### Common Questions

**Q: Do I need to edit file content to change status?**  
A: No! Just rename the file. That's the whole point - it's fast!

**Q: What if I forget to rename after editing?**  
A: Your changes won't be aggregated. Run `npm run check-status` to see which files need marking.

**Q: Can I manually rename in file explorer?**  
A: Yes! That's actually the easiest way. Just rename `claude.OK.md` to `claude.UPD.md`.

**Q: How does AI know what changed?**  
A: AI reads the entire UPD file and extracts all tasks, issues, and priorities.

**Q: What if multiple files are UPD?**  
A: AI reads all of them and aggregates everything into currentstatus.md.

---

## ✅ SUMMARY

### The Format
`claude.<STATUS>.md` where STATUS is: NEW, UPD, OK, or ARC

### The Speed
⚡ <250ms to check 96 files (no file reading!)

### The Simplicity
Just rename files to mark them

### The Result
📊 currentstatus.md is always accurate and up-to-date!

---

*This file explains the status code system*  
*For complete docs, see /docs/howto/*  
*Created: October 19, 2025*
