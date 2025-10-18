# Base HTML Template Standards

## 📋 Purpose
This template prevents common HTML creation mistakes by providing a **standard starting point** for all new HTML pages.

## ✅ Standards Enforced

### 1. **Dark Mode by Default**
```html
<html lang="en" data-theme="dark" data-mode="dark">
```
- `data-theme="dark"` - For theme system
- `data-mode="dark"` - For light/dark mode

### 2. **Absolute CSS Path**
```html
<link rel="stylesheet" href="/styles/main.css">
```
- Uses absolute path from server root
- Always works regardless of file location
- No more MIME type errors

### 3. **No Inline Anything**
- ❌ No inline CSS
- ❌ No inline JavaScript
- ✅ External files only

### 4. **File Naming Convention**
All page-specific files use the **same base name**:
```
my-page.html
my-page.css
my-page.js
```

### 5. **Module Loading**
```html
<script type="module" src="page-name.js"></script>
```
- Always use ES6 modules
- Never use CommonJS
- Load at end of body

## 🚀 How to Use

### Step 1: Copy the Template
```powershell
Copy-Item templates/base-template.html html/my-new-page.html
```

### Step 2: Update the Template
1. Change `<title>` to your page title
2. Change `page-name.css` to `my-new-page.css`
3. Change `page-name.js` to `my-new-page.js`

### Step 3: Create Supporting Files
```powershell
# Create the CSS file
New-Item html/my-new-page.css

# Create the JS file
New-Item html/my-new-page.js
```

### Step 4: Add Your Content
Edit the HTML body section with your page content.

## 📐 File Structure

```
html/
├── my-new-page.html      # Main HTML (copied from template)
├── my-new-page.css       # Page-specific styles
└── my-new-page.js        # Page-specific JavaScript
```

## ⚠️ Common Mistakes This Prevents

### ❌ Wrong CSS Path
```html
<!-- WRONG - Relative path breaks with server -->
<link rel="stylesheet" href="../../styles/main.css">

<!-- RIGHT - Absolute path always works -->
<link rel="stylesheet" href="/styles/main.css">
```

### ❌ Missing Dark Mode
```html
<!-- WRONG - No theme attributes -->
<html lang="en">

<!-- RIGHT - Both attributes set -->
<html lang="en" data-theme="dark" data-mode="dark">
```

### ❌ Inline Styles/Scripts
```html
<!-- WRONG - Inline style -->
<style>
  body { background: #000; }
</style>

<!-- RIGHT - External CSS -->
<link rel="stylesheet" href="my-page.css">
```

### ❌ Wrong Module Type
```html
<!-- WRONG - No module type -->
<script src="my-page.js"></script>

<!-- RIGHT - ES6 module -->
<script type="module" src="my-page.js"></script>
```

## 🎯 Validation Checklist

Before committing any new HTML file, verify:

- [ ] Uses base template structure
- [ ] Has `data-theme="dark"` and `data-mode="dark"`
- [ ] CSS path is `/styles/main.css` (absolute)
- [ ] Page CSS file exists with matching name
- [ ] Page JS file exists with matching name
- [ ] Script tag has `type="module"`
- [ ] No inline styles anywhere
- [ ] No inline scripts anywhere
- [ ] Title includes "| Cielo Vista Software"

## 📝 Example Implementation

### my-demo.html
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark" data-mode="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Demo | Cielo Vista Software</title>
  
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="stylesheet" href="my-demo.css">
</head>
<body>
  <h1>My Demo Page</h1>
  
  <script type="module" src="my-demo.js"></script>
</body>
</html>
```

### my-demo.css
```css
/* Page-specific styles only */
.my-component {
  color: var(--text-primary);
}
```

### my-demo.js
```javascript
// Page-specific JavaScript only
console.log('My demo page loaded');
```

## 🔒 Enforcement

**This template is MANDATORY** for all new HTML pages. No exceptions.

Any PR with HTML that doesn't follow this template will be rejected.

## 📚 Related Documentation

- [UnifiedInstructions.md](../docs/UnifiedInstructions.md) - Overall coding standards
- [html-refactor-compliance-report.md](../docs/html-refactor-compliance-report.md) - Refactoring standards
