import { expect, test } from '@playwright/test';

import {
  fixtureFromFile,
  getSearchButton,
  getSearchInput,
  setupCommonTest,
} from './test-tools';

test.describe('Etusivu', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('Should have cards with working links', async ({ page }) => {
    await page.goto('/konfo');
    await page.locator('a[href*="/sivu/ammatillinen-koulutus"]').click();
    await expect(page.locator('h1')).toContainText('Ammatillinen koulutus');
  });

  test('Should have skip to content link hidden by default, and show it when pressing tab', async ({
    page,
  }) => {
    test.slow();
    await page.goto('/konfo');
    const siirrySisaltoonLink = page.getByRole('link', { name: 'Siirry sisältöön' });
    await expect(siirrySisaltoonLink).toHaveCSS('opacity', '0');
    await expect(siirrySisaltoonLink).not.toBeInViewport();
    // Täytyy odottaa ensin, että focus on resetoitu oikeaan elementtiin.
    // Jos tabia painetaan tätä ennen, ei fokus siirry "siirry sisältöön"-linkkiin
    await expect(page.locator('#focus-reset-target')).toBeFocused();
    await page.keyboard.press('Tab');
    // .toBeVisible()-assertio ei toimi luotettavasti tässä tilanteessa.
    // Liittyy mahdollisesti jotenkin tähän: https://github.com/testing-library/jest-dom/issues/209
    await expect(siirrySisaltoonLink).toHaveCSS('opacity', '1');
    await expect(siirrySisaltoonLink).toBeInViewport();
  });

  test('Should pass koulutustyyppi filter selection to haku page', async ({ page }) => {
    await page.route(
      '/konfo-backend/search/oppilaitokset**',
      fixtureFromFile('search-oppilaitokset-all.json')
    );

    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );

    await page.goto('/konfo');
    await getSearchInput(page).fill('auto');
    await page.getByRole('button', { name: /^Rajaa/ }).click();
    await page.getByTestId('valitse_koulutustyyppi').click();
    await page.getByRole('checkbox', { name: 'Lukiokoulutus' }).check();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await getSearchButton(page).click();
    await expect(page).toHaveURL(
      new RegExp('/konfo/fi/haku/auto\\?koulutustyyppi=lk&order=desc&size=20&sort=score$')
    );
  });
});
