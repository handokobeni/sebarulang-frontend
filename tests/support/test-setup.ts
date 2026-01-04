/**
 * Test Setup for E2E Tests
 * Shared setup for Playwright tests
 */

import { Page } from "@playwright/test";

// This will be set by Playwright test runner
export let page: Page;

// Export page setter for Playwright
export function setPage(p: Page) {
  page = p;
}

