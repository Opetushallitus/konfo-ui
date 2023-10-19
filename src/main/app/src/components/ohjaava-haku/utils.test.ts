import { RajainItem } from '#/src/types/SuodatinTypes';

import {
  getChangedRajaimet,
  getChangedKestoInMonths,
  getYearsAndMonthsFromRangeValue,
  combineMaksunMaaraWithMaksullisuustyyppi,
} from './utils';

describe('getChangedRajaimet', () => {
  test('adds one rajain in selected rajaimet', () => {
    expect(getChangedRajaimet({}, 'opetusaika', 'opetusaikakk_2')).toEqual({
      opetusaika: ['opetusaikakk_2'],
    });
  });

  test('adds new rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetusaika',
        'opetusaikakk_3'
      )
    ).toEqual({ opetusaika: ['opetusaikakk_2', 'opetusaikakk_3'] });
  });

  test('adds rajain value to an existing rajain with empty rajain values array in selected rajaimet', () => {
    expect(
      getChangedRajaimet({ opetusaika: [] }, 'opetusaika', 'opetusaikakk_2')
    ).toEqual({ opetusaika: ['opetusaikakk_2'] });
  });

  test('adds new rajain to selected rajaimet which already has other values', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetustapa',
        'opetuspaikkakk_3'
      )
    ).toEqual({ opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] });
  });

  test('adds rajain value to already selected rajain in selected rajaimet with one other rajain', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] },
        'opetustapa',
        'opetuspaikkakk_1'
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1'],
    });
  });

  test('removes the only rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetusaika',
        'opetusaikakk_2'
      )
    ).toEqual({ opetusaika: [] });
  });

  test('removes rajain value from rajain with multiple rajain values', () => {
    expect(
      getChangedRajaimet(
        {
          opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
          opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1', 'opetuspaikkakk_5'],
        },
        'opetustapa',
        'opetuspaikkakk_1'
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_5'],
    });
  });
});

describe('getChangedKestoInMonths', () => {
  test('returns 0 when given one empty strings', () => {
    const vuodetAsStr = '';
    expect(getChangedKestoInMonths(vuodetAsStr, '')).toEqual(0);
  });

  test('returns 12 when given "1" year and an empty string for months', () => {
    expect(getChangedKestoInMonths('1', '')).toEqual(12);
  });

  test('returns 15 when given "1" year and "3" months as strings', () => {
    expect(getChangedKestoInMonths('1', '3')).toEqual(15);
  });

  test('returns 0 when given two empty strings for years and months', () => {
    expect(getChangedKestoInMonths('', '')).toEqual(0);
  });

  test('returns 5 when given non-numeric string for years and "5" for months', () => {
    expect(getChangedKestoInMonths('test', '5')).toEqual(5);
  });

  test('returns 29 when given decimal "2.2" for years and decimal "5.6" for months', () => {
    expect(getChangedKestoInMonths('2.2', '5.6')).toEqual(29);
  });

  test('removes spaces from input and returns 35 when given "2 " for years and "1 1" for months', () => {
    expect(getChangedKestoInMonths(' 2', '1 1')).toEqual(35);
  });
});

describe('getYearsAndMonthsFromRangeValues', () => {
  test('returns ["0", "0"] when range value is 0', () => {
    expect(getYearsAndMonthsFromRangeValue(0)).toEqual(['0', '0']);
  });

  test('returns "1" for years and "0" for months when range value is 12', () => {
    expect(getYearsAndMonthsFromRangeValue(12)).toEqual(['1', '0']);
  });

  test('returns "1" for years and "2" for months when range value is 14', () => {
    expect(getYearsAndMonthsFromRangeValue(14)).toEqual(['1', '2']);
  });

  test('returns "0" for years and "2" for months when range value is 2', () => {
    expect(getYearsAndMonthsFromRangeValue(2)).toEqual(['0', '2']);
  });
});

describe('combineMaksunMaaraWithMaksullisuustyyppi', () => {
  test('returns maksuton without maksun määrä', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });

  test('returns maksuton without maksun määrä and maksullinen with maksun määrä', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
      },
      {
        id: 'maksunmaara',
        rajainId: 'maksunmaara',
        count: 2484,
        upperLimit: 21000,
        min: 0,
        max: 0,
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
        linkedRajainItems: [
          {
            id: 'maksunmaara',
            rajainId: 'maksunmaara',
            count: 2484,
            upperLimit: 21000,
            min: 0,
            max: 0,
          },
        ],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });

  test('combines maksullinen with maksunmaara and lukuvuosimaksu with lukuvuosimaksunmaara', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
      },
      {
        id: 'lukuvuosimaksu',
        rajainId: 'maksullisuustyyppi',
        count: 485,
        checked: false,
        alakoodit: [],
        linkedIds: ['lukuvuosimaksunmaara', 'apuraha'],
      },
      {
        id: 'maksunmaara',
        rajainId: 'maksunmaara',
        count: 2484,
        upperLimit: 21000,
        min: 0,
        max: 0,
      },
      {
        id: 'lukuvuosimaksunmaara',
        rajainId: 'lukuvuosimaksunmaara',
        count: 485,
        upperLimit: 18000,
        min: 0,
        max: 0,
      },
      {
        id: 'apuraha',
        rajainId: 'apuraha',
        count: 485,
        checked: false,
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
        linkedRajainItems: [
          {
            id: 'maksunmaara',
            rajainId: 'maksunmaara',
            count: 2484,
            upperLimit: 21000,
            min: 0,
            max: 0,
          },
        ],
      },
      {
        id: 'lukuvuosimaksu',
        rajainId: 'maksullisuustyyppi',
        count: 485,
        checked: false,
        alakoodit: [],
        linkedIds: ['lukuvuosimaksunmaara', 'apuraha'],
        linkedRajainItems: [
          {
            id: 'lukuvuosimaksunmaara',
            rajainId: 'lukuvuosimaksunmaara',
            count: 485,
            upperLimit: 18000,
            min: 0,
            max: 0,
          },
        ],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });
});
