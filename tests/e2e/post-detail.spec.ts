import { test, expect } from "@playwright/test";

test.describe("Post Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for posts to load
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
    
    // Navigate to detail page
    const firstCard = page.locator('[data-slot="card"]').first();
    const detailButton = firstCard.getByRole("button", { name: /Detail/i });
    await detailButton.click();
    
    // Wait for detail page to load
    await page.waitForTimeout(500);
  });

  test("should display all post details", async ({ page }) => {
    // Wait for detail page to fully load
    await page.waitForTimeout(500);
    
    // Check title
    await expect(page.getByRole("heading", { name: "Nasi Goreng Spesial" })).toBeVisible();

    // Check posted time
    await expect(page.getByText(/30 menit yang lalu/i)).toBeVisible();

    // Check giver name - appears in info card
    await expect(page.getByText("Budi Santoso")).toBeVisible();

    // Check quantity - appears in info card
    await expect(page.getByText("8-10 porsi")).toBeVisible();

    // Check location - appears in info card
    await expect(page.getByText("Jakarta Selatan, Kebayoran Baru")).toBeVisible();

    // Check description section
    await expect(page.getByText(/Deskripsi/i)).toBeVisible();
    await expect(page.getByText(/Nasi goreng sisa acara/i)).toBeVisible();

    // Check category section
    await expect(page.getByText(/Kategori/i)).toBeVisible();
    await expect(page.getByText("Makanan Berat")).toBeVisible();

    // Check tips section
    await expect(page.getByText(/Tips Pengambilan Makanan/i)).toBeVisible();
    await expect(page.getByText(/Hubungi pemberi makanan terlebih dahulu/i)).toBeVisible();

    // Check impact section
    await expect(page.getByText(/Dampak Berbagi Makanan/i)).toBeVisible();
  });

  test("should navigate back to feed", async ({ page }) => {
    // Click back button - wait for it to be visible first
    const backButton = page.getByRole("button", { name: /Kembali ke Feed/i });
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await backButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Check that we're back on homepage
    await expect(page.getByText(/Makanan Dibagikan/i)).toBeVisible();
    await expect(page.getByText("Nasi Goreng Spesial")).toBeVisible();
  });

  test("should like and unlike post from detail page", async ({ page }) => {
    // Wait for detail page to load
    await page.waitForTimeout(500);
    
    // Find like button - it's in the header actions area, before share button
    // Look for button that contains Heart icon (lucide-heart)
    const allButtons = await page.locator('button').all();
    let foundLikeButton = null;
    
    for (const btn of allButtons) {
      const svg = btn.locator('svg');
      if (await svg.count() > 0) {
        // Check if SVG has Heart icon - lucide-heart class
        const svgElement = svg.first();
        const className = await svgElement.getAttribute('class') || '';
        
        // Heart icon from lucide-react has class containing 'lucide-heart'
        // Check if button is visible and contains Heart icon
        const isVisible = await btn.isVisible().catch(() => false);
        if (isVisible && className.includes('lucide-heart')) {
          foundLikeButton = btn;
          break;
        }
      }
    }
    
    // Like button should always be visible on detail page
    expect(foundLikeButton).not.toBeNull();
    
    if (foundLikeButton) {
      // Wait for button to be stable
      await foundLikeButton.waitFor({ state: 'visible' });
      
      // Click like
      await foundLikeButton.click();
      await page.waitForTimeout(500);
      
      // Click unlike
      await foundLikeButton.click();
      await page.waitForTimeout(500);
    }
  });

  test("should open contact dialog from detail page", async ({ page }) => {
    // First, verify we're on detail page with an available post
    // The first post in mock data should be "Nasi Goreng Spesial" with status "available"
    await expect(page.getByRole("heading", { name: "Nasi Goreng Spesial" })).toBeVisible();
    
    // Find contact button - it should be visible for available posts
    const contactButton = page.getByRole("button", { name: /Hubungi Pemberi Makanan/i });
    
    // Wait for button to be visible (post should be available)
    await expect(contactButton).toBeVisible({ timeout: 5000 });
    
    // Click button - this should trigger handleContactGiver which sets contactDialogOpen to true
    await contactButton.click();
    
    // Wait for dialog to appear - ContactDialog is rendered in page.tsx, so it should appear
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'visible',
      timeout: 10000 
    });
    
    // Wait for dialog title
    await page.waitForSelector('[data-slot="dialog-title"]', { timeout: 10000 });
    
    // Verify dialog is visible
    const dialogTitle = page.locator('[data-slot="dialog-title"]');
    await expect(dialogTitle).toBeVisible({ timeout: 10000 });
    await expect(dialogTitle).toContainText("Hubungi Giver");
    
    // Verify dialog content - use dialog container to scope the search
    const dialogContent = page.locator('[data-slot="dialog-content"]');
    await expect(dialogContent.getByText("Nasi Goreng Spesial")).toBeVisible();
    // Use .first() to avoid strict mode violation (Budi Santoso appears in paragraph and button)
    await expect(dialogContent.getByText("Budi Santoso").first()).toBeVisible();
    
    // Close dialog - use data-slot selector
    const closeButton = page.locator('[data-slot="dialog-close"]');
    await closeButton.click();
    
    // Wait for dialog to close
    await page.waitForTimeout(1000);
    
    // Wait for dialog root to be hidden
    await page.waitForSelector('[data-slot="dialog-root"]', { 
      state: 'hidden',
      timeout: 5000 
    }).catch(() => {
      // If selector fails, dialog is already gone
    });
    
    // Verify dialog is closed
    await expect(dialogTitle).not.toBeVisible({ timeout: 5000 });
  });

  test("should display status badge correctly", async ({ page }) => {
    // Check for available badge
    const statusBadge = page.getByText(/Tersedia|Sudah Diambil/i).first();
    await expect(statusBadge).toBeVisible();
  });

  test("should show info cards with icons", async ({ page }) => {
    // Check info cards are visible
    await expect(page.getByText("Dibagikan oleh")).toBeVisible();
    await expect(page.getByText("Jumlah")).toBeVisible();
    await expect(page.getByText("Lokasi")).toBeVisible();
  });

  test("should handle share button click", async ({ page }) => {
    // Mock navigator.share and clipboard
    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).navigator.share = async () => {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).navigator.clipboard = {
        writeText: async () => {},
      };
    });
    
    // Alternative: find by SVG class
    const shareButtons = page.locator('button').all();
    let foundShareButton = false;
    
    for (const btn of await shareButtons) {
      const svg = btn.locator('svg');
      if (await svg.count() > 0) {
        const svgClass = await svg.first().getAttribute('class');
        if (svgClass?.includes('lucide-share')) {
          await btn.click();
          foundShareButton = true;
          break;
        }
      }
    }
    
    if (foundShareButton) {
      await page.waitForTimeout(500);
    }
  });
});

