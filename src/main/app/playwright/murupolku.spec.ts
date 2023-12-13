import { Page, test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

const assertBreadcrumb = async (
  page: Page,
  {
    length,
    lastTextMatch,
    lastHrefMatch,
    hasHakutuloksetLink = false,
  }: {
    length: number;
    lastTextMatch?: string | RegExp;
    lastHrefMatch?: string | RegExp;
    hasHakutuloksetLink?: boolean;
  }
) => {
  const items = page
    .locator('#app-main-content')
    .getByRole('navigation', { name: 'Murupolku' })
    .locator('li');

  await expect(items).toHaveCount(length);

  const lastLink = items.last().getByRole('link');

  if (lastTextMatch) {
    await expect(lastLink).toContainText(lastTextMatch);
  }
  if (lastHrefMatch) {
    await expect(lastLink).toHaveAttribute('href', lastHrefMatch);
  }
  if (hasHakutuloksetLink) {
    await expect(items.nth(1)).toHaveText('Hakutulokset');
    await expect(items.nth(1).getByRole('link')).toHaveAttribute(
      'href',
      new RegExp('/konfo/fi/haku')
    );
  }
};

test.describe('Murupolku', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'murupolku.mocks.json');
  });

  test('Should show correct breadcrumb for a contentful page', async ({ page }) => {
    const url = '/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 4,
      lastTextMatch: /^Paikan vastaanotto ja/,
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: false,
    });
  });

  test('Should show correct breadcrumb for koulutus', async ({ page }) => {
    const url = '/konfo/fi/koulutus/1.2.246.562.13.00000000000000000570';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 3,
      lastTextMatch: 'Autoalan perustutkinto',
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for toteutus', async ({ page }) => {
    const url = '/konfo/fi/toteutus/1.2.246.562.17.00000000000000000404';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 4,
      lastTextMatch: 'PetteriT:n testitoteutus',
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for oppilaitos', async ({ page }) => {
    const url = '/konfo/fi/oppilaitos/1.2.246.562.10.56753942459';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 3,
      lastTextMatch: 'Aalto-yliopisto',
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for oppilaitoksen osa', async ({ page }) => {
    const url = '/konfo/fi/oppilaitososa/1.2.246.562.10.61042218794';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 4,
      lastTextMatch: 'Aalto-yliopisto, Kauppakorkeakoulu',
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for valintaperuste', async ({ page }) => {
    const url = '/konfo/fi/hakukohde/1.2.246.562.20.00000000000000000429/valintaperuste';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 5,
      lastTextMatch: 'valintaperuste',
      lastHrefMatch: new RegExp(url),
      hasHakutuloksetLink: true,
    });
  });
});
