import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('oppilaitos', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'oppilaitos.mocks.json');
    await page.goto('/konfo/fi/oppilaitos/1.2.246.562.10.56753942459');
  });

  test('oppilaitos renders properly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Aalto-yliopisto');
    await expect(page.getByRole('heading', { name: 'Perustiedot' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Yhteystiedot' })).toBeVisible();
  });

  test('perustiedot renders properly', async ({ page }) => {
    await expect(page.getByLabel('paikkakunta')).toContainText('Helsinki');
    await expect(page.getByLabel('opiskelijoita')).toContainText('18000');
    await expect(page.getByLabel('opetuskielet')).toContainText(
      'ruotsi, suomi, englanti'
    );
  });

  test('some renders properly', async ({ page }) => {
    const verifySomeLink = async (id: number, url: string) =>
      await expect(
        page.locator(`div:nth-child(6) > div:nth-child(${id})`).getByRole('link')
      ).toHaveAttribute('href', url);
    await verifySomeLink(1, 'https://facebook.com/aaltouniversity');
    await verifySomeLink(2, 'https://www.linkedin.com/school/aalto-university/');
    await verifySomeLink(3, 'https://twitter.com/aaltouniversity');
    await verifySomeLink(4, 'https://instagram.com/aaltouniversity');
    await verifySomeLink(5, 'https://www.youtube.com/user/aaltouniversity');
    await verifySomeLink(6, 'https://www.aalto.fi/snapchat');
    await verifySomeLink(7, 'https://footube.com');
    await expect(page.getByLabel('https://blogs.aalto.fi/')).toBeVisible();
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Oppilaitoksen blogiAalto-yliopisto$/ })
        .getByLabel('https://www.aalto.fi/fi/')
    ).toBeVisible();
  });
});
