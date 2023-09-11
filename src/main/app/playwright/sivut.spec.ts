import { expect, test } from '@playwright/test';

import { setupCommonTest } from './test-tools';

test.describe('Sivut', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('Language change should be reflected in URL and page content', async ({
    page,
  }) => {
    await page.goto(
      '/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun'
    );

    await expect(
      page.getByRole('heading', {
        name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
      })
    ).toBeVisible();
    await page.getByRole('button', { name: /fi/i }).click();
    await page.getByRole('option', { name: /Byt språk till svenska/i }).click();

    await expect(
      page.getByRole('heading', {
        name: /mottagande av studieplats i gemensam ansökan och anmälning till högskolor/i,
      })
    ).toBeVisible();
    await page.waitForURL(
      '**/sv/sivu/mottagande-av-studieplats-i-gemensam-ansoekan-och-anmaelning-till-hoegskolor'
    );

    await page.goBack();

    await page.waitForURL(
      '**/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun'
    );
    await expect(
      page.getByRole('heading', {
        name: /paikan vastaanotto ja ilmoittautuminen korkeakouluun/i,
      })
    ).toBeVisible();
  });
});
