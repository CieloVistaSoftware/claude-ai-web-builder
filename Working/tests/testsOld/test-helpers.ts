// Test helpers for managing UI elements during tests
import { Page } from "@playwright/test";

/**
 * Minimizes the Claude AI panel to prevent interference with tests
 */
export async function minimizeClaudePanel(page: Page): Promise<void> {
  try {
    // Check if Claude AI panel exists and is visible
    const claudePanel = page.locator("#claude-ai-panel");
    if (await claudePanel.isVisible()) {
      // Check if panel is already minimized by looking at content visibility
      const content = page.locator("#claude-ai-panel .claude-panel-content");
      const isContentVisible = await content.isVisible();

      if (isContentVisible) {
        // Panel is expanded, so minimize it
        const toggleBtn = page.locator("#claude-toggle-btn");
        if (await toggleBtn.isVisible()) {
          await toggleBtn.click();
          console.log(
            "✅ Claude AI panel minimized to prevent test interference"
          );
        }
      } else {
        console.log("ℹ️ Claude AI panel already minimized");
      }
    }
  } catch (error) {
    console.log("⚠️ Could not minimize Claude AI panel:", error.message);
  }
}

/**
 * Expands the Claude AI panel back to full view
 */
export async function expandClaudePanel(page: Page): Promise<void> {
  try {
    const claudePanel = page.locator("#claude-ai-panel");
    if (await claudePanel.isVisible()) {
      const content = page.locator("#claude-ai-panel .claude-panel-content");
      const isContentVisible = await content.isVisible();

      if (!isContentVisible) {
        // Panel is minimized, so expand it
        const toggleBtn = page.locator("#claude-toggle-btn");
        if (await toggleBtn.isVisible()) {
          await toggleBtn.click();
          console.log("✅ Claude AI panel expanded");
        }
      }
    }
  } catch (error) {
    console.log("⚠️ Could not expand Claude AI panel:", error.message);
  }
}

/**
 * Completely hides the Claude AI panel by setting display: none
 */
export async function hideClaudePanel(page: Page): Promise<void> {
  try {
    await page.evaluate((): any => {
      const panel = document.getElementById("claude-ai-panel");
      if (panel) {
        panel.style.display = "none";
        console.log("Claude AI panel hidden for test");
      }
    });
  } catch (error) {
    console.log("⚠️ Could not hide Claude AI panel:", error.message);
  }
}

/**
 * Shows the Claude AI panel back to its original state
 */
export async function showClaudePanel(page: Page): Promise<void> {
  try {
    await page.evaluate((): any => {
      const panel = document.getElementById("claude-ai-panel");
      if (panel) {
        panel.style.display = "";
        console.log("Claude AI panel restored");
      }
    });
  } catch (error) {
    console.log("⚠️ Could not show Claude AI panel:", error.message);
  }
}
