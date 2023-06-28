import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Kuvaus tooltip KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-kuvaus-tooltip.mocks.json');
  });

  test('Suunniteltu kesto kuvaus KOMOTO renders properly', async ({ page }) => {
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000420');

    await expect(page.getByRole('tooltip')).toBeHidden();

    const suunniteltuKestoContainer = page
      .getByText('Suunniteltu kesto')
      .locator('xpath=../..');

    await suunniteltuKestoContainer
      .getByRole('button', { name: 'Näytä lisätiedot' })
      .click(); //Lisätietoa-nappi

    const tooltipLink = suunniteltuKestoContainer.getByRole('tooltip').getByRole('link');
    await expect(tooltipLink).toHaveAttribute('target', '_blank');
    await expect(tooltipLink).toHaveAttribute('href', 'https://oph.fi');
  });
});
