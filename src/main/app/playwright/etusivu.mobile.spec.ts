import { devices, expect, test } from '@playwright/test';

import { setupCommonTest } from './test-tools';

test.use({ ...devices['Galaxy S9+'] });

test.describe('Etusivu (mobiili)', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });

  test('Footer should not overlap main content on mobile', async ({ page }) => {
    await page.goto('/konfo/fi');
    // eslint-disable-next-line playwright/no-networkidle
    await page.waitForLoadState('networkidle');

    const mainContent = page.locator('#app-main-content');
    const footer = page.getByRole('contentinfo');

    const mainBox = await mainContent.boundingBox();
    const footerBox = await footer.boundingBox();

    expect(mainBox).not.toBeNull();
    expect(footerBox).not.toBeNull();

    expect(footerBox!.y).toBeGreaterThanOrEqual(mainBox!.y + mainBox!.height);
  });
});
