import { Alkamiskausityyppi } from '#/src/constants';
import { Hakukohde, HakukohdeOid } from '#/src/types/HakukohdeTypes';

import { demoLinksPerLomakeId, formatAloitus } from './utils';

describe('toteutus utils', () => {
  test.each([
    [
      {
        alkamiskausityyppi: Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
        henkilokohtaisenSuunnitelmanLisatiedot: 'lisatiedot',
      },
      {
        alkaaText: 'toteutus.koulutus-alkaa-henkilokohtainen',
        alkaaModalText: 'lisatiedot',
      },
    ],
  ])('formatAloitus', (input, output) => {
    expect(formatAloitus(input as any, (t: any) => t)).toEqual(output);
  });
});

jest.mock('#/src/api/konfoApi', () => ({
  getHakukohdeDemo: (hakukohdeOid: HakukohdeOid) => {
    switch (hakukohdeOid) {
      case 'demo-allowed':
        return { demoAllowed: true };
      case 'demo-not-allowed':
        return { demoAllowed: false };
    }
  },
}));

describe('demoLinksPerLomakeId', () => {
  it('no demo link is generated if haku is open', async () => {
    const hakukohde = {
      isHakuAuki: true,
    } as Hakukohde;
    const hakukohteet = [hakukohde];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.size).toBe(0);
  });

  it('no demo link is generated if haku is closed and demo is not allowed', async () => {
    const hakukohde = {
      isHakuAuki: false,
      hakukohdeOid: 'demo-not-allowed',
      hakulomakeAtaruId: 'hakulomake-id',
      hakulomakeLinkki: {
        fi: 'linkki-suomeksi',
      },
    } as Hakukohde;
    const hakukohteet = [hakukohde];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id')).toBe(undefined);
  });

  it('demo link is generated if haku is closed and demo is allowed', async () => {
    const hakukohde = {
      isHakuAuki: false,
      hakukohdeOid: 'demo-allowed',
      hakulomakeAtaruId: 'hakulomake-id',
      hakulomakeLinkki: {
        fi: 'linkki-suomeksi',
      },
    } as Hakukohde;
    const hakukohteet = [hakukohde];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id')).toEqual({
      hakukohdeOid: 'demo-allowed',
      link: {
        fi: 'linkki-suomeksi?demo=true',
        sv: undefined,
        en: undefined,
      },
    });
  });
});
