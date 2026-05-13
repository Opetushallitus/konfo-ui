import { vi } from 'vitest';

import { getLocalizedMaksullisuus } from './getLocalizedMaksullisuus';
import { KOULUTUS_TYYPPI, MAKSULLISUUSTYYPPI } from '../constants';

vi.mock('./localization.ts', async () => {
  const actual = await vi.importActual('./localization.ts');
  return {
    ...actual,
    getTranslationForKey: (key = '') => key,
  };
});

describe('getLocalizedMaksullisuus', () => {
  it('should return toteutus.maksuton when maksut is empty', () => {
    expect(
      getLocalizedMaksullisuus(KOULUTUS_TYYPPI.AMKKOULUTUS, [], undefined, undefined)
    ).toEqual('toteutus.maksuton');
  });

  it('should return toteutus.maksuton when opetus is maksuton', () => {
    expect(
      getLocalizedMaksullisuus(KOULUTUS_TYYPPI.AMKKOULUTUS, [MAKSULLISUUSTYYPPI.MAKSUTON])
    ).toEqual('toteutus.maksuton');
  });

  it('should return maksun maara for maksullinen toteutus', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMKKOULUTUS,
        [MAKSULLISUUSTYYPPI.MAKSULLINEN],
        250.5,
        undefined
      )
    ).toEqual(250.5);
  });

  it('should return empty string for maksullinen toteutus when maksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(KOULUTUS_TYYPPI.AMKKOULUTUS, [
        MAKSULLISUUSTYYPPI.MAKSULLINEN,
      ])
    ).toEqual('');
  });

  it('should return lukuvuosimaksun maara for lukuvuosimaksullinen amm-toteutus', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMM,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU],
        undefined,
        1250
      )
    ).toEqual(1250);
  });

  it('should return empty string for lukuvuosimaksullinen amm-toteutus when lukuvuosimaksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(KOULUTUS_TYYPPI.AMM, [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU])
    ).toEqual('');
  });

  it('should return toteutus.lukuvuosimaksu-kk for lukuvuosimaksullinen amk-toteutus', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMKKOULUTUS,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU],
        undefined,
        1250
      )
    ).toEqual('toteutus.lukuvuosimaksu-kk: 1250');
  });

  it('should return empty string for lukuvuosimaksullinen amk-toteutus when lukuvuosimaksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(KOULUTUS_TYYPPI.AMKKOULUTUS, [
        MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU,
      ])
    ).toEqual('');
  });

  it('should return amounts for both maksullinen opetus and lukuvuosimaksu when both are defined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMM,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        300,
        500
      )
    ).toEqual('toteutus.maksullinen-opetus: 300 €\ntoteutus.lukuvuosimaksu: 500 €');
  });

  it('should return amounts for both maksullinen opetus and lukuvuosimaksu even for amk-koulutus when both are defined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMKKOULUTUS,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        300,
        500
      )
    ).toEqual('toteutus.maksullinen-opetus: 300 €\ntoteutus.lukuvuosimaksu: 500 €');
  });

  it('should return only lukuvuosimaksun maara when maksuAmount is undefined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMM,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        undefined,
        500
      )
    ).toEqual(500);
  });

  it('should return only maksun maara when lukuvuosimaksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMM,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        230,
        undefined
      )
    ).toEqual(230);
  });

  it('should return toteutus.lukuvuosimaksu-kk for lukuvuosimaksullinen amk-toteutus when maksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMKKOULUTUS,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        undefined,
        500
      )
    ).toEqual('toteutus.lukuvuosimaksu-kk: 500');
  });

  it('should return only maksun maara for kk-toteutus when lukuvuosimaksun maara is undefined', () => {
    expect(
      getLocalizedMaksullisuus(
        KOULUTUS_TYYPPI.AMKKOULUTUS,
        [MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU, MAKSULLISUUSTYYPPI.MAKSULLINEN],
        230,
        undefined
      )
    ).toEqual(230);
  });
});
