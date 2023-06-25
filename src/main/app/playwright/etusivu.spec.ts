import { expect, test } from '@playwright/test';

import { getSearchButton, getSearchInput, setupCommonTest } from './test-tools';

test.describe('Etusivu', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('Should have cards with working links', async ({ page }) => {
    await page.goto('/konfo');
    await page.locator('a[href*="/sivu/ammatillinen-koulutus"]').click();
    await expect(page.locator('h1')).toContainText('Ammatillinen koulutus');
  });

  test('Should have skip to content link hidden by default', async ({ page }) => {
    test.slow();
    await page.goto('/konfo');
    await expect(page.getByRole('link', { name: 'Siirry sisältöön' })).toBeHidden();
  });

  test('Should pass koulutustyyppi filter selection to haku page', async ({ page }) => {
    await page.route('/konfo-backend/search/oppilaitokset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-oppilaitokset-all.json' });
    });

    await page.route('/konfo-backend/search/koulutukset**', (route) => {
      route.fulfill({ path: 'cypress/fixtures/search-koulutukset-all.json' });
    });

    await page.goto('/konfo');
    await getSearchInput(page).fill('auto');
    await page.getByRole('button', { name: /^Rajaa/ }).click();
    await page.getByTestId('valitse_koulutustyyppi').click();
    await page.getByRole('checkbox', { name: 'Lukiokoulutus' }).check();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await getSearchButton(page).click();
    await page.waitForURL(
      new RegExp('/konfo/fi/haku/auto\\?koulutustyyppi=lk&order=desc&size=20&sort=score$')
    );
  });
});
