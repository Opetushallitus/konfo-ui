import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { renderHook } from '#/src/test-utils';

import { useOppilaitosTarjontaRajainOrder } from './useOppilaitosTarjontaRajainOrder';

const LUKIO_RAJAIMET = ['lukiopainotukset', 'lukiolinjaterityinenkoulutustehtava'];

const getRajainIds = (
  rajainValues: Partial<RajainValues>,
  rajainOptions: Record<string, any>
) =>
  renderHook(() =>
    useOppilaitosTarjontaRajainOrder({ rajainValues, rajainOptions })
  ).result.current.map((rajain) => rajain.id);

const optionsWithLukioCount = (count: number) => ({
  koulutustyyppi: { lk: { count }, amm: { count: 3 } },
});

describe('useOppilaitosTarjontaRajainOrder', () => {
  test('shows lukio rajaimet when oppilaitos has lukio tarjontaa and no koulutustyyppi is selected', () => {
    expect(getRajainIds({ koulutustyyppi: [] }, optionsWithLukioCount(2))).toEqual(
      expect.arrayContaining(LUKIO_RAJAIMET)
    );
  });

  test('hides lukio rajaimet when oppilaitos has no lukio tarjontaa', () => {
    const ids = getRajainIds({ koulutustyyppi: [] }, optionsWithLukioCount(0));
    LUKIO_RAJAIMET.forEach((id) => expect(ids).not.toContain(id));
  });

  test('hides lukio rajaimet when rajainOptions are not loaded yet', () => {
    const ids = getRajainIds({}, {});
    LUKIO_RAJAIMET.forEach((id) => expect(ids).not.toContain(id));
  });

  test('shows lukio rajaimet when lukio is selected', () => {
    expect(getRajainIds({ koulutustyyppi: ['lk'] }, optionsWithLukioCount(2))).toEqual(
      expect.arrayContaining(LUKIO_RAJAIMET)
    );
  });

  test('hides lukio rajaimet when only another koulutustyyppi is selected', () => {
    const ids = getRajainIds({ koulutustyyppi: ['amm'] }, optionsWithLukioCount(2));
    LUKIO_RAJAIMET.forEach((id) => expect(ids).not.toContain(id));
  });

  test('has no separate vaativan tuen rajain, because it is part of koulutustyyppi rajain', () => {
    const ids = getRajainIds(
      { koulutustyyppi: ['amm', 'tuva-erityisopetus'] },
      optionsWithLukioCount(2)
    );
    expect(ids).toContain('koulutustyyppi');
    expect(ids).not.toContain('vaativan-tuen-koulutukset');
  });

  describe('osaamisala', () => {
    const ammOptions = (ammCount: number, ammErityisopetusCount: number) => ({
      koulutustyyppi: {
        lk: { count: 0 },
        amm: {
          count: ammCount,
          alakoodit: {
            koulutustyyppi_26: { count: ammCount },
            'muu-amm-tutkinto': { count: 0 },
          },
        },
        'vaativan-tuen-koulutukset': {
          count: ammErityisopetusCount,
          alakoodit: {
            koulutustyyppi_4: { count: ammErityisopetusCount },
            'tuva-erityisopetus': { count: 0 },
          },
        },
      },
    });

    test('is shown when oppilaitos has ammatillista tarjontaa and no koulutustyyppi is selected', () => {
      expect(getRajainIds({ koulutustyyppi: [] }, ammOptions(2, 0))).toContain(
        'osaamisala'
      );
    });

    test('is shown when oppilaitos has only ammatillinen perustutkinto erityisopetuksena', () => {
      expect(getRajainIds({ koulutustyyppi: [] }, ammOptions(0, 1))).toContain(
        'osaamisala'
      );
    });

    test('is hidden when oppilaitos has no ammatillista tarjontaa', () => {
      expect(getRajainIds({ koulutustyyppi: [] }, ammOptions(0, 0))).not.toContain(
        'osaamisala'
      );
    });

    test.each([['amm'], ['koulutustyyppi_26'], ['koulutustyyppi_4']])(
      'is shown when %s is selected',
      (koulutustyyppi) => {
        expect(
          getRajainIds(
            { koulutustyyppi: [koulutustyyppi] as RajainValues['koulutustyyppi'] },
            ammOptions(2, 1)
          )
        ).toContain('osaamisala');
      }
    );

    test('is hidden when only another koulutustyyppi is selected', () => {
      expect(getRajainIds({ koulutustyyppi: ['lk'] }, ammOptions(2, 1))).not.toContain(
        'osaamisala'
      );
    });
  });

  describe('valintatapa', () => {
    const kkOptions = (yoCount: number, amkCount: number) => ({
      koulutustyyppi: {
        lk: { count: 1 },
        yo: {
          count: yoCount,
          alakoodit: { kandi: { count: yoCount }, maisteri: { count: 0 } },
        },
        amk: {
          count: amkCount,
          alakoodit: {
            'amk-alempi': { count: amkCount },
            'amm-ope-erityisope-ja-opo': { count: 0 },
          },
        },
      },
    });

    test.each([
      [1, 0],
      [0, 1],
    ])(
      'is shown when oppilaitos has korkeakoulutarjontaa (yo: %i, amk: %i) and no koulutustyyppi is selected',
      (yoCount, amkCount) => {
        expect(
          getRajainIds({ koulutustyyppi: [] }, kkOptions(yoCount, amkCount))
        ).toContain('valintatapa');
      }
    );

    test('is hidden when oppilaitos has no korkeakoulutarjontaa', () => {
      expect(getRajainIds({ koulutustyyppi: [] }, kkOptions(0, 0))).not.toContain(
        'valintatapa'
      );
    });

    test.each([
      ['yo'],
      ['amk'],
      ['kandi'],
      ['amk-alempi'],
      ['amm-ope-erityisope-ja-opo'],
    ])('is shown when %s is selected', (koulutustyyppi) => {
      expect(
        getRajainIds(
          { koulutustyyppi: [koulutustyyppi] as RajainValues['koulutustyyppi'] },
          kkOptions(1, 1)
        )
      ).toContain('valintatapa');
    });

    test('is hidden when only another koulutustyyppi is selected', () => {
      expect(getRajainIds({ koulutustyyppi: ['lk'] }, kkOptions(1, 1))).not.toContain(
        'valintatapa'
      );
    });
  });
});
