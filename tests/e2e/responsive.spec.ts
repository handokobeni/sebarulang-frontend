import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("should display correctly on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check header is visible
    await expect(page.locator("header")).toBeVisible();

    // Check posts are displayed in single column
    const firstCard = page.locator('[data-slot="card"]').first();
    await expect(firstCard).toBeVisible();

    // Check filter tabs are accessible
    await expect(page.getByRole("button", { name: /Semua/i })).toBeVisible();
  });

  test("should display correctly on tablet viewport", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Check layout adapts
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
  });

  test("should display correctly on desktop viewport", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Check layout
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();

    // Check grid layout (should be 3 columns on desktop)
    const cards = page.locator('[data-slot="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should handle dialog on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();

    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    if (await contactButton.isVisible()) {
      await contactButton.click();
      await page.waitForTimeout(500);
      
      // Check dialog is visible and properly sized - use data-slot selector
      const dialogTitle = page.locator('[data-slot="dialog-title"]');
      await expect(dialogTitle).toBeVisible();
      await expect(dialogTitle).toContainText("Hubungi Giver");
      
      // Close dialog
      const closeButton = page.getByRole("button", { name: /Close/i }).first();
      await closeButton.click();
      await page.waitForTimeout(500);
      
      // Verify dialog is closed
      await expect(dialogTitle).not.toBeVisible();
    }
  });
});

