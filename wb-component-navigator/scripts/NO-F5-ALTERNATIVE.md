# No F5 Needed - Install Extension Permanently

## Option 1: Auto-Install Script (EASIEST)

Just run this:

```
Double-click: INSTALL-EXTENSION.bat
```

It will:
1. Package the extension as a .vsix file
2. Install it into VS Code permanently
3. The extension runs automatically whenever you open VS Code!

**Then:**
1. Close ALL VS Code windows
2. Open your WB folder: `C:\Users\jwpmi\Downloads\AI\wb`
3. Extension loads automatically!
4. Look for "WB COMPONENTS" in sidebar
5. Test: Ctrl+Click on `<wb-button>`

**No F5 ever needed!**

---

## Option 2: Manual Install (If script doesn't work)

### Step 1: Package the extension
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
npx vsce package --no-dependencies
```

This creates: `wb-component-navigator-0.1.0.vsix`

### Step 2: Install it
```bash
code --install-extension wb-component-navigator-0.1.0.vsix
```

### Step 3: Restart VS Code
Close all VS Code windows and reopen.

### Step 4: Open your WB folder
Open: `C:\Users\jwpmi\Downloads\AI\wb`

**Extension runs automatically!**

---

## Option 3: Command Line Launch

Create a shortcut with this command:

```bash
code --extensionDevelopmentPath="C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator" "C:\Users\jwpmi\Downloads\AI\wb"
```

This opens VS Code with:
- Your WB folder loaded
- Extension running automatically

---

## Option 4: PowerShell Script

Save this as `launch-wb.ps1`:

```powershell
$extensionPath = "C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator"
$workspacePath = "C:\Users\jwpmi\Downloads\AI\wb"

& code --extensionDevelopmentPath="$extensionPath" "$workspacePath"
```

Then run:
```bash
powershell -ExecutionPolicy Bypass -File launch-wb.ps1
```

---

## Which Option Should You Use?

**Use Option 1 (INSTALL-EXTENSION.bat)** - It's the easiest!

After running it once, the extension is permanently installed and works automatically.

---

## After Installation

**How to verify it's working:**

1. Open VS Code
2. View → Extensions (Ctrl+Shift+X)
3. Search for "WB Component Navigator"
4. You should see it listed as installed!

5. Open your WB folder
6. Look for "WB COMPONENTS" in the sidebar
7. Ctrl+Click on any component - it should work!

---

## Uninstall (if you want to remove it later)

1. View → Extensions
2. Find "WB Component Navigator"
3. Click the gear icon → Uninstall

---

## Troubleshooting

### "vsce: command not found"
```bash
npm install -g @vscode/vsce
```

### "Failed to package"
Make sure you compiled first:
```bash
cd client
npx tsc
cd ..\server
npx tsc
cd ..
```

Then try again:
```bash
npx vsce package --no-dependencies
```

### "code: command not found"
VS Code's command line tools aren't installed.

Solution:
1. Open VS Code
2. Ctrl+Shift+P
3. Type: "Shell Command: Install 'code' command in PATH"
4. Restart terminal

---

## Summary

**Easiest path:**
1. Run `INSTALL-EXTENSION.bat`
2. Close VS Code
3. Open your WB folder
4. Extension works automatically!

**No F5 needed ever again!** ✅
