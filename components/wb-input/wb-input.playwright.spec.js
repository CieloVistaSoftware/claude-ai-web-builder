import { test, expect } from '@playwright/test';

test.describe('wb-input', () => {
  test('renders with correct structure', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Name" placeholder="Enter your name" required></wb-input>
    `);
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('wb-input')).toBeVisible();
    await expect(page.locator('.wb-input__label')).toContainText('Name');
    await expect(page.locator('.wb-input__field')).toHaveAttribute('placeholder', 'Enter your name');
  });

  test('handles type attribute correctly', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input type="email" label="Email"></wb-input>
    `);
    
    await page.waitForTimeout(500);
    await expect(page.locator('.wb-input__field')).toHaveAttribute('type', 'email');
  });

  test('updates value on user input', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Input"></wb-input>
    `);
    
    await page.waitForTimeout(500);
    const input = page.locator('.wb-input__field');
    await input.fill('test value');
    await expect(input).toHaveValue('test value');
  });

  test('adds focused class on focus', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Focus Test"></wb-input>
    `);
    
    await page.waitForTimeout(500);
    const input = page.locator('.wb-input__field');
    await input.focus();
    await expect(page.locator('wb-input')).toHaveClass(/focused/);
  });

  test('respects disabled attribute', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Disabled" disabled></wb-input>
    `);
    
    await page.waitForTimeout(500);
    await expect(page.locator('.wb-input__field')).toBeDisabled();
  });

  test('displays help text when provided', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Input" help="This is help text"></wb-input>
    `);
    
    await page.waitForTimeout(500);
    await expect(page.locator('.wb-input__help')).toContainText('This is help text');
  });

  test('shows required indicator when required', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Required Field" required></wb-input>
    `);
    
    await page.waitForTimeout(500);
    await expect(page.locator('.wb-input__required')).toBeVisible();
    await expect(page.locator('.wb-input__required')).toContainText('*');
  });

  test('initializes with value attribute', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    
    await page.setContent(`
      <script type="module">
        await import('http://localhost:8080/components/wb-input/wb-input.js');
      </script>
      <wb-input label="Test" value="initial value"></wb-input>
    `);
    
    await page.waitForTimeout(500);
    await expect(page.locator('.wb-input__field')).toHaveValue('initial value');
  });
});
