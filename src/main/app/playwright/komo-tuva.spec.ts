import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('TUVA KOMO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komo-tuva.mocks.json');
  });

  test('renders perustiedot with koulutustyyppi and opintojenlaajuus', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000623');
    await expect(
      page.getByRole('heading', {
        name: 'Tutkintokoulutukseen valmentava koulutus (TUVA)',
      })
    ).toBeVisible();
    await expect(page.getByTestId('koulutustyyppi')).toHaveText(
      'Tutkintokoulutukseen valmentava koulutus (TUVA)'
    );
    await expect(page.getByTestId('opintojenLaajuus')).toHaveText('38 viikkoa');
  });

  test('renders kuvaus without a link to ePerusteet', async ({ page }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000623');
    const kuvaus = page.getByTestId('kuvaus');
    await expect(
      kuvaus.getByRole('heading', { name: 'Koulutuksen kuvaus' })
    ).toBeVisible();
    await expect(kuvaus.getByText('Tämä on kuvaus fi.')).toBeVisible();
    await expect(kuvaus.getByTestId('eperuste-linkki')).toBeHidden();
  });

  test('renders kuvaus with a link to ePerusteet if koulutus has ePerusteid', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000625');
    await expect(page.getByTestId('kuvaus').getByTestId('eperuste-linkki')).toBeVisible();
  });

  test('renders kuvaus with a link to ePerusteet', async ({ page }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000624');
    await expect(page.getByTestId('kuvaus').getByTestId('eperuste-linkki')).toBeVisible();
  });
});
