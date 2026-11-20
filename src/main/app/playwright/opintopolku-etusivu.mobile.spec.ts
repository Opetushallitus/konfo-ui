import { devices, expect, test } from '@playwright/test';

import {
  expectURLEndsWith,
  fixtureFromFile,
  getSearchButton,
  getSearchInput,
  setupCommonTest,
} from './test-tools';

test.use({ ...devices['Galaxy S9+'] });

const ETUSIVU_URL = '/konfo/fi/etusivu';

test.describe('Opintopolun etusivu (mobiili)', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await page.route(
      '/konfo-backend/search/oppilaitokset**',
      fixtureFromFile('search-oppilaitokset-all.json')
    );
    await page.route(
      '/konfo-backend/search/koulutukset**',
      fixtureFromFile('search-koulutukset-all.json')
    );
  });

  test('Should render hero with mobile image', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Opintopolku');
    // Selain valitsee kuvan <picture>-elementin <source>-ehdon perusteella (currentSrc)
    const heroImage = page.locator('.hero-image img');
    await expect
      .poll(() => heroImage.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/herokuva_opintopolku_etusivu_mobiili\.svg$/);
  });

  test('Should search with keyword using icon search button', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await getSearchInput(page).fill('auto');
    // Kapealla näytöllä hakupainike on pelkkä kuvake hakukentän sisällä
    await getSearchButton(page).click();
    await expectURLEndsWith(page, '/konfo/fi/haku/auto?order=desc&size=20&sort=score');
  });

  test('Should navigate to haku page with "Näytä kaikki" link', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    await page
      .getByRole('link', { name: 'Näytä kaikki koulutukset ja oppilaitokset' })
      .click();
    await expect(page).toHaveURL(/\/konfo\/fi\/haku(\?.*)?$/);
  });

  test('Should pass koulutustyyppi filter selection from drawer to haku page', async ({
    page,
  }) => {
    await page.goto(ETUSIVU_URL);
    await page.getByRole('button', { name: /^Rajaa etsimääsi/ }).click();

    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    await drawer.getByRole('button', { name: /^Koulutustyyppi/ }).click();
    await drawer.getByRole('checkbox', { name: 'Lukiokoulutukset', exact: true }).check();
    await expect(drawer.getByRole('button', { name: 'Poista valitut' })).toBeVisible();
    await drawer.getByRole('button', { name: /^Näytä \d+ hakutulos/ }).click();

    await expect(drawer).toBeHidden();
    await expectURLEndsWith(
      page,
      '/konfo/fi/haku?koulutustyyppi=lk&order=desc&size=20&sort=score'
    );
  });

  test('Should show nostot in a single column', async ({ page }) => {
    await page.goto(ETUSIVU_URL);
    const hakeutuminen = page.getByRole('link', { name: /^Hakeutuminen koulutukseen/ });
    const kielitutkinnot = page.getByRole('link', { name: /^Kielitutkinnot/ });
    const tunnustaminen = page.getByRole('link', { name: /^Tutkintojen tunnustaminen/ });
    await expect(tunnustaminen).toBeVisible();

    const boxes = await Promise.all(
      [hakeutuminen, kielitutkinnot, tunnustaminen].map((l) => l.boundingBox())
    );
    // Kaikki samassa sarakkeessa allekkain. Linkki on vain laatikon keskitetty otsikko, joten verrataan keskikohtia.
    const centerX = (box: { x: number; width: number }) => box.x + box.width / 2;
    for (let i = 1; i < boxes.length; i++) {
      expect(centerX(boxes[i]!)).toBeCloseTo(centerX(boxes[0]!), 0);
      expect(boxes[i]!.y).toBeGreaterThan(boxes[i - 1]!.y + boxes[i - 1]!.height - 1);
    }
  });
});
