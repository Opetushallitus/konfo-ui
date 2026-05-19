import { Page, test, expect } from '@playwright/test';
import { isNumber } from 'lodash';

import { mocksFromFile, setupCommonTest } from './test-tools';

const assertBreadcrumb = async (
  page: Page,
  {
    length,
    linkCount,
    lastTextMatch,
    hasHakutuloksetLink = false,
  }: {
    length: number;
    linkCount?: number;
    lastTextMatch?: string | RegExp;
    hasHakutuloksetLink?: boolean;
  }
) => {
  const items = page
    .locator('#app-main-content')
    .getByRole('navigation', { name: 'Murupolku' })
    .locator('li');

  await expect(items).toHaveCount(length);
  if (isNumber(linkCount)) {
    await expect(items.getByRole('link')).toHaveCount(linkCount);
  }

  if (lastTextMatch) {
    await expect(items.last()).toContainText(lastTextMatch);
  }
  await expect(items.last().getByRole('link')).toHaveCount(0);
  await expect(items.last().locator('[aria-current="page"]')).toHaveCount(1);
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
      linkCount: 1,
      lastTextMatch: /^Paikan vastaanotto ja/,
      hasHakutuloksetLink: false,
    });
  });

  test('Should show correct breadcrumb for koulutus', async ({ page }) => {
    const url = '/konfo/fi/koulutus/1.2.246.562.13.00000000000000000570';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 3,
      lastTextMatch: 'Autoalan perustutkinto',
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for toteutus', async ({ page }) => {
    const url = '/konfo/fi/toteutus/1.2.246.562.17.00000000000000000404';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 4,
      linkCount: 3,
      lastTextMatch: 'PetteriT:n testitoteutus',
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for oppilaitos', async ({ page }) => {
    const url = '/konfo/fi/oppilaitos/1.2.246.562.10.56753942459';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 3,
      linkCount: 2,
      lastTextMatch: 'Aalto-yliopisto',
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for oppilaitoksen osa', async ({ page }) => {
    const url = '/konfo/fi/oppilaitososa/1.2.246.562.10.61042218794';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 4,
      linkCount: 3,
      lastTextMatch: 'Aalto-yliopisto, Kauppakorkeakoulu',
      hasHakutuloksetLink: true,
    });
  });

  test('Should show correct breadcrumb for valintaperuste', async ({ page }) => {
    const url = '/konfo/fi/hakukohde/1.2.246.562.20.00000000000000000429/valintaperuste';
    await page.goto(url);

    await assertBreadcrumb(page, {
      length: 5,
      linkCount: 4,
      lastTextMatch: 'valintaperuste',
      hasHakutuloksetLink: true,
    });
  });
});
