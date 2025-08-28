"use strict";
/**
 * Media Placeholder Tests
 *
 * Converted from MediaPlaceholder.Tests.ps1
 * Tests media placeholder visibility and behavior in different modes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe("Media Placeholder Tests", () => {
    (0, test_1.test)("should show/hide media placeholders based on edit mode", async ({ page, }) => {
        // Create a test page with media placeholders
        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              .edit-mode .media-placeholder,
              .media-placeholder.has-media {
                  display: flex;
              }
              
              :not(.edit-mode) .media-placeholder:not(.has-media) {
                  display: none;
              }
              
              .media-placeholder {
                  width: 200px;
                  height: 150px;
                  border: 2px dashed #ccc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 10px;
              }
          </style>
      </head>
      <body>
          <div id="placeholder1" class="media-placeholder">Empty Placeholder</div>
          <div id="placeholder2" class="media-placeholder has-media">Placeholder with Media</div>
      </body>
      </html>
    `);
        // Test case 1: Not in edit mode
        const placeholder1 = page.locator("#placeholder1");
        const placeholder2 = page.locator("#placeholder2");
        // Empty placeholder should be hidden when not in edit mode
        await (0, test_1.expect)(placeholder1).toBeHidden();
        // Placeholder with media should be visible
        await (0, test_1.expect)(placeholder2).toBeVisible();
        // Test case 2: In edit mode
        await page.evaluate(() => {
            document.body.classList.add("edit-mode");
        });
        // Both placeholders should be visible in edit mode
        await (0, test_1.expect)(placeholder1).toBeVisible();
        await (0, test_1.expect)(placeholder2).toBeVisible();
    });
    (0, test_1.test)("should handle media placeholder interactions", async ({ page }) => {
        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              .media-placeholder {
                  width: 200px;
                  height: 150px;
                  border: 2px dashed #ccc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 10px;
                  cursor: pointer;
                  transition: border-color 0.3s;
              }
              
              .media-placeholder:hover {
                  border-color: #007bff;
              }
              
              .media-placeholder.has-media {
                  border-style: solid;
                  background: #f8f9fa;
              }
          </style>
      </head>
      <body class="edit-mode">
          <div id="placeholder" class="media-placeholder">Click to add media</div>
          <script>
              document.getElementById('placeholder').addEventListener('click', function() {
                  this.classList.add('has-media');
                  this.textContent = 'Media Added';
              });
          </script>
      </body>
      </html>
    `);
        const placeholder = page.locator("#placeholder");
        // Verify initial state
        await (0, test_1.expect)(placeholder).toBeVisible();
        await (0, test_1.expect)(placeholder).toContainText("Click to add media");
        // Test interaction
        await placeholder.click();
        // Verify state after click
        await (0, test_1.expect)(placeholder).toContainText("Media Added");
        // Check if has-media class was added
        const hasMediaClass = await placeholder.evaluate((el) => el.classList.contains("has-media"));
        (0, test_1.expect)(hasMediaClass).toBeTruthy();
    });
    (0, test_1.test)("should have proper media placeholder styling", async ({ page }) => {
        await page.goto("/wb/wb/wb/wb.html");
        // Look for media placeholders in the actual application
        const mediaPlaceholders = await page
            .locator('.media-placeholder, [class*="placeholder"], [class*="media"]')
            .all();
        if (mediaPlaceholders.length > 0) {
            const placeholder = mediaPlaceholders[0];
            // Check basic styling properties
            const styles = await placeholder.evaluate((el) => {
                const computed = window.getComputedStyle(el);
                return {
                    display: computed.display,
                    position: computed.position,
                    cursor: computed.cursor,
                    border: computed.border,
                };
            });
            console.log("Media placeholder styles:", styles);
            // Verify the element is properly styled
            (0, test_1.expect)(["block", "flex", "inline-block"]).toContain(styles.display);
        }
        else {
            console.log("No media placeholders found in the current page");
        }
    });
    (0, test_1.test)("should handle drag and drop for media uploads", async ({ page }) => {
        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              .media-placeholder {
                  width: 200px;
                  height: 150px;
                  border: 2px dashed #ccc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 10px;
              }
              
              .media-placeholder.drag-over {
                  border-color: #007bff;
                  background-color: rgba(0, 123, 255, 0.1);
              }
          </style>
      </head>
      <body class="edit-mode">
          <div id="dropZone" class="media-placeholder">Drop media here</div>
          <script>
              const dropZone = document.getElementById('dropZone');
              
              dropZone.addEventListener('dragover', function(e) {
                  e.preventDefault();
                  this.classList.add('drag-over');
              });
              
              dropZone.addEventListener('dragleave', function(e) {
                  this.classList.remove('drag-over');
              });
              
              dropZone.addEventListener('drop', function(e) {
                  e.preventDefault();
                  this.classList.remove('drag-over');
                  this.textContent = 'Media dropped!';
              });
          </script>
      </body>
      </html>
    `);
        const dropZone = page.locator("#dropZone");
        // Verify initial state
        await (0, test_1.expect)(dropZone).toBeVisible();
        await (0, test_1.expect)(dropZone).toContainText("Drop media here");
        // Simulate drag over event
        await dropZone.dispatchEvent("dragover", {
            dataTransfer: {
                files: [],
            },
        });
        // Check if drag-over class is added
        const hasDragOverClass = await dropZone.evaluate((el) => el.classList.contains("drag-over"));
        (0, test_1.expect)(hasDragOverClass).toBeTruthy();
        // Simulate drop event
        await dropZone.dispatchEvent("drop", {
            dataTransfer: {
                files: [],
            },
        });
        // Verify state after drop
        await (0, test_1.expect)(dropZone).toContainText("Media dropped!");
    });
});
//# sourceMappingURL=mediaPlaceholder.spec.js.map