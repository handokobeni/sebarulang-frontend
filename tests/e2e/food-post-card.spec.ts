import { test, expect } from "@playwright/test";

test.describe("Food Post Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for posts to load
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
  });

  test("should display post information correctly", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();

    // Check post title
    await expect(firstCard.getByText("Nasi Goreng Spesial")).toBeVisible();

    // Check post description
    await expect(firstCard.getByText(/Nasi goreng sisa acara/i)).toBeVisible();

    // Check location
    await expect(firstCard.getByText(/Jakarta/i)).toBeVisible();

    // Check posted time
    await expect(firstCard.getByText(/menit yang lalu|jam yang lalu/i)).toBeVisible();

    // Check quantity
    await expect(firstCard.getByText(/porsi|kg|potong/i)).toBeVisible();

    // Check giver name
    await expect(firstCard.getByText("Budi Santoso")).toBeVisible();

    // Check status badge
    await expect(firstCard.getByText(/Tersedia|Sudah Diambil/i)).toBeVisible();

    // Check category badge
    await expect(firstCard.getByText(/Makanan Berat|Buah & Sayur|Roti & Kue/i)).toBeVisible();
  });

  test("should like and unlike a post", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    
    // Find like button by finding button with Heart icon
    const buttons = await firstCard.locator('button').all();
    let likeButton = null;
    
    for (const btn of buttons) {
      const svg = btn.locator('svg');
      if (await svg.count() > 0) {
        const svgClass = await svg.first().getAttribute('class');
        if (svgClass?.includes('lucide-heart')) {
          likeButton = btn;
          break;
        }
      }
    }
    
    if (likeButton) {
      // Click like button
      await likeButton.click();
      
      // Wait for like action to complete
      await page.waitForTimeout(500);
      
      // Click again to unlike
      await likeButton.click();
      await page.waitForTimeout(500);
    }
  });

  test("should open contact dialog when contact button is clicked", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    
    // Find and click contact button
    const contactButton = firstCard.getByRole("button", { name: /Hubungi/i });
    
    // Wait for button to be visible
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    await contactButton.click();
    
    // Wait for dialog root to appear first
    await page.waitForSelector('[data-slot="dialog-root"]', { timeout: 10000 });
    
    // Then wait for dialog content
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Check dialog is visible - use data-slot selector
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible();
    await expect(dialogTitle).toContainText("Hubungi Giver");
    
    // Scope checks to dialog content to avoid strict mode violations
    const dialogContent = page.locator('[data-slot="dialog-content"]');
    await expect(dialogContent.getByText("Nasi Goreng Spesial")).toBeVisible();
    await expect(dialogContent.getByText("Budi Santoso").first()).toBeVisible();
    
    // Close dialog
    const closeButton = page.getByRole("button", { name: /Close/i }).first();
    await closeButton.click();
    
    // Wait for dialog to close - check that dialog root is gone
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'hidden',
      timeout: 5000 
    }).catch(() => {
      // If selector fails, dialog is already gone
    });
    
    const dialogRoot = page.locator('[data-slot="dialog-root"]');
    await expect(dialogRoot).not.toBeVisible();
  });

  test("should navigate to post detail page when detail button is clicked", async ({ page }) => {
    const firstCard = page.locator('[data-slot="card"]').first();
    
    // Find and click detail button
    const detailButton = firstCard.getByRole("button", { name: /Detail/i });
    await detailButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(500);
    
    // Check that we're on detail page
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
    await expect(page.getByRole("button", { name: /Kembali ke Feed/i })).toBeVisible();
    
    // Check detail page content
    await expect(page.getByText(/Deskripsi/i)).toBeVisible();
    await expect(page.getByText(/Kategori/i)).toBeVisible();
    await expect(page.getByText(/Tips Pengambilan Makanan/i)).toBeVisible();
  });

  test("should not show contact button for claimed posts", async ({ page }) => {
    // Find a claimed post (if exists in mock data)
    const claimedPost = page.locator('[data-slot="card"]').filter({ 
      hasText: "Sudah Diambil" 
    }).first();
    
    if (await claimedPost.isVisible()) {
      // Contact button should not be visible
      await expect(claimedPost.getByRole("button", { name: /Hubungi/i })).not.toBeVisible();
    }
  });
});

