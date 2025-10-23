# Components Index - Auto-Discovery System

## 🎯 Purpose
The `index.html` file automatically displays all `*demo*.html` files found in component subdirectories.

## 📋 How It Works

1. **Manifest Generation**: A script scans all subdirectories and finds ANY file containing `demo` in the filename that ends with `.html`
2. **Index Loading**: The `index.html` reads the manifest and displays all demos in the sidebar
3. **Click to Load**: Clicking a demo loads it in the iframe

## 🚀 Quick Start

### Using NPM (Recommended)

From the **project root** directory:

```bash
npm run build
```

This automatically:
- Scans all component directories for `*demo*.html` files
- Generates `components/demos-manifest.json`
- Displays count and sample demos found

### Manual Methods

If you prefer to run the script directly from the `components` directory:

**Option 1: Node.js (Cross-platform)**
```bash
cd components
node generate-demos-manifest.js
```

**Option 2: PowerShell (Windows)**
```powershell
cd components
.\generate-demos-manifest.ps1
```

**Option 3: Batch File (Windows - Double Click)**
```
Double-click: components/generate-demos-manifest.bat
```

### After Adding New Demos

Whenever you add a new demo file:

```bash
npm run build
```

Or just:

```bash
npm run build:demos
```

Then refresh `components/index.html` in your browser.

## 📁 Files

- **index.html** - Main page with sidebar and iframe
- **demos-manifest.json** - Auto-generated list of all demos
- **generate-demos-manifest.js** - Node.js scanner script
- **generate-demos-manifest.ps1** - PowerShell scanner script

## 🔍 What Gets Discovered

The scripts find ANY `.html` file containing `demo` in the filename:
- `demo.html`
- `wb-button-demo.html`
- `demo-clean.html`
- `my-demo-test.html`
- `component-demo-simple.html`
- etc.

## 🎨 Features

- **Auto-discovery**: No manual list maintenance
- **Sorted list**: Alphabetically by component name
- **Active state**: Current demo highlighted in blue
- **Hover effects**: Visual feedback
- **Responsive**: Works on mobile and desktop
- **Error handling**: Clear messages if manifest is missing

## 🛠️ Troubleshooting

### "Manifest file not found" error

Run the generator script:
```bash
node generate-demos-manifest.js
```

### Demo not showing up

1. Ensure filename contains `demo` and ends with `.html`
2. Regenerate the manifest
3. Refresh the browser (Ctrl+F5)

### Want to exclude certain demos?

Edit the generator script and add exclusion logic in the scanning function.

## 💡 Tips

- Add the manifest generation to your build process
- Run it as a pre-commit hook for automatic updates
- The manifest is just JSON - you can manually edit it if needed

---

**Last Updated**: October 21, 2025
