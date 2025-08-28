# Test info

- Name: Floating Table Theme Controls Tests >> should have color controls that update theme
- Location: C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:133:7

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "rgba(0, 0, 0, 0)"
    at C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:184:35
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
  176 |     if (await colorPreview.count() > 0) {
  177 |       await expect(colorPreview).toBeVisible();
  178 |       
  179 |       const backgroundColor = await colorPreview.evaluate(el => {
  180 |         return window.getComputedStyle(el).backgroundColor;
  181 |       });
  182 |       
  183 |       console.log(`Color preview background: ${backgroundColor}`);
> 184 |       expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have some color
      |                                   ^ Error: expect(received).not.toBe(expected) // Object.is equality
  185 |     }
  186 |   });
  187 |
  188 |   test('should apply theme changes to table elements', async ({ page }) => {
  189 |     await page.goto('/components/table/table-theme.html');
  190 |     
  191 |     // Wait for page to load
  192 |     await page.waitForTimeout(1000);
  193 |     
  194 |     // Look for table elements
  195 |     const tables = page.locator('table');
  196 |     
  197 |     if (await tables.count() > 0) {
  198 |       const table = tables.first();
  199 |       
  200 |       // Get initial table styling
  201 |       const initialStyles = await table.evaluate(el => {
  202 |         const computed = window.getComputedStyle(el);
  203 |         return {
  204 |           backgroundColor: computed.backgroundColor,
  205 |           borderColor: computed.borderColor,
  206 |           color: computed.color
  207 |         };
  208 |       });
  209 |       
  210 |       console.log('Initial table styles:', initialStyles);
  211 |       
  212 |       // Try to change theme settings
  213 |       const colorControls = page.locator('input[type="range"], .color-bar, .theme-control');
  214 |       
  215 |       if (await colorControls.count() > 0) {
  216 |         const control = colorControls.first();
  217 |         await control.click();
  218 |         await page.waitForTimeout(500);
  219 |         
  220 |         // Get updated table styling
  221 |         const updatedStyles = await table.evaluate(el => {
  222 |           const computed = window.getComputedStyle(el);
  223 |           return {
  224 |             backgroundColor: computed.backgroundColor,
  225 |             borderColor: computed.borderColor,
  226 |             color: computed.color
  227 |           };
  228 |         });
  229 |         
  230 |         console.log('Updated table styles:', updatedStyles);
  231 |         
  232 |         // Check if at least one style property changed
  233 |         const stylesChanged = 
  234 |           initialStyles.backgroundColor !== updatedStyles.backgroundColor ||
  235 |           initialStyles.borderColor !== updatedStyles.borderColor ||
  236 |           initialStyles.color !== updatedStyles.color;
  237 |         
  238 |         console.log(`Table styles changed: ${stylesChanged}`);
  239 |       }
  240 |     } else {
  241 |       console.log('No table elements found on the page');
  242 |     }
  243 |   });
  244 |
  245 |   test('should persist floating control position', async ({ page }) => {
  246 |     await page.goto('/components/table/table-theme.html');
  247 |     
  248 |     const floatingControl = page.locator('#floating-control');
  249 |     
  250 |     if (await floatingControl.count() > 0) {
  251 |       // Move the control
  252 |       const initialBox = await floatingControl.boundingBox();
  253 |       
  254 |       if (initialBox) {
  255 |         await floatingControl.hover();
  256 |         await page.mouse.down();
  257 |         await page.mouse.move(initialBox.x + 150, initialBox.y + 100);
  258 |         await page.mouse.up();
  259 |         
  260 |         await page.waitForTimeout(300);
  261 |         
  262 |         // Reload page
  263 |         await page.reload();
  264 |         await page.waitForTimeout(1000);
  265 |         
  266 |         // Check if position is remembered (this would depend on localStorage implementation)
  267 |         const afterReloadBox = await floatingControl.boundingBox();
  268 |         
  269 |         if (afterReloadBox) {
  270 |           console.log(`Position after reload: (${afterReloadBox.x}, ${afterReloadBox.y})`);
  271 |           
  272 |           // Note: Position persistence would depend on the actual implementation
  273 |           // This test mainly verifies the control still exists after reload
  274 |           await expect(floatingControl).toBeVisible();
  275 |         }
  276 |       }
  277 |     }
  278 |   });
  279 | });
  280 |
```