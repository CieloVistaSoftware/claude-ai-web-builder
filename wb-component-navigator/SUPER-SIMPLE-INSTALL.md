# SUPER SIMPLE - No Commands Needed!

## The Problem
The 'code' command isn't installed, so all the scripts failed.

---

## EASIEST SOLUTION - Just Copy the Folder

### Step 1: Run this script
```
Double-click: MANUAL-INSTALL.bat
```

It will copy the extension to VS Code's extensions folder automatically.

### Step 2: Restart VS Code
Close ALL VS Code windows completely.

### Step 3: Open Your WB Folder
Open VS Code and open: `C:\Users\jwpmi\Downloads\AI\wb`

### Step 4: Check for Success
Look for "WB COMPONENTS" in the left sidebar!

**DONE!** That's it!

---

## Or Do It Manually (3 Steps)

If the script doesn't work, just do this by hand:

### 1. Open Extensions Folder
Press **Windows+R**, paste this, press Enter:
```
%USERPROFILE%\.vscode\extensions
```

### 2. Copy Extension Folder
Copy this entire folder:
```
C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
```

Paste it into the extensions folder.

You should now have:
```
%USERPROFILE%\.vscode\extensions\wb-component-navigator\
```

### 3. Restart VS Code
Close everything and reopen VS Code.

### 4. Open WB Folder
Open: `C:\Users\jwpmi\Downloads\AI\wb`

**Look for "WB COMPONENTS" in sidebar!**

---

## Verify It Worked

After restarting VS Code and opening your WB folder:

1. **Check Extensions:**
   - View → Extensions (Ctrl+Shift+X)
   - Look for "WB Component Navigator"
   - Should show as installed

2. **Check Output:**
   - View → Output (Ctrl+Shift+U)
   - Dropdown: Select "WB Component Navigator"
   - Should see: "Indexed X components"

3. **Check Sidebar:**
   - Left sidebar should show "WB COMPONENTS"
   - Expand to see your components

4. **Test It:**
   - Open index.html
   - Ctrl+Click on `<wb-button>`
   - Should open wb-button.js

---

## Still Not Working?

If "WB COMPONENTS" still doesn't show after copying:

1. Make sure you opened the WB folder (`C:\Users\jwpmi\Downloads\AI\wb`)
2. NOT the extension folder
3. Wait 10 seconds for extension to activate
4. Check: View → Output → "WB Component Navigator" for errors

---

## Summary

**Easiest way:**
1. Run: `MANUAL-INSTALL.bat`
2. Close VS Code
3. Open your WB folder
4. See "WB COMPONENTS" in sidebar!

**No code command needed!**
**No complicated setup!**
**Just works!** ✅
