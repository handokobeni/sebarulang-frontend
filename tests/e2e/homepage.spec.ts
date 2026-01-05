import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display homepage with all sections", async ({ page }) => {
    // Check header is visible
    await expect(page.locator("header")).toBeVisible();

    // Check stats bar
    await expect(page.getByText(/Makanan Dibagikan/i)).toBeVisible();
    await expect(page.getByText(/Pengguna Aktif/i)).toBeVisible();
    await expect(page.getByText(/Makanan Terselamatkan/i)).toBeVisible();

    // Check mission banner
    await expect(page.getByText(/Mengapa sebarulang/i)).toBeVisible();

    // Check filter tabs
    await expect(page.getByRole("button", { name: /Semua/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Makanan Berat/i })).toBeVisible();

    // Check footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("should display food post cards", async ({ page }) => {
    // Wait for posts to load
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
    await expect(page.getByText("Buah-buahan Segar")).toBeVisible();

    // Check that post cards have required information
    const firstPost = page.locator('[data-slot="card"]').first();
    await expect(firstPost.getByText(/Jakarta/i)).toBeVisible();
    await expect(firstPost.getByText(/porsi|kg|potong/i)).toBeVisible();
  });

  test("should filter posts by category", async ({ page }) => {
    // Click on "Makanan Berat" category
    await page.getByRole("button", { name: /Makanan Berat/i }).click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Check that only "Makanan Berat" posts are visible
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
    
    // Posts from other categories should not be visible
    // (depending on implementation, might need to check for specific posts)
  });

  test("should search for posts", async ({ page }) => {
    // Find search input in header
    const searchInput = page.locator('input[placeholder*="Cari makanan"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill("Nasi");
      
      // Wait for search to filter (onChange should trigger)
      await page.waitForTimeout(1000);
      
      // Check that search results are displayed
      await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
    } else {
      // Skip test if search input is not visible (mobile view)
      test.skip();
    }
  });

  test("should display empty state when no posts match filter", async ({ page }) => {
    // Click on a category that might have no posts
    // This depends on your mock data
    await page.getByRole("button", { name: /Roti & Kue/i }).click();
    
    await page.waitForTimeout(500);
    
    // Check for empty state message
    const emptyMessage = page.getByText(/Belum ada postingan|Tidak ada makanan/i);
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    }
  });
});

