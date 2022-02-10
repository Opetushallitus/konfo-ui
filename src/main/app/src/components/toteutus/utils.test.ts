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
      case 'demo-allowed-1':
      case 'demo-allowed-2':
        return { demoAllowed: true };
      case 'demo-not-allowed':
        return { demoAllowed: false };
    }
  },
}));

describe('demoLinksPerLomakeId', () => {
  const hakukohdeDemoNotAllowed = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-not-allowed',
    hakulomakeAtaruId: 'hakulomake-id-2',
    hakulomakeLinkki: {
      fi: 'linkki-suomeksi',
    },
  } as Hakukohde;

  const hakukohde1 = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-allowed-1',
    hakulomakeAtaruId: 'hakulomake-id-1',
    hakulomakeLinkki: {
      fi: 'linkki-suomeksi-1',
    },
  } as Hakukohde;

  const hakukohde2 = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-allowed-2',
    hakulomakeAtaruId: 'hakulomake-id-1',
    hakulomakeLinkki: {
      fi: 'linkki-suomeksi-2',
    },
  } as Hakukohde;

  it('no demo link is generated if haku is open', async () => {
    const hakukohde = {
      isHakuAuki: true,
    } as Hakukohde;
    const hakukohteet = [hakukohde];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.size).toBe(0);
  });

  it('no demo link is generated if haku is closed and demo is not allowed', async () => {
    const hakukohteet = [hakukohdeDemoNotAllowed];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id-2')).toBe(undefined);
  });

  it('demo link is generated if haku is closed and demo is allowed', async () => {
    const hakukohteet = [hakukohde1];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id-1')?.get('demo-allowed-1')).toEqual({
      fi: 'linkki-suomeksi-1?demo=true',
      sv: undefined,
      en: undefined,
    });
  });

  it('demo link is generated for all hakukohdes', async () => {
    const hakukohteet = [hakukohde1, hakukohde2];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id-1')?.get('demo-allowed-1')).toEqual({
      fi: 'linkki-suomeksi-1?demo=true',
      sv: undefined,
      en: undefined,
    });
    expect(demoLinks.get('hakulomake-id-1')?.get('demo-allowed-2')).toEqual({
      fi: 'linkki-suomeksi-2?demo=true',
      sv: undefined,
      en: undefined,
    });
  });

  it('demo link is allowed to some hakukohdes', async () => {
    const hakukohteet = [hakukohde1, hakukohde2, hakukohdeDemoNotAllowed];
    const demoLinks = await demoLinksPerLomakeId(hakukohteet);
    expect(demoLinks.get('hakulomake-id-1')?.get('demo-allowed-1')).toEqual({
      fi: 'linkki-suomeksi-1?demo=true',
      sv: undefined,
      en: undefined,
    });
    expect(demoLinks.get('hakulomake-id-1')?.get('demo-allowed-2')).toEqual({
      fi: 'linkki-suomeksi-2?demo=true',
      sv: undefined,
      en: undefined,
    });
    expect(demoLinks.get('hakulomake-id-2')).toBe(undefined);
  });
});
