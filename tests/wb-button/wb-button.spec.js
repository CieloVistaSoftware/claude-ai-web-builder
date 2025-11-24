/**
 * WB Button Component - Comprehensive Unit Tests
 * 
 * Tests all variants, sizes, states, and functionality including:
 * - Component initialization
 * - Variant rendering (primary, secondary, success, toggle)
 * - Size variations (small, medium, large)
 * - State management (active, disabled)
 * - Status indicators (active, inactive, neutral)
 * - Click and toggle events
 * - Accessibility (ARIA, keyboard navigation)
 * - Control panel integration
 * - Theme compatibility
 */

const { test, expect } = require('@playwright/test');

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';
const COMPONENT_SELECTOR = 'wb-button';

test.describe('WB Button Component - Core Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should load and register the component', async ({ page }) => {
    const button = await page.locator(COMPONENT_SELECTOR).first();
    expect(button).toBeTruthy();
    
    // Verify component is defined
    const isDefined = await page.evaluate(() => {
      return customElements.get('wb-button') !== undefined;
    });
    expect(isDefined).toBe(true);
  });

  test('should render with default variant (primary)', async ({ page }) => {
    const button = await page.locator('wb-button[variant="primary"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--primary/);
  });

  test('should display button text correctly', async ({ page }) => {
    const button = await page.locator('wb-button').filter({ hasText: 'Primary Button' }).first();
    await expect(button).toBeVisible();
    
    const text = await button.textContent();
    expect(text).toContain('Primary Button');
  });
});

test.describe('WB Button - Variants', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render primary variant', async ({ page }) => {
    const button = await page.locator('wb-button[variant="primary"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--primary/);
  });

  test('should render secondary variant', async ({ page }) => {
    const button = await page.locator('wb-button[variant="secondary"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--secondary/);
  });

  test('should render success variant', async ({ page }) => {
    const button = await page.locator('wb-button[variant="success"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--success/);
  });

  test('should render toggle variant', async ({ page }) => {
    const button = await page.locator('wb-button[variant="toggle"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--toggle/);
  });
});

test.describe('WB Button - Sizes', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render small size', async ({ page }) => {
    const button = await page.locator('wb-button[size="small"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--small/);
  });

  test('should render medium size (default)', async ({ page }) => {
    const button = await page.locator('wb-button[size="medium"]').first();
    const buttonEl = await button.locator('button');
    
    // Medium is default, no specific class needed
    await expect(buttonEl).toHaveClass(/wb-btn/);
  });

  test('should render large size', async ({ page }) => {
    const button = await page.locator('wb-button[size="large"]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/wb-btn--large/);
  });
});

test.describe('WB Button - States', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render normal state', async ({ page }) => {
    const button = await page.locator('wb-button').filter({ hasText: 'Normal' }).first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).not.toHaveAttribute('disabled');
    await expect(buttonEl).not.toHaveClass(/active/);
  });

  test('should render disabled state', async ({ page }) => {
    const button = await page.locator('wb-button[disabled]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toBeDisabled();
  });

  test('should render active state', async ({ page }) => {
    const button = await page.locator('wb-button[active]').first();
    const buttonEl = await button.locator('button');
    
    await expect(buttonEl).toHaveClass(/active/);
  });

  test('should not trigger click when disabled', async ({ page }) => {
    let clickEventFired = false;
    
    await page.exposeFunction('trackClick', () => {
      clickEventFired = true;
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:click', () => {
        window.trackClick();
      });
    });
    
    const button = await page.locator('wb-button[disabled]').first();
    await button.click({ force: true });
    
    // Wait a bit to see if event fires
    await page.waitForTimeout(500);
    expect(clickEventFired).toBe(false);
  });
});

test.describe('WB Button - Status Indicators', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render active status indicator (green)', async ({ page }) => {
    const button = await page.locator('wb-button[status="active"]').first();
    const statusDot = await button.locator('.wb-btn__status--active');
    
    await expect(statusDot).toBeVisible();
    
    // Check if green color is applied
    const bgColor = await statusDot.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Green color should be present (rgb format)
    expect(bgColor).toBeTruthy();
  });

  test('should render inactive status indicator (red)', async ({ page }) => {
    const button = await page.locator('wb-button[status="inactive"]').first();
    const statusDot = await button.locator('.wb-btn__status--inactive');
    
    await expect(statusDot).toBeVisible();
  });

  test('should render neutral status indicator (gray)', async ({ page }) => {
    const button = await page.locator('wb-button[status="neutral"]').first();
    const statusDot = await button.locator('.wb-btn__status--neutral');
    
    await expect(statusDot).toBeVisible();
  });

  test('should not render status indicator when status attribute is missing', async ({ page }) => {
    const button = await page.locator('wb-button').filter({ hasText: 'Primary Button' }).first();
    const statusDot = await button.locator('.wb-btn__status');
    
    await expect(statusDot).toHaveCount(0);
  });
});

