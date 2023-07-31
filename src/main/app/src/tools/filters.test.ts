import produce from 'immer';
import { set, flow } from 'lodash';

import { getStateChangesForCheckboxRajaimet } from './filters';
import { CheckboxRajainItem } from '../types/SuodatinTypes';

const fpSet = (x: Record<string, any>, path: string, value: any) =>
  produce(x, (draft) => {
    set(draft, path, value);
  });

// prettier-ignore
const baseValues = [
  { id: 'a1', rajainId: 'a', checked: false, count: 0 },
  { id: 'a2', rajainId: 'a', checked: false, count: 0,
    alakoodit: [
      { id: 'a2.1', rajainId: 'a', checked: false, count: 0 },
      { id: 'a2.2', rajainId: 'a', checked: false, count: 0 },
    ],
  },
  // NOTE: Suodatinkoodihierarkiassa voi olla eri suodattimien arvoja sekaisin ylä + alakoodeina
  { id: 'b1', rajainId: 'b', checked: false, count: 0,
    alakoodit: [
      { id: 'c2.1', rajainId: 'c', checked: false, count: 0 },
      { id: 'c2.2', rajainId: 'c', checked: false, count: 0 },
    ],
  },
] as Array<CheckboxRajainItem>;

describe('hakutulosSuodattimet utils', () => {
  test.each([
    // Testataan ensin tyhjän listan valinnat + alakoodien valinta jos yläkoodi valitaan
    [baseValues, baseValues[0], { a: ['a1'] }],
    [baseValues, baseValues[1], { a: ['a2', 'a2.1', 'a2.2'] }],
    [baseValues, baseValues[1].alakoodit![0], { a: ['a2.1'] }],
    [baseValues, baseValues[2], { b: ['b1'], c: ['c2.1', 'c2.2'] }],
    [baseValues, baseValues[2].alakoodit![0], { c: ['c2.1'] }],

    // Testataan valinna poisto + yläkoodin valinnan poisto kun alakoodi poistetaan
    [
      fpSet(baseValues, '[0].checked', true),
      fpSet(baseValues[0], 'checked', true),
      { a: [] },
    ],
    [
      flow(
        (x) => fpSet(x, '[1].checked', true),
        (x) => fpSet(x, '[1].alakoodit[0].checked', true),
        (x) => fpSet(x, '[1].alakoodit[1].checked', true)
      )(baseValues),
      fpSet(baseValues[1].alakoodit![0], 'checked', true),
      { a: ['a2.2'] },
    ],

    // Testataan yläkoodin valinnan asetus kun kaikki alakoodit tulee valituksi
    [
      fpSet(baseValues, '[1].alakoodit[1].checked', true),
      baseValues[1].alakoodit![0],
      { a: ['a2.2', 'a2.1', 'a2'] },
    ],
  ])('getStateChangesForCheckboxRajaimet', (values, item, expected) => {
    expect(
      getStateChangesForCheckboxRajaimet(values as Array<CheckboxRajainItem>)(
        item as CheckboxRajainItem
      )
    ).toEqual(expected);
  });
});
