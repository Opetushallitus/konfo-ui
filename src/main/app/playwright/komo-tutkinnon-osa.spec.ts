import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Tutkinnon osa KOMO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komo-tutkinnon-osa.mocks.json');
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000622');
  });

  test('Tutkinnon osa KOMO renders properly', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(
      '(testi) Hevosten hyvinvoinnista huolehtiminen'
    );
    await expect(page.getByTestId('koulutustyyppi')).toHaveText('Tutkinnon osa');
    await expect(page.getByText('25 + 20 osaamispistettä')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Hevosten hyvinvoinnista huolehtiminen' })
    ).toHaveAttribute('aria-expanded', 'false');
  });

  test('Tutkinnon osa KOMO kuvaus accordions work', async ({ page }) => {
    await expect(page.locator('a[href*="tutkinnonosat/2449201"]')).toBeHidden();
    await page
      .getByRole('button', { name: 'Hevosten hyvinvoinnista huolehtiminen' })
      .click();

    await expect(page.locator('a[href*="tutkinnonosat/2449201"]')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Hevosten hyvinvoinnista huolehtiminen' })
    ).toHaveAttribute('aria-expanded', 'true');

    await expect(page.locator('a[href*="tutkinnonosat/2569404"]')).toBeHidden();
    await page.getByRole('button', { name: 'Hevosten kouluttaminen' }).click();

    await expect(page.locator('a[href*="tutkinnonosat/2569404"]')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Hevosten kouluttaminen' })
    ).toHaveAttribute('aria-expanded', 'true');
  });
});
