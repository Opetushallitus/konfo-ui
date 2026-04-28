import { identity } from 'lodash';
import { useTranslation } from 'react-i18next';
import { vi } from 'vitest';

import { Alkamiskausityyppi, KOULUTUS_TYYPPI, MAKSULLISUUSTYYPPI } from '#/src/constants';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Maksu, Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import {
  demoLinksPerLomakeId,
  formatAloitus,
  formatMaksullisuusText,
  formatMaksullisuusTitle,
} from './utils';

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
    expect(formatAloitus(input as any, identity as any)).toEqual(output);
  });
});

vi.mock('#/src/api/konfoApi', () => ({
  getHakuDemo: (hakuOid: string) => {
    switch (hakuOid) {
      case 'haku-demo-allowed-1':
      case 'haku-demo-allowed-2':
        return { demoAllowed: true };
      case 'haku-demo-not-allowed':
        return { demoAllowed: false };
    }
  },
}));

describe('demoLinksPerLomakeId', () => {
  const hakukohdeDemoNotAllowed = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-not-allowed',
    hakuOid: 'haku-demo-not-allowed',
    hakulomakeAtaruId: 'hakulomake-id-2',
    hakulomakeLinkki: {
      fi: 'linkki-suomeksi',
    },
  } as Hakukohde;

  const hakukohde1 = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-allowed-1',
    hakuOid: 'haku-demo-allowed-1',
    hakulomakeAtaruId: 'hakulomake-id-1',
    hakulomakeLinkki: {
      fi: 'linkki-suomeksi-1',
    },
  } as Hakukohde;

  const hakukohde2 = {
    isHakuAuki: false,
    hakukohdeOid: 'demo-allowed-2',
    hakuOid: 'haku-demo-allowed-2',
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

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('formatMaksullisuusTitle', () => {
  const { t } = useTranslation();
  it('should return "toteutus.maksullisuus" as a title when only maksullinen koulutus', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSULLINEN, maksunMaara: 250 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMKKOULUTUS)).toEqual(
      'toteutus.maksullisuus'
    );
  });

  it('should return "toteutus.maksullisuus" as a title when maksuton koulutus', () => {
    const maksut = [{ maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSUTON }];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMKKOULUTUS)).toEqual(
      'toteutus.maksullisuus'
    );
  });

  it('should return "toteutus.maksullisuus" as a title when maksut is empty', () => {
    const maksut = [] as Array<Maksu>;
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMKKOULUTUS)).toEqual(
      'toteutus.maksullisuus'
    );
  });

  it('should return "toteutus.maksullisuus" as a title when maksut is undefined', () => {
    const maksut = undefined;
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMKKOULUTUS)).toEqual(
      'toteutus.maksullisuus'
    );
  });

  it('should return "toteutus.lukuvuosimaksu-kk" as a title when amk-koulutus has lukuvuosimaksu', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 5000 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMKKOULUTUS)).toEqual(
      'toteutus.lukuvuosimaksu-kk'
    );
  });

  it('should return "toteutus.lukuvuosimaksu-kk" as a title when yo-koulutus has lukuvuosimaksu', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 4000 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS)).toEqual(
      'toteutus.lukuvuosimaksu-kk'
    );
  });

  it('should return "toteutus.maksullisuus" as a title when yo-koulutus is maksullinen', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSULLINEN, maksunMaara: 4000 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS)).toEqual(
      'toteutus.maksullisuus'
    );
  });

  it('should return "toteutus.lukuvuosimaksu" as a title when amm-koulutus has lukuvuosimaksu', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 500 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMM)).toEqual(
      'toteutus.lukuvuosimaksu'
    );
  });

  it('should return "toteutus.lukuvuosimaksu" as a title when lk-koulutus has lukuvuosimaksu', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 500 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.LUKIOKOULUTUS)).toEqual(
      'toteutus.lukuvuosimaksu'
    );
  });

  it('should return "toteutus.maksullisuus" as a title when amm-koulutus has both maksullinen opetus and lukuvuosimaksu', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 500 },
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSULLINEN, maksunMaara: 300 },
    ];
    expect(formatMaksullisuusTitle(t, maksut, KOULUTUS_TYYPPI.AMM)).toEqual(
      'toteutus.maksullisuus'
    );
  });
});

describe('formatMaksullisuusText', () => {
  const { t } = useTranslation();
  it('should return maksun määrä when only maksullinen', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSULLINEN, maksunMaara: 500 },
    ];
    expect(formatMaksullisuusText(t, maksut)).toEqual('500 €');
  });

  it('should return maksun määrä when only lukuvuosimaksullinen', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 1500 },
    ];
    expect(formatMaksullisuusText(t, maksut)).toEqual('1500 €');
  });

  it('should return text "Ei maksua" when maksuton toteutus', () => {
    const maksut = [{ maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSUTON }];
    expect(formatMaksullisuusText(t, maksut)).toEqual('toteutus.ei-maksua');
  });

  it('should return text "Ei maksua" when maksut is empty', () => {
    const maksut = [] as Array<Maksu>;
    expect(formatMaksullisuusText(t, maksut)).toEqual('toteutus.ei-maksua');
  });

  it('should return text "Ei maksua" when maksut is undefined', () => {
    const maksut = undefined;
    expect(formatMaksullisuusText(t, maksut)).toEqual('toteutus.ei-maksua');
  });

  it('should return text with both maksullinen opetus and lukuvuosimaksu when both are defined', () => {
    const maksut = [
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.MAKSULLINEN, maksunMaara: 450 },
      { maksullisuustyyppi: MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, maksunMaara: 1200 },
    ];
    expect(formatMaksullisuusText(t, maksut)).toEqual(
      `toteutus.maksullinen-opetus: 450 €\ntoteutus.lukuvuosimaksu: 1200 €`
    );
  });

  it('should return empty string when unknown maksullisuustyyppi', () => {
    const maksut = [
      { maksullisuustyyppi: 'ei-määritelty' as Maksullisuustyyppi, maksunMaara: 450 },
    ];
    expect(formatMaksullisuusText(t, maksut)).toEqual('');
  });
});
