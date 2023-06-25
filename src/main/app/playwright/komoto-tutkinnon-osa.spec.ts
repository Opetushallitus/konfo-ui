import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Tutkinnon osa KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-tutkinnon-osa.mocks.json');
    page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000469');
  });

  test('Tutkinnon osa KOMOTO renders properly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: '(testi) Hevosten hyvinvoinnista huolehtiminen' })
    ).toBeVisible();
    await expect(page.getByText('25 + 20 osaamispistettä')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Ilmoittaudu koulutukseen' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'ilmoittaudu koulutukseen' })
    ).toHaveAttribute('href', 'http://www.google.fi');
  });

  test('Tutkinnon osa KOMO kuvaus accordions work', async ({ page }) => {
    const lisatietoaButton = page.getByRole('button', {
      name: 'Lisätietoa ilmoittautumisesta',
    });
    await expect(lisatietoaButton).toHaveAttribute('aria-expanded', 'false');
    await lisatietoaButton.click();
    await expect(lisatietoaButton).toHaveAttribute('aria-expanded', 'true');
  });
});
