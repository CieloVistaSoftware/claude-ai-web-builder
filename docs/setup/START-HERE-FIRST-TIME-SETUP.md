# 🚀 FIRST TIME SETUP - START HERE!

**ONE COMMAND TO START EVERYTHING**

---

## ⚡ THE COMMAND

```bash
npm run init-markers
```

**That's it!** This single command:
1. Finds all 96 claude.md files
2. Renames each one to `OK-claude.md`
3. Takes about 5-10 seconds
4. Sets up the entire system

---

## 📋 COMPLETE FIRST-TIME SETUP

### Step 1: Initialize (Required)
```bash
npm run init-markers
```

**Expected Output:**
```
🚀 Initializing filename prefixes for all claude.md files...
   Default prefix: OK-

  ✅ Initialized: components/wb-input/OK-claude.md
  ✅ Initialized: components/wb-button/OK-claude.md
  ✅ Initialized: components/wb-nav/OK-CLAUDE.md
  ... (92 more files)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Initialization Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Renamed: 96 files
  ⏭️ Skipped: 0 files
  ❌ Errors: 0 files
  📁 Total: 96 files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Success! 96 files initialized with OK- prefix
   Next step: Run 'npm run check-status' to verify
```

---

### Step 2: Verify (Recommended)
```bash
npm run check-status
```

**Expected Output:**
```
📊 Claude.md Status Check (Filename Prefix Scan):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 NEW: 0 files
🟡 UPDATED: 0 files
✅ CURRENT: 96 files (OK-claude.md)
⚫ ARCHIVED: 0 files
⚠️ NO PREFIX: 0 files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Total: 96 files scanned
⚡ Scan completed in 250 milliseconds!

✅ All files are current! No aggregation needed.
```

---

### Step 3: You're Done! ✅

The system is now **ACTIVE and READY**!

All 96 claude.md files are now:
```
components/wb-input/OK-claude.md      ✅
components/wb-button/OK-claude.md     ✅
components/wb-nav/OK-CLAUDE.md        ✅
... (and 93 more)
```

---

## 🎯 WHAT HAPPENS

### Before Running init-markers:
```
/components/
├── wb-input/
│   └── claude.md              ⚠️ No prefix
├── wb-button/
│   └── claude.md              ⚠️ No prefix
└── wb-nav/
    └── CLAUDE.md              ⚠️ No prefix
```

### After Running init-markers:
```
/components/
├── wb-input/
│   └── OK-claude.md           ✅ Ready!
├── wb-button/
│   └── OK-claude.md           ✅ Ready!
└── wb-nav/
    └── OK-CLAUDE.md           ✅ Ready!
```

**Note:** Original case is preserved (`CLAUDE.md` → `OK-CLAUDE.md`)

---

## 💡 NEXT STEPS

### Daily Use

**Check status** (anytime you want):
```bash
npm run check-status
```

**After editing a file:**
1. Rename `OK-claude.md` → `UPD-claude.md`
2. Or run: `npm run mark-updated -- -Path "components/wb-input/OK-claude.md"`

**Update currentstatus.md:**
- Tell AI: "Aggregate changed claude.md files"

---

## ⚠️ TROUBLESHOOTING

### If you see errors:
1. Make sure you're in the project root: `C:\Users\jwpmi\Downloads\AI\wb`
2. Check PowerShell execution policy is set
3. Try running as Administrator

### If some files already have prefixes:
```
⏭️ Skipped (has prefix): components/wb-input/OK-claude.md
```
This is normal! The script skips already-prefixed files.

### If you need to start over:
Manually remove all prefixes (rename `OK-claude.md` → `claude.md`), then run `npm run init-markers` again.

---

## 📞 NEED HELP?

See full documentation:
- `/docs/howto/ClaudeMdFilenamePrefixSystem.md` - Complete guide
- `/docs/howto/ClaudeMdFilenamePrefixQuickRef.md` - Quick reference
- `/docs/FILENAME-PREFIX-SYSTEM-COMPLETE.md` - Summary

---

## ✅ SUMMARY

**ONE COMMAND:**
```bash
npm run init-markers
```

**Result:**
- ✅ All 96 files renamed with `OK-` prefix
- ✅ System active and ready
- ✅ Can now use `npm run check-status` anytime
- ✅ Can tell AI to aggregate changes

**TIME:** 5-10 seconds

**THAT'S IT!** 🎉

---

*First Time Setup Guide*  
*Start here to activate the system*  
*Created: October 19, 2025*
