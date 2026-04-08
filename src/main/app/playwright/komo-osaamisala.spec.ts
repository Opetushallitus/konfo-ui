import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('KOMO osaamisala', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komo-osaamisala.mocks.json');
  });
  test('Osaamisala KOMO renders properly', async ({ page }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000623');
    await expect(page.locator('h1')).toContainText('Hevosten kengittämisen osaamisala');
    await expect(page.getByLabel('koulutustyyppi')).toHaveText('Osaamisala');
    await expect(page.getByText('100 osaamispistettä')).toBeVisible();
    const kuvausSection = page.getByLabel('Koulutuksen kuvaus');
    await expect(
      kuvausSection.getByRole('heading', {
        name: 'Työtehtäviä, joissa tutkinnon suorittanut voi toimia',
        exact: true,
      })
    ).toBeVisible();
    const osaamistavoitteetSection = page.getByLabel('Koulutuksen osaamistavoitteet');
    await expect(
      osaamistavoitteetSection.getByText(
        'Hevostalouden ammattitutkinnon suorittaneella on hevostalouden ammattityöntekijältä vaadittava osaaminen'
      )
    ).toBeVisible();
  });
});
