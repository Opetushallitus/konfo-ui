import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('AMK KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-amk.mocks.json');
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000002761');
  });

  test('AMK osaamistavoitteet text expands and truncates properly', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Musiikkipedagogi (AMK), Musiikkipedagogin tutkinto-ohjelma',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Koulutuksen Osaamistavoitteet' })
    ).toBeVisible();
    const osaamistavoitteetSection = page.getByLabel('Koulutuksen osaamistavoitteet');
    const osaamistavoitteetTextDiv = osaamistavoitteetSection.locator('div').nth(1);
    const textStart =
      'Tavoitteena on tuottaa sinulle opintosuuntasi mukaan painottuva korkeatasoinen ydinosaaminen';
    const fullTextEnd = 'Curabitur congue quis orci eget sodales.';

    // Text should be truncated initially — "Näytä lisää" button is visible
    const osaamistavoitekuvausNaytaLisaa = osaamistavoitteetSection.getByRole('button', {
      name: 'Näytä lisää',
    });
    await expect(osaamistavoitteetTextDiv).toContainText(textStart);
    await expect(osaamistavoitteetTextDiv).toContainText('...Näytä lisää');
    await expect(osaamistavoitteetTextDiv).not.toContainText(fullTextEnd);

    await osaamistavoitekuvausNaytaLisaa.click();

    // Full text should be visible after expanding
    await expect(osaamistavoitteetTextDiv).toContainText(fullTextEnd);
    await expect(osaamistavoitteetTextDiv).toContainText('Näytä vähemmän');
    await expect(osaamistavoitekuvausNaytaLisaa).toBeHidden();

    const osaamistavoitekuvausNaytaVahemman = osaamistavoitteetSection.getByRole(
      'button',
      {
        name: 'Näytä vähemmän',
      }
    );
    await osaamistavoitekuvausNaytaVahemman.click();

    // Text should be truncated again
    await expect(osaamistavoitteetTextDiv).not.toContainText(fullTextEnd);
    await expect(osaamistavoitekuvausNaytaLisaa).toBeVisible();
  });
});
