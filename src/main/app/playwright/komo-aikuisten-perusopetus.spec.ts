import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Aikuisten perusopetus KOMO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komo-aikuisten-perusopetus.mocks.json');
  });

  test('renders perustiedot with koulutustyyppi and opintojenlaajuus', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000002339');
    await expect(
      page.getByRole('heading', { name: 'Aikuisten perusopetus' })
    ).toBeVisible();
    await expect(page.getByLabel('Koulutustyyppi')).toHaveText('Aikuisten perusopetus');
    await expect(page.getByLabel('Koulutuksen laajuus')).toHaveText('18 viikkoa');
  });

  test('renders kuvaus without a link to ePerusteet', async ({ page }) => {
    const kuvaus = page.getByTestId('kuvaus');
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000002339');
    await expect(
      kuvaus.getByRole('heading', { name: 'Koulutuksen kuvaus' })
    ).toBeVisible();
    await expect(kuvaus.getByText('Ihan vaan peruskoulutus')).toBeVisible();
    await expect(
      kuvaus.getByRole('link', { name: 'Lue lisää ePerusteet palvelussa' })
    ).toBeHidden();
  });

  test('renders kuvaus with a link to ePerusteet', async ({ page }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000002340');
    await expect(
      page
        .getByTestId('kuvaus')
        .getByRole('link', { name: 'Lue lisää ePerusteet palvelussa' })
    ).toBeVisible();
  });
});
