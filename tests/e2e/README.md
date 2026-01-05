# End-to-End Tests

This directory contains end-to-end tests for the sebarulang application using Playwright.

## Test Files

- **homepage.spec.ts** - Tests for the homepage including:
  - Display of all sections (header, stats, mission banner, filter tabs, footer)
  - Food post cards display
  - Category filtering
  - Search functionality
  - Empty states

- **food-post-card.spec.ts** - Tests for food post card component:
  - Post information display
  - Like/unlike functionality
  - Contact dialog opening
  - Navigation to detail page
  - Claimed post handling

- **post-detail.spec.ts** - Tests for post detail page:
  - All post details display
  - Navigation back to feed
  - Like/unlike from detail page
  - Contact dialog from detail page
  - Status badges and info cards
  - Share functionality

- **contact-dialog.spec.ts** - Tests for contact dialog:
  - Dialog opening and closing
  - Post information display
  - Tips display
  - Send message functionality

- **navigation.spec.ts** - Tests for navigation:
  - Navigation between pages
  - Browser back button handling
  - Scroll position maintenance

- **responsive.spec.ts** - Tests for responsive design:
  - Mobile viewport (375x667)
  - Tablet viewport (768x1024)
  - Desktop viewport (1920x1080)
  - Dialog behavior on mobile

## Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests in UI mode
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e tests/e2e/homepage.spec.ts

# Run tests in specific browser
pnpm test:e2e --project=chromium
```

## Test Configuration

Tests are configured in `playwright.config.ts`. The configuration includes:
- Multiple browser projects (Chromium, Firefox, WebKit)
- Mobile viewports (Pixel 5, iPhone 12)
- Automatic server startup
- Screenshots on failure
- Trace on first retry

## Best Practices

1. **Wait for elements**: Always wait for elements to be visible before interacting
2. **Use data attributes**: Prefer `data-slot` attributes for stable selectors
3. **Handle async operations**: Use `waitForTimeout` for animations and transitions
4. **Test user flows**: Focus on complete user journeys rather than isolated interactions
5. **Responsive testing**: Test on multiple viewport sizes

