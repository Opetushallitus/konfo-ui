import { expect, test } from '@playwright/test';

import { mocksFromFile, setupCommonTest } from './test-tools';

test.describe('AMK KOMOTO', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setupCommonTest({ page, context, baseURL });
    await mocksFromFile(page, 'komoto-amk.mocks.json');
    await page.goto('/konfo/fi/toteutus/1.2.246.562.17.00000000000000002761');
  });

  test('AMK osaamistavoitteet text expands and truncates properly', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Musiikkipedagogi (AMK), Musiikkipedagogin tutkinto-ohjelma',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Koulutuksen Osaamistavoitteet' })
    ).toBeVisible();
    const osaamistavoitteetSection = page.getByLabel('Koulutuksen osaamistavoitteet');
    const osaamistavoitteetTextDiv = osaamistavoitteetSection.locator('div').nth(1);
    const truncatedText =
      'Tavoitteena on tuottaa sinulle opintosuuntasi mukaan painottuva korkeatasoinen ydinosaaminen: soittaminen, laulaminen, yhteismusisointi, säveltäminen, kuoronjohto, orkesterinjohto (puhallinorkesteri, sinfoniaorkesteri, teatterikapellimestari), musiikkiteknologia, musiikinteoria ja -historia sekä monipuolinen pedagoginen osaaminen. Ydinosaamistasi täydennät muilla musiikillisilla opinnoilla tai oman kiinnostuksesi mukaan monialaisilla opinnoilla.';
    await expect(osaamistavoitteetTextDiv).toHaveText(`${truncatedText} ...Näytä lisää`);
    const osaamistavoitekuvausNaytaLisaa = osaamistavoitteetSection.getByRole('button', {
      name: 'Näytä lisää',
    });
    await osaamistavoitekuvausNaytaLisaa.click();
    const wholeText =
      truncatedText +
      ' Musiikillisten ja pedagogisten taitojen lisäksi kehität kielten, viestinnän, taiteilijayrittäjyyden, työhyvinvoinnin sekä tutkimuksen ja kehittämisen osaamista. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a augue nec mauris porta cursus. Curabitur libero diam, hendrerit sit amet volutpat a, sagittis vel felis. Etiam commodo mi gravida faucibus dictum. Mauris vitae semper sem. Quisque ipsum odio, viverra a dignissim eu, scelerisque in erat. Duis non lorem aliquam, efficitur sapien non, dictum eros. Morbi ac sem lectus. Morbi vel fringilla diam. Proin viverra rutrum urna vitae volutpat. In et maximus libero, ut iaculis elit. Nullam nec sodales felis, id consequat tellus. Fusce placerat tortor sed varius luctus. Nunc maximus ligula justo, at cursus libero dapibus vel. Curabitur congue quis orci eget sodales.Näytä vähemmän';
    await expect(osaamistavoitteetTextDiv).toHaveText(wholeText);
    const osaamistavoitekuvausNaytaVahemman = osaamistavoitteetSection.getByRole(
      'button',
      {
        name: 'Näytä vähemmän',
      }
    );
    await osaamistavoitekuvausNaytaVahemman.click();
    await expect(osaamistavoitteetTextDiv).toHaveText(`${truncatedText} ...Näytä lisää`);
  });
});
