import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Valintaperuste page', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'valintaperuste.mocks.json');
  });

  test('Valintaperuste-page renders properly', async ({ page }) => {
    await page.goto(
      '/konfo/fi/hakukohde/1.2.246.562.20.00000000000000000191/valintaperuste'
    );

    await expect(page.getByRole('heading', { level: 3, name: /kielikoe/ })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: /Annikan pääsykoe/ })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: /lisäpiste urheilijalle/ })
    ).toBeVisible();
    await page.getByRole('button', { name: /Tilaisuus 1/ }).click();
  });
});
