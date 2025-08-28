import { test, expect } from "@playwright/test";

test("Dynamic pages should be positioned within main-content", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/wb/wb/wb/wb.html");

  // Wait for page to be fully loaded
  await page.waitForSelector("#main-content", { state: "attached" });

  // Click on a navigation link to create a dynamic page if it doesn't exist
  await page.click("#nav-link-2"); // Click on About link

  // Wait for the dynamic page to be created
  await page.waitForSelector("#about", { state: "attached" });

  // Get the parent element of the dynamic page
  const parentOfDynamicPage = await page.$eval(
    "#about",
    (el) => el.parentElement.id
  );

  // Check if the dynamic page is properly positioned within main-content
  expect(parentOfDynamicPage).toBe("main-content");

  // Check all dynamic pages to ensure they're in the main content
  const dynamicPagesCount = await page.$$eval(
    ".dynamic-page",
    (elements) => elements.length
  );
  const dynamicPagesInMainContent = await page.$$eval(
    "#main-content > .dynamic-page",
    (elements) => elements.length
  );

  // All dynamic pages should be direct children of main-content
  expect(dynamicPagesCount).toEqual(dynamicPagesInMainContent);

  // Test creating another page and check its position
  await page.click("#nav-link-3"); // Click on Services link
  await page.waitForSelector("#services", { state: "attached" });

  const servicesSectionParent = await page.$eval(
    "#services",
    (el) => el.parentElement.id
  );
  expect(servicesSectionParent).toBe("main-content");
});

// Test observer functionality
test("MutationObserver should move dynamically added sections to main-content", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/wb/wb/wb/wb.html");

  // Wait for page to load
  await page.waitForSelector("#main-content", { state: "attached" });

  // Create a new section directly in the body using JavaScript
  await page.evaluate(() => {
    const newSection = document.createElement("section");
    newSection.id = "test-section";
    newSection.className = "dynamic-page";
    newSection.textContent = "Test Section";
    document.body.appendChild(newSection);
  });

  // Wait a bit for the observer to do its job
  await page.waitForTimeout(500);

  // Check if the section was moved to main-content
  const sectionParent = await page.$eval(
    "#test-section",
    (el) => el.parentElement.id
  );
  expect(sectionParent).toBe("main-content");
});
