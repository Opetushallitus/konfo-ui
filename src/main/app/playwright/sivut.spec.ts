import { expect, Page, test } from '@playwright/test';

import { setupCommonTest } from './test-tools';

const getKeskiarvoPalleroTulokset = (page: Page) =>
  page.locator('.keskiarvo__tulos__pallerot__embeddedtextcontainer > :first-child');

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
    await page.getByRole('option', { name: /på svenska/i }).click();

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

  test('renders embedded Pistelaskuri', async ({ page }) => {
    await page.goto('/konfo/fi/sivu/pistelaskuritesti');
    await expect(page.locator('h3')).toHaveText('Perusopetuksen keskiarvot');

    await page.locator('.keskiarvo__laskuri__input').nth(0).fill('8');
    await page.locator('.keskiarvo__laskuri__input').nth(1).fill('9');
    await page.locator('.keskiarvo__laskuri__input').nth(2).fill('6');
    await page.locator('.MuiCheckbox-root input').click();

    await page.locator('.Pistelaskuri__calculatebutton').click();

    const keskiarvoPalleroTulokset = getKeskiarvoPalleroTulokset(page);

    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('8');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('12');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('10');

    // render correct buttons
    await expect(page.locator('.Pistelaskuri__recalculatebutton')).toBeHidden();
    await expect(page.locator('.Pistelaskuri__calculatebutton')).toHaveText(
      'Laske uudestaan'
    );

    // clear values
    await page.locator('.Pistelaskuri__clearbutton').click();
    await expect(page.locator('.keskiarvo__laskuri__input').nth(0)).toHaveValue('');
    await expect(page.locator('.keskiarvo__laskuri__input').nth(1)).toHaveValue('');
    await expect(page.locator('.keskiarvo__laskuri__input').nth(2)).toHaveValue('');
    await expect(page.locator('.MuiCheckbox-root input')).toBeChecked();
  });
});
