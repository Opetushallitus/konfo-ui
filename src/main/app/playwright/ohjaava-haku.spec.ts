import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('Ohjaava haku', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });

    await mocksFromFile(page, 'ohjaava-haku.mocks.json');
  });

  test('Should navigate to Ohjaava haku from button on haku page', async ({ page }) => {
    await page.goto('/konfo/fi/haku');
    await page.locator('a[href="/konfo/fi/ohjaava-haku"]').click();
    await expect(
      page.getByRole('heading', { name: 'En tiedä mitä haluaisin opiskella' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Käynnistä kysely' })).toBeEnabled();
  });

  test('Should navigate back and forth with Seuraava and Edellinen kysymys buttons', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/ohjaava-haku');
    await page.getByRole('button', { name: 'Käynnistä kysely' }).click();
    await expect(
      page.getByRole('heading', { name: 'Milloin voit opiskella?' })
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Yhdistetty päivä- ja iltaopetus sopii minulle.' })
      .click();
    await expect(page.getByRole('button', { name: 'Edellinen kysymys' })).toBeHidden();
    await page.getByRole('button', { name: 'Seuraava kysymys' }).click();
    await expect(
      page.getByRole('heading', { name: 'Miten paljon voit opiskella?' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Edellinen kysymys' }).click();
    await expect(
      page.getByRole('heading', { name: 'Milloin voit opiskella?' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Yhdistetty päivä- ja iltaopetus sopii minulle.' })
    ).toHaveAttribute('data-selected', 'true');
  });

  test('Should disable navigation buttons if there is an error in Koulutuksen kesto input', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/ohjaava-haku');
    await page.getByRole('button', { name: 'Käynnistä kysely' }).click();
    await page.getByRole('button', { name: 'Seuraava kysymys' }).click();
    await page.locator('#vahintaan-vuosi').fill('8');
    await expect(
      page.getByText(/Koulutuksen minimikeston tulee olla pienempi kuin maksimikeston./)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edellinen kysymys' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Seuraava kysymys' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Katso tulokset' })).toBeDisabled();
    await page.locator('#vahintaan-vuosi').fill('2');
    await expect(page.getByRole('button', { name: 'Edellinen kysymys' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Seuraava kysymys' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Katso tulokset' })).toBeEnabled();
  });

  test('Should fill the whole questionnaire and navigate to haku page with correct results', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/ohjaava-haku');
    await page.getByRole('button', { name: 'Käynnistä kysely' }).click();
    await page
      .getByRole('button', { name: 'Yhdistetty päivä- ja iltaopetus sopii minulle.' })
      .click();
    await page.getByRole('button', { name: 'Seuraava kysymys' }).click();

    const slider = page.locator('.MuiSlider-root');
    await slider.hover({ position: { x: 200, y: 0 } });
    await page.mouse.down();
    await page.mouse.up();
    const sliderInputVahintaan = slider.locator('input[data-index="0"]');
    const vahintaanValue = await sliderInputVahintaan.evaluate(
      (e) => (e as HTMLInputElement).value
    );
    const vahintaanVuosi = Math.floor(parseInt(vahintaanValue) / 12);
    await expect(page.locator('#vahintaan-vuosi')).toHaveValue(vahintaanVuosi.toString());
    const vahintaanKk = Math.floor(parseInt(vahintaanValue) % 12);
    await expect(page.locator('#vahintaan-kk')).toHaveValue(vahintaanKk.toString());

    await slider.hover({ position: { x: 600, y: 0 } });
    await page.mouse.down();
    await page.mouse.up();
    const sliderInputEnintaan = slider.locator('input[data-index="1"]');
    const enintaanValue = await sliderInputEnintaan.evaluate(
      (e) => (e as HTMLInputElement).value
    );
    const enintaanVuosi = Math.floor(parseInt(enintaanValue) / 12);
    await expect(page.locator('#enintaan-vuosi')).toHaveValue(enintaanVuosi.toString());
    const enintaanKk = Math.floor(parseInt(enintaanValue) % 12);
    await expect(page.locator('#enintaan-kk')).toHaveValue(enintaanKk.toString());

    await page.getByRole('button', { name: 'Seuraava kysymys' }).click();
    await expect(
      page.getByRole('heading', { name: 'Oletko valmis maksamaan koulutuksesta?' })
    ).toBeVisible();

    await page
      .getByRole('button', { name: 'Olen valmis maksamaan koulutuksesta.' })
      .click();

    await page.locator('#maksullinen-vahintaan').fill('1000');
    await page.locator('#maksullinen-enintaan').fill('10 000');
    await page.getByRole('button', { name: /voin maksaa lukuvuosimaksun./ }).click();
    await page.locator('#lukuvuosimaksu-vahintaan').fill('1000');
    await page.locator('#lukuvuosimaksu-enintaan').fill('10000');
    await page.getByRole('button', { name: 'Seuraava kysymys' }).click();

    await expect(
      page.getByRole('heading', { name: 'Milloin haluaisit aloittaa opiskelun?' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Koulutus alkaa keväällä 2024' }).click();
    await page.getByRole('button', { name: 'Katso tulokset' }).click();

    await expect(page).toHaveURL(
      'http://localhost:3005/konfo/fi/haku?alkamiskausi=2024-kevat&koulutuksenkestokuukausina_max=65&koulutuksenkestokuukausina_min=22&lukuvuosimaksunmaara_max=10000&lukuvuosimaksunmaara_min=1000&maksullisuustyyppi=lukuvuosimaksu,maksullinen&maksunmaara_max=10000&maksunmaara_min=1000&opetusaika=opetusaikakk_4&order=desc&size=20&sort=score'
    );

    await expect(page.getByTestId('chip-opetusaikakk_4')).toBeVisible();
    await expect(page.getByTestId('chip-koulutuksenkestokuukausina')).toBeVisible();
    await expect(page.getByTestId('chip-maksullinen')).toBeVisible();
    await expect(page.getByTestId('chip-lukuvuosimaksu')).toBeVisible();
    await expect(page.getByTestId('chip-maksunmaara')).toBeVisible();
    await expect(page.getByTestId('chip-lukuvuosimaksunmaara')).toBeVisible();
    await expect(page.getByTestId('chip-2024-kevat')).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Master of Engineering, Urban Sustainability, online studies',
      })
    ).toBeVisible();
  });
});
