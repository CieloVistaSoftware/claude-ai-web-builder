# FIX: 'code' command not found

## The Problem
VS Code's command-line tool isn't in your PATH. This is why all the scripts failed.

## Quick Fix - Install 'code' Command

### Step 1: Open VS Code

Just double-click VS Code icon or open it normally.

### Step 2: Install Shell Command

1. Press **Ctrl+Shift+P** (Command Palette)
2. Type: **"Shell Command: Install 'code' command in PATH"**
3. Press Enter
4. You may need to restart your terminal

### Step 3: Test It

Close and reopen your terminal, then run:
```bash
code --version
```

Should show VS Code version number.

### Step 4: Now Run Scripts

After the code command works, run:
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
.\INSTALL-EXTENSION.bat
```

---

## Alternative: Manual Installation (No 'code' command needed)

If you can't get the code command working, here's a manual method:

### Step 1: Find VS Code Extensions Folder

Press **Windows+R**, paste this, press Enter:
```
%USERPROFILE%\.vscode\extensions
```

This opens your extensions folder.

### Step 2: Copy Extension Folder

Copy the entire folder:
```
C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
```

Paste it into the extensions folder as:
```
%USERPROFILE%\.vscode\extensions\wb-component-navigator
```

### Step 3: Restart VS Code

Close ALL VS Code windows and reopen.

### Step 4: Open Your WB Folder

Open: `C:\Users\jwpmi\Downloads\AI\wb`

The extension should load automatically!

---

## Alternative 2: Use VS Code's Extension Manager

### Step 1: Package the extension manually

Open PowerShell in: `C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator`

Run:
```powershell
npm install -g @vscode/vsce
npx vsce package --no-dependencies
```

This creates: `wb-component-navigator-0.1.0.vsix`

### Step 2: Install via VS Code UI

1. Open VS Code
2. View → Extensions (Ctrl+Shift+X)
3. Click the "..." menu at top of Extensions panel
4. Select "Install from VSIX..."
5. Browse to: `C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator\wb-component-navigator-0.1.0.vsix`
6. Click Install

### Step 3: Restart and Test

1. Close ALL VS Code windows
2. Open: `C:\Users\jwpmi\Downloads\AI\wb`
3. Look for "WB COMPONENTS" in sidebar

---

## Which Method Should You Use?

### Use Method 1 (Install 'code' command) if:
- You want the scripts to work
- You'll use VS Code command line tools

### Use Alternative 1 (Manual copy) if:
- You just want it to work NOW
- Don't care about command line tools

### Use Alternative 2 (VSIX install) if:
- You want proper installation
- Don't mind using VS Code UI

---

## After Installing

Once extension is installed (any method):

1. **Open VS Code**
2. **Open folder:** `C:\Users\jwpmi\Downloads\AI\wb`
3. **Wait 10 seconds** (for extension to activate)
4. **Check:** View → Output → "WB Component Navigator"
5. **Look for:** "WB COMPONENTS" in left sidebar

---

## I Recommend: Alternative 1 (Manual Copy)

It's the simplest and doesn't require any commands!

Just:
1. Press Windows+R
2. Type: `%USERPROFILE%\.vscode\extensions`
3. Copy `wb-component-navigator` folder there
4. Restart VS Code
5. Open your WB folder

Done!
