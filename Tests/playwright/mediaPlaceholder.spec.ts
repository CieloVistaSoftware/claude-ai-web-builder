/**
 * Media Placeholder Tests
 *
 * Converted from MediaPlaceholder.Tests.ps1
 * Tests media placeholder visibility and behavior in different modes
 */

import { test, expect } from "@playwright/test";

test.describe("Media Placeholder Tests", () => {
  test("should show/hide media placeholders based on edit mode", async ({
    page,
  }) => {
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
    await expect(placeholder1).toBeHidden();
    // Placeholder with media should be visible
    await expect(placeholder2).toBeVisible();

    // Test case 2: In edit mode
    await page.evaluate(() => {
      document.body.classList.add("edit-mode");
    });

    // Both placeholders should be visible in edit mode
    await expect(placeholder1).toBeVisible();
    await expect(placeholder2).toBeVisible();
  });

  test("should handle media placeholder interactions", async ({ page }) => {
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
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toContainText("Click to add media");

    // Test interaction
    await placeholder.click();

    // Verify state after click
    await expect(placeholder).toContainText("Media Added");

    // Check if has-media class was added
    const hasMediaClass = await placeholder.evaluate((el) =>
      el.classList.contains("has-media")
    );
    expect(hasMediaClass).toBeTruthy();
  });

  test("should have proper media placeholder styling", async ({ page }) => {
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
      expect(["block", "flex", "inline-block"]).toContain(styles.display);
    } else {
      console.log("No media placeholders found in the current page");
    }
  });

  test("should handle drag and drop for media uploads", async ({ page }) => {
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
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText("Drop media here");

    // Simulate drag over event
    await dropZone.dispatchEvent("dragover", {
      dataTransfer: {
        files: [],
      },
    });

    // Check if drag-over class is added
    const hasDragOverClass = await dropZone.evaluate((el) =>
      el.classList.contains("drag-over")
    );
    expect(hasDragOverClass).toBeTruthy();

    // Simulate drop event
    await dropZone.dispatchEvent("drop", {
      dataTransfer: {
        files: [],
      },
    });

    // Verify state after drop
    await expect(dropZone).toContainText("Media dropped!");
  });
});
