import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Osaamisala KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-osaamisala.mocks.json');
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000471');
  });

  test('Osaamisala KOMOTO renders properly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Hevosten kengittämisen osaamisala' })
    ).toBeVisible();
    await expect(page.getByText('100 osaamispistettä')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Ilmoittaudu koulutukseen' })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Ilmoittaudu koulutukseen' })
    ).toHaveAttribute('href', 'http://www.google.fi');
  });

  test('Osamisala KOMO kuvaus accordions work', async ({ page }) => {
    const lisatietoaButton = page.getByRole('button', {
      name: 'Lisätietoa ilmoittautumisesta',
    });
    await expect(lisatietoaButton).toHaveAttribute('aria-expanded', 'false');
    await lisatietoaButton.click();
    await expect(lisatietoaButton).toHaveAttribute('aria-expanded', 'true');
  });
});