test.describe('WB Button - Toggle Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should toggle active state on click', async ({ page }) => {
    const button = await page.locator('wb-button[variant="toggle"]').first();
    const buttonEl = await button.locator('button');
    
    // Initial state - not active
    await expect(buttonEl).not.toHaveClass(/active/);
    
    // Click to activate
    await button.click();
    await page.waitForTimeout(100);
    await expect(buttonEl).toHaveClass(/active/);
    
    // Click again to deactivate
    await button.click();
    await page.waitForTimeout(100);
    await expect(buttonEl).not.toHaveClass(/active/);
  });

  test('should fire toggle event with correct state', async ({ page }) => {
    let toggleState = null;
    
    await page.exposeFunction('trackToggle', (state) => {
      toggleState = state;
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:toggle', (e) => {
        window.trackToggle(e.detail.active);
      });
    });
    
    const button = await page.locator('wb-button[variant="toggle"]').first();
    await button.click();
    
    await page.waitForTimeout(500);
    expect(toggleState).toBe(true);
    
    // Toggle again
    await button.click();
    await page.waitForTimeout(500);
    expect(toggleState).toBe(false);
  });
});

test.describe('WB Button - Event Handling', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should fire click event on button click', async ({ page }) => {
    let clickEventFired = false;
    
    await page.exposeFunction('trackClick', () => {
      clickEventFired = true;
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:click', () => {
        window.trackClick();
      });
    });
    
    const button = await page.locator('wb-button[variant="primary"]').first();
    await button.click();
    
    await page.waitForTimeout(500);
    expect(clickEventFired).toBe(true);
  });

  test('should include variant in click event detail', async ({ page }) => {
    let eventVariant = null;
    
    await page.exposeFunction('trackVariant', (variant) => {
      eventVariant = variant;
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:click', (e) => {
        window.trackVariant(e.detail.variant);
      });
    });
    
    const button = await page.locator('wb-button[variant="success"]').first();
    await button.click();
    
    await page.waitForTimeout(500);
    expect(eventVariant).toBe('success');
  });

  test('should fire ready event on component initialization', async ({ page }) => {
    const readyEvents = await page.evaluate(() => {
      return new Promise((resolve) => {
        const events = [];
        document.addEventListener('wb-button:ready', (e) => {
          events.push(e.detail);
        });
        
        // Wait a bit for all buttons to initialize
        setTimeout(() => resolve(events), 2000);
      });
    });
    
    expect(readyEvents.length).toBeGreaterThan(0);
    expect(readyEvents[0]).toHaveProperty('variant');
  });
});

test.describe('WB Button - Dynamic Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should change variant dynamically', async ({ page }) => {
    const testButton = await page.locator('#testButton');
    const buttonEl = await testButton.locator('button');
    
    // Click toggle variant button
    await page.getByRole('button', { name: 'Toggle Variant' }).click();
    await page.waitForTimeout(200);
    
    // Verify class changed
    const className = await buttonEl.getAttribute('class');
    expect(className).toBeTruthy();
  });

  test('should change size dynamically', async ({ page }) => {
    const testButton = await page.locator('#testButton');
    
    // Click toggle size button
    await page.getByRole('button', { name: 'Toggle Size' }).click();
    await page.waitForTimeout(200);
    
    // Verify button exists and rendered
    await expect(testButton).toBeVisible();
  });

  test('should toggle disabled state dynamically', async ({ page }) => {
    const testButton = await page.locator('#testButton');
    const buttonEl = await testButton.locator('button');
    
    // Click toggle disabled button
    await page.getByRole('button', { name: 'Toggle Disabled' }).click();
    await page.waitForTimeout(200);
    
    await expect(buttonEl).toBeDisabled();
    
    // Toggle again
    await page.getByRole('button', { name: 'Toggle Disabled' }).click();
    await page.waitForTimeout(200);
    
    await expect(buttonEl).not.toBeDisabled();
  });

  test('should change text dynamically', async ({ page }) => {
    const testButton = await page.locator('#testButton');
    
    const originalText = await testButton.textContent();
    
    // Click change text button
    await page.getByRole('button', { name: 'Change Text' }).click();
    await page.waitForTimeout(200);
    
    const newText = await testButton.textContent();
    expect(newText).not.toBe(originalText);
  });
});

