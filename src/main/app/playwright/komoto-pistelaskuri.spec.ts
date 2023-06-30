import { Page, expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

const getKeskiarvoPalleroTulokset = (page: Page) =>
  page.locator('.keskiarvo__tulos__pallerot__textcontainer > :first-child');

test.describe('Pistelaskuri KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-pistelaskuri.mocks.json');
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000005700');
  });

  test('Pistelaskuri KOMOTO renders properly', async ({ page }) => {
    await expect(page.locator('.PisteContainer__infobox')).toHaveText(
      /^Edellisvuosien alin hyväksytty pistemäärä, jolla oppilaitokseen on päässyt opiskelemaan./
    );
    await expect(page.locator('#mui-component-select-hakukohde-select')).toHaveText(
      /^Lukion yleislinja/
    );
  });

  test('Shows keskiarvo dialog', async ({ page }) => {
    await page.locator('.PisteContainer__openbutton').click();
    await expect(page.locator('.KeskiarvoModal__container h2')).toHaveText(
      'Valintapistelaskuri'
    );
    await expect(page.locator('.KeskiarvoModal__container h3')).toHaveText(
      'Perusopetuksen keskiarvot'
    );
  });

  test('Shows keskiarvo, kouluaine and osalaskut remembering previous result', async ({
    page,
  }) => {
    const keskiarvoPalleroTulokset = getKeskiarvoPalleroTulokset(page);
    const keskiarvoOsalaskuTulokset = page.locator(
      '.keskiarvo__tulos__osalaskut__section .keskiarvo__tulos__textblock'
    );

    await page.locator('.PisteContainer__openbutton').click();
    await page.locator('.keskiarvo__laskuri__input').nth(0).fill('8');
    await page.locator('.keskiarvo__laskuri__input').nth(1).fill('9');
    await page.locator('.keskiarvo__laskuri__input').nth(2).fill('6');
    await page.locator('.Pistelaskuri__calculatebutton').click();
    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('8');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('18');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('16');

    //Shows compare button
    await expect(page.locator('.Pistelaskuri__calculatebutton')).toHaveText(
      'Vertaa pisteitä ja sulje laskuri'
    );

    //Shows result after filling kouluaine
    await page.locator('.Pistelaskuri__recalculatebutton').click();
    await page.locator('.KeskiarvoModal__container button').nth(0).click();
    await page
      .locator('.KeskiarvoModal__container .kouluaine__gradeselect')
      .nth(0)
      .click();
    await page.locator('.MuiPopover-root li').nth(1).click();
    await page.locator('.Pistelaskuri__calculatebutton').click();
    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('10');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('24');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('22');

    // Shows osalaskut
    await expect(keskiarvoOsalaskuTulokset.nth(0)).toContainText('16 / 16');
    await expect(keskiarvoOsalaskuTulokset.nth(1)).toContainText('0 / 8');
    await expect(keskiarvoOsalaskuTulokset.nth(2)).toContainText('6 / 6');
    await expect(keskiarvoOsalaskuTulokset.nth(3)).toContainText('2');

    // Remembers previous result
    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('10');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('24');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('22');

    // Removes previous result
    await page.locator('.Pistelaskuri__calculatebutton').click();
    await page.locator('.PisteContainer__purifybutton').click();
    await page.locator('.PisteContainer__openbutton').click();
    await expect(page.locator('.KeskiarvoModal__container h2')).toHaveText(
      'Valintapistelaskuri'
    );
    await expect(page.locator('.KeskiarvoModal__container h3')).toHaveText(
      'Perusopetuksen keskiarvot'
    );
    await expect(page.locator('.keskiarvo__tulos__pallerot__pallero')).toBeHidden();
  });

  test('Shows result without suoritettu checked', async ({ page }) => {
    const keskiarvoPalleroTulokset = getKeskiarvoPalleroTulokset(page);

    await page.locator('.PisteContainer__openbutton').click();
    await page.locator('.keskiarvo__laskuri__input').nth(0).fill('8');
    await page.locator('.keskiarvo__laskuri__input').nth(1).fill('9');
    await page.locator('.keskiarvo__laskuri__input').nth(2).fill('6');
    await page.locator('.MuiCheckbox-root input').click();
    await page.locator('.Pistelaskuri__calculatebutton').click();
    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('8');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('12');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('10');
  });
});
