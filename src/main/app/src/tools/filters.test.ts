import produce from 'immer';
import { set, flow, mapValues } from 'lodash';

import { RAJAIN_TYPES } from '#/src/constants';
import {
  HAKUTULOS_INITIAL,
  HAKU_RAJAIMET_INITIAL,
} from '#/src/store/reducers/hakutulosSlice';
import { CheckboxRajainItem } from '#/src/types/SuodatinTypes';

import { getRajainValueInUIFormat, getStateChangesForCheckboxRajaimet } from './filters';

const fpSet = (x: Record<string, any>, path: string, value: any) =>
  produce(x, (draft) => {
    set(draft, path, value);
  });

const a = RAJAIN_TYPES.KOULUTUSTYYPPI;
const b = RAJAIN_TYPES.OPETUSKIELI;
const c = RAJAIN_TYPES.KOULUTUSALA;

// prettier-ignore
const baseValues: Array<CheckboxRajainItem> = [
  { id: 'a1', rajainId: a, checked: false, count: 0 },
  { id: 'a2', rajainId: a, checked: false, count: 0,
    alakoodit: [
      { id: 'a2.1', rajainId: a, checked: false, count: 0 },
      { id: 'a2.2', rajainId: a, checked: false, count: 0 },
    ],
  },
  // NOTE: Suodatinkoodihierarkiassa voi olla eri suodattimien arvoja sekaisin ylä + alakoodeina
  { id: 'b1', rajainId: b, checked: false, count: 0,
    alakoodit: [
      { id: 'c2.1', rajainId: c, checked: false, count: 0 },
      { id: 'c2.2', rajainId: c, checked: false, count: 0 },
    ],
  },
];

describe('hakutulosSuodattimet utils', () => {
  test.each([
    // Testataan ensin tyhjän listan valinnat + alakoodien valinta jos yläkoodi valitaan
    [baseValues, baseValues[0], { [a]: ['a1'] }],
    [baseValues, baseValues[1], { [a]: ['a2', 'a2.1', 'a2.2'] }],
    [baseValues, baseValues[1].alakoodit![0], { [a]: ['a2.1'] }],
    [baseValues, baseValues[2], { [b]: ['b1'], [c]: ['c2.1', 'c2.2'] }],
    [baseValues, baseValues[2].alakoodit![0], { [c]: ['c2.1'] }],

    // Testataan valinnan poisto + yläkoodin valinnan poisto kun alakoodi poistetaan
    [
      fpSet(baseValues, '[0].checked', true),
      fpSet(baseValues[0], 'checked', true),
      { [a]: [] },
    ],
    [
      flow(
        (x) => fpSet(x, '[1].checked', true),
        (x) => fpSet(x, '[1].alakoodit[0].checked', true),
        (x) => fpSet(x, '[1].alakoodit[1].checked', true)
      )(baseValues),
      fpSet(baseValues[1].alakoodit![0], 'checked', true),
      { [a]: ['a2.2'] },
    ],

    // Testataan yläkoodin valinnan asetus kun kaikki alakoodit tulee valituksi
    [
      fpSet(baseValues, '[1].alakoodit[1].checked', true),
      baseValues[1].alakoodit![0],
      { [a]: ['a2.2', 'a2.1', 'a2'] },
    ],
  ])('getStateChangesForCheckboxRajaimet', (values, item, expected) => {
    expect(
      getStateChangesForCheckboxRajaimet(values as Array<CheckboxRajainItem>)(
        item as CheckboxRajainItem
      )
    ).toEqual(expected);
  });

  test('getRajainValueInUIFormat orders alkamiskausi rajain items by id', () => {
    expect(
      getRajainValueInUIFormat(
        {
          ...mapValues(HAKUTULOS_INITIAL, (v) => (Array.isArray(v) ? {} : { count: 0 })),
          alkamiskausi: {
            henkilokohtainen: {
              count: 1,
              nimi: {
                fi: 'Aloituksesta sovitaan erikseen',
                sv: 'Inledningen bestäms individuellt',
                en: 'Start of studies decided individually',
              },
            },
            '2024-syksy': {
              count: 1,
              nimi: {
                fi: 'Koulutus alkaa syksyllä 2024',
                sv: 'Utbildningen börjar under hösten 2024',
                en: 'Study programme starts in autumn 2024',
              },
            },
            '2023-syksy': {
              count: 1,
              nimi: {
                fi: 'Koulutus alkaa syksyllä 2023',
                sv: 'Utbildningen börjar under hösten 2023',
                en: 'Study programme starts in autumn 2023',
              },
            },
            '2024-kevat': {
              count: 1,
              nimi: {
                fi: 'Koulutus alkaa keväällä 2024',
                sv: 'Utbildningen börjar under våren 2024',
                en: 'Study programme starts in spring 2024',
              },
            },
          },
        },
        HAKU_RAJAIMET_INITIAL,
        'alkamiskausi'
      ).map((item) => item.id)
    ).toEqual(['2023-syksy', '2024-kevat', '2024-syksy', 'henkilokohtainen']);
  });
});
