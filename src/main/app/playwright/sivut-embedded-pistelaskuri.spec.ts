import { expect, Page, test } from '@playwright/test';

import { setupCommonTest } from './test-tools';

const getKeskiarvoPalleroTulokset = (page: Page) =>
  page.locator('.keskiarvo__tulos__pallerot__embeddedtextcontainer > :first-child');

test.describe('Embedded pistelaskuri', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('calculates average and clears values', async ({ page }) => {
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
  test('calculates average with weighting', async ({ page }) => {
    await page.goto('/konfo/fi/sivu/pistelaskuritesti');

    await expect(page.locator('h3')).toHaveText('Perusopetuksen keskiarvot');
    await page.locator('.keskiarvo__laskuri__changecalcbutton').click();
    await expect(page.locator('h3')).toHaveText('Perusopetuksen arvosanat');

    const aidinkieliInput = page.getByTestId('kouluaineinput__kouluaineet.aidinkieli');
    await aidinkieliInput.locator('.kouluaine__gradeselect').click();
    await page.locator('.MuiList-root').getByRole('option', { name: '10' }).click();
    await aidinkieliInput.locator('.keskiarvo__ainelaskuri__painokerroin__add').click();
    await aidinkieliInput
      .locator('.keskiarvo__ainelaskuri__painokerroin__input')
      .fill('2');

    const matematiikkaInput = page.getByTestId(
      'kouluaineinput__kouluaineet.matematiikka'
    );
    await matematiikkaInput.locator('.kouluaine__gradeselect').click();
    await page.locator('.MuiList-root').getByRole('option', { name: '7' }).click();

    await page.locator('.Pistelaskuri__calculatebutton').click();

    const keskiarvoPalleroTulokset = getKeskiarvoPalleroTulokset(page);

    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('8,5');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('9');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('21');
    await expect(keskiarvoPalleroTulokset.nth(3)).toHaveText('19');
  });
});
