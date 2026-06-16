import { devices, expect, test } from '@playwright/test';

import { setupCommonTest } from './test-tools';

test.use({ ...devices['Galaxy S9+'] });

test.describe('Etusivu (mobiili)', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });

  test('Footer should not overlap main content on mobile', async ({ page }) => {
    await page.goto('/konfo/fi');

    const mainContent = page.locator('#app-main-content');
    const footer = page.getByRole('contentinfo');

    await expect(mainContent).toBeVisible();
    await expect(footer).toBeVisible();

    const mainBox = await mainContent.boundingBox();
    const footerBox = await footer.boundingBox();

    expect(footerBox!.y).toBeGreaterThanOrEqual(mainBox!.y + mainBox!.height);
  });
});
