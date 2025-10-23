# 🚀 WB Component Generator

## Quick Start

Simply run:

```bash
npm run new
```

Or:

```bash
npm run create
npm run component:new
```

## What It Does

The script will:

1. ✅ Ask for your component name
2. ✅ Create the component folder
3. ✅ Copy all template files from `_TEMPLATE`
4. ✅ **Automatically replace** all placeholders:
   - `COMPONENT-NAME` → your-name
   - `ComponentName` → YourName
   - `wb-COMPONENT-NAME` → wb-your-name
   - `WBComponentName` → WBYourName
5. ✅ **Automatically rename** all files
6. ✅ Ready to use immediately!

## Example

```bash
$ npm run new

========================================
  WB Component Generator
========================================

Enter component name (e.g., my-test): my-awesome-button

📝 Creating component: wb-my-awesome-button
   Class name: WBMyAwesomeButton

Proceed? (y/n): y

🔄 Creating component...
✅ Created directory
✅ Created: wb-my-awesome-button.js
✅ Created: wb-my-awesome-button.css
✅ Created: wb-my-awesome-button-demo.html
✅ Created: wb-my-awesome-button.md
✅ Created: wb-my-awesome-button.schema.json
✅ Created: ✅ claude.md

========================================
  ✅ Component Created Successfully!
========================================

📋 Next steps:
   1. cd components/wb-my-awesome-button
   2. Edit wb-my-awesome-button.js to implement your component
   3. npm run build
   4. Open: /components/wb-my-awesome-button/wb-my-awesome-button-demo.html
```

## Features

### ✅ Fully Automated
- No manual find/replace needed
- No manual file renaming needed
- All placeholders automatically replaced

### ✅ Smart PascalCase Conversion
- `my-test` → `MyTest`
- `color-picker` → `ColorPicker`
- `my-awesome-button` → `MyAwesomeButton`

### ✅ Safe
- Checks if component already exists
- Confirms before creating
- Won't overwrite existing components

### ✅ Complete
- Copies all necessary template files
- Processes all placeholders
- Renames all files correctly

## What Gets Created

Your new component folder will contain:

```
wb-your-component/
├── wb-your-component.js          # Component logic
├── wb-your-component.css         # Component styles
├── wb-your-component-demo.html   # Demo page
├── wb-your-component.md          # Documentation
├── wb-your-component.schema.json # Schema
└── ✅ claude.md                  # Issue tracking
```

## After Creating

1. **Implement your component:**
   ```javascript
   // Edit wb-your-component.js
   // Add your custom logic in render() and other methods
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Test:**
   Open: `http://localhost:8080/components/wb-your-component/wb-your-component-demo.html`

## Template Files

Template files are in: `components/_TEMPLATE/`

The script reads from this folder and processes:
- `wb-COMPONENT-NAME.js`
- `wb-COMPONENT-NAME.css`
- `wb-COMPONENT-NAME-demo.html`
- `wb-COMPONENT-NAME.md`
- `wb-COMPONENT-NAME.schema.json`
- `✅ claude.md`

## Troubleshooting

### Component name already exists
```
❌ Component wb-test already exists!
```
**Solution:** Choose a different name or delete the existing component

### Template not found
```
❌ Template directory not found
```
**Solution:** Make sure `components/_TEMPLATE/` exists

### Permission errors
**Solution:** Run as administrator or check folder permissions

## Examples

### Simple component:
```bash
$ npm run new
Enter component name: test
# Creates: wb-test
```

### Multi-word component:
```bash
$ npm run new
Enter component name: color-picker
# Creates: wb-color-picker with class WBColorPicker
```

### With wb- prefix (automatically handled):
```bash
$ npm run new
Enter component name: wb-button
# Creates: wb-button (removes duplicate wb-)
```

---

**That's it! No more manual work!** 🎉
