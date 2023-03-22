import produce from 'immer';
import { set, flow } from 'lodash';

import { getFilterStateChanges } from './filters';

const fpSet = (x: Record<string, any>, path: string, value: any) =>
  produce(x, (draft) => {
    set(draft, path, value);
  });

// prettier-ignore
const baseValues = [
  { id: 'a1', filterId: 'a', checked: false, count: 0 },
  { id: 'a2', filterId: 'a', checked: false, count: 0,
    alakoodit: [
      { id: 'a2.1', filterId: 'a', checked: false, count: 0 },
      { id: 'a2.2', filterId: 'a', checked: false, count: 0 },
    ],
  },
  // NOTE: Suodatinkoodihierarkiassa voi olla eri suodattimien arvoja sekaisin ylä + alakoodeina
  { id: 'b1', filterId: 'b', checked: false, count: 0,
    alakoodit: [
      { id: 'c2.1', filterId: 'c', checked: false, count: 0 },
      { id: 'c2.2', filterId: 'c', checked: false, count: 0 },
    ],
  },
];

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
  ])('getFilterStateChanges', (values, item, expected) => {
    expect(getFilterStateChanges(values)(item)).toEqual(expected);
  });
});
