import { test, expect } from "@playwright/test";

test.describe("Contact Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
  });

  test("should open dialog when contact button is clicked", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check dialog is open - use data-slot selector
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible();
    await expect(dialogTitle).toContainText("Hubungi Giver");
  });

  test("should display post information in dialog", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Scope all checks to dialog content to avoid strict mode violations
    const dialogContent = page.locator('[data-slot="dialog-content"]');
    
    // Check all information is displayed
    await expect(dialogContent.getByText("Makanan:")).toBeVisible();
    await expect(dialogContent.getByText("Nasi Goreng Spesial")).toBeVisible();
    
    await expect(dialogContent.getByText("Giver:")).toBeVisible();
    await expect(dialogContent.getByText("Budi Santoso").first()).toBeVisible();
    
    await expect(dialogContent.getByText("Lokasi:")).toBeVisible();
    await expect(dialogContent.getByText(/Jakarta/i)).toBeVisible();
  });

  test("should display tips in dialog", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check tips are displayed - use the actual text from ContactDialog component
    const dialogContent = page.locator('[data-slot="dialog-content"]');
    await expect(
      dialogContent.getByText(/Untuk menghubungi giver, kamu bisa mengirim pesan langsung/i)
    ).toBeVisible();
  });

  test("should close dialog when close button is clicked", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check dialog is open
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible();
    
    // Close dialog - use data-slot selector for close button
    const closeButton = page.locator('[data-slot="dialog-close"]');
    await closeButton.click();
    await page.waitForTimeout(1000);
    
    // Check dialog is closed - wait for dialog root to be hidden
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'hidden',
      timeout: 5000 
    }).catch(() => {
      // If selector fails, dialog is already gone
    });
    
    await expect(dialogTitle).not.toBeVisible();
  });

  test("should close dialog when overlay is clicked", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check dialog is open
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible();
    
    // Click on overlay (outside dialog content)
    const overlay = page.locator('[data-slot="dialog-overlay"]');
    await expect(overlay).toBeVisible();
    await overlay.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(1000);
    
    // Check dialog is closed - wait for dialog root to be hidden
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'hidden',
      timeout: 5000 
    }).catch(() => {
      // If selector fails, dialog is already gone
    });
    
    await expect(dialogTitle).not.toBeVisible();
  });

  test("should send message when send button is clicked", async ({ page }) => {
    // Mock alert
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Menghubungi");
      await dialog.accept();
    });

    const firstCard = page.locator('[data-slot="card"]').first();
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check dialog is open
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible();
    
    // Click send message button - button text is "Kirim Pesan ke {giverName}"
    const sendButton = page.getByRole("button", { name: /Kirim Pesan/i });
    await expect(sendButton).toBeVisible();
    await sendButton.click();
    
    // Dialog should close after sending
    await page.waitForTimeout(1000);
    
    // Wait for dialog root to be hidden
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'hidden',
      timeout: 5000 
    }).catch(() => {
      // If selector fails, dialog is already gone
    });
    
    await expect(dialogTitle).not.toBeVisible();
  });
});

