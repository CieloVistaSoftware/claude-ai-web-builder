# "WB COMPONENTS" Not Showing in Sidebar - Fix Guide

## Quick Diagnosis - Answer These:

**1. Which folder did you open in VS Code?**
- [ ] I opened: `C:\Users\jwpmi\Downloads\AI\wb` ✅ CORRECT
- [ ] I opened: `C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator` ❌ WRONG

**2. Did you install the extension or just launch it?**
- [ ] I ran INSTALL-EXTENSION.bat
- [ ] I ran LAUNCH-WB.bat
- [ ] I pressed F5
- [ ] I just opened the folder

---

## Step-by-Step Fix

### Step 1: Check Output Panel for Errors

This is THE most important step!

1. In VS Code, go to: **View → Output** (Ctrl+Shift+U)
2. In the dropdown at the top right, select: **"WB Component Navigator"**

**What do you see?**

**Option A: "WB Component Navigator" is NOT in the dropdown list**
→ Extension didn't activate at all
→ Go to Solution 1 below

**Option B: You see error messages like "ENOENT" or "no such file"**
→ Extension activated but can't find components
→ Go to Solution 2 below

**Option C: You see "Indexed 41 components" or similar success messages**
→ Extension is working, just sidebar not visible
→ Go to Solution 3 below

**Option D: Output panel is empty**
→ Extension might not have activated yet
→ Wait 10 seconds, then check again
→ If still empty, go to Solution 1

---

## Solution 1: Extension Didn't Activate

### Check 1A: Is the extension installed?

Open terminal and run:
```bash
code --list-extensions
```

Look for: `wb-component-navigator` or similar

**If NOT listed:**
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
npx vsce package --no-dependencies
code --install-extension wb-component-navigator-0.1.0.vsix
```

Then:
1. Close ALL VS Code windows
2. Open: `C:\Users\jwpmi\Downloads\AI\wb`
3. Wait 10 seconds
4. Check Output panel again

### Check 1B: Are you in the right folder?

**Make sure you opened the WB folder, NOT the extension folder!**

**CORRECT:**
```
Open folder: C:\Users\jwpmi\Downloads\AI\wb
```

You should see in VS Code:
```
WB (folder name in explorer)
├─ components/
├─ index.html
└─ wb-component-navigator/
```

**WRONG:**
```
Open folder: C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
```

If you opened wrong folder:
1. File → Close Folder
2. File → Open Folder
3. Select: `C:\Users\jwpmi\Downloads\AI\wb`

---

## Solution 2: Extension Can't Find Components

If Output panel shows errors like:
```
ENOENT: no such file or directory, scandir 'components'
```

### Fix A: Set the components path

1. File → Preferences → Settings (Ctrl+,)
2. Search for: `wbComponentNavigator`
3. Find: "Components Path"
4. Set it to: `components`

OR use absolute path:
```
C:\Users\jwpmi\Downloads\AI\wb\components
```

5. Save settings
6. Ctrl+Shift+P → "Refresh Component Index"

### Fix B: Verify components folder exists

Open terminal:
```bash
cd C:\Users\jwpmi\Downloads\AI\wb
dir components
```

Should list all your wb-* folders.

If the folder doesn't exist, you're in the wrong location!

---

## Solution 3: Extension Works But Sidebar Not Visible

If Output panel shows success (like "Indexed 41 components"):

### Fix A: Refresh the sidebar

1. View → Open View (Ctrl+Q)
2. Type: "WB Components"
3. Press Enter

### Fix B: Check if tree view is collapsed

Look in the left sidebar for:
```
EXPLORER
  └─ WB

📦 WB COMPONENTS     ← Click this to expand
```

It might be collapsed!

### Fix C: Reset VS Code layout

1. View → Appearance → Reset View Locations
2. Restart VS Code
3. Open your WB folder again

---

## Solution 4: Force Refresh Everything

If nothing above worked:

```bash
# 1. Close ALL VS Code windows completely

# 2. Delete VS Code workspace state
# Go to: C:\Users\jwpmi\AppData\Roaming\Code\User\workspaceStorage
# Delete any folders related to "wb"

# 3. Reopen VS Code
code C:\Users\jwpmi\Downloads\AI\wb

# 4. Wait 10 seconds

# 5. Check Output panel
# View → Output → "WB Component Navigator"
```

---

## Solution 5: Manual Verification

Let's verify the extension can see your components:

### Step 1: Open VS Code's Developer Tools

1. Help → Toggle Developer Tools (Ctrl+Shift+I)
2. Go to "Console" tab
3. Look for messages starting with "🔘 WB"

**You should see:**
```
🔘 WB Button Web Component: Starting initialization...
🔘 WB Card Web Component: Starting initialization...
...
```

**If you see these, your components exist!**

### Step 2: Check extension console

In Developer Tools Console, type:
```javascript
console.log(window.WB)
```

Should show your component registry.

---

## Solution 6: Try Different Launch Method

If you used LAUNCH-WB.bat, try installing permanently instead:

```bash
cd C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator

# Package it
npx vsce package --no-dependencies

# Install it permanently
code --install-extension wb-component-navigator-0.1.0.vsix

# Close ALL VS Code windows

# Open WB folder
code C:\Users\jwpmi\Downloads\AI\wb

# Wait 10 seconds and check
```

---

## Verification Checklist

After trying solutions, verify:

1. **Extension is installed:**
   ```bash
   code --list-extensions | findstr wb
   ```

2. **Extension activated:**
   - View → Output → "WB Component Navigator" exists in dropdown
   - Should see log messages

3. **Components found:**
   - Output panel shows: "Indexed X components"
   - No error messages

4. **Correct folder open:**
   - VS Code explorer shows: `components/` folder
   - Window title shows: `WB`

5. **Sidebar visible:**
   - Left sidebar has "WB COMPONENTS" section
   - Can expand to see component list

---

## Still Not Working? Run Diagnostics

Double-click: **CHECK-STATUS.bat**

It will check:
- If extension is installed
- If files are compiled
- If components directory exists
- List all your components

Then tell me what CHECK-STATUS.bat reports!

---

## Alternative: Check Manually

Run these commands and tell me the output:

```bash
# 1. Are you in WB folder?
cd C:\Users\jwpmi\Downloads\AI\wb
dir

# 2. Does components exist?
dir components

# 3. Is extension installed?
code --list-extensions | findstr wb

# 4. Open VS Code with extension
code --extensionDevelopmentPath="C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator" "C:\Users\jwpmi\Downloads\AI\wb"
```

---

## What to Tell Me

To help you fix this, I need to know:

1. **What's in Output panel?**
   - View → Output → Select "WB Component Navigator"
   - Copy and paste what you see

2. **Which folder is open?**
   - Look at VS Code window title
   - Look at folder tree on left

3. **Is extension installed?**
   - Run: `code --list-extensions`
   - Does it show wb-component-navigator?

4. **What does CHECK-STATUS.bat say?**
   - Run it and tell me the results

With this info, I can tell you exactly what's wrong!
