import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Osaamisalan kuvaus KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-osaamisala-kuvaus.mocks.json');
  });
  test('KOMOTO includes osaamisala description', async ({ page }) => {
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000437');

    await expect(page.getByRole('heading', { name: 'Osaamisalat' })).toBeVisible();
    await page.getByRole('button', { name: 'Koirahieronnan osaamisala' }).click();

    const region = page.getByRole('region', { name: 'Koirahieronnan osaamisala' });

    await expect(
      region.getByText(
        'Koirahieronnan osaamisalan suorittanut voi toimia itsenäisenä yrittäjänä tai työntekijänä koirahierontapalveluja tarjoavassa yrityksessä. Hän osaa toteuttaa koirien hieronnan laatimiensa hierontasuunnitelmien mukaisesti ja antaa tarvittavat jatko-ohjeet koirien omistajille tai ohjaajille. Lisäksi hän osaa toimia yrityksen asiakaspalvelutehtävissä ja opastaa asiakkaita eläinten hoitoon liittyvissä kysymyksissä.'
      )
    ).toBeVisible();
    await expect(
      region.getByText(
        'Valinnainen tutkinnon osa Eläinalan yritystoiminta valmistaa häntä toimimaan alan yrittäjänä.'
      )
    ).toBeVisible();
  });

  test('KOMOTO: on empty or missing osaamisala description fallback text should be displayed', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000000466');

    await expect(page.getByRole('heading', { name: 'Osaamisalat' })).toBeVisible();
    await page.getByRole('button', { name: 'Kuljetuspalvelujen osaamisala' }).click();
    await expect(
      page
        .getByRole('region', { name: 'Kuljetuspalvelujen osaamisala' })
        .getByText('Osaamisalalle ei löytynyt kuvausta.')
    ).toBeVisible();
  });
});
