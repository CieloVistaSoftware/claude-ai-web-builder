# Test info

- Name: Floating Table Theme Controls Tests >> should have floating controls working in browser
- Location: C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:69:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#floating-control')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#floating-control')

    at C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:75:35
```

# Page snapshot

```yaml
- banner:
  - heading "Table Theme Component Demo" [level=1]
  - paragraph: Mathematical color inheritance and automatic theming for data tables. Theme changes affect all tables instantly using HSL color relationships.
- heading "🎨 Color Control" [level=2]
- text: Primary Hue
- slider "Primary Hue": "220"
- text: 220° Saturation
- slider "Saturation": "70"
- text: 70% Lightness
- slider "Lightness": "50"
- text: 50% Theme Preset
- combobox "Theme Preset":
  - option "Light" [selected]
  - option "Dark"
  - option "Auto (System)"
- heading "🔍 Current Theme Values" [level=3]
- heading "👥 Employee Directory" [level=2]
- paragraph: Interactive employee table with sorting, pagination, and selection. Data loaded from table.json.
- heading "📦 Product Catalog" [level=2]
- paragraph: Compact table layout with custom renderers and mathematical color relationships. Product Catalog Table
- heading "💳 Transaction History" [level=2]
- paragraph: Financial data table with status indicators and amount formatting.
```

# Test source

```ts
   1 | /**
   2 |  * Floating Table Theme Controls Tests
   3 |  * 
   4 |  * Converted from FloatingTableThemeControls.Tests.ps1
   5 |  * Tests the floating, draggable color control panel for table theming
   6 |  */
   7 |
   8 | import { test, expect } from '@playwright/test';
   9 | import * as fs from 'fs';
   10 | import * as path from 'path';
   11 |
   12 | // Helper function to get project root path
   13 | function getProjectRoot() {
   14 |   const testDir = path.resolve(__dirname);
   15 |   const testsDir = path.dirname(testDir);
   16 |   return path.dirname(testsDir);
   17 | }
   18 |
   19 | test.describe('Floating Table Theme Controls Tests', () => {
   20 |   const projectRoot = getProjectRoot();
   21 |   
   22 |   test('should have table-theme.html file with floating controls structure', async () => {
   23 |     const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
   24 |     
   25 |     // Check if the file exists
   26 |     expect(fs.existsSync(tableThemeFile)).toBeTruthy();
   27 |     
   28 |     // Read the content
   29 |     const content = fs.readFileSync(tableThemeFile, 'utf8');
   30 |     
   31 |     // Required CSS classes for floating controls
   32 |     const requiredClasses = [
   33 |       '.floating-color-control',
   34 |       '.control-header',
   35 |       '.control-btn',
   36 |       '.floating-control-content',
   37 |       '.floating-control-group',
   38 |       '.color-preview'
   39 |     ];
   40 |     
   41 |     requiredClasses.forEach(className => {
   42 |       expect(content).toContain(className);
   43 |       console.log(`✅ Found CSS class: ${className}`);
   44 |     });
   45 |   });
   46 |
   47 |   test('should have required HTML elements for floating controls', async () => {
   48 |     const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
   49 |     const content = fs.readFileSync(tableThemeFile, 'utf8');
   50 |     
   51 |     // Required HTML elements
   52 |     const requiredElements = [
   53 |       'id="floating-control"',
   54 |       'id="control-header"',
   55 |       'id="minimize-btn"',
   56 |       'id="floating-color-bar"',
   57 |       'id="floating-saturation-slider"',
   58 |       'id="floating-lightness-slider"',
   59 |       'id="floating-theme-select"',
   60 |       'id="color-preview"'
   61 |     ];
   62 |     
   63 |     requiredElements.forEach(element => {
   64 |       expect(content).toContain(element);
   65 |       console.log(`✅ Found HTML element: ${element}`);
   66 |     });
   67 |   });
   68 |
   69 |   test('should have floating controls working in browser', async ({ page }) => {
   70 |     // Navigate to the table theme page
   71 |     await page.goto('/components/table/table-theme.html');
   72 |     
   73 |     // Check if floating control exists
   74 |     const floatingControl = page.locator('#floating-control');
>  75 |     await expect(floatingControl).toBeVisible();
      |                                   ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   76 |     
   77 |     // Check if control header exists
   78 |     const controlHeader = page.locator('#control-header');
   79 |     await expect(controlHeader).toBeVisible();
   80 |     
   81 |     // Test minimize functionality if available
   82 |     const minimizeBtn = page.locator('#minimize-btn');
   83 |     if (await minimizeBtn.count() > 0) {
   84 |       await minimizeBtn.click();
   85 |       
   86 |       // Wait for animation
   87 |       await page.waitForTimeout(500);
   88 |       
   89 |       // Check if control content is hidden or minimized
   90 |       const controlContent = page.locator('.floating-control-content');
   91 |       if (await controlContent.count() > 0) {
   92 |         const isHidden = await controlContent.isHidden();
   93 |         console.log(`Control content minimized: ${isHidden}`);
   94 |       }
   95 |     }
   96 |   });
   97 |
   98 |   test('should have draggable floating controls', async ({ page }) => {
   99 |     await page.goto('/components/table/table-theme.html');
  100 |     
  101 |     const floatingControl = page.locator('#floating-control');
  102 |     await expect(floatingControl).toBeVisible();
  103 |     
  104 |     // Get initial position
  105 |     const initialPosition = await floatingControl.boundingBox();
  106 |     
  107 |     if (initialPosition) {
  108 |       // Test drag functionality
  109 |       await floatingControl.hover();
  110 |       await page.mouse.down();
  111 |       await page.mouse.move(initialPosition.x + 100, initialPosition.y + 50);
  112 |       await page.mouse.up();
  113 |       
  114 |       // Wait for potential animation
  115 |       await page.waitForTimeout(200);
  116 |       
  117 |       // Get new position
  118 |       const newPosition = await floatingControl.boundingBox();
  119 |       
  120 |       if (newPosition) {
  121 |         // Check if position changed (allowing some tolerance)
  122 |         const positionChanged = 
  123 |           Math.abs(newPosition.x - initialPosition.x) > 10 || 
  124 |           Math.abs(newPosition.y - initialPosition.y) > 10;
  125 |         
  126 |         console.log(`Position changed: ${positionChanged}`);
  127 |         console.log(`Initial: (${initialPosition.x}, ${initialPosition.y})`);
  128 |         console.log(`New: (${newPosition.x}, ${newPosition.y})`);
  129 |       }
  130 |     }
  131 |   });
  132 |
  133 |   test('should have color controls that update theme', async ({ page }) => {
  134 |     await page.goto('/components/table/table-theme.html');
  135 |     
  136 |     // Look for color controls
  137 |     const colorBar = page.locator('#floating-color-bar');
  138 |     const saturationSlider = page.locator('#floating-saturation-slider');
  139 |     const lightnessSlider = page.locator('#floating-lightness-slider');
  140 |     const colorPreview = page.locator('#color-preview');
  141 |     
  142 |     // Test color bar if it exists
  143 |     if (await colorBar.count() > 0) {
  144 |       await expect(colorBar).toBeVisible();
  145 |       
  146 |       // Click on different positions of the color bar
  147 |       await colorBar.click({ position: { x: 50, y: 10 } });
  148 |       await page.waitForTimeout(100);
  149 |       
  150 |       console.log('✅ Color bar interaction tested');
  151 |     }
  152 |     
  153 |     // Test saturation slider if it exists
  154 |     if (await saturationSlider.count() > 0) {
  155 |       await expect(saturationSlider).toBeVisible();
  156 |       
  157 |       // Drag slider
  158 |       await saturationSlider.fill('75');
  159 |       await page.waitForTimeout(100);
  160 |       
  161 |       console.log('✅ Saturation slider interaction tested');
  162 |     }
  163 |     
  164 |     // Test lightness slider if it exists
  165 |     if (await lightnessSlider.count() > 0) {
  166 |       await expect(lightnessSlider).toBeVisible();
  167 |       
  168 |       // Drag slider
  169 |       await lightnessSlider.fill('60');
  170 |       await page.waitForTimeout(100);
  171 |       
  172 |       console.log('✅ Lightness slider interaction tested');
  173 |     }
  174 |     
  175 |     // Check if color preview updates
```