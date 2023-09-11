import { devices, test } from '@playwright/test';

import { expectURLEndsWith, setupCommonTest } from './test-tools';

test.use({ ...devices['Galaxy S9+'] });

test.describe('Sivut (mobiili)', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('Language change should be reflected in URL and page content', async ({
    page,
  }) => {
    await page.goto(
      '/konfo/fi/sivu/paikan-vastaanotto-ja-ilmoittautuminen-korkeakouluun'
    );
    await page.getByRole('button', { name: /Avaa tai sulje valikko/i }).click();
    await page.getByRole('button', { name: /fi/i }).click();
    await page.getByRole('option', { name: /Byt språk till svenska/i }).click();

    await page.waitForURL(
      '**/sv/sivu/mottagande-av-studieplats-i-gemensam-ansoekan-och-anmaelning-till-hoegskolor'
    );
    await page
      .getByRole('menuitem', { name: 'Sökandes hälsa och funktionsförmåga' })
      .click();
    await expectURLEndsWith(page, '/sv/sivu/soekandes-haelsa-och-funktionsfoermaga');
  });
});
