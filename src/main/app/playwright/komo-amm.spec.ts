import { test, expect } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('KOMO amm', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komo-amm.mocks.json');
  });
  test('Amm KOMO renders properly with kuvaus and osaamistavoitteet', async ({
    page,
  }) => {
    await page.goto('/konfo/fi/koulutus/1.2.246.562.13.00000000000000000028');
    await expect(page.locator('h1')).toContainText('Liikunnanohjauksen perustutkinto');
    await expect(page.getByLabel('koulutustyyppi')).toHaveText('Ammatillinen tutkinto');
    await expect(page.getByText('180 osaamispistettä')).toBeVisible();
    const kuvausSection = page.getByLabel('Koulutuksen kuvaus');
    await expect(
      kuvausSection.getByRole('heading', {
        name: 'Työtehtäviä, joissa tutkinnon suorittanut voi toimia',
        exact: true,
      })
    ).toBeVisible();
    await expect(
      kuvausSection.getByText(
        'Liikuntaneuvojat työskentelevät liikunnan ohjaajina, liikuntaneuvojina, ryhmäliikunnan ohjaajina, kuntosaliohjaajina, uimavalvojina, soveltavan liikunnan ohjaajina, työhyvinvoinnin edistäjinä, valmentajina, iltapäivätoiminnan ohjaajina, liikunnallisten elämyspalvelujen ohjaajina ja tuottajina sekä personal trainereina. Tyypillisiä työympäristöjä ovat esimerkiksi kuntien liikuntatoimet, kuntokeskukset, uimahallit, urheiluseurat ja -järjestöt, urheiluopistot, yritykset ja muut liikuntapalveluja tuottavat organisaatiot. Liikuntaneuvoja voi toimia myös itsenäisenä ammatinharjoittajana.'
      )
    ).toBeVisible();
    const osaamistavoitteetSection = page.getByLabel('Koulutuksen osaamistavoitteet');
    await expect(
      osaamistavoitteetSection.getByText(
        'ohjaa liikuntaa turvallisesti erilaisille asiakkaille'
      )
    ).toBeVisible();
  });
});
