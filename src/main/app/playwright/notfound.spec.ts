import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('404 page', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'notfound.mocks.json');
  });

  test('404 when visiting koulutus that does not exist', async ({ page }) => {
    await page.goto('/konfo/fi/koulutus/1231231');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('404 when visiting toteutus that does not exist', async ({ page }) => {
    await page.goto('/konfo/fi/toteutus/1231231');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});
