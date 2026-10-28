import { expect, Page, test } from '@playwright/test';

import { fixtureFromFile, setupCommonTest } from './test-tools';

const getKeskiarvoPalleroTulokset = (page: Page) =>
  page.locator('.keskiarvo__tulos__pallerot__embeddedtextcontainer > :first-child');

test.describe('Embedded pistelaskuri', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
  });
  test('calculates average and clears values', async ({ page }) => {
    await page.route(
      '/konfo-backend/search/hakukohteet**',
      fixtureFromFile('search-hakukohteet.json')
    );
    await page.route(
      '/konfo-backend/toteutus/1.2.3',
      fixtureFromFile('toteutus-alppilan-lukio.json')
    );

    await page.goto('/konfo/fi/sivu/pistelaskuritesti?haku=1.2.3.4');
    await expect(
      page.getByRole('heading', {
        name: 'Perusopetuksen keskiarvot',
        level: 2,
        exact: true,
      })
    ).toBeVisible();

    await page.locator('.keskiarvo__laskuri__input input').nth(0).fill('8');
    await page.locator('.keskiarvo__laskuri__input input').nth(1).fill('9');
    await page.locator('.keskiarvo__laskuri__input input').nth(2).fill('6');
    await page.locator('.MuiCheckbox-root input').click();
    await expect(page.getByText('Vertaa pisteitä hakukohteeseen')).toBeHidden();

    await page.locator('.Pistelaskuri__calculatebutton').click();

    const keskiarvoPalleroTulokset = getKeskiarvoPalleroTulokset(page);

    await expect(keskiarvoPalleroTulokset.nth(0)).toHaveText('8');
    await expect(keskiarvoPalleroTulokset.nth(1)).toHaveText('12');
    await expect(keskiarvoPalleroTulokset.nth(2)).toHaveText('10');

    // renders "vertaa hakukohteeseen" elements
    await expect(page.getByText('Vertaa pisteitä hakukohteeseen')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Vertaa pisteitä hakukohteeseen', level: 3 })
    ).toBeVisible();
    await page.getByLabel('Etsi hakukohteita').fill('lukio');
    await expect(page.locator('.MuiAutocomplete-popper')).toHaveText(
      'Lukion yleislinja, Alppilan lukio, Alppilan lukio, Helsinki'
    );
    await page.locator('.MuiAutocomplete-popper').nth(0).click();
    await expect(page.getByText('sisäänpääsyn alin keskiarvo')).toBeVisible();

    // render correct buttons
    await expect(page.locator('.Pistelaskuri__recalculatebutton')).toBeHidden();
    await expect(page.locator('.Pistelaskuri__calculatebutton')).toHaveText(
      'Laske uudestaan'
    );

    // clear values
    await page.locator('.Pistelaskuri__clearbutton').click();
    await expect(page.locator('.keskiarvo__laskuri__input input').nth(0)).toHaveValue('');
    await expect(page.locator('.keskiarvo__laskuri__input input').nth(1)).toHaveValue('');
    await expect(page.locator('.keskiarvo__laskuri__input input').nth(2)).toHaveValue('');
    await expect(page.locator('.MuiCheckbox-root input')).toBeChecked();
    await expect(page.getByText('Vertaa pisteitä hakukohteeseen')).toBeHidden();
  });
  test('calculates average with weighting', async ({ page }) => {
    await page.goto('/konfo/fi/sivu/pistelaskuritesti');

    await expect(
      page.getByRole('heading', {
        name: 'Perusopetuksen keskiarvot',
        level: 2,
        exact: true,
      })
    ).toBeVisible();
    await page.locator('.keskiarvo__laskuri__changecalcbutton').click();
    await expect(
      page.getByRole('heading', {
        name: 'Perusopetuksen arvosanat',
        level: 2,
        exact: true,
      })
    ).toBeVisible();

    const aidinkieliInput = page.getByTestId('kouluaineinput__kouluaineet.aidinkieli');
    await aidinkieliInput.locator('.kouluaine__gradeselect').click();
    await page.locator('.MuiList-root').getByRole('option', { name: '10' }).click();
    await aidinkieliInput.locator('.keskiarvo__ainelaskuri__painokerroin__add').click();
    await aidinkieliInput
      .locator('.keskiarvo__ainelaskuri__painokerroin__input input')
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
  test('average inputs are accessible', async ({ page }) => {
    await page.goto('/konfo/fi/sivu/pistelaskuritesti');

    for (const label of [
      'Lukuaineiden keskiarvo *',
      'Taide- ja taitoaineiden keskiarvo *',
      'Kaikkien aineiden keskiarvo *',
    ]) {
      const input = page.getByLabel(label, { exact: true });
      await expect(input).toHaveAttribute('required');
      await expect(input).not.toHaveAttribute('placeholder');
      await expect(input).toHaveAccessibleDescription('Esim. 8,4');
    }
    await expect(
      page.getByText('Tähdellä (*) merkityt kentät ovat pakollisia.')
    ).toBeVisible();

    const lukuaineet = page.getByLabel('Lukuaineiden keskiarvo *', { exact: true });
    await lukuaineet.fill('11');
    await expect(lukuaineet).toHaveAttribute('aria-invalid', 'true');
    await expect(lukuaineet).toHaveAccessibleDescription(
      /Esim\. 8,4.*Syötä keskiarvo väliltä 4-10/s
    );
  });
  test('info tooltip can be used with keyboard', async ({ page }) => {
    await page.goto('/konfo/fi/sivu/pistelaskuritesti');

    await page.getByLabel('Lukuaineiden keskiarvo *', { exact: true }).focus();
    await page.keyboard.press('Tab');
    const infoButton = page.getByRole('button', { name: 'Näytä lisätiedot' });
    await expect(infoButton).toBeFocused();
    await expect(infoButton).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Enter');
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(infoButton).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sulje', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tooltip')).toBeHidden();
    await expect(infoButton).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toBeHidden();
    await expect(infoButton).toBeFocused();
  });
});