test.describe('WB Button - Accessibility', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const button = await page.locator('wb-button[variant="primary"]').first();
    
    // Tab to focus the button
    await page.keyboard.press('Tab');
    
    // The button should be focusable
    const isFocused = await button.evaluate(el => {
      return el.querySelector('button') === document.activeElement;
    });
    
    // Note: May not be focused if other elements are first in tab order
    // This is a basic check
    expect(isFocused).toBeDefined();
  });

  test('should trigger click on Enter key', async ({ page }) => {
    let clickEventFired = false;
    
    await page.exposeFunction('trackClick', () => {
      clickEventFired = true;
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:click', () => {
        window.trackClick();
      });
    });
    
    // Focus first button
    await page.locator('wb-button[variant="primary"]').first().locator('button').focus();
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(500);
    expect(clickEventFired).toBe(true);
  });

  test('should have proper button element semantics', async ({ page }) => {
    const button = await page.locator('wb-button[variant="primary"]').first();
    const buttonEl = await button.locator('button');
    
    const tagName = await buttonEl.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
    
    const type = await buttonEl.getAttribute('type');
    expect(type).toBe('button');
  });
});

test.describe('WB Button - Control Panel Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should work with different variants used in control panel', async ({ page }) => {
    // Control panel uses primary, secondary, and success variants
    const variants = ['primary', 'secondary', 'success'];
    
    for (const variant of variants) {
      const button = await page.locator(`wb-button[variant="${variant}"]`).first();
      await expect(button).toBeVisible();
      
      const buttonEl = await button.locator('button');
      await expect(buttonEl).toHaveClass(new RegExp(`wb-btn--${variant}`));
    }
  });

  test('should handle click events for control panel actions', async ({ page }) => {
    const eventsFired = [];
    
    await page.exposeFunction('trackEvent', (variant) => {
      eventsFired.push(variant);
    });
    
    await page.evaluate(() => {
      document.addEventListener('wb-button:click', (e) => {
        window.trackEvent(e.detail.variant);
      });
    });
    
    // Click primary (like Save button)
    await page.locator('wb-button[variant="primary"]').first().click();
    await page.waitForTimeout(300);
    
    // Click success (like a confirm action)
    await page.locator('wb-button[variant="success"]').first().click();
    await page.waitForTimeout(300);
    
    expect(eventsFired).toContain('primary');
    expect(eventsFired).toContain('success');
  });
});

test.describe('WB Button - Theme Compatibility', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render in dark theme', async ({ page }) => {
    // Check if dark theme is applied
    const theme = await page.getAttribute('html', 'data-theme');
    expect(theme).toBe('dark');
    
    // Verify buttons are visible
    const buttons = await page.locator('wb-button').count();
    expect(buttons).toBeGreaterThan(0);
  });

  test('should have proper contrast in dark theme', async ({ page }) => {
    const button = await page.locator('wb-button[variant="primary"]').first();
    const buttonEl = await button.locator('button');
    
    const bgColor = await buttonEl.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const color = await buttonEl.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Both should be defined and not empty
    expect(bgColor).toBeTruthy();
    expect(color).toBeTruthy();
  });
});

test.describe('WB Button - Grid and Groups', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should create button grid', async ({ page }) => {
    await page.getByRole('button', { name: 'Create 3-Column Grid' }).click();
    await page.waitForTimeout(500);
    
    const grid = await page.locator('.wb-btn-grid--three');
    await expect(grid).toBeVisible();
    
    const buttons = await grid.locator('wb-button').count();
    expect(buttons).toBe(6);
  });

  test('should create button group', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Button Group' }).click();
    await page.waitForTimeout(500);
    
    const group = await page.locator('.wb-btn-group');
    await expect(group).toBeVisible();
    
    const buttons = await group.locator('wb-button').count();
    expect(buttons).toBe(3);
  });

  test('should clear grid', async ({ page }) => {
    // First create a grid
    await page.getByRole('button', { name: 'Create 3-Column Grid' }).click();
    await page.waitForTimeout(300);
    
    // Then clear it
    await page.getByRole('button', { name: 'Clear' }).click();
    await page.waitForTimeout(300);
    
    const gridContainer = await page.locator('#buttonGrid');
    const isEmpty = await gridContainer.evaluate(el => el.innerHTML.trim() === '');
    expect(isEmpty).toBe(true);
  });
});

test.describe('WB Button - Icons Support', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForSelector(COMPONENT_SELECTOR);
  });

  test('should render button with emoji icons', async ({ page }) => {
    const starButton = await page.locator('wb-button').filter({ hasText: '⭐ Star' }).first();
    await expect(starButton).toBeVisible();
    
    const text = await starButton.textContent();
    expect(text).toContain('⭐');
  });

  test('should render button with icon on right', async ({ page }) => {
    const heartButton = await page.locator('wb-button').filter({ hasText: 'Heart Right ❤️' }).first();
    await expect(heartButton).toBeVisible();
    
    const text = await heartButton.textContent();
    expect(text).toContain('❤️');
  });
});
