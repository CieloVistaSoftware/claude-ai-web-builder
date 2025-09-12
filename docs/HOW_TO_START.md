# HOW TO START THE WEBSITE IMPORT SYSTEM

## 🚀 QUICK START GUIDE

### Step 1: Open the Website Builder
1. Navigate to the `wb` folder
2. Open `wb.html` in your web browser
3. You should see the website builder interface

### Step 2: Use the Import Feature
1. Look for the "📂 Choose Website Folder" button
2. Click it to open the folder picker
3. Select a folder that contains your website files (must have index.html)
4. The system will automatically:
   - Process all files in the folder
   - Start a local server
   - Open your website in a new window
   - Inject the color control panel

### Step 3: Test the System
1. First, click the red "Test Import System" button (top-left) to verify it's working
2. Check the browser console (F12) for any error messages
3. Make sure popups are allowed for your browser

## 🔧 TROUBLESHOOTING

### If the import button doesn't work:
1. Open browser console (F12)
2. Type: `testImport()`
3. Check what errors appear

### If no files are found:
1. Make sure your folder contains an `index.html` file
2. Check console logs to see what files were detected

### If the website doesn't open:
1. Check if popups are blocked in your browser
2. Allow popups for this site
3. Check console for Service Worker errors

## 📁 FOLDER STRUCTURE REQUIREMENTS

Your website folder should contain:
```
my-website/
├── index.html (REQUIRED)
├── style.css (optional)
├── script.js (optional)
├── images/ (optional)
└── other files...
```

## 🎯 WHAT HAPPENS NEXT

1. Your website opens in a new window with full functionality
2. A control panel appears in the top-right corner
3. The control panel shows all colors found in your CSS files
4. You can use the control panel to analyze and modify colors

## ⚠️ BROWSER REQUIREMENTS

- Modern browser with Service Worker support
- JavaScript enabled
- Popups allowed
- File API support (webkitdirectory)

---

**Ready to start? Open wb/wb.html in your browser and click "Choose Website Folder"!**